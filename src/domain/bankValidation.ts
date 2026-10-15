import { z } from 'zod';

export const EXPECTED_DOMAIN_COUNTS = {
  D1: 8, D2: 13, D3: 7, D4: 10, D5: 7, D6: 9, D7: 6,
} as const;
export const EXPECTED_QUESTION_COUNT = 60;
export const EXPECTED_DURATION_MINUTES = 120;
export const SCHEMA_VERSION = 1;

const nonblank = z.string().trim().min(1, 'Required text is missing');
const stableId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, 'Use a stable ID with letters, numbers, dots, underscores, or hyphens');
const optionSchema = z.strictObject({ id: stableId, textMarkdown: nonblank });
const sourceSchema = z.strictObject({
  courseTitle: nonblank,
  sectionHeading: nonblank,
  url: z.url().optional(),
});
const questionSchema = z.strictObject({
  id: stableId,
  primaryDomain: stableId,
  selectionCount: z.number().int().positive(),
  stemMarkdown: nonblank,
  options: z.array(optionSchema).min(2),
  correctOptionIds: z.array(stableId).min(1),
  explanationMarkdown: nonblank,
  optionExplanations: z.record(stableId, nonblank),
  sources: z.array(sourceSchema).min(1),
});
const bankSchema = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  examId: stableId,
  version: nonblank,
  title: nonblank,
  durationMinutes: z.number().int().positive(),
  expectedQuestionCount: z.number().int().positive(),
  domains: z.array(z.strictObject({
    id: stableId,
    title: nonblank,
    expectedQuestionCount: z.number().int().positive(),
  })),
  contentStatus: z.enum(['pending', 'synthetic', 'reviewed']),
  questions: z.array(questionSchema),
});
export type QuestionBank = z.infer<typeof bankSchema>;
export type Question = QuestionBank['questions'][number];
export type BankValidation = { ok: true; bank: QuestionBank } | { ok: false; errors: string[] };

export function validateQuestionBank(input: unknown, requireReviewed = true): BankValidation {
  const parsed = bankSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map(issue =>
      `${issue.path.join('.') || 'question bank'}: ${issue.message}`) };
  }
  const bank = parsed.data;
  const errors: string[] = [];
  if (requireReviewed && bank.contentStatus !== 'reviewed') {
    errors.push('The reviewed question bank is not available yet. Practice attempts are disabled.');
  }
  if (bank.durationMinutes !== EXPECTED_DURATION_MINUTES) errors.push('Duration must be 120 minutes.');
  if (bank.expectedQuestionCount !== EXPECTED_QUESTION_COUNT || bank.questions.length !== EXPECTED_QUESTION_COUNT) {
    errors.push('The bank must declare and contain exactly 60 questions.');
  }
  const expectedDomainIds = Object.keys(EXPECTED_DOMAIN_COUNTS);
  if (bank.domains.length !== expectedDomainIds.length) errors.push('The bank must define domains D1–D7 exactly once.');
  const domains = new Map<string, number>();
  for (const domain of bank.domains) {
    if (domains.has(domain.id)) errors.push(`Duplicate domain ID: ${domain.id}.`);
    domains.set(domain.id, domain.expectedQuestionCount);
    const expected = EXPECTED_DOMAIN_COUNTS[domain.id as keyof typeof EXPECTED_DOMAIN_COUNTS];
    if (expected === undefined) errors.push(`Unknown domain: ${domain.id}.`);
    else if (domain.expectedQuestionCount !== expected) errors.push(`${domain.id} must declare ${expected} questions.`);
  }
  for (const id of expectedDomainIds) if (!domains.has(id)) errors.push(`Missing domain: ${id}.`);
  const questionIds = new Set<string>();
  const counts = new Map<string, number>();
  for (const question of bank.questions) {
    const label = `Question ${question.id}`;
    if (questionIds.has(question.id)) errors.push(`Duplicate question ID: ${question.id}.`);
    questionIds.add(question.id);
    if (!domains.has(question.primaryDomain)) errors.push(`${label} refers to undefined domain ${question.primaryDomain}.`);
    counts.set(question.primaryDomain, (counts.get(question.primaryDomain) ?? 0) + 1);
    const optionIds = new Set<string>();
    for (const option of question.options) {
      if (optionIds.has(option.id)) errors.push(`${label} has duplicate option ID ${option.id}.`);
      optionIds.add(option.id);
    }
    if (question.selectionCount > question.options.length) errors.push(`${label} selects more options than it offers.`);
    if (question.correctOptionIds.length !== question.selectionCount) errors.push(`${label} needs exactly ${question.selectionCount} correct option IDs.`);
    if (new Set(question.correctOptionIds).size !== question.correctOptionIds.length) errors.push(`${label} repeats a correct option ID.`);
    for (const id of question.correctOptionIds) if (!optionIds.has(id)) errors.push(`${label} has unknown correct option ID ${id}.`);
    for (const id of optionIds) if (!Object.hasOwn(question.optionExplanations, id)) errors.push(`${label} needs an explanation for option ${id}.`);
    for (const id of Object.keys(question.optionExplanations)) if (!optionIds.has(id)) errors.push(`${label} has an explanation for unknown option ${id}.`);
  }
  for (const [id, count] of Object.entries(EXPECTED_DOMAIN_COUNTS)) {
    if ((counts.get(id) ?? 0) !== count) errors.push(`${id} must contain ${count} questions; found ${counts.get(id) ?? 0}.`);
  }
  return errors.length ? { ok: false, errors } : { ok: true, bank };
}
