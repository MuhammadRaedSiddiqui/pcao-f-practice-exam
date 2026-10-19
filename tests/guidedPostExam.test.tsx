import 'fake-indexeddb/auto';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createAttempt, submitAttempt, parseAttempt } from '../src/domain/attemptModel';
import { reportHash } from '../src/domain/cloudReports';
import { buildResultReport } from '../src/domain/reportExport';
import { browserSourceAccess } from '../src/domain/guided/access';
import { createGuidedRepository } from '../src/domain/guided/storage';
import { startSession } from '../src/domain/guided/session';
import { resolveEligibility } from '../src/domain/guided/selectors';
import { createGuidedLoader } from '../src/domain/guided/loader';
import { ResultsPage } from '../src/ui/ResultsPage';
import { syntheticGuidance, unwrap, NOW } from './fixtures/syntheticGuidance';

const ownerId = '33333333-3333-4333-8333-333333333333';
async function fixture() {
  const f = await syntheticGuidance();
  const draft = createAttempt(f.bank, NOW, 'phase5-report', 'intermediate');
  draft.answers = { T1: ['A'], T2: ['A'], T3: ['A', 'B'], T4: ['B'] };
  draft.flags = ['T2', 'T4', 'T5', 'T60'];
  const report = submitAttempt(draft, NOW + 1000);
  return { ...f, report };
}
describe('Completed report Guided Review integration', () => {
  it('durably completes an empty-response retry without changing source bytes, hash or PDF report model', async () => {
    const f = await fixture(); const raw = JSON.stringify(f.report); const hash = await reportHash(f.report);
    const pdf = JSON.stringify(buildResultReport(f.report));
    const values: Record<string, string> = { ['pcao-f:attempt:v1:' + f.report.id]: raw };
    const source = browserSourceAccess(() => null, () => ({ getItem: key => values[key] ?? null }));
    const store = createGuidedRepository({ catalog: f.catalog, access: source, databaseName: 'phase5-' + crypto.randomUUID(),
      protect: async action => ({ gate: { status: 'clear', warnings: [] }, value: await action({ status: 'clear', warnings: [] }) }) });
    try {
      let session = unwrap(await startSession({ kind: 'post-exam', report: f.report, filter: 'flagged', access: { kind: 'guest-device' },
        id: crypto.randomUUID(), now: NOW + 2000 }, f.release, f.catalog));
      expect(session.items.map(i => i.question.id)).toEqual(['T2', 'T4', 'T5']);
      expect(Object.values(session.responses).every(r => !r.selectedOptionIds.length && !r.commitment && r.maxHintRevealed === 0)).toBe(true);
      session = unwrap(await store.create(session)) as typeof session;
      for (const item of session.items) {
        session = unwrap(await store.execute(session.id, session.revision, { kind: 'select', questionId: item.question.id, ids: item.question.correctOptionIds })) as typeof session;
        session = unwrap(await store.execute(session.id, session.revision, { kind: 'commit', questionId: item.question.id, commandId: crypto.randomUUID() })) as typeof session;
      }
      session = unwrap(await store.execute(session.id, session.revision, { kind: 'finish', commandId: crypto.randomUUID() })) as typeof session;
      expect(session.status).toBe('completed'); expect(unwrap(await store.read(session.id))).toEqual(session);
      expect(values['pcao-f:attempt:v1:' + f.report.id]).toBe(raw);
      expect(await reportHash(f.report)).toBe(hash); expect(JSON.stringify(buildResultReport(parseAttempt(JSON.parse(raw))!))).toBe(pdf);
      expect(JSON.stringify(session)).not.toContain('sourceAnswers');
    } finally { store.close(); }
  });
  it('Results adds only an optional submitted launch action and keeps ordinary filters/PDF controls', async () => {
    const { report } = await fixture(); const props = { attempt: report, headingRef: { current: null }, canStart: true, onStart() {}, onHistory() {} };
    const ordinary = renderToStaticMarkup(<ResultsPage {...props} />);
    const enabled = renderToStaticMarkup(<ResultsPage {...props} onGuidedReview={() => {}} />);
    expect(ordinary).not.toContain('>Guided Review<'); expect(enabled).toContain('>Guided Review<');
    for (const text of ['Loading PDF export…', 'Filter question reviews', 'Incorrect (3)', 'Flagged (4)', 'Your results']) expect(enabled).toContain(text);
    // Server rendering cannot complete an import effect. Export must remain unavailable
    // until the actual client module is ready (verified in the browser readiness suite).
    expect(enabled).toContain('data-pdf-export="true" disabled="" aria-busy="true"');
    expect(enabled).toContain('First-use offline export is available only after this finishes.');
    expect(() => renderToStaticMarkup(<ResultsPage {...props} attempt={{ ...report, status: 'in-progress' }} onGuidedReview={() => {}} />)).toThrow('Results require a completed attempt.');
  });
  it('matches independent incorrect/partial/blank/flagged cohorts and unavailable counts', async () => {
    const f = await fixture();
    const defaults = unwrap(await resolveEligibility({ kind: 'post-exam', report: f.report }, f.release, f.catalog));
    expect(defaults.matchedIds).toHaveLength(59); expect(defaults.items.map(i => i.question.id)).toEqual(['T1', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10']);
    expect(defaults.excludedCounts).toEqual({ 'not-published': 50 });
    const flagged = unwrap(await resolveEligibility({ kind: 'post-exam', report: f.report, filter: 'flagged' }, f.release, f.catalog));
    expect(flagged.matchedIds).toEqual(['T2', 'T4', 'T5', 'T60']); expect(flagged.items).toHaveLength(3); expect(flagged.excluded).toHaveLength(1);
  });
  it('loads approved historical releases without requiring every snapshot item to match', async () => {
    const f = await fixture(); const changed = structuredClone(f.report.snapshot); changed.questions[0].stemMarkdown += ' Historical difference';
    const fetcher = vi.fn(async () => new Response(JSON.stringify(f.release), { status: 200 }));
    const loader = createGuidedLoader(fetcher, f.catalog, '/');
    expect((await loader(f.source, '1.0.0', changed)).status).toBe('ready');
    const standalone = unwrap(await resolveEligibility({ kind: 'standalone', bank: changed, difficulty: 'intermediate' }, f.release, f.catalog));
    expect(standalone.items.map(i => i.question.id)).toEqual(['T2','T3','T4','T5','T6','T7','T8','T9','T10']);
    expect(standalone.excludedCounts).toEqual({ 'fingerprint-mismatch': 1, 'not-published': 50 });
    const loaded = await loader(f.source, '1.0.0', changed, { report: true });
    expect(loaded.status).toBe('ready');
    const coverage = unwrap(await resolveEligibility({ kind: 'post-exam', report: { ...f.report, snapshot: changed }, filter: 'all' }, f.release, f.catalog));
    expect(coverage.items).toHaveLength(9); expect(coverage.excludedCounts).toEqual({ 'fingerprint-mismatch': 1, 'not-published': 50 });
    expect(changed.questions[0].stemMarkdown).toContain('Historical difference');
  });
  it('keeps zero eligible and all-correct cohorts empty, supporting legacy optional metadata', async () => {
    const f = await fixture(); const r = structuredClone(f.report); r.flags = ['T60'];
    delete r.result; delete r.difficulty; delete r.revision;
    expect(unwrap(await resolveEligibility({ kind: 'post-exam', report: r, filter: 'flagged' }, f.release, f.catalog)).items).toEqual([]);
    r.answers = Object.fromEntries(r.snapshot.questions.map(q => [q.id, q.correctOptionIds]));
    expect(unwrap(await resolveEligibility({ kind: 'post-exam', report: r }, f.release, f.catalog)).matchedIds).toEqual([]);
    r.difficulty = 'advanced'; expect(await resolveEligibility({ kind: 'post-exam', report: r }, f.release, f.catalog)).toEqual({ ok: false, code: 'version-mismatch' });
  });
});

describe('Downloaded and trusted report authorization port', () => {
  it('confirmed cloud deletion removes only derived records for the exact source owner', async () => {
    vi.stubGlobal('navigator', { locks: { request: async (_name: string, _options: object, action: () => unknown) => action() } });
    const f = await fixture(); const otherOwner = '44444444-4444-4444-8444-444444444444';
    const store = createGuidedRepository({ catalog: f.catalog, databaseName: 'phase5-cleanup-' + crypto.randomUUID(),
      access: { prepare: async s => ({ ok: true, value: { fresh: () => ({ ok: true, value: s.origin.kind === 'post-exam' ? s.origin.access : null }) } }) },
      sourceDeleted: (id, owner) => id === f.report.id && owner === ownerId,
      protect: async action => ({ gate: { status: 'clear', warnings: [] }, value: await action({ status: 'clear', warnings: [] }) }) });
    try {
      const sessions = [];
      for (const owner of [ownerId, otherOwner]) sessions.push(unwrap(await store.create(unwrap(await startSession({ kind: 'post-exam',
        report: f.report, filter: 'flagged', access: { kind: 'account', ownerId: owner }, id: crypto.randomUUID(), now: NOW + 2000 }, f.release, f.catalog)))));
      expect((await store.cleanupPrivate()).ok).toBe(true);
      expect(unwrap(await store.read(sessions[0].id))).toBeNull();
      expect(unwrap(await store.read(sessions[1].id))).toEqual(sessions[1]);
    } finally { store.close(); vi.unstubAllGlobals(); }
  });
  it.each(['downloaded', 'trusted-offline'])('requires a fresh existing owner-authorized %s source and exact hash', async () => {
    const f = await fixture(); let owner: string | null = ownerId; let fresh = true;
    const origin = { kind: 'post-exam' as const, sourceAttemptId: f.report.id, sourceReportHash: await reportHash(f.report),
      filter: 'all' as const, access: { kind: 'account' as const, ownerId } };
    const getItem = vi.fn(() => null);
    const download = vi.fn(async () => ({ attempt: f.report, fresh: () => fresh }));
    const access = browserSourceAccess(() => owner, () => ({ getItem }), download);
    const proof = unwrap(await access.prepare({ origin })); expect(proof.fresh().ok).toBe(true);
    fresh = false; expect(proof.fresh().ok).toBe(false); fresh = true;
    owner = null; expect(proof.fresh().ok).toBe(false);
    expect((await access.prepare({ origin })).ok).toBe(false); expect(download).toHaveBeenCalledTimes(1);
  });
  it('rejects cloud substitution for a present stale local source, and rejects a different downloaded report hash', async () => {
    const f = await fixture(); const origin = { kind: 'post-exam' as const, sourceAttemptId: f.report.id, sourceReportHash: await reportHash(f.report),
      filter: 'all' as const, access: { kind: 'account' as const, ownerId } };
    const downloaded = vi.fn(async () => ({ attempt: f.report, fresh: () => true }));
    const local = browserSourceAccess(() => ownerId, () => ({ getItem: key => key.includes('attempt:v1:') ? '{}' : null }), downloaded);
    expect((await local.prepare({ origin })).ok).toBe(false); expect(downloaded).not.toHaveBeenCalled();
    const changed = { ...f.report, flags: [] };
    const remote = browserSourceAccess(() => ownerId, () => ({ getItem: () => null }), async () => ({ attempt: changed, fresh: () => true }));
    expect((await remote.prepare({ origin })).ok).toBe(false);
  });
  it('rechecks local tombstones after remote preparation and never treats a guest report as a remote source', async () => {
    const f = await fixture(); let marker: string | null = null;
    const origin = { kind: 'post-exam' as const, sourceAttemptId: f.report.id, sourceReportHash: await reportHash(f.report),
      filter: 'all' as const, access: { kind: 'account' as const, ownerId } };
    const download = vi.fn(async () => ({ attempt: f.report, fresh: () => true }));
    const access = browserSourceAccess(() => ownerId, () => ({ getItem: key => key.includes('attempt-owner') ? marker : null }), download);
    const proof = unwrap(await access.prepare({ origin }));
    marker = JSON.stringify({ userId: ownerId, state: 'deleted', createdAt: NOW }); expect(proof.fresh().ok).toBe(false);
    expect((await access.prepare({ origin: { ...origin, access: { kind: 'guest-device' } } })).ok).toBe(false);
    expect(download).toHaveBeenCalledOnce();
  });
});
