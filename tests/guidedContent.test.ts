import { beforeAll, describe, it, expect, vi } from 'vitest';
import { productionCatalog, catalogRelease, entryApproval, guideCatalogSchema } from '../src/domain/guided/catalog';
import { validatePublishedRelease, validateStandaloneRelease, createGuidedLoader, RELEASE_TIMEOUT_MS } from '../src/domain/guided/loader';
import { LIMITS } from '../src/domain/guided/schema';
import { guidanceDigest } from '../src/domain/guided/fingerprints';
import { syntheticGuidance, unwrap } from './fixtures/syntheticGuidance';

describe('Approved publication catalog and bounded loader', () => {
  let f: Awaited<ReturnType<typeof syntheticGuidance>>;
  beforeAll(async () => { f = await syntheticGuidance(); });
  it('has an empty immutable production catalog with no synthetic bypass', async () => {
    expect(productionCatalog).toEqual([]); expect(Object.isFrozen(productionCatalog)).toBe(true);
    expect(await validatePublishedRelease(f.release)).toEqual({ ok: false, code: 'not-published' });
    expect((await validatePublishedRelease(f.release, f.catalog)).ok).toBe(true);
  });
  it('does not accept a forged approved field, edited wording, or absent entry', async () => {
    const edited = structuredClone(f.release); edited.questions[0].hints[0] += '!';
    expect(await validatePublishedRelease(edited, f.catalog)).toEqual({ ok: false, code: 'digest-mismatch' });
    expect(await validatePublishedRelease({ ...f.release, questions: f.release.questions.slice(1) }, f.catalog)).toEqual({ ok: false, code: 'invalid-release' });
    const draft = structuredClone(f.release) as any; draft.questions[0].approval.status = 'draft';
    expect(await validatePublishedRelease(draft, f.catalog)).toEqual({ ok: false, code: 'invalid-release' });
  });
  it('binds every approved digest to its source/version/question, respects revocation', () => {
    expect(catalogRelease(f.source, '9.0.0', f.catalog)).toEqual({ ok: false, code: 'version-mismatch' });
    expect(entryApproval(f.catalog[0], 'T2', f.catalog[0].approvedEntries.T1)).toEqual({ ok: false, code: 'unapproved' });
    const row = structuredClone(f.catalog[0]); row.revokedDigests.push(row.approvedEntries.T1);
    expect(entryApproval(row, 'T1', row.approvedEntries.T1)).toEqual({ ok: false, code: 'revoked' });
    expect(guideCatalogSchema.safeParse([f.catalog[0], f.catalog[0]]).success).toBe(false);
  });
  it('retains an old approved version beside a newly approved immutable version', async () => {
    const release = structuredClone(f.release); release.guideVersion = '1.0.1'; release.questions[0].hints[0] += ' new';
    const row = structuredClone(f.catalog[0]); row.guideVersion = '1.0.1'; row.path = 'guided/synthetic-only-v1.0.1.json';
    row.approvedEntries = Object.fromEntries(await Promise.all(release.questions.map(async q => [q.questionId, unwrap(await guidanceDigest(f.source, '1.0.1', q))])));
    const catalog = [...f.catalog, row];
    expect((await validatePublishedRelease(f.release, catalog)).ok).toBe(true);
    expect((await validatePublishedRelease(release, catalog)).ok).toBe(true);
    expect(await validatePublishedRelease({ ...f.release, guideVersion: '1.0.1' }, catalog)).toEqual({ ok: false, code: 'digest-mismatch' });
  });
  it('validates all published entries against full source before standalone; bounds resource bytes', async () => {
    expect((await validateStandaloneRelease(f.release, f.bank, 'intermediate', f.catalog)).ok).toBe(true);
    expect(await validateStandaloneRelease(f.release, f.bank, 'advanced', f.catalog)).toEqual({ ok: false, code: 'version-mismatch' });
    expect(await validatePublishedRelease('x'.repeat(LIMITS.releaseBytes), f.catalog)).toEqual({ ok: false, code: 'resource-limit' });
  });
  it('rejects malformed all-option/source coverage even when its digest is catalog-approved', async () => {
    const release = structuredClone(f.release); release.questions[0].sourceChecks[0].sourceIndex = 1;
    const catalog = structuredClone(f.catalog);
    catalog[0].approvedEntries.T1 = unwrap(await guidanceDigest(f.source, '1.0.0', release.questions[0]));
    expect(await validateStandaloneRelease(release, f.bank, 'intermediate', catalog)).toEqual({ ok: false, code: 'invalid-release' });
  });
  it('fetches a BASE_URL-aware immutable release, caches success and revalidates the supplied bank', async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response(JSON.stringify(f.release)));
    const load = createGuidedLoader(fetcher, f.catalog, '/nested/');
    expect((await load(f.source, '1.0.0', f.bank)).status).toBe('ready');
    expect(fetcher.mock.calls[0][0]).toBe('/nested/guided/synthetic-only-v1.0.0.json');
    expect((await load(f.source, '1.0.0', f.bank)).status).toBe('ready'); expect(fetcher).toHaveBeenCalledTimes(1);
    const changed = structuredClone(f.bank); changed.questions[0].explanationMarkdown += '!';
    // D12 keeps a verified release available; mismatched entries are excluded by eligibility.
    expect((await load(f.source, '1.0.0', changed)).status).toBe('ready');
    expect((await load(f.source, '1.0.0', f.bank, { retry: true })).status).toBe('ready'); expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('does not fetch unpublished content, and allows explicit retry after failure', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error('network')).mockResolvedValue(new Response(JSON.stringify(f.release)));
    expect(await createGuidedLoader(fetcher)(f.source, '1.0.0', f.bank)).toEqual({ status: 'unavailable', reason: 'not-published' });
    expect(fetcher).not.toHaveBeenCalled();
    const load = createGuidedLoader(fetcher, f.catalog);
    expect(await load(f.source, '1.0.0', f.bank)).toEqual({ status: 'error', reason: 'network' });
    expect((await load(f.source, '1.0.0', f.bank, { retry: true })).status).toBe('ready');
  });
  it('rejects invalid JSON, non-OK HTTP and oversized declared/streamed responses', async () => {
    for (const response of [new Response('{'), new Response('', { status: 500 }),
      new Response('{}', { headers: { 'content-length': String(LIMITS.releaseBytes + 1) } }),
      new Response('x'.repeat(LIMITS.releaseBytes + 1))]) {
      const result = await createGuidedLoader(async () => response, f.catalog)(f.source, '1.0.0', f.bank);
      expect(result.status).toBe('error');
    }
  });
  it('cancels before/after fetch, rejects late responses and finitely times out even uncooperative fetchers', async () => {
    const controller = new AbortController(); controller.abort();
    const spy = vi.fn<typeof fetch>();
    expect(await createGuidedLoader(spy, f.catalog)(f.source, '1.0.0', f.bank, { signal: controller.signal }))
      .toEqual({ status: 'error', reason: 'cancelled' }); expect(spy).not.toHaveBeenCalled();
    vi.useFakeTimers();
    try {
      const load = createGuidedLoader(() => new Promise(() => {}), f.catalog);
      const pending = load(f.source, '1.0.0', f.bank);
      await vi.advanceTimersByTimeAsync(RELEASE_TIMEOUT_MS);
      expect(await pending).toEqual({ status: 'error', reason: 'timeout' });
      const cancellation = new AbortController();
      const second = load(f.source, '1.0.0', f.bank, { signal: cancellation.signal }); cancellation.abort();
      expect(await second).toEqual({ status: 'error', reason: 'cancelled' });
    } finally { vi.useRealTimers(); }
  });
  it('ignores a late fetch acknowledgement after cancellation instead of populating success cache', async () => {
    let acknowledge!: (response: Response) => void;
    const fetcher = vi.fn<typeof fetch>().mockImplementationOnce(() => new Promise(resolve => { acknowledge = resolve; }))
      .mockImplementation(async () => new Response(JSON.stringify(f.release)));
    const load = createGuidedLoader(fetcher, f.catalog);
    const controller = new AbortController();
    const first = load(f.source, '1.0.0', f.bank, { signal: controller.signal }); controller.abort();
    expect(await first).toEqual({ status: 'error', reason: 'cancelled' });
    acknowledge(new Response(JSON.stringify(f.release)));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect((await load(f.source, '1.0.0', f.bank)).status).toBe('ready');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
