import { beforeAll, describe, expect, it } from 'vitest';
import { practiceSets, resolveEligibility, selectPracticeSet, type Eligibility } from '../src/domain/guided/selectors';
import { startSession, validateGuidedSession, applyCommand } from '../src/domain/guided/session';
import { validateStandaloneRelease } from '../src/domain/guided/loader';
import { guidanceDigest } from '../src/domain/guided/fingerprints';
import { syntheticGuidance, NOW, SESSION_ID, commandId, unwrap } from './fixtures/syntheticGuidance';

describe('D12 complete deterministic sets', () => {
  let f: Awaited<ReturnType<typeof syntheticGuidance>>;
  let full: Eligibility;
  beforeAll(async () => {
    f = await syntheticGuidance(60);
    full = unwrap(await resolveEligibility({ kind: 'standalone', bank: f.bank, difficulty: 'intermediate' }, f.release, f.catalog));
  });
  function coverage(n: number): Eligibility {
    return { ...full, items: full.items.slice(0, n), excluded: full.items.slice(n).map(i => ({ questionId: i.question.id, reason: 'not-published' })),
      excludedCounts: n < 60 ? { 'not-published': 60 - n } : {} };
  }
  it.each(Array.from({ length: 61 }, (_, n) => n).flatMap(n => [5, 10].map(size => ({ n, size: size as 5 | 10 }))))
   ('n=$n size=$size has exact cardinality, ordered coverage and disclosed overlap', ({ n, size }) => {
      const c = coverage(n), original = JSON.stringify(c), result = practiceSets(c, size);
      if (n < size) {
        expect(result).toEqual({ ok: false, code: 'insufficient-coverage' });
        expect(selectPracticeSet(c, size)).toEqual(result); return;
      }
      const descriptions = unwrap(result), seen = new Set<string>();
      expect(descriptions).toHaveLength(Math.ceil(n / size));
      for (const d of descriptions) {
        const items = unwrap(selectPracticeSet(c, size, d.setIndex));
        const ids = items.map(i => i.question.id);
        expect(items).toHaveLength(size); expect(new Set(ids).size).toBe(size);
        expect(ids).toEqual(c.items.slice(d.startIndex, d.endIndex).map(i => i.question.id));
        expect(d.repeatedCount).toBe(ids.filter(id => seen.has(id)).length);
        if (d.setIndex < descriptions.length - 1 || n % size === 0) expect(d.repeatedCount).toBe(0);
        ids.forEach(id => seen.add(id));
      }
      expect([...seen]).toEqual(c.items.map(i => i.question.id));
      expect(practiceSets(c, size)).toEqual(result);
      expect(JSON.stringify(c)).toBe(original);
      expect(selectPracticeSet(c, size, descriptions.length)).toEqual({ ok: false, code: 'unavailable' });
    });
  it('has independent boundary examples and rejects invalid or stale indices', () => {
    expect(unwrap(practiceSets(coverage(6), 5))).toEqual([
      { setIndex: 0, startIndex: 0, endIndex: 5, repeatedCount: 0 },
      { setIndex: 1, startIndex: 1, endIndex: 6, repeatedCount: 4 },
    ]);
    expect(unwrap(selectPracticeSet(coverage(11), 5, 2)).map(i => i.question.id)).toEqual(['T7','T8','T9','T10','T11']);
    expect(unwrap(selectPracticeSet(coverage(11), 10, 1)).map(i => i.question.id)).toEqual(['T2','T3','T4','T5','T6','T7','T8','T9','T10','T11']);
    for (const index of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) expect(selectPracticeSet(full, 5, index)).toEqual({ ok: false, code: 'invalid-command' });
    expect(selectPracticeSet(full, 5, Number.MAX_SAFE_INTEGER)).toEqual({ ok: false, code: 'unavailable' });
    expect(selectPracticeSet(coverage(9), 5, 2)).toEqual({ ok: false, code: 'unavailable' });
    expect(practiceSets(full, 4 as 5)).toEqual({ ok: false, code: 'invalid-command' });
    expect(practiceSets({ ...full, items: [full.items[0], ...full.items] }, 5)).toEqual({ ok: false, code: 'invalid-command' });
  });
  it.each([[0],[4],[9],[0,4,9],Array.from({ length: 10 }, (_, i) => i)].map(positions => ({ positions })))('excludes revoked positions $positions without changing catalog approval', async ({ positions }) => {
    const small = await syntheticGuidance(); const catalog = structuredClone(small.catalog);
    catalog[0].revokedDigests = positions.map(i => catalog[0].approvedEntries['T' + (i + 1)]);
    const before = JSON.stringify([small.bank, small.release, catalog]);
    const c = unwrap(await resolveEligibility({ kind: 'standalone', bank: small.bank, difficulty: 'intermediate' }, small.release, catalog));
    expect(c.items.map(i => i.question.id)).toEqual(Array.from({ length: 10 }, (_, i) => 'T' + (i + 1)).filter((_, i) => !positions.includes(i)));
    expect(c.excludedCounts.revoked).toBe(positions.length);
    const result = practiceSets(c, 5);
    if (c.items.length >= 5) for (const d of unwrap(result)) {
      const s = unwrap(await startSession({ kind: 'standalone', bank: small.bank, difficulty: 'intermediate', selectionSize: 5, setIndex: d.setIndex, id: SESSION_ID, now: NOW }, small.release, catalog));
      expect(s.items).toEqual(unwrap(selectPracticeSet(c, 5, d.setIndex)));
      expect(s.items).toHaveLength(5);
    } else expect(result).toEqual({ ok: false, code: 'insufficient-coverage' });
    expect(JSON.stringify([small.bank, small.release, catalog])).toBe(before);
  });
  it('excludes a changed source without cross-version/bank substitution, still rejects malformed or unapproved releases', async () => {
    const small = await syntheticGuidance(); const bank = structuredClone(small.bank);
    bank.questions[0].stemMarkdown += ' Different exact source.';
    const c = unwrap(await resolveEligibility({ kind: 'standalone', bank, difficulty: 'intermediate' }, small.release, small.catalog));
    expect(c.items).toHaveLength(9); expect(c.items.some(i => i.question.id === 'T1')).toBe(false);
    expect(c.excludedCounts['fingerprint-mismatch']).toBe(1);
    expect(await resolveEligibility({ kind: 'standalone', bank, difficulty: 'advanced' }, small.release, small.catalog)).toEqual({ ok: false, code: 'version-mismatch' });
    expect((await resolveEligibility({ kind: 'standalone', bank: { ...bank, version: '9.0.0' }, difficulty: 'intermediate' }, small.release, small.catalog)).ok).toBe(false);
    const edited = structuredClone(small.release); edited.questions[0].hints[0] += ' unapproved';
    expect(await validateStandaloneRelease(edited, bank, 'intermediate', small.catalog)).toEqual({ ok: false, code: 'digest-mismatch' });
    const malformed = structuredClone(small.release); malformed.questions[0].hints[0] = '';
    expect(await validateStandaloneRelease(malformed, bank, 'intermediate', small.catalog)).toEqual({ ok: false, code: 'invalid-release' });
    const unknown = structuredClone(small.release), catalog = structuredClone(small.catalog);
    unknown.questions[0].questionId = 'Unknown'; delete catalog[0].approvedEntries.T1;
    catalog[0].approvedEntries.Unknown = unwrap(await guidanceDigest(small.source, '1.0.0', unknown.questions[0]));
    expect(await validateStandaloneRelease(unknown, bank, 'intermediate', catalog)).toEqual({ ok: false, code: 'invalid-release' });
  });
  it('resumes exact frozen sessions after coverage reduction, preserving commitments; revoked or mismatched frozen content stays inaccessible', async () => {
    const small = await syntheticGuidance();
    let s = unwrap(await startSession({ kind: 'standalone', bank: small.bank, difficulty: 'intermediate', selectionSize: 5, setIndex: 0, id: SESSION_ID, now: NOW }, small.release, small.catalog));
    s = unwrap(applyCommand(s, { kind: 'revealNextHint', questionId: 'T1' }, 0, NOW)).session;
    s = unwrap(applyCommand(s, { kind: 'select', questionId: 'T1', ids: ['A','C'] }, 1, NOW)).session;
    s = unwrap(applyCommand(s, { kind: 'commit', questionId: 'T1', commandId: commandId(1) }, 2, NOW)).session;
    const raw = JSON.stringify(s), catalog = structuredClone(small.catalog);
    for (let i = 6; i <= 10; i++) catalog[0].revokedDigests.push(catalog[0].approvedEntries['T' + i]);
    expect(unwrap(await validateGuidedSession(s, catalog))).toEqual(s);
    catalog[0].revokedDigests.push(catalog[0].approvedEntries.T1);
    expect(await validateGuidedSession(s, catalog)).toEqual({ ok: false, code: 'revoked' });
    const changed = structuredClone(s); changed.items[0].question.stemMarkdown += 'changed';
    expect(await validateGuidedSession(changed, small.catalog)).toEqual({ ok: false, code: 'fingerprint-mismatch' });
    expect(JSON.stringify(s)).toBe(raw);
  });
});
