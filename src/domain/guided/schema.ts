import { z } from 'zod';
import type { Question } from '../bankValidation';

export const LIMITS = Object.freeze({ releaseBytes: 2 * 1024 * 1024, sessionBytes: 4 * 1024 * 1024,
  items: 60, hint: 1500, prose: 12000, sourceText: 200000, options: 100, sources: 100 });
const text = (max: number) => z.string().max(max).refine(s => s.trim().length > 0, 'Nonblank text required');
export const stableIdSchema = z.string().max(200).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
export const versionSchema = z.string().max(100).regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/);
export const fingerprintSchema = z.string().regex(/^sha256:q1:[0-9a-f]{64}$/);
export const guideDigestSchema = z.string().regex(/^sha256:g1:[0-9a-f]{64}$/);
export const timestampSchema = z.number().int().safe().refine(n => Number.isFinite(new Date(n).getTime()));
export const sourceIdentitySchema = z.strictObject({ schemaVersion: z.literal(1), examId: stableIdSchema,
  bankVersion: versionSchema, difficulty: z.enum(['intermediate', 'advanced']) });
export const sourceBindingSchema = sourceIdentitySchema.extend({ questionId: stableIdSchema, sourceFingerprint: fingerprintSchema });
export const domainSchema = z.strictObject({ id: stableIdSchema, title: text(LIMITS.sourceText),
  expectedQuestionCount: z.number().int().min(1).max(60) });
const unique = (values: readonly string[]) => new Set(values).size === values.length;

// Separate subset contract. Text is preserved, never trimmed or normalized here.
export const guidedQuestionSchema = z.strictObject({
  id: stableIdSchema, primaryDomain: stableIdSchema, selectionCount: z.number().int().min(1).max(LIMITS.options),
  stemMarkdown: text(LIMITS.sourceText),
  options: z.array(z.strictObject({ id: stableIdSchema, textMarkdown: text(LIMITS.sourceText) })).min(2).max(LIMITS.options),
  correctOptionIds: z.array(stableIdSchema).min(1).max(LIMITS.options),
  explanationMarkdown: text(LIMITS.sourceText), optionExplanations: z.record(stableIdSchema, text(LIMITS.sourceText)),
  sources: z.array(z.strictObject({ courseTitle: text(LIMITS.sourceText), sectionHeading: text(LIMITS.sourceText),
    url: z.url().max(10000).optional() })).min(1).max(LIMITS.sources),
}).superRefine((q, ctx) => {
  const ids = q.options.map(o => o.id);
  if (!unique(ids) || !unique(q.correctOptionIds) || q.selectionCount > ids.length ||
      q.correctOptionIds.length !== q.selectionCount || q.correctOptionIds.some(id => !ids.includes(id)) ||
      Object.keys(q.optionExplanations).length !== ids.length || ids.some(id => !Object.hasOwn(q.optionExplanations, id))) {
    ctx.addIssue({ code: 'custom', message: 'Invalid option/key/explanation coverage' });
  }
});
export type GuidedQuestion = z.infer<typeof guidedQuestionSchema>;
// Both directions detect added required fields or type drift without changing the Mock validator.
type Assert<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
export type QuestionParity = [Assert<GuidedQuestion extends Question ? true : false>, Assert<Question extends GuidedQuestion ? true : false>,
  Assert<Equal<Question, GuidedQuestion>>];

export const editorialStatusSchema = z.enum(['draft', 'in-review', 'changes-requested', 'approved', 'withheld']);
export const editorialApprovalSchema = z.strictObject({ status: editorialStatusSchema, reviewId: stableIdSchema,
  reviewedAt: z.iso.datetime({ offset: true }).optional() });
export const guideEntrySchema = z.strictObject({
  questionId: stableIdSchema, sourceFingerprint: fingerprintSchema,
  hints: z.tuple([text(LIMITS.hint), text(LIMITS.hint), text(LIMITS.hint)]),
  decisiveCriteria: z.array(text(LIMITS.prose)).min(2).max(4), reasoningMarkdown: text(LIMITS.prose),
  optionComparisons: z.array(z.strictObject({ optionId: stableIdSchema, satisfiesMarkdown: text(LIMITS.prose),
    failsOrLimitsMarkdown: text(LIMITS.prose) })).min(2).max(LIMITS.options),
  closestDistractorIds: z.array(stableIdSchema).min(1).max(LIMITS.options),
  vocabulary: z.array(z.strictObject({ term: text(200), definition: text(LIMITS.prose) })).max(10),
  sourceChecks: z.array(z.strictObject({ sourceIndex: z.number().int().min(0).max(LIMITS.sources - 1),
    claim: text(LIMITS.prose), evidenceLocator: text(LIMITS.prose) })).min(1).max(20),
  approval: z.strictObject({ status: z.literal('approved'), reviewId: stableIdSchema }),
}).superRefine((e, ctx) => {
  if (!unique(e.optionComparisons.map(o => o.optionId)) || !unique(e.closestDistractorIds) ||
      !unique(e.vocabulary.map(v => v.term))) ctx.addIssue({ code: 'custom', message: 'Duplicate guidance identifiers' });
});
export const guideReleaseSchema = z.strictObject({ schemaVersion: z.literal(1), fingerprintVersion: z.literal(1),
  guideVersion: versionSchema, source: sourceIdentitySchema, contentStatus: z.literal('reviewed'),
  questions: z.array(guideEntrySchema).min(1).max(LIMITS.items),
}).superRefine((r, ctx) => {
  if (!unique(r.questions.map(q => q.questionId))) ctx.addIssue({ code: 'custom', message: 'Duplicate guide question' });
});
export const guidedItemDataSchema = z.strictObject({ question: guidedQuestionSchema, domain: domainSchema,
  guide: guideEntrySchema, guideDigest: guideDigestSchema });
export const guidedItemSchema = guidedItemDataSchema.superRefine((item, ctx) => {
  const { question: q, guide: g } = item;
  if (item.domain.id !== q.primaryDomain || g.questionId !== q.id ||
      g.optionComparisons.length !== q.options.length ||
      g.optionComparisons.some((o, i) => o.optionId !== q.options[i]?.id) ||
      g.closestDistractorIds.some(id => !q.options.some(o => o.id === id) || q.correctOptionIds.includes(id)) ||
      g.sourceChecks.some(s => s.sourceIndex >= q.sources.length)) {
    ctx.addIssue({ code: 'custom', message: 'Guidance does not cover this exact source question' });
  }
});
export const reviewFilterSchema = z.enum(['incorrect-unanswered', 'flagged', 'all']);
export const DEFAULT_REVIEW_FILTER = 'incorrect-unanswered' as const;
export const originSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('standalone'), selectionSize: z.union([z.literal(5), z.literal(10)]),
    setIndex: z.number().int().nonnegative().safe() }),
  z.strictObject({ kind: z.literal('post-exam'), sourceAttemptId: text(200), sourceReportHash: z.string().regex(/^[0-9a-f]{64}$/),
    filter: reviewFilterSchema, access: z.discriminatedUnion('kind', [
      z.strictObject({ kind: z.literal('guest-device') }),
      z.strictObject({ kind: z.literal('account'), ownerId: z.uuid() }),
    ]) }),
]);
export const responseSchema = z.strictObject({ selectedOptionIds: z.array(stableIdSchema).max(LIMITS.options),
  maxHintRevealed: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  commitment: z.strictObject({ commandId: z.uuid(), committedAt: timestampSchema }).nullable(),
});
export const guidedSessionSchema = z.strictObject({ schemaVersion: z.literal(1), id: z.uuid(),
  revision: z.number().int().nonnegative().safe(), origin: originSchema, source: sourceIdentitySchema,
  guideVersion: versionSchema, status: z.enum(['in-progress', 'completed']), startedAt: timestampSchema,
  updatedAt: timestampSchema, completedAt: timestampSchema.nullable(),
  currentIndex: z.number().int().nonnegative(), items: z.array(guidedItemSchema).min(1).max(LIMITS.items),
  responses: z.record(stableIdSchema, responseSchema),
}).superRefine((s, ctx) => {
  const bad = () => ctx.addIssue({ code: 'custom', message: 'Inconsistent session state' });
  const ids = s.items.map(i => i.question.id);
  if (!unique(ids) || s.currentIndex >= ids.length || s.updatedAt < s.startedAt ||
      Object.keys(s.responses).length !== ids.length || Object.keys(s.responses).some(id => !ids.includes(id)) ||
      (s.origin.kind === 'standalone' && s.items.length !== s.origin.selectionSize)) bad();
  const commands: string[] = [];
  for (const { question: q } of s.items) {
    const r = s.responses[q.id];
    if (!r) { bad(); continue; }
    if (!unique(r.selectedOptionIds) || r.selectedOptionIds.length > q.selectionCount ||
        r.selectedOptionIds.some(id => !q.options.some(o => o.id === id))) bad();
    if (r.commitment) {
      commands.push(r.commitment.commandId);
      if (r.selectedOptionIds.length !== q.selectionCount || r.commitment.committedAt < s.startedAt ||
          r.commitment.committedAt > s.updatedAt ||
          (s.completedAt !== null && r.commitment.committedAt > s.completedAt)) bad();
    }
  }
  if (!unique(commands)) bad();
  if (s.status === 'completed') {
    if (s.completedAt === null || s.completedAt < s.startedAt || s.completedAt > s.updatedAt ||
        ids.some(id => !s.responses[id]?.commitment)) bad();
  } else if (s.completedAt !== null) bad();
});
export const guidedCommandSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('select'), questionId: stableIdSchema, ids: z.array(stableIdSchema).max(LIMITS.options) }),
  z.strictObject({ kind: z.literal('revealNextHint'), questionId: stableIdSchema }),
  z.strictObject({ kind: z.literal('navigate'), index: z.number().int().nonnegative() }),
  z.strictObject({ kind: z.literal('commit'), questionId: stableIdSchema, commandId: z.uuid() }),
  z.strictObject({ kind: z.literal('finish'), commandId: z.uuid() }),
]);
export type SourceIdentity = z.infer<typeof sourceIdentitySchema>;
export type GuideEntry = z.infer<typeof guideEntrySchema>;
export type GuideRelease = z.infer<typeof guideReleaseSchema>;
export type GuidedItem = z.infer<typeof guidedItemSchema>;
export type GuidedResponse = z.infer<typeof responseSchema>;
export type GuidedSession = z.infer<typeof guidedSessionSchema>;
export type GuidedOrigin = z.infer<typeof originSchema>;
export type GuidedCommand = z.infer<typeof guidedCommandSchema>;
export type GuidedReviewFilter = z.infer<typeof reviewFilterSchema>;

// Check encoded size before Zod traverses an external JSON value. Cycles/non-JSON fail closed.
export function withinJsonLimit(value: unknown, limit: number): boolean {
  try {
    const raw = JSON.stringify(value);
    return typeof raw === 'string' && new TextEncoder().encode(raw).length <= limit;
  } catch { return false; }
}
