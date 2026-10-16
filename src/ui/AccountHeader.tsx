import { useEffect, useRef, useState } from 'react';
import type { AccountHistory } from '../hooks/useAccountHistory';
import { RECOVERY_REQUESTED_MESSAGE, RECOVERY_UNAVAILABLE_MESSAGE } from '../domain/passwordRecovery';
import { Button, Dialog } from './primitives';

export function AccountHeader({ account, examActive = false }: { account: AccountHistory; examActive?: boolean }) {
  if (!account.available) return null;
  // Unmount the forms during an exam: their cleanup cancels pending requests,
  // while the account hook keeps the session and pending recovery context alive.
  if (examActive) return <div className="header-auth" aria-label="Account access">
    <AccountStatus account={account} />
    {!account.authLoading && !account.userId && <span className="header-auth-hint">Sign in or create an account after leaving or submitting the exam.</span>}
  </div>;
  return <AccountAccess account={account} />;
}

function AccountStatus({ account }: { account: AccountHistory }) {
  return account.authLoading ? <span className="header-account-email" role="status">Loading account…</span> : account.userId ?
    <span className="header-account-email" title={account.session?.user.email} aria-label={'Signed in as ' + account.session?.user.email}>{account.session?.user.email}</span> :
    <span className="header-account-email">Guest mode</span>;
}

function AccountAccess({ account }: { account: AccountHistory }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'password' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const pending = useRef<AbortController | null>(null);
  useEffect(() => { if (account.recoveryEnabled && account.recovery) setMode('password'); }, [account.recoveryEnabled, account.recovery]);
  useEffect(() => { if (!account.recovery && mode === 'password' && !busy) { setMode(null); setPassword(''); } }, [account.recovery, mode, busy]);
  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, []);

  async function run(action: (signal: AbortSignal) => Promise<unknown>) {
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true); setError(''); setSuccess('');
    try { await action(controller.signal); }
    catch (failure) {
      if (pending.current === controller && !controller.signal.aborted) setError(failure instanceof Error ? failure.message : 'The account action failed. Please retry.');
    }
    finally { if (pending.current === controller) { pending.current = null; setBusy(false); } }
  }
  function closeAuth() {
    pending.current?.abort(); pending.current = null;
    setBusy(false); setMode(null); setPassword(''); setError(''); setSuccess('');
  }
  const title = mode === 'signup' ? 'Create an account' : mode === 'reset' ? 'Reset your password' : mode === 'password' ? 'Choose a new password' : 'Sign in';
  return <>
    <div className="header-auth" aria-label="Account access">
      {account.recoveryEnabled && account.recovery && <Button variant="primary" disabled={busy} onClick={() => { setMode('password'); setError(''); setSuccess(''); }}>Finish password reset</Button>}
      {account.authLoading || account.userId ? <AccountStatus account={account} /> : <>
          <Button variant="quiet" disabled={busy} onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}>Sign in</Button>
          <Button variant="primary" disabled={busy} onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}>Create account</Button>
        </>}
    </div>
    {account.recoveryEnabled && account.recoveryError && <div className="header-recovery-notice">
      <p role="alert">{account.recoveryError}</p>
      <Button variant="quiet" onClick={() => { setMode('reset'); setPassword(''); setError(''); setSuccess(''); account.setRecoveryError(''); }}>Request a new recovery link</Button>
    </div>}
    {!mode && success && <p className="header-recovery-notice" role="status">{success}</p>}
    {mode && <Dialog open title={title} onClose={closeAuth}>
      <form className="account-form" onSubmit={event => {
        event.preventDefault();
        void run(async signal => {
          if (mode === 'reset') {
            await account.requestRecovery(email, signal); signal.throwIfAborted();
            setSuccess(RECOVERY_REQUESTED_MESSAGE); return;
          }
          if (mode === 'password') {
            await account.updatePassword(password, signal);
            signal.throwIfAborted(); setSuccess('Your password has been updated.');
          }
          else await account.authenticate(mode!, email, password, remember, signal);
          signal.throwIfAborted();
          setPassword('');
          setMode(null);
        });
      }}>
        {mode !== 'password' && <label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required disabled={busy} /></label>}
        {mode !== 'reset' && <><label>Password<input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' || mode === 'password' ? 'new-password' : 'current-password'} value={password} onChange={event => setPassword(event.target.value)} required minLength={mode === 'signin' ? undefined : 8} disabled={busy} /></label>
          <label className="account-check"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)} /><span>Show password</span></label></>}
        {(mode === 'signin' || mode === 'signup') && <label className="account-check"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /><span>Keep me signed in on this device</span></label>}
        {mode === 'signup' && <><p className="muted">Use at least 8 characters. No email verification is required.</p><p className="muted">Your completed browser reports will automatically be backed up to your new account. Future exams will also back up after completion. You can turn this off in Account settings. Device copies will be kept.</p></>}
        {!account.recoveryEnabled && (mode === 'signin' || mode === 'signup') && <p className="muted">{RECOVERY_UNAVAILABLE_MESSAGE}</p>}
        {error && <p role="alert">{error}</p>}{success && <p role="status">{success}</p>}
        <div className="account-actions"><Button type="submit" variant="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send recovery link' : mode === 'password' ? 'Update password' : 'Sign in'}</Button><Button onClick={closeAuth}>Cancel</Button></div>
        {mode === 'signin' && account.recoveryEnabled && <Button variant="quiet" disabled={busy} onClick={() => { setMode('reset'); setPassword(''); setError(''); }}>Forgot password?</Button>}
      </form>
    </Dialog>}
  </>;
}
