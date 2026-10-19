import { test, expect } from '@playwright/test';
test('default-off build or enabled empty catalog never exposes synthetic or unapproved guidance', async ({ page }, testInfo) => {
  const enabled = Boolean(testInfo.project.metadata.guidedEnabled);
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Open Guided Practice', exact: true })).toHaveCount(enabled ? 1 : 0);
  await page.goto('/guided');
  await expect(enabled ? page.getByText('No approved Guided Practice release is published.', { exact: false }) : page.getByRole('heading', { name: 'Guided Practice unavailable', exact: true })).toBeVisible();
  await expect(page.locator('.guided-options')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(/Synthetic ask prompt|Synthetic postcommit|unapproved-guide-sentinel/);
  if (enabled) await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeDisabled();
});

test('direct route and reload preserve unsupported records without rendering their payload', async ({ page }) => {
  await page.goto('/');
  const id = '11111111-1111-4111-8111-111111111111';
  const raw = { id, schemaVersion: 2, syntheticPayload: 'unapproved-guide-sentinel' };
  await page.evaluate(async row => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('pcao-f-guided', 1); req.onupgradeneeded = () => req.result.createObjectStore('sessions', { keyPath: 'id' }); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
    });
    await new Promise<void>(resolve => { const tx = db.transaction('sessions', 'readwrite'); tx.objectStore('sessions').put(row); tx.oncomplete = () => resolve(); }); db.close();
  }, raw);
  await page.goto('/guided/session/' + id); await page.reload();
  await expect(page.locator('.guided-options')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toContain(raw.syntheticPayload);
  const retained = await page.evaluate(async id => {
    const db = await new Promise<IDBDatabase>(resolve => { const req = indexedDB.open('pcao-f-guided', 1); req.onsuccess = () => resolve(req.result); });
    const value = await new Promise(resolve => { const req = db.transaction('sessions').objectStore('sessions').get(id); req.onsuccess = () => resolve(req.result); }); db.close(); return value;
  }, id);
  expect(retained).toEqual(raw);
});

test('source assets still match approved original bank bytes through the served artifact', async ({ request }) => {
  const { createHash } = await import('node:crypto');
  for (const [file, expected] of [['easy-question-bank.json', 'f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4'],
    ['question-bank.json', 'e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea']]) {
    const response = await request.get('/' + file); expect(response.ok()).toBe(true);
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(expected);
  }
});
