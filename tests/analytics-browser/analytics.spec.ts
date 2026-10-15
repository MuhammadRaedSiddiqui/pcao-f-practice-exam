import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { gunzipSync } from 'node:zlib';
import { completedFixture, mockAccountServer, userA, userB } from '../fixtures/accountServer';
import { createAttempt } from '../../src/domain/attempt';
import { syntheticBank } from '../fixtures/syntheticBank';

type Event = { event: string; properties: Record<string, unknown> };
test.beforeEach(async ({ context }) => {
  // Model a human browser; the real SDK intentionally drops webdriver/bot traffic.
  await context.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });
    Object.defineProperty(Navigator.prototype, 'userAgentData', { get: () => undefined });
  });
});
async function collect(context: BrowserContext) {
  const events: Event[] = [];
  await context.route('https://analytics.synthetic.test/**', async route => {
    const request = route.request();
    if (new URL(request.url()).pathname.endsWith('.js')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
      return;
    }
    if (request.method() === 'POST' && /\/e\/?(?:\?|$)/.test(request.url())) {
      let bytes = request.postDataBuffer()!;
      if (bytes[0] === 31 && bytes[1] === 139) bytes = gunzipSync(bytes);
      let value = bytes.toString();
      if (!value.startsWith('{') && !value.startsWith('[')) {
        const form = new URLSearchParams(value);
        if (form.get('data')) value = Buffer.from(form.get('data')!, 'base64').toString();
      }
      const payload = JSON.parse(value) as Event | Event[] | { batch: Event[] };
      events.push(...(Array.isArray(payload) ? payload : 'batch' in payload ? payload.batch : [payload]));
    }
    await route.fulfill({ status: 200, contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' },
      body: JSON.stringify({ status: 1, featureFlags: {}, featureFlagPayloads: {}, supportedCompression: [], sessionRecording: false }) });
  });
  return events;
}

async function signIn(page: Page, email = 'alice@example.test') {
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Sign in', exact: true });
  await dialog.getByLabel('Email', { exact: true }).fill(email);
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  await dialog.getByLabel('Keep me signed in on this device').check();
  await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Account settings', exact: true })).toBeVisible();
}

async function signOut(page: Page) {
  await page.getByRole('button', { name: 'Account settings', exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
}

test('guest identity survives reload, virtual views and completion count once with private content excluded', async ({ page, context }) => {
  const events = await collect(context); const server = mockAccountServer(); await server.attach(context);
  // Recovery fragments are separately covered by the scrubber unit tests.
  await page.goto('/?email=private@example.test');
  await expect.poll(() => events.filter(item => item.event === '$pageview').length).toBe(1);
  const guest = events[0].properties.distinct_id;
  await page.reload();
  await expect.poll(() => events.filter(item => item.event === '$pageview').length).toBe(2);
  expect(events.filter(item => item.event === '$pageview')[1].properties.distinct_id).toBe(guest);
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Start Exam', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Review & submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  await expect.poll(() => events.filter(item => item.event === 'exam_completed').length).toBe(1);
  expect(events.filter(item => item.event === 'exam_started')).toHaveLength(1);
  expect(events.filter(item => item.event === 'review_opened')).toHaveLength(1);
  expect(events.filter(item => item.event === '$pageview').map(item => item.properties.$pathname)).toEqual(['/start', '/start', '/exam', '/results']);
  await page.reload();
  await expect.poll(() => events.filter(item => item.event === '$pageview').length).toBe(5);
  expect(events.filter(item => item.event === 'exam_completed')).toHaveLength(1);
  const data = JSON.stringify(events);
  expect(data).not.toContain('private@example.test');
  expect(data).not.toContain('stemMarkdown'); expect(data).not.toContain('correctOptionIds');
  expect(events.some(item => ['$autocapture', '$snapshot', '$exception'].includes(item.event))).toBe(false);
});

test('signup and explicit login are distinct from restoration, logout and account switching', async ({ page, context }) => {
  const events = await collect(context); const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create an account' });
  await dialog.getByLabel('Email', { exact: true }).fill('synthetic-new@example.test');
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Account settings', exact: true })).toBeVisible();
  await expect.poll(() => events.filter(item => item.event === 'signup_succeeded').length).toBe(1);
  await signOut(page);
  await signIn(page);
  await expect.poll(() => events.filter(item => item.event === 'login_succeeded').length).toBe(1);
  expect(events.find(item => item.event === 'login_succeeded')?.properties.distinct_id).toBe(userA);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Account settings', exact: true })).toBeVisible();
  await expect.poll(() => events.filter(item => item.event === 'signed_in_activity' && item.properties.distinct_id === userA).length).toBe(2);
  expect(events.filter(item => item.event === 'login_succeeded')).toHaveLength(1);
  await signOut(page);
  await signIn(page, 'bob@example.test');
  await expect.poll(() => events.filter(item => item.event === 'login_succeeded').length).toBe(2);
  expect(events.filter(item => item.event === 'login_succeeded')[1].properties.distinct_id).toBe(userB);
  expect(JSON.stringify(events)).not.toContain('alice@example.test');
  expect(JSON.stringify(events)).not.toContain('synthetic-password');
});

test('failed and cancelled auth emits no success or identified events', async ({ page, context }) => {
  const events = await collect(context); const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Sign in', exact: true });
  await dialog.getByLabel('Email', { exact: true }).fill('alice@example.test');
  await dialog.getByLabel('Password', { exact: true }).fill('wrong-password');
  await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(dialog.getByText('Sign-in failed. Check your email and password.')).toBeVisible();
  await context.route('https://supabase.synthetic.test/auth/v1/token**', async route => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.fallback().catch(() => {});
  });
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  await dialog.getByRole('button', { name: 'Sign in', exact: true }).click();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => events.filter(item => item.event === '$pageview').length).toBe(1);
  expect(events.some(item => ['login_succeeded', 'signup_succeeded', '$identify', 'signed_in_activity'].includes(item.event))).toBe(false);
});

test('engagement increments, report backup and PDF success use metadata only', async ({ page, context }) => {
  const events = await collect(context); const server = mockAccountServer(); await server.attach(context);
  const attempt = completedFixture('synthetic-analytics-report');
  await page.addInitScript(saved => {
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
    localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
  }, attempt);
  await page.clock.install(); await page.goto('/'); await page.bringToFront(); await signIn(page);
  await page.getByRole('button', { name: 'Back up report', exact: true }).click();
  await expect(page.getByText('Backed up', { exact: true })).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Open report', exact: true }).click();
  await page.getByRole('button', { name: 'Export report (PDF)' }).click();
  await expect(page.getByRole('button', { name: 'Export report (PDF)' })).toBeEnabled({ timeout: 40000 });
  await page.clock.runFor(65_000);
  await expect.poll(() => events.filter(item => item.event === 'engagement_time').length).toBeGreaterThan(0);
  expect(events.some(item => item.event === 'report_backup_succeeded')).toBe(true);
  expect(events.some(item => item.event === 'pdf_export_succeeded')).toBe(true);
  const engagement = events.filter(item => item.event === 'engagement_time');
  expect(engagement.every(item => Number(item.properties.active_seconds) > 0)).toBe(true);
  expect(engagement.some(item => item.properties.account_state === 'authenticated' && item.properties.distinct_id === userA)).toBe(true);
  expect(events.filter(item => item.event === 'exam_completed')).toHaveLength(0);
});

test('blocked analytics leaves the exam and submission usable', async ({ page, context }) => {
  await context.route('https://analytics.synthetic.test/**', route => route.abort());
  const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('button', { name: 'Review & submit' }).click();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
});

test('automatic expiry records a saved completion once with timeout metadata', async ({ page, context }) => {
  const events = await collect(context); await mockAccountServer().attach(context);
  const bank = syntheticBank(); bank.contentStatus = 'reviewed';
  const attempt = createAttempt(bank, Date.now() - bank.durationMinutes * 60_000 + 10_000, 'synthetic-analytics-expiry', 'intermediate');
  await page.addInitScript(saved => {
    if (!localStorage.getItem('pcao-f:attempt-ids:v1')) {
      localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([saved.id]));
      localStorage.setItem('pcao-f:attempt:v1:' + saved.id, JSON.stringify(saved));
    }
  }, attempt);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible({ timeout: 20000 });
  await expect.poll(() => events.filter(item => item.event === 'exam_completed').length).toBe(1);
  expect(events.find(item => item.event === 'exam_completed')?.properties).toMatchObject({
    attempt_id: attempt.id, submission_reason: 'timeout', elapsed_seconds: bank.durationMinutes * 60,
  });
  await page.reload();
  await expect.poll(() => events.filter(item => item.event === '$pageview' && item.properties.$pathname === '/start').length).toBe(2);
  expect(events.filter(item => item.event === 'exam_completed')).toHaveLength(1);
});
