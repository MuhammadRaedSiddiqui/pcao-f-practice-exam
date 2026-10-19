// Test-only module replacement. Never imported by application source or a production build.
import { syntheticGuidance } from './syntheticGuidance';
import { resolveEligibility } from '../../src/domain/guided/selectors';
import type { GuidedReviewFilter } from '../../src/domain/guided/schema';
const fixture = await syntheticGuidance();
export const guidedEnabled = true;
export const runtimeCatalog = fixture.catalog;
export async function loadPracticeSource(signal: AbortSignal) {
  if (signal.aborted) return { ok: false as const, code: 'cancelled' as const };
  const coverage = await resolveEligibility({ kind: 'standalone', bank: fixture.bank, difficulty: 'intermediate' }, fixture.release, fixture.catalog);
  return coverage.ok ? { ok: true as const, value: { bank: fixture.bank, release: fixture.release, coverage: coverage.value } } : coverage;
}
export async function loadReviewSource(report: unknown, filter: GuidedReviewFilter, signal: AbortSignal) {
  if (signal.aborted) return { ok: false as const, code: 'cancelled' as const };
  const coverage = await resolveEligibility({ kind: 'post-exam', report, filter }, fixture.release, fixture.catalog);
  return coverage.ok ? { ok: true as const, value: { report, release: fixture.release, coverage: coverage.value } } : coverage;
}
