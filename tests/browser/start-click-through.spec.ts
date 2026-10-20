import { test, expect, type Page } from '@playwright/test';
import type { Attempt } from '../../src/domain/attempt';
import { reloadPage } from './navigation';

test.beforeEach(async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
});

async function storedAttempts(page: Page): Promise<Attempt[]> {
  return page.evaluate(async () => navigator.locks.request('pcao-f:attempt-storage:v1', () => {
    const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1') ?? '[]') as string[];
    return ids.map(id => JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!));
  }));
}

async function prepare(page: Page, level: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Choose exam difficulty' });
  await dialog.getByRole('radio', { name: level, exact: true }).check();
  const start = dialog.getByRole('button', { name: 'Start Exam', exact: true });
  await expect(start).toBeEnabled();
  return start;
}

async function expectEmptyExam(page: Page) {
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.locator('.options input:checked')).toHaveCount(0);
  await expect(page.locator('.answered-count strong')).toHaveText('0 / 60');
  const attempts = await storedAttempts(page);
  expect(attempts).toHaveLength(1);
  expect(attempts[0].answers).toEqual({});
  expect(attempts[0].revision).toBe(0);
  return attempts[0];
}

const layouts = [
  { name: 'reported', width: 1919, height: 998 },
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 900 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'enlarged', width: 390, height: 844, enlarged: true },
];

for (const level of ['Intermediate', 'Advanced']) {
  for (const layout of layouts) {
    test(level + ' pointer double-click starts empty at ' + layout.name, async ({ page }) => {
      await page.setViewportSize(layout);
      if (layout.enlarged) await page.addInitScript(() => {
        document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = '24px'; });
      });
      const start = await prepare(page, level);
      const box = await start.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await start.dblclick({ delay: 100 });
      const initial = await expectEmptyExam(page);
      if (layout.name === 'reported' && level === 'Intermediate') {
        // Keep this reproduction adversarial: the second click actually hits an answer label.
        expect(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('.option-card')?.querySelector('input')?.value,
          { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 })).toBe('B');
      }
      if (level === 'Intermediate' && ['reported', '390', '1366'].includes(layout.name)) {
        await page.screenshot({ path: 'screenshots/bug-001-fixed-' + layout.name + '.png' });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      // The next deliberate answer must work immediately, without waiting out a guard timer.
      await page.locator('.option-card').first().click();
      await expect(page.locator('.answered-count strong')).toHaveText('1 / 60');
      await expect.poll(async () => (await storedAttempts(page))[0].answers).toEqual({ Q1: ['A'] });
      expect((await storedAttempts(page))[0].id).toBe(initial.id);
    });
  }
}

test('triple-click starts empty and stays empty after reload and submission', async ({ page }) => {
  await page.setViewportSize({ width: 1919, height: 998 });
  const start = await prepare(page, 'Intermediate');
  await start.click({ clickCount: 3, delay: 100 });
  const original = await expectEmptyExam(page);
  await reloadPage(page);
  expect((await storedAttempts(page))[0].answers).toEqual({});
  await expect(page.getByRole('heading', { name: /^Question \d+ of 60$/ })).toBeVisible();
  await expectEmptyExam(page);
  await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  const submitted = (await storedAttempts(page))[0];
  expect(submitted.id).toBe(original.id);
  expect(submitted.status).toBe('submitted');
  expect(submitted.answers).toEqual({});
  expect(submitted.result?.correct).toBe(0);
});

test('keyboard start accepts the first keyboard answer immediately', async ({ page }) => {
  const start = await prepare(page, 'Intermediate');
  await start.focus();
  await page.keyboard.press('Enter');
  await expectEmptyExam(page);
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeFocused();
  await page.locator('.options input').first().focus();
  await page.keyboard.press('Space');
  await expect.poll(async () => (await storedAttempts(page))[0].answers).toEqual({ Q1: ['A'] });
});

test('replacement double-click opens one fresh empty attempt', async ({ page }) => {
  await page.setViewportSize({ width: 1919, height: 998 });
  await (await prepare(page, 'Intermediate')).click();
  const original = await expectEmptyExam(page);
  await page.locator('.option-card').first().click();
  await expect.poll(async () => (await storedAttempts(page))[0].answers).toEqual({ Q1: ['A'] });
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Start another exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Abandon and start Intermediate exam', exact: true }).dblclick({ delay: 100 });
  const replacement = await expectEmptyExam(page);
  expect(replacement.id).not.toBe(original.id);
});

test.describe('touch', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test('tap start and the first deliberate tap answer remain responsive', async ({ page }) => {
    await (await prepare(page, 'Intermediate')).tap();
    await expectEmptyExam(page);
    await page.locator('.option-card').first().tap();
    await expect.poll(async () => (await storedAttempts(page))[0].answers).toEqual({ Q1: ['A'] });
  });
});
