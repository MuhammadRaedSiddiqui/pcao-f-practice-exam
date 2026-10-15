import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/recovery-browser', outputDir: './test-results/recovery-browser-artifacts', timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:4236', screenshot: 'only-on-failure' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4236 --strictPort --config vite.recovery-test.config.ts --configLoader runner',
    url: 'http://127.0.0.1:4236', reuseExistingServer: false,
  },
});
