import { test, expect } from '@playwright/test';
import { mockAccountServer, userA } from '../fixtures/accountServer';
import { startPractice, saved, seedMock } from './helpers';
test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });

for (const orphan of [false, true]) test(`live ${orphan ? 'orphaned' : 'indexed'} private Mock suspends hints without private details or writes`, async ({ page, context }, testInfo) => {
  const url = await startPractice(page);
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  const other = await context.newPage(); await other.goto('/');
  const start = Date.now(); const raw = await seedMock(other, 'live', orphan);
  await expect(page.getByText('An unfinished Mock Exam is active on this browser.', { exact: false })).toBeVisible({ timeout: 2500 });
  const elapsed = Date.now() - start;
  expect(elapsed).toBeLessThan(2500);
  await testInfo.attach('suspension-timing.json', { body: JSON.stringify({ orphan, elapsedMs: elapsed, visiblePollIntervalMs: 1000 }), contentType: 'application/json' });
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0);
  await expect(page.locator('.guided-options')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(/99999999|synthetic-protection|Synthetic test question/);
  expect(await other.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:synthetic-protection'))).toBe(raw);
  await page.goto(url); await expect(page.locator('.guided-options')).toHaveCount(0);
  await other.close();
});

test('corrupt Mock fails closed with bounded actionable Retry, preserving original bytes', async ({ page }) => {
  await page.goto('/'); const raw = await seedMock(page, 'corrupt', true);
  await page.goto('/guided');
  await expect(page.getByText(/Recovery reason: corrupt-record/)).toBeVisible();
  await page.getByRole('button', { name: 'Retry protection check', exact: true }).click();
  await expect(page.getByText(/Recovery reason: corrupt-record/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:synthetic-protection'))).toBe(raw);
  await expect(page.locator('.guided-options')).toHaveCount(0);
});

test('verified expired orphan allows standalone without finalizing Mock; malformed index is a warning', async ({ page }) => {
  await page.goto('/guided');
  const raw = await seedMock(page, 'expired', true);
  await page.evaluate(() => { localStorage.setItem('pcao-f:attempt-ids:v1', '{synthetic-malformed'); });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  await expect(page.getByText(/complete record scan passed/)).toBeVisible();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:synthetic-protection'))).toBe(raw);
  expect(await page.evaluate(() => localStorage.getItem('pcao-f:attempt-ids:v1'))).toBe('{synthetic-malformed');
});

test('no Web Locks fails closed with no instructional subtree', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'locks', { value: undefined }); });
  await page.goto('/guided');
  await expect(page.getByText(/browser cannot safely coordinate practice/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toHaveCount(0);
});

test('denied Mock storage fails closed with an explicit Retry', async ({ page }) => {
  await page.addInitScript(() => { const get = Storage.prototype.getItem; Storage.prototype.getItem = function (key) {
    if (key.startsWith('pcao-f:attempt')) throw new DOMException('Synthetic denial', 'SecurityError'); return get.call(this, key);
  }; });
  await page.goto('/guided'); await expect(page.getByText(/Recovery reason: storage-unavailable/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry protection check', exact: true })).toBeVisible();
  await expect(page.locator('.guided-options')).toHaveCount(0);
});

test('backgrounding unmounts instructional content and return requires a new protection check', async ({ page }) => {
  await startPractice(page); await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0);
  await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
});

test('revoked saved guidance remains inaccessible with explicit withdrawal handling after D12', async ({ page }) => {
  await startPractice(page); const before = await saved(page);
  await page.evaluate(async () => {
    const runtimeUrl = '/src/domain/guided/runtime.ts'; const { runtimeCatalog } = await import(runtimeUrl);
    runtimeCatalog[0].revokedDigests.push(runtimeCatalog[0].approvedEntries.T1);
    window.dispatchEvent(new StorageEvent('storage', { key: null }));
  });
  await expect(page.getByText('This saved practice contains unavailable guidance. Its records are preserved; withdrawn content cannot be shown.', { exact: true })).toBeVisible();
  await expect(page.locator('.guided-options')).toHaveCount(0); expect(await saved(page)).toEqual(before);
});

test('a queued lock times out then explicit Retry can recover without a late reveal', async ({ page, context }) => {
  await startPractice(page); const other = await context.newPage(); await other.goto('/');
  await page.bringToFront(); await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeEnabled();
  await other.evaluate(() => { void navigator.locks.request('pcao-f:attempt-storage:v1', () => new Promise<void>(resolve => { (window as any).releaseGuidedTestLock = resolve; })); });
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText(/checking-timeout/)).toBeVisible({ timeout: 7000 });
  await other.evaluate(() => { (window as any).releaseGuidedTestLock(); });
  await page.getByRole('button', { name: 'Retry protection check', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeVisible();
  expect((await saved(page)).responses.T1.maxHintRevealed).toBe(0); await other.close();
});

for (const action of ['hint', 'commit'] as const) test(`a Mock start winning the shared lock blocks the queued ${action} without saving a reveal`, async ({ page, context }) => {
  await startPractice(page);
  if (action === 'commit') {
    await page.locator('.guided-options input').nth(0).check(); await page.locator('.guided-options input').nth(2).check();
    await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled();
  }
  const before = await saved(page); const other = await context.newPage(); await other.goto('/');
  await page.bringToFront(); await expect(page.getByRole('button', { name: action === 'hint' ? 'Hint 1' : 'Check answer', exact: true })).toBeEnabled();
  await other.evaluate(async () => {
    const fixtureUrl = '/tests/fixtures/syntheticGuidance.ts'; const attemptUrl = '/src/domain/attemptModel.ts';
    const { guidedBank } = await import(fixtureUrl); const { createAttempt } = await import(attemptUrl);
    const attempt = createAttempt(guidedBank(), Date.now(), 'synthetic-lock-race');
    void navigator.locks.request('pcao-f:attempt-storage:v1', async () => {
      await new Promise<void>(resolve => { (window as any).releaseGuidedRace = resolve; });
      localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, JSON.stringify(attempt));
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([attempt.id]));
    });
  });
  await expect.poll(async () => other.evaluate(() => typeof (window as any).releaseGuidedRace)).toBe('function');
  await page.getByRole('button', { name: action === 'hint' ? 'Hint 1' : 'Check answer', exact: true }).click();
  await other.evaluate(() => { (window as any).releaseGuidedRace(); });
  await expect(page.getByText('An unfinished Mock Exam is active on this browser.', { exact: false })).toBeVisible();
  expect(await saved(page)).toEqual(before); await expect(page.getByText('Synthetic postcommit reasoning', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0); await other.close();
});

test('changing Guided routes invalidates a queued hint before it can persist', async ({ page, context }) => {
  const url = await startPractice(page); const before = await saved(page);
  const other = await context.newPage(); await other.goto('/');
  await page.bringToFront(); await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeEnabled();
  await other.evaluate(() => { void navigator.locks.request('pcao-f:attempt-storage:v1', () => new Promise<void>(resolve => { (window as any).releaseRouteTestLock = resolve; })); });
  await expect.poll(async () => other.evaluate(() => typeof (window as any).releaseRouteTestLock)).toBe('function');
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await expect(page).toHaveURL(/\/guided$/);
  await other.evaluate(() => { (window as any).releaseRouteTestLock(); });
  await page.goBack(); await expect(page).toHaveURL(url); await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  expect(await saved(page)).toEqual(before); await other.close();
});

for (const loss of ['source deletion', 'sign-out'] as const) test(`confirmed private ${loss} clears instructional memory and derived storage`, async ({ page, context }) => {
  await page.goto('/guided');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Sign in', exact: true });
  await dialog.getByLabel('Email', { exact: true }).fill('alice@example.test');
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
  const id = await page.evaluate(async ownerId => {
    const fixtureUrl = '/tests/fixtures/syntheticGuidance.ts'; const attemptUrl = '/src/domain/attemptModel.ts'; const sessionUrl = '/src/domain/guided/session.ts';
    const { syntheticGuidance, unwrap } = await import(fixtureUrl); const { createAttempt, submitAttempt } = await import(attemptUrl); const { startSession } = await import(sessionUrl);
    const f = await syntheticGuidance(); const report = submitAttempt(createAttempt(f.bank, Date.now() - 2000, 'private-guided-source'), Date.now() - 1000);
    localStorage.setItem('pcao-f:attempt:v1:' + report.id, JSON.stringify(report));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([report.id]));
    localStorage.setItem('pcao-f:attempt-owner:v1:' + report.id, JSON.stringify({ userId: ownerId, state: 'eligible', createdAt: Date.now() }));
    const s = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'account', ownerId }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('pcao-f-guided', 1); r.onsuccess = () => resolve(r.result); });
    await new Promise<void>((resolve, reject) => { const tx = db.transaction('sessions', 'readwrite'); tx.objectStore('sessions').put(s); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); db.close(); return s.id;
  }, userA);
  await page.goto('/guided/session/' + id);
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click(); await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  // Simulate a confirmed deletion marker from the existing account boundary in another tab.
  const other = await context.newPage(); await other.goto('/');
  await other.evaluate(({ ownerId, loss }) => {
    if (loss === 'source deletion') localStorage.setItem('pcao-f:attempt-owner:v1:private-guided-source', JSON.stringify({ userId: ownerId, state: 'deleted', createdAt: Date.now() }));
    else localStorage.setItem('pcao-f:account-signout:v1', crypto.randomUUID());
  }, { ownerId: userA, loss });
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
  await expect.poll(async () => await saved(page)).toBeUndefined();
  await other.close();
});
