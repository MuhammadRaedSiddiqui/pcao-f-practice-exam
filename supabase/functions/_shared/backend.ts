import { createClient } from '@supabase/supabase-js';
import { ArchiveError } from '../../../src/domain/cloudReports.ts';
import type { Backend } from './handlers.ts';
export function backend(url: string, publicKey: string, secret: string): Backend {
  const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  function databaseError(error: { message: string }) {
    if (error.message.includes('ARCHIVE_CONFLICT')) throw new ArchiveError('A different report already uses this attempt ID. Both copies were kept.', 'conflict');
    if (error.message.includes('ARCHIVE_DELETED')) throw new ArchiveError('This report was removed from the account.', 'deleted');
    if (error.message.includes('ARCHIVE_QUOTA')) throw new ArchiveError('Your account backup limit has been reached. Export or manage your reports.', 'quota');
    if (error.message.includes('ARCHIVE_RATE')) throw new ArchiveError('Backup is temporarily rate limited. Please retry shortly.', 'rate');
    throw new ArchiveError('Account storage is unavailable. Please retry.');
  }
  return {
    async authenticate(token) {
      const { data, error } = await admin.auth.getUser(token);
      if (error || !data.user) throw new ArchiveError('Sign in again to use account history.', 'auth');
      return { id: data.user.id, email: data.user.email };
    },
    async backup(userId, row) {
      const { data, error } = await admin.rpc('archive_backup', { p_user_id: userId, p_report: row });
      if (error) databaseError(error);
      return data;
    },
    async deleteReport(userId, attemptId) {
      const { error } = await admin.rpc('archive_delete', { p_user_id: userId, p_attempt_id: attemptId });
      if (error) databaseError(error);
    },
    async deleteAccount(userId, email, password) {
      const verifier = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { data, error } = await verifier.auth.signInWithPassword({ email, password });
      if (error || data.user?.id !== userId) throw new ArchiveError('The current password is incorrect.', 'auth');
      const { error: removalError } = await admin.auth.admin.deleteUser(userId);
      if (removalError) throw new ArchiveError('Account deletion failed. Please retry.');
    },
  };
}
