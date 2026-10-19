import { test, expect, type Page } from '@playwright/test';
import { mockAccountServer } from '../fixtures/accountServer';
import { startPractice } from './helpers';
test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });
async function doubleText(page: Page) {
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll<HTMLElement>('body, body *')];
    for (const element of elements) element.style.removeProperty('font-size');
    const sizes = elements.map(element => ({ element, size: parseFloat(getComputedStyle(element).fontSize) }));
    for (const { element, size } of sizes) element.style.setProperty('font-size', `${size * 2}px`, 'important');
  });
}

test('direct invalid/missing addresses and Back/Forward preserve Mock root history', async ({ page }) => {
  await page.goto('/guided/session/invalid'); await expect(page.getByText('The session address is invalid.', { exact: true })).toBeVisible();
  const url = await startPractice(page);
  await page.getByRole('banner').getByRole('link', { name: 'Home', exact: true }).click();
  await page.goBack(); await expect(page).toHaveURL(url); await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  await page.goForward(); await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.locator('.guided-session')).toHaveCount(0);
  await page.goBack(); await expect(page.getByRole('dialog', { name: 'Leave exam?', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Stay in exam', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
});

for (const [label, width, height, textScale] of [
  ['320', 320, 740, 1], ['390', 390, 844, 1], ['768', 768, 1024, 1], ['1366', 1366, 900, 1],
  ['landscape', 844, 390, 1], ['200-text', 390, 844, 2],
] as const) test(`responsive ${label}: keyboard, targets, overflow and inspected screenshot`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height }); await page.goto('/guided');
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  if (textScale === 2) await doubleText(page);
  await page.screenshot({ path: testInfo.outputPath('guided-landing-' + label + '.png'), fullPage: true });
  await startPractice(page);
  if (textScale === 2) {
    const original = await page.locator('.guided-session .markdown p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize));
    // Root rem scaling alone does not enlarge this app's explicit body text.
    await doubleText(page);
    expect(await page.locator('.guided-session .markdown p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBe(original * 2);
  }
  await page.locator('.guided-options input').nth(0).focus(); await page.keyboard.press('Space');
  await expect(page.locator('.guided-options input').nth(0)).toBeChecked();
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const targets = await page.locator('.guided-session button').evaluateAll(elements => elements.map(e => e.getBoundingClientRect().height));
  expect(targets.every(height => height >= 44)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('guided-' + label + '.png'), fullPage: true });
  await page.locator('.guided-options input').nth(1).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  if (textScale === 2) await doubleText(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('guided-feedback-' + label + '.png'), fullPage: true });
});

test('a scrolled removal dialog retains title, Close and actions after narrow resizing', async ({ page }, testInfo) => {
  await startPractice(page); await page.getByRole('link', { name: 'Back to Guided Practice', exact: true }).click();
  await page.getByRole('button', { name: 'Remove practice session', exact: true }).click(); await page.setViewportSize({ width: 320, height: 640 });
  const dialog = page.getByRole('dialog', { name: 'Remove this practice session?', exact: true });
  await expect(dialog.getByRole('heading')).toBeVisible(); await expect(dialog.getByRole('button', { name: 'Close dialog', exact: true })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Remove this practice session', exact: true })).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('removal-dialog-320.png') });
  await doubleText(page);
  await expect(dialog.getByRole('button', { name: 'Close dialog', exact: true })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Remove this practice session', exact: true })).toBeInViewport();
  const dialogBox = await dialog.boundingBox(); expect(dialogBox).not.toBeNull();
  for (const button of [dialog.getByRole('heading'), dialog.getByRole('button', { name: 'Close dialog', exact: true }), dialog.getByRole('button', { name: 'Keep session', exact: true }), dialog.getByRole('button', { name: 'Remove this practice session', exact: true })]) {
    const box = await button.boundingBox(); expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(dialogBox!.y); expect(box!.y + box!.height).toBeLessThanOrEqual(Math.min(640, dialogBox!.y + dialogBox!.height));
    expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  }
  await page.screenshot({ path: testInfo.outputPath('removal-dialog-200-text.png') });
  await page.keyboard.press('Escape'); await expect(dialog).not.toBeVisible();
});

test.describe('touch input', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('native choices and staged hints work with touch', async ({ page }) => {
    await startPractice(page); const inputs = page.locator('.guided-options input');
    await inputs.nth(0).tap(); await expect(inputs.nth(0)).toBeChecked();
    await expect(inputs.nth(1)).toBeEnabled(); await inputs.nth(1).tap(); await expect(inputs.nth(1)).toBeChecked();
    await expect(page.getByRole('button', { name: 'Hint 1', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: 'Hint 1', exact: true }).tap();
    await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Check answer', exact: true }).tap();
    await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  });
});

test('keyboard focus survives saved choices and sequential hint requests', async ({ page }) => {
  await startPractice(page);
  const first = page.locator('.guided-options input').nth(0);
  await first.focus(); await page.keyboard.press('Space'); await expect(first).toBeEnabled(); await expect(first).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.locator('.guided-options input').nth(1)).toBeFocused();
  for (let hint = 1; hint <= 3; hint++) {
    const toggle = page.getByRole('button', { name: 'Hint ' + hint, exact: true });
    await expect(toggle).toBeEnabled(); await toggle.focus(); await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true'); await expect(toggle).toBeFocused();
    await page.keyboard.press('Space'); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter'); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
});

test('long synthetic Markdown table scrolls within the question at 320px', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 740 }); await page.goto('/guided');
  await expect(page.getByRole('button', { name: 'Start practice', exact: true })).toBeEnabled();
  await page.evaluate(async () => {
    const runtimeUrl = '/src/domain/guided/runtime.ts'; const fingerprintsUrl = '/src/domain/guided/fingerprints.ts';
    const { loadPracticeSource, runtimeCatalog } = await import(runtimeUrl); const { questionFingerprint, guidanceDigest } = await import(fingerprintsUrl);
    const loaded = await loadPracticeSource(new AbortController().signal); const { bank, release } = loaded.value;
    const question = bank.questions[0];
    question.stemMarkdown += '\n\n| Synthetic evidence | Constraint | Alternative |\n|---|---|---|\n| ' + 'SyntheticColumn'.repeat(20) + ' | Preserve the saved source | Compare requirements |';
    const guide = release.questions[0]; guide.sourceFingerprint = (await questionFingerprint(release.source, bank.domains[0], question)).value;
    runtimeCatalog[0].approvedEntries[question.id] = (await guidanceDigest(release.source, release.guideVersion, guide)).value;
  });
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  const table = page.getByRole('region', { name: 'Scrollable content table', exact: true });
  await expect(table).toBeVisible(); await table.focus(); await page.keyboard.press('ArrowRight');
  expect(await table.evaluate(e => e.scrollWidth > e.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('long-table-320.png'), fullPage: true });
});
