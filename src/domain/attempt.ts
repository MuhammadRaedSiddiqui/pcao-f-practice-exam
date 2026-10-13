import { z } from 'zod';
import { validateQuestionBank, type Question, type QuestionBank } from './bank';
import type { Difficulty } from './difficulty';

export type SelectionStatus = 'unanswered' | 'answered';
export type SubmissionReason = 'manual' | 'time expired';
export type Attempt = {
  id: string;
  revision?: number;
  startedAt: number;
  deadlineAt: number;
  status: 'in-progress' | 'submitted';
  currentQuestionId: string;
  answers: Record<string, string[]>;
  flags: string[];
  datasetVersion: string;
  difficulty?: Difficulty;
  snapshot: QuestionBank;
  submittedAt?: number;
  submissionReason?: SubmissionReason;
  result?: Score;
};
export type Score = { correct: number; total: number; percentage: number; byDomain: Record<string, { correct: number; total: number }> };
const timestamp = z.number().finite().refine(value => Number.isFinite(new Date(value).getTime()), 'Invalid date');
const attemptFields = z.object({
  id: z.string().min(1), revision: z.number().int().nonnegative().safe().optional(),
  startedAt: timestamp, deadlineAt: timestamp,
  status: z.enum(['in-progress', 'submitted']), currentQuestionId: z.string().min(1),
  answers: z.record(z.string(), z.array(z.string())),
  flags: z.array(z.string()), datasetVersion: z.string().min(1), difficulty: z.enum(['intermediate', 'advanced']).optional(),
  snapshot: z.unknown(), submittedAt: timestamp.optional(),
  submissionReason: z.enum(['manual', 'time expired']).optional(),
  result: z.object({
    correct: z.number().int().nonnegative(), total: z.number().int().nonnegative(), percentage: z.number().finite(),
    byDomain: z.record(z.string(), z.object({ correct: z.number().int().nonnegative(), total: z.number().int().nonnegative() })),
  }).optional(),
});

export function selectionStatus(question: Question, selected: readonly string[]): SelectionStatus {
  const count = new Set(selected).size;
  return count === question.selectionCount ? 'answered' : 'unanswered';
}

export function remainingMilliseconds(deadlineAt: number, now = Date.now()): number {
  return Math.max(0, deadlineAt - now);
}

export function isExactSet(question: Question, selected: readonly string[]): boolean {
  const actual = new Set(selected);
  return actual.size === question.correctOptionIds.length &&
    selected.length === actual.size &&
    question.correctOptionIds.every(id => actual.has(id));
}

export function gradeAttempt(attempt: Attempt): Score {
  const byDomain: Score['byDomain'] = Object.fromEntries(
    attempt.snapshot.domains.map(domain => [domain.id, { correct: 0, total: 0 }]));
  let correct = 0;
  for (const question of attempt.snapshot.questions) {
    const result = isExactSet(question, attempt.answers[question.id] ?? []);
    byDomain[question.primaryDomain].total += 1;
    if (result) {
      correct += 1;
      byDomain[question.primaryDomain].correct += 1;
    }
  }
  const total = attempt.snapshot.questions.length;
  return { correct, total, percentage: total ? Math.round((correct / total) * 1000) / 10 : 0, byDomain };
}

function frozenCopy<T>(value: T): T {
  const copy = structuredClone(value);
  const freeze = (item: unknown): void => {
    if (!item || typeof item !== 'object' || Object.isFrozen(item)) return;
    for (const child of Object.values(item)) freeze(child);
    Object.freeze(item);
  };
  freeze(copy);
  return copy;
}

export function createAttempt(bank: QuestionBank, now = Date.now(), id: string = crypto.randomUUID(), difficulty?: Difficulty): Attempt {
  const validation = validateQuestionBank(bank);
  if (!validation.ok) throw new Error(validation.errors.join(' '));
  timestamp.parse(now);
  timestamp.parse(now + bank.durationMinutes * 60_000);
  if (difficulty !== undefined) z.enum(['intermediate', 'advanced']).parse(difficulty);
  return {
    id, revision: 0, startedAt: now, deadlineAt: now + bank.durationMinutes * 60_000,
    status: 'in-progress', currentQuestionId: bank.questions[0].id,
    answers: {}, flags: [], datasetVersion: bank.version, snapshot: frozenCopy(bank),
    ...(difficulty ? { difficulty } : {}),
  };
}

function editable(attempt: Attempt, now: number): void {
  if (attempt.status !== 'in-progress') throw new Error('This attempt has already been submitted.');
  if (remainingMilliseconds(attempt.deadlineAt, now) === 0) throw new Error('Time has expired. Submit the attempt.');
}

export function answerQuestion(attempt: Attempt, questionId: string, selected: string[], now = Date.now()): Attempt {
  editable(attempt, now);
  const question = attempt.snapshot.questions.find(item => item.id === questionId);
  if (!question) throw new Error('Question not found in this attempt.');
  const allowed = new Set(question.options.map(option => option.id));
  if (selected.length > question.selectionCount || new Set(selected).size !== selected.length ||
      selected.some(id => !allowed.has(id))) throw new Error('The selected answers are invalid for this question.');
  return { ...attempt, revision: (attempt.revision ?? 0) + 1, answers: { ...attempt.answers, [questionId]: [...selected] } };
}

export function setCurrentQuestion(attempt: Attempt, questionId: string, now = Date.now()): Attempt {
  editable(attempt, now);
  if (!attempt.snapshot.questions.some(question => question.id === questionId)) throw new Error('Question not found in this attempt.');
  return { ...attempt, revision: (attempt.revision ?? 0) + 1, currentQuestionId: questionId };
}

export function setFlag(attempt: Attempt, questionId: string, flagged: boolean, now = Date.now()): Attempt {
  editable(attempt, now);
  if (!attempt.snapshot.questions.some(question => question.id === questionId)) throw new Error('Question not found in this attempt.');
  const flags = new Set(attempt.flags);
  if (flagged) flags.add(questionId); else flags.delete(questionId);
  return { ...attempt, revision: (attempt.revision ?? 0) + 1, flags: [...flags] };
}

export function submitAttempt(attempt: Attempt, now = Date.now(), requestedReason: SubmissionReason = 'manual'): Attempt {
  if (attempt.status === 'submitted') return attempt;
  timestamp.parse(now);
  const timedOut = remainingMilliseconds(attempt.deadlineAt, now) === 0;
  if (requestedReason === 'time expired' && !timedOut) throw new Error('The attempt deadline has not elapsed.');
  return {
    ...attempt, revision: (attempt.revision ?? 0) + 1, status: 'submitted', submittedAt: Math.max(now, attempt.startedAt),
    submissionReason: timedOut ? 'time expired' : requestedReason,
    result: gradeAttempt(attempt),
  };
}

export type AttemptStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type Recovery = { ok: true; attempt: Attempt | null } | { ok: false; error: string };
const prefix = 'pcao-f:attempt:v1:';
const indexKey = 'pcao-f:attempt-ids:v1';

function validRecoveredAttempt(input: unknown): Attempt | null {
  const parsed = attemptFields.safeParse(input);
  if (!parsed.success) return null;
  const value = parsed.data;
  const bank = validateQuestionBank(value.snapshot);
  if (!bank.ok || value.datasetVersion !== bank.bank.version ||
      value.deadlineAt !== value.startedAt + bank.bank.durationMinutes * 60_000 ||
      !bank.bank.questions.some(q => q.id === value.currentQuestionId)) return null;
  if (value.status === 'in-progress') {
    if (value.submittedAt !== undefined || value.submissionReason !== undefined || value.result !== undefined) return null;
  } else if (value.submittedAt === undefined || value.submissionReason === undefined ||
      value.submittedAt < value.startedAt ||
      (value.submissionReason === 'time expired') !== (value.submittedAt >= value.deadlineAt)) return null;
  const questions = new Map(bank.bank.questions.map(q => [q.id, q]));
  for (const [id, selected] of Object.entries(value.answers)) {
    const question = questions.get(id);
    if (!question || selected.length > question.selectionCount ||
        new Set(selected).size !== selected.length ||
        selected.some(optionId => !question.options.some(o => o.id === optionId))) return null;
  }
  if (new Set(value.flags).size !== value.flags.length || value.flags.some(id => !questions.has(id))) return null;
  const attempt: Attempt = { ...value, snapshot: frozenCopy(bank.bank) };
  if (attempt.result) {
    const expected = gradeAttempt(attempt);
    if (attempt.result.correct !== expected.correct || attempt.result.total !== expected.total ||
        attempt.result.percentage !== expected.percentage ||
        Object.keys(attempt.result.byDomain).length !== Object.keys(expected.byDomain).length ||
        Object.entries(expected.byDomain).some(([id, score]) =>
          attempt.result!.byDomain[id]?.correct !== score.correct || attempt.result!.byDomain[id]?.total !== score.total)) return null;
  }
  return attempt;
}

export function recoverAttempt(storage: AttemptStorage, id: string): Recovery {
  try {
    const raw = storage.getItem(prefix + id);
    if (raw === null) return { ok: true, attempt: null };
    const attempt = validRecoveredAttempt(JSON.parse(raw));
    return attempt && attempt.id === id
      ? { ok: true, attempt }
      : { ok: false, error: 'Saved attempt is incomplete or damaged. It was not loaded.' };
  } catch {
    return { ok: false, error: 'Saved attempt could not be read from this browser.' };
  }
}

// The browser caller holds the shared storage lock throughout these synchronous writes.
export function saveAttempt(storage: AttemptStorage, attempt: Attempt, expectedRevision?: number): Recovery {
  const originals = new Map<string, string | null>();
  try {
    const index = storage.getItem(indexKey);
    const ids = JSON.parse(index ?? '[]') as unknown;
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Invalid history index');
    const key = prefix + attempt.id;
    const previous = storage.getItem(key);
    if (previous !== null) {
      const recovered = recoverAttempt(storage, attempt.id);
      if (!recovered.ok || !recovered.attempt) return recovered;
      const latest = recovered.attempt;
      if (JSON.stringify(latest) === JSON.stringify(attempt)) return { ok: true, attempt: latest };
      if (latest.status === 'submitted') return { ok: false, error: 'This attempt was already submitted in another tab. Its report was kept.' };
      if (attempt.difficulty !== latest.difficulty) return { ok: false, error: 'An existing attempt cannot change difficulty. Start another exam to choose a different level.' };
      if ((expectedRevision !== undefined && expectedRevision !== (latest.revision ?? 0)) ||
          (attempt.revision ?? 0) !== (latest.revision ?? 0) + 1) {
        return { ok: false, error: 'This attempt changed in another tab. The latest saved answers were loaded. Try your change again.' };
      }
    } else if (expectedRevision !== undefined) {
      return { ok: false, error: 'This attempt is no longer saved. It may have been replaced in another tab.' };
    }
    storage.setItem(key, JSON.stringify(attempt));
    originals.set(key, previous);
    // Existing edits only need one write; keep the history index stable.
    if (!ids.includes(attempt.id)) {
      storage.setItem(indexKey, JSON.stringify([...new Set([attempt.id, ...ids])]));
      originals.set(indexKey, index);
    }
    return { ok: true, attempt };
  } catch {
    let restored = true;
    for (const [key, value] of originals) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); }
      catch { restored = false; }
    }
    return { ok: false, error: restored
      ? 'Attempt could not be saved in this browser. Check available storage.'
      : 'Browser storage failed during saving and recovery. Reload to check your saved answers before editing again.' };
  }
}

export function listAttempts(storage: AttemptStorage): { attempts: Attempt[]; errors: string[] } {
  try {
    const ids = JSON.parse(storage.getItem(indexKey) ?? '[]') as unknown;
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Invalid history index');
    const attempts: Attempt[] = [];
    const errors: string[] = [];
    for (const id of ids as string[]) {
      const recovered = recoverAttempt(storage, id);
      if (recovered.ok) { if (recovered.attempt) attempts.push(recovered.attempt); }
      else errors.push(`${id}: ${recovered.error}`);
    }
    return { attempts, errors };
  } catch {
    return { attempts: [], errors: ['Attempt history could not be read from this browser.'] };
  }
}

export function submitStoredAttempt(storage: AttemptStorage, id: string, now = Date.now(), reason: SubmissionReason = 'manual'): Recovery {
  const recovered = recoverAttempt(storage, id);
  if (!recovered.ok || !recovered.attempt) return recovered;
  if (recovered.attempt.status === 'submitted') return recovered;
  return saveAttempt(storage, submitAttempt(recovered.attempt, now, reason), recovered.attempt.revision ?? 0);
}

export type StartRecovery = Recovery | { ok: false; error: string; unfinishedAttempts: Attempt[] };

// Replace only confirmed unfinished attempts; restore prior records if a write fails.
export function startStoredAttempt(
  storage: AttemptStorage, bank: QuestionBank, confirmedIds: readonly string[] = [], now = Date.now(), difficulty?: Difficulty,
): StartRecovery {
  const validation = validateQuestionBank(bank);
  if (!validation.ok) return { ok: false, error: 'The reviewed question bank is unavailable. A new exam cannot start.' };
  const loaded = listAttempts(storage);
  if (loaded.errors.length) return { ok: false, error: 'Your saved attempts could not be read safely. A new exam cannot start. Try again after checking browser storage.' };
  // An expired attempt earns a report before a new start can replace anything.
  for (const item of loaded.attempts) {
    if (item.status === 'in-progress' && remainingMilliseconds(item.deadlineAt, now) === 0) {
      const submitted = submitStoredAttempt(storage, item.id, now, 'time expired');
      if (!submitted.ok) return submitted;
    }
  }
  const unfinished = loaded.attempts.filter(item => item.status === 'in-progress' && remainingMilliseconds(item.deadlineAt, now) > 0);
  if (unfinished.some(item => !confirmedIds.includes(item.id))) {
    return { ok: false, error: 'Confirm before abandoning your unfinished attempt.', unfinishedAttempts: unfinished };
  }
  const originals = new Map<string, string | null>();
  try {
    const next = createAttempt(validation.bank, now, undefined, difficulty);
    const ids = JSON.parse(storage.getItem(indexKey) ?? '[]') as string[];
    const unfinishedIds = new Set(unfinished.map(item => item.id));
    const keys = [indexKey, prefix + next.id, ...unfinished.map(item => prefix + item.id)];
    for (const key of keys) originals.set(key, storage.getItem(key));
    storage.setItem(prefix + next.id, JSON.stringify(next));
    for (const item of unfinished) storage.removeItem(prefix + item.id);
    storage.setItem(indexKey, JSON.stringify([next.id, ...ids.filter(id => !unfinishedIds.has(id))]));
    return { ok: true, attempt: next };
  } catch {
    let restored = true;
    for (const [key, value] of originals) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); }
      catch { restored = false; }
    }
    return { ok: false, error: restored
      ? 'The exam could not be saved. Your existing attempts were kept. Check available browser storage and try again.'
      : 'Browser storage failed while saving the exam. Reload to check your saved attempts before trying again.' };
  }
}
