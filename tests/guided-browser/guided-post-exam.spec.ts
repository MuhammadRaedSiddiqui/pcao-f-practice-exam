import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { postExamReport } from '../fixtures/postExamReport';
import { mockAccountServer, cloudRow, userA, authFixture } from '../fixtures/accountServer';
import { saved } from './helpers';

const review = (page: Page) => page.getByRole('dialog', { name: 'Guided Review', exact: true });
async function seedReport(page: Page, report = postExamReport()) {
  await page.addInitScript(report => {
    if (!localStorage.getItem('pcao-f:attempt:v1:' + report.id)) {
      localStorage.setItem('pcao-f:attempt:v1:' + report.id, JSON.stringify(report));
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([report.id]));
    }
  }, report);
  return report;
}
async function openReport(page: Page, report = postExamReport()) {
  await seedReport(page, report);
  await page.goto('/'); await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused(); return report;
}
async function openReview(page: Page) {
  await page.getByRole('button', { name: 'Guided Review', exact: true }).click();
  await expect(review(page).getByLabel('Questions to retry')).toHaveValue('incorrect-unanswered');
  return review(page);
}
async function sourceIntegrity(page: Page, id: string) {
  return page.evaluate(async id => {
    const hashModule = '/src/domain/cloudReports.ts'; const pdfModule = '/src/domain/reportExport.ts';
    const { reportHash } = await import(hashModule); const { buildResultReport } = await import(pdfModule);
    const raw = localStorage.getItem('pcao-f:attempt:v1:' + id)!; const report = JSON.parse(raw);
    return { raw, hash: await reportHash(report), pdf: buildResultReport(report),
      mock: Object.entries(localStorage).filter(([key]) => key.startsWith('pcao-f:attempt')).sort() };
  }, id);
}
async function signIn(page: Page) {
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const d = page.getByRole('dialog', { name: 'Sign in', exact: true });
  await d.getByLabel('Email', { exact: true }).fill('alice@example.test');
  await d.getByLabel('Password', { exact: true }).fill('synthetic-password');
  await d.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
}
async function pdfContent(page: Page) {
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export report (PDF)', exact: true }).click();
  const download = await pending; expect(await download.failure()).toBeNull();
  const bytes = new Uint8Array(await readFile((await download.path())!));
  const task = getDocument({ data: bytes, useSystemFonts: false }); const pdf = await task.promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent(); pages.push(content.items.map(item => 'str' in item ? item.str : '').join(' '));
  }
  await task.destroy(); return { filename: download.suggestedFilename(), pages };
}
test.describe('Phase 5', () => {
  test.beforeEach(async ({ context }) => { await mockAccountServer().attach(context); });
  test('independent cohorts/counts preserve ordinary filters and start empty', async ({ page }) => {
    const report = await openReport(page); const before = await sourceIntegrity(page, report.id);
    await page.getByRole('button', { name: 'Incorrect (3)', exact: true }).click();
    const d = await openReview(page); await expect(d.getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
    await d.getByLabel('Questions to retry').selectOption('flagged'); await expect(d.getByRole('status')).toHaveText('3 eligible · 4 matched · 1 unavailable');
    await d.getByLabel('Questions to retry').selectOption('all'); await expect(d.getByRole('status')).toHaveText('10 eligible · 60 matched · 50 unavailable');
    await page.keyboard.press('Escape'); await expect(d).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Guided Review', exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Incorrect (3)', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await openReview(page); await expect(d.getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
    await d.getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    const s = await saved(page); expect(s.items.map((i: any) => i.question.id)).toEqual(['T1', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10']);
    expect(Object.values(s.responses).every((r: any) => !r.selectedOptionIds.length && !r.commitment && r.maxHintRevealed === 0)).toBe(true);
    await expect(page.getByText('Answers may already have been seen.', { exact: false })).toBeVisible();
    expect(await sourceIntegrity(page, report.id)).toEqual(before);
  });
  test('launch, complete, reload and return preserve report hash, score, flags, timestamps and actual PDF text', async ({ page }, info) => {
    const report = await openReport(page); const before = await sourceIntegrity(page, report.id);
    const pdfBefore = await pdfContent(page); await openReview(page);
    await review(page).getByLabel('Questions to retry').selectOption('flagged');
    await expect(review(page).getByRole('status')).toHaveText('3 eligible · 4 matched · 1 unavailable');
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    for (let i = 0; i < 3; i++) {
      await expect(page.getByRole('heading', { name: `Question ${i + 1} of 3`, exact: true })).toBeVisible();
      await page.locator('.guided-options input').first().check(); await page.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
      if (i < 2) await page.getByRole('button', { name: 'Next', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Finish practice', exact: true }).click();
    expect((await saved(page)).status).toBe('completed'); await page.reload();
    await expect(page.getByRole('button', { name: 'Return to original results', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Return to original results', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
    const after = await sourceIntegrity(page, report.id); expect(after).toEqual(before);
    const pdfAfter = await pdfContent(page); expect(pdfAfter).toEqual(pdfBefore);
    await info.attach('original-report-integrity.json', { body: JSON.stringify({ before, after, pdfTextEqual: true, pdfPageCount: pdfAfter.pages.length }), contentType: 'application/json' });
  });
  for (const kind of ['correct', 'zero', 'legacy', 'unsupported', 'stale'] as const) test(`${kind} frozen report availability`, async ({ page }, info) => {
    const report = await openReport(page, postExamReport(kind)); const before = await sourceIntegrity(page, report.id);
    const d = await openReview(page);
    if (kind === 'correct') {
      await expect(d.getByRole('status')).toHaveText('0 eligible · 0 matched · 0 unavailable');
      await expect(d.getByRole('button', { name: 'Start guided retry', exact: true })).toBeDisabled();
      await d.getByLabel('Questions to retry').selectOption('all'); await expect(d.getByRole('status')).toHaveText('10 eligible · 60 matched · 50 unavailable');
    } else if (kind === 'zero') {
      await d.getByLabel('Questions to retry').selectOption('flagged'); await expect(d.getByRole('status')).toHaveText('0 eligible · 1 matched · 1 unavailable');
      await expect(d.getByRole('button', { name: 'Start guided retry', exact: true })).toBeDisabled();
    } else if (kind === 'unsupported') {
      await expect(d.getByRole('alert')).toContainText('no compatible approved guidance');
      await expect(d.getByRole('button', { name: 'Start guided retry', exact: true })).toBeDisabled();
    } else if (kind === 'stale') {
      await expect(d.getByRole('status')).toHaveText('8 eligible · 59 matched · 51 unavailable');
      await expect(d).toContainText('fingerprint-mismatch');
    } else await expect(d.getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
    await page.screenshot({ path: info.outputPath('availability-' + kind + '.png') });
    await d.getByRole('button', { name: 'Return to ordinary review', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
    expect(await sourceIntegrity(page, report.id)).toEqual(before);
  });
  test('changing the latest runtime bank cannot replace frozen report questions', async ({ page }) => {
    await page.route('**/*question-bank.json', async route => {
      const changed = structuredClone(postExamReport().snapshot); changed.questions[0].stemMarkdown = 'Newest bank replacement must never appear';
      await route.fulfill({ json: changed });
    });
    await openReport(page); await openReview(page); await expect(review(page).getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    await expect(page.locator('.guided-session')).not.toContainText('Newest bank replacement');
    expect((await saved(page)).items[0].question.stemMarkdown).toContain('Synthetic test question 1');
  });
  for (const loss of ['deleted', 'private', 'changed', 'active-mock'] as const) test(`fresh ${loss} protection blocks a stale Results launch`, async ({ page }, info) => {
    const report = await openReport(page); const d = await openReview(page);
    await expect(d.getByRole('button', { name: 'Start guided retry', exact: true })).toBeEnabled();
    await page.evaluate(async ({ id, loss, owner }) => {
      if (loss === 'deleted' || loss === 'private') localStorage.setItem('pcao-f:attempt-owner:v1:' + id, JSON.stringify({ userId: owner, state: loss === 'deleted' ? 'deleted' : 'eligible', createdAt: Date.now() }));
      else if (loss === 'changed') { const r = JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!); r.flags = []; localStorage.setItem('pcao-f:attempt:v1:' + id, JSON.stringify(r)); }
      else { const module = '/src/domain/attemptModel.ts'; const { createAttempt } = await import(module); const r = JSON.parse(localStorage.getItem('pcao-f:attempt:v1:' + id)!); localStorage.setItem('pcao-f:attempt:v1:other-live', JSON.stringify(createAttempt(r.snapshot, Date.now(), 'other-live'))); }
    }, { id: report.id, loss, owner: userA });
    // Same-document mutation emits no storage event. The periodic access check
    // may already disable Start before input arrives. Native click() respects
    // that disabled state; otherwise the launch must perform its fresh check.
    // Both paths must disclose rejection and leave the Guided store empty.
    await d.getByRole('button', { name: 'Start guided retry', exact: true }).evaluate(button => (button as HTMLButtonElement).click());
    await expect(d.getByRole('alert')).toBeVisible(); await expect(page.locator('.guided-options')).toHaveCount(0);
    await page.screenshot({ path: info.outputPath('protected-' + loss + '.png') });
    expect(await page.evaluate(async () => {
      const r = indexedDB.open('pcao-f-guided', 1); const db = await new Promise<IDBDatabase>(resolve => { r.onsuccess = () => resolve(r.result); });
      const tx = db.transaction('sessions'); const count = await new Promise<number>(resolve => { const c = tx.objectStore('sessions').count(); c.onsuccess = () => resolve(c.result); }); db.close(); return count;
    })).toBe(0);
  });
  for (const mode of ['download', 'trusted-offline'] as const) test(`account ${mode} launch, reload, return and sign-out respect existing authorization`, async ({ page, context }) => {
    const server = mockAccountServer(); await server.attach(context); const report = postExamReport('legacy'); server.rows.push(await cloudRow(userA, report));
    await page.goto('/'); await signIn(page);
    if (mode === 'trusted-offline') {
      await page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true }).click();
      await page.getByLabel('Keep opened account reports on this trusted device for offline access').check();
      await page.getByRole('link', { name: 'Attempt history', exact: true }).first().click();
    }
    await page.getByRole('button', { name: 'Open account report', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
    const originalRows = JSON.stringify(server.rows);
    if (mode === 'trusted-offline') await context.setOffline(true);
    await openReview(page); await expect(review(page).getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible(); const url = page.url();
    // A loaded shell supports offline work; full offline shell installation is
    // outside the existing app contract. Reload after reconnecting the shell.
    if (mode === 'trusted-offline') await context.setOffline(false);
    await page.reload(); await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    if (mode === 'trusted-offline') await context.setOffline(true);
    await page.getByRole('button', { name: 'Return to original results', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeFocused();
    expect(JSON.stringify(server.rows)).toBe(originalRows); expect(server.requests.filter(p => /backup-report|delete-report/.test(p))).toEqual([]);
    expect(await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('pcao-f:attempt:v1:')))).toEqual([]);
    await context.setOffline(false); await page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true }).click();
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.goto(url); await expect(page.locator('.guided-options')).toHaveCount(0); await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
  });
  test('pending recovery survives Results to Guided and return with reopen/reload', async ({ page }) => {
    await seedReport(page);
    const session = authFixture('alice@example.test', userA);
    const parts = session.access_token.split('.');
    const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    session.access_token = parts[0] + '.' + Buffer.from(JSON.stringify({ ...claims, session_id: crypto.randomUUID() })).toString('base64url') + '.synthetic';
    const fragment = new URLSearchParams({ access_token: session.access_token, refresh_token: session.refresh_token, token_type: 'bearer', expires_in: '3600', type: 'recovery' });
    await page.goto('/#' + fragment);
    const recovery = page.getByRole('dialog', { name: 'Choose a new password', exact: true });
    await expect(recovery).toBeVisible(); await recovery.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('button', { name: 'Open report', exact: true }).click(); await openReview(page);
    await expect(review(page).getByRole('button', { name: 'Start guided retry', exact: true })).toBeEnabled();
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Return to original results', exact: true }).click();
    await page.getByRole('button', { name: 'Finish password reset', exact: true }).click(); await expect(recovery).toBeVisible();
    await page.reload(); await expect(recovery).toBeVisible();
  });
  test('an owned local report uses its existing marker and rejects a different account', async ({ page }) => {
    const report = await openReport(page); await signIn(page);
    await page.evaluate(({ id, ownerId }) => localStorage.setItem('pcao-f:attempt-owner:v1:' + id,
      JSON.stringify({ userId: ownerId, state: 'eligible', createdAt: Date.now() })), { id: report.id, ownerId: userA });
    await openReview(page); await expect(review(page).getByRole('button', { name: 'Start guided retry', exact: true })).toBeEnabled();
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    expect((await saved(page)).origin.access).toEqual({ kind: 'account', ownerId: userA });
    await page.evaluate(id => localStorage.setItem('pcao-f:attempt-owner:v1:' + id,
      JSON.stringify({ userId: '00000000-0000-4000-8000-000000000002', state: 'eligible', createdAt: Date.now() })), report.id);
    await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
    await expect(page.locator('.guided-options')).toHaveCount(0);
  });
  test('a cloud tombstone discovered on revalidation hides the derived session without writing cloud data', async ({ page, context }) => {
    const server = mockAccountServer(); await server.attach(context); server.rows.push(await cloudRow(userA, postExamReport()));
    await page.goto('/'); await signIn(page); await page.getByRole('button', { name: 'Open account report', exact: true }).click();
    await openReview(page); await expect(review(page).getByRole('button', { name: 'Start guided retry', exact: true })).toBeEnabled();
    await review(page).getByRole('button', { name: 'Start guided retry', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
    server.rows[0].deleted_at = new Date().toISOString(); server.rows[0].payload = null;
    const tombstone = JSON.stringify(server.rows);
    await expect(page.getByRole('button', { name: 'Retry saved practice', exact: true })).toBeVisible();
    await expect(page.locator('.guided-options')).toHaveCount(0);
    expect(await saved(page)).toBeUndefined();
    expect(JSON.stringify(server.rows)).toBe(tombstone); expect(server.requests.filter(p => /backup-report|delete-report/.test(p))).toEqual([]);
  });
  test('a stalled account source read reaches a bounded Retry state and leaves ordinary Results usable', async ({ page, context }) => {
    const server = mockAccountServer(); await server.attach(context); server.rows.push(await cloudRow(userA, postExamReport()));
    await page.goto('/'); await signIn(page); await page.getByRole('button', { name: 'Open account report', exact: true }).click();
    let release!: () => void; const held = new Promise<void>(resolve => { release = resolve; });
    await context.route('**/rest/v1/attempt_reports**', async route => { await held; await route.abort().catch(() => {}); });
    try {
      const d = await openReview(page);
      // This checks the introduced 15-second source bound; ordinary existing
      // regression deadlines and their recovery/PDF expectations are unchanged.
      await expect(d.getByRole('button', { name: 'Retry Guided Review', exact: true })).toBeVisible({ timeout: 20000 });
      await expect(d.getByRole('button', { name: 'Start guided retry', exact: true })).toBeDisabled();
      await d.getByRole('button', { name: 'Return to ordinary review', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Export report (PDF)', exact: true })).toBeEnabled();
    } finally { release(); }
  });
  for (const [label, width, height, enlarged] of [['320', 320, 740, false], ['390', 390, 844, false], ['768', 768, 1024, false], ['1366', 1366, 900, false], ['landscape', 844, 390, false], ['200-text', 390, 844, true]] as const)
    test(`dialog ${label} has visible controls, keyboard exit and no page overflow`, async ({ page }, info) => {
      await page.setViewportSize({ width, height }); await openReport(page); const d = await openReview(page);
      await expect(d.getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
      const originalSize = await d.locator('p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize));
      if (enlarged) await page.evaluate(() => {
        const elements = [...document.querySelectorAll<HTMLElement>('dialog, dialog *')];
        const sizes = elements.map(element => ({ element, size: parseFloat(getComputedStyle(element).fontSize) }));
        for (const { element, size } of sizes) element.style.setProperty('font-size', `${size * 2}px`, 'important');
      });
      if (enlarged) expect(await d.locator('p').first().evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBe(originalSize * 2);
      for (const control of [d.getByRole('heading'), d.getByRole('button', { name: 'Close dialog', exact: true }), d.getByRole('button', { name: 'Start guided retry', exact: true })]) {
        const box = await control.boundingBox(); expect(box).not.toBeNull(); expect(box!.y).toBeGreaterThanOrEqual(0); expect(box!.y + box!.height).toBeLessThanOrEqual(height); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: info.outputPath('post-exam-' + label + '.png') });
      await page.keyboard.press('Escape'); await expect(d).not.toBeVisible(); await expect(page.getByRole('button', { name: 'Guided Review', exact: true })).toBeFocused();
    });
});
