type RecoverySession = { access_token: string; user: { id: string } };
type Marker = { userId: string; sessionId: string };
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const markerKey = 'pcao-f:password-recovery:v1';

// This is UI context, never authentication. The SDK must first accept the session;
// the server still authorizes every password update. No tokens are stored here.
function identity(session: RecoverySession | null): Marker | null {
  if (!session) return null;
  try {
    const payload = session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(payload));
    return claims.sub === session.user.id && typeof claims.session_id === 'string' && claims.session_id
      ? { userId: session.user.id, sessionId: claims.session_id } : null;
  } catch { return null; }
}

export function createRecoveryContext(store: () => Store) {
  let current: Marker | null | undefined;
  function clear() {
    current = null;
    try { store().removeItem(markerKey); } catch { /* Keep the memory fallback cleared. */ }
  }
  return {
    clear,
    begin(session: RecoverySession): boolean {
      current = identity(session);
      if (!current) { clear(); return false; }
      try { store().setItem(markerKey, JSON.stringify(current)); } catch { /* This tab can still finish without reload. */ }
      return true;
    },
    matches(session: RecoverySession | null): boolean {
      if (current === undefined) {
        try { current = JSON.parse(store().getItem(markerKey) ?? 'null'); } catch { current = null; }
      }
      const next = identity(session);
      if (!current || !next || current.userId !== next.userId || current.sessionId !== next.sessionId) {
        clear(); return false;
      }
      return true;
    },
  };
}

const authFields = ['access_token', 'refresh_token', 'token_type', 'expires_in', 'expires_at', 'type',
  'code', 'error', 'error_code', 'error_description'];

// Capture only booleans before the SDK consumes/cleans the callback URL.
export function authCallbackState(href: string) {
  try {
    const url = new URL(href);
    const fragment = new URLSearchParams(url.hash.slice(1));
    const has = (key: string) => url.searchParams.has(key) || fragment.has(key);
    const failed = ['error', 'error_code', 'error_description'].some(has);
    return { present: failed || ['access_token', 'refresh_token', 'code'].some(has), failed };
  } catch { return { present: false, failed: false }; }
}

export function cleanAuthCallbackUrl(href: string): string {
  const url = new URL(href);
  const fragment = new URLSearchParams(url.hash.slice(1));
  for (const key of authFields) { url.searchParams.delete(key); fragment.delete(key); }
  // Preserve ordinary anchors and unrelated query parameters.
  if (url.hash.includes('=')) url.hash = fragment.toString();
  return url.pathname + url.search + url.hash;
}
