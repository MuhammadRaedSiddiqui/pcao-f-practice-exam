import {test,expect} from '@playwright/test';
import {saved,startPractice} from '../guided-browser/helpers';
const origin='http://127.0.0.1:4258';
test.beforeEach(async({context})=>{await context.route('**/*',r=>new URL(r.request().url()).origin===origin?r.continue():r.abort());});
for(const [size,set]of [[5,0],[10,5]] as const)test(`real 1.1.0 ${size}-item lifecycle, resume, commitment and completion`,async({page})=>{
 await startPractice(page,size,set);const initial=await saved(page);expect(initial.guideVersion).toBe('1.1.0');expect(initial.items).toHaveLength(size);
 for(let index=0;index<size;index++){
  const item=initial.items[index],q=item.question;
  await expect(page.getByRole('heading',{name:`Question ${index+1} of ${size}`,exact:true})).toBeVisible();
  if(index===0){for(let hint=1;hint<=3;hint++)await page.getByRole('button',{name:`Hint ${hint}`,exact:true}).click();await page.reload();await expect(page.getByRole('heading',{name:`Question 1 of ${size}`,exact:true})).toBeVisible();expect((await saved(page)).responses[q.id].maxHintRevealed).toBe(3);}
  await expect(page.getByRole('button',{name:'Check answer',exact:true})).toBeDisabled();
  const inputs=page.locator('.guided-options input');expect(await inputs.first().getAttribute('type')).toBe(q.selectionCount===1?'radio':'checkbox');
  for(const id of q.correctOptionIds)await inputs.nth(q.options.findIndex((o:any)=>o.id===id)).check();
  if(index===0)await page.evaluate(async()=>{const w=window as any;w.phase7Held=false;w.phase7Lock=navigator.locks.request('pcao-f:attempt-storage:v1',()=>new Promise<void>(resolve=>{w.phase7Release=resolve;w.phase7Held=true;}));while(!w.phase7Held)await new Promise(r=>setTimeout(r,0));});
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  if(index===0){await expect(page.getByText('Saving progress…',{exact:true})).toBeVisible();await expect(page.locator('.guided-feedback')).toHaveCount(0);expect((await saved(page)).responses[q.id].commitment).toBeNull();await page.evaluate(async()=>{const w=window as any;w.phase7Release();await w.phase7Lock;});}
  await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();
  await expect(page.locator('.guided-comparison')).toHaveCount(q.options.length);expect((await saved(page)).responses[q.id].commitment).not.toBeNull();
  if(index<size-1)await page.getByRole('button',{name:'Next',exact:true}).click();
 }
 await page.getByRole('button',{name:'Finish practice',exact:true}).click();await expect(page.getByRole('heading',{name:'Practice completed',exact:true})).toBeVisible();
 const completed=await saved(page);await page.reload();await expect(page.getByRole('heading',{name:'Practice completed',exact:true})).toBeVisible();expect(await saved(page)).toEqual(completed);expect(completed.items).toEqual(initial.items);
});
test('sixty eligibility, twelve/five and six/ten sets; deterministic production current-row selection',async({page,request})=>{
 await page.goto('/guided');await expect(page.getByText('Intermediate · 60 questions with compatible approved guidance',{exact:true})).toBeVisible();
 await expect(page.getByLabel('Practice set',{exact:true}).locator('option')).toHaveCount(12);await page.getByLabel('Session length').selectOption('10');await expect(page.getByLabel('Practice set',{exact:true}).locator('option')).toHaveCount(6);
 const manifest=await(await request.get('/__phase7/manifest')).json();expect(manifest.records).toHaveLength(60);
 const loaded=await page.evaluate(async()=>{const url='/src/domain/guided/runtime.ts';const module=await import(url);const r=await module.loadPracticeSource(new AbortController().signal);return {version:r.value?.release.guideVersion,coverage:r.value?.coverage.items.length};});expect(loaded).toEqual({version:'1.1.0',coverage:60});
});
test('legacy 1.0.0 frozen feedback resumes without fetching old asset; safe maps permit compatible reader',async({page})=>{
 await page.goto('/guided');const old=await page.evaluate(async()=>{const url='/tests/phase7-integration/browser-fixtures.ts';const {legacySession}=await import(url);const s=await legacySession();const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('pcao-f-guided',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});await new Promise<void>((resolve,reject)=>{const tx=db.transaction('sessions','readwrite');tx.objectStore('sessions').put(s);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();return s;});
 let oldFetches=0;await page.route('**/guided/intermediate-1.0.0.json',r=>{oldFetches++;return r.fulfill({status:404,body:'missing'});});
 await page.goto('/guided/session/'+old.id);await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();expect(await saved(page)).toEqual(old);await page.reload();await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();expect(await saved(page)).toEqual(old);expect(oldFetches).toBe(0);
});
test('post-exam sixty-question All and flagged cardinalities preserve original report and PDF model',async({page})=>{
 await page.goto('/');const report=await page.evaluate(async()=>{const url='/tests/phase7-integration/browser-fixtures.ts';const {actualReport}=await import(url);const r=await actualReport();localStorage.setItem('pcao-f:attempt:v1:'+r.id,JSON.stringify(r));localStorage.setItem('pcao-f:attempt-ids:v1',JSON.stringify([r.id]));return r;});
 await page.reload();await page.getByRole('button',{name:'Open report',exact:true}).click();await expect(page.getByRole('heading',{name:'Your results',exact:true})).toBeVisible();
 const snapshot=await page.evaluate(async id=>{const url='/src/domain/reportExport.ts';const {buildResultReport}=await import(url);const raw=localStorage.getItem('pcao-f:attempt:v1:'+id)!;return {raw,pdf:buildResultReport(JSON.parse(raw))};},report.id);
 await page.getByRole('button',{name:'Guided Review',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Guided Review',exact:true});
 await expect(dialog.getByRole('status')).toHaveText('59 eligible · 59 matched · 0 unavailable');await dialog.getByLabel('Questions to retry').selectOption('flagged');await expect(dialog.getByRole('status')).toHaveText('2 eligible · 2 matched · 0 unavailable');
 await dialog.getByLabel('Questions to retry').selectOption('all');await expect(dialog.getByRole('status')).toHaveText('60 eligible · 60 matched · 0 unavailable');await dialog.getByRole('button',{name:'Start guided retry',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Question 1 of 60',exact:true})).toBeVisible();const s=await saved(page);expect(s.items).toHaveLength(60);expect(Object.values(s.responses).every((r:any)=>!r.commitment&&!r.maxHintRevealed&&!r.selectedOptionIds.length)).toBe(true);
 expect(await page.evaluate(async id=>{const url='/src/domain/reportExport.ts';const {buildResultReport}=await import(url);const raw=localStorage.getItem('pcao-f:attempt:v1:'+id)!;return {raw,pdf:buildResultReport(JSON.parse(raw))};},report.id)).toEqual(snapshot);
});
test('cross-tab durable hint reconciliation, actual source tables and original Mock gate',async({page,context})=>{
 const url=await startPractice(page,5,4);const second=await context.newPage();await second.goto(url);await expect(second.getByRole('heading',{name:'Question 1 of 5',exact:true})).toBeVisible();
 await page.bringToFront();await page.getByRole('button',{name:'Hint 1',exact:true}).click();const first=await saved(page);await second.bringToFront();await expect.poll(async()=>(await saved(second)).responses.Q21.maxHintRevealed).toBe(1);expect((await saved(second)).items).toEqual(first.items);
 await expect(second.locator('.guided-session table')).toHaveCount(1);await second.evaluate(()=>localStorage.setItem('pcao-f:attempt:v1:phase7-corrupt','{broken'));await second.reload();await expect(second.getByRole('heading',{name:'Guided Practice paused',exact:true})).toBeVisible();expect(await second.evaluate(()=>localStorage.getItem('pcao-f:attempt:v1:phase7-corrupt'))).toBe('{broken');await second.close();
});
test('missing/corrupt release is unavailable without fallback and preserves bank bytes',async({page,request})=>{
 await page.route('**/guided/intermediate-1.1.0.json',r=>r.fulfill({status:200,contentType:'text/html',body:'<html>not json</html>'}));await page.goto('/guided');await expect(page.getByRole('button',{name:'Start practice',exact:true})).toHaveCount(0);
 const response=await request.get('/easy-question-bank.json');expect(response.ok()).toBe(true);expect(await(await request.get('/docs/guided-practice/PHASE-7-CONTENT-LEDGER.md')).status()).toBe(403);
});
for(const width of [1366,390,320])test(`real Q52 table and feedback readable at ${width}px`,async({page},info)=>{
 await page.setViewportSize({width,height:900});await startPractice(page,10,5);await page.getByRole('button',{name:'Next',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Question 2 of 10',exact:true})).toBeVisible();await expect(page.locator('.guided-session table')).toHaveCount(1);
 const region=page.getByRole('region',{name:'Scrollable content table',exact:true});await region.screenshot({path:info.outputPath('q52-table-left.png')});
 const scroll=await region.evaluate(e=>({width:e.clientWidth,content:e.scrollWidth}));
 if(scroll.content>scroll.width){await region.evaluate(e=>{e.scrollLeft=e.scrollWidth;});expect(await region.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);await region.screenshot({path:info.outputPath('q52-table-right.png')});await region.evaluate(e=>{e.scrollLeft=0;});}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 const s=await saved(page),q=s.items[1].question;for(const id of q.correctOptionIds)await page.locator('.guided-options input').nth(q.options.findIndex((o:any)=>o.id===id)).check();await page.getByRole('button',{name:'Check answer',exact:true}).click();await expect(page.getByRole('heading',{name:/answer saved and locked/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('q52-feedback.png'),fullPage:true});
});
