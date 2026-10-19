import { test, expect } from '@playwright/test';
import { mockAccountServer } from '../fixtures/accountServer';
import { saved, startPractice } from './helpers';
test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });

for (const size of [5, 10] as const) test(`complete ${size} questions with single/two/three choices, immutable first answers and reload`, async ({ page }, testInfo) => {
  await startPractice(page, size);
  const initial = await saved(page);
  const mockBefore = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('pcao-f:attempt'))));
  for (let index = 0; index < size; index++) {
    const count = index === 0 ? 2 : index === 2 ? 3 : 1;
    await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
    await expect(page.getByText('Synthetic postcommit reasoning', { exact: true })).toHaveCount(0);
    const controls = page.locator('.guided-options input');
    for (let i = 0; i < count; i++) { await controls.nth(i).check(); await expect(controls.nth(i)).toBeEnabled(); }
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
    await expect(page.getByText('Synthetic postcommit reasoning', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toHaveCount(0);
    const record = await saved(page); expect(record.responses[record.items[index].question.id].commitment).not.toBeNull();
    if (index === 0) { await page.reload(); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); }
    if (index < size - 1) { await page.getByRole('button', { name: 'Next', exact: true }).click(); await expect(page.getByRole('heading', { name: `Question ${index + 2} of ${size}`, exact: true })).toBeInViewport(); }
  }
  await page.getByRole('button', { name: 'Finish practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeFocused();
  const final = await saved(page); expect(final.items).toEqual(initial.items); expect(final.status).toBe('completed');
  await page.screenshot({ path: testInfo.outputPath('completed-practice.png'), fullPage: true });
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('pcao-f:attempt'))))).toEqual(mockBefore);
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Question ${size - 1} of ${size}`, exact: true })).toBeVisible();
  expect((await saved(page)).revision).toBe(final.revision);
  await page.getByRole('button', { name: 'Review question 1', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toHaveCount(0);
  expect(await saved(page)).toEqual(final);
  await expect(page.getByRole('group', { name: 'Questions to revisit' })).not.toContainText(/T\d+/);
});

test('sequential saved hints, collapse, cap, draft clearing/navigation and exact reload', async ({ page }) => {
  const url = await startPractice(page);
  for (let hint = 1; hint <= 3; hint++) {
    await page.getByRole('button', { name: `Hint ${hint}`, exact: true }).click();
    await expect(page.locator('.guided-hint-toggle[aria-expanded="true"]')).toHaveCount(hint);
    expect((await saved(page)).responses.T1.maxHintRevealed).toBe(hint);
    await page.reload(); await expect(page.locator('.guided-hint-toggle[aria-expanded="true"]')).toHaveCount(0);
    for (let prior = 1; prior <= hint; prior++) await page.getByRole('button', { name: 'Hint ' + prior, exact: true }).click();
    await expect(page.locator('.guided-hint-toggle[aria-expanded="true"]')).toHaveCount(hint);
  }
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  const inputs = page.locator('.guided-options input'); await inputs.nth(0).check(); await inputs.nth(1).check();
  await expect(inputs.nth(2)).toBeDisabled();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 5', exact: true })).toBeVisible();
  await page.reload(); await expect(page.getByRole('heading', { name: 'Question 2 of 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous', exact: true }).click(); await expect(inputs.nth(0)).toBeChecked();
  await page.getByRole('button', { name: 'Clear selection', exact: true }).click(); await expect(inputs.nth(0)).not.toBeChecked();
  expect((await saved(page)).responses.T1.maxHintRevealed).toBe(3); expect(page.url()).toBe(url);
});

test('numbered sets reach all ten and changing length resets the selected set', async ({ page }) => {
  await startPractice(page, 5, 1); expect((await saved(page)).items.map((i: any) => i.question.id)).toEqual(['T6', 'T7', 'T8', 'T9', 'T10']);
  await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await page.getByLabel('Session length').selectOption('10'); await expect(page.getByLabel('Practice set', { exact: true })).toHaveValue('0');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 10', exact: true })).toBeVisible();
  expect((await saved(page)).items).toHaveLength(10);
});

test('explicit removal affects only the selected guided session', async ({ page }) => {
  await startPractice(page); const first = page.url();
  await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await page.getByRole('button', { name: 'Remove practice session', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Keep session', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Resume practice', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove practice session', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Remove this practice session', exact: true }).click();
  await expect(page.getByText('No accessible saved sessions.', { exact: true })).toBeVisible();
  await page.goto(first); await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
});


test('skipped questions explain disabled Finish and wrap to the next unanswered question', async ({ page }) => {
  await startPractice(page);
  for (let index = 1; index < 5; index++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: `Question ${index + 1} of 5`, exact: true })).toBeVisible();
  }
  await page.locator('.guided-options input').first().check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  const nav = page.getByRole('navigation', { name: 'Practice questions' });
  await expect(nav).toContainText('1 of 5 answers checked. 4 questions still need checking before you can finish.');
  await expect(nav.getByRole('button', { name: 'Finish practice', exact: true })).toBeDisabled();
  const describedBy = await nav.getByRole('button', { name: 'Finish practice', exact: true }).getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  await expect(page.locator('[id="' + describedBy + '"]')).toContainText('4 questions still need checking');
  expect(await nav.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(await page.getByRole('heading', { name: 'Decisive criteria', exact: true }).evaluate(el => el.getBoundingClientRect().top));
  await nav.getByRole('button', { name: 'Go to next unanswered question', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeInViewport();
  await page.locator('.guided-options input').nth(0).check();
  await page.locator('.guided-options input').nth(1).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(nav).toContainText('2 of 5 answers checked. 3 questions still need checking');
  await nav.getByRole('button', { name: 'Go to next unanswered question', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 5', exact: true })).toBeInViewport();
  const record = await saved(page);
  expect(record.responses.T1.commitment).not.toBeNull();
  expect(record.responses.T5.commitment).not.toBeNull();
  expect(record.responses.T2.commitment).toBeNull();
});
