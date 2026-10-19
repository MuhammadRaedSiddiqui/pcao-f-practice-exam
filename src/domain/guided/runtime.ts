import { createDifficultyBankLoader } from '../difficulty';
import { productionCatalog } from './catalog';
import { guideCatalogSchema } from './catalog';
import { frozenCopy } from './errors';
import { createGuidedLoader } from './loader';
import { resolveEligibility } from './selectors';
import { failure } from './errors';
import { validateReportSource } from './source';
import { sameSource } from './catalog';
import type { GuidedReviewFilter } from './schema';

export const guidedEnabled = import.meta.env.VITE_GUIDED_PRACTICE_ENABLED === 'true';
export const runtimeCatalog = typeof __GUIDED_LOCAL_CATALOG__ === 'undefined' ? productionCatalog :
  frozenCopy(guideCatalogSchema.parse(__GUIDED_LOCAL_CATALOG__));
const bankLoader = createDifficultyBankLoader();
const guideLoader = createGuidedLoader(fetch, runtimeCatalog);

export async function loadPracticeSource(signal: AbortSignal, retry = false) {
  const row = runtimeCatalog.filter(r => r.source.difficulty === 'intermediate').at(-1);
  if (!row) return failure('not-published');
  const bank = await bankLoader('intermediate', retry);
  if (signal.aborted) return failure('cancelled');
  if (bank.status !== 'ready') return failure('network');
  const loaded = await guideLoader(row.source, row.guideVersion, bank.bank, { signal, retry });
  if (loaded.status !== 'ready') return failure('reason' in loaded ? loaded.reason : 'unavailable');
  const coverage = await resolveEligibility({ kind: 'standalone', bank: bank.bank, difficulty: 'intermediate' }, loaded.release, runtimeCatalog);
  return coverage.ok ? { ok: true as const, value: { bank: bank.bank, release: loaded.release, coverage: coverage.value } } : coverage;
}

// Resolve only against the submitted frozen snapshot, including retained releases.
export async function loadReviewSource(report: unknown, filter: GuidedReviewFilter, signal: AbortSignal) {
  const source = validateReportSource(report, runtimeCatalog);
  if (!source.ok) return source;
  const row = runtimeCatalog.filter(r => sameSource(r.source, source.value.source)).at(-1);
  if (!row) return failure('not-published');
  const loaded = await guideLoader(row.source, row.guideVersion, source.value.bank, { signal, report: true });
  if (loaded.status !== 'ready') return failure('reason' in loaded ? loaded.reason : 'unavailable');
  const coverage = await resolveEligibility({ kind: 'post-exam', report: source.value.report, filter }, loaded.release, runtimeCatalog);
  return coverage.ok ? { ok: true as const, value: { report: source.value.report, release: loaded.release, coverage: coverage.value } } : coverage;
}
