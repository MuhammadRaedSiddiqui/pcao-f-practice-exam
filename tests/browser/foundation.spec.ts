import { test, expect } from '@playwright/test';
import { reloadPage } from './navigation';

const viewports = [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
];

for (const viewport of viewports) {
  test(`complete practice flow at ${viewport.name}`, async ({ page, request }) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    const response = await request.get('/question-bank.json');
    expect(response.ok()).toBe(true);
    const bank = await response.json();
    expect(bank.version).toBe('1.1.0');
    expect(bank.questions).toHaveLength(60);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Before you begin' })).toBeVisible();
    await expect(page.getByText('Dataset 1.1.0')).toBeVisible();
    await page.screenshot({ path: `screenshots/exam-start-${viewport.name}.png`, fullPage: true });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.getByRole('button', { name: /^Start (exam|new attempt)$/ }).click();
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 60' })).toBeVisible();
    await expect(page.getByRole('timer')).toContainText(':');
    for (const id of bank.questions[0].correctOptionIds) await page.locator(`input[name="answer-Q1"][value="${id}"]`).check();
    await page.getByRole('button', { name: 'Flag for review' }).click();
    await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Question 2 of 60' })).toBeVisible();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: /^Question 8:/ }).click();
    await expect(page.getByRole('heading', { name: 'Question 8 of 60' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Scrollable content table' })).toBeVisible();
    for (const id of bank.questions[7].correctOptionIds) await page.locator(`input[name="answer-Q8"][value="${id}"]`).check();
    await page.screenshot({ path: `screenshots/exam-question-${viewport.name}.png` });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: /^Question 4:/ }).click();
    await page.locator(`input[name="answer-Q4"][value="${bank.questions[3].correctOptionIds[0]}"]`).check();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog')).toContainText('57');
    await expect(page.getByRole('dialog')).not.toContainText(/Partially selected|Incomplete selection/i);
    await expect(page.getByRole('dialog')).toContainText('flagged');
    const dialogBox = await page.getByRole('dialog').boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(viewport.height + 1);
    await page.screenshot({ path: `screenshots/exam-review-${viewport.name}.png` });
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Your results' })).toBeVisible();
    await expect(page.locator('.result-number')).toHaveText('33 / 1000');
    await expect(page.locator('.secondary-result-number')).toHaveText('2 / 60');
    await page.screenshot({ path: `screenshots/exam-results-summary-${viewport.name}.png` });
    await page.locator('.review-item').nth(7).locator('summary').click();
    await page.locator('.review-item').nth(7).scrollIntoViewIfNeeded();
    await expect(page.locator('.review-item').nth(7)).toContainText('Sources');
    await page.screenshot({ path: `screenshots/exam-results-review-${viewport.name}.png` });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await reloadPage(page);
    await expect(page.getByRole('heading', { name: 'Your attempts' })).toBeVisible();
    await page.getByRole('button', { name: 'Open report' }).click();
    await expect(page.locator('.result-number')).toHaveText('33 / 1000');
  });
}

test('enlarged text keeps exam and review controls reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 650 });
  await page.goto('/');
  await page.evaluate(() => { document.body.style.fontSize = '24px'; });
  await page.getByRole('button', { name: /^Start (exam|new attempt)$/ }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.locator('input[name="answer-Q1"]').first().focus();
  await page.keyboard.press('Space');
  await expect(page.locator('input[name="answer-Q1"]').first()).toBeChecked();
  await page.getByRole('button', { name: 'Review & submit' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Submit exam', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('an existing attempt keeps its snapshot when a newer bank appears', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const published = await (await request.get('/question-bank.json')).json();
  await page.goto('/');
  await page.getByRole('button', { name: /^Start (exam|new attempt)$/ }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.locator(`input[name="answer-Q1"][value="${published.questions[0].correctOptionIds[0]}"]`).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const beforeResize = await page.evaluate(() => { const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1') ?? '[]'); return JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + ids[0]) ?? '{}'); });
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.getByRole('heading', { name: 'Question 2 of 60' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Flagged' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  const afterResize = await page.evaluate(() => { const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1') ?? '[]'); return JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + ids[0]) ?? '{}'); });
  expect(afterResize.deadlineAt).toBe(beforeResize.deadlineAt);
  expect(afterResize.currentQuestionId).toBe(beforeResize.currentQuestionId);
  expect(afterResize.answers).toEqual(beforeResize.answers);
  expect(afterResize.flags).toEqual(beforeResize.flags);
  await page.getByRole('button', { name: 'Attempt history' }).click();
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await expect(page.locator('.history-row').first()).toContainText('Dataset 1.1.0');

  await page.route('**/question-bank.json', async route => {
    await route.fulfill({ json: { ...published, version: '1.2.0-test' } });
  });
  await reloadPage(page);
  await expect(page.getByText('Dataset 1.2.0-test')).toBeVisible();
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 60' })).toBeVisible();
  await expect(page.getByText('dataset 1.1.0', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Flagged' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.locator(`input[name="answer-Q1"][value="${published.questions[0].correctOptionIds[0]}"]`)).toBeChecked();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await expect(page.locator('.result-number')).toHaveText('17 / 1000');
  await page.getByRole('button', { name: /^Start (exam|new attempt)$/ }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByText('dataset 1.2.0-test', { exact: false })).toBeVisible();
});

test('touch can start, answer, review, and submit', async ({ browser, request }) => {
  const published = await (await request.get('/question-bank.json')).json();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await page.getByRole('button', { name: /^Start (exam|new attempt)$/ }).tap();
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).tap();
    await page.locator(`label.option-card:has(input[value="${published.questions[0].correctOptionIds[0]}"])`).tap();
    await page.getByRole('button', { name: 'Review & submit' }).tap();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).tap();
    await page.getByRole('button', { name: 'Confirm submission' }).tap();
    await expect(page.locator('.result-number')).toHaveText('17 / 1000');
  } finally {
    await context.close();
  }
});
