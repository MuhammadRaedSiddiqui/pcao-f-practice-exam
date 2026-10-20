import { beforeAll, describe, it, expect } from 'vitest';
import { createAttempt, submitAttempt } from '../src/domain/attemptModel';
import { resolveEligibility, selectPracticeSet, eligibilitySchema } from '../src/domain/guided/selectors';
import { validateSource, validateReportSource, sourceCompatibility, sourceCompatibilitySchema } from '../src/domain/guided/source';
import { startSession } from '../src/domain/guided/session';
import { syntheticGuidance, NOW, SESSION_ID, unwrap } from './fixtures/syntheticGuidance';

describe('Exact Guided eligibility and cohorts', () => {
  let f: Awaited<ReturnType<typeof syntheticGuidance>>;
  beforeAll(async () => { f = await syntheticGuidance(); });
  const coverage = () => resolveEligibility({ kind: 'standalone', bank: f.bank, difficulty: 'intermediate' }, f.release, f.catalog);
  function report() {
    const draft = createAttempt(f.bank, NOW, 'synthetic-report', 'intermediate');
    draft.answers = { T1: ['A'], T2: ['A'], T3: ['A', 'B', 'D'], T4: ['B'], T6: ['A'] };
    draft.flags = ['T2', 'T4', 'T5'];
    return submitAttempt(draft, NOW + 1000);
  }
  it('reports partial publication with exact source order and explicit absent coverage', async () => {
    const c = unwrap(await coverage());
    expect(c.matchedIds).toHaveLength(60); expect(c.items).toHaveLength(10);
    expect(c.excludedCounts).toEqual({ 'not-published': 50 });
    expect(c.items.map(i => i.question.id)).toEqual(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10']);
  });
  it('deterministic 5/10 sets have no duplicates and reach every approved question', async () => {
    const c = unwrap(await coverage());
    const five = [0, 1].flatMap(index => unwrap(selectPracticeSet(c, 5, index))).map(i => i.question.id);
    expect(five).toEqual(c.items.map(i => i.question.id)); expect(new Set(five).size).toBe(10);
    expect(unwrap(selectPracticeSet(c, 10)).map(i => i.question.id)).toEqual(five);
    expect(selectPracticeSet(c, 5, 2)).toEqual({ ok: false, code: 'unavailable' });
    expect(selectPracticeSet(c, 5, -1)).toEqual({ ok: false, code: 'invalid-command' });
  });
  it.each(['incorrect-unanswered', 'flagged', 'all'] as const)('filters %s before computing eligible X of matched Y', async filter => {
    const r = report(); const before = JSON.stringify(r);
    const c = unwrap(await resolveEligibility({ kind: 'post-exam', report: r, filter }, f.release, f.catalog));
    if (filter === 'incorrect-unanswered') {
      expect(c.matchedIds).toHaveLength(58);
      expect(c.items.map(i => i.question.id)).toEqual(['T1', 'T3', 'T4', 'T5', 'T7', 'T8', 'T9', 'T10']);
      expect(c.excludedCounts).toEqual({ 'not-published': 50 });
    } else if (filter === 'flagged') {
      expect(c.matchedIds).toEqual(['T2', 'T4', 'T5']); expect(c.items.map(i => i.question.id)).toEqual(['T2', 'T4', 'T5']);
    } else { expect(c.matchedIds).toHaveLength(60); expect(c.items).toHaveLength(10); }
    expect(JSON.stringify(r)).toBe(before);
  });
  it('default includes partial nonblank as incorrect and launches empty retry answers with exposure warning', async () => {
    const r = report(); const raw = JSON.stringify(r);
    const s = unwrap(await startSession({ kind: 'post-exam', report: r, access: { kind: 'guest-device' }, id: SESSION_ID, now: NOW + 2000 }, f.release, f.catalog));
    expect(s.items.map(i => i.question.id)).toEqual(['T1', 'T3', 'T4', 'T5', 'T7', 'T8', 'T9', 'T10']);
    expect(Object.values(s.responses).every(response => response.selectedOptionIds.length === 0)).toBe(true);
    expect(s.origin.kind === 'post-exam' && s.origin.filter).toBe('incorrect-unanswered');
    expect(JSON.stringify(s)).not.toContain('result'); expect(JSON.stringify(r)).toBe(raw);
  });
  it('supports zero cohorts, all-correct default and 60-item post-exam subsets', async () => {
    const full = await syntheticGuidance(60); const r = report();
    r.answers = Object.fromEntries(r.snapshot.questions.map(q => [q.id, q.correctOptionIds])); delete r.result;
    const empty = unwrap(await resolveEligibility({ kind: 'post-exam', report: r }, f.release, f.catalog));
    expect(empty.matchedIds).toEqual([]); expect(empty.items).toEqual([]);
    const s = unwrap(await startSession({ kind: 'post-exam', report: r, filter: 'all', access: { kind: 'guest-device' },
      id: SESSION_ID, now: NOW + 2000 }, full.release, full.catalog));
    expect(s.items).toHaveLength(60);
  });
  it('never treats an expired unfinished Mock as a completed source', () => {
    const a = createAttempt(f.bank, NOW, 'unfinished');
    expect(validateReportSource(a, f.catalog)).toEqual({ ok: false, code: 'not-submitted' });
    expect(validateReportSource({ ...a, deadlineAt: NOW - 1 }, f.catalog).ok).toBe(false);
  });
  it('infers legacy difficulty only for an exactly recognized source/version and fingerprint', async () => {
    const r = report(); delete r.difficulty; delete r.revision; delete r.result;
    expect((await resolveEligibility({ kind: 'post-exam', report: r }, f.release, f.catalog)).ok).toBe(true);
    expect(await resolveEligibility({ kind: 'post-exam', report: { ...r, difficulty: 'advanced' } }, f.release, f.catalog))
      .toEqual({ ok: false, code: 'version-mismatch' });
    expect(validateSource({ ...f.bank, examId: 'unrecognized' }, undefined, f.catalog)).toEqual({ ok: false, code: 'unsupported-source' });
    expect(validateSource({ ...f.bank, version: '1.0.1' }, undefined, f.catalog)).toEqual({ ok: false, code: 'unsupported-source' });
    expect(sourceCompatibility(f.bank, 'intermediate', f.catalog)).toEqual({ status: 'compatible', source: f.source });
    expect(sourceCompatibilitySchema.safeParse(sourceCompatibility(f.bank, 'advanced', f.catalog)).success).toBe(true);
  });
  it('does not substitute current content for a changed frozen report question', async () => {
    const r = report(); r.snapshot = structuredClone(r.snapshot); r.snapshot.questions[0].stemMarkdown += 'changed';
    const c = unwrap(await resolveEligibility({ kind: 'post-exam', report: r, filter: 'all' }, f.release, f.catalog));
    expect(c.items).toHaveLength(9); expect(c.excluded.find(q => q.questionId === 'T1')?.reason).toBe('fingerprint-mismatch');
  });
  it('D12 excludes revoked entries and offers complete overlapping standalone sets; report coverage stays unchanged', async () => {
    const catalog = structuredClone(f.catalog); catalog[0].revokedDigests.push(catalog[0].approvedEntries.T1);
    const c = unwrap(await resolveEligibility({ kind: 'standalone', bank: f.bank, difficulty: 'intermediate' }, f.release, catalog));
    expect(c.items).toHaveLength(9);
    expect(unwrap(selectPracticeSet(c, 5)).map(i => i.question.id)).toEqual(['T2','T3','T4','T5','T6']);
    expect(unwrap(selectPracticeSet(c, 5, 1)).map(i => i.question.id)).toEqual(['T6','T7','T8','T9','T10']);
    const review = unwrap(await resolveEligibility({ kind: 'post-exam', report: report(), filter: 'all' }, f.release, catalog));
    expect(review.items).toHaveLength(9); expect(review.excludedCounts.revoked).toBe(1);
  });
  it('does not silently shorten or strand a partial trailing set, or accept duplicate items', async () => {
    const c = unwrap(await coverage());
    const seven = await syntheticGuidance(7);
    const sevenCoverage = unwrap(await resolveEligibility({ kind: 'standalone', bank: seven.bank, difficulty: 'intermediate' }, seven.release, seven.catalog));
    expect(unwrap(selectPracticeSet(sevenCoverage, 5, 1)).map(i => i.question.id)).toEqual(['T3','T4','T5','T6','T7']);
    const four = await syntheticGuidance(4);
    const fourCoverage = unwrap(await resolveEligibility({ kind: 'standalone', bank: four.bank, difficulty: 'intermediate' }, four.release, four.catalog));
    expect(selectPracticeSet(fourCoverage, 5)).toEqual({ ok: false, code: 'insufficient-coverage' });
    expect(selectPracticeSet({ ...c, items: [c.items[0], c.items[0], ...c.items.slice(2)] }, 5)).toEqual({ ok: false, code: 'invalid-command' });
  });
  it('validates strict eligibility partitions and accurate reason counts', async () => {
    const c = unwrap(await coverage());
    expect(eligibilitySchema.safeParse(c).success).toBe(true);
    expect(eligibilitySchema.safeParse({ ...c, excludedCounts: { 'not-published': 49 } }).success).toBe(false);
    expect(eligibilitySchema.safeParse({ ...c, matchedIds: [...c.matchedIds, c.matchedIds[0]] }).success).toBe(false);
    expect(eligibilitySchema.safeParse({ ...c, secret: 'foreign-owner' }).success).toBe(false);
  });
  it('D12 excludes source mismatches from new standalone sets and reports without substitution', async () => {
    const bank = structuredClone(f.bank); bank.questions[0].options.reverse();
    const c = unwrap(await resolveEligibility({ kind: 'standalone', bank, difficulty: 'intermediate' }, f.release, f.catalog));
    expect(c.excludedCounts).toEqual({ 'fingerprint-mismatch': 1, 'not-published': 50 });
    expect(unwrap(selectPracticeSet(c, 5, 1)).map(i => i.question.id)).toEqual(['T6','T7','T8','T9','T10']);
  });
});
