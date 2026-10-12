import { test, expect, type Page } from '@playwright/test';

async function savedAttempt(page: Page) {
  return page.evaluate(() => {
    const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
    return JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!);
  });
}

for (const flags of [0, 1, 2]) {
  test('confirmation reminds about answered flagged questions: ' + flags, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    // Fill every item to isolate flags from unanswered warnings.
    await page.evaluate(count => {
      const id = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0];
      const key = 'pcao-f:attempt:v1:' + id;
      const attempt = JSON.parse(localStorage.getItem(key)!);
      attempt.answers = Object.fromEntries(attempt.snapshot.questions.map((question: { id: string; correctOptionIds: string[] }) => [question.id, question.correctOptionIds]));
      attempt.flags = attempt.snapshot.questions.slice(0, count).map((question: { id: string }) => question.id);
      localStorage.setItem(key, JSON.stringify(attempt));
    }, flags);
    // Recover through the real persistence path without navigating away.
    await page.getByRole('button', { name: 'Attempt history', exact: true }).click();
    await page.getByRole('button', { name: 'Go to attempt history' }).click();
    await page.getByRole('button', { name: 'Resume attempt' }).click();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Submit exam?' });
    await expect(dialog).toContainText('0 unanswered');
    if (flags === 0) await expect(dialog).not.toContainText('flagged');
    else await expect(dialog).toContainText(flags + ' flagged ' + (flags === 1 ? 'question' : 'questions') + ' to revisit');
    await expect(page.locator('[role="timer"]:visible')).toHaveCount(1);
  });
}

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('leaving for history preserves the attempt and keyboard access at ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: 'Flag for review' }).click();
    const before = await savedAttempt(page);
    const opener = page.getByRole('button', { name: 'Attempt history', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Leave exam?' });
    await expect(dialog.getByRole('heading')).toBeFocused();
    await expect(dialog).toContainText('timer will keep running');
    await expect(page.locator('[role="timer"]:visible')).toHaveCount(1);
    await expect(page.locator('.exam-bar .timer')).toBeHidden();
    await expect(dialog.getByRole('button', { name: 'Go to attempt history' })).toBeInViewport();
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Go to attempt history' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
    await page.screenshot({ path: 'screenshots/leave-exam-' + viewport.name + '.png' });
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    await expect(page.locator('.exam-bar .timer')).toBeVisible();
    expect(await savedAttempt(page)).toEqual(before);
    await opener.click();
    await page.getByRole('button', { name: 'Stay in exam' }).click();
    await expect(opener).toBeFocused();
    await opener.click();
    await page.getByRole('button', { name: 'Go to attempt history' }).click();
    await expect(page.locator('.resume-note')).toContainText('Your timer is still running');
    expect(await savedAttempt(page)).toEqual(before);
    await page.getByRole('button', { name: 'Resume attempt' }).click();
    await expect(page.getByRole('radio').first()).toBeChecked();
    await expect(page.getByRole('button', { name: 'Flagged' })).toHaveAttribute('aria-pressed', 'true');
    expect(await savedAttempt(page)).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('refresh warns, cancellation stays in exam, and acceptance recovers the original deadline', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  const before = await savedAttempt(page);
  const cancelledPrompt = page.waitForEvent('dialog');
  const cancelledReload = page.reload({ timeout: 2000 }).catch(() => null);
  const cancelled = await cancelledPrompt;
  expect(cancelled.type()).toBe('beforeunload');
  await cancelled.dismiss();
  await cancelledReload;
  await expect(page.getByRole('heading', { name: 'Question 1 of 60' })).toBeVisible();
  expect(await savedAttempt(page)).toEqual(before);
  const acceptedPrompt = page.waitForEvent('dialog');
  const acceptedReload = page.reload();
  const accepted = await acceptedPrompt;
  expect(accepted.type()).toBe('beforeunload');
  await accepted.accept();
  await acceptedReload;
  await expect(page.locator('.resume-note')).toContainText('Your timer is still running');
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  expect(await savedAttempt(page)).toEqual(before);
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  let prompts = 0;
  page.on('dialog', async dialog => { prompts++; await dialog.accept(); });
  await page.reload();
  expect(prompts).toBe(0);
});

test('browser Back warns before leaving the timed exam', async ({ page }) => {
  await page.goto('/?qa=previous');
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  const before = await savedAttempt(page);
  const prompt = page.waitForEvent('dialog');
  const back = page.goBack();
  const dialog = await prompt;
  expect(dialog.type()).toBe('beforeunload');
  await dialog.accept();
  await back;
  expect(page.url()).toContain('?qa=previous');
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  expect(await savedAttempt(page)).toEqual(before);
});

test('expiry closes the leave dialog and finalizes once without warning', async ({ page }) => {
  const instant = new Date('2026-10-12T10:00:00Z');
  await page.clock.install({ time: instant });
  await page.clock.pauseAt(instant);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  const before = await savedAttempt(page);
  await page.getByRole('button', { name: 'Attempt history', exact: true }).click();
  await page.clock.fastForward(120 * 60_000);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const after = await savedAttempt(page);
  expect(after.answers).toEqual(before.answers);
  expect(after.submissionReason).toBe('time expired');
  let prompts = 0;
  page.on('dialog', async dialog => { prompts++; await dialog.accept(); });
  await page.reload();
  expect(prompts).toBe(0);
});

for (const elapsed of [92500, 103000]) {
  test('countdown reconciles with saved report time at ' + elapsed + ' ms', async ({ page }) => {
    const instant = new Date('2026-10-12T10:00:00Z');
    await page.clock.install({ time: instant });
    await page.clock.pauseAt(instant);
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await page.clock.runFor(elapsed);
    const remaining = elapsed === 92500 ? '01:58:28' : '01:58:17';
    const used = elapsed === 92500 ? '00:01:32' : '00:01:43';
    await expect(page.getByRole('dialog').getByRole('timer')).toContainText(remaining);
    await page.getByRole('button', { name: 'Confirm submission' }).click();
    await expect(page.locator('.result-metadata')).toContainText('Time used' + used);
    const submitted = await savedAttempt(page);
    expect(submitted.submittedAt - submitted.startedAt).toBe(elapsed);
    await page.clock.runFor(11000);
    await expect(page.locator('.result-metadata')).toContainText('Time used' + used);
    expect(await savedAttempt(page)).toEqual(submitted);
  });
}
