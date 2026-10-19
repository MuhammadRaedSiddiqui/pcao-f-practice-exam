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

const root=new URL('../',import.meta.url),dir='docs/guided-practice/',folder=dir+'content/intermediate-expansion/',out='test-results/guided-practice/phase-7-batch-4/';
const file=(p:string)=>readFileSync(new URL(p,root),'utf8');
const block=(p:string)=>{const b=[...file(p).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];if(b.length!==1)throw new Error('Expected one JSON block: '+p);return JSON.parse(b[0][1]);};
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const unwrap=<T>(r:{ok:true;value:T}|{ok:false;code:string}):T=>{if(!r.ok)throw new Error(r.code);return r.value;};
const draftSchema=z.strictObject({...guideEntrySchema.shape,approval:z.strictObject({status:z.literal('draft'),reviewId:stableIdSchema})});
const batch=z.strictObject({authoringFormatVersion:z.literal(1),batch:z.literal(4),source:sourceIdentitySchema,plannedGuideVersion:versionSchema,contentStatus:z.literal('draft'),questions:z.array(draftSchema).length(10)}).parse(block(folder+'batch-4.md'));
const previous=[1,2,3].map(n=>block(folder+`batch-${n}.md`));
const ledger=block(dir+'PHASE-7-CONTENT-LEDGER.md'),allSources=block(folder+'SOURCE-VERIFICATION-LEDGER.md'),inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md');
// Retain Batch 4's exact forty-eight-reference assertions as the shared ledger grows.
const sources={...allSources,references:allSources.references.filter((r:{batch?:number})=>r.batch===undefined||r.batch<=4)};
const beforeLedger=block(out+'content-ledger-before.md'),beforeSources=block(out+'source-ledger-before.md');
const parsed=validateQuestionBank(rawBank);if(!parsed.ok)throw new Error(parsed.errors.join('; '));
const bank=parsed.bank,ids=['Q40','Q41','Q42','Q43','Q44','Q45','Q46','Q47','Q48','Q49'],qs=bank.questions.filter(q=>ids.includes(q.id));
type Row={questionId:string;batch:number;plannedBatch?:number;sourceFingerprint:string;draftSha256:string|null;prospectiveG1:string|null;approvedG1:string|null;draftStatus:string};
const projection=(d:z.infer<typeof draftSchema>)=>guideEntrySchema.parse({...d,approval:{...d.approval,status:'approved'}});

describe('Phase 7 Batch 4 exact inventory and authoring boundary',()=>{
 it('matches authorized order/positions, domains, response types, bank identity and artifacts',()=>{
  expect(sha(readFileSync(new URL('public/easy-question-bank.json',root)))).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
  expect(batch.questions.map(q=>q.questionId)).toEqual(ids);expect(qs.map(q=>q.id)).toEqual(ids);expect(new Set(ids).size).toBe(10);
  const planned=inventory.records.filter((r:Row)=>r.plannedBatch===4);
  expect(planned.map((r:Row)=>r.questionId)).toEqual(ids);expect(planned.map((r:{bankPosition:number})=>r.bankPosition)).toEqual([40,41,42,43,44,45,46,47,48,49]);
  expect(qs.map(q=>bank.questions.indexOf(q)+1)).toEqual([40,41,42,43,44,45,46,47,48,49]);
  expect(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length)).toEqual([1,2,1,2,2,1,1]);
  expect([1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length)).toEqual([9,1,0]);expect(qs.filter(q=>q.selectionCount===2).map(q=>q.id)).toEqual(['Q42']);
  expect(qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id)).toEqual(['Q41']);expect(qs.filter(q=>q.stemMarkdown.includes('```')).map(q=>q.id)).toEqual(['Q47']);
  expect(batch.source).toEqual({schemaVersion:1,examId:bank.examId,bankVersion:bank.version,difficulty:'intermediate'});expect(batch.plannedGuideVersion).toBe('1.1.0');
  expect(unwrap(validateSource(rawBank,'intermediate')).source).toEqual(batch.source);expect(validateSource(rawBank,'advanced')).toEqual({ok:false,code:'version-mismatch'});
 });
 it('retains all thirty prior content rows, thirty-six source records and metadata as later authorized drafts append with approvals unset',()=>{
  expect(ledger.records).toHaveLength(50);expect(ledger.newIndependentReviewWaiver).toBe(true);
  expect(priorAuthoringFields(ledger.records.slice(0,30))).toEqual(priorAuthoringFields(beforeLedger.records.slice(0,30)));expect(sources.references.slice(0,36)).toEqual(beforeSources.references);
  for(const [key,value]of Object.entries(beforeSources))if(key!=='references')expect(sources[key]).toEqual(value);
  expect(ledger.records.filter((r:Row)=>r.draftSha256!==null&&r.batch<=4).map((r:Row)=>r.questionId)).toEqual([...previous.flatMap(b=>b.questions.map((q:{questionId:string})=>q.questionId)),...ids]);
  for(const r of ledger.records){
   expect(r.approvedG1).toBeNull();expect(r.independentHumanReview).toBeNull();expect(r.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});
   expect(r.draftStatus).toBe('unpublished draft; final owner educational acceptance recorded; separate independent-human-review requirement waived for this exact identity');expect(r.draftSha256).not.toBeNull();expect(r.prospectiveG1).not.toBeNull();
  }
 });
});
describe('Phase 7 Batch 4 guide/source integrity',()=>{
 it.each(batch.questions)('$questionId binds exact q1, SHA, prospective g1, options, source indices and draft metadata',async draft=>{
  const q=qs.find(q=>q.id===draft.questionId)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!,row=ledger.records.find((r:Row)=>r.questionId===q.id);
  const guide=projection(draft),q1=unwrap(await questionFingerprint(batch.source,domain,q)),digest=unwrap(await guidanceDigest(batch.source,'1.1.0',guide));
  expect(q1).toBe(draft.sourceFingerprint);expect(q1).toBe(inventory.records.find((r:Row)=>r.questionId===q.id).sourceFingerprint);
  expect(row).toMatchObject({batch:4,draftVersion:1,reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`,guideVersion:'1.1.0',sourceFingerprint:q1,draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,independentSourceReview:null,semanticHintReview:null});
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
 it('retains one hundred twenty distinct hints and forty reasonings with no surface key, arithmetic or filename disclosure',()=>{
  const all=[...previous.flatMap(b=>b.questions),...batch.questions];expect(new Set(all.flatMap(q=>q.hints)).size).toBe(120);expect(new Set(all.map(q=>q.reasoningMarkdown)).size).toBe(40);
  for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;for(const h of d.hints){
   expect(h).not.toMatch(/\b[A-E]\b|\d|\$|%/);expect(h).not.toMatch(/\b(?:correct answer|choose option|answer is)\b/i);
   for(const id of q.correctOptionIds)expect(h.toLowerCase()).not.toContain(q.options.find(o=>o.id===id)!.textMarkdown.toLowerCase());
  }}
  expect(batch.questions.find(d=>d.questionId==='Q47')!.hints.join(' ')).not.toMatch(/SKILL\.md|rename|guide\.md/i);
  // These checks support, but cannot certify, individual or cumulative semantic non-leakage.
 });
 it('binds all twelve newly inspected passages to exact original metadata and explicit provenance limits',()=>{
  expect(sources.references).toHaveLength(48);const refs=sources.references.filter((r:{batch?:number})=>r.batch===4);
  expect(refs).toHaveLength(12);expect(new Set(refs.map((r:{url:string;sectionHeading:string})=>r.url+'|'+r.sectionHeading)).size).toBe(12);expect(new Set(refs.map((r:{url:string})=>r.url)).size).toBe(7);
  for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;const rs=refs.filter((r:{questionId:string})=>r.questionId===q.id);expect(rs).toHaveLength(q.sources.length);
   for(const[i,s]of q.sources.entries()){const r=rs[i];expect(r).toMatchObject({...s,sourceIndex:i,status:'ai-source-checked',checkedOn:'2026-10-18',humanVerifiedBy:null,humanVerifiedAt:null});
    expect(r.supportingExcerpt.length).toBeGreaterThan(3);expect(r.supportingPassageSummary.length).toBeGreaterThan(10);expect(r.scopeLimit).toContain('frozen bank');expect(r.originalPassageLines[0]).toBeLessThan(r.originalPassageLines[1]);
    expect(d.sourceChecks[i].claim).toBe(r.claim);expect(d.sourceChecks[i].evidenceLocator).toContain('Batch 4');expect(d.sourceChecks[i].evidenceLocator).toContain(s.sectionHeading);expect(d.sourceChecks[i].evidenceLocator).toContain(s.url);
   }
  }
 });
 it('copies every complete original stem, option and source exactly into the solve-first file',()=>{
  const copy=file(folder+'batch-4-questions-only.md');for(const q of qs){
   const actual=copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];const expected=q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
   expect(actual?.trimEnd()).toBe(expected.trimEnd());expect(actual).not.toContain(q.explanationMarkdown);
  }
 });
 it('preserves Q41 headings, all rows/statuses/order and surrounding constraints, detecting meaningful table edits',async()=>{
  const q=qs.find(q=>q.id==='Q41')!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
  const exact=['| Test | Result |','| --- | --- |','| Normal month | Passed |','| Empty month | Not tried |','| Messy expense entries | Not tried |','| Unrelated short message | Not tried |'];
  expect(q.stemMarkdown.split('\n').filter(l=>l.startsWith('|'))).toEqual(exact);const copy=file(folder+'batch-4-questions-only.md').split('## Q41\n\n')[1].split('\n## ')[0];expect(copy).toContain(q.stemMarkdown);
  expect(copy.split('\n').filter(l=>l.startsWith('|'))).toEqual(exact);const fp=unwrap(await questionFingerprint(batch.source,domain,q));
  for(const stem of [q.stemMarkdown.replace(exact[3],''),q.stemMarkdown.replace('Test | Result','Case | Result'),q.stemMarkdown.replace('Empty month | Not tried','Empty month | Passed'),q.stemMarkdown.replace(exact[3]+'\n'+exact[4],exact[4]+'\n'+exact[3])]){
   expect(stem).not.toBe(q.stemMarkdown);expect(unwrap(await questionFingerprint(batch.source,domain,{...q,stemMarkdown:stem}))).not.toBe(fp);
  }
  const reason=batch.questions.find(d=>d.questionId==='Q41')!.reasoningMarkdown;expect(reason).toContain('Not tried means untested, not failed');for(const row of ['Normal month','Empty month','Messy expense entries','Unrelated short message'])expect(reason).toContain(row);
 });
 it('preserves Q47 raw and validated fenced tree including delimiters, language tag, indentation and names; all targeted mutations change q1',async()=>{
  const q=qs.find(q=>q.id==='Q47')!,raw=rawBank.questions.find(q=>q.id==='Q47')!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
  const exact='```text\nstock-summary/\n  guide.md\n```';expect(q.stemMarkdown).toBe(raw.stemMarkdown);expect(q.stemMarkdown.match(/^```text\n[\s\S]*?\n```/m)?.[0]).toBe(exact);
  const copy=file(folder+'batch-4-questions-only.md').split('## Q47\n\n')[1].split('\n## ')[0];expect(copy).toContain(q.stemMarkdown);expect(copy.match(/^```text\n[\s\S]*?\n```/m)?.[0]).toBe(exact);
  const fp=unwrap(await questionFingerprint(batch.source,domain,q));
  for(const artifact of [exact.replace('guide.md','SKILL.md'),exact.replace('stock-summary/','stock_summary/'),exact.replace('  guide.md','guide.md'),exact.replace('```text','```markdown'),exact.replaceAll('```','~~~')]){
   expect(artifact).not.toBe(exact);expect(unwrap(await questionFingerprint(batch.source,domain,{...q,stemMarkdown:q.stemMarkdown.replace(exact,artifact)}))).not.toBe(fp);
  }
  const reason=batch.questions.find(d=>d.questionId==='Q47')!.reasoningMarkdown;for(const term of ['stock-summary/','guide.md','SKILL.md','directory','frontmatter'])expect(reason).toContain(term);expect(reason).toContain('does not satisfy the exact main-file convention');
 });
 it('checks every key, Q42 complete complementary set, Q48 trigger arithmetic and distinct observations without inventing Q41 results',()=>{
  const keys:Record<string,string[]>={Q40:['A'],Q41:['C'],Q42:['B','E'],Q43:['B'],Q44:['D'],Q45:['C'],Q46:['A'],Q47:['D'],Q48:['B'],Q49:['C']};
  for(const q of qs){expect(q.correctOptionIds).toEqual(keys[q.id]);expect(q.selectionCount).toBe(keys[q.id].length);}expect(qs.reduce((n,q)=>n+q.options.length,0)).toBe(41);
  const set=batch.questions.find(d=>d.questionId==='Q42')!;expect(set.reasoningMarkdown).toContain('B and E');expect(set.reasoningMarkdown).toContain('B alone');expect(set.reasoningMarkdown).toContain('E alone');
  const reason=batch.questions.find(d=>d.questionId==='Q48')!.reasoningMarkdown;expect(46>40).toBe(true);expect(43>40).toBe(true);for(const value of ['46 > 40','43','70%','different observations','not a measured accuracy rate'])expect(reason).toContain(value);
 });
 it('rejects raw drafts and both ten/forty-entry prospective projections without populating production',async()=>{
  expect(productionCatalog).toEqual([]);const release={schemaVersion:1,fingerprintVersion:1,source:batch.source,guideVersion:'1.1.0',contentStatus:'reviewed',questions:batch.questions};
  expect(guideReleaseSchema.safeParse(release).success).toBe(false);expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
  expect(await validatePublishedRelease({...release,questions:batch.questions.map(projection)})).toEqual({ok:false,code:'not-published'});
  expect(await validatePublishedRelease({...release,questions:[...previous.flatMap(b=>b.questions),...batch.questions].map(projection)})).toEqual({ok:false,code:'not-published'});
 });
 it('preserves earlier content/evidence and verifies exact historical or authorized code hashes',()=>{
  const before=JSON.parse(file(out+'preservation-before.json'));expect(before.files.length).toBe(200);for(const f of before.files)expect(sha(readFileSync(new URL(f.path,root))),f.path).toBe(integrationPreservationHash(f.path, f.sha256));
 });
});
