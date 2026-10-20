// Existing release assertions, unchanged except dedicated QA ports.
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { saved, startPractice } from '../guided-browser/helpers';
import { validateQuestionBank } from '../../src/domain/bankValidation';
import { createAttempt, submitAttempt } from '../../src/domain/attemptModel';
import { startSession, applyCommand } from '../../src/domain/guided/session';
import type { GuidedResult } from '../../src/domain/guided/errors';
const take = <T>(r: GuidedResult<T>): T => { if (!r.ok) throw Error(r.code); return r.value; };
const read = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const valid = validateQuestionBank(read('public/easy-question-bank.json'));
if (!valid.ok) throw Error('bank');
const bank = valid.bank, catalog = read('guided-release/catalog.json');
const release = read('guided-release/intermediate-1.1.0.json');
async function seedSession(page: Page, session: unknown) {
  await page.goto('/guided');
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  await page.evaluate(async s => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('pcao-f-guided', 1); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    await new Promise<void>((resolve, reject) => { const tx = db.transaction('sessions', 'readwrite'); tx.objectStore('sessions').put(s); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); db.close();
  }, session);
}
test.beforeEach(async ({ context }) => { await context.route('**/*', r => new URL(r.request().url()).origin === 'http://127.0.0.1:4408' ? r.continue() : r.abort()); });
for (const [size, set] of [[5, 0], [10, 2], [10, 5]] as const) test(`${size} item set ${set}: durable complete journey including triples`, async ({ page }) => {
  await page.goto('/'); await page.getByRole('link', { name: 'Open Guided Practice', exact: true }).click();
  await startPractice(page, size, set); const initial = await saved(page); expect(initial.guideVersion).toBe('1.1.0');
  await page.reload(); await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeVisible();
  for (let index = 0; index < size; index++) {
    const q = initial.items[index].question;
    await expect(page.locator('.guided-feedback')).toHaveCount(0);
    if (index === 0) {
      for (let n = 1; n <= 3; n++) { await page.getByRole('button', { name: `Hint ${n}`, exact: true }).click(); await expect.poll(async () => (await saved(page)).responses[q.id].maxHintRevealed).toBe(n); }
      await page.reload(); await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeEnabled();
      expect((await saved(page)).responses[q.id].maxHintRevealed).toBe(3);
    }
    const inputs = page.locator('.guided-options input');
    for (const id of q.correctOptionIds) { const input = inputs.nth(q.options.findIndex((o: { id: string }) => o.id === id)); await input.check(); await expect(input).toBeEnabled(); }
    if (index === 0) await page.evaluate(async () => { const w = window as any; w.held = false; w.hold = navigator.locks.request('pcao-f:attempt-storage:v1', () => new Promise<void>(resolve => { w.release = resolve; w.held = true; })); while (!w.held) await new Promise(r => setTimeout(r, 0)); });
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    if (index === 0) { await expect(page.getByText('Saving progress…', { exact: true })).toBeVisible(); await expect(page.locator('.guided-feedback')).toHaveCount(0); expect((await saved(page)).responses[q.id].commitment).toBeNull(); await page.evaluate(async () => { const w = window as any; w.release(); await w.hold; }); }
    await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); await expect(page.locator('.guided-comparison')).toHaveCount(q.options.length);
    if (index === 0) { await page.reload(); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); }
    if (index < size - 1) await page.getByRole('button', { name: 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Finish practice', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeInViewport();
  const completed = await saved(page); await page.reload(); await expect(page.getByRole('heading', { name: 'Practice completed', exact: true })).toBeVisible(); expect(await saved(page)).toEqual(completed); expect(completed.items).toEqual(initial.items);
});
test('exact assets and 12/6 partitions; normal build excludes test seams', async ({ page, request }) => {
  for (const version of ['1.0.0', '1.1.0']) { const bytes = await (await request.get(`/guided/intermediate-${version}.json`)).body(); expect(createHash('sha256').update(bytes).digest('hex')).toBe(createHash('sha256').update(fs.readFileSync(`guided-release/intermediate-${version}.json`)).digest('hex')); }
  await page.goto('/guided'); await expect(page.getByLabel('Practice set', { exact: true }).locator('option')).toHaveCount(12); await page.getByLabel('Session length').selectOption('10'); await expect(page.getByLabel('Practice set', { exact: true }).locator('option')).toHaveCount(6);
  expect((await (await request.get('/tests/phase7-integration/browser-fixtures.ts')).text()).includes('export async function')).toBe(false);
});
test('retained 1.0.0 frozen feedback survives missing historical asset and reopening', async ({ page, context }) => {
  const old = read('guided-release/intermediate-1.0.0.json'), now = Date.now();
  let s = take(await startSession({ kind: 'standalone', bank, difficulty: 'intermediate', selectionSize: 5, setIndex: 0, id: crypto.randomUUID(), now }, old, catalog)); const q = s.items[0].question;
  s = take(applyCommand(s, { kind: 'select', questionId: q.id, ids: q.correctOptionIds }, s.revision, now)).session;
  s = take(applyCommand(s, { kind: 'commit', questionId: q.id, commandId: crypto.randomUUID() }, s.revision, now)).session;
  await seedSession(page, s); await context.route('**/guided/intermediate-1.0.0.json', r => r.fulfill({ status: 404 }));
  await page.goto('/guided/session/' + s.id); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); expect(await saved(page)).toEqual(s);
  const reopened = await context.newPage(); await page.close(); await reopened.goto('/guided/session/' + s.id); await expect(reopened.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); expect(await saved(reopened)).toEqual(s);
});
test('cross-tab hints, navigation away, refresh and incomplete resume preserve data', async ({ page, context }) => {
  const url = await startPractice(page, 5, 4), second = await context.newPage(); await second.goto(url);
  await expect(second.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible(); await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect.poll(async () => (await saved(second)).responses.Q21.maxHintRevealed).toBe(1); await second.reload();
  await second.getByRole('link', { name: 'Home', exact: true }).click(); await second.getByRole('link', { name: 'Open Guided Practice', exact: true }).click();
  await second.getByRole('link', { name: 'Resume practice', exact: true }).click(); await expect(second.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible(); expect((await saved(second)).responses.Q21.maxHintRevealed).toBe(1);
});
for (const invalid of ['missing', 'corrupt', 'tampered']) test(`${invalid} release fails closed`, async ({ page }) => {
  const bad = structuredClone(release); bad.questions[0].hints[0] += ' changed';
  await page.route('**/guided/intermediate-1.1.0.json', r => r.fulfill({ status: invalid === 'missing' ? 404 : 200, contentType: 'application/json', body: invalid === 'corrupt' ? '{broken' : JSON.stringify(bad) }));
  await page.goto('/guided'); await expect(page.getByRole('button', { name: 'Retry guidance', exact: true })).toBeVisible(); await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeDisabled();
});
test('Results All/incorrect/flagged cohorts preserve original report and PDF export', async ({ page }) => {
  const now = Date.now(), attempt = createAttempt(bank, now - 1000, 'normal-controlled-report'); attempt.answers.Q1 = bank.questions[0].correctOptionIds; attempt.flags = ['Q4', 'Q26']; const report = submitAttempt(attempt, now);
  await page.goto('/'); await page.evaluate(r => { localStorage.setItem('pcao-f:attempt:v1:' + r.id, JSON.stringify(r)); localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([r.id])); }, report); await page.reload();
  await page.getByRole('button', { name: 'Open report', exact: true }).click(); await page.getByRole('button', { name: 'Guided Review', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Guided Review', exact: true });
  for (const [filter, count] of [['incorrect-unanswered', 59], ['flagged', 2], ['all', 60]] as const) { await dialog.getByLabel('Questions to retry').selectOption(filter); await expect(dialog.getByRole('status')).toHaveText(`${count} eligible · ${count} matched · 0 unavailable`); }
  await dialog.getByRole('button', { name: 'Start guided retry', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  expect(await page.evaluate(id => JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!), report.id)).toEqual(report); expect((await saved(page)).items).toHaveLength(60);
});
test('failed persistence never exposes feedback or changes the first commitment', async ({ page }) => {
  await startPractice(page); await page.locator('.guided-options input').first().check();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled(); const before = await saved(page);
  await page.evaluate(() => { IDBObjectStore.prototype.put = function () { throw new DOMException('Controlled quota failure', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Check answer', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('storage is full');
  await expect(page.locator('.guided-feedback')).toHaveCount(0); expect(await saved(page)).toEqual(before);
  await page.reload(); await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled(); expect(await saved(page)).toEqual(before);
});
test('corrupt Guided data and missing session are unavailable without deletion', async ({ page }) => {
  const id = crypto.randomUUID(), damaged = { id, schemaVersion: 999, content: 'controlled damaged record' }; await seedSession(page, damaged);
  await page.goto('/guided/session/' + id); await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible(); expect(await saved(page)).toEqual(damaged);
  await page.goto('/guided/session/' + crypto.randomUUID()); await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
});
for (const kind of ['live', 'corrupt'] as const) test(`${kind} Mock blocks guidance without mutating Mock records`, async ({ page }) => {
  await page.goto('/guided'); const attempt = createAttempt(bank, Date.now(), 'normal-gate-test'), raw = kind === 'live' ? JSON.stringify(attempt) : '{broken';
  await page.evaluate(({ raw, id }) => { localStorage.setItem('pcao-f:attempt:v1:' + id, raw); localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([id])); }, { raw, id: attempt.id });
  await page.reload(); await expect(page.getByRole('heading', { name: 'Guided Practice paused', exact: true })).toBeVisible(); await expect(page.locator('.guided-hints')).toHaveCount(0); expect(await page.evaluate(id => localStorage.getItem('pcao-f:attempt:v1:' + id), attempt.id)).toBe(raw);
});
test('fenced technical artifact keeps its original structure', async ({ page }, info) => {
  await startPractice(page, 10, 4); for (let n = 0; n < 6; n++) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 7 of 10', exact: true })).toBeVisible();
  await expect(page.locator('.guided-session pre')).toHaveCount(1); const original = bank.questions.find(q => q.id === 'Q47')!.stemMarkdown;
  expect(await page.locator('.guided-session pre code').textContent()).toBe(original.match(/```[^\n]*\n([\s\S]*?)```/)![1]);
  await page.screenshot({ path: info.outputPath('artifact-q47.png'), fullPage: true });
});
for (const [width, height, enlarged] of [[320, 900, false], [390, 900, false], [768, 1024, false], [1366, 900, false], [844, 390, false], [320, 900, true]] as const) test(`table/keyboard/touch targets ${width}x${height} enlarged=${enlarged}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height }); await startPractice(page, 10, 5); await page.getByRole('button', { name: 'Next', exact: true }).click();
  if (enlarged) await page.addStyleTag({ content: 'html {font-size:200% !important}' });
  await expect(page.locator('.guided-session table')).toHaveCount(1); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const region = page.getByRole('region', { name: 'Scrollable content table', exact: true }); await region.focus(); await page.keyboard.press('End');
  const hint = page.getByRole('button', { name: 'Hint 1', exact: true }); await hint.focus(); await page.keyboard.press('Enter'); await expect(hint).toHaveAttribute('aria-expanded', 'true');
  await expect(hint).toBeFocused();
  const cdp = await page.context().newCDPSession(page), ax = await cdp.send('Accessibility.getFullAXTree');
  expect(ax.nodes.some(n => n.role?.value === 'button' && n.name?.value === 'Hint 1')).toBe(true); await cdp.detach();
  for (const element of await page.locator('.guided-hint-toggle,.guided-actions button').all()) { const box = await element.boundingBox(); expect(box?.height).toBeGreaterThanOrEqual(44); }
  await page.screenshot({ path: info.outputPath('question.png'), fullPage: true });
});
