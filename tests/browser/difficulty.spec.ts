import { test, expect, type Page } from '@playwright/test';
import { createAttempt } from '../../src/domain/attempt';
import { syntheticBank } from '../fixtures/syntheticBank';
import { installPausedClock, reloadPage } from './navigation';

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
  test('difficulty toggle, comparison, keyboard and cancellation at ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    const before = await storage(page);
    const opener = page.getByRole('button', { name: 'Start exam', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Choose exam difficulty' });
    await expect(dialog.getByRole('heading', { name: 'Choose exam difficulty', exact: true })).toBeFocused();
    await expect(dialog.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    await page.screenshot({ path: 'screenshots/default-intermediate-' + viewport.name + '.png' });
    await dialog.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await expect(dialog.getByRole('radio', { name: 'Advanced', exact: true })).toBeChecked();
    await expect(dialog).toContainText('Compared with Intermediate');
    await expect(dialog.locator('.difficulty-points li')).toHaveText([
      'Longer scenarios with more details to track.',
      'More interacting constraints and tradeoffs.',
      'More detailed tables, records, and supporting evidence.',
    ]);
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    for (const input of await dialog.getByRole('radio').all()) {
      const target = (await input.boundingBox())!;
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: 'screenshots/difficulty-advanced-' + viewport.name + '.png' });
    if (viewport.name === 'landscape' || viewport.name === 'enlarged' || viewport.name === '320') {
      await dialog.locator('.dialog__body').evaluate(element => { element.scrollTop = element.scrollHeight; });
      await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeInViewport();
      await page.screenshot({ path: 'screenshots/difficulty-advanced-scrolled-' + viewport.name + '.png' });
      await dialog.locator('.dialog__body').evaluate(element => { element.scrollTop = 0; });
    }
    await dialog.getByRole('radio', { name: 'Advanced', exact: true }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(dialog.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await expect(dialog).toContainText('Compared with Advanced');
    await expect(dialog.locator('.difficulty-points li')).toHaveText([
      'Shorter, more focused scenarios.',
      'Fewer interacting constraints per decision.',
      'More compact tables and supporting evidence.',
    ]);
    await expect(dialog).not.toContainText('Coming soon');
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    await expect(dialog.locator('.difficulty-facts')).toContainText('60');
    await expect(dialog.locator('.difficulty-facts')).toContainText('120 minutes');
    expect(await storage(page)).toEqual(before);
    await page.screenshot({ path: 'screenshots/difficulty-intermediate-' + viewport.name + '.png' });
    if (viewport.name === 'landscape' || viewport.name === 'enlarged' || viewport.name === '320') {
      await dialog.locator('.dialog__body').evaluate(element => { element.scrollTop = element.scrollHeight; });
      await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeInViewport();
      await page.screenshot({ path: 'screenshots/difficulty-intermediate-scrolled-' + viewport.name + '.png' });
    }
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Close dialog', exact: true })).toBeFocused();
    const box = (await dialog.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    expect(await storage(page)).toEqual(before);
    await opener.click();
    await expect(dialog.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await dialog.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await opener.click();
    await expect(dialog.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(opener).toBeFocused();
  });
}

test('Advanced persists in Exam, Results and history; new starts from Results use the selector', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.locator('.exam-bar')).toContainText('Advanced');
  const active = await storage(page);
  const record = Object.values(active).find(value => value.includes('"snapshot"'))!;
  expect(JSON.parse(record).difficulty).toBe('advanced');
  await reloadPage(page);
  await expect(page.getByRole('heading', { name: /^Question \d+ of 60$/ })).toBeVisible();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await expect(page.locator('.result-metadata')).toContainText('DifficultyAdvanced');
  await page.getByRole('button', { name: 'Start new attempt', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Choose exam difficulty' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.locator('.history-row')).toContainText('Advanced');
});

test('replacement preparation preserves the attempt on back and starts the confirmed Intermediate bank', async ({ page, request }) => {
  const bank = await (await request.get('/easy-question-bank.json')).json();
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button', { name: 'Go to attempt history', exact: true }).click();
  const before = await storage(page);
  await page.getByRole('button', { name: 'Start another exam', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await expect(page.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
  expect(await storage(page)).toEqual(before);
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  const replacement = page.getByRole('dialog', { name: 'Start another exam?' });
  await expect(replacement).toContainText('Intermediate');
  await expect(replacement).toContainText('timer is still running');
  await page.screenshot({ path: 'screenshots/difficulty-replacement-1366.png' });
  await replacement.getByRole('button', { name: 'Keep unfinished attempt', exact: true }).click();
  const selector = page.getByRole('dialog', { name: 'Choose exam difficulty' });
  await expect(selector.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
  expect(await storage(page)).toEqual(before);
  await selector.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Start another exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Abandon and start Intermediate exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  const next = await storage(page);
  const id = JSON.parse(next['pcao-f:attempt-ids:v1'])[0];
  expect(JSON.parse(next['pcao-f:attempt:v1:' + id])).toMatchObject({ difficulty: 'intermediate', snapshot: bank });
  const previousId = JSON.parse(before['pcao-f:attempt-ids:v1'])[0];
  expect(next['pcao-f:attempt:v1:' + previousId]).toBeUndefined();
});

test('expiry closes difficulty selection and preserves the original report', async ({ page }) => {
  const instant = new Date('2026-10-13T10:00:00Z');
  await installPausedClock(page, instant);
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed';
  const saved = createAttempt(bank, instant.getTime() - 7200000 + 2000, 'difficulty-expiry-fixture', 'advanced');
  await page.addInitScript(attempt => {
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([attempt.id]));
    localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, JSON.stringify(attempt));
  }, saved);
  await page.goto('/');
  await page.getByRole('button', { name: 'Start another exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await page.clock.fastForward(3000);
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.result-metadata')).toContainText('Time expired');
  const stored = await storage(page);
  expect(Object.keys(stored)).toHaveLength(2);
  expect(JSON.parse(stored['pcao-f:attempt:v1:' + saved.id])).toMatchObject({ difficulty: 'advanced', snapshot: saved.snapshot, status: 'submitted' });
});

test('shared source courses match the validated bank without changing difficulty or storage', async ({ page, request }) => {
  const bank = await (await request.get('/question-bank.json')).json();
  const courses = [...new Map<string, { courseTitle: string; url: string }>(bank.questions
    .flatMap((question: { sources: { courseTitle: string; url: string }[] }) => question.sources)
    .map((source: { courseTitle: string; url: string }) => [JSON.stringify([source.courseTitle, source.url]), source] as const)).values()];
  await page.goto('/');
  await page.getByRole('button', { name: 'Source courses', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Courses used for this mock' });
  await expect(drawer.getByRole('heading', { name: 'Courses used for this mock', exact: true })).toBeVisible();
  await expect(drawer.getByRole('radio')).toHaveCount(0);
  await expect(drawer).toContainText('These courses are used for both Intermediate and Advanced practice.');
  await expect(drawer.getByRole('link')).toHaveCount(courses.length);
  for (const source of courses) {
    await expect(drawer.getByRole('link', { name: source.courseTitle + ' (opens in a new tab)', exact: true })).toHaveAttribute('href', source.url);
  }
  await expect(drawer.getByRole('link')).toHaveCount(courses.length);
  expect(await storage(page)).toEqual({});
});

test('legacy attempts resume and report as Original exam without adopting a new difficulty', async ({ page }) => {
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed';
  const original = createAttempt(bank, Date.now(), 'legacy-difficulty-fixture');
  await page.addInitScript(saved => {
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
  }, original);
  await page.goto('/');
  await expect(page.locator('.history-row')).toContainText('Original exam');
  await page.getByRole('button', { name: 'Resume attempt', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.locator('.exam-bar')).toContainText('Original exam');
  await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await expect(page.locator('.result-metadata')).toContainText('DifficultyOriginal exam');
  const saved = JSON.parse((await storage(page))['pcao-f:attempt:v1:' + original.id]);
  expect(saved.difficulty).toBeUndefined();
  expect(saved.snapshot).toEqual(original.snapshot);
});

test('touch selection can start Intermediate', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL!);
    await page.getByRole('button', { name: 'Start exam', exact: true }).tap();
    await expect(page.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await expect(page.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).tap();
    await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
    await expect(page.locator('.exam-bar')).toContainText('Intermediate');
  } finally { await context.close(); }
});

for (const width of [320, 1366]) {
  test('real Intermediate bank grades, resumes and stays frozen beside Advanced at ' + width, async ({ page, request }) => {
    await page.setViewportSize({ width, height: width === 320 ? 700 : 768 });
    const bank = await (await request.get('/easy-question-bank.json')).json();
    const advanced = await (await request.get('/question-bank.json')).json();
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    await expect(page.getByRole('radio', { name: 'Intermediate', exact: true })).toBeChecked();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeFocused();
    await expect(page.locator('.exam-bar')).toContainText('Intermediate');
    await expect(page.locator('.exam-bar')).toContainText('Independent PCAO-F Practice — Intermediate');
    for (const id of bank.questions[0].correctOptionIds) await page.locator(`input[value="${id}"]`).check();
    const multiIndex = bank.questions.findIndex((question: { selectionCount: number }) => question.selectionCount > 1);
    await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
    await page.getByRole('button', { name: new RegExp('^Question ' + (multiIndex + 1) + ':') }).click();
    await expect(page.getByRole('heading', { name: `Question ${multiIndex + 1} of 60`, exact: true })).toBeFocused();
    for (const id of bank.questions[multiIndex].correctOptionIds) await page.locator(`input[value="${id}"]`).check();
    await expect.poll(async () => {
      const data = await storage(page);
      const id = JSON.parse(data['pcao-f:attempt-ids:v1'])[0];
      return JSON.parse(data['pcao-f:attempt:v1:' + id]).answers[bank.questions[multiIndex].id];
    }).toEqual(bank.questions[multiIndex].correctOptionIds);
    await page.screenshot({ path: 'screenshots/intermediate-exam-' + width + '.png' });
    const savedBeforeReload = await storage(page);
    const id = JSON.parse(savedBeforeReload['pcao-f:attempt-ids:v1'])[0];
    const key = 'pcao-f:attempt:v1:' + id;
    expect(JSON.parse(savedBeforeReload[key])).toMatchObject({ difficulty: 'intermediate', datasetVersion: '1.0.0', snapshot: bank });
    await reloadPage(page);
    await expect(page.getByRole('heading', { name: `Question ${multiIndex + 1} of 60`, exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: `Question ${multiIndex + 1} of 60`, exact: true })).toBeFocused();
    expect((await storage(page))[key]).toEqual(savedBeforeReload[key]);
    await page.getByRole('button', { name: 'Review & submit', exact: true }).click();
    await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
    await expect(page.locator('.result-number')).toHaveText('33 / 1000');
    await expect(page.locator('.secondary-result-number')).toHaveText('2 / 60');
    await expect(page.locator('.result-metadata')).toContainText('DifficultyIntermediate');
    await expect(page.locator('.result-metadata')).toContainText('Dataset version1.0.0');
    await page.screenshot({ path: 'screenshots/intermediate-results-' + width + '.png' });
    await page.locator('.review-item').first().locator('summary').click();
    await expect(page.locator('.review-item').first()).toContainText('Sources');
    await page.screenshot({ path: 'screenshots/intermediate-question-review-' + width + '.png' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const report = (await storage(page))[key];
    await page.route('**/easy-question-bank.json', route => route.fulfill({ json: {
      ...bank, version: 'later-intermediate-test', questions: bank.questions.map((question: object, index: number) =>
        index === 0 ? { ...question, stemMarkdown: 'Updated Intermediate content for testing only.' } : question),
    } }));
    await reloadPage(page);
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
    await expect(page.locator('.history-row')).toContainText('Intermediate');
    await page.getByRole('button', { name: 'Open report', exact: true }).click();
    await expect(page.locator('.result-metadata')).toContainText('Dataset version1.0.0');
    await page.locator('.review-item').first().locator('summary').click();
    await expect(page.locator('.review-item').first()).not.toContainText('Updated Intermediate content for testing only.');
    expect((await storage(page))[key]).toEqual(report);
    await page.getByRole('button', { name: 'Start new attempt', exact: true }).click();
    await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
    const saved = await storage(page);
    const activeId = JSON.parse(saved['pcao-f:attempt-ids:v1'])[0];
    expect(JSON.parse(saved['pcao-f:attempt:v1:' + activeId])).toMatchObject({ difficulty: 'advanced', snapshot: advanced });
    expect(saved[key]).toEqual(report);
  });
}

for (const invalid of [false, true]) {
  test('Intermediate loading and ' + (invalid ? 'invalid content' : 'missing data') + ' allow Advanced and retry safely', async ({ page, request }) => {
    const bank = await (await request.get('/easy-question-bank.json')).json();
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/easy-question-bank.json', async route => {
      await gate;
      await route.fulfill(invalid ? { json: { ...bank, contentStatus: 'pending' } } : { status: 404 });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start exam', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Choose exam difficulty' });
    await dialog.getByRole('radio', { name: 'Intermediate', exact: true }).check();
    await expect(dialog.getByRole('status')).toContainText('Loading the Intermediate');
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeDisabled();
    release();
    await expect(dialog.getByRole('alert')).toContainText('Intermediate question bank is unavailable or incomplete');
    expect(await storage(page)).toEqual({});
    await dialog.getByRole('radio', { name: 'Advanced', exact: true }).check();
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    await dialog.getByRole('radio', { name: 'Intermediate', exact: true }).check();
    await page.unroute('**/easy-question-bank.json');
    await dialog.getByRole('button', { name: 'Retry loading', exact: true }).click();
    await expect(dialog.getByRole('button', { name: 'Start Exam', exact: true })).toBeEnabled();
    await dialog.getByRole('button', { name: 'Start Exam', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
    const saved = await storage(page);
    const id = JSON.parse(saved['pcao-f:attempt-ids:v1'])[0];
    expect(JSON.parse(saved['pcao-f:attempt:v1:' + id]).snapshot).toEqual(bank);
  });
}

test('a missing Advanced bank does not block starting Intermediate', async ({ page }) => {
  await page.route('**/question-bank.json', route => route.fulfill({ status: 503 }));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start exam', exact: true })).toBeEnabled();
  await expect(page.getByRole('alert')).toContainText('Advanced question bank is unavailable');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await expect(page.getByRole('button', { name: 'Start Exam', exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.locator('.exam-bar')).toContainText('Intermediate');
});

test('a late Intermediate response cannot change an Advanced start during rapid toggling', async ({ page, request }) => {
  const intermediate = await (await request.get('/easy-question-bank.json')).json();
  const advanced = await (await request.get('/question-bank.json')).json();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/easy-question-bank.json', async route => { await gate; await route.fulfill({ json: intermediate }); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await expect(page.getByRole('button', { name: 'Start Exam', exact: true })).toBeDisabled();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('radio', { name: 'Intermediate', exact: true }).check();
  await page.getByRole('radio', { name: 'Advanced', exact: true }).check();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  release();
  const saved = await storage(page);
  const id = JSON.parse(saved['pcao-f:attempt-ids:v1'])[0];
  expect(JSON.parse(saved['pcao-f:attempt:v1:' + id])).toMatchObject({ difficulty: 'advanced', snapshot: advanced });
  await expect(page.locator('.exam-bar')).toContainText('Advanced');
});
