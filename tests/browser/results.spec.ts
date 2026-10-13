import { test, expect, type Page } from '@playwright/test';
import { installPausedClock } from './navigation';
import { syntheticResultsAttempt } from '../fixtures/syntheticResultsAttempt';

async function openSyntheticReport(page: Page, flagged = true) {
  const attempt = syntheticResultsAttempt();
  if (!flagged) attempt.flags = [];
  await page.addInitScript(saved => {
    const key = 'pcao-f:attempt:v1:' + saved.id;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(saved));
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    }
  }, attempt);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open report' }).click();
  return attempt;
}

function item(page: Page, id: string) {
  return page.locator('.review-item').filter({ has: page.locator('summary strong', { hasText: new RegExp('· ' + id + '$') }) });
}

test('known synthetic results have independent totals, exclusive filters and exact review metadata', async ({ page }) => {
  const attempt = await openSyntheticReport(page);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.locator('.result-number')).toHaveText('333 / 1000');
  await expect(page.locator('.secondary-result-number')).toHaveText('20 / 60');
  await expect(page.locator('.result-counts dd')).toHaveText(['20', '8', '32']);
  await expect(page.locator('.result-metadata')).toContainText('00:37:42');
  await expect(page.locator('.result-metadata')).toContainText('Manual submission');
  await expect(page.locator('.result-metadata')).toContainText('fixture-1');
  const expected = [
    ['D1', '2 / 8 · 25%'], ['D2', '3 / 13 · 23.1%'], ['D3', '0 / 7 · 0%'],
    ['D4', '5 / 10 · 50%'], ['D5', '7 / 7 · 100%'], ['D6', '2 / 9 · 22.2%'], ['D7', '1 / 6 · 16.7%'],
  ];
  for (const [id, result] of expected) await expect(page.locator('[data-domain-id="' + id + '"] > strong')).toHaveText(result);
  await expect(page.locator('.focus-review li')).toContainText(['D3', 'D7', 'D6']);
  await expect(page.locator('.review-item')).toHaveCount(60);
  await expect(page.locator('.review-item[open]')).toHaveCount(0);
  await expect(page.locator('.review-content')).toHaveCount(0);
  await expect(item(page, 'T1').locator('summary')).toContainText('Correct');
  await item(page, 'T1').locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(item(page, 'T1')).toHaveAttribute('open', '');
  await expect(item(page, 'T1').locator('.review-selections dd')).toHaveText(['C, A', 'A, C']);
  await page.keyboard.press('Enter');
  await expect(item(page, 'T1')).not.toHaveAttribute('open');
  await page.getByRole('button', { name: 'Incorrect (8)', exact: true }).click();
  await expect(page.locator('.review-item')).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Incorrect (8)', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.review-item summary')).not.toContainText(['Unanswered']);
  await item(page, 'T3').locator('summary').click();
  await expect(item(page, 'T3').locator('.review-selections dd')).toHaveText(['A', 'A, C']);
  await expect(item(page, 'T3')).not.toContainText(/Partially selected|Incomplete selection/i);
  await item(page, 'T4').locator('summary').click();
  const wrongSet = item(page, 'T4');
  await expect(wrongSet.locator('[data-option-id="A"]')).toContainText('Selected · correct');
  await expect(wrongSet.locator('[data-option-id="B"]')).toContainText('Selected · incorrect');
  await expect(wrongSet.locator('[data-option-id="C"]')).toContainText('Missed · correct');
  await expect(wrongSet.locator('.review-explanation')).toHaveText(attempt.snapshot.questions[3].explanationMarkdown);
  await expect(wrongSet).toContainText('The complete answer set is A, C. All 2 options are required for a point');
  await expect(wrongSet.locator('.review-option__text')).toHaveText(attempt.snapshot.questions[3].options.map(option => option.textMarkdown));
  await expect(wrongSet.locator('.review-option__explanation .markdown')).toHaveText(['Synthetic A', 'Synthetic B', 'Synthetic C']);
  await expect(wrongSet.locator('.sources')).toContainText('Synthetic fixture course — Exact synthetic section heading');
  await expect(wrongSet.locator('.sources a')).toHaveAttribute('href', 'https://example.test/course#section');
  await page.getByRole('button', { name: 'Unanswered (32)', exact: true }).click();
  await expect(page.locator('.review-item')).toHaveCount(32);
  await expect(page.locator('.review-outcome')).toHaveText(Array(32).fill('Unanswered'));
  await item(page, 'T6').locator('summary').click();
  await expect(item(page, 'T6').locator('.review-selections dd').first()).toHaveText('None — unanswered');
  await page.getByRole('button', { name: 'Flagged (4)', exact: true }).click();
  await expect(page.locator('.review-item')).toHaveCount(4);
  await expect(page.locator('.review-item summary strong')).toHaveText(['Question 1 · T1', 'Question 3 · T3', 'Question 6 · T6', 'Question 12 · T12']);
  await page.getByRole('button', { name: 'All (60)', exact: true }).click();
  await expect(page.locator('.review-item')).toHaveCount(60);
  await page.reload();
  await page.getByRole('button', { name: 'Open report' }).click();
  await expect(page.locator('.result-counts dd')).toHaveText(['20', '8', '32']);
  await expect(page.locator('.review-item[open]')).toHaveCount(0);
});

test('empty Flagged review explains the empty state', async ({ page }) => {
  await openSyntheticReport(page, false);
  await page.getByRole('button', { name: 'Flagged (0)', exact: true }).click();
  await expect(page.locator('.review-item')).toHaveCount(0);
  await expect(page.getByText('No questions match this filter.')).toBeVisible();
});

test('new validated data powers a fresh full flow while the original report stays frozen', async ({ page }) => {
  const old = syntheticResultsAttempt();
  const latest = structuredClone(old.snapshot);
  latest.version = 'fixture-2';
  latest.questions[1].correctOptionIds = ['B'];
  latest.questions[1].stemMarkdown = 'Synthetic updated T2 content. **Never publish.**';
  latest.domains[0].title = 'Updated synthetic D1';
  await installPausedClock(page, new Date('2026-10-12T14:00:00Z'));
  await page.route('**/question-bank.json', route => route.fulfill({ json: latest }));
  await openSyntheticReport(page);
  await expect(page.locator('[data-domain-id="D1"]')).toContainText('Synthetic D1');
  await item(page, 'T2').locator('summary').click();
  await expect(item(page, 'T2')).not.toContainText('updated T2 content');
  await page.getByRole('button', { name: 'Start new attempt', exact: true }).click();
  await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60' })).toBeFocused();
  await expect(page.getByText('Timed attempt · dataset fixture-2')).toBeVisible();
  await page.locator('input[value="C"]').check();
  await page.locator('input[value="A"]').check();
  await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.locator('input[value="B"]').check();
  await page.reload();
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('heading', { name: 'Question 2 of 60' })).toBeFocused();
  await expect(page.locator('input[value="B"]')).toBeChecked();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.clock.fastForward(120 * 60_000);
  await expect(page.getByRole('heading', { name: 'Your results' })).toBeFocused();
  await expect(page.locator('.result-counts dd')).toHaveText(['2', '0', '58']);
  await expect(page.locator('.result-metadata')).toContainText('02:00:00');
  await expect(page.locator('.result-metadata')).toContainText('Time expired — automatically submitted');
  await expect(page.locator('.result-metadata')).toContainText('fixture-2');
  const saved = await page.evaluate(() => {
    const ids = JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!);
    return ids.map((id: string) => JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!));
  });
  expect(saved).toHaveLength(2);
  expect(saved[0].snapshot).toEqual(latest);
  expect(saved[1]).toEqual(old);
  await page.getByRole('button', { name: 'Attempt history', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Open report' })).toHaveCount(2);
  await page.getByRole('button', { name: 'Open report' }).nth(1).click();
  await expect(page.locator('.result-number')).toHaveText('333 / 1000');
  await expect(page.locator('.result-metadata')).toContainText('fixture-1');
  await expect(page.locator('.review-item[open]')).toHaveCount(0);
});

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('real Results, source review and table keyboard access at ' + viewport.name, async ({ page, request }) => {
    await page.setViewportSize(viewport);
    const bank = await (await request.get('/question-bank.json')).json();
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await page.getByRole('button', { name: 'Start Advanced exam', exact: true }).click();
    await page.locator('input[value="' + bank.questions[0].correctOptionIds[0] + '"]').check();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: /^Question 8:/ }).click();
    // One reviewed correct choice remains an incomplete multiple response.
    await page.locator('input[value="' + bank.questions[7].correctOptionIds[0] + '"]').check();
    await page.getByRole('button', { name: 'Flag for review' }).click();
    await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Review & submit' }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm submission' }).click();
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
    await expect(page.locator('.result-counts dd')).toHaveText(['1', '1', '58']);
    await expect(page.locator('.review-item[open]')).toHaveCount(0);
    await page.screenshot({ path: 'screenshots/results-overview-' + viewport.name + '.png' });
    await page.locator('.domain-card').screenshot({ path: 'screenshots/results-domains-' + viewport.name + '.png' });
    await page.getByRole('button', { name: 'Flagged (1)', exact: true }).click();
    const review = item(page, 'Q8');
    await review.locator('summary').focus();
    await page.keyboard.press('Space');
    await expect(review).toHaveAttribute('open', '');
    await expect(review.locator('.review-outcome')).toHaveText('Incorrect');
    await expect(review).not.toContainText(/Partially selected|Incomplete selection/i);
    await expect(review.locator('.review-explanation')).toHaveText(bank.questions[7].explanationMarkdown);
    await expect(review.locator('.review-option')).toHaveCount(bank.questions[7].options.length);
    const table = review.getByRole('region', { name: 'Scrollable content table' }).first();
    await expect(table).toHaveAttribute('tabindex', '0');
    await table.focus();
    await page.keyboard.press('ArrowRight');
    const sizes = await table.evaluate(el => ({ width: el.clientWidth, content: el.scrollWidth }));
    if (viewport.width <= 390) expect(sizes.content).toBeGreaterThan(sizes.width);
    await review.locator('summary').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/results-question-' + viewport.name + '.png' });
    for (const source of bank.questions[7].sources) {
      await expect(review.locator('.sources')).toContainText(source.courseTitle);
      await expect(review.locator('.sources')).toContainText(source.sectionHeading);
      if (source.url) await expect(review.locator('.sources a[href="' + source.url + '"]')).toBeAttached();
    }
    await review.locator('.sources').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/results-sources-' + viewport.name + '.png' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const filterButtons = page.getByRole('group', { name: 'Filter question reviews' }).getByRole('button');
    for (const button of await filterButtons.all()) expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
}
