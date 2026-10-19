import { z } from 'zod';
import { questionOutcome } from '../results';
import { validatePublishedRelease, validateFrozenItem, validateStandaloneRelease } from './loader';
import { validateSource, validateReportSource } from './source';
import { sameSource, productionCatalog, type GuideCatalog } from './catalog';
import { guidanceDigest } from './fingerprints';
import { DEFAULT_REVIEW_FILTER, reviewFilterSchema, sourceIdentitySchema, versionSchema, stableIdSchema, guidedItemSchema,
  type GuidedItem, type GuidedReviewFilter } from './schema';
import { failure, frozenCopy, guidedErrorCodes, type GuidedErrorCode, type GuidedResult } from './errors';

export const eligibilitySchema = z.strictObject({
  source: sourceIdentitySchema, guideVersion: versionSchema, matchedIds: z.array(stableIdSchema).max(60),
  items: z.array(guidedItemSchema).max(60),
  excluded: z.array(z.strictObject({ questionId: stableIdSchema, reason: z.enum(guidedErrorCodes) })).max(60),
  excludedCounts: z.partialRecord(z.enum(guidedErrorCodes), z.number().int().min(1).max(60)),
  affectedPublishedEntries: z.boolean(),
}).superRefine((e, ctx) => {
  const ids = [...e.items.map(i => i.question.id), ...e.excluded.map(i => i.questionId)];
  const counts: Partial<Record<GuidedErrorCode, number>> = {};
  e.excluded.forEach(i => { counts[i.reason] = (counts[i.reason] ?? 0) + 1; });
  if (new Set(e.matchedIds).size !== e.matchedIds.length || new Set(ids).size !== ids.length ||
      ids.length !== e.matchedIds.length || ids.some(id => !e.matchedIds.includes(id)) ||
      Object.keys(counts).length !== Object.keys(e.excludedCounts).length ||
      Object.entries(counts).some(([reason, count]) => e.excludedCounts[reason as GuidedErrorCode] !== count)) {
    ctx.addIssue({ code: 'custom', message: 'Invalid eligibility partition/counts' });
  }
});
export type Eligibility = z.infer<typeof eligibilitySchema>;
export type EligibilityRequest = { kind: 'standalone'; bank: unknown; difficulty: 'intermediate' | 'advanced' } |
  { kind: 'post-exam'; report: unknown; filter?: GuidedReviewFilter };

export async function resolveEligibility(request: EligibilityRequest, input: unknown,
  catalog: GuideCatalog = productionCatalog): Promise<GuidedResult<Eligibility>> {
  if (request.kind === 'post-exam' && !reviewFilterSchema.safeParse(request.filter ?? DEFAULT_REVIEW_FILTER).success) return failure('invalid-command');
  const reportSource = request.kind === 'post-exam' ? validateReportSource(request.report, catalog) : null;
  const validated = request.kind === 'standalone' ? validateSource(request.bank, request.difficulty, catalog) : reportSource!;
  if (!validated.ok) return validated;
  const { source, bank } = validated.value;
  const published = request.kind === 'standalone' ? await validateStandaloneRelease(input, bank, source.difficulty, catalog) : await validatePublishedRelease(input, catalog);
  if (!published.ok) return published;
  const release = published.value;
  if (!sameSource(source, release.source)) return failure('version-mismatch');
  const report = reportSource?.ok ? reportSource.value.report : null;
  const filter = request.kind === 'post-exam' ? request.filter ?? DEFAULT_REVIEW_FILTER : 'all';
  const matched = bank.questions.filter(q => !report || filter === 'all' || (filter === 'flagged' ? report.flags.includes(q.id) :
    questionOutcome(q, report.answers[q.id] ?? []) !== 'correct'));
  const result: Eligibility = { source, guideVersion: release.guideVersion, matchedIds: matched.map(q => q.id),
    items: [], excluded: [], excludedCounts: {}, affectedPublishedEntries: false };
  const guides = new Map(release.questions.map(g => [g.questionId, g]));
  // Iterate all published entries for D12 diagnostics, while preserving the filtered source order.
  for (const question of bank.questions) {
    const guide = guides.get(question.id);
    let reason: GuidedErrorCode | null = null;
    let item: GuidedItem | null = null;
    if (!guide) reason = 'not-published';
    else {
      const digest = await guidanceDigest(source, release.guideVersion, guide);
      if (!digest.ok) return digest;
      const valid = await validateFrozenItem({ question, domain: bank.domains.find(d => d.id === question.primaryDomain),
        guide, guideDigest: digest.value }, source, release.guideVersion, catalog);
      if (valid.ok) item = valid.value;
      else {
        if (valid.code !== 'fingerprint-mismatch' && valid.code !== 'revoked') return valid;
        reason = valid.code; result.affectedPublishedEntries = true;
      }
    }
    if (!result.matchedIds.includes(question.id)) continue;
    if (item) result.items.push(item);
    else if (reason) {
      result.excluded.push({ questionId: question.id, reason });
      result.excludedCounts[reason] = (result.excludedCounts[reason] ?? 0) + 1;
    }
  }
  if (release.questions.some(g => !bank.questions.some(q => q.id === g.questionId))) result.affectedPublishedEntries = true;
  return eligibilitySchema.safeParse(result).success ? { ok: true, value: frozenCopy(result) } : failure('invalid-release');
}

export type PracticeSet = { setIndex: number; startIndex: number; endIndex: number; repeatedCount: number };

// Positions refer to verified eligible items, never original bank question numbers.
// Only the final set overlaps; frozen sessions never regenerate their items here.
export function practiceSets(coverage: Eligibility, size: 5 | 10): GuidedResult<PracticeSet[]> {
  if (!eligibilitySchema.safeParse(coverage).success || (size !== 5 && size !== 10)) return failure('invalid-command');
  if (coverage.items.length < size) return failure('insufficient-coverage');
  const count = Math.ceil(coverage.items.length / size);
  return { ok: true, value: frozenCopy(Array.from({ length: count }, (_, setIndex) => {
    const startIndex = Math.min(setIndex * size, coverage.items.length - size);
    return { setIndex, startIndex, endIndex: startIndex + size,
      repeatedCount: setIndex === 0 ? 0 : Math.max(0, setIndex * size - startIndex) };
  })) };
}

export function selectPracticeSet(coverage: Eligibility, size: 5 | 10, setIndex = 0): GuidedResult<GuidedItem[]> {
  if (!Number.isSafeInteger(setIndex) || setIndex < 0) return failure('invalid-command');
  const sets = practiceSets(coverage, size);
  if (!sets.ok) return sets;
  const set = sets.value[setIndex];
  return set ? { ok: true, value: frozenCopy(coverage.items.slice(set.startIndex, set.endIndex)) } : failure('unavailable');
}
