import { test, expect, type BrowserContext } from '@playwright/test';
import { gunzipSync } from 'node:zlib';
import { mockAccountServer } from '../fixtures/accountServer';
import { postExamReport } from '../fixtures/postExamReport';
const observed = new WeakMap<BrowserContext, unknown[]>();
test.afterEach(async ({ context }, info) => { await info.attach('post-exam-sdk-events.json', { body: JSON.stringify(observed.get(context)), contentType: 'application/json' }); });

test('real SDK suspends attribution inside the Results Guided Review dialog and session', async ({ page, context }) => {
  const events: { event: string; properties: Record<string, unknown> }[] = [];
  observed.set(context, events);
  await mockAccountServer().attach(context);
  await context.addInitScript(report => {
    Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
    Object.defineProperty(Navigator.prototype, 'userAgentData', { get: () => undefined });
    document.hasFocus = () => true;
    localStorage.setItem('pcao-f:attempt:v1:' + report.id, JSON.stringify(report));
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([report.id]));
  }, postExamReport());
  await context.route('https://analytics.synthetic.test/**', async route => {
    const request = route.request();
    if (new URL(request.url()).pathname.endsWith('.js')) { await route.fulfill({ contentType: 'application/javascript', body: '' }); return; }
    if (request.method() === 'POST' && /\/e\/?(?:\?|$)/.test(request.url())) {
      let bytes = request.postDataBuffer()!;
      if (bytes[0] === 31 && bytes[1] === 139) bytes = gunzipSync(bytes);
      let value = bytes.toString();
      if (!value.startsWith('{') && !value.startsWith('[')) {
        const data = new URLSearchParams(value).get('data'); if (data) value = Buffer.from(data, 'base64').toString();
      }
      const payload = JSON.parse(value); events.push(...(Array.isArray(payload) ? payload : payload.batch ?? [payload]));
    }
    await route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' },
      body: JSON.stringify({ status: 1, featureFlags: {}, featureFlagPayloads: {}, supportedCompression: [], sessionRecording: false }) });
  });
  await page.goto('/'); await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await expect.poll(() => events.filter(e => e.event === '$pageview').map(e => e.properties.$pathname), { timeout: 10000 }).toEqual(['/start', '/results']);
  await page.getByRole('button', { name: 'Guided Review', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Guided Review', exact: true });
  await expect(dialog.getByRole('button', { name: 'Start guided retry', exact: true })).toBeEnabled();
  await dialog.getByLabel('Questions to retry').selectOption('flagged');
  await expect(dialog.getByRole('status')).toHaveText('3 eligible · 4 matched · 1 unavailable');
  await dialog.getByLabel('Questions to retry').selectOption('incorrect-unanswered');
  await expect(dialog.getByRole('status')).toHaveText('9 eligible · 59 matched · 50 unavailable');
  expect(events.filter(e => e.event === '$pageview').map(e => e.properties.$pathname)).toEqual(['/start', '/results']);
  await dialog.getByRole('button', { name: 'Start guided retry', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 9', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Return to original results', exact: true }).click();
  await expect.poll(() => events.filter(e => e.event === '$pageview').map(e => e.properties.$pathname), { timeout: 10000 }).toEqual(['/start', '/results', '/results']);
  expect(JSON.stringify(events)).not.toMatch(/guided|Synthetic|stemMarkdown|correctOptionIds|guideDigest|selectedOptionIds|maxHintRevealed/);
  expect(events.filter(e => ['exam_started', 'exam_completed', 'exam_resumed', 'review_opened', 'report_backup_succeeded'].includes(e.event))).toEqual([]);
});
