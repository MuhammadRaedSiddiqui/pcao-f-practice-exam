import fs from 'node:fs';
import {createHash} from 'node:crypto';
const out='test-results/guided-practice/phase-7-batch-4/',sha=x=>createHash('sha256').update(x).digest('hex');
fs.mkdirSync(out,{recursive:true});const target=out+'preservation-before.json';
if(process.argv.includes('--check')){
 const before=JSON.parse(fs.readFileSync(target,'utf8')),changed=before.files.filter(f=>!fs.existsSync(f.path)||sha(fs.readFileSync(f.path))!==f.sha256);
 const r={checkedAt:new Date().toISOString(),baselineSha256:sha(fs.readFileSync(target)),protectedFiles:before.files.length,changed,ok:!changed.length};
 fs.writeFileSync(out+'preservation-after.json',JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));if(changed.length)process.exitCode=1;
}else{
 if(fs.existsSync(target))throw new Error('Refuse to overwrite baseline');
 const prev=JSON.parse(fs.readFileSync('test-results/guided-practice/phase-7-batch-3/preservation-before.json','utf8'));
 const extra=['docs/guided-practice/content/intermediate-expansion/batch-3.md','docs/guided-practice/content/intermediate-expansion/batch-3-questions-only.md','docs/guided-practice/PHASE-7-BATCH-3-REVIEW.md',
 'tests/phase7-batch3-preservation.mjs','tests/phase7-batch3-authoring.mjs','tests/phase7-batch3-report.mjs',...fs.readdirSync('test-results/guided-practice/phase-7-batch-3').map(n=>'test-results/guided-practice/phase-7-batch-3/'+n)];
 const paths=[...new Set([...prev.files.map(f=>f.path),...extra])].sort();
 fs.writeFileSync(target,JSON.stringify({capturedAt:new Date().toISOString(),files:paths.map(p=>({path:p,sha256:sha(fs.readFileSync(p))}))},null,2)+'\n');
 for(const[n,p]of [['content-ledger','docs/guided-practice/PHASE-7-CONTENT-LEDGER.md'],['source-ledger','docs/guided-practice/content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md'],
 ['batch1-test','tests/guidedPhase7Content.test.ts'],['batch2-test','tests/guidedPhase7Batch2Content.test.ts'],['batch3-test','tests/guidedPhase7Batch3Content.test.ts']])fs.copyFileSync(p,out+n+'-before'+(n.endsWith('-test')?'.ts':'.md'));
 console.log('Captured '+paths.length+' protected files and five evolving-artifact before copies');
}
