import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/guided-browser', outputDir: './test-results/guided-browser-artifacts',
  workers: 2, retries: 0,
  use: { baseURL: 'http://127.0.0.1:4240', screenshot: 'only-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4240 --strictPort --config vite.guided-test.config.ts --configLoader runner',
    url: 'http://127.0.0.1:4240', reuseExistingServer: false },
});
