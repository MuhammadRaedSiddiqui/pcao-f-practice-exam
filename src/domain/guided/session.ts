import { isExactSet } from '../attemptModel';
import { reportHash } from '../cloudReports';
import { validateReportSource } from './source';
import { productionCatalog, type GuideCatalog } from './catalog';
import { validateFrozenItem } from './loader';
import { resolveEligibility, selectPracticeSet } from './selectors';
import { guidedSessionSchema, guidedCommandSchema, timestampSchema, LIMITS, withinJsonLimit,
  type GuidedSession, type GuidedCommand, type GuidedResponse, type GuidedItem, type GuidedReviewFilter, type GuidedOrigin } from './schema';
import { frozenCopy, failure, type GuidedResult } from './errors';

declare const validatedSession: unique symbol;
// Only a validated creation/recovery or transition returns this type; the brand is never persisted.
export type ValidatedGuidedSession = GuidedSession & { readonly [validatedSession]: true };
type Access = Extract<GuidedOrigin, { kind: 'post-exam' }>['access'];
export type StartRequest = { id: string; now: number } & (
  { kind: 'standalone'; bank: unknown; difficulty: 'intermediate' | 'advanced'; selectionSize: 5 | 10; setIndex: number } |
  { kind: 'post-exam'; report: unknown; filter?: GuidedReviewFilter; access: Access });

export async function validateGuidedSession(input: unknown, catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<ValidatedGuidedSession>> {
  if (!withinJsonLimit(input, LIMITS.sessionBytes)) return failure('resource-limit');
  if (input && typeof input === 'object' && 'schemaVersion' in input && input.schemaVersion !== 1) return failure('unsupported-version');
  const parsed = guidedSessionSchema.safeParse(input);
  if (!parsed.success) return failure('invalid-session');
  const session = parsed.data;
  for (const item of session.items) {
    const valid = await validateFrozenItem(item, session.source, session.guideVersion, catalog);
    if (!valid.ok) return valid;
  }
  return { ok: true, value: frozenCopy(session) as ValidatedGuidedSession };
}

export async function startSession(request: StartRequest, release: unknown,
  catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<ValidatedGuidedSession>> {
  const coverage = await resolveEligibility(request, release, catalog);
  if (!coverage.ok) return coverage;
  let items = coverage.value.items;
  let origin: GuidedOrigin;
  if (request.kind === 'standalone') {
    const set = selectPracticeSet(coverage.value, request.selectionSize, request.setIndex);
    if (!set.ok) return set;
    items = set.value;
    origin = { kind: 'standalone', selectionSize: request.selectionSize, setIndex: request.setIndex };
  } else {
    const source = validateReportSource(request.report, catalog);
    if (!source.ok) return source;
    // Existing report hash binds the origin report only; it is never used as q1.
    let hash: string;
    try { hash = await reportHash(source.value.report); }
    catch { return failure('invalid-source'); }
    origin = { kind: 'post-exam', sourceAttemptId: source.value.report.id, sourceReportHash: hash,
      filter: request.filter ?? 'incorrect-unanswered', access: request.access };
  }
  if (!items.length) return failure('unavailable');
  return validateGuidedSession({ schemaVersion: 1, id: request.id, revision: 0, origin,
    source: coverage.value.source, guideVersion: coverage.value.guideVersion, status: 'in-progress',
    startedAt: request.now, updatedAt: request.now, completedAt: null, currentIndex: 0, items,
    responses: Object.fromEntries(items.map(i => [i.question.id, { selectedOptionIds: [], maxHintRevealed: 0, commitment: null }])),
  }, catalog);
}

export function canCommit(item: GuidedItem, response: GuidedResponse): boolean {
  return !response.commitment && response.selectedOptionIds.length === item.question.selectionCount &&
    new Set(response.selectedOptionIds).size === response.selectedOptionIds.length &&
    response.selectedOptionIds.every(id => item.question.options.some(o => o.id === id));
}

// Storage must recheck current approval/access/Mock gate before calling this pure operation.
// Return values describe proposed state; they never acknowledge a durable save.
export function applyCommand(session: ValidatedGuidedSession, input: GuidedCommand, expectedRevision: number,
  now: number): GuidedResult<{ session: ValidatedGuidedSession; changed: boolean }> {
  if (!guidedSessionSchema.safeParse(session).success) return failure('invalid-session');
  const parsed = guidedCommandSchema.safeParse(input);
  if (!parsed.success || !timestampSchema.safeParse(now).success || !Number.isSafeInteger(expectedRevision) || expectedRevision < 0) return failure('invalid-command');
  const command = parsed.data;
  const response = 'questionId' in command ? session.responses[command.questionId] : null;
  // Lost acknowledgement retries precede revision conflict; never replay a different command.
  if (command.kind === 'commit' && response?.commitment?.commandId === command.commandId) {
    return { ok: true, value: { session, changed: false } };
  }
  if (command.kind === 'finish' && session.status === 'completed') return { ok: true, value: { session, changed: false } };
  if (session.status === 'completed') return failure('locked');
  if (expectedRevision !== session.revision) return failure('conflict');
  if (session.revision === Number.MAX_SAFE_INTEGER) return failure('invalid-session');
  const next: GuidedSession = structuredClone(session);
  const time = Math.max(now, session.updatedAt);
  if (command.kind === 'navigate') {
    if (command.index >= session.items.length) return failure('invalid-command');
    if (command.index === session.currentIndex) return { ok: true, value: { session, changed: false } };
    next.currentIndex = command.index;
  } else if (command.kind === 'finish') {
    if (session.items.some(i => !session.responses[i.question.id].commitment)) return failure('incomplete');
    next.status = 'completed'; next.completedAt = time;
  } else {
    const item = session.items.find(i => i.question.id === command.questionId);
    if (!item || !response) return failure('invalid-command');
    if (response.commitment) return failure('locked');
    const target = next.responses[command.questionId];
    if (command.kind === 'select') {
      if (command.ids.length > item.question.selectionCount || new Set(command.ids).size !== command.ids.length ||
          command.ids.some(id => !item.question.options.some(o => o.id === id))) return failure('invalid-command');
      if (JSON.stringify(command.ids) === JSON.stringify(response.selectedOptionIds)) return { ok: true, value: { session, changed: false } };
      target.selectedOptionIds = [...command.ids];
    } else if (command.kind === 'revealNextHint') {
      if (response.maxHintRevealed === 3) return failure('invalid-command');
      target.maxHintRevealed = (response.maxHintRevealed + 1) as 1 | 2 | 3;
    } else {
      if (!canCommit(item, response)) return failure('incomplete');
      if (Object.values(session.responses).some(r => r.commitment?.commandId === command.commandId)) return failure('invalid-command');
      target.commitment = { commandId: command.commandId, committedAt: time };
    }
  }
  next.revision += 1; next.updatedAt = time;
  if (!isValidTransition(session, next)) return failure('invalid-session');
  return { ok: true, value: { session: frozenCopy(next) as ValidatedGuidedSession, changed: true } };
}

// Additive storage-boundary invariant: no mutable source or rollback of a saved commitment/hint.
export function isValidTransition(previous: GuidedSession, next: GuidedSession): boolean {
  if (!withinJsonLimit(next, LIMITS.sessionBytes) || !guidedSessionSchema.safeParse(previous).success ||
      !guidedSessionSchema.safeParse(next).success) return false;
  if (JSON.stringify(previous) === JSON.stringify(next)) return true;
  if (previous.status === 'completed' || next.revision !== previous.revision + 1 || next.updatedAt < previous.updatedAt) return false;
  for (const field of ['schemaVersion', 'id', 'origin', 'source', 'guideVersion', 'startedAt', 'items'] as const) {
    if (JSON.stringify(previous[field]) !== JSON.stringify(next[field])) return false;
  }
  return previous.items.every(({ question }) => {
    const before = previous.responses[question.id]; const after = next.responses[question.id];
    return after.maxHintRevealed >= before.maxHintRevealed && (!before.commitment || JSON.stringify(before) === JSON.stringify(after));
  });
}

export type PrecommitViewModel = {
  phase: 'answering'; questionId: string; stemMarkdown: string; options: { id: string; textMarkdown: string }[];
  selectionCount: number; selectedOptionIds: string[]; revealedHints: string[]; maxHintRevealed: number;
};
export function questionPresentation(session: ValidatedGuidedSession, questionId: string): GuidedResult<PrecommitViewModel | {
  phase: 'committed'; item: GuidedItem; selectedOptionIds: string[]; isCorrect: boolean; revealedHints: string[];
}> {
  const item = session.items.find(i => i.question.id === questionId); const response = session.responses[questionId];
  if (!item || !response) return failure('invalid-command');
  const revealedHints = item.guide.hints.slice(0, response.maxHintRevealed);
  if (response.commitment) return { ok: true, value: frozenCopy({ phase: 'committed', item,
    selectedOptionIds: response.selectedOptionIds, isCorrect: isExactSet(item.question, response.selectedOptionIds), revealedHints }) };
  return { ok: true, value: frozenCopy({ phase: 'answering', questionId, stemMarkdown: item.question.stemMarkdown,
    options: item.question.options.map(o => ({ id: o.id, textMarkdown: o.textMarkdown })), selectionCount: item.question.selectionCount,
    selectedOptionIds: response.selectedOptionIds, revealedHints, maxHintRevealed: response.maxHintRevealed }) };
}

export function learningSummary(session: ValidatedGuidedSession) {
  let committed = 0; let correct = 0; let correctWithoutHints = 0; let hintsRequested = 0;
  const revisitQuestionIds: string[] = [];
  for (const { question } of session.items) {
    const response = session.responses[question.id];
    hintsRequested += response.maxHintRevealed;
    const exact = response.commitment !== null && isExactSet(question, response.selectedOptionIds);
    if (response.commitment) committed += 1;
    if (exact) { correct += 1; if (response.maxHintRevealed === 0) correctWithoutHints += 1; }
    if (!exact || response.maxHintRevealed > 0) revisitQuestionIds.push(question.id);
  }
  return frozenCopy({ total: session.items.length, committed, correct, correctWithoutHints, hintsRequested,
    revisitQuestionIds, exposureNotice: session.origin.kind === 'post-exam' ? 'Answers may already have been seen' :
      'Fixed practice sets may have been seen before; these counts do not establish unseen mastery' });
}
