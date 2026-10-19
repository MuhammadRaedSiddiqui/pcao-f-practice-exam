import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const suffix = process.env.GUIDED_PREFLIGHT_RUN === 'confirmed' ? '-confirmed' : '';
const evidence = fileURLToPath(new URL('../../test-results/guided-production-preflight-20261019-01/', import.meta.url));
export default defineConfig({ testDir: '.', testMatch: 'preflight.spec.ts', workers: 1, retries: 0,
  globalSetup: './setup.ts', outputDir: evidence + 'browser' + suffix + '-artifacts',
  reporter: [['list'], ['json', { outputFile: evidence + 'browser' + suffix + '.json' }]],
  use: { baseURL: 'http://127.0.0.1:4263', screenshot: 'only-on-failure' },
});
