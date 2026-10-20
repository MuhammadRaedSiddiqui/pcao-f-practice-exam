import { expect, test, type Page } from '@playwright/test';
import { authFixture, mockAccountServer, userA } from '../fixtures/accountServer';

const browserMessages = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const messages: string[] = []; browserMessages.set(page, messages);
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) messages.push(message.type() + ': ' + message.text()); });
  page.on('pageerror', error => messages.push('pageerror: ' + error.message));
});
test.afterEach(async ({ page }, info) => {
  await info.attach('recovery-console', { contentType: 'application/json', body: JSON.stringify(browserMessages.get(page), null, 2) });
});

function recoveryFixture() {
  const fixture = authFixture('alice@example.test', userA);
  const claims = JSON.parse(Buffer.from(fixture.access_token.split('.')[1], 'base64url').toString());
  fixture.access_token = fixture.access_token.split('.')[0] + '.' +
    Buffer.from(JSON.stringify({ ...claims, session_id: crypto.randomUUID() })).toString('base64url') + '.synthetic';
  return fixture;
}
async function openRecovery(page: Page) {
  const session = recoveryFixture();
  const fragment = new URLSearchParams({ access_token: session.access_token, refresh_token: session.refresh_token,
    token_type: 'bearer', expires_in: '3600', type: 'recovery' });
  await page.goto('/#' + fragment);
  // Auth callback initialization is complete only after the accepted session reaches the header.
  await expect(page.getByRole('banner').getByText('alice@example.test', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Choose a new password' })).toBeVisible();
  return session;
}

for (const dismissal of ['Cancel', 'Close dialog', 'Escape']) {
  test('recovery resumes after ' + dismissal + ' and after reload', async ({ page, context }) => {
    await mockAccountServer().attach(context);
    await openRecovery(page);
    const dialog = page.getByRole('dialog', { name: 'Choose a new password' });
    if (dismissal === 'Escape') await page.keyboard.press('Escape');
    else await dialog.getByRole('button', { name: dismissal, exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await page.getByRole('button', { name: 'Finish password reset' }).click();
    await expect(dialog).toBeVisible();
    await page.reload();
    await expect(dialog).toBeVisible();
    expect(new URL(page.url()).hash).toBe('');
  });
}

test('successful password update clears pending recovery and does not reopen on reload', async ({ page, context }) => {
  await mockAccountServer().attach(context);
  const session = await openRecovery(page);
  let updated = false;
  await context.route('https://supabase.synthetic.test/auth/v1/user', async route => {
    if (route.request().method() !== 'PUT') return route.fallback();
    expect(route.request().postDataJSON().password).toBe('synthetic-new-password');
    updated = true;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session.user) });
  });
  const dialog = page.getByRole('dialog', { name: 'Choose a new password' });
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-new-password');
  await dialog.getByRole('button', { name: 'Update password', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Your password has been updated.', { exact: true })).toBeVisible();
  expect(updated).toBe(true);
  expect(await page.evaluate(() => sessionStorage.getItem('pcao-f:password-recovery:v1'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Finish password reset' })).toHaveCount(0);
});

test('expired callback surfaces a safe error, cleans the URL and offers another recovery request', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context);
  await page.goto('/#error=access_denied&error_code=otp_expired&error_description=private-provider-message');
  await expect(page.getByRole('alert')).toContainText('may have expired');
  await expect(page.getByText('private-provider-message')).toHaveCount(0);
  await expect.poll(() => new URL(page.url()).hash).toBe('');
  await page.getByRole('button', { name: 'Request a new recovery link' }).click();
  const dialog = page.getByRole('dialog', { name: 'Reset your password' });
  await dialog.getByLabel('Email', { exact: true }).fill('alice@example.test');
  await dialog.getByRole('button', { name: 'Send recovery link', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('If an account exists');
  expect(server.requests.some(path => path.endsWith('/recover'))).toBe(true);
});

test('a recovery URL flag cannot open a password update without an accepted session', async ({ page, context }) => {
  await mockAccountServer().attach(context);
  await page.goto('/?type=recovery');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Choose a new password' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Finish password reset' })).toHaveCount(0);
});

test('sign-out clears pending recovery and the update form', async ({ page, context }) => {
  await mockAccountServer().attach(context); await openRecovery(page);
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('link', { name: 'Account settings', exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('pcao-f:password-recovery:v1'))).toBeNull();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Choose a new password' })).toHaveCount(0);
});

test('pending recovery is deferred throughout Exam and reload, then resumes after confirmed navigation', async ({ page, context }) => {
  await mockAccountServer().attach(context); await openRecovery(page);
  const dialog = page.getByRole('dialog', { name: 'Choose a new password' });
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  const pending = await page.evaluate(() => sessionStorage.getItem('pcao-f:password-recovery:v1'));
  expect(pending).not.toBeNull();
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  const saved = () => page.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:' + JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0]));
  const before = await saved();
  page.once('dialog', prompt => prompt.accept()); await page.reload();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Finish password reset' })).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('pcao-f:password-recovery:v1'))).toBe(pending);
  await page.getByRole('button', { name: 'Review & submit' }).click(); await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: 'Back to exam' }).click();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Leave exam?' })).toBeVisible(); await expect(dialog).toHaveCount(0);
  await page.getByRole('button', { name: 'Go to attempt history' }).click();
  await expect(page).toHaveURL(/\/history$/); await expect(dialog).toBeVisible();
  expect(await saved()).toBe(before);
});
