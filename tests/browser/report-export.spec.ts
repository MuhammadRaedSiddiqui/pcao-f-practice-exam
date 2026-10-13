import { mkdir, readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { Nodes } from 'mdast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import { test, expect, type Page } from '@playwright/test';
import { createAttempt, submitAttempt, type Attempt } from '../../src/domain/attempt';
import { syntheticResultsAttempt } from '../fixtures/syntheticResultsAttempt';

async function openReport(page: Page, attempt: Attempt) {
  await page.addInitScript(saved => {
    localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
  }, attempt);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open report' }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await page.waitForLoadState('networkidle');
}

async function downloadedReport(page: Page, activate: () => Promise<void>) {
  const pending = page.waitForEvent('download');
  await activate();
  const download = await pending;
  expect(await download.failure()).toBeNull();
  const filename = download.suggestedFilename();
  expect(filename).toMatch(/\.pdf$/);
  await mkdir('test-results/report-export-pdf', { recursive: true });
  await download.saveAs('test-results/report-export-pdf/' + filename);
  const buffer = await readFile((await download.path())!);
  expect(buffer.subarray(0, 5).toString()).toBe('%PDF-');
  const loading = getDocument({ data: new Uint8Array(buffer), useSystemFonts: false });
  const pdf = await loading.promise;
  const text: string[] = [];
  const outsideMargins: { page: number; text: string }[] = [];
  const orphanHeadings: { page: number; text: string }[] = [];
  for (let index = 1; index <= pdf.numPages; index += 1) {
    const pdfPage = await pdf.getPage(index);
    const pageText = await pdfPage.getTextContent();
    const bodyItems = pageText.items.filter(item => 'str' in item && item.str.trim() && item.transform[5] > 48 && item.transform[5] < pdfPage.view[3] - 45);
    const last = bodyItems.at(-1);
    if (last && 'str' in last && /^(Option [A-Za-z0-9._-]+ \||Explanation$|Option explanation$|Sources$|Options and explanations$)/.test(last.str.trim())) {
      orphanHeadings.push({ page: index, text: last.str });
    }
    for (const item of pageText.items) {
      if (!('str' in item)) continue;
      if (item.str.trim()) {
        if (item.transform[4] < 43 || item.transform[4] + item.width > pdfPage.view[2] - 43) {
          outsideMargins.push({ page: index, text: item.str });
        }
      }
      // Remove repeating headers and footers before comparing body content.
      if (item.transform[5] > 48 && item.transform[5] < pdfPage.view[3] - 45) text.push(item.str);
    }
    const allText = pageText.items.map(item => 'str' in item ? item.str : '').join(' ');
    expect(allText).toContain(`Page ${index} of ${pdf.numPages}`);
  }
  const pages = pdf.numPages;
  await loading.destroy();
  expect(outsideMargins).toEqual([]);
  expect(orphanHeadings).toEqual([]);
  return { filename, content: text.join(' ').replace(/\s+/g, ' ').trim(), pages };
}

function compact(text: string) { return text.replace(/\s/g, ''); }

function visibleMarkdownBlocks(markdown: string): string[] {
  const root = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  function text(node: Nodes): string {
    if ('value' in node) return node.value;
    if ('alt' in node) return node.alt ?? '';
    return 'children' in node ? node.children.map(text).join('') : '';
  }
  function visit(node: Nodes): string[] {
    if (['paragraph', 'heading', 'code', 'tableCell'].includes(node.type)) return [text(node)];
    return 'children' in node ? node.children.flatMap(visit) : [];
  }
  return visit(root).filter(value => value.trim());
}

for (const viewport of [
  { name: '320', width: 320, height: 700 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1366', width: 1366, height: 768 },
  { name: 'landscape', width: 700, height: 320 },
  { name: 'enlarged', width: 320, height: 700 },
]) {
  test('complete legacy report download and keyboard access at ' + viewport.name, async ({ page, context }) => {
    await page.setViewportSize(viewport);
    const attempt = syntheticResultsAttempt();
    delete attempt.result;
    await openReport(page, attempt);
    if (viewport.name === 'enlarged') await page.evaluate(() => { document.body.style.fontSize = '24px'; });
    const before = await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()));
    await page.getByRole('button', { name: 'Incorrect (8)', exact: true }).click();
    await expect(page.locator('.review-item')).toHaveCount(8);
    const button = page.getByRole('button', { name: 'Export report (PDF)', exact: true });
    await button.scrollIntoViewIfNeeded();
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (viewport.name === '390' || viewport.name === '1366') {
      await page.screenshot({ path: 'screenshots/report-export-' + viewport.name + '.png' });
    }
    await context.setOffline(true);
    await button.focus();
    const report = await downloadedReport(page, () => page.keyboard.press('Enter'));
    expect(report.filename).toBe('pcao-f-original-report-2026-10-12-synthetic-results.pdf');
    expect(report.content).toContain('333 / 1000');
    expect(report.content).toContain('Difficulty Original exam');
    expect(report.content).toContain('Dataset version fixture-1');
    expect(report.content.match(/Question \d+ - T\d+/g)).toHaveLength(60);
    expect(report.pages).toBeGreaterThanOrEqual(61);
    expect(report.content).toContain('Recorded item Detailed synthetic evidence');
    expect(report.content).not.toContain('**Never publish');
    expect(report.content).not.toContain('| --- |');
    expect(report.content).toContain('Your selections: None - unanswered');
    expect(report.content).toContain('Your selections: C, A');
    expect(report.content).toContain('https://example.test/course#section');
    await expect(button).toBeFocused();
    await expect(page.getByRole('button', { name: 'Incorrect (8)', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage).sort()))).toBe(before);
    const repeated = await downloadedReport(page, () => button.click());
    expect(repeated).toEqual(report);
  });
}

for (const difficulty of ['advanced', 'intermediate'] as const) {
  test('exports actual ' + difficulty + ' snapshot after runtime bank changes', async ({ page, request }) => {
    const bankPath = difficulty === 'advanced' ? '/question-bank.json' : '/easy-question-bank.json';
    const bank = await (await request.get(bankPath)).json();
    const start = Date.UTC(2026, 9, 12, 10);
    const attempt = submitAttempt(createAttempt(bank, start, difficulty + '-export', difficulty), start + 1000, 'manual');
    const newer = structuredClone(bank);
    newer.version = 'later-test-version';
    newer.questions[0].stemMarkdown = 'Synthetic later bank content used only for export testing.';
    await page.route('**' + bankPath, route => route.fulfill({ json: newer }));
    await openReport(page, attempt);
    const report = await downloadedReport(page, () => page.getByRole('button', { name: 'Export report (PDF)', exact: true }).click());
    expect(report.filename).toBe(`pcao-f-${difficulty}-report-2026-10-12-${difficulty}-export.pdf`);
    expect(report.content).toContain('0 / 1000');
    expect(report.content).toContain('Unanswered 60');
    expect(report.content).toContain(`Dataset version ${bank.version}`);
    expect(report.content).not.toContain('later-test-version');
    expect(report.content).not.toContain(newer.questions[0].stemMarkdown);
    const pdfText = compact(report.content);
    const missing: { question: string; text: string }[] = [];
    for (const question of bank.questions) {
      // Independently check every visible paragraph and table cell in the PDF.
      const originalFields = [question.stemMarkdown, question.explanationMarkdown,
        ...question.options.flatMap((option: { id: string; textMarkdown: string }) => [option.textMarkdown, question.optionExplanations[option.id]])];
      for (const field of originalFields) {
        for (const block of visibleMarkdownBlocks(field)) {
          if (!pdfText.includes(compact(block))) missing.push({ question: question.id, text: block });
        }
      }
    }
    expect(missing).toEqual([]);
  });
}

test('failed download preparation can be retried and successful URLs are released', async ({ page }) => {
  await openReport(page, syntheticResultsAttempt());
  await page.evaluate(() => {
    const original = URL.createObjectURL.bind(URL);
    URL.createObjectURL = () => {
      URL.createObjectURL = original;
      throw new Error('Synthetic download failure');
    };
  });
  const button = page.getByRole('button', { name: 'Export report (PDF)', exact: true });
  await button.click();
  await expect(page.getByRole('alert')).toHaveText('The report could not be exported. Please try again.');
  await page.evaluate(() => {
    const original = URL.revokeObjectURL.bind(URL);
    URL.revokeObjectURL = url => {
      document.body.dataset.releasedReportUrl = url;
      original(url);
    };
  });
  await downloadedReport(page, () => button.click());
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('body')).toHaveAttribute('data-released-report-url', /^blob:/);
  await expect(page.locator('a[download]')).toHaveCount(0);
});

test('export button supports touch activation', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL, viewport: { width: 390, height: 844 }, hasTouch: true });
  try {
    const page = await context.newPage();
    await openReport(page, syntheticResultsAttempt());
    const report = await downloadedReport(page, () => page.getByRole('button', { name: 'Export report (PDF)', exact: true }).tap());
    expect(report.content).toContain('333 / 1000');
  } finally {
    await context.close();
  }
});
