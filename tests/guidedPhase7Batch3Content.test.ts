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

const root=new URL('../',import.meta.url),dir='docs/guided-practice/',folder=dir+'content/intermediate-expansion/',out='test-results/guided-practice/phase-7-batch-3/';
const file=(p:string)=>readFileSync(new URL(p,root),'utf8');
const block=(p:string)=>{const b=[...file(p).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];if(b.length!==1)throw new Error('Expected one JSON block: '+p);return JSON.parse(b[0][1]);};
const sha=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
const unwrap=<T>(r:{ok:true;value:T}|{ok:false;code:string}):T=>{if(!r.ok)throw new Error(r.code);return r.value;};
const draftSchema=z.strictObject({...guideEntrySchema.shape,approval:z.strictObject({status:z.literal('draft'),reviewId:stableIdSchema})});
const batch=z.strictObject({authoringFormatVersion:z.literal(1),batch:z.literal(3),source:sourceIdentitySchema,plannedGuideVersion:versionSchema,contentStatus:z.literal('draft'),questions:z.array(draftSchema).length(10)}).parse(block(folder+'batch-3.md'));
const previous=[1,2].map(n=>block(folder+`batch-${n}.md`));
const ledger=block(dir+'PHASE-7-CONTENT-LEDGER.md'),allSources=block(folder+'SOURCE-VERIFICATION-LEDGER.md'),inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md');
// Retain all Batch 3 source assertions as the shared ledger appends later batches.
const sources={...allSources,references:allSources.references.filter((r:{batch?:number})=>r.batch===undefined||r.batch<=3)};
const beforeLedger=block(out+'content-ledger-before.md'),beforeSources=block(out+'source-ledger-before.md');
const parsed=validateQuestionBank(rawBank);if(!parsed.ok)throw new Error(parsed.errors.join('; '));
const bank=parsed.bank,ids=['Q29','Q30','Q31','Q32','Q34','Q35','Q36','Q37','Q38','Q39'],qs=bank.questions.filter(q=>ids.includes(q.id));
type Row={questionId:string;batch:number;plannedBatch?:number;sourceFingerprint:string;draftSha256:string|null;prospectiveG1:string|null;approvedG1:string|null;draftStatus:string};
const projection=(d:z.infer<typeof draftSchema>)=>guideEntrySchema.parse({...d,approval:{...d.approval,status:'approved'}});

describe('Phase 7 Batch 3 exact inventory and authoring boundary',()=>{
  it('matches authorized source order/positions, type/domain totals, bank identity and table membership',()=>{
    expect(sha(readFileSync(new URL('public/easy-question-bank.json',root)))).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
    expect(batch.questions.map(q=>q.questionId)).toEqual(ids);expect(qs.map(q=>q.id)).toEqual(ids);expect(new Set(ids).size).toBe(10);
    const planned=inventory.records.filter((r:Row)=>r.plannedBatch===3);
    expect(planned.map((r:Row)=>r.questionId)).toEqual(ids);
    expect(planned.map((r:{bankPosition:number})=>r.bankPosition)).toEqual(qs.map(q=>bank.questions.indexOf(q)+1));
    expect(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length)).toEqual([1,3,2,0,1,1,2]);
    expect([1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length)).toEqual([8,2,0]);
    expect(qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id)).toEqual(['Q30','Q31']);
    expect(batch.source).toEqual({schemaVersion:1,examId:bank.examId,bankVersion:bank.version,difficulty:'intermediate'});
    expect(batch.plannedGuideVersion).toBe('1.1.0');expect(unwrap(validateSource(rawBank,'intermediate')).source).toEqual(batch.source);
    expect(validateSource(rawBank,'advanced')).toEqual({ok:false,code:'version-mismatch'});
  });
  it('preserves every prior content/source row while later authorized drafts append with approvals unset',()=>{
    expect(ledger.records).toHaveLength(50);expect(ledger.newIndependentReviewWaiver).toBe(true);
    expect(priorAuthoringFields(ledger.records.slice(0,20))).toEqual(priorAuthoringFields(beforeLedger.records.slice(0,20)));
    expect(sources.references.slice(0,24)).toEqual(beforeSources.references);expect(sources.batch2).toEqual(beforeSources.batch2);
    expect(ledger.records.filter((r:Row)=>r.draftSha256!==null&&r.batch<=3).map((r:Row)=>r.questionId)).toEqual([...previous.flatMap(b=>b.questions.map((q:{questionId:string})=>q.questionId)),...ids]);
    for(const r of ledger.records){
      expect(r.approvedG1).toBeNull();expect(r.independentHumanReview).toBeNull();expect(r.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});
      expect(r.draftStatus).toBe('unpublished draft; final owner educational acceptance recorded; separate independent-human-review requirement waived for this exact identity');expect(r.draftSha256).not.toBeNull();expect(r.prospectiveG1).not.toBeNull();
    }
  });
});
describe('Phase 7 Batch 3 guide/source integrity',()=>{
  it.each(batch.questions)('$questionId binds exact q1, draft SHA, prospective g1, strict coverage and approval metadata',async draft=>{
    const q=qs.find(q=>q.id===draft.questionId)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!,row=ledger.records.find((r:Row)=>r.questionId===q.id);
    const guide=projection(draft),q1=unwrap(await questionFingerprint(batch.source,domain,q)),digest=unwrap(await guidanceDigest(batch.source,'1.1.0',guide));
    expect(q1).toBe(draft.sourceFingerprint);expect(q1).toBe(inventory.records.find((r:Row)=>r.questionId===q.id).sourceFingerprint);
    expect(row).toMatchObject({batch:3,draftVersion:1,reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`,guideVersion:'1.1.0',sourceFingerprint:q1,draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,independentSourceReview:null,semanticHintReview:null});
    expect(guidedItemSchema.safeParse({question:q,domain,guide,guideDigest:digest}).success).toBe(true);
    expect(draft.optionComparisons.map(o=>o.optionId)).toEqual(q.options.map(o=>o.id));expect(draft.sourceChecks.map(s=>s.sourceIndex)).toEqual(q.sources.map((_,i)=>i));
    expect(draft.vocabulary.length).toBeGreaterThan(0);expect(draft.hints).toHaveLength(3);
    expect(draftSchema.safeParse({...draft,hints:draft.hints.slice(0,2)}).success).toBe(false);
    expect(guideEntrySchema.safeParse(draft).success).toBe(false);expect(await guidanceDigest(batch.source,'1.1.0',draft as unknown as GuideEntry)).toEqual({ok:false,code:'invalid-release'});
    const reverse=(v:unknown):unknown=>Array.isArray(v)?v.map(reverse):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reverse(x)])):v;
    expect(unwrap(await guidanceDigest(batch.source,'1.1.0',reverse(guide) as GuideEntry))).toBe(digest);
    expect(sha(JSON.stringify(JSON.parse(JSON.stringify(draft))))).toBe(row.draftSha256);
    for(const field of ['hints','approval']as const){const changed=structuredClone(guide);if(field==='hints')changed.hints[0]+=' Changed.';else changed.approval.reviewId+='-changed';expect(unwrap(await guidanceDigest(batch.source,'1.1.0',changed))).not.toBe(digest);}
    expect(unwrap(await guidanceDigest(batch.source,'1.1.1',guide))).not.toBe(digest);
    expect(unwrap(await questionFingerprint({...batch.source,bankVersion:'1.0.1'},domain,q))).not.toBe(q1);
    const incomplete=structuredClone(guide);incomplete.optionComparisons.pop();expect(guidedItemSchema.safeParse({question:q,domain,guide:incomplete,guideDigest:digest}).success).toBe(false);
  });
  it('retains ninety distinct hints and thirty distinct reasoning blocks while checking surface leakage',()=>{
    const all=[...previous.flatMap(b=>b.questions),...batch.questions];expect(new Set(all.flatMap(q=>q.hints)).size).toBe(90);expect(new Set(all.map(q=>q.reasoningMarkdown)).size).toBe(30);
    for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;for(const h of d.hints){
      expect(h).not.toMatch(/\b[A-E]\b|\d|\$|%/);expect(h).not.toMatch(/\b(?:correct answer|choose option|answer is)\b/i);
      for(const id of q.correctOptionIds)expect(h.toLowerCase()).not.toContain(q.options.find(o=>o.id===id)!.textMarkdown.toLowerCase());
    }}
    // These surface guards do not certify independent semantic/cumulative hint safety.
  });
  it('matches all twelve new original references with inspected evidence and no invented human fields',()=>{
    expect(sources.references).toHaveLength(36);const refs=sources.references.filter((r:{batch?:number})=>r.batch===3);
    expect(refs).toHaveLength(12);expect(new Set(refs.map((r:{url:string;sectionHeading:string})=>r.url+'|'+r.sectionHeading)).size).toBe(12);expect(new Set(refs.map((r:{url:string})=>r.url)).size).toBe(8);
    for(const d of batch.questions){const q=qs.find(q=>q.id===d.questionId)!;const rs=refs.filter((r:{questionId:string})=>r.questionId===q.id);expect(rs).toHaveLength(q.sources.length);
      for(const[i,s]of q.sources.entries()){const r=rs[i];expect(r).toMatchObject({...s,sourceIndex:i,status:'ai-source-checked',checkedOn:'2026-10-18',humanVerifiedBy:null,humanVerifiedAt:null});
        expect(r.supportingExcerpt.length).toBeGreaterThan(3);expect(r.supportingPassageSummary.length).toBeGreaterThan(10);expect(r.scopeLimit).toContain('frozen bank');expect(r.originalPassageLines[0]).toBeLessThan(r.originalPassageLines[1]);
        expect(d.sourceChecks[i].claim).toBe(r.claim);expect(d.sourceChecks[i].evidenceLocator).toContain('Batch 3');expect(d.sourceChecks[i].evidenceLocator).toContain(s.sectionHeading);expect(d.sourceChecks[i].evidenceLocator).toContain(s.url);
      }
    }
  });
  it('copies every exact original stem, quote, option and source into the separate solve-first file',()=>{
    const copy=file(folder+'batch-3-questions-only.md');for(const q of qs){
      const actual=copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];const expected=q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
      expect(actual?.trimEnd()).toBe(expected.trimEnd());expect(actual).not.toContain(q.explanationMarkdown);
    }
  });
  it.each(['Q30','Q31'])('%s preserves every table cell, order, unit and surrounding constraint and detects table edits in q1',async id=>{
    const q=qs.find(q=>q.id===id)!,domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
    const table=q.stemMarkdown.split('\n').filter(line=>line.startsWith('|'));
    const exact=id==='Q30'?['| Measure | Result |','| --- | ---: |','| Correct answers checked | 98% |','| Customers resolving their problem | 24% |']:
      ['| Configuration | Summaries passing | Extractions passing |','| --- | ---: | ---: |','| R | 9 of 10 | 7 of 10 |','| T | 8 of 10 | 10 of 10 |'];
    expect(table).toEqual(exact);
    const copy=file(folder+'batch-3-questions-only.md').split(`## ${id}\n\n`)[1].split('\n## ')[0];expect(copy).toContain(q.stemMarkdown);expect(copy.split('\n').filter(line=>line.startsWith('|'))).toEqual(exact);
    const fp=unwrap(await questionFingerprint(batch.source,domain,q));
    for(const replacement of [q.stemMarkdown.replace(exact[2],''),q.stemMarkdown.replace(exact[0],exact[0].replace(id==='Q30'?'Measure':'Summaries passing','Changed heading')),q.stemMarkdown.replace(exact[2]+'\n'+exact[3],exact[3]+'\n'+exact[2])]){
      expect(replacement).not.toBe(q.stemMarkdown);
      expect(unwrap(await questionFingerprint(batch.source,domain,{...q,stemMarkdown:replacement}))).not.toBe(fp);
    }
    const changedValue={...q,stemMarkdown:q.stemMarkdown.replace(id==='Q30'?'98%':'9 of 10',id==='Q30'?'97%':'6 of 10')};expect(unwrap(await questionFingerprint(batch.source,domain,changedValue))).not.toBe(fp);
  });
  it('independently checks the two complete selection sets and per-task threshold arithmetic without deriving Q30 overlap',()=>{
    const keys:Record<string,string[]>={Q29:['C'],Q30:['A'],Q31:['B','D'],Q32:['C'],Q34:['D'],Q35:['B'],Q36:['C'],Q37:['D'],Q38:['A','C'],Q39:['B']};
    for(const q of qs){expect(q.correctOptionIds).toEqual(keys[q.id]);expect(q.selectionCount).toBe(keys[q.id].length);}expect(qs.reduce((n,q)=>n+q.options.length,0)).toBe(42);
    const grid=[{configuration:'R',summaries:9,extractions:7},{configuration:'T',summaries:8,extractions:10}];
    expect(grid.filter(r=>r.summaries>=9).map(r=>r.configuration)).toEqual(['R']);expect(grid.filter(r=>r.extractions>=9).map(r=>r.configuration)).toEqual(['T']);
    const reason=batch.questions.find(d=>d.questionId==='Q31')!.reasoningMarkdown;for(const value of ['9 ≥ 9','10 ≥ 9','7 < 9','8 < 9','B and D'])expect(reason).toContain(value);
    expect(batch.questions.find(d=>d.questionId==='Q38')!.reasoningMarkdown).toContain('A and C');
    const q30=batch.questions.find(d=>d.questionId==='Q30')!.reasoningMarkdown;expect(q30).toContain('no shared denominators or case linkage');expect(q30).not.toContain('74%');
  });
  it('rejects drafts and unallowlisted prospective projections, including all thirty combined entries',async()=>{
    expect(productionCatalog).toEqual([]);const release={schemaVersion:1,fingerprintVersion:1,source:batch.source,guideVersion:'1.1.0',contentStatus:'reviewed',questions:batch.questions};
    expect(guideReleaseSchema.safeParse(release).success).toBe(false);expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
    expect(await validatePublishedRelease({...release,questions:batch.questions.map(projection)})).toEqual({ok:false,code:'not-published'});
    expect(await validatePublishedRelease({...release,questions:[...previous.flatMap(b=>b.questions),...batch.questions].map(projection)})).toEqual({ok:false,code:'not-published'});
  });
  it('preserves earlier draft/pilot bytes and verifies exact historical or authorized code hashes',()=>{
    const before=JSON.parse(file(out+'preservation-before.json'));expect(before.files.length).toBe(182);for(const f of before.files)expect(sha(readFileSync(new URL(f.path,root))),f.path).toBe(integrationPreservationHash(f.path, f.sha256));
  });
});
