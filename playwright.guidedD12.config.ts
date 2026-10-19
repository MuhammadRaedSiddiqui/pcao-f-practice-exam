import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/guided-d12-browser', outputDir: './test-results/guided-d12-browser-artifacts',
  workers: 2, retries: 0,
  use: { baseURL: 'http://127.0.0.1:4246', screenshot: 'only-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4246 --strictPort --config vite.guided-test.config.ts --mode guided-d12 --configLoader runner',
    url: 'http://127.0.0.1:4246', reuseExistingServer: false },
});
