import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const kind = process.env.GUIDED_QA_KIND ?? 'enabled';
const name = kind + (process.env.GUIDED_QA_RUN ? '-' + process.env.GUIDED_QA_RUN : '');
export default defineConfig({ testDir: '.', testMatch: kind === 'enabled' ? 'normal.spec.ts' : 'disabled.spec.ts',
  workers: 1, retries: 0, globalSetup: './setup.ts', metadata: { kind },
  outputDir: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/' + name + '-artifacts', import.meta.url)),
  reporter: [['list'], ['json', { outputFile: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/' + name + '.json', import.meta.url)) }]],
  use: { baseURL: 'http://127.0.0.1:4262', screenshot: 'only-on-failure' },
});
