import { z } from 'zod';
import { gradeAttempt, parseAttempt, type Attempt } from './attemptModel.ts';

export const REPORT_SCHEMA_VERSION = 1;
export const HASH_VERSION = 1;
export const MAX_REPORT_BYTES = 1024 * 1024;
export const HISTORY_PAGE_SIZE = 20;

export class ArchiveError extends Error {
  constructor(message: string, public readonly code: string = 'temporary') { super(message); }
}

const savedTimestamp = z.number().int().refine(value => Number.isFinite(new Date(value).getTime()), 'Invalid saved date');
const metadataSchema = z.object({
  report_id: z.uuid(), user_id: z.uuid(), attempt_id: z.string().min(1),
  payload_hash: z.string().regex(/^[a-f0-9]{64}$/), hash_version: z.literal(HASH_VERSION),
  payload_schema_version: z.literal(REPORT_SCHEMA_VERSION),
  uploaded_at: z.iso.datetime({ offset: true }), deleted_at: z.iso.datetime({ offset: true }).nullable(),
  submitted_at: savedTimestamp.nullable(), started_at: savedTimestamp.nullable(),
  difficulty: z.enum(['intermediate', 'advanced']).nullable(), dataset_version: z.string().nullable(),
  title: z.string().nullable(), exam_id: z.string().nullable(),
  submission_reason: z.enum(['manual', 'time expired']).nullable(),
  correct_count: z.number().int().nonnegative().nullable(), total_count: z.literal(60).nullable(),
  practice_score: z.number().int().min(0).max(1000).nullable(), practice_passed: z.boolean().nullable(),
}).superRefine((value, context) => {
  if (value.deleted_at) return;
  if (value.submitted_at === null || value.started_at === null || value.dataset_version === null ||
      value.title === null || value.exam_id === null || value.submission_reason === null ||
      value.correct_count === null || value.total_count === null || value.practice_score === null ||
      value.practice_passed === null || value.correct_count > value.total_count ||
      value.practice_score !== Math.round(value.correct_count * 1000 / value.total_count) ||
      value.practice_passed !== (value.correct_count * 1000 >= 720 * value.total_count) ||
      value.submitted_at < value.started_at) context.addIssue({ code: 'custom', message: 'Invalid report metadata' });
});
export type CloudReport = z.infer<typeof metadataSchema>;
export const REPORT_COLUMNS = 'report_id,user_id,attempt_id,payload_hash,hash_version,payload_schema_version,uploaded_at,deleted_at,submitted_at,started_at,difficulty,dataset_version,title,exam_id,submission_reason,correct_count,total_count,practice_score,practice_passed';

export function parseCloudMetadata(input: unknown): CloudReport {
  const parsed = metadataSchema.safeParse(input);
  if (!parsed.success) throw new ArchiveError('The account report metadata is damaged or unsupported.', 'invalid');
  return parsed.data;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.entries(value).filter(([, child]) => child !== undefined)
      .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
      .map(([key, child]) => JSON.stringify(key) + ':' + canonical(child)).join(',') + '}';
  }
  return JSON.stringify(value);
}

export function completedReport(input: unknown): Attempt {
  const attempt = parseAttempt(input);
  if (!attempt || attempt.status !== 'submitted' || !Number.isInteger(attempt.startedAt) || !Number.isInteger(attempt.deadlineAt) || !Number.isInteger(attempt.submittedAt)) throw new ArchiveError('Only a valid completed report can be backed up.', 'invalid');
  if (new TextEncoder().encode(JSON.stringify(attempt)).byteLength > MAX_REPORT_BYTES)
    throw new ArchiveError('This report exceeds the backup size limit.', 'invalid');
  return attempt;
}

export async function reportHash(input: unknown): Promise<string> {
  const attempt = completedReport(input);
  // Revision and navigation are local bookkeeping. Normalize legacy grades and equivalent selections.
  const { revision: _revision, currentQuestionId: _position, ...saved } = attempt;
  const value = {
    ...saved, result: gradeAttempt(attempt), flags: [...attempt.flags].sort(),
    answers: Object.fromEntries(attempt.snapshot.questions.map(question => [question.id, [...(attempt.answers[question.id] ?? [])].sort()])),
  };
  const bytes = new TextEncoder().encode(canonical({ hashVersion: HASH_VERSION, attempt: value }));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map(byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function validateCloudPayload(row: CloudReport, input: unknown, owner: string): Promise<Attempt> {
  const attempt = completedReport(input);
  const score = gradeAttempt(attempt);
  if (row.user_id !== owner || row.deleted_at || row.attempt_id !== attempt.id ||
      row.payload_hash !== await reportHash(attempt) || row.started_at !== attempt.startedAt ||
      row.submitted_at !== attempt.submittedAt || row.dataset_version !== attempt.datasetVersion ||
      row.difficulty !== (attempt.difficulty ?? null) || row.exam_id !== attempt.snapshot.examId ||
      row.title !== attempt.snapshot.title || row.submission_reason !== attempt.submissionReason ||
      row.correct_count !== score.correct || row.total_count !== score.total)
    throw new ArchiveError('The account report does not match its saved snapshot.', 'invalid');
  return attempt;
}

export function retryDelay(failures: number, random = Math.random()): number {
  return Math.min(300_000, 2000 * 2 ** Math.min(failures, 7)) * (0.8 + random * 0.4);
}
