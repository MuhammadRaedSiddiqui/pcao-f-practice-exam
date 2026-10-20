import { test, expect } from '@playwright/test';
import { saved, startPractice } from '../guided-browser/helpers';
import { pilotSets } from './prepare';

const allowedOrigin = 'http://127.0.0.1:4256';
let external: string[];
test.beforeEach(async ({ context }) => {
  external = [];
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin !== allowedOrigin) { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
});
test.afterEach(async () => { expect(external).toEqual([]); });

for (const [setIndex, ids] of pilotSets.entries()) test(`actual pilot Set ${setIndex+1}: all five real guides, hints, commitment, resume and summary`, async ({ page },info) => {
  const errors:string[]=[]; page.on('pageerror',error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button',{name:/sign in|sign up/i})).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Open Guided Practice',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Open Guided Practice',exact:true}).click();
  await expect(page.getByText('Intermediate · 10 questions with compatible approved guidance',{exact:true})).toBeVisible();
  await expect(page.getByLabel('Practice set',{exact:true}).locator('option')).toHaveCount(2);
  const manifest = await (await page.request.get('/__pilot/manifest')).json();
  expect(manifest.records.map((r:any)=>r.questionId)).toEqual(pilotSets.flat());
  await startPractice(page,5,setIndex);
  const initial = await saved(page);
  expect(initial.items.map((i:any)=>i.question.id)).toEqual(ids);
  const localBefore=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
  for (const [index,id] of ids.entries()) {
    const item=initial.items[index];
    await expect(page.getByRole('heading',{name:`Question ${index+1} of 5`,exact:true})).toBeVisible();
    expect(item.guide.sourceFingerprint).toBe(manifest.records.find((r:any)=>r.questionId===id).q1);
    expect(item.guideDigest).toBe(manifest.records.find((r:any)=>r.questionId===id).g1);
    await expect(page.locator('.exam-timer,[role="timer"]')).toHaveCount(0);
    await expect(page.locator('.guided-feedback')).toHaveCount(0);
    await expect(page.getByRole('heading',{name:'Sources',exact:true})).toHaveCount(0);
    if (item.question.stemMarkdown.includes('| ---')) await expect(page.locator('.guided-session table')).toBeVisible();
    await expect(page.locator('.guided-hint-toggle')).toHaveCount(3);
    await expect(page.getByRole('button',{name:'Hint 2',exact:true})).toBeDisabled();
    await expect(page.getByRole('button',{name:'Hint 3',exact:true})).toBeDisabled();
    const hintBox=await page.locator('.guided-hints').boundingBox();
    const choiceBox=await page.locator('.guided-options').boundingBox();
    expect(hintBox!.y+hintBox!.height).toBeLessThanOrEqual(choiceBox!.y);
    for (let hint=1;hint<=3;hint++) {
      await page.getByRole('button',{name:`Hint ${hint}`,exact:true}).click();
      await expect(page.locator('.guided-hint-toggle[aria-expanded="true"]')).toHaveCount(hint);
      expect((await saved(page)).responses[id].maxHintRevealed).toBe(hint);
      expect((await saved(page)).responses[id].commitment).toBeNull();
      await expect(page.locator('.guided-hint-content:not([hidden])')).toHaveCount(hint);
      const toggle=page.getByRole('button',{name:'Hint '+hint,exact:true});
      await expect(toggle).toHaveAttribute('aria-expanded','true');
      if(index===0) {
        const persisted=await saved(page);
        await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded','false');
        await expect(page.locator('.guided-hint-content').nth(hint-1)).toBeHidden();
        if(hint>1) await expect(page.getByRole('button',{name:'Hint 1',exact:true})).toHaveAttribute('aria-expanded','true');
        await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded','true');
        expect(await saved(page)).toEqual(persisted);
      }
      if (hint===1 && index===0) {
        await page.reload(); await expect(page.locator('.guided-hint-content:not([hidden])')).toHaveCount(0);
        await page.getByRole('button',{name:'Hint 1',exact:true}).click();
        await expect(page.locator('.guided-hint-content:not([hidden])')).toHaveCount(1);
      }
    }
    const controls=page.locator('.guided-options input');
    expect(await controls.first().getAttribute('type')).toBe(item.question.selectionCount===1?'radio':'checkbox');
    await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
    for (let choice=0;choice<item.question.selectionCount;choice++) {
      await controls.nth(choice).check();
      await expect(controls.nth(choice)).toBeEnabled();
    }
    const chosen=item.question.options.slice(0,item.question.selectionCount).map((o:any)=>o.id);
    if(index===0) {
      await page.getByRole('button',{name:'Next',exact:true}).click();
      await expect(page.getByRole('heading',{name:'Question 2 of 5',exact:true})).toBeVisible();
      await page.reload(); await expect(page.getByRole('heading',{name:'Question 2 of 5',exact:true})).toBeVisible();
      await page.getByRole('button',{name:'Previous',exact:true}).click();
      for(let c=0;c<chosen.length;c++) await expect(controls.nth(c)).toBeChecked();
    }
    // Hold the existing shared lock: feedback must wait for its real IDB commit.
    await page.evaluate(async()=>{
      const w=window as any; w.pilotHeld=false;
      w.pilotLock=navigator.locks.request('pcao-f:attempt-storage:v1',()=>new Promise<void>(resolve=>{w.releasePilotLock=resolve;w.pilotHeld=true;}));
      while(!w.pilotHeld) await new Promise(resolve=>setTimeout(resolve,0));
    });
    await page.getByRole('button',{name:'Check answer',exact:true}).click();
    await expect(page.getByText('Saving progress…',{exact:true})).toBeVisible();
    await expect(page.locator('.guided-feedback')).toHaveCount(0);
    expect((await saved(page)).responses[id].commitment).toBeNull();
    await page.evaluate(async()=>{const w=window as any;w.releasePilotLock();await w.pilotLock;});
    await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();
    const record=await saved(page); expect(record.responses[id].commitment).not.toBeNull();
    expect(record.responses[id].selectedOptionIds).toEqual(chosen);
    await expect(page.getByRole('heading',{name:'Decisive criteria',exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Compare every option',exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Vocabulary',exact:true})).toHaveCount(0);
    await expect(page.getByRole('heading',{name:/^Original explanation/})).toHaveCount(0);
    await expect(page.getByRole('heading',{name:'Sources',exact:true})).toBeVisible();
    await expect(page.locator('.guided-comparison')).toHaveCount(item.question.options.length);
    await expect(page.locator('.guided-options input')).toHaveCount(0);
    await page.reload(); await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();
    expect((await saved(page)).responses[id]).toEqual(record.responses[id]);
    if(index<4) { await page.getByRole('button',{name:'Next',exact:true}).click(); }
  }
  await page.getByRole('button',{name:'Finish practice',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Practice completed',exact:true})).toBeVisible();
  await page.reload(); await expect(page.getByRole('heading',{name:'Practice completed',exact:true})).toBeVisible();
  const final=await saved(page); expect(final.status).toBe('completed'); expect(final.items).toEqual(initial.items);
  await page.getByRole('button',{name:'Previous',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Question 4 of 5',exact:true})).toBeVisible();
  expect(await saved(page)).toEqual(final);
  expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)))).toEqual(localBefore);
  expect(errors).toEqual([]);
  await page.screenshot({path:info.outputPath('completed.png'),fullPage:true});
  await info.attach('artifact-and-session',{body:JSON.stringify({artifactId:manifest.artifactId,session:final},null,2),contentType:'application/json'});
});

test('real pilot retains fail-closed active-Mock protection and does not mutate original reports', async ({ page }) => {
  await page.goto('/guided');
  const records=await page.evaluate(async()=>{
    const path='/src/domain/attemptModel.ts'; const {createAttempt,submitAttempt}=await import(path);
    const bank=await (await fetch('/easy-question-bank.json')).json();
    const report=submitAttempt(createAttempt(bank,Date.now()-1000,'local-pilot-original-report'),Date.now());
    const active=createAttempt(bank,Date.now(),'local-pilot-active-mock');
    const records={
      ['pcao-f:attempt:v1:'+report.id]:JSON.stringify(report),
      ['pcao-f:attempt:v1:'+active.id]:JSON.stringify(active),
      'pcao-f:attempt-ids:v1':JSON.stringify([report.id,active.id]),
    };
    for(const [key,value] of Object.entries(records)) localStorage.setItem(key,value);
    return records;
  });
  await page.reload();
  await expect(page.getByRole('heading',{name:'Guided Practice paused',exact:true})).toBeVisible();
  await expect(page.getByText(/An unfinished Mock Exam is active/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Start practice',exact:true})).toHaveCount(0);
  expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)))).toMatchObject(records);
});
