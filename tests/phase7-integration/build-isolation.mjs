import {build,loadConfigFromFile} from 'vite';
import fs from 'node:fs';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=process.cwd(),out=resolve(root,'test-results/guided-practice/phase-7-integration');
for(const key of Object.keys(process.env))if(key.startsWith('VITE_'))delete process.env[key];
const hash=x=>createHash('sha256').update(x).digest('hex'),record={previewBuildRejected:false,previewHostingRejected:false,outputs:[]};
await assert.rejects(loadConfigFromFile({command:'build',mode:'phase7-local'},resolve(root,'tests/phase7-integration/vite.config.ts'),root,'silent',undefined,'runner'),/unhosted loopback/);record.previewBuildRejected=true;
await assert.rejects(loadConfigFromFile({command:'serve',mode:'phase7-local',isPreview:true},resolve(root,'tests/phase7-integration/vite.config.ts'),root,'silent',undefined,'runner'),/unhosted loopback/);record.previewHostingRejected=true;
for(const enabled of [false,true]){
 const name=enabled?'ordinary-empty-build':'ordinary-disabled-build',folder=resolve(out,name);
 await build({root,configFile:resolve(root,'vite.config.ts'),configLoader:'runner',envDir:false,define:Object.fromEntries(Object.entries({VITE_GUIDED_PRACTICE_ENABLED:String(enabled),VITE_ACCOUNT_HISTORY_ENABLED:'false',VITE_PASSWORD_RECOVERY_ENABLED:'false',VITE_SUPABASE_URL:'',VITE_SUPABASE_PUBLISHABLE_KEY:'',VITE_POSTHOG_ENABLED:'false',VITE_POSTHOG_KEY:'',VITE_POSTHOG_HOST:''}).map(([k,v])=>['import.meta.env.'+k,JSON.stringify(v)])),build:{outDir:folder,emptyOutDir:true}});
 const files=[];const walk=p=>{for(const e of fs.readdirSync(p,{withFileTypes:true})){const next=resolve(p,e.name);if(e.isDirectory())walk(next);else{const bytes=fs.readFileSync(next),text=bytes.toString('utf8');for(const marker of ['gp7-intermediate-q','gp2-intermediate-q','virtual:phase7-catalog','Phase 7 — sixty-guide local candidate','d14-local-only.json'])assert(!text.includes(marker),'Excluded marker leaked: '+marker);files.push({path:relative(folder,next).replaceAll('\\','/'),sha256:hash(bytes)});}}};walk(folder);
 assert(!files.some(f=>/^(guided|tests|docs|test-results)\//.test(f.path)));
 assert.equal(hash(fs.readFileSync(resolve(folder,'easy-question-bank.json'))),'f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
 assert.equal(hash(fs.readFileSync(resolve(folder,'question-bank.json'))),'e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea');
 record.outputs.push({name,guidedEnabled:enabled,catalogEntries:0,externalServicesDisabled:true,files});
}
fs.writeFileSync(resolve(out,'build-isolation.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({...record,outputs:record.outputs.map(o=>({...o,files:o.files.length}))}));
