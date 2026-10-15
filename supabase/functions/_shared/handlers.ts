import { z } from 'zod';
import { gradeAttempt } from '../../../src/domain/attemptModel.ts';
import { ArchiveError, MAX_REPORT_BYTES, completedReport, reportHash } from '../../../src/domain/cloudReports.ts';

export interface Backend {
  authenticate(token: string): Promise<{ id: string; email?: string }>;
  backup(userId: string, row: Record<string, unknown>): Promise<unknown>;
  deleteReport(userId: string, attemptId: string): Promise<void>;
  deleteAccount(userId: string, email: string, password: string): Promise<void>;
}
export async function boundedJson(request: Request, maxBytes: number): Promise<unknown> {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new ArchiveError('Expected a JSON request.', 'invalid');
  if (Number(request.headers.get('content-length')) > maxBytes) throw new ArchiveError('The request is too large.', 'invalid');
  const reader = request.body?.getReader();
  if (!reader) throw new ArchiveError('Missing request body.', 'invalid');
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) { await reader.cancel(); throw new ArchiveError('The request is too large.', 'invalid'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const combined = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(combined)); }
  catch { throw new ArchiveError('Invalid JSON request.', 'invalid'); }
}
export function createArchiveHandler(operation: 'backup' | 'delete-report' | 'delete-account', backend: Backend, allowedOrigins: string[]) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');
    const allowed = !origin || allowedOrigins.includes(origin);
    const headers: Record<string,string> = {
      'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (origin && allowed) headers['Access-Control-Allow-Origin'] = origin;
    const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (!allowed) return respond({ code: 'auth', message: 'This app origin is not allowed.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return respond({ code: 'invalid', message: 'Use POST.' }, 405);
    try {
      const auth = request.headers.get('authorization');
      if (!auth?.startsWith('Bearer ')) throw new ArchiveError('Sign in to access account history.', 'auth');
      const user = await backend.authenticate(auth.slice(7));
      z.uuid().parse(user.id);
      const input = await boundedJson(request, operation === 'backup' ? MAX_REPORT_BYTES : 4096);
      if (operation === 'backup') {
        const envelope = z.strictObject({ schemaVersion: z.literal(1), attempt: z.unknown() }).parse(input);
        const attempt = completedReport(envelope.attempt);
        if (attempt.id.length > 200) throw new ArchiveError('The attempt ID is too long.', 'invalid');
        const score = gradeAttempt(attempt);
        const row = {
          attempt_id: attempt.id, payload: attempt, payload_hash: await reportHash(attempt),
          exam_id: attempt.snapshot.examId, dataset_version: attempt.datasetVersion,
          difficulty: attempt.difficulty ?? null, title: attempt.snapshot.title,
          started_at: attempt.startedAt, submitted_at: attempt.submittedAt, submission_reason: attempt.submissionReason,
          correct_count: score.correct, total_count: score.total,
          practice_score: Math.round(score.correct * 1000 / score.total), practice_passed: score.correct * 1000 >= 720 * score.total,
        };
        return respond(await backend.backup(user.id, row));
      }
      if (operation === 'delete-report') {
        const { attemptId } = z.strictObject({ attemptId: z.string().min(1).max(200) }).parse(input);
        await backend.deleteReport(user.id, attemptId);
      } else {
        const { password } = z.strictObject({ password: z.string().min(1).max(1024) }).parse(input);
        if (!user.email) throw new ArchiveError('This account cannot be reauthenticated.', 'auth');
        await backend.deleteAccount(user.id, user.email, password);
      }
      return respond({ ok: true });
    } catch (error) {
      if (error instanceof z.ZodError) return respond({ code: 'invalid', message: 'Invalid account request.' }, 400);
      const safe = error instanceof ArchiveError ? error : new ArchiveError('Account service is unavailable. Please retry.');
      const status = safe.code === 'auth' ? 401 : safe.code === 'conflict' || safe.code === 'deleted' ? 409 :
        safe.code === 'quota' || safe.code === 'rate' ? 429 : safe.code === 'invalid' ? 400 : 503;
      return respond({ code: safe.code, message: safe.message }, status);
    }
  };
}
