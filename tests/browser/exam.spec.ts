import { test, expect, type Page } from '@playwright/test';
import { installPausedClock, reloadPage } from './navigation';

async function storedAttempt(page: Page) {
  return page.evaluate(() => {
    const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
    return JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!);
  });
}

async function jump(page: Page, position: number) {
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: new RegExp('^Question ' + position + ':') }).click();
  await expect(page.getByRole('heading', { name: 'Question ' + position + ' of 60', exact: true })).toBeFocused();
}

test('complete means required cardinality, partial answers persist, and checkbox limits permit deselection', async ({ page, request }) => {
  const bank = await (await request.get('/question-bank.json')).json();
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  const incorrect = bank.questions[0].options.find((option: { id: string }) => !bank.questions[0].correctOptionIds.includes(option.id));
  await page.locator('input[value="' + incorrect.id + '"]').check();
  await expect(page.locator('.answered-count')).toHaveText('1 / 60answered');
  await page.getByRole('button', { name: 'Clear answer' }).click();
  await expect(page.locator('.answered-count')).toHaveText('0 / 60answered');
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await jump(page, 4);
  await expect(page.getByText('Select exactly TWO', { exact: true })).toBeVisible();
  const choices = page.getByRole('checkbox');
  await choices.nth(0).check();
  await expect(page.getByRole('status')).toContainText('1 of 2 selected');
  await expect(page.locator('.answered-count')).toHaveText('0 / 60answered');
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const partial = await storedAttempt(page);
  expect(partial.answers.Q4).toEqual([bank.questions[3].options[0].id]);
  expect(partial.flags).toEqual(['Q4']);
  expect(partial.currentQuestionId).toBe('Q4');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 5 of 60', exact: true })).toBeFocused();
  expect((await storedAttempt(page)).currentQuestionId).toBe('Q5');
  await reloadPage(page);
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('heading', { name: 'Question 5 of 60' })).toBeFocused();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(choices.nth(0)).toBeChecked();
  await expect(page.getByRole('button', { name: 'Flagged' })).toHaveAttribute('aria-pressed', 'true');
  expect((await storedAttempt(page)).deadlineAt).toBe(partial.deadlineAt);
  await choices.nth(1).check();
  await expect(page.locator('.answered-count')).toHaveText('1 / 60answered');
  await expect(choices.nth(2)).toBeDisabled();
  await choices.nth(0).uncheck();
  await expect(choices.nth(2)).toBeEnabled();
  await choices.nth(2).check();
  await expect.poll(async () => (await storedAttempt(page)).answers.Q4).toEqual([bank.questions[3].options[1].id, bank.questions[3].options[2].id]);
  await jump(page, 37);
  await expect(page.getByText('Select exactly THREE', { exact: true })).toBeVisible();
  for (let i = 0; i < 3; i++) await page.getByRole('checkbox').nth(i).check();
  await expect(page.getByRole('checkbox').nth(3)).toBeDisabled();
  await page.getByRole('checkbox').nth(1).uncheck();
  await expect(page.getByRole('status')).toContainText('2 of 3 selected');
  await jump(page, 60);
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 59 of 60' })).toBeFocused();
});

test('deadline catches up after suspended ticks and repeated expiry events finalize latest saved answers once', async ({ page }) => {
  const instant = new Date('2026-10-12T10:00:00Z');
  await installPausedClock(page, instant);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await page.getByRole('radio').nth(0).check();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const latest = await storedAttempt(page);
  await page.clock.setSystemTime(instant.getTime() + 30 * 60_000);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect(page.getByRole('timer')).toContainText('01:30:00');
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    document.body.dataset.submittedWrites = '0';
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('pcao-f:attempt:v1:') && JSON.parse(value).status === 'submitted') {
        document.body.dataset.submittedWrites = String(Number(document.body.dataset.submittedWrites) + 1);
      }
      original.call(this, key, value);
    };
  });
  await page.clock.setSystemTime(latest.deadlineAt);
  await page.evaluate(() => {
    for (let i = 0; i < 3; i++) {
      document.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('focus'));
      window.dispatchEvent(new Event('pageshow'));
    }
  });
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const submitted = await storedAttempt(page);
  expect(submitted.status).toBe('submitted');
  expect(submitted.submissionReason).toBe('time expired');
  expect(submitted.submittedAt).toBe(latest.deadlineAt);
  expect(submitted.answers).toEqual(latest.answers);
  expect(submitted.flags).toEqual(latest.flags);
  expect(submitted.snapshot).toEqual(latest.snapshot);
  expect(await page.locator('body').getAttribute('data-submitted-writes')).toBe('1');
  await page.clock.runFor(5000);
  expect(await storedAttempt(page)).toEqual(submitted);
});

test('interval expiry continues in review and answers cannot change after the deadline', async ({ page }) => {
  const instant = new Date('2026-10-12T10:00:00Z');
  await installPausedClock(page, instant);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.clock.fastForward(120 * 60_000);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  expect((await storedAttempt(page)).submissionReason).toBe('time expired');
  await reloadPage(page);
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const before = await storedAttempt(page);
  await page.clock.setSystemTime(before.deadlineAt);
  // The expiry guard removes this input; do not wait for it to become checked.
  await page.getByRole('radio').nth(1).evaluate(input => (input as HTMLInputElement).click());
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
  expect((await storedAttempt(page)).answers).toEqual({});
});

test('refresh and reopening use the original deadline and auto-submit expired saved attempts', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  const saved = await storedAttempt(page);
  await reloadPage(page);
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  expect((await storedAttempt(page)).deadlineAt).toBe(saved.deadlineAt);
  await page.evaluate(() => {
    const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
    const key = 'pcao-f:attempt:v1:' + id;
    const attempt = JSON.parse(localStorage.getItem(key)!);
    attempt.startedAt = Date.now() - 121 * 60_000;
    attempt.deadlineAt = attempt.startedAt + 120 * 60_000;
    localStorage.setItem(key, JSON.stringify(attempt));
  });
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto('/');
  await expect(reopened.getByRole('heading', { name: 'Your results' })).toBeVisible();
  const report = await storedAttempt(reopened);
  expect(report.status).toBe('submitted');
  expect(report.answers).toEqual(saved.answers);
  expect(report.submissionReason).toBe('time expired');
  await reopened.reload();
  await reopened.getByRole('button', { name: 'Open report' }).click();
  expect(await storedAttempt(reopened)).toEqual(report);
});

test('failed saves keep recorded answers, flags and position until storage recovers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const before = await storedAttempt(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    document.body.dataset.failWrites = 'true';
    Storage.prototype.setItem = function(key, value) {
      if (document.body.dataset.failWrites === 'true' && key.startsWith('pcao-f:attempt:v1:')) throw new Error('Quota exceeded');
      original.call(this, key, value);
    };
  });
  await page.getByRole('radio').first().click();
  await expect(page.getByRole('alert')).toContainText('Attempt could not be saved');
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flag for review' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60' })).toBeVisible();
  expect(await storedAttempt(page)).toEqual(before);
  await page.evaluate(() => { document.body.dataset.failWrites = 'false'; });
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 60' })).toBeFocused();
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect((await storedAttempt(page)).flags).toEqual(['Q1']);
  expect((await storedAttempt(page)).answers.Q1).toHaveLength(1);
});

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('narrative, table, persistent bar and keyboard access at ' + viewport.name, async ({ page, request }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const bank = await (await request.get('/question-bank.json')).json();
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
    await jump(page, 3);
    await expect(page.locator('.question-stem .markdown > p')).toHaveCount(3);
    await expect(page.locator('.question-stem table tbody tr')).toHaveCount(6);
    for (const domain of bank.domains) await expect(page.getByText(domain.title, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Explanation', exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Sources', exact: true })).toHaveCount(0);
    await page.screenshot({ path: 'screenshots/exam-narrative-' + viewport.name + '.png', fullPage: true });
    await page.getByRole('button', { name: 'Next', exact: true }).scrollIntoViewIfNeeded();
    const bar = await page.locator('.exam-bar').boundingBox();
    expect(bar!.y).toBe(0);
    expect(bar!.y + bar!.height).toBeLessThan(viewport.height);
    await expect(page.getByRole('timer')).toBeVisible();
    await expect(page.locator('.answered-count')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await jump(page, 8);
    await expect(page.locator('.question-stem blockquote')).toHaveCount(1);
    await expect(page.getByRole('region', { name: 'Scrollable content table' })).toHaveAttribute('tabindex', '0');
    await page.getByRole('region', { name: 'Scrollable content table' }).focus();
    await page.keyboard.press('ArrowRight');
    const tableScrolls = await page.getByRole('region', { name: 'Scrollable content table' }).evaluate(el => ({ width: el.clientWidth, content: el.scrollWidth, left: el.scrollLeft }));
    if (viewport.width <= 390) {
      expect(tableScrolls.content).toBeGreaterThan(tableScrolls.width);
      await expect.poll(() => page.getByRole('region', { name: 'Scrollable content table' }).evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
      const beforeTick = await page.getByRole('timer').innerText();
      await expect(page.getByRole('timer')).not.toHaveText(beforeTick);
      await expect(page.getByRole('region', { name: 'Scrollable content table' })).toBeFocused();
      expect(await page.getByRole('region', { name: 'Scrollable content table' }).evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    }
    await page.getByRole('checkbox').first().focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('checkbox').first()).toBeChecked();
    const optionBox = await page.locator('.option-card').first().boundingBox();
    expect(optionBox!.height).toBeGreaterThanOrEqual(44);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: 'screenshots/exam-table-' + viewport.name + '.png', fullPage: true });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
