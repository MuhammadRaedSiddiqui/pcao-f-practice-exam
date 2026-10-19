// Excluded synthetic runtime for D12 boundary verification only.
import { syntheticGuidance } from './syntheticGuidance';
import { resolveEligibility } from '../../src/domain/guided/selectors';
import type { GuidedReviewFilter } from '../../src/domain/guided/schema';
const settings = JSON.parse(sessionStorage.getItem('synthetic-d12-fixture') ?? '{"count":11,"revoked":[]}') as { count: number; revoked: number[] };
if (!Number.isSafeInteger(settings.count) || settings.count < 1 || settings.count > 60) throw new Error('Invalid synthetic count');
const fixture = await syntheticGuidance(settings.count);
const catalog = structuredClone(fixture.catalog);
catalog[0].revokedDigests = settings.revoked.map(n => catalog[0].approvedEntries['T' + n]);
export const guidedEnabled = true;
export const runtimeCatalog = catalog;
export async function loadPracticeSource(signal: AbortSignal) {
  if (signal.aborted) return { ok: false as const, code: 'cancelled' as const };
  const coverage = await resolveEligibility({ kind: 'standalone', bank: fixture.bank, difficulty: 'intermediate' }, fixture.release, runtimeCatalog);
  return coverage.ok ? { ok: true as const, value: { bank: fixture.bank, release: fixture.release, coverage: coverage.value } } : coverage;
}
export async function loadReviewSource(report: unknown, filter: GuidedReviewFilter, signal: AbortSignal) {
  if (signal.aborted) return { ok: false as const, code: 'cancelled' as const };
  const coverage = await resolveEligibility({ kind: 'post-exam', report, filter }, fixture.release, runtimeCatalog);
  return coverage.ok ? { ok: true as const, value: { report, release: fixture.release, coverage: coverage.value } } : coverage;
}
