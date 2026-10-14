import { test, expect } from '@playwright/test';
import { createAttempt, submitAttempt } from '../../src/domain/attempt';

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('Intermediate saved report uses its app difficulty at ' + viewport.name, async ({ page, request }) => {
    await page.setViewportSize(viewport);
    const bank = await (await request.get('/easy-question-bank.json')).json();
    expect(bank.title).toBe('Independent PCAO-F Practice — Easy');
    const start = Date.UTC(2026, 9, 13, 16, 40);
    const attempt = submitAttempt(createAttempt(bank, start, 'bug-007', 'intermediate'), start + 60_000, 'manual');
    await page.addInitScript(saved => {
      localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    }, attempt);
    await page.goto('/');
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
    const opener = page.getByRole('button', { name: 'Open report', exact: true });
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
    await expect(page.locator('main .lead')).toHaveText('Independent PCAO-F Practice — Intermediate');
    await expect(page.locator('main .container > .eyebrow')).toHaveText('Intermediate · Practice report · dataset 1.0.0');
    await expect(page.locator('.result-number')).toHaveText('0 / 1000');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (viewport.name === '390' || viewport.name === '1366') {
      await page.screenshot({ path: 'screenshots/bug-007-report-title-' + viewport.name + '.png' });
    }
    expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()))).toBe(before);
  });
}
