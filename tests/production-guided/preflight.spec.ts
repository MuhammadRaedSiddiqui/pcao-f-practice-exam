import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { startPractice, saved } from '../guided-browser/helpers';
import { validateQuestionBank } from '../../src/domain/bankValidation';
import { startSession, applyCommand } from '../../src/domain/guided/session';
import { immutableCache } from '../../build/guidedProductionRelease';
const read = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const valid = validateQuestionBank(read('public/easy-question-bank.json'));
if (!valid.ok) throw Error('bank');
const bank = valid.bank, catalog = read('guided-release/catalog.json');
test.beforeEach(async ({ context }) => {
  // Disposable contexts only. Never use the owner's browser profile or real remote services.
  await context.route('**/*', route => ['http://127.0.0.1:4263', 'http://127.0.0.1:4264', 'http://127.0.0.1:4265'].includes(new URL(route.request().url()).origin) ? route.continue() : route.abort());
});
for (const version of ['1.0.0', '1.1.0']) test(`immutable ${version} HTTP bytes/MIME/cache`, async ({ request }) => {
  const r = await request.get('/guided/intermediate-' + version + '.json');
  expect(r.status()).toBe(200); expect(r.headers()['content-type']).toBe('application/json; charset=utf-8');
  expect(r.headers()['cache-control']).toBe(immutableCache);
  expect(createHash('sha256').update(await r.body()).digest('hex')).toBe(createHash('sha256').update(fs.readFileSync('guided-release/intermediate-' + version + '.json')).digest('hex'));
});
test('unknown asset is a genuine uncached 404, not SPA markup', async ({ request }) => {
  const r = await request.get('/guided/intermediate-9.9.9.json'); expect(r.status()).toBe(404);
  expect(r.headers()['cache-control']).toBe('no-store'); expect(await r.text()).not.toContain('<html');
});
test('normal production package starts current exact guide and locks triple feedback', async ({ page }, info) => {
  await startPractice(page, 5, 5); const initial = await saved(page); expect(initial.guideVersion).toBe('1.1.0');
  expect(initial.items[0].question.id).toBe('Q26');
  for (const n of [1, 2, 3]) { await page.getByRole('button', { name: 'Hint ' + n, exact: true }).press('Enter'); await expect.poll(async () => (await saved(page)).responses.Q26.maxHintRevealed).toBe(n); }
  for (const id of initial.items[0].question.correctOptionIds) { const q = initial.items[0].question; await page.locator('.guided-options input').nth(q.options.findIndex((o: any) => o.id === id)).check(); await expect(page.locator('.guided-options input').first()).toBeEnabled(); }
  await page.getByRole('button', { name: 'Check answer', exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeFocused();
  const checked = await saved(page); await page.reload(); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  expect(await saved(page)).toEqual(checked); expect(checked.items).toEqual(initial.items);
  await page.screenshot({ path: info.outputPath('production-feedback.png'), fullPage: true });
});
for (const width of [320, 390, 768, 1366]) test(`production responsive/keyboard table ${width}`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 900 }); await startPractice(page, 5, 5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const table = page.getByRole('region', { name: 'Scrollable content table' }); await table.focus(); await page.keyboard.press('ArrowRight'); await expect(table).toBeFocused();
  const hint = page.getByRole('button', { name: 'Hint 1', exact: true }); await hint.press('Enter'); await expect(hint).toHaveAttribute('aria-expanded', 'true'); await expect(hint).toBeFocused();
  for (const el of await page.locator('.guided-hint-toggle,.guided-actions button').all()) expect((await el.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({ path: info.outputPath('table.png'), fullPage: true });
});
for (const version of ['1.0.0', '1.1.0']) test(`compatible reader/maps resume safe frozen ${version}`, async ({ page, context }) => {
  const result = await startSession({ kind: 'standalone', bank, difficulty: 'intermediate', selectionSize: 5, setIndex: 0, id: crypto.randomUUID(), now: Date.now() }, read('guided-release/intermediate-' + version + '.json'), catalog);
  if (!result.ok) throw Error(result.code); let session = result.value; const q = session.items[0].question;
  for (const cmd of [{ kind: 'select' as const, questionId: q.id, ids: q.correctOptionIds }, { kind: 'commit' as const, questionId: q.id, commandId: crypto.randomUUID() }]) {
    const r = applyCommand(session, cmd, session.revision, Date.now()); if (!r.ok) throw Error(r.code); session = r.value.session;
  }
  // This seed exists only in a newly created test context, never a private user profile.
  await page.goto('/guided'); await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  await page.evaluate(async s => { const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('pcao-f-guided', 1); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); await new Promise<void>((resolve, reject) => { const tx = db.transaction('sessions', 'readwrite'); tx.objectStore('sessions').put(s); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); db.close(); }, session);
  await context.route('**/guided/intermediate-' + version + '.json', r => r.fulfill({ status: 404 }));
  await page.goto('/guided/session/' + session.id); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); expect(await saved(page)).toEqual(session);
  await page.reload(); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); expect(await saved(page)).toEqual(session);
  // Same origin, same disposable browser storage; swap to exact packaged fallback bytes without copying storage.
  const rollback = '.localtest/guided-production/' + (process.env.GUIDED_PREFLIGHT_RUN === 'confirmed' ? 'rollback-confirmed' : 'rollback');
  await context.route('http://127.0.0.1:4263/assets/**', async route => { const file = new URL(route.request().url()).pathname; await route.fulfill({ path: rollback + file }); });
  await page.reload(); await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible(); expect(await saved(page)).toEqual(session);
});
test('ordinary disabled build has no entry, guidance exposure or runtime global override', async ({ page, request }) => {
  await page.goto('http://127.0.0.1:4264/'); await expect(page.getByRole('link', { name: 'Open Guided Practice', exact: true })).toHaveCount(0);
  await page.addInitScript(c => { (globalThis as any).__GUIDED_LOCAL_CATALOG__ = c; }, catalog);
  await page.goto('http://127.0.0.1:4264/guided'); await expect(page.getByRole('heading', { name: 'Guided Practice unavailable', exact: true })).toBeVisible();
  expect((await (await request.get('http://127.0.0.1:4264/guided/intermediate-1.1.0.json')).text()).includes('reasoningMarkdown')).toBe(false);
});
test('SPA trailing slash/reload and missing-session recovery', async ({ page }) => {
  await page.goto('/guided/'); await expect(page.getByRole('heading', { name: 'Guided Practice', exact: true })).toBeFocused();
  await page.goto('/guided/session/' + crypto.randomUUID() + '/'); await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Retry saved practice', exact: true }).press('Enter'); await expect(page.getByRole('alert')).toBeVisible();
  await page.reload(); await expect(page.getByRole('alert')).toBeVisible();
});
