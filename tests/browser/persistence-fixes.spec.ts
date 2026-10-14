import { test, expect, type Page } from '@playwright/test';
import { createAttempt, answerQuestion, setFlag } from '../../src/domain/attempt';
import { syntheticBank } from '../fixtures/syntheticBank';
import { syntheticResultsAttempt } from '../fixtures/syntheticResultsAttempt';
import { installPausedClock } from './navigation';

async function savedAttempt(page: Page) {
  return page.evaluate(() => {
    const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
    return JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!);
  });
}

async function suppressStorageEvents(page: Page) {
  // Hold a stale UI deliberately to exercise the save guard independently of synchronization.
  await page.addInitScript(() => window.addEventListener('storage', event => event.stopImmediatePropagation()));
}

for (const width of [320, 1366]) {
  test('a stale tab cannot reopen a submitted attempt at ' + width, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
    const other = await context.newPage();
    await other.setViewportSize({ width, height: 768 });
    await suppressStorageEvents(other);
    await other.goto('/');
    await other.getByRole('button', { name: 'Resume attempt', exact: true }).click();
    await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
    const submitted = await savedAttempt(page);
    await other.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(other.getByRole('heading', { name: 'Your results' })).toBeFocused();
    await expect(other.getByRole('alert')).toContainText('already submitted');
    expect(await savedAttempt(other)).toEqual(submitted);
    expect(await other.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await other.screenshot({ path: 'screenshots/submission-other-tab-' + width + '.png' });
  });
}

test('other tabs automatically show the saved submitted report', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  const other = await context.newPage();
  await other.goto('/');
  await other.getByRole('button', { name: 'Resume attempt', exact: true }).click();
  await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(other.getByRole('heading', { name: 'Your results' })).toBeVisible();
  await expect(other.getByRole('alert')).toContainText('submitted in another tab');
  expect(await savedAttempt(other)).toEqual(await savedAttempt(page));
});

test('simultaneous stale edits serialize and one receives a recoverable conflict', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  const other = await context.newPage();
  await suppressStorageEvents(other);
  await other.goto('/');
  await other.getByRole('button', { name: 'Resume attempt', exact: true }).click();
  await page.evaluate(() => {
    const state = window as typeof window & { lockHeld?: boolean; releaseStorageLock?: () => void };
    void navigator.locks.request('pcao-f:attempt-storage:v1', async () => {
      state.lockHeld = true;
      await new Promise<void>(resolve => { state.releaseStorageLock = resolve; });
    });
  });
  await expect.poll(() => page.evaluate(() => (window as typeof window & { lockHeld?: boolean }).lockHeld)).toBe(true);
  await Promise.all([
    page.getByRole('radio').first().evaluate(input => (input as HTMLInputElement).click()),
    other.getByRole('radio').last().evaluate(input => (input as HTMLInputElement).click()),
  ]);
  await page.evaluate(() => (window as typeof window & { releaseStorageLock: () => void }).releaseStorageLock());
  await expect.poll(async () => (await savedAttempt(page)).revision).toBe(1);
  await expect.poll(async () => (await page.getByRole('alert').count()) + (await other.getByRole('alert').count())).toBe(1);
  const rejected = await other.getByRole('alert').count() ? other : page;
  await expect(rejected.getByRole('alert')).toContainText('changed in another tab');
  const first = await savedAttempt(page);
  await rejected.getByRole('button', { name: 'Flag for review', exact: true }).click();
  await expect.poll(async () => (await savedAttempt(page)).revision).toBe(2);
  expect((await savedAttempt(page)).answers).toEqual(first.answers);
  expect((await savedAttempt(page)).flags).toEqual(['Q1']);
});

test('an attempt reopened before its deadline expires on Start and closes replacement confirmation', async ({ page }) => {
  const instant = new Date('2026-10-13T10:00:00Z');
  await installPausedClock(page, instant);
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed';
  let attempt = createAttempt(bank, instant.getTime() - 120 * 60_000 + 2000, 'start-expiry-fixture');
  attempt = answerQuestion(attempt, 'T1', ['A', 'C'], attempt.startedAt + 1000);
  attempt = setFlag(attempt, 'T1', true, attempt.startedAt + 1000);
  await page.addInitScript(saved => {
    const key = 'pcao-f:attempt:v1:' + saved.id;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(saved));
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    }
  }, attempt);
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Resume attempt', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start another exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Start another exam?' })).toBeVisible();
  await page.clock.fastForward(3000);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.result-metadata')).toContainText('02:00:00');
  const report = await savedAttempt(page);
  expect(report).toMatchObject({ status: 'submitted', submissionReason: 'time expired', answers: attempt.answers, flags: attempt.flags });
  expect(report.snapshot).toEqual(attempt.snapshot);
  await page.getByRole('button', { name: 'Start new attempt', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!))).toHaveLength(2);
});

test('answering and submission do not rewrite an existing history index', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'pcao-f:attempt-ids:v1') throw new Error('Index writes unavailable');
      original.call(this, key, value);
    };
  });
  await page.getByRole('radio').first().check();
  await expect.poll(async () => (await savedAttempt(page)).answers.Q1).toEqual(['A']);
  await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  expect((await savedAttempt(page)).status).toBe('submitted');
});

test('a failed initial history write leaves no hidden attempt record', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key === 'pcao-f:attempt-ids:v1') throw new Error('Quota exceeded');
      original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('exam could not be saved');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('pcao-f:attempt')))).toEqual([]);
});

test('damaged timestamps are rejected while healthy reports stay readable', async ({ page }) => {
  const good = syntheticResultsAttempt();
  const damaged = { ...good, id: 'damaged-date-fixture', submittedAt: 1e20 };
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(({ good, damaged }) => {
    localStorage.setItem('pcao-f:attempt:v1:' + good.id, JSON.stringify(good));
    localStorage.setItem('pcao-f:attempt:v1:' + damaged.id, JSON.stringify(damaged));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([damaged.id, good.id]));
  }, { good, damaged });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('saved attempts could not be read');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  await expect(page.locator('.result-number')).toHaveText('333 / 1000');
  expect(pageErrors).toEqual([]);
});

test('without coordinated saving, new attempts are disabled and reports remain readable', async ({ page }) => {
  const report = syntheticResultsAttempt();
  await page.addInitScript(saved => {
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });
    localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
  }, report);
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('cannot safely save attempts');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
});
