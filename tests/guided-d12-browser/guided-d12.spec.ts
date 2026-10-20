import { test, expect } from '@playwright/test';
import { mockAccountServer } from '../fixtures/accountServer';
import { saved } from '../guided-browser/helpers';

test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });
for (const size of [5,10] as const) test(`D12: eleven eligible items expose exact ${size}-item final range and repeats, with durable membership`, async ({ page }, info) => {
  await page.setViewportSize({ width: size === 5 ? 320 : 1366, height: 900 });
  await page.goto('/guided');
  await expect(page.getByText('Intermediate · 11 questions with compatible approved guidance')).toBeVisible();
  await page.getByLabel('Session length').selectOption(String(size));
  const set = page.getByLabel('Practice set', { exact: true });
  const index = size === 5 ? 2 : 1;
  await expect(set.locator('option').last()).toHaveText(size === 5 ? 'Set 3 of 3 · eligible questions 7–11 · 4 repeated questions' : 'Set 2 of 2 · eligible questions 2–11 · 9 repeated questions');
  await expect(page.getByText('No question repeats within a set.', { exact: false })).toBeVisible();
  await set.selectOption(String(index));
  await expect(page.getByText(`Selected set: Set ${index + 1}`, { exact: false })).toContainText(`${size === 5 ? 4 : 9} repeated questions`);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('d12-range-and-overlap.png'), fullPage: true });
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeVisible();
  const s = await saved(page);
  expect(s.items.map((i: any) => i.question.id)).toEqual(size === 5 ? ['T7','T8','T9','T10','T11'] : ['T2','T3','T4','T5','T6','T7','T8','T9','T10','T11']);
  expect(new Set(s.items.map((i: any) => i.question.id)).size).toBe(size);
  await page.reload(); await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeVisible();
  expect(await saved(page)).toEqual(s);
});
for (const count of [4,9]) test(`D12: ${count} eligible items disable insufficient sizes without silently shortening`, async ({ page }) => {
  await page.addInitScript(count => sessionStorage.setItem('synthetic-d12-fixture', JSON.stringify({ count, revoked: [] })), count);
  await page.goto('/guided'); await expect(page.getByText(`Intermediate · ${count} questions with compatible approved guidance`)).toBeVisible();
  await expect(page.getByLabel('Session length').locator('option[value="10"]')).toBeDisabled();
  if (count === 4) {
    await expect(page.getByLabel('Session length').locator('option[value="5"]')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeDisabled();
    await expect(page.getByText('4 available; a complete 5-question session is required.')).toBeVisible();
  } else {
    await expect(page.getByLabel('Practice set', { exact: true }).locator('option').last()).toContainText('eligible questions 5–9 · 1 repeated question');
  }
});
test('D12: withdrawn items never appear in new complete sets', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('synthetic-d12-fixture', JSON.stringify({ count: 10, revoked: [1] })));
  await page.goto('/guided'); await expect(page.getByText('Intermediate · 9 questions with compatible approved guidance')).toBeVisible();
  await expect(page.getByText('Withdrawn or mismatched guidance is excluded.', { exact: false })).toBeVisible();
  await page.getByLabel('Practice set', { exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  expect((await saved(page)).items.map((i: any) => i.question.id)).toEqual(['T6','T7','T8','T9','T10']);
});

test('D12: frozen committed sessions survive unrelated withdrawals; withdrawal of a frozen item blocks without mutation', async ({ page }) => {
  await page.goto('/guided');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toHaveAttribute('aria-expanded', 'true');
  for (const i of [0,2]) { await page.locator('.guided-options input').nth(i).check(); await expect(page.locator('.guided-options input').nth(i)).toBeEnabled(); }
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  const before = await saved(page); const url = page.url();
  await page.evaluate(async () => {
    const runtime = '/src/domain/guided/runtime.ts'; const { runtimeCatalog } = await import(runtime);
    for (let i = 6; i <= 11; i++) runtimeCatalog[0].revokedDigests.push(runtimeCatalog[0].approvedEntries['T' + i]);
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
  });
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  expect(await saved(page)).toEqual(before);
  await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await expect(page.getByText('Intermediate · 5 questions with compatible approved guidance')).toBeVisible();
  await expect(page.getByLabel('Session length').locator('option[value="10"]')).toBeDisabled();
  await page.getByRole('link', { name: 'Resume practice', exact: true }).click();
  await expect(page).toHaveURL(url); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  expect(await saved(page)).toEqual(before);
  await page.evaluate(async () => {
    const runtime = '/src/domain/guided/runtime.ts'; const { runtimeCatalog } = await import(runtime);
    runtimeCatalog[0].revokedDigests.push(runtimeCatalog[0].approvedEntries.T1);
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
  });
  await expect(page.getByText(/withdrawn content cannot be shown/)).toBeVisible();
  await expect(page.locator('.guided-feedback')).toHaveCount(0);
  expect(await saved(page)).toEqual(before);
});

test('D12: changed coverage invalidates a selected set explicitly until the learner chooses an available set', async ({ page }) => {
  await page.goto('/guided');
  await expect(page.getByText('Intermediate · 11 questions with compatible approved guidance')).toBeVisible();
  await page.getByLabel('Practice set', { exact: true }).selectOption('2');
  await page.evaluate(async () => {
    const runtime = '/src/domain/guided/runtime.ts'; const { runtimeCatalog } = await import(runtime);
    for (const id of ['T10','T11']) runtimeCatalog[0].revokedDigests.push(runtimeCatalog[0].approvedEntries[id]);
  });
  await page.getByRole('button', { name: 'Retry saved sessions', exact: true }).click();
  await expect(page.getByText('Intermediate · 9 questions with compatible approved guidance')).toBeVisible();
  await expect(page.getByLabel('Practice set', { exact: true })).toHaveValue('2');
  await expect(page.getByText('Coverage changed. Choose an available set before starting; no replacement set was selected.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeDisabled();
  await page.getByLabel('Practice set', { exact: true }).selectOption('1');
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  expect((await saved(page)).items.map((i: any) => i.question.id)).toEqual(['T5','T6','T7','T8','T9']);
});
