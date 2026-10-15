import { useState } from 'react';
import type { Attempt } from '../domain/attempt';
import { readOwnership } from '../domain/archiveStorage';
import { difficultyLabel } from '../domain/difficulty';
import type { CloudReport } from '../domain/cloudReports';
import type { AccountHistory } from '../hooks/useAccountHistory';
import { Button, Card, Dialog } from './primitives';

function failureText(error: unknown) { return error instanceof Error ? error.message : 'The account action failed. Please retry.'; }
function displayDate(value: number) { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(value); }

export function ReportBackupActions({ account, attempt }: { account: AccountHistory; attempt: Attempt }) {
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<'remove' | 'delete' | null>(null);
  const [error, setError] = useState('');
  const job = account.jobFor(attempt.id);
  const row = account.rows.find(item => item.attempt_id === attempt.id && item.payload_hash === job?.hash);
  let eligible = false;
  let ownerState: string | undefined;
  try { const binding = readOwnership(localStorage, attempt.id); ownerState = binding?.state; eligible = !binding || binding.state !== 'deleted'; } catch { /* Fail closed. */ }
  const status = account.backingUp === attempt.id ? 'Backing up…' :
    job?.state === 'backed-up' ? 'Backed up' : job?.state === 'pending' ? 'Backup pending' :
    job?.state === 'failed' ? 'Backup failed' : job?.state === 'cancelled' || ownerState === 'paused' ? 'Backup paused' : job?.state === 'deleted' || ownerState === 'deleted' ? 'Removed from account · saved on this device' : 'Saved on this device';
  async function perform(action: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await action(); setConfirmation(null); }
    catch (failure) { setError(failureText(failure)); }
    finally { setBusy(false); }
  }
  return <div className="report-backup">
    <p className="backup-state" role="status">{status}</p>
    {job?.error && <p className="muted">{job.error}</p>}
    {account.userId && eligible && (!job || job.state === 'failed' || job.state === 'cancelled') && <Button disabled={busy} onClick={() => void perform(() => job?.state === 'failed' ? account.retry(attempt.id) : account.backUpReport(attempt.id))}>{job?.state === 'cancelled' ? 'Resume backup' : job ? 'Retry backup' : 'Back up report'}</Button>}
    {account.userId && job?.state === 'pending' && <div className="account-actions"><Button disabled={busy} onClick={() => void perform(() => account.retry(attempt.id))}>Retry backup</Button><Button disabled={busy} onClick={() => void perform(() => account.cancelBackup(attempt.id))}>Pause backup</Button></div>}
    {row && job?.state === 'backed-up' && <div className="account-actions">
      <Button disabled={busy} onClick={() => setConfirmation('remove')}>Remove device copy</Button>
      <Button disabled={busy} onClick={() => setConfirmation('delete')}>Delete account report</Button>
    </div>}
    {error && !confirmation && <p role="alert">{error}</p>}
    {confirmation && <Dialog open title={confirmation === 'remove' ? 'Remove device copy?' : 'Delete account report?'} closeDisabled={busy} onClose={() => { if (!busy) setConfirmation(null); }}
      actions={<><Button disabled={busy} onClick={() => setConfirmation(null)}>Cancel</Button><Button disabled={busy} onClick={() => void perform(() => confirmation === 'remove' ? account.removeDevice(attempt.id) : account.deleteReport(row!))}>{busy ? 'Removing…' : confirmation === 'remove' ? 'Remove device copy' : 'Delete account report'}</Button></>}>
      <p>{confirmation === 'remove' ? 'The matching account backup will be checked before this device copy is removed. You can open the account report after signing in.' : 'The report will be removed from your account. Its original device copy will be kept, and old backup requests will not recreate the account report.'}</p>
      {error && <p role="alert">{error}</p>}
    </Dialog>}
  </div>;
}

export function AccountPanel({ account, history, showHistory, showSettings = false, keepCopy, onKeepCopyChange, onOpenReport }: {
  account: AccountHistory; history: Attempt[]; showHistory: boolean; showSettings?: boolean;
  keepCopy: boolean; onKeepCopyChange: (value: boolean) => void; onOpenReport: (row: CloudReport, keep: boolean) => Promise<void>;
}) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<CloudReport | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  if (!account.available || !account.userId) return null;

  const cloudRows = account.rows.filter(row => !history.some(attempt =>
    account.canView(attempt.id) && attempt.id === row.attempt_id && account.jobFor(attempt.id)?.state === 'backed-up' &&
    account.jobFor(attempt.id)?.hash === row.payload_hash));
  async function run(action: () => Promise<unknown>) {
    setBusy(true); setError('');
    try { await action(); }
    catch (failure) { setError(failureText(failure)); }
    finally { setBusy(false); setPassword(''); }
  }
  return <section className="account-section" aria-label={showSettings ? 'Account settings' : 'Account history'}>
    {showSettings && <Card className="account-card">
      <h2>Your account</h2>
      <>
        <p className="account-email">{account.session?.user.email}</p>
        <label className="account-check"><input type="checkbox" checked={account.enabled} disabled={busy} onChange={event => void run(() => account.setAutomatic(event.target.checked))} /><span>Automatically back up new exams after completion</span></label>
        <p className="muted">Active exams stay in this browser. Completed guest reports are backed up automatically when you create an account.</p>
        <label className="account-check"><input type="checkbox" checked={keepCopy} onChange={event => onKeepCopyChange(event.target.checked)} /><span>Keep opened account reports on this trusted device for offline access</span></label>
        <div className="account-actions">
          <Button disabled={busy} onClick={() => void run(account.signOut)}>Sign out</Button>
          <Button disabled={busy} onClick={() => { setDeleteAccountOpen(true); setDeleteConfirmed(false); setError(''); }}>Delete account</Button>
        </div>
      </>
    </Card>}
    {account.error && <div role="alert"><p>{account.error}</p>{account.userId && <Button disabled={account.loading} onClick={() => void account.loadMore(true)}>Retry account history</Button>}</div>}
    {account.notice && <p role="status">{account.notice}</p>}
    {error && !deleting && !deleteAccountOpen && <p role="alert">{error}</p>}
    {showHistory && account.userId && <section className="account-history" aria-labelledby="account-history-title">
      <h2 id="account-history-title">Account reports</h2>
      {account.loading && <p role="status">Loading account history…</p>}
      {!account.loading && !account.rows.length && !account.error && <p className="muted">No account reports yet. Completed reports will appear here after backup.</p>}
      {cloudRows.map(row => <Card className="history-row" key={row.report_id}>
        <div className="history-row__text"><strong>Completed {displayDate(row.submitted_at!)}</strong><span>{difficultyLabel(row.difficulty ?? undefined)} · Practice score {row.practice_score} / 1000 · {row.correct_count} / {row.total_count} correct · Dataset {row.dataset_version}</span><span className={'practice-status practice-status--' + (row.practice_passed ? 'passed' : 'failed')}>{row.practice_passed ? 'Passed' : 'Failed'}</span><span>Account report</span></div>
        <div className="account-actions"><Button disabled={busy} onClick={() => void run(() => onOpenReport(row, keepCopy))}>Open account report</Button><Button disabled={busy} onClick={() => setDeleting(row)}>Delete account report</Button></div>
      </Card>)}
      {account.more && <Button disabled={account.loading} onClick={() => void account.loadMore()}>Load more account reports</Button>}
    </section>}
    {deleting && <Dialog open title="Delete account report?" closeDisabled={busy} onClose={() => { if (!busy) setDeleting(null); }}
      actions={<><Button disabled={busy} onClick={() => setDeleting(null)}>Cancel</Button><Button disabled={busy} onClick={() => void run(async () => { await account.deleteReport(deleting); setDeleting(null); })}>{busy ? 'Deleting…' : 'Delete account report'}</Button></>}>
      <p>This removes the account backup and downloaded account copies. Any original device report is kept. Old queued uploads will not recreate the backup.</p>{error && <p role="alert">{error}</p>}
    </Dialog>}
    {deleteAccountOpen && <Dialog open title="Delete your account?" closeDisabled={busy} onClose={() => { if (!busy) { setDeleteAccountOpen(false); setPassword(''); } }}>
      <form className="account-form" onSubmit={event => { event.preventDefault(); if (deleteConfirmed) void run(async () => { await account.deleteAccount(password); setDeleteAccountOpen(false); }); }}>
        <p>Your account and all account reports will be deleted. Open any reports you want to keep and export them as PDFs from Results before deleting your account. Retained account-bound device originals will stay private until you clear this site’s browser data.</p>
        <label>Current password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required disabled={busy} /></label>
        <label className="account-check"><input type="checkbox" checked={deleteConfirmed} onChange={event => setDeleteConfirmed(event.target.checked)} required disabled={busy} /><span>I understand that my account reports will be deleted.</span></label>
        {error && <p role="alert">{error}</p>}
        <div className="account-actions"><Button disabled={busy} onClick={() => { setDeleteAccountOpen(false); setPassword(''); }}>Cancel</Button><Button type="submit" disabled={busy || !deleteConfirmed}>{busy ? 'Deleting account…' : 'Delete my account'}</Button></div>
      </form>
    </Dialog>}
  </section>;
}
