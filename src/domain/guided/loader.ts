import { guideReleaseSchema, guidedItemDataSchema, guidedItemSchema, LIMITS, withinJsonLimit, type GuideRelease, type GuidedItem, type SourceIdentity } from './schema';
import { catalogRelease, entryApproval, productionCatalog, sameSource, type GuideCatalog } from './catalog';
import { guidanceDigest, questionFingerprint } from './fingerprints';
import { validateSource } from './source';
import { failure, frozenCopy, type GuidedErrorCode, type GuidedResult } from './errors';

export const RELEASE_TIMEOUT_MS = 15000;
export type GuidedLoadState = { status: 'idle' | 'loading' } | { status: 'ready'; release: GuideRelease } |
  { status: 'unavailable' | 'error'; reason: GuidedErrorCode };

// Approval validation is independent of source coverage. Revoked entries retain identity but cannot be selected.
export async function validatePublishedRelease(input: unknown, catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<GuideRelease>> {
  if (!withinJsonLimit(input, LIMITS.releaseBytes)) return failure('resource-limit');
  const parsed = guideReleaseSchema.safeParse(input);
  if (!parsed.success) return failure('invalid-release');
  const release = parsed.data;
  const row = catalogRelease(release.source, release.guideVersion, catalog);
  if (!row.ok) return row;
  if (release.questions.length !== Object.keys(row.value.approvedEntries).length) return failure('invalid-release');
  for (const entry of release.questions) {
    const digest = await guidanceDigest(release.source, release.guideVersion, entry);
    if (!digest.ok) return digest;
    const approved = entryApproval(row.value, entry.questionId, digest.value);
    if (!approved.ok && approved.code !== 'revoked') return failure('digest-mismatch');
    // A revoked digest must still belong to this exact question/source/version allowlist.
    if (row.value.approvedEntries[entry.questionId] !== digest.value) return failure('digest-mismatch');
  }
  return { ok: true, value: frozenCopy(release) };
}

export async function validateFrozenItem(input: unknown, source: SourceIdentity, guideVersion: string,
  catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<GuidedItem>> {
  const parsed = guidedItemDataSchema.safeParse(input);
  if (!parsed.success) return failure('invalid-source');
  const item = parsed.data;
  const row = catalogRelease(source, guideVersion, catalog);
  if (!row.ok) return row;
  const q1 = await questionFingerprint(source, item.domain, item.question);
  if (!q1.ok) return q1;
  if (q1.value !== item.guide.sourceFingerprint) return failure('fingerprint-mismatch');
  if (!guidedItemSchema.safeParse(item).success) return failure('invalid-release');
  const g1 = await guidanceDigest(source, guideVersion, item.guide);
  if (!g1.ok) return g1;
  if (g1.value !== item.guideDigest) return failure('digest-mismatch');
  const approval = entryApproval(row.value, item.question.id, g1.value);
  return approval.ok ? { ok: true, value: frozenCopy(item) } : approval;
}

export async function validateStandaloneRelease(input: unknown, bank: unknown, difficulty: 'intermediate' | 'advanced',
  catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<GuideRelease>> {
  const source = validateSource(bank, difficulty, catalog);
  if (!source.ok) return source;
  const published = await validatePublishedRelease(input, catalog);
  if (!published.ok) return published;
  const release = published.value;
  if (!sameSource(source.value.source, release.source)) return failure('version-mismatch');
  for (const guide of release.questions) {
    const question = source.value.bank.questions.find(q => q.id === guide.questionId);
    const domain = source.value.bank.domains.find(d => d.id === question?.primaryDomain);
    if (!question || !domain) return failure('invalid-release');
    const digest = await guidanceDigest(release.source, release.guideVersion, guide);
    if (!digest.ok) return digest;
    const item = await validateFrozenItem({ question, domain, guide, guideDigest: digest.value }, release.source, release.guideVersion, catalog);
    // D12: verified release integrity remains mandatory. A withdrawn or exact-source
    // mismatched entry cannot be selected; eligibility partitions those items below.
    if (!item.ok && item.code !== 'revoked' && item.code !== 'fingerprint-mismatch') return item;
  }
  return published;
}

// Call only after the eventual controller's Mock gate. No browser storage is accessed here.
export function createGuidedLoader(fetcher: typeof fetch = fetch, catalog: GuideCatalog = productionCatalog,
  baseUrl = import.meta.env.BASE_URL) {
  const cache = new Map<string, GuideRelease>();
  return async (source: SourceIdentity, guideVersion: string, bank: unknown,
    options: { retry?: boolean; signal?: AbortSignal; report?: boolean } = {}): Promise<GuidedLoadState> => {
    const row = catalogRelease(source, guideVersion, catalog);
    if (!row.ok) return { status: 'unavailable', reason: row.code };
    if (options.signal?.aborted) return { status: 'error', reason: 'cancelled' };
    const key = row.value.path;
    if (options.retry) cache.delete(key);
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let onAbort: (() => void) | undefined;
    const stop = new Promise<GuidedLoadState>(resolve => {
      timer = setTimeout(() => { controller.abort(); resolve({ status: 'error', reason: 'timeout' }); }, RELEASE_TIMEOUT_MS);
      onAbort = () => { controller.abort(); resolve({ status: 'error', reason: 'cancelled' }); };
      options.signal?.addEventListener('abort', onAbort, { once: true });
    });
    const work = async (): Promise<GuidedLoadState> => {
      try {
        let input: unknown = cache.get(key);
        if (!input) {
          const response = await fetcher(baseUrl.replace(/\/?$/, '/') + row.value.path, { signal: controller.signal });
          if (!response.ok) return { status: 'error', reason: 'network' };
          // Bound streaming response bytes before allocating/parsing the complete payload.
          if (Number(response.headers.get('content-length')) > LIMITS.releaseBytes) return { status: 'error', reason: 'resource-limit' };
          const reader = response.body?.getReader();
          if (!reader) return { status: 'error', reason: 'invalid-release' };
          const chunks: Uint8Array[] = [];
          let size = 0;
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              size += value.length;
              if (size > LIMITS.releaseBytes) { await reader.cancel(); return { status: 'error', reason: 'resource-limit' }; }
              chunks.push(value);
            }
          } finally { reader.releaseLock(); }
          const bytes = new Uint8Array(size);
          let offset = 0;
          for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
          try { input = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
          catch { return { status: 'error', reason: 'invalid-release' }; }
        }
        const valid = options.report ? await validatePublishedRelease(input, catalog) : await validateStandaloneRelease(input, bank, source.difficulty, catalog);
        if (controller.signal.aborted) return { status: 'error', reason: 'cancelled' };
        if (!valid.ok) return { status: valid.code === 'revoked' || valid.code === 'version-mismatch' ? 'unavailable' : 'error', reason: valid.code };
        cache.set(key, valid.value);
        return { status: 'ready', release: valid.value };
      } catch { return { status: 'error', reason: controller.signal.aborted ? 'cancelled' : 'network' }; }
    };
    try { return await Promise.race([work(), stop]); }
    finally { clearTimeout(timer); if (onAbort) options.signal?.removeEventListener('abort', onAbort); }
  };
}
