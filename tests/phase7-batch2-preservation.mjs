import fs from 'node:fs';
import { createHash } from 'node:crypto';
const out = 'test-results/guided-practice/phase-7-batch-2/';
const sha = x => createHash('sha256').update(x).digest('hex');
fs.mkdirSync(out, { recursive: true });
const manifest = out + 'preservation-before.json';
if (process.argv.includes('--check')) {
  const before = JSON.parse(fs.readFileSync(manifest,'utf8'));
  const changed = before.files.filter(f=>!fs.existsSync(f.path)||sha(fs.readFileSync(f.path))!==f.sha256);
  const result = { checkedAt:new Date().toISOString(),baselineSha256:sha(fs.readFileSync(manifest)),protectedFiles:before.files.length,changed,ok:!changed.length };
  fs.writeFileSync(out+'preservation-after.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result));
  if(changed.length) process.exitCode=1;
} else {
  if(fs.existsSync(manifest)) throw new Error('Refuse to replace before evidence');
  const previous=JSON.parse(fs.readFileSync('test-results/guided-practice/phase-7-batch-1/preservation-before.json','utf8'));
  const extras=['docs/guided-practice/content/intermediate-expansion/batch-1.md',
    'docs/guided-practice/content/intermediate-expansion/questions-only.md',
    'docs/guided-practice/PHASE-7-IMPLEMENTATION-PLAN.md','docs/guided-practice/PHASE-7-QUESTION-INVENTORY.md',
    'docs/guided-practice/PHASE-7-BATCH-1-REVIEW.md',...fs.readdirSync('test-results/guided-practice/phase-7-batch-1').map(n=>'test-results/guided-practice/phase-7-batch-1/'+n),
    'tests/phase7-authoring-baseline.mjs','tests/phase7-inventory.mjs','tests/phase7-batch1-authoring.mjs','tests/phase7-review-report.mjs'];
  const paths=[...new Set([...previous.files.map(f=>f.path),...extras])].sort();
  fs.writeFileSync(manifest,JSON.stringify({capturedAt:new Date().toISOString(),files:paths.map(p=>({path:p,sha256:sha(fs.readFileSync(p))}))},null,2)+'\n');
  for(const [name,p] of [['content-ledger','docs/guided-practice/PHASE-7-CONTENT-LEDGER.md'],
    ['source-ledger','docs/guided-practice/content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md'],
    ['batch1-test','tests/guidedPhase7Content.test.ts']]) fs.copyFileSync(p,out+name+'-before'+(name==='batch1-test'?'.ts':'.md'));
  console.log('Captured '+paths.length+' protected files and before copies of the three authorized evolving artifacts');
}
