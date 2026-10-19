import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const suite = process.env.GUIDED_PREP_SUITE ?? 'account';
const ports: Record<string, number> = { account: 4232, analytics: 4234, recovery: 4236, guest: 4173 };
if (!(suite in ports)) throw Error('Unknown local service suite');
const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig({
  testDir: root + 'tests/' + (suite === 'guest' ? 'browser' : suite + '-browser'),
  workers: 1, retries: 0,
  ...(['account', 'analytics', 'recovery'].includes(suite) ? { timeout: 45000 } : {}),
  metadata: { suite, port: ports[suite] }, globalSetup: './services-setup.ts',
  outputDir: root + 'test-results/production-prep-20261019/' + suite + '-artifacts',
  reporter: [['list'], ['json', { outputFile: root + 'test-results/production-prep-20261019/' + suite + '-results.json' }]],
  use: { baseURL: 'http://127.0.0.1:' + ports[suite], screenshot: 'only-on-failure',
    ...(suite === 'analytics' ? { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' } : {}) },
});
