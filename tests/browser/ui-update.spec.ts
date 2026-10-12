import { test, expect, type Page } from '@playwright/test';
import type { QuestionBank } from '../../src/domain/bank';

async function storage(page: Page) {
  return page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
}

const viewports = [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
];

for (const viewport of viewports) {
  test('course drawer is accessible and leaves storage unchanged at ' + viewport.name, async ({ page, request }) => {
    await page.setViewportSize(viewport);
    const bank: QuestionBank = await (await request.get('/question-bank.json')).json();
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
    const before = await storage(page);
    const opener = page.getByRole('button', { name: 'Source courses', exact: true });
    await page.screenshot({ path: 'screenshots/updated-home-' + viewport.name + '.png', fullPage: true });
    await opener.click();
    const drawer = page.getByRole('dialog', { name: 'Courses used for this mock' });
    const heading = drawer.getByRole('heading');
    const close = drawer.getByRole('button', { name: 'Close dialog' });
    await expect(heading).toBeFocused();
    await expect(close).toBeInViewport();
    await expect(drawer.locator('.course-list a')).toHaveCount(10);
    const courses = [...new Map(bank.questions.flatMap(question => question.sources)
      .map(source => [JSON.stringify([source.courseTitle, source.url]), source] as const)).values()];
    for (const course of courses) {
      const link = drawer.getByRole('link', { name: course.courseTitle + ' (opens in a new tab)', exact: true });
      await expect(link).toHaveAttribute('href', course.url!);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(drawer).not.toContainText(/Correct selections|Your selections|Explanation|Question 1|Prompting and Task Execution/);
    for (const question of bank.questions) for (const source of question.sources) {
      // Section-level references must not enter the course list.
      expect(await drawer.locator('.course-list').innerText()).not.toContain(source.sectionHeading);
    }
    const box = (await drawer.boundingBox())!;
    expect(box.x + box.width).toBe(viewport.width);
    expect(box.y).toBe(0);
    expect(box.height).toBe(viewport.height);
    if (viewport.width <= 600) expect(box.width).toBe(viewport.width);
    expect(await drawer.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.screenshot({ path: 'screenshots/source-courses-' + viewport.name + '.png' });
    await page.keyboard.press('Shift+Tab');
    await expect(drawer.getByRole('link').last()).toBeFocused();
    await expect(drawer.getByRole('link').last()).toBeInViewport();
    await expect(close).toBeInViewport();
    await page.screenshot({ path: 'screenshots/source-courses-scrolled-' + viewport.name + '.png' });
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(drawer.getByRole('link').last()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
    await expect(opener).toBeFocused();
    expect(await storage(page)).toEqual(before);
    await opener.click();
    await close.click();
    await expect(opener).toBeFocused();
    if (viewport.width > 600) {
      await opener.click();
      await page.mouse.click(10, 10);
      await expect(drawer).not.toBeVisible();
      await expect(opener).toBeFocused();
    }
    expect(await storage(page)).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('source drawer handles pending and unavailable bank with retry', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/question-bank.json', async route => { await gate; await route.fulfill({ status: 503, body: 'Unavailable' }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Source courses' }).click();
  const drawer = page.getByRole('dialog', { name: 'Courses used for this mock' });
  await expect(drawer.getByRole('status')).toHaveText('Loading source courses…');
  release();
  await expect(drawer.getByRole('alert')).toContainText('Source courses are unavailable');
  await expect(drawer.getByRole('link')).toHaveCount(0);
  await page.unroute('**/question-bank.json');
  await drawer.getByRole('button', { name: 'Retry loading' }).click();
  await expect(drawer.getByRole('link')).toHaveCount(10);
  expect(await storage(page)).toEqual({});
});

test('insufficient multiple selections remain unanswered after refresh and grade incorrect on deliberate submission', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: /^Question 4:/ }).click();
  await page.getByRole('checkbox').first().check();
  await expect(page.locator('.answered-count strong')).toHaveText('0 / 60');
  const before = await storage(page);
  await page.reload();
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await expect(page.locator('.selection-counter')).toContainText('1 of 2 selected');
  expect(await storage(page)).toEqual(before);
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await expect(page.getByRole('button', { name: 'Question 4: unanswered, current question', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).not.toContainText(/Partially selected|Incomplete selection/i);
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('60 unanswered');
  await page.getByRole('button', { name: 'Confirm submission' }).click();
  await expect(page.locator('.result-counts dd')).toHaveText(['0', '1', '59']);
  await page.locator('.review-item').nth(3).locator('summary').click();
  await expect(page.locator('.review-item').nth(3).locator('.review-outcome')).toHaveText('Incorrect');
  await expect(page.locator('.review-item').nth(3).locator('.review-selections dd').first()).not.toHaveText('None — unanswered');
  await expect(page.locator('main')).not.toContainText(/Partially selected|Incomplete selection/i);
});

for (const [correct, score, status] of [[0, 0, 'Failed'], [43, 717, 'Failed'], [44, 733, 'Passed'], [60, 1000, 'Passed']] as const) {
  test('legacy history and frozen report agree for ' + correct + ' correct', async ({ page, request }) => {
    const bank: QuestionBank = await (await request.get('/question-bank.json')).json();
    const now = Date.now();
    const saved = {
      id: 'legacy-' + correct, startedAt: now - 60000, deadlineAt: now - 60000 + 120 * 60000,
      submittedAt: now, status: 'submitted', submissionReason: 'manual',
      currentQuestionId: bank.questions[0].id, flags: [], datasetVersion: bank.version, snapshot: bank,
      answers: Object.fromEntries(bank.questions.slice(0, correct).map((question: { id: string; correctOptionIds: string[] }) => [question.id, question.correctOptionIds])),
    };
    await page.addInitScript(attempt => {
      if (!localStorage.getItem('pcao-f:attempt-ids:v1')) {
        localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([attempt.id]));
        localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, JSON.stringify(attempt));
      }
    }, saved);
    const latest = structuredClone(bank);
    latest.version = 'later-bank';
    latest.questions[0].correctOptionIds = [latest.questions[0].options.find(option => !latest.questions[0].correctOptionIds.includes(option.id))!.id];
    await page.route('**/question-bank.json', route => route.fulfill({ json: latest }));
    await page.goto('/');
    const original = await storage(page);
    await expect(page.locator('.history-row')).toContainText('Practice score ' + score + ' / 1000');
    await expect(page.locator('.history-row .practice-status')).toHaveText(status);
    await page.getByRole('button', { name: 'Open report' }).click();
    await expect(page.locator('.result-number')).toHaveText(score + ' / 1000');
    await expect(page.locator('.secondary-result-number')).toHaveText(correct + ' / 60');
    await expect(page.locator('.practice-status')).toHaveText(status);
    await expect(page.getByText('Passing score: 720 / 1000.', { exact: true })).toBeVisible();
    expect(await storage(page)).toEqual(original);
    if (correct === 44) for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.evaluate(enlarged => { document.body.style.fontSize = enlarged ? '24px' : '16px'; }, viewport.name === 'enlarged');
      await page.screenshot({ path: 'screenshots/practice-passed-' + viewport.name + '.png' });
      await page.locator('.result-cards').screenshot({ path: 'screenshots/practice-score-cards-' + viewport.name + '.png' });
      await page.getByRole('button', { name: 'Attempt history', exact: true }).first().click();
      await expect(page.locator('.history-row .practice-status')).toHaveText('Passed');
      await page.locator('.history-list').screenshot({ path: 'screenshots/practice-history-' + viewport.name + '.png' });
      await expect(page.getByRole('button', { name: 'Open report' })).toBeInViewport();
      await page.getByRole('button', { name: 'Open report' }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.reload();
    await page.getByRole('button', { name: 'Open report' }).click();
    await expect(page.locator('.result-number')).toHaveText(score + ' / 1000');
    expect(await storage(page)).toEqual(original);
  });
}


test('touch source drawer preserves an unfinished attempt and original deadline', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await context.newPage();
  await page.goto(test.info().project.use.baseURL!);
  await page.getByRole('button', { name: 'Start exam', exact: true }).tap();
  await page.getByRole('radio').first().check();
  await page.getByRole('button', { name: 'Attempt history', exact: true }).tap();
  const before = await storage(page);
  await page.getByRole('button', { name: 'Source courses' }).tap();
  const drawer = page.getByRole('dialog', { name: 'Courses used for this mock' });
  await drawer.getByRole('link').last().scrollIntoViewIfNeeded();
  await expect(drawer.getByRole('link').last()).toBeInViewport();
  await drawer.getByRole('button', { name: 'Close dialog' }).tap();
  expect(await storage(page)).toEqual(before);
  await page.getByRole('button', { name: 'Resume attempt' }).tap();
  await expect(page.getByRole('radio').first()).toBeChecked();
  expect(await storage(page)).toEqual(before);
  await context.close();
});
