import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/analytics-browser', outputDir: './test-results/analytics-browser-artifacts', timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:4234', screenshot: 'only-on-failure',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4234 --strictPort --config vite.analytics-test.config.ts --configLoader runner',
    url: 'http://127.0.0.1:4234', reuseExistingServer: false,
  },
});
