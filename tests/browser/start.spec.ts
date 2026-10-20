import { test, expect, type Page } from '@playwright/test';
import { reloadPage } from './navigation';

async function storedAttempts(page: Page) {
  return page.evaluate(() => {
    const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1') ?? '[]') as string[];
    return ids.map(id => JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id) ?? '{}'));
  });
}

test('Start content is private, repeated clicks create one attempt, and replacement needs keyboard confirmation', async ({ page, request }) => {
  const bank = await (await request.get('/question-bank.json')).json();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Independent PCAO-F Practice' })).toBeVisible();
  await expect(page.getByText('No attempts yet.', { exact: false })).toBeVisible();
  await expect(page.getByText('Single-answer and multiple-response')).toBeVisible();
  for (const question of bank.questions) {
    expect(await page.locator('main').innerText()).not.toContain(question.stemMarkdown);
    expect(await page.locator('main').innerText()).not.toContain(question.explanationMarkdown);
  }
  for (const domain of bank.domains) await expect(page.getByText(domain.title, { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
  const startBox = await page.getByRole('button', { name: 'Start exam', exact: true }).boundingBox();
  expect(startBox!.height).toBeGreaterThanOrEqual(44);
  expect(startBox!.width).toBeGreaterThanOrEqual(44);
  await page.getByRole('button', { name: 'Start exam', exact: true }).evaluate(button => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).evaluate(button => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const first = (await storedAttempts(page))[0];
  expect(await storedAttempts(page)).toHaveLength(1);
  expect(first.currentQuestionId).toBe(bank.questions[0].id);
  expect(first.snapshot).toEqual(bank);
  expect(first.deadlineAt - first.startedAt).toBe(120 * 60_000);
  expect(await page.locator('.option-label').allTextContents()).toEqual(bank.questions[0].options.map((option: { id: string }) => option.id));

  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await page.getByRole('button', { name: 'Start another exam' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Start another exam?' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await storedAttempts(page)).toEqual([first]);
  await expect(page.getByRole('button', { name: 'Start another exam' })).toBeFocused();
  await page.getByRole('button', { name: 'Start another exam' }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Keep unfinished attempt' }).click();
  expect(await storedAttempts(page)).toEqual([first]);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Start another exam' }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.screenshot({ path: 'screenshots/start-confirmation-320.png' });
  await page.getByRole('button', { name: 'Abandon and start Advanced exam' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const next = await storedAttempts(page);
  expect(next).toHaveLength(1);
  expect(next[0].id).not.toBe(first.id);
  expect(next[0].answers).toEqual({});
  expect(next[0].flags).toEqual([]);
});

test('refresh recovery retains answers, flags, position, snapshot and deadline', async ({ page, request }) => {
  const bank = await (await request.get('/question-bank.json')).json();
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.locator('input[name="answer-Q1"]').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 60', exact: true })).toBeVisible();
  const before = (await storedAttempts(page))[0];
  await page.route('**/question-bank.json', route => route.fulfill({ status: 503 }));
  await reloadPage(page);
  await expect(page.getByRole('heading', { name: /^Question \d+ of 60$/ })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await expect(page).toHaveURL(/\/history$/);
  await expect(page.getByRole('button', { name: 'Start another exam' })).toBeEnabled();
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 60', exact: true })).toBeVisible();
  expect((await storedAttempts(page))[0]).toEqual(before);
  expect(before.snapshot).toEqual(bank);
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.locator('input[name="answer-Q1"]').first()).toBeChecked();
  await expect(page.getByRole('button', { name: 'Flagged' })).toBeVisible();
});

test('resuming an expired attempt submits once and opens its original report', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.locator('input[name="answer-Q1"]').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await page.evaluate(() => {
    const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
    const key = 'pcao-f:attempt:v1:' + id;
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.startedAt = Date.now() - 121 * 60_000;
    saved.deadlineAt = saved.startedAt + 120 * 60_000;
    localStorage.setItem(key, JSON.stringify(saved));
  });
  const expired = (await storedAttempts(page))[0];
  await reloadPage(page);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  const submitted = (await storedAttempts(page))[0];
  expect(submitted.status).toBe('submitted');
  expect(submitted.submissionReason).toBe('time expired');
  expect(submitted.snapshot).toEqual(expired.snapshot);
  expect(submitted.answers).toEqual(expired.answers);
  expect(submitted.flags).toEqual(expired.flags);
  expect(submitted.deadlineAt).toEqual(expired.deadlineAt);
  await reloadPage(page);
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.locator('.history-row')).toContainText('Completed');
  await expect(page.locator('.history-row')).toContainText('Practice score');
  await page.getByRole('button', { name: 'Open report' }).click();
  expect((await storedAttempts(page))[0]).toEqual(submitted);
});

test('old reports retain original grading and content after bank changes', async ({ page, request }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  const bank = await (await request.get('/question-bank.json')).json();
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  for (const id of bank.questions[0].correctOptionIds) await page.locator('input[name="answer-Q1"][value="' + id + '"]').check();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  const report = (await storedAttempts(page))[0];
  const newer = structuredClone(bank);
  newer.version = 'browser-test-new-version';
  newer.questions[0].stemMarkdown = 'Modified bank content for browser testing only.';
  newer.questions[0].correctOptionIds = [bank.questions[0].options.find((option: { id: string }) => !bank.questions[0].correctOptionIds.includes(option.id)).id];
  await page.route('**/question-bank.json', route => route.fulfill({ json: newer }));
  await reloadPage(page);
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.locator('.history-row')).toContainText('Practice score 17 / 1000 · 1 / 60 correct');
  await expect(page.locator('.history-row')).toContainText('Completed');
  await page.screenshot({ path: 'screenshots/start-history-1366.png', fullPage: true });
  await page.getByRole('button', { name: 'Open report' }).click();
  await expect(page.locator('.result-number')).toHaveText('17 / 1000');
  await page.locator('.review-item').first().locator('summary').click();
  await expect(page.locator('.review-item').first()).not.toContainText(newer.questions[0].stemMarkdown);
  expect((await storedAttempts(page))[0]).toEqual(report);
});

test('loading and invalid data disable real attempts without item-level validation details', async ({ page, request }) => {
  const bank = await (await request.get('/question-bank.json')).json();
  const intermediateBank = await (await request.get('/easy-question-bank.json')).json();
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/question-bank.json', async route => { await pending; await route.fulfill({ json: bank }); });
  await page.route('**/easy-question-bank.json', async route => { await pending; await route.fulfill({ json: intermediateBank }); });
  await page.goto('/');
  await expect(page.getByRole('status')).toContainText('Loading the reviewed');
  await expect(page.locator('.status-badge')).toHaveText('Loading');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
  await expect(page.locator('.status-badge')).toHaveText('Ready');
  await page.unroute('**/question-bank.json');
  await page.unroute('**/easy-question-bank.json');
  await page.route('**/easy-question-bank.json', route => route.fulfill({ status: 503 }));
  for (const change of [
    { ...bank, contentStatus: 'synthetic' },
    { ...bank, contentStatus: 'pending' },
    { ...bank, questions: bank.questions.map((question: object, index: number) => index === 0 ? { ...question, correctOptionIds: [] } : question) },
  ]) {
    await page.route('**/question-bank.json', route => route.fulfill({ json: change }));
    await reloadPage(page);
    await expect(page.getByRole('alert')).toContainText('unavailable or incomplete');
    await expect(page.locator('.status-badge')).toHaveText('Unavailable');
    await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeDisabled();
    await expect(page.locator('main')).not.toContainText('Question Q1');
    expect(await storedAttempts(page)).toEqual([]);
    await page.unroute('**/question-bank.json');
  }
  await page.unroute('**/easy-question-bank.json');
  await page.getByRole('button', { name: 'Retry loading' }).click();
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
});

test('blocked storage has a recoverable message and no misleading empty history', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('Storage disabled'); } });
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('saved attempts could not be read');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeDisabled();
  await expect(page.getByText('No attempts yet.', { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: 'Retry saved attempts' }).click();
  await expect(page.getByRole('heading', { name: 'Independent PCAO-F Practice' })).toBeVisible();
});

test('failed initial save keeps Start open and can be retried', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    let fail = true;
    Storage.prototype.setItem = function(key, value) {
      if (fail && key.startsWith('pcao-f:attempt:v1:')) { fail = false; throw new Error('Quota exceeded'); }
      original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('exam could not be saved');
  await expect(page.getByRole('heading', { name: 'Independent PCAO-F Practice' })).toBeVisible();
  expect(await storedAttempts(page)).toEqual([]);
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  expect(await storedAttempts(page)).toHaveLength(1);
});

test('Start and its confirmation remain accessible with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 650 });
  await page.goto('/');
  await page.evaluate(() => { document.body.style.fontSize = '24px'; });
  const startButton = page.getByRole('button', { name: 'Start exam', exact: true });
  await expect(startButton).toBeEnabled();
  await startButton.focus();
  await expect(startButton).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await page.screenshot({ path: 'screenshots/start-enlarged-320.png', fullPage: true });
  await page.getByRole('button', { name: 'Start another exam' }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Abandon and start Advanced exam' })).toBeVisible();
  const box = await page.getByRole('dialog').boundingBox();
  expect(box!.y + box!.height).toBeLessThanOrEqual(651);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Start another exam' })).toBeFocused();
});
