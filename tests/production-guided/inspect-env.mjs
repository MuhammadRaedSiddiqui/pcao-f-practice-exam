// Read-only classifier. Never prints tokens, keys, full URLs or arbitrary environment values.
const booleanPolicy = name => ({ present: process.env[name] !== undefined,
  enabled: process.env[name] === 'true', explicitFalse: process.env[name] === 'false' });
const endpointPolicy = name => { const value = process.env[name]; if (!value) return { present: false };
  try { const u = new URL(value); return { present: true, https: u.protocol === 'https:', loopback: ['localhost','127.0.0.1','::1','[::1]'].includes(u.hostname) }; }
  catch { return { present: true, validURL: false }; } };
console.log(JSON.stringify({ account: booleanPolicy('VITE_ACCOUNT_HISTORY_ENABLED'), recovery: booleanPolicy('VITE_PASSWORD_RECOVERY_ENABLED'),
  recoveryDefaultWhenAbsent: true, analytics: booleanPolicy('VITE_POSTHOG_ENABLED'),
  supabase: endpointPolicy('VITE_SUPABASE_URL'), posthog: endpointPolicy('VITE_POSTHOG_HOST'),
  supabasePublicKeyPresent: Boolean(process.env.VITE_SUPABASE_PUBLISHABLE_KEY), analyticsPublicKeyPresent: Boolean(process.env.VITE_POSTHOG_KEY),
  guided: booleanPolicy('VITE_GUIDED_PRACTICE_ENABLED') }, null, 2));
