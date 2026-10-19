// Excluded verification tooling; writes only local evidence/build output.
import { build, loadConfigFromFile } from 'vite';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url));
const evidence=resolve(root,'test-results/guided-practice/local-pilot');
mkdirSync(evidence,{recursive:true});
// Do not load private .env files or inherit configured external service values.
for (const key of Object.keys(process.env)) if(key.startsWith('VITE_')) delete process.env[key];
const pins=JSON.parse(readFileSync(resolve(root,'tests/local-pilot/approved-identities.json'),'utf8').replace(/^\uFEFF/,''));
const record={ pilotBuildRejected:false, pilotPreviewRejected:false, nonLoopbackRejected:false, ordinaryBuildClean:false,
  hostingExclusion:false, artifacts:[], disabledPreview:false };
for (const isPreview of [false,true]) {
  await assert.rejects(loadConfigFromFile({command:isPreview?'serve':'build',mode:'d14-local',isPreview},
    resolve(root,'tests/local-pilot/vite.config.ts'),root,'silent',undefined,'runner'),/loopback development only/);
  if(isPreview) record.pilotPreviewRejected=true; else record.pilotBuildRejected=true;
}
const { createServer }=await import('vite');
await assert.rejects(createServer({configFile:resolve(root,'tests/local-pilot/vite.config.ts'),configLoader:'runner',
  mode:'d14-local',server:{host:'0.0.0.0'}}),/requires unproxied HTTP/);
record.nonLoopbackRejected=true;
const ignore=readFileSync(resolve(root,'.vercelignore'),'utf8').split(/\r?\n/);
assert(ignore.includes('tests/') && ignore.includes('test-results/') && ignore.includes('*.md'));
record.hostingExclusion=true;
const output=resolve(evidence,'ordinary-dist');
await build({root,configFile:resolve(root,'vite.config.ts'),configLoader:'runner',envFile:false,envDir:false,
  define:Object.fromEntries(Object.entries({VITE_GUIDED_PRACTICE_ENABLED:'false',VITE_ACCOUNT_HISTORY_ENABLED:'false',
    VITE_PASSWORD_RECOVERY_ENABLED:'false',VITE_SUPABASE_URL:'',VITE_SUPABASE_PUBLISHABLE_KEY:'',
    VITE_POSTHOG_ENABLED:'false',VITE_POSTHOG_KEY:'',VITE_POSTHOG_HOST:''}).map(([k,v])=>['import.meta.env.'+k,JSON.stringify(v)])),
  build:{outDir:output,emptyOutDir:true}});
const hash=value=>createHash('sha256').update(value).digest('hex');
const sentinels=[...pins.records.map(r=>r.reviewId),'d14-local-only.json','virtual:d14-local-pilot','D14 local pilot —'];
const walk=path=>{for(const entry of readdirSync(path,{withFileTypes:true})) {
  const file=resolve(path,entry.name);
  if(entry.isDirectory())walk(file);else {
    const bytes=readFileSync(file); const text=bytes.toString('utf8');
    for(const marker of sentinels)assert(!text.includes(marker),`pilot marker leaked: ${marker}`);
    record.artifacts.push({path:relative(output,file).replaceAll('\\','/'),sha256:hash(bytes)});
  }
}};
walk(output);
assert(!record.artifacts.some(a=>a.path.startsWith('guided/')||a.path.startsWith('tests/')||a.path.startsWith('docs/')));
assert.equal(hash(readFileSync(resolve(output,'easy-question-bank.json'))),pins.bankSha256);
assert.equal(hash(readFileSync(resolve(output,'question-bank.json'))),pins.advancedBankSha256);
record.ordinaryBuildClean=true;
// Preview this newly built ordinary artifact using the real browser, no external requests.
const { preview }=await import('vite'); const { chromium }=await import('@playwright/test');
const server=await preview({root,configFile:false,build:{outDir:output},preview:{host:'127.0.0.1',port:4257,strictPort:true}});
const browser=await chromium.launch();
try {
  const page=await browser.newPage();const outside=[];
  await page.route('**/*',route=>{if(new URL(route.request().url()).origin!=='http://127.0.0.1:4257'){outside.push(route.request().url());return route.abort();}return route.continue();});
  await page.goto('http://127.0.0.1:4257/');
  assert.equal(await page.getByRole('link',{name:'Open Guided Practice',exact:true}).count(),0);
  await page.goto('http://127.0.0.1:4257/guided');
  await page.getByRole('heading',{name:'Guided Practice unavailable',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Start practice',exact:true}).count(),0);
  assert.deepEqual(outside,[]); record.disabledPreview=true;
  await page.screenshot({path:resolve(evidence,'ordinary-disabled-preview.png'),fullPage:true});
} finally {await browser.close();await new Promise((resolve,reject)=>server.httpServer.close(error=>error?reject(error):resolve()));}
writeFileSync(resolve(evidence,'isolation-results.json'),JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify(record,null,2));
