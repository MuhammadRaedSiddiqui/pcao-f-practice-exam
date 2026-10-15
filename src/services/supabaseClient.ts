import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { authRequests } from './authRequests';
import { authCallbackState } from '../domain/recoveryContext';
import { isPasswordRecoveryEnabled } from '../domain/passwordRecovery';

export const initialAuthCallback = authCallbackState(typeof window === 'undefined' ? '' : window.location.href);

export const passwordRecoveryEnabled = isPasswordRecoveryEnabled(import.meta.env.VITE_PASSWORD_RECOVERY_ENABLED);

const sessionKey = 'pcao-f:account-session:v1';
const rememberKey = 'pcao-f:remember-account:v1';
// Used only when browser-session storage is blocked.
const memory = new Map<string, string>();
function remembered() {
  try {
    const choice = sessionStorage.getItem(rememberKey);
    if (choice !== null) return choice === 'true';
  } catch { /* Fall back to the device preference. */ }
  try { return localStorage.getItem(rememberKey) === 'true'; } catch { return false; }
}
let persistent = remembered();
const storage = {
  getItem(key: string) {
    if (persistent) return localStorage.getItem(key);
    try { return sessionStorage.getItem(key) ?? memory.get(key) ?? null; }
    catch { return memory.get(key) ?? null; }
  },
  setItem(key: string, value: string) {
    if (!authRequests.acceptSession()) throw new DOMException('Request cancelled.', 'AbortError');
    if (persistent) localStorage.setItem(key, value);
    else {
      try { sessionStorage.setItem(key, value); memory.delete(key); }
      catch { memory.set(key, value); }
    }
  },
  removeItem(key: string) {
    memory.delete(key);
    try { sessionStorage.removeItem(key); } catch { /* Clear other stores independently. */ }
    try { localStorage.removeItem(key); } catch { /* Browser-session storage still clears. */ }
  },
};
export function rememberAccount(remember: boolean) {
  const old = storage.getItem(sessionKey);
  if (remember) localStorage.setItem(rememberKey, 'true');
  else { try { localStorage.setItem(rememberKey, 'false'); } catch { /* Browser-session sign-in remains available. */ } }
  // Preserve this tab's choice when another tab changes the device preference.
  try { sessionStorage.setItem(rememberKey, String(remember)); } catch { /* The current tab still uses its in-memory choice. */ }
  persistent = remember;
  storage.removeItem(sessionKey);
  if (old) storage.setItem(sessionKey, old);
}
let client: SupabaseClient | null | undefined;
export function accountClient(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (import.meta.env.VITE_ACCOUNT_HISTORY_ENABLED !== 'true' || !url || !key) return client = null;
  try {
    if (new URL(url).protocol !== 'https:' && !/^http:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url)) return client = null;
    client = createClient(url, key, { global: { fetch: authRequests.fetch }, auth: {
      persistSession: true, storage, storageKey: sessionKey, autoRefreshToken: true, detectSessionInUrl: true,
    } });
  } catch { client = null; }
  return client;
}

export function clearAccountSession() { storage.removeItem(sessionKey); }
