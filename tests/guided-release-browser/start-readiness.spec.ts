import { test, expect } from '@playwright/test';
test('keyboard start waits for reviewed-bank readiness, preserving all original controls', async ({ page }, info) => {
  let release!: () => void;
  const waiting = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/(?:easy-)?question-bank\.json$/, async route => { await waiting; await route.continue(); });
  await page.goto('/');
  const start = page.getByRole('button', { name: 'Start exam', exact: true });
  await expect(start).toBeDisabled();
  await start.focus(); await page.keyboard.press('Enter');
  const disabledFocus = await start.evaluate(e => ({ disabled: (e as HTMLButtonElement).disabled, focused: document.activeElement === e }));
  await expect(page.getByRole('dialog')).not.toBeVisible();
  release(); await expect(start).toBeEnabled(); await start.focus(); await expect(start).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByRole('radio', { name: 'Advanced', exact: true })).toBeVisible();
  await info.attach('start-readiness.json', { contentType: 'application/json', body: JSON.stringify({ disabledFocus, openedAfterReady: true }) });
});
