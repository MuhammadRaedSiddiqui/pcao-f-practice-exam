import { expect, type Page } from '@playwright/test';
export async function startPractice(page: Page, size: 5 | 10 = 5, set = 0) {
  await page.goto('/guided');
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  await page.getByLabel('Session length').selectOption(String(size));
  await page.getByLabel('Practice set', { exact: true }).selectOption(String(set));
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: `Question 1 of ${size}`, exact: true })).toBeInViewport();
  return page.url();
}
export async function saved(page: Page) {
  return page.evaluate(async () => {
    const id = location.pathname.split('/').at(-1)!;
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('pcao-f-guided', 1); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
    });
    const result = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction('sessions'); const request = tx.objectStore('sessions').get(id);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    }); db.close(); return result;
  });
}
export async function seedMock(page: Page, kind: 'live' | 'expired' | 'submitted' | 'corrupt', orphan = false) {
  return page.evaluate(async ({ kind, orphan }) => {
    const fixtureUrl = '/tests/fixtures/syntheticGuidance.ts'; const attemptUrl = '/src/domain/attemptModel.ts';
    const { guidedBank } = await import(fixtureUrl); const { createAttempt, submitAttempt } = await import(attemptUrl);
    let attempt = createAttempt(guidedBank(), Date.now() - (kind === 'expired' ? 7200001 : 1000), 'synthetic-protection');
    if (kind === 'submitted') attempt = submitAttempt(attempt, Date.now());
    const raw = kind === 'corrupt' ? '{synthetic-damaged' : JSON.stringify(attempt);
    localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, raw);
    localStorage.setItem('pcao-f:attempt-owner:v1:' + attempt.id, JSON.stringify({ userId: '99999999-9999-4999-8999-999999999999', state: 'eligible', createdAt: Date.now() }));
    if (!orphan) localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([attempt.id]));
    window.dispatchEvent(new StorageEvent('storage', { key: 'pcao-f:attempt:v1:' + attempt.id }));
    return raw;
  }, { kind, orphan });
}
