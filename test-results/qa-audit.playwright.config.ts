import { defineConfig } from '@playwright/test';

// Run against the separately started, freshly built preview on port 4180.
export default defineConfig({
  testDir: '../tests/browser',
  outputDir: './qa-audit-artifacts',
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4180', screenshot: 'only-on-failure' },
});
