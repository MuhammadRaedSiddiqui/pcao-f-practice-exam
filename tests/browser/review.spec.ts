import { test, expect, type Page } from '@playwright/test';
import { installPausedClock } from './navigation';

async function stored(page: Page) {
  return page.evaluate(() => {
    const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!);
    return { ids, attempt: JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + ids[0])!) };
  });
}

async function jump(page: Page, number: number) {
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: new RegExp('^Question ' + number + ':') }).click();
  await expect(page.getByRole('heading', { name: 'Question ' + number + ' of 60', exact: true })).toBeFocused();
}

async function countWrites(page: Page) {
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
}

test('review counts independent flags, traps focus, jumps including current, and restores unchanged answers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await jump(page, 4);
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 5 of 60' })).toBeFocused();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const before = await stored(page);
  const opener = page.getByRole('button', { name: 'Review & submit' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Review and submit', exact: true });
  await expect(dialog.getByRole('heading', { name: 'Review and submit' })).toBeFocused();
  await expect(dialog.locator('.question-number')).toHaveCount(60);
  await expect(dialog.locator('.review-summary > div').nth(0)).toHaveText('59unanswered');
  await expect(dialog.locator('.review-summary > div').nth(1)).toHaveText('1answered');
  await expect(dialog.locator('.review-summary > div').nth(2)).toHaveText('3flagged');
  await expect(dialog.getByRole('list', { name: 'Question status legend' }).getByRole('listitem')).toContainText(['Answered', 'Unanswered', 'Flagged', 'Current question']);
  await expect(dialog.getByRole('button', { name: 'Question 1: answered, flagged', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Question 4: unanswered, flagged', exact: true })).toBeVisible();
  const current = dialog.getByRole('button', { name: 'Question 5: unanswered, flagged, current question', exact: true });
  await expect(current).toHaveAttribute('aria-current', 'step');
  await expect(dialog.getByRole('button', { name: 'Question 6: unanswered', exact: true })).toBeVisible();
  await expect(dialog).not.toContainText(/Correct:|Explanation|Sources/);
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Submit exam', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Submit exam', exact: true })).toBeFocused();
  await dialog.getByRole('button', { name: 'Back to exam' }).click();
  await expect(opener).toBeFocused();
  expect(await stored(page)).toEqual(before);
  await opener.click();
  await page.getByRole('button', { name: /^Question 5:/ }).click();
  await expect(page.getByRole('heading', { name: 'Question 5 of 60' })).toBeFocused();
  await jump(page, 4);
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  expect((await stored(page)).attempt.answers).toEqual(before.attempt.answers);
  await opener.click();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('cancelled confirmation preserves selections; confirmed double clicks save blanks, partials, score and one report', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await jump(page, 4);
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const before = await stored(page);
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'Submit exam?', exact: true });
  await expect(confirmation).toContainText('60 unanswered');
  await expect(confirmation).toContainText('1 flagged question');
  await expect(confirmation).toContainText('includes questions without the required number of selections');
  await expect(confirmation.getByRole('heading')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Review and submit', exact: true })).toBeVisible();
  expect(await stored(page)).toEqual(before);
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Back to review' }).click();
  expect(await stored(page)).toEqual(before);
  await page.getByRole('button', { name: 'Back to exam' }).click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await countWrites(page);
  await page.getByRole('button', { name: 'Confirm submission' }).evaluate(button => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByRole('checkbox')).toHaveCount(0);
  const submitted = await stored(page);
  expect(submitted.ids).toEqual(before.ids);
  expect(submitted.attempt.status).toBe('submitted');
  expect(submitted.attempt.submissionReason).toBe('manual');
  expect(submitted.attempt.answers).toEqual(before.attempt.answers);
  expect(submitted.attempt.flags).toEqual(before.attempt.flags);
  expect(submitted.attempt.result).toMatchObject({ correct: 0, total: 60, percentage: 0 });
  expect(await page.locator('body').getAttribute('data-submitted-writes')).toBe('1');
  await page.reload();
  await page.getByRole('button', { name: 'Open report' }).click();
  expect(await stored(page)).toEqual(submitted);
});

for (const trigger of ['interval', 'manual overlap']) {
  test('expiry during confirmation takes priority: ' + trigger, async ({ page }) => {
    const instant = new Date('2026-10-12T10:00:00Z');
    await installPausedClock(page, instant);
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
    await page.getByRole('radio').first().check();
    const before = await stored(page);
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await countWrites(page);
    await expect(page.getByRole('dialog', { name: 'Submit exam?' })).toBeVisible();
    if (trigger === 'interval') await page.clock.fastForward(120 * 60_000);
    else {
      await page.clock.setSystemTime(before.attempt.deadlineAt);
      await page.getByRole('button', { name: 'Confirm submission' }).evaluate(button => {
        (button as HTMLButtonElement).click();
        document.dispatchEvent(new Event('visibilitychange'));
        window.dispatchEvent(new Event('focus'));
        (button as HTMLButtonElement).click();
        window.dispatchEvent(new Event('pageshow'));
      });
    }
    await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const after = await stored(page);
    expect(after.ids).toEqual(before.ids);
    expect(after.attempt.submissionReason).toBe('time expired');
    expect(after.attempt.answers).toEqual(before.attempt.answers);
    expect(after.attempt.result.total).toBe(60);
    expect(await page.locator('body').getAttribute('data-submitted-writes')).toBe('1');
    await page.clock.runFor(5000);
    expect(await stored(page)).toEqual(after);
  });
}

test('submission save failure stays in confirmation, reports the error, and permits retry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const before = await stored(page);
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    document.body.dataset.failWrites = 'true';
    Storage.prototype.setItem = function(key, value) {
      if (document.body.dataset.failWrites === 'true') throw new Error('Quota exceeded');
      original.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Attempt could not be saved');
  expect(await stored(page)).toEqual(before);
  await page.evaluate(() => { document.body.dataset.failWrites = 'false'; });
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
});

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('review grid and confirmation fit at ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
    await jump(page, 4);
    await page.getByRole('checkbox').first().check();
    await page.getByRole('button', { name: 'Flag for review' }).click();
    await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.question-number')).toHaveCount(60);
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Back to exam' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Submit exam', exact: true })).toBeInViewport();
    await page.screenshot({ path: 'screenshots/review-submit-' + viewport.name + '.png' });
    const last = dialog.getByRole('button', { name: /^Question 60:/ });
    await last.scrollIntoViewIfNeeded();
    const numberBox = await last.boundingBox();
    expect(numberBox!.width).toBeGreaterThanOrEqual(44);
    expect(numberBox!.height).toBeGreaterThanOrEqual(44);
    await last.click();
    await expect(page.getByRole('heading', { name: 'Question 60 of 60' })).toBeFocused();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await expect(dialog).toContainText('60 unanswered');
    await expect(dialog).toContainText('1 flagged question');
    await expect(page.locator('[role="timer"]:visible')).toHaveCount(1);
    await expect(page.locator('.exam-bar .timer')).toBeHidden();
    await expect(dialog).toContainText('includes questions without the required number of selections');
    await expect(page.getByRole('button', { name: 'Confirm submission' })).toBeInViewport();
    await page.screenshot({ path: 'screenshots/submit-confirmation-' + viewport.name + '.png' });
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Review & submit' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
