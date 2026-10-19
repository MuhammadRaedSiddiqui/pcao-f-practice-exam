import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import type { FullConfig } from '@playwright/test';
export default async function setup(config: FullConfig) {
  const suite = config.metadata.suite as string, root = fileURLToPath(new URL('../../', import.meta.url));
  const file = ['account', 'analytics', 'recovery'].includes(suite) ? `vite.${suite}-test.config.ts` : suite === 'guest' ? 'vite.config.ts' : 'vite.guided-test.config.ts';
  const server = await createServer({ root, configFile: root + file, configLoader: 'runner', envDir: false,
    mode: suite === 'd12' ? 'guided-d12' : suite === 'guided-analytics' ? 'guided-analytics' : 'development',
    server: { host: '127.0.0.1', port: config.metadata.port as number, strictPort: true },
    define: suite === 'guest' ? Object.fromEntries(Object.entries({ VITE_GUIDED_PRACTICE_ENABLED: 'false', VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_PASSWORD_RECOVERY_ENABLED: 'false', VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '', VITE_POSTHOG_ENABLED: 'false' }).map(([k, v]) => ['import.meta.env.' + k, JSON.stringify(v)])) : undefined });
  await server.listen(); const previous = process.cwd(), folder = root + 'test-results/guided-mode-20261019-01/' + suite + '-workspace/'; mkdirSync(folder, { recursive: true }); process.chdir(folder);
  return async () => { await server.close(); process.chdir(previous); };
}
