import { test, expect, type Page } from '@playwright/test';
import { mockAccountServer } from '../fixtures/accountServer';
import { startPractice, saved } from './helpers';

// Deterministic test-only barrier: keep router notification/history synchronous,
// but hold React's scheduled work until the shared lock has drained.
async function installOrderingBarrier(page: Page) {
  await page.addInitScript(() => {
    const w = window as any;
    const events: { stage: string; route: string; revision?: number; hint?: number }[] = [];
    const record = (stage: string, extra = {}) => events.push({ stage, route: location.pathname.includes('/session/') ? 'session' : 'other', ...extra });
    const pending: (() => void)[] = [];
    w.commandOrder = { events, held: false, messages: 0, completedLocks: 0, repositoryRequests: 0,
      release() { this.held = false; pending.splice(0).forEach(run => run()); } };
    const NativeChannel = MessageChannel;
    const descriptor = Object.getOwnPropertyDescriptor(MessagePort.prototype, 'onmessage')!;
    const Channel = function () {
      const channel = new NativeChannel();
      Object.defineProperty(channel.port1, 'onmessage', { configurable: true,
        set(handler) { descriptor.set!.call(channel.port1, function (this: MessagePort, event: MessageEvent) {
          if (w.commandOrder.held) { w.commandOrder.messages++; pending.push(() => handler.call(this, event)); }
          else handler.call(this, event);
        }); }, get() { return descriptor.get!.call(channel.port1); } });
      return channel;
    };
    Channel.prototype = NativeChannel.prototype;
    Object.setPrototypeOf(Channel, NativeChannel);
    w.MessageChannel = Channel;
    const request = navigator.locks.request.bind(navigator.locks);
    (navigator.locks as any).request = (name: string, ...args: any[]) => {
      if (name !== 'pcao-f:attempt-storage:v1') return (request as any)(name, ...args);
      const callback = args.pop(); record('lock-request');
      // Classify locally, without recording stacks. A background Mock-gate poll
      // must not satisfy the barrier for the repository command under test.
      if (new Error().stack?.includes('/guided/storage.ts')) w.commandOrder.repositoryRequests++;
      return (request as any)(name, ...args, async (lock: Lock) => {
        record('lock-enter');
        try { return await callback(lock); }
        finally { record('lock-complete'); w.commandOrder.completedLocks++; }
      });
    };
    const push = history.pushState.bind(history);
    history.pushState = (...args) => { push(...args); record('history-push'); };
    addEventListener('popstate', () => record('history-pop'));
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (value, ...args) {
      if (this.transaction.db.name === 'pcao-f-guided' && this.name === 'sessions') record('guided-put', { revision: value.revision, hint: value.responses.T1?.maxHintRevealed });
      return put.call(this, value, ...args);
    };
  });
}

async function recordAt(page: Page, id: string) {
  return page.evaluate(async id => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('pcao-f-guided', 1); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
    });
    const raw = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction('sessions'); const r = tx.objectStore('sessions').get(id);
      r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
    }); db.close(); return raw;
  }, id);
}

test.beforeEach(async ({ context, page }) => { await mockAccountServer().attach(context); await installOrderingBarrier(page); });

for (const command of ['hint', 'commit'] as const) for (const navigation of ['push', 'back-forward', 'unmount'] as const)
test(`queued ${command}: ${navigation} cancels before storage despite deferred React cleanup`, async ({ page, context }, info) => {
  const url = await startPractice(page), id = url.split('/').at(-1)!;
  await page.evaluate(async () => {
    const intentUrl = '/src/domain/guided/navigationIntent.ts';
    const { subscribeGuidedNavigation } = await import(intentUrl);
    subscribeGuidedNavigation(() => (window as any).commandOrder.events.push({ stage: 'intent-invalidate', route: location.pathname.includes('/session/') ? 'session' : 'other' }));
  });
  if (command === 'commit') {
    await page.locator('.guided-options input').nth(0).check(); await expect(page.locator('.guided-options input').nth(1)).toBeEnabled();
    await page.locator('.guided-options input').nth(1).check();
    await expect(page.getByRole('button', { name: 'Check answer', exact: true })).toBeEnabled();
  }
  const before = await saved(page);
  let evidence: unknown[] = [];
  const other = await context.newPage(); await other.goto('/'); await page.bringToFront();
  const action = page.getByRole('button', { name: command === 'hint' ? 'Hint 1' : 'Check answer', exact: true }); await expect(action).toBeEnabled();
  await other.evaluate(() => { void navigator.locks.request('pcao-f:attempt-storage:v1', () => new Promise<void>(resolve => { (window as any).releaseOrderLock = resolve; })); });
  await expect.poll(() => other.evaluate(() => typeof (window as any).releaseOrderLock)).toBe('function');
  try {
    const repositoryRequests = await page.evaluate(() => (window as any).commandOrder.repositoryRequests);
    await action.click();
    await expect.poll(() => page.evaluate(() => (window as any).commandOrder.repositoryRequests)).toBeGreaterThan(repositoryRequests);
    await expect.poll(() => page.evaluate(async () => (await navigator.locks.query()).pending?.length ?? 0)).toBeGreaterThan(0);
    await page.evaluate(held => { const o = (window as any).commandOrder; o.events.length = 0; o.events.push({ stage: 'command-queued', route: 'session' }); o.held = held; }, navigation !== 'unmount');
    if (navigation === 'back-forward') {
      await page.goBack(); await expect(page).toHaveURL(/\/guided$/);
      await page.goForward(); await expect(page).toHaveURL(url);
    } else if (navigation === 'push') {
      await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a[href="/guided"]')!.click());
      await expect(page).toHaveURL(/\/guided$/);
    } else {
      await page.getByRole('banner').getByRole('link', { name: 'Home', exact: true }).click();
      await expect(page.locator('.guided-session')).toHaveCount(0);
    }
    if (navigation === 'push') {
      await expect.poll(() => page.evaluate(() => (window as any).commandOrder.messages)).toBeGreaterThan(0);
      // Router state/history changed; React still renders the original session.
      await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
    }
    const invalidations = await page.evaluate(() => (window as any).commandOrder.events.filter((e: any) => e.stage === 'intent-invalidate').length);
    expect(invalidations).toBe(navigation === 'back-forward' ? 2 : 1);
    const completed = await page.evaluate(() => (window as any).commandOrder.completedLocks);
    await other.evaluate(() => (window as any).releaseOrderLock());
    await expect.poll(() => page.evaluate(() => (window as any).commandOrder.completedLocks)).toBeGreaterThan(completed);
    await other.evaluate(() => navigator.locks.request('pcao-f:attempt-storage:v1', () => null));
    expect(await recordAt(page, id)).toEqual(before);
    evidence = await page.evaluate(() => (window as any).commandOrder.events);
    expect(evidence.filter((e: any) => e.stage === 'guided-put')).toHaveLength(0);
    await page.evaluate(() => (window as any).commandOrder.release());
    if (navigation !== 'back-forward') await page.goBack();
    await expect(page).toHaveURL(url);
    await page.reload(); await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
    expect(await saved(page)).toEqual(before);
  } finally {
    await other.evaluate(() => (window as any).releaseOrderLock?.());
    await page.evaluate(() => (window as any).commandOrder.release());
    await info.attach('command-order', { contentType: 'application/json', body: JSON.stringify(evidence.length ? evidence : await page.evaluate(() => (window as any).commandOrder.events)) });
    await other.close();
  }
});

for (const command of ['hint', 'commit'] as const)
test(`durable ${command} before navigation remains exact after Back, Forward and reload`, async ({ page }) => {
  const url = await startPractice(page);
  if (command === 'commit') {
    await page.locator('.guided-options input').nth(0).check(); await expect(page.locator('.guided-options input').nth(1)).toBeEnabled();
    await page.locator('.guided-options input').nth(1).check();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  } else {
    await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
    await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  }
  const durable = await saved(page);
  expect(command === 'hint' ? durable.responses.T1.maxHintRevealed : durable.responses.T1.commitment).toBeTruthy();
  await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await expect(page).toHaveURL(/\/guided$/); await page.goBack(); await expect(page).toHaveURL(url);
  await page.goForward(); await expect(page).toHaveURL(/\/guided$/); await page.goBack();
  await page.reload(); await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  expect(await saved(page)).toEqual(durable);
});

test('a canceled tab preserves an independent tab’s legitimate revision without replaying its hint', async ({ page, context }) => {
  const url = await startPractice(page), id = url.split('/').at(-1)!;
  const before = await saved(page), other = await context.newPage(); await other.goto('/');
  await other.evaluate(async () => {
    const storageUrl = '/src/domain/guided/storage.ts', runtimeUrl = '/src/domain/guided/runtime.ts';
    const { createGuidedRepository } = await import(storageUrl), { runtimeCatalog } = await import(runtimeUrl);
    (window as any).otherGuidedStore = createGuidedRepository({ catalog: runtimeCatalog });
  });
  await page.bringToFront(); await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeEnabled();
  await other.evaluate(() => { void navigator.locks.request('pcao-f:attempt-storage:v1', () => new Promise<void>(resolve => { (window as any).releaseOrderLock = resolve; })); });
  await expect.poll(() => other.evaluate(() => typeof (window as any).releaseOrderLock)).toBe('function');
  try {
    const repositoryRequests = await page.evaluate(() => (window as any).commandOrder.repositoryRequests);
    await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).commandOrder.repositoryRequests)).toBeGreaterThan(repositoryRequests);
    await expect.poll(() => page.evaluate(async () => (await navigator.locks.query()).pending?.length ?? 0)).toBeGreaterThan(0);
    await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click(); await expect(page).toHaveURL(/\/guided$/);
    await other.evaluate(({ id, revision }) => { void (window as any).otherGuidedStore.execute(id, revision, { kind: 'revealNextHint', questionId: 'T2' }).then((r: unknown) => { (window as any).otherGuidedResult = r; }); }, { id, revision: before.revision });
    await other.evaluate(() => (window as any).releaseOrderLock());
    await expect.poll(() => other.evaluate(() => (window as any).otherGuidedResult?.ok)).toBe(true);
    const legitimate = await other.evaluate(() => (window as any).otherGuidedResult.value);
    expect(legitimate.revision).toBe(before.revision + 1);
    expect(legitimate.responses.T1).toEqual(before.responses.T1);
    const expected = structuredClone(before); expected.responses.T2.maxHintRevealed = 1; expected.revision++; expected.updatedAt = legitimate.updatedAt;
    expect(legitimate).toEqual(expected); expect(await recordAt(page, id)).toEqual(legitimate);
    await page.goBack(); await page.reload(); await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
    expect(await saved(page)).toEqual(legitimate);
  } finally { await other.evaluate(() => { (window as any).releaseOrderLock?.(); (window as any).otherGuidedStore.close(); }); await other.close(); }
});
