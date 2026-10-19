import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const dir='docs/guided-practice/',out='test-results/guided-practice/phase-7-batch-4/',sha=x=>createHash('sha256').update(x).digest('hex');
const statusPaths=['AGENTS.md','PROJECT_IMPLEMENTATION_STATUS.md',...['MASTER-PLAN','ARCHITECTURE','EXECUTION-CHECKLIST','VERIFICATION-MATRIX'].map(n=>dir+'GUIDED-PRACTICE-'+n+'.md')];
const baseline=JSON.parse(fs.readFileSync(out+'preservation-before.json','utf8'));
const statusEvidence=[];
for(const p of statusPaths){
 if(baseline.files.some(f=>f.path===p))throw new Error('Cannot edit protected document: '+p);
 const before=fs.readFileSync(p,'utf8');
 const reportLink=p.startsWith('docs/')?'PHASE-7-BATCH-4-REVIEW.md':dir+'PHASE-7-BATCH-4-REVIEW.md';
 const insert='\n\n**CURRENT — Phase 7 Batch 4 prepared (2026-10-18):** Owner technically accepts Batch 3 for continued drafting only; final educational approval of Batches 1–3 is not supplied. Exactly Q40/Q41/Q42/Q43/Q44/Q45/Q46/Q47/Q48/Q49 are new drafts: nine single/one two-response (Q42), D1–D7 1/2/1/2/2/1/1, exact Q41 table and Q47 fenced tree. All **12/12** references were newly inspected on seven original pages; combined source coverage is **48/48** for forty drafts. Independent human reviews **0/40**, final owner educational approvals **0/40**, all new approved digests null; the pilot waiver is not extended. Initial/final focused runs each pass **201/201** checks in ten files. All **200 protected files**, thirty prior content rows and thirty-six prior source records remain unchanged. ['+'Batch 4 review]('+reportLink+') records all identities, source/hint/option findings and artifact mutation checks. Stop for owner review; Batch 5 remains unauthored and unauthorized. Production stays disabled/catalog empty; no publication, deployment, commit/push or Phase 8. Accessibility/device and historical PDF/recovery/timing/resource-pressure release obligations remain outstanding. Earlier Batch 1–3-only authorization/count statements below are historical.';
 if(before.includes('**CURRENT — Phase 7 Batch 4 prepared'))continue;
 const first=before.indexOf('\n'),after=before.slice(0,first)+insert+before.slice(first);
 if(after.replace(insert,'')!==before)throw new Error('Historical text changed');
 fs.writeFileSync(p,after);statusEvidence.push({path:p,beforeSha256:sha(before),afterSha256:sha(after),priorTextRetainedExactly:true});
}
if(statusEvidence.length)fs.writeFileSync(out+'status-update-checks.json',JSON.stringify(statusEvidence,null,2)+'\n');
const files=[dir+'PHASE-7-BATCH-4-REVIEW.md',dir+'PHASE-7-CONTENT-LEDGER.md',dir+'content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md',dir+'content/intermediate-expansion/batch-4.md',dir+'content/intermediate-expansion/batch-4-questions-only.md'];
// Materialize the output target before validating the report's link to this check.
// The completed result replaces this progress marker after every assertion is evaluated.
fs.writeFileSync(out+'document-checks.json',JSON.stringify({status:'running'})+'\n');
const links=[];
for(const p of files){const text=fs.readFileSync(p,'utf8');for(const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
 const target=m[1];if(/^(?:https?:|#)/.test(target))continue;const resolved=path.resolve(path.dirname(p),target.split('#')[0]);
 links.push({from:p,target,exists:fs.existsSync(resolved)});
}}
const identities=JSON.parse(fs.readFileSync(out+'draft-identities.json','utf8')),report=fs.readFileSync(files[0],'utf8');
const checks={files:files.map(p=>({path:p,sha256:sha(fs.readFileSync(p))})),localLinks:links,identityTriplets:identities.map(r=>({questionId:r.questionId,reported:[r.reviewId,r.draftSha256,r.sourceFingerprint,r.prospectiveG1].every(v=>report.includes(v))})),statusHistoryRetained:JSON.parse(fs.readFileSync(out+'status-update-checks.json','utf8')).every(r=>r.priorTextRetainedExactly)};
checks.ok=links.every(l=>l.exists)&&checks.identityTriplets.every(r=>r.reported)&&checks.statusHistoryRetained;
fs.writeFileSync(out+'document-checks.json',JSON.stringify(checks,null,2)+'\n');console.log(JSON.stringify({documents:files.length,localLinks:links.length,identityTriplets:checks.identityTriplets.length,ok:checks.ok}));if(!checks.ok)process.exitCode=1;
