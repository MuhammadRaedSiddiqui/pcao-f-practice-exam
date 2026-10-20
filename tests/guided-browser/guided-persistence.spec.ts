import { test, expect } from '@playwright/test';
import { mockAccountServer } from '../fixtures/accountServer';
import { saved, startPractice } from './helpers';
test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });

test('without BroadcastChannel, polling reloads committed revisions across two tabs', async ({ page, context }) => {
  await context.addInitScript(() => { Object.defineProperty(window, 'BroadcastChannel', { value: undefined }); });
  const url = await startPractice(page); const other = await context.newPage(); await other.goto(url);
  await expect(other.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  await page.locator('.guided-options input').nth(0).check(); await page.locator('.guided-options input').nth(1).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(other.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible({ timeout: 2500 });
  expect((await saved(other)).revision).toBe(3); await other.close();
});

test('a read invalidated by a concurrent save reloads fresh state without replaying a command', async ({ page, context }) => {
  const url = await startPractice(page); const prior = await saved(page);
  await page.locator('.guided-options input').nth(0).check(); await page.locator('.guided-options input').nth(1).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  const committed = await saved(page); const other = await context.newPage();
  await other.addInitScript(prior => {
    const original = IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get = function (key) {
      const request = original.call(this, key);
      if (this.name === 'sessions' && key === prior.id) {
        IDBObjectStore.prototype.get = original;
        // Deterministically model a prepared read that preceded the saved commitment.
        request.addEventListener('success', () => Object.defineProperty(request, 'result', { value: prior }), { once: true });
      }
      return request;
    };
  }, prior);
  await other.goto(url);
  await expect(other.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  await expect(other.getByRole('button', { name: 'Retry saved practice', exact: true })).toHaveCount(0);
  expect(await saved(other)).toEqual(committed); await other.close();
});

test('quota and aborted transactions cannot reveal a new hint; Retry restores the saved draft', async ({ page }) => {
  await startPractice(page); const before = await saved(page);
  for (const name of ['QuotaExceededError', 'AbortError']) {
    await page.evaluate(errorName => {
      const original = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function (..._args) { IDBObjectStore.prototype.put = original; throw new DOMException('Synthetic write fault', errorName); };
    }, name);
    await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
    await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0);
    expect(await saved(page)).toEqual(before);
    await page.getByRole('button', { name: 'Retry saved practice', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeVisible();
  }
});

test('a corrupted or newer saved session stays intact and unavailable on direct reload', async ({ page }) => {
  await startPractice(page);
  for (const schemaVersion of [2, 1]) {
    await page.evaluate(async schemaVersion => {
      const id = location.pathname.split('/').at(-1)!;
      const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('pcao-f-guided', 1); r.onsuccess = () => resolve(r.result); });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('sessions', 'readwrite'); const r = tx.objectStore('sessions').get(id);
        r.onsuccess = () => tx.objectStore('sessions').put({ ...r.result, schemaVersion, currentIndex: 999 });
        tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
      }); db.close();
    }, schemaVersion);
    const corrupt = await saved(page); await page.reload();
    await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
    await expect(page.locator('.guided-options')).toHaveCount(0); expect(await saved(page)).toEqual(corrupt);
  }
});

test('denied IndexedDB provides an explicit preserved-data Retry state', async ({ page }) => {
  await page.addInitScript(() => { indexedDB.open = () => { throw new DOMException('Synthetic denial', 'SecurityError'); }; });
  await page.goto('/guided');
  await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
  await expect(page.locator('.guided-options')).toHaveCount(0);
});

test('a failed answer commitment never exposes feedback; saved exact choices can be retried', async ({ page }) => {
  await startPractice(page); await page.locator('.guided-options input').nth(0).check(); await page.locator('.guided-options input').nth(1).check();
  await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled();
  await page.evaluate(() => { const put = IDBObjectStore.prototype.put; IDBObjectStore.prototype.put = function (..._args) { IDBObjectStore.prototype.put = put; throw new DOMException('Synthetic quota', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
  await expect(page.getByText('Synthetic postcommit reasoning', { exact: true })).toHaveCount(0);
  expect((await saved(page)).responses.T1.commitment).toBeNull();
  await page.getByRole('button', { name: 'Retry saved practice', exact: true }).click();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
});

test('two browser repositories reject an explicit stale revision without overwriting saved progress', async ({ page, context }) => {
  const url = await startPractice(page); const other = await context.newPage(); await other.goto(url);
  const execute = async (target: typeof page, index: number) => target.evaluate(async index => {
    const runtimeUrl = '/src/domain/guided/runtime.ts'; const storageUrl = '/src/domain/guided/storage.ts';
    const { runtimeCatalog } = await import(runtimeUrl); const { createGuidedRepository } = await import(storageUrl);
    const store = createGuidedRepository({ catalog: runtimeCatalog });
    try { return await store.execute(location.pathname.split('/').at(-1), 0, { kind: 'navigate', index }); } finally { store.close(); }
  }, index);
  expect((await execute(page, 1)).ok).toBe(true);
  expect(await execute(other, 2)).toEqual({ ok: false, code: 'conflict' });
  expect((await saved(page)).currentIndex).toBe(1); expect((await saved(page)).revision).toBe(1); await other.close();
});
