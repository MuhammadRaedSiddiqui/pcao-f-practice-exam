import { integrationPreservationHash } from './normal-guided/preservation';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import original from '../public/easy-question-bank.json';
import { validateQuestionBank } from '../src/domain/bank';
import { productionCatalog } from '../src/domain/guided/catalog';
import { questionFingerprint, guidanceDigest } from '../src/domain/guided/fingerprints';
import { validatePublishedRelease } from '../src/domain/guided/loader';
import { guideEntrySchema, guidedItemSchema, guideReleaseSchema, sourceIdentitySchema,
  stableIdSchema, versionSchema, type GuideEntry } from '../src/domain/guided/schema';

const root = new URL('../', import.meta.url);
const file = (p: string) => readFileSync(new URL(p, root), 'utf8');
const block = (p: string) => {
  const matches = [...file(p).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];
  if (matches.length !== 1) throw new Error('Expected one authoritative block: ' + p);
  return JSON.parse(matches[0][1]);
};
const dir = 'docs/guided-practice/';
const folder = dir + 'content/intermediate-expansion/';
const draftSchema = z.strictObject({ ...guideEntrySchema.shape,
  approval: z.strictObject({ status: z.literal('draft'), reviewId: stableIdSchema }) });
const batch = z.strictObject({ authoringFormatVersion: z.literal(1), batch: z.literal(1), source: sourceIdentitySchema,
  plannedGuideVersion: versionSchema, contentStatus: z.literal('draft'), questions: z.array(draftSchema).length(10),
}).parse(block(folder + 'batch-1.md'));
const inventory = block(dir + 'PHASE-7-QUESTION-INVENTORY.md');
const ledger = block(dir + 'PHASE-7-CONTENT-LEDGER.md');
// The shared ledger grows append-only by batch; retain all original Batch 1 assertions.
const sources = { references: block(folder + 'SOURCE-VERIFICATION-LEDGER.md').references
  .filter((r: {questionId: string}) => batch.questions.some(q => q.questionId === r.questionId)) };
const distribution = JSON.parse(file('test-results/guided-practice/phase-7-batch-1/batches.json'));
const parsed = validateQuestionBank(original);
if (!parsed.ok) throw new Error(parsed.errors.join('; '));
const bank = parsed.bank;
const pilotIds = ['Q4','Q5','Q6','Q10','Q12','Q18','Q25','Q26','Q33','Q59'];
const ids = ['Q1','Q2','Q3','Q7','Q8','Q9','Q11','Q13','Q14','Q15'];
const remaining = bank.questions.filter(q => !pilotIds.includes(q.id));
const sha = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');
const unwrap = <T>(r: { ok: true; value: T } | { ok: false; code: string }): T => {
  if (!r.ok) throw new Error(r.code); return r.value;
};
const projected = (draft: z.infer<typeof draftSchema>) => guideEntrySchema.parse({ ...draft,
  approval: { ...draft.approval, status: 'approved' } }); // Structural test only; not persisted as approved.
type InventoryRow = { questionId: string; bankPosition: number; domain: string; selectionCount: number;
  sourceFingerprint: string; originalCorrectOptionIds: string[]; plannedBatch: number; sources: unknown[] };

describe('Phase 7 frozen inventory and five-batch plan', () => {
  it('binds exactly fifty unique real IDs to original bank positions, options, source indices and q1', async () => {
    expect(inventory.bankSha256).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
    expect(sha(readFileSync(new URL('public/easy-question-bank.json',root)))).toBe(inventory.bankSha256);
    expect(inventory.records.map((r: InventoryRow) => r.questionId)).toEqual(remaining.map(q => q.id));
    expect(new Set(inventory.records.map((r: InventoryRow) => r.questionId)).size).toBe(50);
    expect(inventory.pilotIds).toEqual(pilotIds);
    for (const [i,q] of remaining.entries()) {
      const r: InventoryRow = inventory.records[i];
      const domain = bank.domains.find(d => d.id === q.primaryDomain)!;
      expect(r).toMatchObject({ questionId:q.id,bankPosition:bank.questions.indexOf(q)+1,domain:q.primaryDomain,
        selectionCount:q.selectionCount,originalCorrectOptionIds:q.correctOptionIds,plannedBatch:Math.floor(i/10)+1 });
      expect(r.sources).toEqual(q.sources.map((s,sourceIndex) => expect.objectContaining({...s,sourceIndex})));
      expect(r.sourceFingerprint).toBe(unwrap(await questionFingerprint(batch.source,domain,q)));
    }
  });
  it('partitions source order into five disjoint tens with exact domain, response and table totals', () => {
    expect(distribution).toHaveLength(5);
    for (const [i,b] of distribution.entries()) {
      const qs = remaining.slice(i*10,i*10+10);
      expect(b.batch).toBe(i+1);
      expect(b.questionIds).toEqual(qs.map(q => q.id));
      expect(b.domains).toEqual(Object.fromEntries(bank.domains.map(d => [d.id,qs.filter(q => q.primaryDomain===d.id).length])));
      expect(b.selectionCounts).toEqual(Object.fromEntries([1,2,3].map(n => [n,qs.filter(q => q.selectionCount===n).length])));
      expect(b.embeddedTables).toEqual(qs.filter(q => /\|\s*:?-{3}/.test(q.stemMarkdown)).map(q => q.id));
    }
    expect([1,2,3].map(n => bank.questions.filter(q => q.selectionCount===n).length)).toEqual([48,10,2]);
    expect(bank.domains.map(d => bank.questions.filter(q => q.primaryDomain===d.id).length)).toEqual([8,13,7,10,7,9,6]);
    expect([1,2,3].map(n => remaining.filter(q => q.selectionCount===n).length)).toEqual([42,8,0]);
    expect(remaining.filter(q=>q.selectionCount===3)).toEqual([]);
  });
  it('preserves Batch 1 while all five authorized batches are drafts with every new approval unset', () => {
    expect(batch.questions.map(q => q.questionId)).toEqual(ids);
    expect(batch.source).toEqual({schemaVersion:1,examId:bank.examId,bankVersion:bank.version,difficulty:'intermediate'});
    expect(batch.plannedGuideVersion).toBe('1.1.0');
    expect(ledger.newIndependentReviewWaiver).toBe(true);
    expect(ledger.records).toHaveLength(50);
    expect(ledger.records.map((r: InventoryRow) => r.questionId)).toEqual(remaining.map(q=>q.id));
    expect(readdirSync(new URL(folder,root)).sort()).toEqual(['SOURCE-VERIFICATION-LEDGER.md','batch-1.md','batch-2-questions-only.md','batch-2.md','batch-3-questions-only.md','batch-3.md','batch-4-questions-only.md','batch-4.md','batch-5-questions-only.md','batch-5.md','questions-only.md']);
    for(const r of ledger.records) {
      expect(r.approvedG1).toBeNull(); expect(r.independentHumanReview).toBeNull(); expect(r.finalOwnerApproval).toMatchObject({status:'approved',guideVersion:'1.1.0',draftSha256:r.draftSha256,sourceFingerprint:r.sourceFingerprint,prospectiveG1:r.prospectiveG1});
      expect(r.draftStatus).toBe('unpublished draft; final owner educational acceptance recorded; separate independent-human-review requirement waived for this exact identity'); expect(r.draftSha256).not.toBeNull(); expect(r.prospectiveG1).not.toBeNull();
    }
  });
});

describe('Phase 7 Batch 1 exact draft integrity', () => {
  it.each(batch.questions)('$questionId has source match, complete option/source coverage and exact draft/q1/g1', async draft => {
    const q = bank.questions.find(q=>q.id===draft.questionId)!;
    const domain = bank.domains.find(d=>d.id===q.primaryDomain)!;
    const row = ledger.records.find((r: InventoryRow)=>r.questionId===q.id);
    const guide = projected(draft);
    expect(draft.sourceFingerprint).toBe(unwrap(await questionFingerprint(batch.source,domain,q)));
    const digest = unwrap(await guidanceDigest(batch.source,batch.plannedGuideVersion,guide));
    expect(row).toMatchObject({draftVersion:1,guideVersion:'1.1.0',reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`,
      draftSha256:sha(JSON.stringify(draft)),sourceFingerprint:draft.sourceFingerprint,prospectiveG1:digest,
      originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount});
    expect(guidedItemSchema.safeParse({question:q,domain,guide,guideDigest:digest}).success).toBe(true);
    expect(guide.optionComparisons.map(o=>o.optionId)).toEqual(q.options.map(o=>o.id));
    expect(guide.sourceChecks.map(s=>s.sourceIndex)).toEqual(q.sources.map((_,i)=>i));
    expect(guideEntrySchema.safeParse(draft).success).toBe(false);
    expect(await guidanceDigest(batch.source,batch.plannedGuideVersion,draft as unknown as GuideEntry)).toEqual({ok:false,code:'invalid-release'});
    const reverse = (value: unknown): unknown => Array.isArray(value) ? value.map(reverse) : value && typeof value==='object'
      ? Object.fromEntries(Object.entries(value).reverse().map(([k,v])=>[k,reverse(v)])) : value;
    expect(unwrap(await guidanceDigest(batch.source,batch.plannedGuideVersion,reverse(guide) as GuideEntry))).toBe(digest);
    expect(sha(JSON.stringify(JSON.parse(JSON.stringify(draft))))).toBe(row.draftSha256);
    const changed = structuredClone(guide); changed.hints[0] += ' Changed.';
    expect(unwrap(await guidanceDigest(batch.source,batch.plannedGuideVersion,changed))).not.toBe(digest);
    expect(unwrap(await guidanceDigest(batch.source,'1.1.1',guide))).not.toBe(digest);
    expect(unwrap(await questionFingerprint({...batch.source,bankVersion:'1.0.1'},domain,q))).not.toBe(draft.sourceFingerprint);
  });
  it('has distinct staged hints without surface answer IDs, numerical answers or copied winning option text', () => {
    expect(new Set(batch.questions.flatMap(q=>q.hints)).size).toBe(30);
    expect(new Set(batch.questions.map(q=>q.reasoningMarkdown)).size).toBe(10);
    for (const d of batch.questions) {
      const q = bank.questions.find(q=>q.id===d.questionId)!;
      for (const h of d.hints) {
        expect(h).not.toMatch(/\b[A-E]\b|\d|\$/);
        expect(h).not.toMatch(/\b(?:correct answer|choose option|answer is)\b/i);
        for (const id of q.correctOptionIds) expect(h.toLowerCase()).not.toContain(q.options.find(o=>o.id===id)!.textMarkdown.toLowerCase());
      }
    }
    // Surface checks do not establish semantic/cumulative non-leakage. Human review remains pending.
  });
  it('preserves exact solve-first text/options/sources without bank feedback', () => {
    const copy = file(folder+'questions-only.md');
    for (const d of batch.questions) {
      const q=bank.questions.find(q=>q.id===d.questionId)!;
      const section=copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];
      const expected=q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+
        '\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
      expect(section?.trimEnd()).toBe(expected.trimEnd()); expect(section).not.toContain(q.explanationMarkdown);
    }
  });
  it('records all fourteen original reference occurrences without human source approval', () => {
    expect(sources.references).toHaveLength(14);
    expect(new Set(sources.references.map((r: {url:string;sectionHeading:string})=>r.url+'|'+r.sectionHeading)).size).toBe(12);
    expect(new Set(sources.references.map((r:{url:string})=>r.url)).size).toBe(7);
    for (const d of batch.questions) {
      const q=bank.questions.find(q=>q.id===d.questionId)!;
      const refs=sources.references.filter((r:{questionId:string})=>r.questionId===q.id);
      expect(refs).toHaveLength(q.sources.length);
      for (const [i,s] of q.sources.entries()) {
        expect(refs[i]).toMatchObject({...s,sourceIndex:i,status:'ai-source-checked',checkedOn:'2026-10-18',humanVerifiedBy:null,humanVerifiedAt:null});
        expect(d.sourceChecks[i].claim).toBe(refs[i].claim);
        expect(d.sourceChecks[i].evidenceLocator).toContain(s.sectionHeading);
        expect(d.sourceChecks[i].evidenceLocator).toContain(s.url);
      }
    }
  });
  it('checks case arithmetic and complete single/two-answer sets against independent expectations', () => {
    const expected: Record<string,string[]>={Q1:['C'],Q2:['B'],Q3:['A'],Q7:['A'],Q8:['D'],Q9:['A','C'],Q11:['B','E'],Q13:['C'],Q14:['A'],Q15:['D']};
    for (const d of batch.questions) {
      const q=bank.questions.find(q=>q.id===d.questionId)!;
      expect(q.correctOptionIds).toEqual(expected[q.id]); expect(expected[q.id]).toHaveLength(q.selectionCount);
    }
    expect(72>=48).toBe(true); expect(30-8).toBe(22);
    expect(batch.questions.find(d=>d.questionId==='Q2')!.reasoningMarkdown).toContain('72 ≥ 48');
    expect(batch.questions.find(d=>d.questionId==='Q7')!.reasoningMarkdown).toContain('30 − 8 = 22');
    expect(batch.questions.find(d=>d.questionId==='Q9')!.reasoningMarkdown).toContain('A and C');
    expect(batch.questions.find(d=>d.questionId==='Q11')!.reasoningMarkdown).toContain('B and E');
  });
  it('rejects unapproved drafts and rejects prospective projections from the actual empty production catalog', async () => {
    expect(productionCatalog).toEqual([]);
    const release={schemaVersion:1,fingerprintVersion:1,source:batch.source,guideVersion:batch.plannedGuideVersion,
      contentStatus:'reviewed',questions:batch.questions};
    expect(guideReleaseSchema.safeParse(release).success).toBe(false);
    expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
    expect(await validatePublishedRelease({...release,questions:batch.questions.map(projected)})).toEqual({ok:false,code:'not-published'});
  });
  it('preserves historical baseline files with only exact owner-authorized normal-app code pins', () => {
    const baseline=JSON.parse(file('test-results/guided-practice/phase-7-batch-1/preservation-before.json'));
    for (const f of baseline.files) expect(sha(readFileSync(new URL(f.path,root))),f.path).toBe(integrationPreservationHash(f.path, f.sha256));
  });
});
