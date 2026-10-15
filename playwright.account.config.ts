import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/account-browser', outputDir: './test-results/account-browser-artifacts', timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:4232', screenshot: 'only-on-failure' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4232 --strictPort --config vite.account-test.config.ts --configLoader runner',
    url: 'http://127.0.0.1:4232', reuseExistingServer: true,
  },
});
