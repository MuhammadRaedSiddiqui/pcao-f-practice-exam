import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  testDir: fileURLToPath(new URL('../phase7-integration/', import.meta.url)), testMatch: 'integration.spec.ts',
  globalSetup: '../phase7-integration/global-setup.ts', workers: 1, retries: 0,
  outputDir: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/retained-candidate-artifacts', import.meta.url)),
  reporter: [['list'], ['json', { outputFile: fileURLToPath(new URL('../../test-results/guided-mode-20261019-01/retained-candidate.json', import.meta.url)) }]],
  use: { baseURL: 'http://127.0.0.1:4258', screenshot: 'only-on-failure' },
});
