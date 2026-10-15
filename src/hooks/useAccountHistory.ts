import { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { accountClient, rememberAccount, clearAccountSession, passwordRecoveryEnabled, initialAuthCallback } from '../services/supabaseClient';
import { accountRepository, errorFrom } from '../services/accountRepository';
import { ArchiveError, HISTORY_PAGE_SIZE, reportHash, retryDelay, parseCloudMetadata, validateCloudPayload, type CloudReport } from '../domain/cloudReports';
import { archiveKey, archiveStore, claimAttempt, claimGuestReports, pauseAttempt, markDeleted, readOwnership, removeDeviceReport, visibleTo, type ArchiveJob } from '../domain/archiveStorage';
import { listAttempts, recoverAttempt, type Attempt, type AttemptStorage } from '../domain/attempt';
import { withBrowserStorageLock } from '../domain/browserStorage';
import { EMAIL_FORMAT_MESSAGE, validRegistrationEmail } from '../domain/email';
import { authRequests } from '../services/authRequests';
import { RECOVERY_UNAVAILABLE_MESSAGE, RECOVERY_LINK_ERROR, recoveryErrorMessage } from '../domain/passwordRecovery';
import { createRecoveryContext, cleanAuthCallbackUrl } from '../domain/recoveryContext';
import { setAnalyticsUser, trackEvent } from '../services/analytics';

export function useAccountHistory(storage: AttemptStorage, history: Attempt[], refreshDevice: () => void) {
  const [client] = useState(accountClient);
  const [repository] = useState(() => client ? accountRepository(client) : null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(client));
  const [enabled, setEnabled] = useState(false);
  const [rows, setRows] = useState<CloudReport[]>([]);
  const [jobs, setJobs] = useState<ArchiveJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [backingUp, setBackingUp] = useState<string | null>(null);
  const [syncTick, setSyncTick] = useState(0);
  const [recovery, setRecovery] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryContext] = useState(() => createRecoveryContext(() => window.sessionStorage));
  const owner = useRef<string | null>(null);
  const epoch = useRef(0);
  const mounted = useRef(false);
  const busy = useRef(false);
  const current = useRef({ storage, history, refreshDevice, preferenceVersion: 0, authTransition: false, signupPreparing: false, cursor: undefined as CloudReport | undefined, listVersion: 0 });
  current.current = { ...current.current, storage, history, refreshDevice };
  const userId = session?.user.id ?? null;
  const active = (id: string, version: number) => mounted.current && owner.current === id && epoch.current === version;
  const signature = history.filter(item => item.status === 'submitted').map(item => item.id + ':' + (item.revision ?? 0)).join('|');

  useEffect(() => {
    mounted.current = true;
    if (!client) { setAnalyticsUser(null); return () => { mounted.current = false; }; }
    let eventSeen = false;
    const adopt = (next: Session | null) => {
      const id = next?.user.id ?? null;
      if (!passwordRecoveryEnabled) recoveryContext.clear();
      setRecovery(passwordRecoveryEnabled && recoveryContext.matches(next));
      setAnalyticsUser(id);
      if (owner.current !== id) { owner.current = id; epoch.current += 1; }
      setSession(next); if (!current.current.authTransition) setAuthLoading(false);
    };
    const { data } = client.auth.onAuthStateChange((event, next) => {
      if (next && !authRequests.acceptSession()) return;
      eventSeen = true;
      if (event === 'PASSWORD_RECOVERY' && passwordRecoveryEnabled && next) {
        if (!recoveryContext.begin(next)) setRecoveryError(RECOVERY_LINK_ERROR);
      }
      adopt(next);
    });
    void client.auth.initialize().then(({ error: failure }) => {
      if (!mounted.current || !initialAuthCallback.present) return;
      if (passwordRecoveryEnabled && (failure || initialAuthCallback.failed)) {
        recoveryContext.clear(); setRecovery(false); setRecoveryError(RECOVERY_LINK_ERROR);
      }
      // Never display raw provider descriptions or retain callback credentials.
      try { window.history.replaceState(window.history.state, '', cleanAuthCallbackUrl(window.location.href)); } catch { /* Recovery errors remain visible. */ }
    }).catch(() => {
      if (mounted.current && passwordRecoveryEnabled && initialAuthCallback.present) setRecoveryError(RECOVERY_LINK_ERROR);
    });
    void client.auth.getSession().then(({ data: initial, error: failure }) => {
      if (!mounted.current || eventSeen) return;
      if (failure) setError('The account session could not be restored. Please sign in again.');
      adopt(initial.session);
    }).catch(() => { if (mounted.current) { setAnalyticsUser(null); setAuthLoading(false); setError('Account access is unavailable.'); } });
    const signedOutElsewhere = (event: StorageEvent) => {
      if (event.key !== 'pcao-f:account-signout:v1') return;
      const previous = owner.current;
      recoveryContext.clear();
      clearAccountSession(); client.auth.stopAutoRefresh(); adopt(null); setRecovery(false);
      if (previous) void archiveStore.clearOwner(previous).catch(() => {});
    };
    window.addEventListener('storage', signedOutElsewhere);
    return () => { mounted.current = false; epoch.current += 1; data.subscription.unsubscribe(); window.removeEventListener('storage', signedOutElsewhere); };
  }, [client]);

  async function loadMore(reset = false) {
    const id = owner.current;
    if (!id || !repository) return;
    const version = epoch.current;
    const listVersion = ++current.current.listVersion;
    const latest = () => active(id, version) && current.current.listVersion === listVersion;
    setLoading(true); setError('');
    try {
      const batch = await repository.list(id, reset ? undefined : current.current.cursor);
      if (!latest()) return;
      setRows(previous => reset ? batch : [...previous, ...batch.filter(row => !previous.some(item => item.report_id === row.report_id))]);
      current.current.cursor = batch.at(-1);
      setMore(batch.length === HISTORY_PAGE_SIZE);
    } catch (failure) {
      if (latest()) {
        setError(errorFrom(failure).message);
        try {
          const cached = await archiveStore.copies(id);
          const valid: CloudReport[] = [];
          for (const copy of cached) {
            try { const row = parseCloudMetadata(copy.metadata); await validateCloudPayload(row, copy.payload, id); valid.push(row); } catch { /* A damaged copy cannot hide other valid copies. */ }
          }
          if (latest() && reset && valid.length) { setRows(valid.sort((a,b) => b.submitted_at! - a.submitted_at!)); setMore(false); }
        } catch { /* Keep the network error when the optional cache is unavailable. */ }
      }
    }
    finally { if (latest()) setLoading(false); }
  }

  useEffect(() => {
    current.current.cursor = undefined; current.current.listVersion += 1;
    setRows([]); setJobs([]); setEnabled(false); setMore(false); setError(''); setNotice(''); setLoading(false); setBackingUp(null);
    if (!userId || !repository) return;
    const version = epoch.current;
    const preferenceVersion = current.current.preferenceVersion;
    void repository.preferences(userId).then(value => { if (active(userId, version) && preferenceVersion === current.current.preferenceVersion) setEnabled(value); })
      .catch(failure => { if (active(userId, version)) setError(errorFrom(failure).message); });
    void loadMore(true);
    void archiveStore.jobs(userId).then(value => { if (active(userId, version)) setJobs(value); })
      .catch(() => { if (active(userId, version)) setError('Device backup bookkeeping is unavailable. Your reports are kept on this device.'); });
  }, [userId, repository]);

  useEffect(() => {
    if (!userId) return;
    const wake = () => setSyncTick(value => value + 1);
    const timer = window.setInterval(wake, 15_000);
    window.addEventListener('online', wake);
    window.addEventListener('storage', wake);
    return () => { clearInterval(timer); window.removeEventListener('online', wake); window.removeEventListener('storage', wake); };
  }, [userId]);

  useEffect(() => {
    if (!userId || !repository || busy.current || current.current.signupPreparing) return;
    const version = epoch.current;
    const id = userId;
    let disposed = false;
    async function sync() {
      if (!active(id, version) || busy.current || !navigator.onLine) return;
      busy.current = true;
      try {
        await navigator.locks.request('pcao-f:archive-sync:v1:' + id, async () => {
          if (!active(id, version) || disposed) return;
          const existing = await archiveStore.jobs(id);
          const loaded = listAttempts(current.current.storage);
          let processed = 0;
          for (const attempt of loaded.attempts) {
            if (!active(id, version) || disposed) return;
            if (processed >= 5) break;
            if (attempt.status !== 'submitted') continue;
            const ownership = readOwnership(current.current.storage, attempt.id);
            if (ownership?.userId !== id || ownership.state !== 'eligible') continue;
            const hash = await reportHash(attempt);
            const old = existing.find(job => job.attemptId === attempt.id);
            if (old && old.hash !== hash) {
              await archiveStore.put({ ...old, state: 'failed', error: 'The device report changed after backup was queued.' });
              continue;
            }
            const job: ArchiveJob = old ?? {
              key: archiveKey(id, attempt.id), userId: id, attemptId: attempt.id, hash, state: 'pending', failures: 0, nextRetryAt: 0,
            };
            if (job.state !== 'pending' || job.nextRetryAt > Date.now()) continue;
            processed += 1;
            await archiveStore.put(job);
            if (!active(id, version) || disposed) return;
            setBackingUp(attempt.id);
            try {
              // Check tombstones before uploading, including after independent archive-cache eviction.
              const receipt = await repository!.receipt(id, attempt.id);
              if (!active(id, version) || disposed) return;
              if (receipt?.deleted_at) throw new ArchiveError('This report was removed from the account.', 'deleted');
              if (receipt && receipt.payload_hash !== hash) throw new ArchiveError('A different account report uses this attempt ID.', 'conflict');
              if (readOwnership(current.current.storage, attempt.id)?.state !== 'eligible') continue;
              const saved = receipt ?? await repository!.backup(id, attempt);
              if (!active(id, version) || disposed) return;
              if (readOwnership(current.current.storage, attempt.id)?.state !== 'eligible') continue;
              await archiveStore.put({ ...job, state: 'backed-up', reportId: saved.report_id, error: undefined });
              if (active(id, version)) trackEvent('report_backup_succeeded', { difficulty: attempt.difficulty ?? 'original', attempt_id: attempt.id });
              setRows(previous => [saved, ...previous.filter(row => row.report_id !== saved.report_id)]
                .sort((a, b) => (b.submitted_at! - a.submitted_at!) || b.report_id.localeCompare(a.report_id)));
            } catch (failure) {
              if (!active(id, version) || disposed) return;
              if (readOwnership(current.current.storage, attempt.id)?.state !== 'eligible') continue;
              const safe = errorFrom(failure);
              if (safe.code === 'deleted') await withBrowserStorageLock(() => markDeleted(current.current.storage, attempt.id, id));
              const transient = ['temporary', 'rate'].includes(safe.code);
              await archiveStore.put({
                ...job, state: safe.code === 'deleted' ? 'deleted' : transient || safe.code === 'auth' ? 'pending' : 'failed',
                failures: job.failures + 1, nextRetryAt: Date.now() + retryDelay(job.failures + 1), error: safe.message,
              });
              if (['auth', 'rate', 'quota'].includes(safe.code)) { setError(safe.message); break; }
            }
          }
          if (active(id, version)) setJobs(await archiveStore.jobs(id));
        });
      } catch (failure) { if (active(id, version)) setError(failure instanceof ArchiveError ? failure.message : 'Device backup could not be updated. Your original reports were kept.'); }
      finally {
        busy.current = false;
        if (active(id, version)) setBackingUp(null);
      }
    }
    void sync();
    return () => { disposed = true; };
  }, [userId, repository, signature, syncTick]);

  async function authenticate(mode: 'signup' | 'signin', email: string, password: string, remember: boolean, signal?: AbortSignal) {
    if (!client) throw new ArchiveError('Account history has not been configured.', 'invalid');
    if (current.current.authTransition) throw new ArchiveError('Please wait for sign-out to finish.');
    if (mode === 'signup' && !validRegistrationEmail(email.trim())) throw new ArchiveError(EMAIL_FORMAT_MESSAGE, 'invalid');
    signal?.throwIfAborted();
    rememberAccount(remember);
    client.auth.startAutoRefresh();
    current.current.signupPreparing = mode === 'signup';
    try {
      const { data, error: failure } = await authRequests.run(async () => mode === 'signup'
        ? await client.auth.signUp({ email: email.trim(), password })
        : await client.auth.signInWithPassword({ email: email.trim(), password }), signal);
      signal?.throwIfAborted();
      if (failure) throw new ArchiveError(mode === 'signup' ? 'Account creation failed. Check your email and password, or try signing in.' : 'Sign-in failed. Check your email and password.');
      if (!data.session) throw new ArchiveError('Email confirmation is enabled on the project. The project administrator must disable it for immediate signup access.', 'configuration');
      if (!active(data.session.user.id, epoch.current)) return;
      recoveryContext.clear(); setRecovery(false); setRecoveryError('');
      setAnalyticsUser(data.session.user.id);
      trackEvent(mode === 'signup' ? 'signup_succeeded' : 'login_succeeded', { method: 'email_password' });
      if (mode === 'signup') {
        const id = data.session.user.id;
        const version = epoch.current;
        if (!active(id, version)) return;
        try {
          const migration = await withBrowserStorageLock(() => {
            signal?.throwIfAborted();
            if (!active(id, version)) throw new ArchiveError('The account changed.', 'auth');
            return claimGuestReports(current.current.storage, id);
          });
          if (signal?.aborted || !active(id, version)) return;
          if (migration.ids.length) await queueCompletedReports(migration.ids);
          else setNotice('Account created. No completed device history to migrate.');
          if (active(id, version) && migration.unreadable) {
            setError('Some device reports could not be migrated. Your account was created and the original reports were kept. Retry saved attempts or back up those reports when storage is available.');
          }
        } catch {
          if (!signal?.aborted && active(id, version)) {
            setError('Your account was created, but device history could not be prepared for backup. Your original reports were kept.');
          }
        }
      }
    } finally {
      current.current.signupPreparing = false;
      if (mounted.current && mode === 'signup') setSyncTick(value => value + 1);
    }
  }

  async function signOut() {
    if (!client) return;
    const id = owner.current;
    if (id) trackEvent('logout_succeeded');
    setAnalyticsUser(null);
    recoveryContext.clear(); setRecoveryError('');
    current.current.authTransition = true; setAuthLoading(true);
    // Invalidate callbacks and hide account data even if remote logout fails offline.
    owner.current = null; epoch.current += 1; setSession(null); setRows([]); setJobs([]); setEnabled(false); setRecovery(false);
    const { error: failure } = await client.auth.signOut({ scope: 'local' });
    clearAccountSession();
    if (failure) client.auth.stopAutoRefresh();
    try { localStorage.setItem('pcao-f:account-signout:v1', crypto.randomUUID()); } catch { /* Device session still clears. */ }
    if (id) await archiveStore.clearOwner(id).catch(() => setError('Signed out. Some downloaded device copies could not be cleared.'));
    if (failure) setError('Signed out on this device. The remote sign-out request could not complete.');
    current.current.authTransition = false;
    if (mounted.current) setAuthLoading(false);
  }

  async function setAutomatic(value: boolean) {
    const id = owner.current; const version = epoch.current;
    if (!id || !repository) return;
    const previous = enabled;
    current.current.preferenceVersion += 1;
    setEnabled(value);
    try { await repository.setPreferences(id, value); }
    catch (failure) { if (active(id, version)) setEnabled(previous); throw failure; }
    if (active(id, version)) { setEnabled(value); setNotice(value ? 'New exams will back up after completion.' : 'Automatic backup is off. Existing queued backups are unchanged.'); }
  }

  // Called within the exam's existing lock after its first successful save.
  function bindNewAttempt(attempt: Attempt) {
    if (userId && owner.current === userId && enabled) claimAttempt(storage, attempt.id, userId);
  }

  async function queueCompletedReports(ids: string[]) {
    const id = owner.current; const version = epoch.current;
    if (!id) throw new ArchiveError('Sign in to back up your reports.', 'auth');
    let queued = 0; let failed = 0;
    for (const attemptId of ids) {
      if (!active(id, version)) break;
      try {
        await withBrowserStorageLock(() => {
          if (!active(id, version)) throw new ArchiveError('The account changed.', 'auth');
          const recovered = recoverAttempt(storage, attemptId);
          if (!recovered.ok || recovered.attempt?.status !== 'submitted') throw new ArchiveError('The report is unavailable.', 'invalid');
          claimAttempt(storage, attemptId, id);
        });
        const recovered = recoverAttempt(storage, attemptId);
        if (!recovered.ok || !recovered.attempt) throw new ArchiveError('The report is unavailable.', 'invalid');
        const hash = await reportHash(recovered.attempt);
        const existing = (await archiveStore.jobs(id)).find(job => job.attemptId === attemptId);
        if (existing?.state === 'deleted') throw new ArchiveError('This backup was deleted.', 'deleted');
        if (existing?.state !== 'backed-up') await archiveStore.put({
          key: archiveKey(id, attemptId), userId: id, attemptId, hash, state: 'pending', failures: 0, nextRetryAt: 0,
        });
        queued += 1;
      } catch { failed += 1; }
    }
    const updatedJobs = await archiveStore.jobs(id);
    if (active(id, version)) {
      setJobs(updatedJobs);
      setNotice(queued + ' report(s) queued or already backed up' + (failed ? '; ' + failed + ' could not be queued.' : '.'));
      setSyncTick(value => value + 1);
    }
  }

  async function backUpReport(attemptId: string) {
    await queueCompletedReports([attemptId]);
  }

  async function cancelBackup(attemptId: string) {
    const id = owner.current; const version = epoch.current;
    if (!id) return;
    await withBrowserStorageLock(() => { if (!active(id, version)) throw new ArchiveError('The account changed.', 'auth'); pauseAttempt(storage, attemptId, id); });
    const job = (await archiveStore.jobs(id)).find(item => item.attemptId === attemptId);
    if (job) await archiveStore.put({ ...job, state: 'cancelled', error: undefined });
    if (active(id, version)) { setJobs(await archiveStore.jobs(id)); setNotice('Backup paused. A request already sent may have completed; resume to verify its status.'); }
  }

  async function retry(attemptId: string) {
    const id = owner.current;
    if (!id) return;
    const job = (await archiveStore.jobs(id)).find(item => item.attemptId === attemptId);
    if (job && job.state !== 'deleted') await archiveStore.put({ ...job, state: 'pending', nextRetryAt: 0, error: undefined });
    setSyncTick(value => value + 1);
  }

  async function download(row: CloudReport, keepCopy = false): Promise<Attempt> {
    const id = owner.current; const version = epoch.current;
    if (!repository || !id || row.user_id !== id) throw new ArchiveError('Sign in to the account that owns this report.', 'auth');
    let attempt: Attempt;
    if (!navigator.onLine) {
      const cached = await archiveStore.copy(id, row.attempt_id);
      if (!cached) throw new ArchiveError('This report has no saved device copy. Connect to open it.');
      attempt = await validateCloudPayload(row, cached.payload, id);
    } else {
      attempt = (await repository.download(id, row.report_id)).attempt;
    }
    if (!active(id, version)) throw new ArchiveError('The account changed before the report opened.', 'auth');
    if (keepCopy) {
      try { await archiveStore.cache(id, row.attempt_id, attempt, row); }
      catch { if (active(id, version)) setNotice('The account report opened, but its device copy could not be saved.'); }
      if (!active(id, version)) { await archiveStore.removeCopy(id, row.attempt_id); throw new ArchiveError('The account changed.', 'auth'); }
    }
    return attempt;
  }

  async function deleteReport(row: CloudReport) {
    const id = owner.current; const version = epoch.current;
    if (!repository || !id || row.user_id !== id) throw new ArchiveError('Sign in to the report owner account.', 'auth');
    await repository.deleteReport(id, row.attempt_id);
    if (!active(id, version)) return;
    await withBrowserStorageLock(() => markDeleted(storage, row.attempt_id, id));
    await archiveStore.put({ key: archiveKey(id,row.attempt_id),userId:id,attemptId:row.attempt_id,hash:row.payload_hash,state:'deleted',failures:0,nextRetryAt:0 });
    await archiveStore.removeCopy(id, row.attempt_id);
    if (active(id, version)) { setRows(previous => previous.filter(item => item.report_id !== row.report_id)); setJobs(await archiveStore.jobs(id)); current.current.refreshDevice(); }
  }

  async function removeDevice(attemptId: string) {
    const id = owner.current; const version = epoch.current;
    if (!repository || !id) throw new ArchiveError('Sign in to verify your backup.', 'auth');
    const recovered = recoverAttempt(storage, attemptId);
    if (!recovered.ok || !recovered.attempt) throw new ArchiveError('The device report could not be read.', 'invalid');
    const row = await repository.receipt(id, attemptId);
    if (!row || row.deleted_at || row.payload_hash !== await reportHash(recovered.attempt)) throw new ArchiveError('A matching account backup must be verified before removing the device copy.', 'invalid');
    if (!active(id, version)) throw new ArchiveError('The account changed.', 'auth');
    await withBrowserStorageLock(() => {
      if (!active(id, version)) throw new ArchiveError('The account changed.', 'auth');
      removeDeviceReport(storage, attemptId, id);
    });
    current.current.refreshDevice();
  }

  async function deleteAccount(password: string) {
    const id = owner.current; const version = epoch.current;
    if (!repository || !id) throw new ArchiveError('Sign in before deleting your account.', 'auth');
    await repository.deleteAccount(id, password);
    if (!active(id, version)) return;
    // Mark retained originals rather than making them guest data on a shared browser.
    let cleanupFailed = false;
    try {
      await withBrowserStorageLock(() => {
        for (const attempt of listAttempts(storage).attempts) {
          if (readOwnership(storage, attempt.id)?.userId === id) markDeleted(storage, attempt.id, id);
        }
      });
      await archiveStore.clearOwner(id, true);
    } catch { cleanupFailed = true; }
    await signOut();
    setNotice(cleanupFailed ? 'Account deleted. Some private device data could not be cleared; remove this site’s browser data on shared devices.' : 'Account deleted. Account-bound device originals remain private until you clear this site’s browser data.');
  }

  async function requestRecovery(email: string, signal?: AbortSignal) {
    if (!passwordRecoveryEnabled) throw new ArchiveError(RECOVERY_UNAVAILABLE_MESSAGE, 'configuration');
    if (!client) throw new ArchiveError('Password recovery is unavailable because account access is not configured. Contact the app administrator.', 'configuration');
    const { error: failure } = await authRequests.run(() => client.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + import.meta.env.BASE_URL }), signal);
    if (failure) throw new ArchiveError(recoveryErrorMessage(failure));
  }
  async function updatePassword(password: string, signal?: AbortSignal) {
    if (!passwordRecoveryEnabled) throw new ArchiveError(RECOVERY_UNAVAILABLE_MESSAGE, 'configuration');
    const id = owner.current; const version = epoch.current;
    if (!client || !id || !recovery || !recoveryContext.matches(session)) throw new ArchiveError('Open a password recovery link first.', 'auth');
    if (password.length < 8) throw new ArchiveError('Use at least 8 characters for your new password.', 'invalid');
    const { error: failure } = await authRequests.run(async () => {
      const { data, error: sessionError } = await client.auth.getSession();
      signal?.throwIfAborted();
      if (sessionError || !active(id, version) || !recoveryContext.matches(data.session)) {
        if (active(id, version)) { recoveryContext.clear(); setRecovery(false); setRecoveryError(RECOVERY_LINK_ERROR); }
        throw new ArchiveError('Open a fresh password recovery link before updating your password.', 'auth');
      }
      return client.auth.updateUser({ password });
    }, signal);
    signal?.throwIfAborted();
    if (failure) throw new ArchiveError('The password could not be updated. Please retry.');
    if (!active(id, version)) throw new ArchiveError('Your account session changed. Sign in again to check your password.', 'auth');
    recoveryContext.clear(); setRecoveryError('');
    setRecovery(false);
  }

  return {
    available: Boolean(client), session, userId, authLoading, enabled, rows, jobs, loading, more, error, notice, backingUp, recovery, recoveryError, setRecoveryError, recoveryEnabled: Boolean(client) && passwordRecoveryEnabled,
    authenticate, signOut, setAutomatic, bindNewAttempt, backUpReport, retry, cancelBackup, download, deleteReport, removeDevice, deleteAccount,
    requestRecovery, updatePassword, loadMore, setError, setNotice,
    canView: (attemptId: string) => visibleTo(storage, attemptId, owner.current),
    currentOwner: () => owner.current,
    jobFor: (attemptId: string) => jobs.find(job => job.attemptId === attemptId),
  };
}
export type AccountHistory = ReturnType<typeof useAccountHistory>;
