// Metadata-only inventory audit. Does not assemble or persist a release/catalog.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {z} from 'zod';
const dir='docs/guided-practice/',out='test-results/guided-practice/phase-7-batch-5/',sha=x=>createHash('sha256').update(x).digest('hex');
const block=p=>{const m=[...fs.readFileSync(p,'utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];if(m.length!==1)throw new Error('One JSON block required: '+p);return JSON.parse(m[0][1]);};
const assert=(condition,message)=>{if(!condition)throw new Error(message);},same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const vite=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
try{
 const {validateQuestionBank}=await vite.ssrLoadModule('/src/domain/bankValidation.ts');
 const {questionFingerprint,guidanceDigest}=await vite.ssrLoadModule('/src/domain/guided/fingerprints.ts');
 const {guideEntrySchema,guidedItemSchema,sourceIdentitySchema,stableIdSchema,versionSchema}=await vite.ssrLoadModule('/src/domain/guided/schema.ts');
 const {productionCatalog}=await vite.ssrLoadModule('/src/domain/guided/catalog.ts');
 const draftSchema=z.strictObject({...guideEntrySchema.shape,approval:z.strictObject({status:z.literal('draft'),reviewId:stableIdSchema})});
 const tuples=[...([1,2].map(n=>({cohort:'accepted-pilot',number:n,path:dir+`content/intermediate-pilot/batch-${n}.md`,size:5}))),...[1,2,3,4,5].map(n=>({cohort:'phase-7-draft',number:n,path:dir+`content/intermediate-expansion/batch-${n}.md`,size:10}))];
 const documents=tuples.map(t=>({...t,data:z.strictObject({authoringFormatVersion:z.literal(1),batch:z.literal(t.number),source:sourceIdentitySchema,plannedGuideVersion:versionSchema,contentStatus:z.literal('draft'),questions:z.array(draftSchema).length(t.size)}).parse(block(t.path))}));
 const raw=fs.readFileSync('public/easy-question-bank.json'),validated=validateQuestionBank(JSON.parse(raw));assert(validated.ok,'Invalid bank');const bank=validated.bank;
 assert(sha(raw)==='f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4','Bank byte drift');
 const ledger=block(dir+'PHASE-7-CONTENT-LEDGER.md'),pilotLedger=block(dir+'content/intermediate-pilot/CONTENT-REVIEW-LEDGER.md'),inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md');
 const sourceLedgers={'accepted-pilot':block(dir+'content/intermediate-pilot/SOURCE-VERIFICATION-LEDGER.md'),'phase-7-draft':block(dir+'content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md')};
 const matrix=fs.readFileSync(dir+'content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md','utf8');
 const all=documents.flatMap(d=>d.data.questions.map(q=>({draft:q,document:d}))),ids=all.map(x=>x.draft.questionId);
 assert(ids.length===60&&new Set(ids).size===60&&same([...ids].sort(),bank.questions.map(q=>q.id).sort()),'Missing/duplicate/extra ID');
 assert(ledger.records.length===50&&pilotLedger.records.length===10&&ledger.newIndependentReviewWaiver===false,'Ledger/waiver boundary');
 const rows=[];
 for(const q of bank.questions){
  const {draft,document}=all.find(x=>x.draft.questionId===q.id),isPilot=document.cohort==='accepted-pilot',row=(isPilot?pilotLedger:ledger).records.find(r=>r.questionId===q.id);
  assert(row,'Missing ledger row');assert(same(document.data.source,inventory.source),'Source tuple drift');assert(document.data.plannedGuideVersion===(isPilot?'1.0.0':'1.1.0'),'Version changed');
  const domain=bank.domains.find(d=>d.id===q.primaryDomain),q1=await questionFingerprint(document.data.source,domain,q);assert(q1.ok,'q1 failed');
  assert(draft.sourceFingerprint===q1.value&&row.sourceFingerprint===q1.value,'q1 mismatch');assert(row.draftSha256===sha(JSON.stringify(draft)),'Draft SHA mismatch');
  const projected=guideEntrySchema.parse({...draft,approval:{...draft.approval,status:'approved'}}),digest=await guidanceDigest(document.data.source,document.data.plannedGuideVersion,projected);assert(digest.ok&&digest.value===row.prospectiveG1,'g1 mismatch');
  guidedItemSchema.parse({question:q,domain,guide:projected,guideDigest:digest.value});assert(!guideEntrySchema.safeParse(draft).success,'A draft passed approved-only schema');
  assert(same(draft.optionComparisons.map(o=>o.optionId),q.options.map(o=>o.id)),'Option coverage');assert(same(row.originalCorrectOptionIds,q.correctOptionIds),'Key changed');
  assert(draft.hints.length===3&&same(draft.sourceChecks.map(s=>s.sourceIndex),q.sources.map((_,i)=>i)),'Hint/source-index coverage');
  const refs=sourceLedgers[document.cohort].references.filter(r=>r.questionId===q.id);assert(refs.length===q.sources.length,'Reference occurrence count');
  for(const[i,s]of q.sources.entries()){const r=refs.find(r=>r.sourceIndex===i);assert(r&&r.courseTitle===s.courseTitle&&r.sectionHeading===s.sectionHeading&&r.url===s.url&&r.status==='ai-source-checked','Source provenance mismatch');}
  assert(row.approvedG1===null,'Actual approved digest set');
  let ownerAccepted=false,waiverApplies=false,versionChangeAltersG1=null;
  if(isPilot){
   const approval=row.finalOwnerApproval;assert(approval.status==='approved'&&approval.approvedDraftSha256===row.draftSha256&&approval.approvedG1===digest.value,'Pilot approval identity drift');
   assert(row.independentReview.status==='pending','Invented independent pilot review');for(const v of [row.draftSha256,q1.value,digest.value])assert(matrix.includes(v),'Approval matrix mismatch');
   const counterfactual=await guidanceDigest(document.data.source,'1.1.0',projected);assert(counterfactual.ok&&counterfactual.value!==digest.value,'Expected version sensitivity');versionChangeAltersG1=true;ownerAccepted=true;waiverApplies=true;
  }else{
   const planned=inventory.records.find(r=>r.questionId===q.id);assert(planned&&planned.plannedBatch===document.number&&planned.sourceFingerprint===q1.value,'Planned batch/q1 mismatch');
   assert(row.batch===document.number&&row.selectionCount===q.selectionCount&&row.guideVersion==='1.1.0','New ledger binding');
   for(const key of ['independentHumanReview','independentSourceReview','semanticHintReview','finalOwnerApproval'])assert(row[key]===null,'Invented new review');
  }
  rows.push({questionId:q.id,bankPosition:bank.questions.indexOf(q)+1,domain:q.primaryDomain,selectionCount:q.selectionCount,correctOptionIds:q.correctOptionIds,cohort:document.cohort,batch:document.number,document:document.path,guideVersion:document.data.plannedGuideVersion,reviewId:draft.approval.reviewId,sourceFingerprint:q1.value,draftSha256:row.draftSha256,prospectiveG1:digest.value,actualApprovedG1:null,ownerEducationallyAccepted:ownerAccepted,independentHumanReviewCompleted:false,pilotWaiverApplies:waiverApplies,hintCount:3,originalOptionCount:q.options.length,sourceReferences:refs.length,sourceCheckStatus:!isPilot&&document.number===5?'AI original passages inspected anew for Batch 5':'Prior AI-source-check evidence retained; not re-verified in this Batch 5 pass',versionOnlyChangeTo110AltersG1:versionChangeAltersG1});
 }
 const domains=Object.fromEntries(bank.domains.map(d=>[d.id,rows.filter(r=>r.domain===d.id).length])),selectionCounts=[1,2,3].map(n=>rows.filter(r=>r.selectionCount===n).length);
 assert(same(Object.values(domains),[8,13,7,10,7,9,6])&&same(selectionCounts,[48,10,2]),'Full totals mismatch');
 const batches=documents.filter(d=>d.cohort==='phase-7-draft').map(d=>({batch:d.number,ids:d.data.questions.map(q=>q.questionId),count:d.data.questions.length}));
 assert(same(batches.flatMap(b=>b.ids),inventory.records.map(r=>r.questionId)),'Fifty-row inventory partition mismatch');
 assert(productionCatalog.length===0,'Production catalog changed');
 const audit={checkedOn:'2026-10-18',scope:'Inventory and per-entry identity audit only; no release artifact or catalog constructed',bankSha256:sha(raw),source:inventory.source,totalUniqueIds:60,pilotGuides:10,newDraftGuides:50,omissions:[],duplicates:[],overlaps:[],domains,selectionCounts,batches,hints:rows.reduce((n,r)=>n+r.hintCount,0),optionComparisons:rows.reduce((n,r)=>n+r.originalOptionCount,0),pilotSourceReferences:sourceLedgers['accepted-pilot'].references.length,newSourceReferences:sourceLedgers['phase-7-draft'].references.length,ownerAcceptedPilot:10,ownerAcceptedExpansion:0,independentHumanReviewCompletions:0,pilotWaiverScope:'Exact existing ten pilot identities only',actualApprovedG1Count:0,productionCatalogEntries:0,phase7Complete:false,compatibility:{pilotVersion:'1.0.0',plannedFullVersion:'1.1.0',pilotVersionOnlyG1Changes:10,existingIdentitiesChanged:false,releaseIntegrationPerformed:false,limitation:'g1 binds guideVersion; preserving identical pilot prose at 1.1.0 would still create different digests requiring separate authorization/approval. Keep existing version/digest/frozen-item compatibility and explicit revocation rules in later release design.'},rows};
 assert(audit.hints===180&&audit.newSourceReferences===58&&audit.pilotSourceReferences===12,'Full coverage metrics');
 fs.writeFileSync(out+'sixty-item-inventory.json',JSON.stringify(audit,null,2)+'\n');console.log(JSON.stringify({ids:60,pilot:10,newDrafts:50,domains,selectionCounts,hints:audit.hints,options:audit.optionComparisons,references:audit.pilotSourceReferences+audit.newSourceReferences,existingPilotG1Preserved:10,versionChangeAltersPilotG1:10}));
}finally{await vite.close();}
