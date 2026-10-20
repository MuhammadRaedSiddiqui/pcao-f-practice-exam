// Supplied only by the local pilot Vite plugin; no original authoring drafts imported.
import fixture from 'virtual:d14-local-pilot';
import { resolveEligibility } from '../../src/domain/guided/selectors';
import { createGuidedLoader } from '../../src/domain/guided/loader';
import { failure } from '../../src/domain/guided/errors';
import type { GuideCatalog } from '../../src/domain/guided/catalog';
import type { GuidedReviewFilter } from '../../src/domain/guided/schema';

export const guidedEnabled = true;
export const runtimeCatalog: GuideCatalog = fixture.catalog;
const loader = createGuidedLoader(fetch, runtimeCatalog, '/');
export async function loadPracticeSource(signal: AbortSignal, retry = false) {
  if (signal.aborted) return failure('cancelled');
  const response = await fetch('/easy-question-bank.json', { signal });
  if (!response.ok) return failure('network');
  const bank: unknown = await response.json();
  const row = runtimeCatalog[0];
  const loaded = await loader(row.source, row.guideVersion, bank, { signal, retry });
  if (loaded.status !== 'ready') return failure('reason' in loaded ? loaded.reason : 'unavailable');
  const coverage = await resolveEligibility({ kind:'standalone', bank, difficulty:'intermediate' }, loaded.release, runtimeCatalog);
  return coverage.ok ? { ok:true as const, value:{ bank, release:loaded.release, coverage:coverage.value } } : coverage;
}
// D14 uses standalone practice only. Existing Mock/Results remain unchanged.
export async function loadReviewSource(_report: unknown, _filter: GuidedReviewFilter, _signal: AbortSignal) {
  return failure('not-published');
}
