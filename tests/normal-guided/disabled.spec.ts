import { test, expect } from '@playwright/test';
import fs from 'node:fs';
test('default build has no guidance entry, assets or session exposure', async ({ page, request }) => {
  await page.goto('/');
  if (process.env.GUIDED_QA_KIND !== 'empty') await expect(page.getByRole('link', { name: 'Open Guided Practice', exact: true })).toHaveCount(0);
  await page.goto('/guided');
  if (process.env.GUIDED_QA_KIND === 'empty') await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeDisabled();
  else await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toHaveCount(0);
  const response = await request.get('/guided/intermediate-1.1.0.json');
  expect((await response.text()).includes('reasoningMarkdown')).toBe(false);
});
test('browser globals cannot populate the compiled catalog', async ({ page }) => {
  await page.addInitScript(catalog => { (globalThis as any).__GUIDED_LOCAL_CATALOG__ = catalog; }, JSON.parse(fs.readFileSync('guided-release/catalog.json', 'utf8')));
  const requests: string[] = []; page.on('request', r => { if (/\/guided\/.*\.json/.test(r.url())) requests.push(r.url()); });
  await page.goto('/guided');
  if (process.env.GUIDED_QA_KIND === 'empty') await expect(page.getByRole('button', { name: 'Retry guidance', exact: true })).toBeVisible();
  else await expect(page.getByRole('heading', { name: 'Guided Practice unavailable', exact: true })).toBeVisible();
  expect(requests).toEqual([]);
});
