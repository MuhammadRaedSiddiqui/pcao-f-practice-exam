import { integrationPreservationHash } from './normal-guided/preservation';
import { priorAuthoringFields } from './fixtures/phase7ApprovalComparison';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe,expect,it} from 'vitest';
import {z} from 'zod';
import rawBank from '../public/easy-question-bank.json';
import {validateQuestionBank} from '../src/domain/bank';
import {productionCatalog} from '../src/domain/guided/catalog';
import {questionFingerprint,guidanceDigest} from '../src/domain/guided/fingerprints';
import {validatePublishedRelease} from '../src/domain/guided/loader';
import {validateSource} from '../src/domain/guided/source';
import {guideEntrySchema,guidedItemSchema,guideReleaseSchema,sourceIdentitySchema,stableIdSchema,versionSchema,type GuideEntry} from '../src/domain/guided/schema';

const root=new URL('../',import.meta.url),dir='docs/guided-practice/',folder=dir+'content/intermediate-expansion/',out='test-results/guided-practice/phase-7-batch-5/';
const file=(p:string)=>readFileSync(new URL(p,root),'utf8');
const block=(p:string)=>{const b=[...file(p).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];if(b.length!==1)throw new Error('Expected one JSON block: '+p);return JSON.parse(b[0][1]);};
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const unwrap=<T>(r:{ok:true;value:T}|{ok:false;code:string}):T=>{if(!r.ok)throw new Error(r.code);return r.value;};
const draftSchema=z.strictObject({...guideEntrySchema.shape,approval:z.strictObject({status:z.literal('draft'),reviewId:stableIdSchema})});
const batch=z.strictObject({authoringFormatVersion:z.literal(1),batch:z.literal(5),source:sourceIdentitySchema,plannedGuideVersion:versionSchema,contentStatus:z.literal('draft'),questions:z.array(draftSchema).length(10)}).parse(block(folder+'batch-5.md'));
const previous=[1,2,3,4].map(n=>block(folder+`batch-${n}.md`));
const ledger=block(dir+'PHASE-7-CONTENT-LEDGER.md'),allSources=block(folder+'SOURCE-VERIFICATION-LEDGER.md'),inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md');
// All fifty expansion guides are now authored; shared source metadata is checked below.
const sources=allSources;
const beforeLedger=block(out+'content-ledger-before.md'),beforeSources=block(out+'source-ledger-before.md');
const parsed=validateQuestionBank(rawBank);if(!parsed.ok)throw new Error(parsed.errors.join('; '));
const bank=parsed.bank,ids=['Q50','Q51','Q52','Q53','Q54','Q55','Q56','Q57','Q58','Q60'],qs=bank.questions.filter(q=>ids.includes(q.id));
type Row={questionId:string;batch:number;plannedBatch?:number;sourceFingerprint:string;draftSha256:string|null;prospectiveG1:string|null;approvedG1:string|null;draftStatus:string};
const projection=(d:z.infer<typeof draftSchema>)=>guideEntrySchema.parse({...d,approval:{...d.approval,status:'approved'}});

describe('Phase 7 Batch 5 exact inventory and authoring boundary',()=>{
 it('matches authorized order/positions, domains, response types, bank identity and artifacts',()=>{
  expect(sha(readFileSync(new URL('public/easy-question-bank.json',root)))).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
  expect(batch.questions.map(q=>q.questionId)).toEqual(ids);expect(qs.map(q=>q.id)).toEqual(ids);expect(new Set(ids).size).toBe(10);
  const planned=inventory.records.filter((r:Row)=>r.plannedBatch===5);
  expect(planned.map((r:Row)=>r.questionId)).toEqual(ids);expect(planned.map((r:{bankPosition:number})=>r.bankPosition)).toEqual([50,51,52,53,54,55,56,57,58,60]);
  expect(qs.map(q=>bank.questions.indexOf(q)+1)).toEqual([50,51,52,53,54,55,56,57,58,60]);
  expect(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length)).toEqual([2,2,1,2,1,1,1]);
  expect([1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length)).toEqual([8,2,0]);expect(qs.filter(q=>q.selectionCount===2).map(q=>q.id)).toEqual(['Q50','Q54']);
  expect(qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id)).toEqual(['Q52','Q53','Q58']);expect(qs.filter(q=>q.stemMarkdown.includes('```')).map(q=>q.id)).toEqual([]);
  expect(batch.source).toEqual({schemaVersion:1,examId:bank.examId,bankVersion:bank.version,difficulty:'intermediate'});expect(batch.plannedGuideVersion).toBe('1.1.0');
  expect(unwrap(validateSource(rawBank,'intermediate')).source).toEqual(batch.source);expect(validateSource(rawBank,'advanced')).toEqual({ok:false,code:'version-mismatch'});
 });
 it('retains all forty prior content rows, forty-eight source records and metadata as later authorized drafts append with approvals unset',()=>{
  expect(ledger.records).toHaveLength(50);expect(ledger.newIndependentReviewWaiver).toBe(true);
  expect(priorAuthoringFields(ledger.records.slice(0,40))).toEqual(priorAuthoringFields(beforeLedger.records.slice(0,40)));expect(sources.references.slice(0,48)).toEqual(beforeSources.references);
  for(const [key,value]of Object.entries(beforeSources))if(key!=='references')expect(sources[key]).toEqual(value);
  expect(ledger.records.filter((r:Row)=>r.draftSha256!==null&&r.batch<=5).map((r:Row)=>r.questionId)).toEqual([...previous.flatMap(b=>b.questions.map((q:{questionId:string})=>q.questionId)),...ids]);
  for(const r of ledger.records){
   expect(r.approvedG1).toBeNull();expect(r.independentHumanReview).toBeNull();expect(r.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});
   expect(r.draftStatus).toBe('unpublished draft; final owner educational acceptance recorded; separate independent-human-review requirement waived for this exact identity');expect(r.draftSha256).not.toBeNull();expect(r.prospectiveG1).not.toBeNull();
  }
 });
});
describe('Phase 7 Batch 5 guide/source integrity',()=>{
 it.each(batch.questions)('$questionId binds exact q1, SHA, prospective g1, options, source indices and draft metadata',async draft=>{
  const q=qs.find(q=>q.id===draft.questionId)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!,row=ledger.records.find((r:Row)=>r.questionId===q.id);
  const guide=projection(draft),q1=unwrap(await questionFingerprint(batch.source,domain,q)),digest=unwrap(await guidanceDigest(batch.source,'1.1.0',guide));
  expect(q1).toBe(draft.sourceFingerprint);expect(q1).toBe(inventory.records.find((r:Row)=>r.questionId===q.id).sourceFingerprint);
  expect(row).toMatchObject({batch:5,draftVersion:1,reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`,guideVersion:'1.1.0',sourceFingerprint:q1,draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,independentSourceReview:null,semanticHintReview:null});
  expect(guidedItemSchema.safeParse({question:q,domain,guide,guideDigest:digest}).success).toBe(true);
  expect(draft.optionComparisons.map(o=>o.optionId)).toEqual(q.options.map(o=>o.id));expect(draft.sourceChecks.map(s=>s.sourceIndex)).toEqual(q.sources.map((_,i)=>i));expect(draft.vocabulary.length).toBeGreaterThan(0);expect(draft.hints).toHaveLength(3);
  expect(draftSchema.safeParse({...draft,hints:draft.hints.slice(0,2)}).success).toBe(false);expect(guideEntrySchema.safeParse(draft).success).toBe(false);
  expect(await guidanceDigest(batch.source,'1.1.0',draft as unknown as GuideEntry)).toEqual({ok:false,code:'invalid-release'});
  const reverse=(v:unknown):unknown=>Array.isArray(v)?v.map(reverse):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reverse(x)])):v;
  expect(unwrap(await guidanceDigest(batch.source,'1.1.0',reverse(guide) as GuideEntry))).toBe(digest);expect(sha(JSON.stringify(JSON.parse(JSON.stringify(draft))))).toBe(row.draftSha256);
  for(const field of ['hints','approval']as const){const changed=structuredClone(guide);if(field==='hints')changed.hints[0]+=' Changed.';else changed.approval.reviewId+='-changed';expect(unwrap(await guidanceDigest(batch.source,'1.1.0',changed))).not.toBe(digest);}
  expect(unwrap(await guidanceDigest(batch.source,'1.1.1',guide))).not.toBe(digest);expect(unwrap(await questionFingerprint({...batch.source,bankVersion:'1.0.1'},domain,q))).not.toBe(q1);
  expect(unwrap(await guidanceDigest({...batch.source,bankVersion:'1.0.1'},'1.1.0',guide))).not.toBe(digest);
  const changedDraft=structuredClone(draft);changedDraft.hints[0]+=' Changed.';expect(sha(JSON.stringify(changedDraft))).not.toBe(row.draftSha256);
  const incomplete=structuredClone(guide);incomplete.optionComparisons.pop();expect(guidedItemSchema.safeParse({question:q,domain,guide:incomplete,guideDigest:digest}).success).toBe(false);
 });
 it('retains one hundred fifty distinct hints and fifty reasonings with no surface key or arithmetic disclosure',()=>{
  const all=[...previous.flatMap(b=>b.questions),...batch.questions];expect(new Set(all.flatMap(q=>q.hints)).size).toBe(150);expect(new Set(all.map(q=>q.reasoningMarkdown)).size).toBe(50);
  for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;for(const h of d.hints){
   expect(h).not.toMatch(/\b[A-E]\b|\d|\$|%/);expect(h).not.toMatch(/\b(?:correct answer|choose option|answer is)\b/i);
   for(const id of q.correctOptionIds)expect(h.toLowerCase()).not.toContain(q.options.find(o=>o.id===id)!.textMarkdown.toLowerCase());
  }}
  // These checks support, but cannot certify, individual or cumulative semantic non-leakage.
 });
 it('binds all ten newly inspected passages to exact original metadata and explicit provenance limits',()=>{
  expect(sources.references).toHaveLength(58);const refs=sources.references.filter((r:{batch?:number})=>r.batch===5);
  expect(refs).toHaveLength(10);expect(new Set(refs.map((r:{url:string;sectionHeading:string})=>r.url+'|'+r.sectionHeading)).size).toBe(10);expect(new Set(refs.map((r:{url:string})=>r.url)).size).toBe(7);
  for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;const rs=refs.filter((r:{questionId:string})=>r.questionId===q.id);expect(rs).toHaveLength(q.sources.length);
   for(const[i,s]of q.sources.entries()){const r=rs[i];expect(r).toMatchObject({...s,sourceIndex:i,status:'ai-source-checked',checkedOn:'2026-10-18',humanVerifiedBy:null,humanVerifiedAt:null});
    expect(r.supportingExcerpt.length).toBeGreaterThan(3);expect(r.supportingPassageSummary.length).toBeGreaterThan(10);expect(r.scopeLimit).toContain('frozen bank');expect(r.originalPassageLines[0]).toBeLessThan(r.originalPassageLines[1]);
    expect(d.sourceChecks[i].claim).toBe(r.claim);expect(d.sourceChecks[i].evidenceLocator).toContain('Batch 5');expect(d.sourceChecks[i].evidenceLocator).toContain(s.sectionHeading);expect(d.sourceChecks[i].evidenceLocator).toContain(s.url);
   }
  }
 });
 it('copies every complete original stem, option and source exactly into the solve-first file',()=>{
  const copy=file(folder+'batch-5-questions-only.md');for(const q of qs){
   const actual=copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];const expected=q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
   expect(actual?.trimEnd()).toBe(expected.trimEnd());expect(actual).not.toContain(q.explanationMarkdown);
  }
 });
 it.each(['Q52','Q53','Q58'])('%s retains every original table cell/alignment/order and surrounding stem, detecting targeted mutations',async id=>{
  const q=qs.find(q=>q.id===id)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
  const tables:Record<string,string[]>={
   Q52:['| Copy | Location |','| --- | --- |','| Draft | Temporary task workspace |','| Finished report | Permanent assistant-account storage |','| Firm’s document folder | No report copy |'],
   Q53:['| Step | What happens |','| --- | --- |','| Draft | Prepare proposed wording for review |','| Approve | Decide whether the amendment is acceptable |','| Release | Sign and send the agreed amendment |'],
   Q58:['| Week | Attendees |','| --- | ---: |','| Before reminders | 40 |','| After reminders | 50 |']
  };
  const rows=tables[id];expect(q.stemMarkdown).toBe(rawBank.questions.find(q=>q.id===id)!.stemMarkdown);expect(q.stemMarkdown.split('\n').filter(l=>l.startsWith('|'))).toEqual(rows);
  const copy=file(folder+'batch-5-questions-only.md').split(`## ${id}\n\n`)[1].split('\n## ')[0];expect(copy).toContain(q.stemMarkdown);expect(copy.split('\n').filter(l=>l.startsWith('|'))).toEqual(rows);
  const changedValue:Record<string,[string,string]>={Q52:['Permanent assistant-account storage','Temporary task workspace'],Q53:['Decide whether the amendment is acceptable','Automatically accept the amendment'],Q58:['| After reminders | 50 |','| After reminders | 49 |']};
  const fp=unwrap(await questionFingerprint(batch.source,domain,q));
  for(const stem of [q.stemMarkdown.replace(rows[2],''),q.stemMarkdown.replace(rows[0],rows[0].replace(id==='Q52'?'Copy':id==='Q53'?'Step':'Week','Changed heading')),q.stemMarkdown.replace(rows[2]+'\n'+rows[3],rows[3]+'\n'+rows[2]),q.stemMarkdown.replace(...changedValue[id]),q.stemMarkdown.replace(rows[1],id==='Q58'?'| --- | --- |':'| --- | ---: |')]){
   expect(stem).not.toBe(q.stemMarkdown);expect(unwrap(await questionFingerprint(batch.source,domain,{...q,stemMarkdown:stem}))).not.toBe(fp);
  }
 });
 it('checks all original keys, both complementary selection sets, categorical table reasoning and the observation/inference boundary',()=>{
  const keys:Record<string,string[]>={Q50:['A','D'],Q51:['B'],Q52:['C'],Q53:['D'],Q54:['C','E'],Q55:['B'],Q56:['D'],Q57:['C'],Q58:['C'],Q60:['A']};
  for(const q of qs){expect(q.correctOptionIds).toEqual(keys[q.id]);expect(q.selectionCount).toBe(keys[q.id].length);}expect(qs.reduce((n,q)=>n+q.options.length,0)).toBe(42);
  for(const[id,pair,first,second]of [['Q50','A and D','A alone','D alone'],['Q54','C and E','C alone','E alone']]){const reason=batch.questions.find(d=>d.questionId===id)!.reasoningMarkdown;for(const value of [pair,first,second])expect(reason).toContain(value);}
  const reason=batch.questions.find(d=>d.questionId==='Q58')!.reasoningMarkdown;expect(50-40).toBe(10);expect(reason).toContain('50 − 40 = 10');expect(reason).toContain('neither proves nor disproves a reminder effect');
  for(const phrase of ['Draft / Temporary task workspace','Finished report / Permanent assistant-account storage','Firm’s document folder / No report copy'])expect(batch.questions.find(d=>d.questionId==='Q52')!.reasoningMarkdown).toContain(phrase);
  for(const phrase of ['AI prepares wording as a reversible input','manager judges','signed Release remains human-owned'])expect(batch.questions.find(d=>d.questionId==='Q53')!.reasoningMarkdown).toContain(phrase);
 });
 it('rejects all raw new drafts via approved-only contracts and the ten prospective entries via the actual empty catalog',async()=>{
  expect(productionCatalog).toEqual([]);for(const d of [...previous.flatMap(b=>b.questions),...batch.questions])expect(guideEntrySchema.safeParse(d).success).toBe(false);
  const release={schemaVersion:1,fingerprintVersion:1,source:batch.source,guideVersion:'1.1.0',contentStatus:'reviewed',questions:batch.questions};
  expect(guideReleaseSchema.safeParse(release).success).toBe(false);expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
  expect(await validatePublishedRelease({...release,questions:batch.questions.map(projection)})).toEqual({ok:false,code:'not-published'});
  // No combined sixty-entry release is constructed by the inventory audit.
 });
 it('verifies 223 captured files against historical or exact authorized normal-app code pins',()=>{
  const before=JSON.parse(file(out+'preservation-before.json'));expect(before.files.length).toBe(223);for(const f of before.files)expect(sha(readFileSync(new URL(f.path,root))),f.path).toBe(integrationPreservationHash(f.path, f.sha256));
 });
});

const audit=JSON.parse(file(out+'sixty-item-inventory.json'));
type AuditRow={questionId:string;bankPosition:number;domain:string;selectionCount:number;cohort:string;batch:number;document:string;guideVersion:string;reviewId:string;sourceFingerprint:string;draftSha256:string;prospectiveG1:string;actualApprovedG1:null;pilotWaiverApplies:boolean;ownerEducationallyAccepted:boolean};
const pilotLedger=block(dir+'content/intermediate-pilot/CONTENT-REVIEW-LEDGER.md'),pilotSources=block(dir+'content/intermediate-pilot/SOURCE-VERIFICATION-LEDGER.md');
describe('All sixty Intermediate entries — inventory, existing identities and approval boundaries only',()=>{
 it('reconciles exact sixty unique bank IDs, ordered fifty-item partitions, domains, response types and total coverage',()=>{
  expect(audit.totalUniqueIds).toBe(60);expect(audit.rows.map((r:AuditRow)=>r.questionId)).toEqual(bank.questions.map(q=>q.id));expect(new Set(audit.rows.map((r:AuditRow)=>r.questionId)).size).toBe(60);
  expect(audit.omissions).toEqual([]);expect(audit.duplicates).toEqual([]);expect(audit.overlaps).toEqual([]);
  expect(audit.batches.map((b:{count:number})=>b.count)).toEqual([10,10,10,10,10]);expect(audit.batches.flatMap((b:{ids:string[]})=>b.ids)).toEqual(inventory.records.map((r:Row)=>r.questionId));
  expect(Object.values(audit.domains)).toEqual([8,13,7,10,7,9,6]);expect([1,2,3].map(n=>bank.questions.filter(q=>q.selectionCount===n).length)).toEqual([48,10,2]);expect(audit.selectionCounts).toEqual([48,10,2]);
  expect(audit.hints).toBe(180);expect(audit.optionComparisons).toBe(252);expect(audit.optionComparisons).toBe(bank.questions.reduce((n,q)=>n+q.options.length,0));expect(audit.pilotSourceReferences).toBe(12);expect(audit.newSourceReferences).toBe(58);
 });
 it('separates ten accepted pilot versions/waiver from fifty unapproved new drafts and records no release integration or completion',()=>{
  expect(audit.pilotGuides).toBe(10);expect(audit.newDraftGuides).toBe(50);expect(audit.ownerAcceptedPilot).toBe(10);expect(audit.ownerAcceptedExpansion).toBe(0);expect(audit.independentHumanReviewCompletions).toBe(0);expect(audit.actualApprovedG1Count).toBe(0);
  expect(audit.rows.filter((r:AuditRow)=>r.pilotWaiverApplies).map((r:AuditRow)=>r.questionId)).toEqual(['Q4','Q5','Q6','Q10','Q12','Q18','Q25','Q26','Q33','Q59']);
  expect(ledger.newIndependentReviewWaiver).toBe(true);expect(audit.productionCatalogEntries).toBe(0);expect(productionCatalog).toEqual([]);expect(audit.phase7Complete).toBe(false);expect(audit.compatibility.existingIdentitiesChanged).toBe(false);expect(audit.compatibility.releaseIntegrationPerformed).toBe(false);
 });
 it.each(audit.rows as AuditRow[])('$questionId independently recomputes the recorded source, draft and existing-version g1 and full option/source coverage',async r=>{
  const document=block(r.document),draft=draftSchema.parse(document.questions.find((d:{questionId:string})=>d.questionId===r.questionId)),q=bank.questions.find(q=>q.id===r.questionId)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!,pilot=r.cohort==='accepted-pilot',row=(pilot?pilotLedger:ledger).records.find((r:Row)=>r.questionId===q.id);
  expect(r.bankPosition).toBe(bank.questions.indexOf(q)+1);expect(r.domain).toBe(q.primaryDomain);expect(r.selectionCount).toBe(q.selectionCount);expect(document.source).toEqual(batch.source);expect(r.guideVersion).toBe(pilot?'1.0.0':'1.1.0');expect(document.plannedGuideVersion).toBe(r.guideVersion);
  const q1=unwrap(await questionFingerprint(document.source,domain,q)),guide=projection(draft),g1=unwrap(await guidanceDigest(document.source,r.guideVersion,guide));
  expect(r.sourceFingerprint).toBe(q1);expect(row.sourceFingerprint).toBe(q1);expect(draft.sourceFingerprint).toBe(q1);expect(r.draftSha256).toBe(sha(JSON.stringify(draft)));expect(row.draftSha256).toBe(r.draftSha256);expect(r.prospectiveG1).toBe(g1);expect(row.prospectiveG1).toBe(g1);expect(r.reviewId).toBe(draft.approval.reviewId);
  expect(guidedItemSchema.safeParse({question:q,domain,guide,guideDigest:g1}).success).toBe(true);expect(draft.hints).toHaveLength(3);expect(draft.optionComparisons.map(o=>o.optionId)).toEqual(q.options.map(o=>o.id));expect(draft.sourceChecks.map(s=>s.sourceIndex)).toEqual(q.sources.map((_,i)=>i));expect(row.originalCorrectOptionIds).toEqual(q.correctOptionIds);
  const refs=(pilot?pilotSources:sources).references.filter((x:{questionId:string})=>x.questionId===q.id);expect(refs).toHaveLength(q.sources.length);for(const[i,s]of q.sources.entries())expect(refs.find((x:{sourceIndex:number})=>x.sourceIndex===i)).toMatchObject({...s,status:'ai-source-checked'});
  expect(draft.approval.status).toBe('draft');expect(row.approvedG1).toBeNull();expect(r.actualApprovedG1).toBeNull();expect(r.pilotWaiverApplies).toBe(pilot);expect(r.ownerEducationallyAccepted).toBe(pilot);
  if(pilot){expect(row.finalOwnerApproval).toMatchObject({status:'approved',approvedDraftSha256:r.draftSha256,approvedG1:g1});expect(row.independentReview.status).toBe('pending');}
  else{expect(row.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});expect(row.independentHumanReview).toBeNull();expect(row.independentSourceReview).toBeNull();expect(row.semanticHintReview).toBeNull();expect(r.batch).toBe(inventory.records.find((x:Row)=>x.questionId===q.id).plannedBatch);}
 });
 it('demonstrates that version-only promotion would change each pilot g1 without editing or persisting any changed pilot identity',async()=>{
  expect(audit.compatibility).toMatchObject({pilotVersion:'1.0.0',plannedFullVersion:'1.1.0',pilotVersionOnlyG1Changes:10});
  for(const r of (audit.rows as AuditRow[]).filter(r=>r.cohort==='accepted-pilot')){const document=block(r.document),draft=draftSchema.parse(document.questions.find((q:{questionId:string})=>q.questionId===r.questionId));expect(unwrap(await guidanceDigest(document.source,'1.1.0',projection(draft)))).not.toBe(r.prospectiveG1);expect(document.plannedGuideVersion).toBe('1.0.0');}
 });
});
