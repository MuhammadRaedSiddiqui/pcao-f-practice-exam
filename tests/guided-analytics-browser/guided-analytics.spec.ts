import { test, expect, type BrowserContext } from '@playwright/test';
import { gunzipSync } from 'node:zlib';
import { mockAccountServer } from '../fixtures/accountServer';
const observations = new WeakMap<BrowserContext, { events: unknown[]; requests: string[]; messages: string[] }>();
test.afterEach(async ({ context }, info) => { await info.attach('guided-ingestion', { contentType: 'application/json', body: JSON.stringify(observations.get(context), null, 2) }); });
for (const direct of [false, true]) test(`real SDK suspends Guided attribution and excludes practice payload on ${direct ? 'direct entry' : 'Home transition'}`, async ({ page, context }) => {
  const events: { event: string; properties: Record<string, unknown> }[] = [];
  const observation = { events, requests: [] as string[], messages: [] as string[] }; observations.set(context, observation);
  page.on('pageerror', error => observation.messages.push(error.message));
  page.on('console', message => { if (message.type() === 'error') observation.messages.push(message.text()); });
  await context.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
    Object.defineProperty(Navigator.prototype, 'userAgentData', { get: () => undefined });
    document.hasFocus = () => true;
  });
  await mockAccountServer().attach(context);
  await context.route('https://analytics.synthetic.test/**', async route => {
    const request = route.request();
    observation.requests.push(request.method() + ' ' + new URL(request.url()).pathname);
    if (new URL(request.url()).pathname.endsWith('.js')) { await route.fulfill({ contentType: 'application/javascript', body: '' }); return; }
    if (request.method() === 'POST' && /\/e\/?(?:\?|$)/.test(request.url())) {
      let bytes = request.postDataBuffer()!;
      if (bytes[0] === 31 && bytes[1] === 139) bytes = gunzipSync(bytes);
      let value = bytes.toString();
      if (!value.startsWith('{') && !value.startsWith('[')) { const data = new URLSearchParams(value).get('data'); if (data) value = Buffer.from(data, 'base64').toString(); }
      const payload = JSON.parse(value); events.push(...(Array.isArray(payload) ? payload : payload.batch ?? [payload]));
    }
    await route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' },
      body: JSON.stringify({ status: 1, featureFlags: {}, featureFlagPayloads: {}, supportedCompression: [], sessionRecording: false }) });
  });
  await page.goto(direct ? '/guided' : '/');
  if (!direct) {
    await expect.poll(() => events.filter(e => e.event === '$pageview').map(e => e.properties.$pathname), { timeout: 10000 }).toEqual(['/start']);
    await page.getByRole('link', { name: 'Open Guided Practice', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Question 1 of 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Hint 1', exact: true }).click();
  await expect(page.getByText('Synthetic ask prompt', { exact: true })).toBeVisible();
  await page.locator('.guided-options input').nth(0).check(); await page.locator('.guided-options input').nth(2).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: /answer saved and locked/ })).toBeVisible();
  await page.clock.install(); await page.clock.runFor(12000);
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect.poll(() => events.filter(e => e.event === '$pageview').map(e => e.properties.$pathname), { timeout: 10000 }).toEqual(direct ? ['/history'] : ['/start', '/history']);
  expect(events.filter(e => ['exam_started', 'exam_completed', 'exam_resumed', 'review_opened', 'pdf_export_succeeded', 'report_backup_succeeded'].includes(e.event))).toHaveLength(0);
  expect(JSON.stringify(events)).not.toMatch(/guided|Synthetic|stemMarkdown|correctOptionIds|guideDigest|selectedOptionIds|maxHintRevealed/);
  expect(events.filter(e => e.event === 'engagement_time').every(e => ['start', 'history'].includes(String(e.properties.view)))).toBe(true);
});
