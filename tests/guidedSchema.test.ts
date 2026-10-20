import { describe, it, expect, beforeAll } from 'vitest';
import { guidedQuestionSchema, guidedItemSchema, guideReleaseSchema, guidedSessionSchema, sourceIdentitySchema,
  editorialApprovalSchema, versionSchema, LIMITS, withinJsonLimit } from '../src/domain/guided/schema';
import { validateQuestionBank } from '../src/domain/bankValidation';
import { validateGuidedSession } from '../src/domain/guided/session';
import { syntheticSession, guidedBank } from './fixtures/syntheticGuidance';

describe('Guided strict independent contracts', () => {
  let fixture: Awaited<ReturnType<typeof syntheticSession>>;
  beforeAll(async () => { fixture = await syntheticSession(); });
  it('accepts full source, overlay and frozen subset without pretending the subset is a bank', () => {
    expect(validateQuestionBank(fixture.bank).ok).toBe(true);
    expect(guideReleaseSchema.safeParse(fixture.release).success).toBe(true);
    expect(guidedSessionSchema.safeParse(fixture.session).success).toBe(true);
    expect(guidedItemSchema.safeParse(fixture.session.items[0]).success).toBe(true);
    expect(validateQuestionBank({ ...fixture.bank, questions: fixture.bank.questions.slice(0, 5) }).ok).toBe(false);
  });
  it('preserves accepted strings while the existing parent bank validator trims raw input', () => {
    const bank = guidedBank(); bank.questions[0].stemMarkdown = '  Synthetic padded text\n';
    expect(guidedQuestionSchema.parse(bank.questions[0]).stemMarkdown).toBe('  Synthetic padded text\n');
    const parsed = validateQuestionBank(bank);
    expect(parsed.ok && parsed.bank.questions[0].stemMarkdown).toBe('Synthetic padded text');
  });
  const invalidEntries: [string, (x: Record<string, any>) => void][] = [
    ['unknown field', x => { x.extra = true; }], ['nested field', x => { x.approval.extra = true; }],
    ['draft', x => { x.approval.status = 'draft'; }], ['blank hint', x => { x.hints[0] = ' \n '; }],
    ['two hints', x => { x.hints.pop(); }], ['four hints', x => { x.hints.push('extra'); }],
    ['long hint', x => { x.hints[0] = 'x'.repeat(1501); }], ['one criterion', x => { x.decisiveCriteria.pop(); }],
    ['duplicate comparison', x => { x.optionComparisons[1].optionId = x.optionComparisons[0].optionId; }],
    ['duplicate vocabulary', x => { x.vocabulary.push(x.vocabulary[0]); }],
    ['duplicate distractor', x => { x.closestDistractorIds.push(x.closestDistractorIds[0]); }],
    ['unknown hash version', x => { x.sourceFingerprint = 'sha256:q2:' + '0'.repeat(64); }],
    ['short hash', x => { x.sourceFingerprint = 'sha256:q1:00'; }],
  ];
  it.each(invalidEntries)('rejects overlay %s', (_name, mutate) => {
    const release = structuredClone(fixture.release); mutate(release.questions[0]);
    expect(guideReleaseSchema.safeParse(release).success).toBe(false);
  });
  it.each(['schemaVersion', 'fingerprintVersion'] as const)('rejects unsupported %s', field => {
    expect(guideReleaseSchema.safeParse({ ...fixture.release, [field]: 2 }).success).toBe(false);
  });
  it('rejects duplicate release IDs and malformed source versions', () => {
    expect(guideReleaseSchema.safeParse({ ...fixture.release, questions: [fixture.release.questions[0], fixture.release.questions[0]] }).success).toBe(false);
    expect(sourceIdentitySchema.safeParse({ ...fixture.source, bankVersion: 'fixture-1' }).success).toBe(false);
    expect(sourceIdentitySchema.safeParse({ ...fixture.source, difficulty: 'easy' }).success).toBe(false);
    expect(editorialApprovalSchema.safeParse({ status: 'approved', reviewId: 'test', reviewedAt: 'yesterday' }).success).toBe(false);
    for (const version of ['01.0.0', '1.0', '1.0.0-01', '1.0.0-a..b', '1.0.0+..']) expect(versionSchema.safeParse(version).success).toBe(false);
    for (const version of ['1.0.0', '1.0.0-alpha.1+build.42']) expect(versionSchema.safeParse(version).success).toBe(true);
  });
  it('bounds every overlay collection and prose field', () => {
    for (const change of [
      (e: typeof fixture.release.questions[number]) => { e.vocabulary = Array.from({ length: 11 }, (_, i) => ({ term: String(i), definition: 'synthetic' })); },
      (e: typeof fixture.release.questions[number]) => { e.sourceChecks = Array.from({ length: 21 }, () => e.sourceChecks[0]); },
      (e: typeof fixture.release.questions[number]) => { e.reasoningMarkdown = 'x'.repeat(LIMITS.prose + 1); },
      (e: typeof fixture.release.questions[number]) => { e.decisiveCriteria = Array(5).fill('synthetic'); },
    ]) {
      const release = structuredClone(fixture.release); change(release.questions[0]);
      expect(guideReleaseSchema.safeParse(release).success).toBe(false);
    }
    expect(guideReleaseSchema.safeParse({ ...fixture.release, questions: Array(61).fill(fixture.release.questions[0]) }).success).toBe(false);
  });
  it.each(['options', 'correctOptionIds', 'optionExplanations', 'sources'] as const)('keeps required source %s validation', field => {
    const question = { ...fixture.bank.questions[0], [field]: field === 'optionExplanations' ? {} : [] };
    expect(guidedQuestionSchema.safeParse(question).success).toBe(false);
  });
  it('requires ordered all-option comparisons, valid source indices and wrong-only distractors', () => {
    for (const change of [
      (x: typeof fixture.session.items[number]) => { x.guide.optionComparisons.reverse(); },
      (x: typeof fixture.session.items[number]) => { x.guide.closestDistractorIds = ['A']; },
      (x: typeof fixture.session.items[number]) => { x.guide.sourceChecks[0].sourceIndex = 1; },
      (x: typeof fixture.session.items[number]) => { x.domain.id = 'D7'; },
    ]) {
      const item = structuredClone(fixture.session.items[0]); change(item);
      expect(guidedItemSchema.safeParse(item).success).toBe(false);
    }
  });
  const invalidSessions: [string, (s: Record<string, any>) => void][] = [
    ['extra grade', s => { s.isCorrect = true; }], ['invalid UUID', s => { s.id = 'not-uuid'; }],
    ['negative revision', s => { s.revision = -1; }], ['unsafe revision', s => { s.revision = 2 ** 53; }],
    ['invalid date', s => { s.updatedAt = 9e15; }], ['backward time', s => { s.updatedAt = s.startedAt - 1; }],
    ['outside position', s => { s.currentIndex = 5; }], ['missing response', s => { delete s.responses.T1; }],
    ['foreign response', s => { s.responses.foreign = s.responses.T1; }], ['duplicate question', s => { s.items[1] = s.items[0]; }],
    ['incorrect length', s => { s.origin.selectionSize = 10; }], ['duplicate choice', s => { s.responses.T1.selectedOptionIds = ['A', 'A']; }],
    ['unknown choice', s => { s.responses.T1.selectedOptionIds = ['X']; }], ['partial commitment', s => {
      s.responses.T1.selectedOptionIds = ['A']; s.responses.T1.commitment = { commandId: s.id, committedAt: s.startedAt }; }],
    ['premature completion', s => { s.status = 'completed'; s.completedAt = s.startedAt; }],
    ['unfinished completion date', s => { s.completedAt = s.startedAt; }],
  ];
  it.each(invalidSessions)('rejects session %s', (_name, change) => {
    const session = structuredClone(fixture.session); change(session);
    expect(guidedSessionSchema.safeParse(session).success).toBe(false);
  });
  it('revalidates recovered content against hashes and current approval', async () => {
    const session = structuredClone(fixture.session); session.items[0].question.stemMarkdown += 'changed';
    expect(await validateGuidedSession(session, fixture.catalog)).toEqual({ ok: false, code: 'fingerprint-mismatch' });
    expect(await validateGuidedSession(fixture.session)).toEqual({ ok: false, code: 'not-published' });
    expect(await validateGuidedSession({ ...fixture.session, schemaVersion: 2 }, fixture.catalog)).toEqual({ ok: false, code: 'unsupported-version' });
  });
  it('bounds release/session UTF-8 bytes and rejects cyclic input without truncation', async () => {
    expect(withinJsonLimit('é', 3)).toBe(false);
    expect(withinJsonLimit('é', 4)).toBe(true);
    const cyclic: any = {}; cyclic.self = cyclic;
    expect(withinJsonLimit(cyclic, LIMITS.sessionBytes)).toBe(false);
    expect(await validateGuidedSession('x'.repeat(LIMITS.sessionBytes), fixture.catalog)).toEqual({ ok: false, code: 'resource-limit' });
  });
});
