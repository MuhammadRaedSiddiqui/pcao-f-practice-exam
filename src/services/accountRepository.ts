import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ArchiveError, HISTORY_PAGE_SIZE, REPORT_COLUMNS, completedReport, parseCloudMetadata, reportHash, validateCloudPayload, type CloudReport } from '../domain/cloudReports';
import type { Attempt } from '../domain/attempt';

export function errorFrom(error: unknown): ArchiveError {
  if (error instanceof ArchiveError) return error;
  const value = error as { status?: number; code?: string };
  const status = value?.status;
  if (status === 401 || status === 403) return new ArchiveError('Sign in again to continue account backup.', 'auth');
  return new ArchiveError('Account history is unavailable. Your device reports are safe. Please retry.', 'temporary');
}
export function accountRepository(client: SupabaseClient) {
  async function invoke(name: string, body: Record<string, unknown>, expectedOwner: string) {
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session || sessionData.session.user.id !== expectedOwner) throw new ArchiveError('Sign in to use account history.', 'auth');
    const { data, error } = await client.functions.invoke(name, {
      body, headers: { Authorization: 'Bearer ' + sessionData.session.access_token },
    });
    if (error) {
      const response = (error as { context?: Response }).context;
      if (response instanceof Response) {
        const detail = await response.json().catch(() => null);
        if (detail?.code) throw new ArchiveError(detail.message ?? 'The account request could not be completed.', detail.code);
      }
      throw errorFrom(error);
    }
    return data;
  }
  return {
    async preferences(userId: string): Promise<boolean> {
      const { data, error } = await client.from('account_preferences').select('automatic_backup_enabled').eq('user_id', userId).maybeSingle();
      if (error) throw errorFrom(error);
      return data?.automatic_backup_enabled === true;
    },
    async setPreferences(userId: string, enabled: boolean) {
      const { error } = await client.from('account_preferences').upsert({ user_id: userId, automatic_backup_enabled: enabled });
      if (error) throw errorFrom(error);
    },
    async list(userId: string, cursor?: CloudReport): Promise<CloudReport[]> {
      let query = client.from('attempt_reports').select(REPORT_COLUMNS).eq('user_id', userId).is('deleted_at', null)
        .order('submitted_at', { ascending: false }).order('report_id', { ascending: false }).limit(HISTORY_PAGE_SIZE);
      if (cursor) query = query.or('submitted_at.lt.' + cursor.submitted_at + ',and(submitted_at.eq.' + cursor.submitted_at + ',report_id.lt.' + cursor.report_id + ')');
      const { data, error } = await query;
      if (error) throw errorFrom(error);
      const rows = (data ?? []).map(parseCloudMetadata);
      if (rows.some(row => row.user_id !== userId || row.deleted_at)) throw new ArchiveError('Account history ownership mismatch.', 'invalid');
      return rows;
    },
    async receipt(userId: string, attemptId: string): Promise<CloudReport | null> {
      const { data, error } = await client.from('attempt_reports').select(REPORT_COLUMNS).eq('user_id', userId).eq('attempt_id', attemptId).maybeSingle();
      if (error) throw errorFrom(error);
      const row = data ? parseCloudMetadata(data) : null;
      if (row && row.user_id !== userId) throw new ArchiveError('Account ownership mismatch.', 'invalid');
      return row;
    },
    async download(userId: string, reportId: string): Promise<{ row: CloudReport; attempt: Attempt }> {
      const { data, error } = await client.from('attempt_reports').select(REPORT_COLUMNS + ',payload').eq('user_id', userId).eq('report_id', reportId).is('deleted_at', null).single();
      if (error) throw errorFrom(error);
      const row = parseCloudMetadata(data);
      return { row, attempt: await validateCloudPayload(row, (data as unknown as { payload: unknown }).payload, userId) };
    },
    async backup(userId: string, input: Attempt) {
      const attempt = completedReport(input);
      const data = await invoke('backup-report', { schemaVersion: 1, attempt }, userId);
      const receipt = z.object({ reportId: z.uuid(), hash: z.string(), status: z.enum(['created', 'already-backed-up']) }).parse(data);
      if (receipt.hash !== await reportHash(attempt)) throw new ArchiveError('Backup acknowledgement did not match this report.', 'invalid');
      const row = await this.receipt(userId, attempt.id);
      if (!row || row.deleted_at || row.payload_hash !== receipt.hash) throw new ArchiveError('The backup could not be verified.', 'temporary');
      return row;
    },
    async deleteReport(userId: string, attemptId: string) { await invoke('delete-report', { attemptId }, userId); },
    async deleteAccount(userId: string, password: string) { await invoke('delete-account', { password }, userId); },
  };
}
export type AccountRepository = ReturnType<typeof accountRepository>;
