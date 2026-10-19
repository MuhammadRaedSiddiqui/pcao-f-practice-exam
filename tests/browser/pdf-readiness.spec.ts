import { test, expect, type Page } from '@playwright/test';
import { syntheticResultsAttempt } from '../fixtures/syntheticResultsAttempt';

// Same scenarios run against development and the separately built production preview.
const pdfModule = /\/(?:src\/ui\/reportPdf\.ts|assets\/reportPdf-[^/]+\.js)(?:\?|$)/;
async function openReport(page: Page) {
  await page.addInitScript(saved => {
    localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    const original = URL.createObjectURL.bind(URL);
    URL.createObjectURL = blob => { document.body.dataset.pdfBlobCount = String(Number(document.body.dataset.pdfBlobCount ?? 0) + 1); return original(blob); };
  }, syntheticResultsAttempt());
  await page.goto('/'); await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
}
async function download(page: Page) {
  const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export report (PDF)', exact: true }).click();
  const result = await event; expect(await result.failure()).toBeNull();
  expect(result.suggestedFilename()).toBe('pcao-f-original-report-2026-10-12-synthetic-results.pdf');
  const stream = await result.createReadStream(); const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');
  expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()))).toBe(before);
}

test('PDF readiness: first offline generation works after actual import readiness, and warm reuse works', async ({ page, context }) => {
  await openReport(page);
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
  expect(await page.locator('body').getAttribute('data-pdf-blob-count')).toBeNull();
  await context.setOffline(true); await download(page); await download(page);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('body')).toHaveAttribute('data-pdf-blob-count', '2');
});

test('PDF readiness: offline transition during import disables export, reports load failure and retries online', async ({ page, context }, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  let seen!: () => void, release!: () => void;
  const requested = new Promise<void>(resolve => { seen = resolve; });
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(pdfModule, async route => { seen(); await held; await route.continue().catch(() => {}); });
  await openReport(page); await requested;
  await expect(page.getByRole('button', { name: 'Loading PDF export…', exact: true })).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'First-use offline export' })).toContainText('First-use offline export is available only after this finishes.');
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toHaveCount(0);
  await context.setOffline(true); release();
  await expect(page.getByRole('alert')).toHaveText('PDF export could not be loaded. Connect to the internet and retry PDF loading.');
  await expect(page.getByRole('button', { name: 'PDF export unavailable', exact: true })).toBeDisabled();
  expect(await page.locator('body').getAttribute('data-pdf-blob-count')).toBeNull();
  await page.getByRole('button', { name: 'Retry PDF loading', exact: true }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('pdf-loading-error-320.png') });
  await context.setOffline(false); await page.unroute(pdfModule);
  const retry = page.getByRole('button', { name: 'Retry PDF loading', exact: true });
  await retry.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeFocused();
  await expect(page.getByRole('alert')).toHaveCount(0); await download(page);
});

test('PDF readiness: an online import failure has explicit retry and does not generate a PDF', async ({ page }) => {
  await page.route(pdfModule, route => route.abort('failed'));
  await openReport(page);
  await expect(page.getByRole('alert')).toContainText('PDF export could not be loaded.');
  expect(await page.locator('body').getAttribute('data-pdf-blob-count')).toBeNull();
  await page.unroute(pdfModule);
  await page.getByRole('button', { name: 'Retry PDF loading', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
  await download(page);
});

test('PDF readiness: leaving Results during loading fences late UI state, and return uses the loaded module', async ({ page }) => {
  let seen!: () => void, release!: () => void;
  const requested = new Promise<void>(resolve => { seen = resolve; });
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(pdfModule, async route => { seen(); await held; await route.continue().catch(() => {}); });
  await openReport(page); await requested;
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Attempt history', exact: true })).toBeVisible();
  const finished = page.waitForEvent('requestfinished', request => pdfModule.test(request.url())); release(); await finished;
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
  await download(page);
});
