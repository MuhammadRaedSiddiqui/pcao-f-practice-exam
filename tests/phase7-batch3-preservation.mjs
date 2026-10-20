import fs from 'node:fs';
import {createHash} from 'node:crypto';
const out='test-results/guided-practice/phase-7-batch-3/';
const sha=x=>createHash('sha256').update(x).digest('hex');
fs.mkdirSync(out,{recursive:true});
const target=out+'preservation-before.json';
if(process.argv.includes('--check')){
  const before=JSON.parse(fs.readFileSync(target,'utf8'));
  const changed=before.files.filter(f=>!fs.existsSync(f.path)||sha(fs.readFileSync(f.path))!==f.sha256);
  const result={checkedAt:new Date().toISOString(),baselineSha256:sha(fs.readFileSync(target)),protectedFiles:before.files.length,changed,ok:changed.length===0};
  fs.writeFileSync(out+'preservation-after.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(changed.length)process.exitCode=1;
}else{
  if(fs.existsSync(target))throw new Error('Refuse to overwrite before manifest');
  const previous=JSON.parse(fs.readFileSync('test-results/guided-practice/phase-7-batch-2/preservation-before.json','utf8'));
  const extra=['docs/guided-practice/content/intermediate-expansion/batch-2.md','docs/guided-practice/content/intermediate-expansion/batch-2-questions-only.md',
    'docs/guided-practice/PHASE-7-BATCH-2-REVIEW.md','tests/phase7-batch2-preservation.mjs','tests/phase7-batch2-authoring.mjs','tests/phase7-batch2-report.mjs',
    ...fs.readdirSync('test-results/guided-practice/phase-7-batch-2').map(n=>'test-results/guided-practice/phase-7-batch-2/'+n)];
  const paths=[...new Set([...previous.files.map(f=>f.path),...extra])].sort();
  fs.writeFileSync(target,JSON.stringify({capturedAt:new Date().toISOString(),files:paths.map(p=>({path:p,sha256:sha(fs.readFileSync(p))}))},null,2)+'\n');
  for(const[name,p]of[['content-ledger','docs/guided-practice/PHASE-7-CONTENT-LEDGER.md'],['source-ledger','docs/guided-practice/content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md'],
    ['batch1-test','tests/guidedPhase7Content.test.ts'],['batch2-test','tests/guidedPhase7Batch2Content.test.ts']])fs.copyFileSync(p,out+name+'-before'+(name.endsWith('-test')?'.ts':'.md'));
  console.log('Captured '+paths.length+' protected file hashes plus evolving-ledger/test before copies');
}
