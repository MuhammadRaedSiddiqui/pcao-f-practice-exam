import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  testDir:'.', testMatch:'smoke.spec.ts', outputDir:'../../test-results/guided-practice/local-pilot/browser-artifacts',
  workers:1, retries:0,
  reporter:[['list'],['json',{ outputFile:fileURLToPath(new URL('../../test-results/guided-practice/local-pilot/browser-results.json',import.meta.url)) }]],
  use:{ baseURL:'http://127.0.0.1:4256', screenshot:'only-on-failure' },
  // Own Vite directly, avoiding Windows shell/taskkill teardown for a dev server.
  globalSetup:'./global-setup.ts',
});
