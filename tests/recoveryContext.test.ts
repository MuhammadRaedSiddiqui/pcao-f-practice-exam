import { describe, expect, it } from 'vitest';
import { authCallbackState, cleanAuthCallbackUrl, createRecoveryContext } from '../src/domain/recoveryContext';

function session(userId = 'synthetic-user-a', sessionId = 'synthetic-session-a', revision = 1) {
  const claims = { sub: userId, session_id: sessionId, revision };
  return { user: { id: userId }, access_token: 'synthetic.' + Buffer.from(JSON.stringify(claims)).toString('base64url') + '.signature' };
}
function fixture() {
  const data = new Map<string, string>();
  const store = { getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } };
  return { data, store, context: createRecoveryContext(() => store) };
}

describe('pending password recovery context', () => {
  it('restores only for the same SDK session after a reload and token refresh', () => {
    const f = fixture();
    expect(f.context.begin(session())).toBe(true);
    const reloaded = createRecoveryContext(() => f.store);
    expect(reloaded.matches(session('synthetic-user-a', 'synthetic-session-a', 2))).toBe(true);
    expect([...f.data.values()].join()).not.toContain('signature');
    expect([...f.data.values()].join()).not.toContain('access_token');
  });
  it.each([
    ['another account', session('synthetic-user-b')],
    ['another session for the same account', session('synthetic-user-a', 'synthetic-session-b')],
    ['no authenticated session', null],
  ] as const)('clears pending recovery for %s', (_, next) => {
    const f = fixture(); f.context.begin(session());
    expect(f.context.matches(next)).toBe(false);
    expect(f.data.size).toBe(0);
    expect(f.context.matches(session())).toBe(false);
  });
  it('requires an explicit recovery event instead of granting recovery to an ordinary session', () => {
    expect(fixture().context.matches(session())).toBe(false);
  });
  it('clears the marker on completion/sign-out so reload cannot reopen it', () => {
    const f = fixture(); f.context.begin(session()); f.context.clear();
    expect(createRecoveryContext(() => f.store).matches(session())).toBe(false);
  });
  it('keeps a memory fallback if browser storage is blocked', () => {
    const context = createRecoveryContext(() => { throw new Error('blocked'); });
    expect(context.begin(session())).toBe(true);
    expect(context.matches(session())).toBe(true);
    context.clear(); expect(context.matches(session())).toBe(false);
  });
  it.each(['invalid', '{"userId":"synthetic-user-a"}', 'null', '[]'])('ignores damaged marker %s', value => {
    const f = fixture(); f.data.set('pcao-f:password-recovery:v1', value);
    expect(f.context.matches(session())).toBe(false);
  });
  it.each(['invalid', 'header.invalid.signature', 'header.' + Buffer.from('{"sub":"other","session_id":"a"}').toString('base64url') + '.signature'])('rejects missing or mismatched token claims', access_token => {
    const f = fixture();
    expect(f.context.begin({ user: { id: 'synthetic-user-a' }, access_token })).toBe(false);
    expect(f.data.size).toBe(0);
  });
});

describe('recovery callback errors and URL cleanup', () => {
  it.each([
    'https://app.synthetic.test/#access_token=private&refresh_token=private&type=recovery',
    'https://app.synthetic.test/?code=private',
  ])('detects callback presence without retaining credentials', href => {
    expect(authCallbackState(href)).toEqual({ present: true, failed: false });
    expect(JSON.stringify(authCallbackState(href))).not.toContain('private');
  });
  it.each(['#error=access_denied&error_code=otp_expired&error_description=private', '?error_code=otp_expired'])('recognizes safe callback failure state for %s', suffix => {
    expect(authCallbackState('https://app.synthetic.test/' + suffix)).toEqual({ present: true, failed: true });
  });
  it('does not treat a URL flag as a recovery session', () => {
    expect(authCallbackState('https://app.synthetic.test/?type=recovery#help')).toEqual({ present: false, failed: false });
    expect(authCallbackState('invalid')).toEqual({ present: false, failed: false });
  });
  it('removes callback secrets and raw errors while preserving unrelated URL state', () => {
    expect(cleanAuthCallbackUrl('https://app.synthetic.test/?code=private&campaign=practice#error_description=private&error_code=otp_expired&type=recovery&tab=help'))
      .toBe('/?campaign=practice#tab=help');
    expect(cleanAuthCallbackUrl('https://app.synthetic.test/?access_token=private&refresh_token=private&expires_in=3600&token_type=bearer#help'))
      .toBe('/#help');
  });
});
