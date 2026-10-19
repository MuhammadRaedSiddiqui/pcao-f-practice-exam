import { z } from 'zod';
import { parseAttempt, type Attempt } from '../attemptModel';
import { validateQuestionBank, type QuestionBank } from '../bankValidation';
import { recognizedSources, productionCatalog, type GuideCatalog } from './catalog';
import { sourceIdentitySchema, type SourceIdentity } from './schema';
import { failure, frozenCopy, type GuidedResult } from './errors';

export type ValidatedSource = { source: SourceIdentity; bank: QuestionBank };
export const sourceCompatibilitySchema = z.discriminatedUnion('status', [
  z.strictObject({ status: z.literal('compatible'), source: sourceIdentitySchema }),
  z.strictObject({ status: z.literal('unavailable'), reason: z.enum(['invalid-source', 'unsupported-source', 'version-mismatch']) }),
]);
export type SourceCompatibility = z.infer<typeof sourceCompatibilitySchema>;
export function validateSource(input: unknown, difficulty?: 'intermediate' | 'advanced', catalog: GuideCatalog = productionCatalog): GuidedResult<ValidatedSource> {
  const parsed = validateQuestionBank(input);
  if (!parsed.ok) return failure('invalid-source');
  const bank = parsed.bank;
  const recognized = [...recognizedSources, ...catalog.map(r => r.source)].find(s =>
    s.schemaVersion === bank.schemaVersion && s.examId === bank.examId && s.bankVersion === bank.version);
  if (!recognized) return failure('unsupported-source');
  if (difficulty !== undefined && recognized.difficulty !== difficulty) return failure('version-mismatch');
  const source = sourceIdentitySchema.safeParse({ schemaVersion: bank.schemaVersion, examId: bank.examId,
    bankVersion: bank.version, difficulty: difficulty ?? recognized.difficulty });
  return source.success ? { ok: true, value: frozenCopy({ source: source.data, bank }) } : failure('invalid-source');
}
export function validateReportSource(input: unknown, catalog: GuideCatalog = productionCatalog): GuidedResult<ValidatedSource & { report: Attempt }> {
  const report = parseAttempt(input);
  if (!report) return failure('invalid-source');
  if (report.status !== 'submitted') return failure('not-submitted');
  const source = validateSource(report.snapshot, report.difficulty, catalog);
  return source.ok ? { ok: true, value: frozenCopy({ ...source.value, report }) } : source;
}

export function sourceCompatibility(input: unknown, difficulty?: 'intermediate' | 'advanced', catalog: GuideCatalog = productionCatalog): SourceCompatibility {
  const result = validateSource(input, difficulty, catalog);
  return result.ok ? { status: 'compatible', source: result.value.source } : { status: 'unavailable',
    reason: result.code === 'unsupported-source' || result.code === 'version-mismatch' ? result.code : 'invalid-source' };
}
