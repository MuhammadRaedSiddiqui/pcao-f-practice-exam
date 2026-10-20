import { integrationPreservationHash } from './normal-guided/preservation';
import { priorAuthoringFields } from './fixtures/phase7ApprovalComparison';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import original from '../public/easy-question-bank.json';
import { validateQuestionBank } from '../src/domain/bank';
import { productionCatalog } from '../src/domain/guided/catalog';
import { questionFingerprint, guidanceDigest } from '../src/domain/guided/fingerprints';
import { validatePublishedRelease } from '../src/domain/guided/loader';
import { validateSource } from '../src/domain/guided/source';
import { guideEntrySchema, guidedItemSchema, guideReleaseSchema, sourceIdentitySchema,
  stableIdSchema, versionSchema, type GuideEntry } from '../src/domain/guided/schema';

const root=new URL('../',import.meta.url);
const file=(p:string)=>readFileSync(new URL(p,root),'utf8');
const json=(p:string)=>{
  const blocks=[...file(p).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];
  if(blocks.length!==1) throw new Error('Expected one authoritative JSON block: '+p);
  return JSON.parse(blocks[0][1]);
};
const dir='docs/guided-practice/', folder=dir+'content/intermediate-expansion/';
const evidence='test-results/guided-practice/phase-7-batch-2/';
const draftSchema=z.strictObject({...guideEntrySchema.shape,approval:z.strictObject({status:z.literal('draft'),reviewId:stableIdSchema})});
const batch=z.strictObject({authoringFormatVersion:z.literal(1),batch:z.literal(2),source:sourceIdentitySchema,
  plannedGuideVersion:versionSchema,contentStatus:z.literal('draft'),questions:z.array(draftSchema).length(10)}).parse(json(folder+'batch-2.md'));
const first=json(folder+'batch-1.md');
const ledger=json(dir+'PHASE-7-CONTENT-LEDGER.md');
const inventory=json(dir+'PHASE-7-QUESTION-INVENTORY.md');
// Preserve Batch 2's exact assertions while the shared ledger appends later batches.
const sources={references:json(folder+'SOURCE-VERIFICATION-LEDGER.md').references
  .filter((r:{batch?:number})=>r.batch===undefined||r.batch<=2)};
const beforeLedger=json(evidence+'content-ledger-before.md'),beforeSources=json(evidence+'source-ledger-before.md');
const valid=validateQuestionBank(original);if(!valid.ok) throw new Error(valid.errors.join('; '));
const bank=valid.bank;
const ids=['Q16','Q17','Q19','Q20','Q21','Q22','Q23','Q24','Q27','Q28'];
const qs=bank.questions.filter(q=>ids.includes(q.id));
const sha=(x:string|Buffer)=>createHash('sha256').update(x).digest('hex');
const unwrap=<T>(r:{ok:true;value:T}|{ok:false;code:string}):T=>{if(!r.ok) throw new Error(r.code);return r.value;};
const projection=(draft:z.infer<typeof draftSchema>)=>guideEntrySchema.parse({...draft,approval:{...draft.approval,status:'approved'}});
type Row={questionId:string;batch:number;plannedBatch?:number;sourceFingerprint:string;draftSha256:string|null;prospectiveG1:string|null;approvedG1:string|null;
  independentHumanReview:unknown;finalOwnerApproval:unknown;draftStatus:string};

describe('Phase 7 Batch 2 source inventory and bounds',()=>{
  it('matches exact authorized order, positions, nine singles/one double, domains and Q21 table',()=>{
    expect(sha(readFileSync(new URL('public/easy-question-bank.json',root)))).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
    expect(batch.questions.map(q=>q.questionId)).toEqual(ids);expect(qs.map(q=>q.id)).toEqual(ids);
    expect(new Set(ids).size).toBe(10);
    expect(inventory.records.filter((r:Row)=>r.plannedBatch===2).map((r:Row)=>r.questionId)).toEqual(ids);
    expect(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length)).toEqual([2,1,1,3,1,1,1]);
    expect([1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length)).toEqual([9,1,0]);
    expect(qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id)).toEqual(['Q21']);
    expect(batch.source).toEqual({schemaVersion:1,examId:bank.examId,bankVersion:bank.version,difficulty:'intermediate'});
    expect(batch.plannedGuideVersion).toBe('1.1.0');
    expect(unwrap(validateSource(original,'intermediate')).source).toEqual(batch.source);
    expect(validateSource(original,'advanced')).toEqual({ok:false,code:'version-mismatch'});
  });
  it('preserves prior ledger rows and source evidence while adding only the ten authorized drafts',()=>{
    expect(ledger.records).toHaveLength(50);expect(ledger.newIndependentReviewWaiver).toBe(true);
    expect(priorAuthoringFields(ledger.records.slice(0,10))).toEqual(priorAuthoringFields(beforeLedger.records.slice(0,10)));
    expect(sources.references.slice(0,14)).toEqual(beforeSources.references);
    expect(ledger.records.filter((r:Row)=>r.draftSha256!==null&&r.batch<=2).map((r:Row)=>r.questionId)).toEqual([...first.questions.map((q:{questionId:string})=>q.questionId),...ids]);
    for(const r of ledger.records){
      expect(r.approvedG1).toBeNull();expect(r.independentHumanReview).toBeNull();expect(r.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});
      expect(r.draftStatus).toBe('unpublished draft; final owner educational acceptance recorded; separate independent-human-review requirement waived for this exact identity');expect(r.draftSha256).not.toBeNull();expect(r.prospectiveG1).not.toBeNull();
    }
  });
});

describe('Phase 7 Batch 2 exact draft content',()=>{
  it.each(batch.questions)('$questionId matches q1, draft SHA, prospective g1, schema and every option/source',async draft=>{
    const q=qs.find(q=>q.id===draft.questionId)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
    const row=ledger.records.find((r:Row)=>r.questionId===q.id);
    const planned=inventory.records.find((r:Row)=>r.questionId===q.id);
    const guide=projection(draft),q1=unwrap(await questionFingerprint(batch.source,domain,q));
    expect(draft.sourceFingerprint).toBe(q1);expect(q1).toBe(planned.sourceFingerprint);
    const digest=unwrap(await guidanceDigest(batch.source,'1.1.0',guide));
    expect(row).toMatchObject({batch:2,draftVersion:1,guideVersion:'1.1.0',reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`,sourceFingerprint:q1,
      draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,
      independentSourceReview:null,semanticHintReview:null});
    expect(guidedItemSchema.safeParse({question:q,domain,guide,guideDigest:digest}).success).toBe(true);
    expect(draft.optionComparisons.map(o=>o.optionId)).toEqual(q.options.map(o=>o.id));
    expect(draft.sourceChecks.map(s=>s.sourceIndex)).toEqual(q.sources.map((_,i)=>i));
    expect(draft.vocabulary.length).toBeGreaterThan(0);
    expect(guideEntrySchema.safeParse(draft).success).toBe(false);
    expect(await guidanceDigest(batch.source,'1.1.0',draft as unknown as GuideEntry)).toEqual({ok:false,code:'invalid-release'});
    const reverse=(v:unknown):unknown=>Array.isArray(v)?v.map(reverse):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reverse(x)])):v;
    expect(unwrap(await guidanceDigest(batch.source,'1.1.0',reverse(guide) as GuideEntry))).toBe(digest);
    expect(sha(JSON.stringify(JSON.parse(JSON.stringify(draft))))).toBe(row.draftSha256);
    const edited=structuredClone(guide);edited.hints[2]+=' Changed.';
    expect(unwrap(await guidanceDigest(batch.source,'1.1.0',edited))).not.toBe(digest);
    expect(unwrap(await guidanceDigest(batch.source,'1.1.1',guide))).not.toBe(digest);
    const incomplete=structuredClone(guide);incomplete.optionComparisons.pop();
    expect(guidedItemSchema.safeParse({question:q,domain,guide:incomplete,guideDigest:digest}).success).toBe(false);
  });
  it('keeps all sixty authored hints and twenty reasoning blocks distinct without surface answer leakage',()=>{
    const all=[...first.questions,...batch.questions];
    expect(new Set(all.flatMap(q=>q.hints)).size).toBe(60);expect(new Set(all.map(q=>q.reasoningMarkdown)).size).toBe(20);
    for(const d of batch.questions){
      expect(d.hints).toHaveLength(3);const q=qs.find(q=>q.id===d.questionId)!;
      for(const h of d.hints){
        expect(h).not.toMatch(/\b[A-E]\b|\d|\$/);expect(h).not.toMatch(/\b(?:correct answer|choose option|answer is)\b/i);
        for(const id of q.correctOptionIds)expect(h.toLowerCase()).not.toContain(q.options.find(o=>o.id===id)!.textMarkdown.toLowerCase());
      }
    }
    // Independent AI semantic review and exact owner acceptance/waiver are recorded separately; no human activity is claimed.
  });
  it('retains exact solve-first stems/options/references including all Q21 table cells and surrounding constraints',async()=>{
    const copy=file(folder+'batch-2-questions-only.md');
    for(const q of qs){
      const actual=copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];
      const expected=q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
      expect(actual?.trimEnd()).toBe(expected.trimEnd());expect(actual).not.toContain(q.explanationMarkdown);
    }
    const q=qs.find(q=>q.id==='Q21')!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
    const table=q.stemMarkdown.split('\n').filter(line=>line.startsWith('|'));
    expect(table).toEqual(['| Requirement | Recorded basis |','| --- | --- |','| Weekly PDF | Manager’s email |','| Delivery by Saturday 9 a.m. | AI’s suggested interpretation |']);
    const changed=structuredClone(q);changed.stemMarkdown=changed.stemMarkdown.replace('AI’s suggested interpretation','Manager’s email');
    expect(unwrap(await questionFingerprint(batch.source,domain,changed))).not.toBe(batch.questions.find(d=>d.questionId==='Q21')!.sourceFingerprint);
    const explanation=batch.questions.find(d=>d.questionId==='Q21')!.reasoningMarkdown;
    for(const text of ['Requirement','Recorded basis','Weekly PDF','manager’s email','Delivery by Saturday 9 a.m.','AI’s suggestion','recipient, input and layout'])expect(explanation).toContain(text);
  });
  it('binds ten newly inspected original passages to exact metadata/claims with all human source fields unset',()=>{
    expect(sources.references).toHaveLength(24);
    const refs=sources.references.filter((r:{batch?:number})=>r.batch===2);expect(refs).toHaveLength(10);
    expect(new Set(refs.map((r:{url:string;sectionHeading:string})=>r.url+'|'+r.sectionHeading)).size).toBe(10);
    expect(new Set(refs.map((r:{url:string})=>r.url)).size).toBe(6);
    for(const d of batch.questions){
      const q=qs.find(q=>q.id===d.questionId)!,r=refs.find((r:{questionId:string})=>r.questionId===q.id);
      expect(r).toMatchObject({...q.sources[0],questionId:q.id,sourceIndex:0,checkedOn:'2026-10-18',status:'ai-source-checked',humanVerifiedBy:null,humanVerifiedAt:null});
      expect(r.supportingPassageSummary.length).toBeGreaterThan(10);expect(r.originalPassageLines[0]).toBeLessThan(r.originalPassageLines[1]);
      expect(d.sourceChecks[0].claim).toBe(r.claim);expect(d.sourceChecks[0].evidenceLocator).toContain('Batch 2');
      expect(d.sourceChecks[0].evidenceLocator).toContain(q.sources[0].url);expect(d.sourceChecks[0].evidenceLocator).toContain(q.sources[0].sectionHeading);
    }
  });
  it('retains all keyed single answers and Q23’s complete A/D set and closest incorrect alternatives',()=>{
    const expected:Record<string,string[]>={Q16:['B'],Q17:['A'],Q19:['C'],Q20:['A'],Q21:['C'],Q22:['B'],Q23:['A','D'],Q24:['D'],Q27:['B'],Q28:['D']};
    expect(qs.reduce((n,q)=>n+q.options.length,0)).toBe(41);
    for(const q of qs){expect(q.correctOptionIds).toEqual(expected[q.id]);expect(q.selectionCount).toBe(expected[q.id].length);}
    const q23=batch.questions.find(d=>d.questionId==='Q23')!;expect(q23.reasoningMarkdown).toContain('A and D');
    expect(q23.closestDistractorIds).toEqual(['B','C']);
    // At-least condition is preserved; no arithmetic or invented grant/deadline result is needed.
    expect(batch.questions.find(d=>d.questionId==='Q22')!.reasoningMarkdown).toContain('minimum of fifty');
    expect(batch.questions.find(d=>d.questionId==='Q22')!.optionComparisons.find(o=>o.optionId==='B')!.failsOrLimitsMarkdown).toContain('rather than narrow it to exactly fifty');
  });
  it('rejects raw drafts and even combined prospective projections through the actual production contracts',async()=>{
    expect(productionCatalog).toEqual([]);
    const release={schemaVersion:1,fingerprintVersion:1,source:batch.source,guideVersion:'1.1.0',contentStatus:'reviewed',questions:batch.questions};
    expect(guideReleaseSchema.safeParse(release).success).toBe(false);expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
    expect(await validatePublishedRelease({...release,questions:batch.questions.map(projection)})).toEqual({ok:false,code:'not-published'});
    expect(await validatePublishedRelease({...release,questions:[...first.questions,...batch.questions].map(projection)})).toEqual({ok:false,code:'not-published'});
  });
  it('preserves Batch 1/pilot evidence and verifies exact historical or authorized code hashes',()=>{
    const before=JSON.parse(file(evidence+'preservation-before.json'));
    expect(before.files.length).toBeGreaterThanOrEqual(163);
    for(const f of before.files)expect(sha(readFileSync(new URL(f.path,root))),f.path).toBe(integrationPreservationHash(f.path, f.sha256));
  });
});
