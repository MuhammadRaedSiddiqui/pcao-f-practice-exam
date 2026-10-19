import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const suite = process.env.GUIDED_REGRESSION ?? 'guided';
const name = suite + (process.env.GUIDED_QA_RUN ? '-' + process.env.GUIDED_QA_RUN : '');
const ports: Record<string, number> = { guest: 4173, guided: 4240, d12: 4246, account: 4232, analytics: 4234, recovery: 4236, 'guided-analytics': 4240 };
const dirs: Record<string, string> = { guest: 'browser', guided: 'guided-browser', d12: 'guided-d12-browser', account: 'account-browser', analytics: 'analytics-browser', recovery: 'recovery-browser', 'guided-analytics': 'guided-analytics-browser' };
export default defineConfig({ testDir: fileURLToPath(new URL('../' + dirs[suite] + '/', import.meta.url)),
  workers: 1, retries: 0, ...( ['account', 'analytics', 'recovery'].includes(suite) ? { timeout: 45000 } : {}),
  globalSetup: './regression-setup.ts', metadata: { suite, port: ports[suite] },
  outputDir: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/' + name + '-artifacts', import.meta.url)),
  reporter: [['list'], ['json', { outputFile: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/' + name + '.json', import.meta.url)) }]],
  use: { baseURL: 'http://127.0.0.1:' + ports[suite], screenshot: 'only-on-failure',
    ...(['analytics', 'guided-analytics'].includes(suite) ? { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' } : {}) },
});
