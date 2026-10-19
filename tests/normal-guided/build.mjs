import { build } from 'vite';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const services = { VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_PASSWORD_RECOVERY_ENABLED: 'false', VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '', VITE_POSTHOG_ENABLED: 'false', VITE_POSTHOG_KEY: '', VITE_POSTHOG_HOST: '' };
for (const kind of ['enabled', 'disabled', 'empty']) {
  await build({ configFile: 'vite.config.ts', configLoader: 'runner', mode: kind === 'enabled' ? 'guided-local' : 'production', envDir: false,
    build: { outDir: '.localtest/guided-mode/' + kind }, define: kind === 'enabled' ? {} : Object.fromEntries(Object.entries({ ...services, VITE_GUIDED_PRACTICE_ENABLED: kind === 'empty' ? 'true' : 'false' }).map(([k, v]) => ['import.meta.env.' + k, JSON.stringify(v)])) });
  const dir = '.localtest/guided-mode/' + kind, files = fs.readdirSync(dir + '/assets').filter(f => f.endsWith('.js'));
  if (kind !== 'enabled') {
    if (fs.existsSync(dir + '/guided')) throw Error('Guidance leaked into ' + kind);
    for (const f of files) { const code = fs.readFileSync(dir + '/assets/' + f, 'utf8'); if (code.includes('phase7-controlled') || code.includes('g1:4a') || code.includes('The bank selects C.')) throw Error('Candidate content leaked'); }
  } else for (const f of ['intermediate-1.0.0.json', 'intermediate-1.1.0.json']) {
    const hash = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
    if (hash(dir + '/guided/' + f) !== hash('guided-release/' + f)) throw Error('Emitted asset mismatch');
  }
  console.log('BUILD_VERIFIED ' + kind);
}
