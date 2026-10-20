import { test, expect, type Page } from '@playwright/test';
import { authFixture, completedFixture, cloudRow, mockAccountServer, userA, userB } from '../fixtures/accountServer';

async function signIn(page:Page,email='alice@example.test',remember=false) {
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Sign in',exact:true});
  await dialog.getByLabel('Email',{exact:true}).fill(email);
  await dialog.getByLabel('Password',{exact:true}).fill('synthetic-password');
  if(remember)await dialog.getByLabel('Keep me signed in on this device').check();
  await dialog.getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(page.getByRole('banner').getByRole('link',{name:'Account settings',exact:true})).toBeVisible();
}
async function settings(page: Page) {
  await page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('heading', { name: 'Account settings', exact: true })).toBeVisible();
}
async function signOut(page: Page) {
  await settings(page);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/history$/);
}
async function seedReport(page:Page,id='synthetic-account-report') {
  const report=completedFixture(id);
  await page.addInitScript(attempt=>{
    if(!localStorage.getItem('pcao-f:attempt-ids:v1')) {
      localStorage.setItem('pcao-f:attempt-ids:v1',JSON.stringify([attempt.id]));
      localStorage.setItem('pcao-f:attempt:v1:'+attempt.id,JSON.stringify(attempt));
    }
  },report);
  return report;
}
test('signup provides immediate access using only email/password, and signout hides private reports',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);await page.goto('/');
  await page.getByRole('button',{name:'Create account',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Create an account'});
  await expect(dialog.getByText('No email verification is required.',{exact:false})).toBeVisible();
  await dialog.getByLabel('Email',{exact:true}).fill('new@example.test');
  await dialog.getByLabel('Password',{exact:true}).fill('synthetic-password');
  await dialog.getByRole('button',{name:'Create account',exact:true}).click();
  await expect(page.getByRole('banner').getByRole('link',{name:'Account settings',exact:true})).toBeVisible();
  expect(server.requests.filter(path=>/verify|otp|resend/.test(path))).toHaveLength(0);
  expect(server.rows).toHaveLength(0);
  expect(server.requests.filter(path=>path.endsWith('/backup-report'))).toHaveLength(0);
  await expect(page.getByText('No account reports yet. Completed reports will appear here after backup.')).toBeVisible();
  await expect(page.getByRole('dialog',{name:'Import device history'})).toHaveCount(0);
  await signOut(page);
  await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
});

test('individual backup preserves local bytes, backs up once and recovers on a fresh device',async({page,context,browser})=>{
  const server=mockAccountServer();await server.attach(context);const attempt=await seedReport(page);
  await page.goto('/');const before=await page.evaluate(id=>localStorage.getItem('pcao-f:attempt:v1:'+id),attempt.id);
  await signIn(page);
  expect(server.rows).toHaveLength(0);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows).toHaveLength(1);
  expect(await page.evaluate(id=>localStorage.getItem('pcao-f:attempt:v1:'+id),attempt.id)).toBe(before);
  const second=await browser.newContext();await server.attach(second);const other=await second.newPage();
  await other.goto('http://127.0.0.1:4232/');await signIn(other);
  await other.getByRole('button',{name:'Open account report'}).click();
  await expect(other.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await expect(other.getByText('17 / 1000',{exact:true})).toBeVisible();
  await other.getByRole('button',{name:'Export report (PDF)'}).click();
  await expect(other.getByRole('button',{name:'Export report (PDF)'})).toBeEnabled({timeout:40000});
  await second.close();
});

test('automatic backup waits for successful offline completion, then uploads after reconnection',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);await page.goto('/');await signIn(page,'alice@example.test',true);
  await settings(page);
  await page.getByLabel('Automatically back up new exams after completion').check();
  await expect.poll(() => server.preferences.get(userA)).toBe(true);
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await page.getByRole('button',{name:'Start exam',exact:true}).click();
  await page.getByRole('button',{name:'Start Exam',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Question 1 of 60',exact:true})).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button',{name:'Review & submit'}).click();
  await page.getByRole('dialog',{name:'Review and submit'}).getByRole('button',{name:'Submit exam',exact:true}).click();
  await page.getByRole('button',{name:'Confirm submission',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  expect(server.rows).toHaveLength(0);
  await context.setOffline(false);
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:25000});
  expect(server.rows).toHaveLength(1);
});

test('signing into another account cannot display or upload owned device reports',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);await seedReport(page);await page.goto('/');await signIn(page);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  await signOut(page);
  await expect(page.getByRole('button',{name:'Open report',exact:true})).toHaveCount(0);
  await signIn(page,'bob@example.test');
  await expect(page.getByRole('button',{name:'Open report',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(0);
  expect(server.rows.filter(row=>row.user_id===userB)).toHaveLength(0);
});

test('deletion keeps the device original and cannot resurrect after archive bookkeeping is cleared',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);const attempt=await seedReport(page);await page.goto('/');await signIn(page,'alice@example.test',true);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Delete account report',exact:true}).click();
  await page.getByRole('dialog',{name:'Delete account report?'}).getByRole('button',{name:'Delete account report',exact:true}).click();
  await expect(page.getByText('Removed from account · saved on this device',{exact:true})).toBeVisible();
  expect(await page.evaluate(id=>Boolean(localStorage.getItem('pcao-f:attempt:v1:'+id)),attempt.id)).toBe(true);
  await page.evaluate(() => new Promise<void>((resolve,reject) => {
    const open=indexedDB.open('pcao-f-account-archive-v1',1); open.onerror=()=>reject(open.error);
    open.onsuccess=()=>{const db=open.result;const tx=db.transaction('jobs','readwrite');tx.objectStore('jobs').clear();tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};
  }));
  await page.reload();
  await expect(page.getByText('Removed from account · saved on this device',{exact:true})).toBeVisible();
  expect(server.rows.filter(row=>row.user_id===userA&&row.deleted_at===null)).toHaveLength(0);
});

test('individual PDF and full backup preserve reports; device removal requires a verified backup',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);const report=await seedReport(page);await page.goto('/');await signIn(page);
  await expect(page.getByRole('button',{name:'Remove device copy',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows[0].payload).toEqual(report);
  await page.getByRole('button',{name:'Open report',exact:true}).click();
  const download=page.waitForEvent('download');
  await expect(page.getByRole('button',{name:'Export account history (JSON)'})).toHaveCount(0);
  await page.getByRole('button',{name:'Export report (PDF)'}).click();
  const file=await download;const stream=await file.createReadStream();const chunks:Buffer[]=[];for await(const part of stream!)chunks.push(part);
  expect(Buffer.concat(chunks).subarray(0,5).toString()).toBe('%PDF-');
  expect(file.suggestedFilename()).toMatch(/\.pdf$/);
  expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('pcao-f:attempt:v1:'+id)!),report.id)).toEqual(report);
  await page.getByRole('banner').getByRole('link',{name:'Attempt history',exact:true}).click();
  await page.getByRole('button',{name:'Remove device copy',exact:true}).click();
  await page.getByRole('dialog',{name:'Remove device copy?'}).getByRole('button',{name:'Remove device copy',exact:true}).click();
  await expect(page.getByRole('button',{name:'Open account report'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Open report',exact:true})).toHaveCount(0);
});

test('fresh account report is read-only across storage events and signout closes its Results',async({page,context})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('cloud-only')));await server.attach(context);
  await page.goto('/');await signIn(page);await page.getByRole('button',{name:'Open account report'}).click();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await page.evaluate(()=>window.dispatchEvent(new StorageEvent('storage',{key:'pcao-f:attempt-ids:v1'})));
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await signOut(page);
  await page.goBack();
  await page.reload();
  await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open account report'})).toHaveCount(0);
});

test('account deletion reauthenticates with a password and preserves unrelated guest history',async({page,context})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('account-delete-a')),await cloudRow(userB,completedFixture('account-delete-b')));await server.attach(context);
  const guest=await seedReport(page,'retained-unowned-guest');await page.goto('/');await signIn(page);
  const before=await page.evaluate(id=>localStorage.getItem('pcao-f:attempt:v1:'+id),guest.id);
  await settings(page);
  await page.getByRole('button',{name:'Delete account',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Delete your account?'});
  await dialog.getByLabel('Current password').fill('wrong-password');
  await dialog.getByLabel('I understand that my account reports will be deleted.').check();
  await dialog.getByRole('button',{name:'Delete my account'}).click();
  await expect(dialog.getByRole('alert')).toContainText('Incorrect current password');
  await dialog.getByLabel('Current password').fill('synthetic-password');
  await dialog.getByRole('button',{name:'Delete my account'}).click();
  await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();
  expect(await page.evaluate(id=>localStorage.getItem('pcao-f:attempt:v1:'+id),guest.id)).toBe(before);
  expect(server.rows.filter(row=>row.user_id===userA)).toHaveLength(0);expect(server.rows.filter(row=>row.user_id===userB)).toHaveLength(1);
});

test('account forms and history work at all required layouts with keyboard focus and no overflow',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);
  for(const viewport of [{width:320,height:700},{width:390,height:844},{width:768,height:1024},{width:1366,height:900},{width:844,height:390},{width:390,height:844,enlarged:true}]) {
    await page.setViewportSize(viewport);await page.goto('/');
    if(viewport.enlarged)await page.addStyleTag({content:'html{font-size:24px!important}'});
    await page.getByRole('button',{name:'Sign in',exact:true}).focus();await page.keyboard.press('Enter');
    const dialog=page.getByRole('dialog',{name:'Sign in',exact:true});await expect(dialog).toBeVisible();
    await dialog.getByLabel('Email',{exact:true}).fill('alice@example.test');
    await dialog.getByLabel('Password',{exact:true}).fill('synthetic-password');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.screenshot({path:'screenshots/account-signin-'+viewport.width+(viewport.enlarged?'-enlarged':viewport.height===390?'-landscape':'')+'.png'});
    await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeFocused();
  }
});

test('lost upload acknowledgements retry by comparing stored content and never duplicate reports',async({page,context})=>{
  const server=mockAccountServer();server.loseResponses(1);await server.attach(context);await seedReport(page);await page.goto('/');await signIn(page);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Synthetic lost acknowledgement',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows).toHaveLength(1);
  await page.getByRole('button',{name:'Retry backup',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows).toHaveLength(1);
});
test('pending backups can be paused while offline and resumed explicitly',async({page,context})=>{
  const server=mockAccountServer();server.failNextBackups(1);await server.attach(context);await seedReport(page);await page.goto('/');await signIn(page);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Synthetic retryable failure',{exact:true})).toBeVisible({timeout:20000});
  await context.setOffline(true);
  await page.getByRole('button',{name:'Pause backup',exact:true}).click();
  await expect(page.getByText('Backup paused',{exact:true})).toBeVisible();
  await context.setOffline(false);
  expect(server.rows).toHaveLength(0);
  await page.getByRole('button',{name:'Resume backup',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows).toHaveLength(1);
});
test('late backup responses cannot appear under a newly signed-in account',async({page,context})=>{
  const server=mockAccountServer();server.delayBackups(2000);await server.attach(context);await seedReport(page);await page.goto('/');await signIn(page);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect.poll(()=>server.requests.filter(path=>path.endsWith('/backup-report')).length).toBe(1);
  await signOut(page);
  await signIn(page,'bob@example.test');
  await expect.poll(()=>server.rows.length).toBe(1);
  expect(server.rows[0].user_id).toBe(userA);
  await expect(page.getByRole('button',{name:'Open report',exact:true})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(0);
  await expect(page.getByText('Backed up',{exact:true})).toHaveCount(0);
});
test('history pagination includes equal-time reports without missing or duplicating rows',async({page,context})=>{
  const server=mockAccountServer();
  const base=completedFixture('base');
  server.rows.push(...await Promise.all(Array.from({length:21},(_,i)=>cloudRow(userA,{...base,id:'synthetic-page-'+i}))));
  await server.attach(context);await page.goto('/');await signIn(page);
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(20);
  await page.getByRole('button',{name:'Load more account reports'}).click();
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(21);
  await expect(page.getByRole('button',{name:'Load more account reports'})).toHaveCount(0);
});
test('a downloaded trusted-device report remains available when account downloads fail',async({page,context})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('offline-copy')));await server.attach(context);
  await page.goto('/');await signIn(page);
  await settings(page);
  await page.getByLabel('Keep opened account reports on this trusted device for offline access').check();
  await page.getByRole('banner').getByRole('link',{name:'Attempt history',exact:true}).click();
  await page.getByRole('button',{name:'Open account report'}).click();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await context.setOffline(true);
  await page.getByRole('button',{name:'Open account report'}).click();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await context.setOffline(false);
});
test('cloud report review remains available when both current question banks are unavailable',async({page,context})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('saved-original-bank')));await server.attach(context);
  await context.route('**/*question-bank.json',route=>route.fulfill({status:404,body:'Unavailable synthetic bank'}));
  await page.goto('/');await signIn(page);
  await expect(page.getByRole('button',{name:'Start exam',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Open account report'}).click();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await expect(page.getByText('17 / 1000',{exact:true})).toBeVisible();
});
test('signed-in account history fits all six layouts and preserves touch targets',async({page,context})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('layout-report')));await server.attach(context);await page.goto('/');await signIn(page);
  for(const viewport of [{width:320,height:700},{width:390,height:844},{width:768,height:1024},{width:1366,height:900},{width:844,height:390},{width:390,height:844,enlarged:true}]) {
    await page.setViewportSize(viewport);
    if(viewport.enlarged)await page.addStyleTag({content:'html{font-size:24px!important}'});
    await page.getByRole('heading',{name:'Account reports',exact:true}).scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const box=await page.getByRole('button',{name:'Open account report'}).boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({path:'screenshots/account-history-'+viewport.width+(viewport.enlarged?'-enlarged':viewport.height===390?'-landscape':'')+'.png'});
  }
});

test('two signed-in tabs coordinate the same individual backup without duplicate backups',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);await seedReport(page);await page.goto('/');await signIn(page,'alice@example.test',true);
  const second=await context.newPage();await second.goto('http://127.0.0.1:4232/');
  await expect(second.getByRole('banner').getByRole('link',{name:'Account settings',exact:true})).toBeVisible();
  await Promise.all([
    page.getByRole('button',{name:'Back up report',exact:true}).evaluate(element=>(element as HTMLButtonElement).click()),
    second.getByRole('button',{name:'Back up report',exact:true}).evaluate(element=>(element as HTMLButtonElement).click()),
  ]);
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  await expect(second.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  expect(server.rows).toHaveLength(1);
});
test('touch users can sign in and open a frozen account report',async({browser})=>{
  const server=mockAccountServer();server.rows.push(await cloudRow(userA,completedFixture('touch-report')));
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await server.attach(context);
  const page=await context.newPage();await page.goto('http://127.0.0.1:4232/');
  await page.getByRole('button',{name:'Sign in',exact:true}).tap();
  const dialog=page.getByRole('dialog',{name:'Sign in',exact:true});
  await dialog.getByLabel('Email',{exact:true}).fill('alice@example.test');await dialog.getByLabel('Password',{exact:true}).fill('synthetic-password');
  await dialog.getByRole('button',{name:'Sign in',exact:true}).tap();
  await expect(page.getByRole('banner').getByRole('link',{name:'Account settings',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Open account report'}).tap();
  await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
  await context.close();
});
test('authentication failures remain retryable and do not block a guest exam',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);await page.goto('/');
  await page.getByRole('button',{name:'Sign in',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Sign in',exact:true});
  await dialog.getByLabel('Email',{exact:true}).fill('alice@example.test');await dialog.getByLabel('Password',{exact:true}).fill('wrong-password');
  await dialog.getByRole('button',{name:'Sign in',exact:true}).click();await expect(dialog.getByRole('alert')).toContainText('Sign-in failed');
  await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('button',{name:'Start exam',exact:true}).click();await page.getByRole('button',{name:'Start Exam',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Question 1 of 60',exact:true})).toBeVisible();
});

test('automatic signup migration sends bounded batches and retains pending reports for explicit retry',async({page,context})=>{
  const server=mockAccountServer();await server.attach(context);
  const reports=Array.from({length:6},(_,i)=>completedFixture('bounded-batch-'+i));
  await page.addInitScript(attempts=>{
    localStorage.setItem('pcao-f:attempt-ids:v1',JSON.stringify(attempts.map(attempt=>attempt.id)));
    for(const attempt of attempts)localStorage.setItem('pcao-f:attempt:v1:'+attempt.id,JSON.stringify(attempt));
  },reports);
  await page.goto('/');await signUp(page);
  await expect(page.getByRole('button',{name:'Import device history'})).toHaveCount(0);
  await expect(page.getByText('Backed up',{exact:true})).toHaveCount(5,{timeout:10000});
  await expect(page.getByText('Backup pending',{exact:true})).toHaveCount(1);
  expect(server.rows).toHaveLength(5);
  await page.getByRole('button',{name:'Retry backup',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toHaveCount(6,{timeout:20000});
  expect(server.rows).toHaveLength(6);
});

test('backing up an older saved report does not skip unseen account history',async({page,context})=>{
  const server=mockAccountServer();const base=completedFixture('pagination-base');
  const older={...base,id:'older-local-report',startedAt:base.startedAt-60000,deadlineAt:base.deadlineAt-60000,submittedAt:base.submittedAt!-60000};
  server.rows.push(...await Promise.all(Array.from({length:21},(_,i)=>cloudRow(userA,{...base,id:'newer-account-'+i}))));
  server.rows.push(await cloudRow(userA,older));await server.attach(context);
  await page.addInitScript(attempt=>{localStorage.setItem('pcao-f:attempt-ids:v1',JSON.stringify([attempt.id]));localStorage.setItem('pcao-f:attempt:v1:'+attempt.id,JSON.stringify(attempt));},older);
  await page.goto('/');await signIn(page);
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(20);
  await page.getByRole('button',{name:'Back up report',exact:true}).click();
  await expect(page.getByText('Backed up',{exact:true})).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Load more account reports'}).click();
  await expect(page.getByRole('button',{name:'Open account report',exact:true})).toHaveCount(21);
  expect(server.rows).toHaveLength(22);
});

async function signUp(page: Page, remember = false) {
  await page.getByRole('banner').getByRole('button', { name: 'Create account', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create an account' });
  await dialog.getByLabel('Email', { exact: true }).fill('new@example.test');
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  if (remember) await dialog.getByLabel('Keep me signed in on this device').check();
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(dialog).toHaveCount(0);
}

test('signup automatically migrates completed guest history without changing device copies', async ({ page, context, browser }) => {
  const server = mockAccountServer(); await server.attach(context);
  const reports = [completedFixture('signup-intermediate'), { ...completedFixture('signup-legacy'), difficulty: undefined }];
  await page.addInitScript(attempts => {
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify(attempts.map(attempt => attempt.id)));
    for (const attempt of attempts) localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, JSON.stringify(attempt));
  }, reports);
  await page.goto('/');
  const before = await page.evaluate(ids => ids.map(id => localStorage.getItem('pcao-f:attempt:v1:' + id)), reports.map(attempt => attempt.id));
  await signUp(page);
  await expect(page.getByText('Backed up', { exact: true })).toHaveCount(2, { timeout: 20000 });
  await expect(page.getByRole('dialog', { name: 'Import device history' })).toHaveCount(0);
  expect(server.rows).toHaveLength(2);
  expect(await page.evaluate(ids => ids.map(id => localStorage.getItem('pcao-f:attempt:v1:' + id)), reports.map(attempt => attempt.id))).toEqual(before);
  const second = await browser.newContext(); await server.attach(second); const other = await second.newPage();
  await other.goto('http://127.0.0.1:4232/'); await signIn(other, 'new@example.test');
  await expect(other.getByRole('button', { name: 'Open account report' })).toHaveCount(2);
  await second.close();
});

test('signup excludes unfinished, private and damaged browser records from migration', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context);
  const guest = completedFixture('signup-guest'), privateReport = completedFixture('signup-private');
  const { submittedAt, submissionReason, result, ...saved } = completedFixture('signup-active');
  const active = { ...saved, status: 'in-progress' as const };
  await page.addInitScript(({ guest, privateReport, active, owner }) => {
    localStorage.setItem('pcao-f:attempt-ids:v1', JSON.stringify([guest.id, privateReport.id, active.id, 'signup-damaged']));
    for (const attempt of [guest, privateReport, active]) localStorage.setItem('pcao-f:attempt:v1:' + attempt.id, JSON.stringify(attempt));
    localStorage.setItem('pcao-f:attempt-owner:v1:' + privateReport.id, JSON.stringify({ userId: owner, state: 'eligible', createdAt: Date.now() }));
    localStorage.setItem('pcao-f:attempt:v1:signup-damaged', '{broken');
  }, { guest, privateReport, active, owner: userA });
  await page.goto('/'); await signUp(page);
  await expect(page.getByText('Backed up', { exact: true })).toBeVisible({ timeout: 20000 });
  expect(server.rows.map(row => row.attempt_id)).toEqual([guest.id]);
  expect(await page.evaluate(id => localStorage.getItem('pcao-f:attempt-owner:v1:' + id), active.id)).toBeNull();
  const ownership = await page.evaluate(id => JSON.parse(localStorage.getItem('pcao-f:attempt-owner:v1:' + id)!), privateReport.id);
  expect(ownership.userId).toBe(userA);
  await expect(page.getByText('Some device reports could not be migrated.', { exact: false })).toBeVisible();
});

test('signup migration retries a failed backup after reopening without an import prompt', async ({ page, context }) => {
  const server = mockAccountServer(); server.failNextBackups(1); await server.attach(context);
  await seedReport(page, 'signup-retry'); await page.goto('/'); await signUp(page, true);
  await expect(page.getByText('Synthetic retryable failure', { exact: true })).toBeVisible({ timeout: 20000 });
  await page.reload();
  await expect(page.getByText('Backed up', { exact: true })).toBeVisible({ timeout: 25000 });
  expect(server.rows).toHaveLength(1);
  await expect(page.getByRole('dialog', { name: 'Import device history' })).toHaveCount(0);
});

test('active Exam defers authentication through reload, Review and leave confirmation; Results restores signup', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('radio').first().check();
  const saved = () => page.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:' + JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0]));
  const before = await saved();
  const restricted = async () => {
    await expect(page.getByRole('banner')).toContainText('Guest');
    for (const name of ['Sign in', 'Create account', 'Finish password reset']) await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Account settings', exact: true })).toHaveCount(0);
  };
  await restricted();
  page.once('dialog', dialog => dialog.accept()); await page.reload();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await restricted(); expect(await saved()).toBe(before);
  await page.getByRole('banner').getByRole('link', { name: 'Attempt history', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Leave exam?' })).toBeVisible(); await restricted();
  await page.getByRole('button', { name: 'Stay in exam' }).click();
  await page.getByRole('button', { name: 'Review & submit' }).click(); await restricted();
  await page.getByRole('button', { name: 'Submit exam', exact: true }).click(); await restricted();
  expect(server.requests.filter(path => /signup|token/.test(path))).toHaveLength(0);
  await page.getByRole('button', { name: 'Confirm submission', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your results', exact: true })).toBeVisible();
  const report = await saved(); await signUp(page);
  await expect(page.getByText('Backed up', { exact: true })).toBeVisible({ timeout: 20000 });
  expect(await saved()).toBe(report); expect(server.rows).toHaveLength(1);
  await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
});

test('header signup controls fit six layouts with keyboard access and large touch targets', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 900 }, { width: 844, height: 390 }, { width: 390, height: 844, enlarged: true }]) {
    await page.setViewportSize(viewport);
    if (viewport.enlarged) await page.addStyleTag({ content: 'html{font-size:24px!important}' });
    const header = page.getByRole('banner');
    await header.scrollIntoViewIfNeeded();
    const signup = header.getByRole('button', { name: 'Create account', exact: true });
    await expect(signup).toBeVisible();
    expect(await page.getByRole('main').getByRole('button', { name: 'Sign in', exact: true }).count()).toBe(0);
    const box = await signup.boundingBox(); const headerBox = await header.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x + box!.width).toBeLessThanOrEqual(headerBox!.x + headerBox!.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: 'screenshots/signup-header-' + viewport.width + (viewport.enlarged ? '-enlarged' : viewport.height === 390 ? '-landscape' : '') + '.png' });
    await signup.focus(); await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Create an account' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused();
    await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(signup).toBeFocused();
  }
});

test('signed-in Exam keeps status through reload and guarded Back, then restores Settings without changing progress', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context); await page.goto('/'); await signIn(page);
  await settings(page); await page.reload();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByRole('heading', { name: 'Account settings', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to attempt history' }).click();
  await expect(page).toHaveURL(/\/history$/); await page.reload();
  await expect(page.getByRole('heading', { name: 'Attempt history', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start exam', exact: true }).click();
  await page.getByRole('button', { name: 'Start Exam', exact: true }).click();
  await page.getByRole('radio').first().check(); await page.getByRole('button', { name: 'Flag for review' }).click();
  await expect(page.getByRole('button', { name: 'Flagged', exact: true })).toBeVisible();
  const saved = () => page.evaluate(() => localStorage.getItem('pcao-f:attempt:v1:' + JSON.parse(localStorage.getItem('pcao-f:attempt-ids:v1')!)[0]));
  const before = await saved();
  page.once('dialog', dialog => dialog.accept()); await page.reload();
  await expect(page.getByRole('heading', { name: 'Question 1 of 60', exact: true })).toBeVisible();
  await expect(page.getByRole('banner').getByText('alice@example.test', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Account settings', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toHaveCount(0);
  await page.goBack();
  const leave = page.getByRole('dialog', { name: 'Leave exam?' });
  await expect(leave).toBeVisible(); await leave.getByRole('button', { name: 'Stay in exam' }).click();
  expect(await saved()).toBe(before);
  await page.goBack(); await leave.getByRole('button', { name: 'Go to attempt history' }).click();
  await settings(page); expect(await saved()).toBe(before); expect(server.rows).toHaveLength(0);
  await page.getByRole('button', { name: 'Back to attempt history' }).click();
  await page.getByRole('button', { name: 'Resume attempt' }).click();
  await expect(page.getByRole('radio').first()).toBeChecked();
  expect(await saved()).toBe(before);
});

async function holdNextSignup(page: Page) {
  let start!: () => void, release!: () => void, finish!: () => void;
  const started = new Promise<void>(resolve => { start = resolve; });
  const gate = new Promise<void>(resolve => { release = resolve; });
  const done = new Promise<void>(resolve => { finish = resolve; });
  await page.route('**/auth/v1/signup', async route => {
    start(); await gate;
    try { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authFixture(route.request().postDataJSON().email)) }); }
    catch { /* A cancelled browser request may already be handled. */ }
    finally { finish(); }
  }, { times: 1 });
  return { started, release, done };
}
async function fillSignup(page: Page) {
  await page.getByRole('banner').getByRole('button', { name: 'Create account', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create an account' });
  await dialog.getByLabel('Email', { exact: true }).fill('new@example.test');
  await dialog.getByLabel('Password', { exact: true }).fill('synthetic-password');
  return dialog;
}
test('BUG-AUTH-001 rejects a@b before sending signup and allows correction', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context); await page.goto('/');
  const dialog = await fillSignup(page);
  await dialog.getByLabel('Email', { exact: true }).fill('a@b');
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('complete domain');
  expect(server.requests.filter(path => path.endsWith('/signup'))).toHaveLength(0);
  await dialog.getByLabel('Email', { exact: true }).fill('corrected@example.test');
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
});
for (const dismiss of ['Cancel', 'Close dialog', 'Escape'] as const) {
  test('BUG-AUTH-002 pending signup can close with '+dismiss+' across six layouts without a late session', async ({ page, context }) => {
    const server = mockAccountServer(); await server.attach(context); const attempt = await seedReport(page, 'cancelled-signup');
    const failures: string[] = []; page.on('requestfailed', request => { if (request.url().endsWith('/signup')) failures.push(request.failure()?.errorText ?? 'cancelled'); });
    for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1366, height: 900 }, { width: 844, height: 390 }, { width: 390, height: 844, enlarged: true }]) {
      await page.setViewportSize(viewport); await page.goto('/');
      if (viewport.enlarged) await page.addStyleTag({ content: 'html{font-size:24px!important}' });
      const held = await holdNextSignup(page); const dialog = await fillSignup(page);
      await dialog.getByRole('button', { name: 'Create account', exact: true }).click(); await held.started;
      await expect(dialog.getByRole('button', { name: 'Please wait…', exact: true })).toBeDisabled();
      await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeEnabled();
      await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeEnabled();
      const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, elements: Array.from(document.querySelectorAll('*')).filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => ({ tag: e.tagName, class: e.className, right: e.getBoundingClientRect().right })).slice(0,12) }));
      expect(overflow.scrollWidth <= overflow.width + 1, JSON.stringify(overflow)).toBe(true);
      if (dismiss === 'Cancel' && [390,1366].includes(viewport.width) && !viewport.enlarged) await page.screenshot({ path: 'screenshots/auth-pending-' + viewport.width + '.png' });
      if (dismiss === 'Escape') await page.keyboard.press('Escape');
      else await dialog.getByRole('button', { name: dismiss, exact: true }).click();
      await expect(dialog).toHaveCount(0);
      const opener = page.getByRole('banner').getByRole('button', { name: 'Create account', exact: true });
      await expect(opener).toBeFocused(); held.release(); await held.done;
      await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toHaveCount(0);
      expect(await page.evaluate(id => localStorage.getItem('pcao-f:attempt-owner:v1:' + id), attempt.id)).toBeNull();
      expect(server.rows).toHaveLength(0);
    }
    await expect.poll(() => failures.length).toBeGreaterThanOrEqual(6);
    await signIn(page);
    await expect(page.getByRole('banner').getByText('alice@example.test', { exact: true })).toBeVisible();
  });
}
test('BUG-AUTH-002 a hung signup times out with retained fields and can be retried', async ({ page, context }) => {
  const server = mockAccountServer(); await server.attach(context); await page.clock.install(); await page.goto('/');
  const held = await holdNextSignup(page); const dialog = await fillSignup(page);
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click(); await held.started;
  await page.clock.fastForward(31000);
  await expect(dialog.getByRole('alert')).toContainText('timed out');
  await expect(dialog.getByLabel('Email', { exact: true })).toHaveValue('new@example.test');
  await expect(dialog.getByLabel('Password', { exact: true })).toHaveValue('synthetic-password');
  await expect(dialog.getByRole('button', { name: 'Create account', exact: true })).toBeEnabled();
  await expect(dialog.getByRole('button', { name: 'Cancel', exact: true })).toBeEnabled();
  held.release(); await held.done;
  await dialog.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('banner').getByRole('link', { name: 'Account settings', exact: true })).toBeVisible();
});
