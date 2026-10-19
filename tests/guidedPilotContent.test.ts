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

// Authoring only: Markdown is excluded by the existing hosting ignore rule and
// never imported by the app. No draft schema or approval adapter enters src/.
const folder = new URL('../docs/guided-practice/content/intermediate-pilot/', import.meta.url);
const text = (name: string) => readFileSync(new URL(name, folder), 'utf8');
function json(name: string) {
  const matches = [...text(name).matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];
  if (matches.length !== 1) throw new Error(`Expected one authoritative JSON block: ${name}`);
  return JSON.parse(matches[0][1]);
}
const draftSchema = z.strictObject({ ...guideEntrySchema.shape,
  approval: z.strictObject({ status: z.literal('draft'), reviewId: stableIdSchema }) });
const batchSchema = z.strictObject({ authoringFormatVersion: z.literal(1), batch: z.union([z.literal(1), z.literal(2)]),
  source: sourceIdentitySchema, plannedGuideVersion: versionSchema, contentStatus: z.literal('draft'),
  questions: z.array(draftSchema).length(5) });
const batches = [1, 2].map(n => batchSchema.parse(json(`batch-${n}.md`)));
const ledger = json('CONTENT-REVIEW-LEDGER.md');
const sources = json('SOURCE-VERIFICATION-LEDGER.md');
const parsed = validateQuestionBank(original);
if (!parsed.ok) throw new Error(parsed.errors.join('; '));
const bank = parsed.bank;
const sha = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const unwrap = <T>(r: { ok: true; value: T } | { ok: false; code: string }): T => {
  if (!r.ok) throw new Error(r.code);
  return r.value;
};
// This projection is solely for Phase 1 structural/g1 tests. It is not persisted
// as approved, injected into a catalog, or accepted as evidence of human review.
const prospective = (draft: z.infer<typeof draftSchema>): GuideEntry => guideEntrySchema.parse({
  ...draft, approval: { ...draft.approval, status: 'approved' },
});
const expectedIds = [['Q4', 'Q5', 'Q6', 'Q10', 'Q12'], ['Q18', 'Q25', 'Q26', 'Q33', 'Q59']];

describe.each(batches.map((batch, i) => ({ batch, number: i + 1 })))('Intermediate draft batch $number', ({ batch, number }) => {
  it('has exactly its five ordered candidates bound to the reviewed Intermediate identity', () => {
    expect(batch.batch).toBe(number);
    expect(batch.questions.map(q => q.questionId)).toEqual(expectedIds[number - 1]);
    expect(batch.source).toEqual({ schemaVersion: 1, examId: bank.examId, bankVersion: bank.version, difficulty: 'intermediate' });
  });
  it.each(batch.questions)('$questionId matches q1, strict item coverage and prospective g1 without approving its draft', async draft => {
    const question = bank.questions.find(q => q.id === draft.questionId)!;
    const domain = bank.domains.find(d => d.id === question.primaryDomain)!;
    const guide = prospective(draft);
    const row = ledger.records.find((r: { questionId: string }) => r.questionId === question.id);
    expect(unwrap(await questionFingerprint(batch.source, domain, question))).toBe(draft.sourceFingerprint);
    const digest = unwrap(await guidanceDigest(batch.source, batch.plannedGuideVersion, guide));
    expect(digest).toBe(row.prospectiveG1);
    expect(sha(JSON.stringify(draft))).toBe(row.draftSha256);
    expect(guidedItemSchema.safeParse({ question, domain, guide, guideDigest: digest }).success).toBe(true);
    expect(guideEntrySchema.safeParse(draft).success).toBe(false);
    expect(await guidanceDigest(batch.source, batch.plannedGuideVersion, draft as unknown as GuideEntry))
      .toEqual({ ok: false, code: 'invalid-release' });
    expect(row.originalCorrectOptionIds).toEqual(question.correctOptionIds);
    expect(row.sourceFingerprint).toBe(draft.sourceFingerprint);
    expect(guide.optionComparisons.map(o => o.optionId)).toEqual(question.options.map(o => o.id));
    expect([...new Set(guide.sourceChecks.map(s => s.sourceIndex))].sort()).toEqual(question.sources.map((_, i) => i));
    const changed = structuredClone(guide); changed.hints[1] += ' Revised wording.';
    expect(unwrap(await guidanceDigest(batch.source, batch.plannedGuideVersion, changed))).not.toBe(digest);
  });
  it('keeps three distinct hints free of explicit option IDs, exact winning option text and numerical answers', () => {
    for (const draft of batch.questions) {
      const question = bank.questions.find(q => q.id === draft.questionId)!;
      expect(new Set(draft.hints).size).toBe(3);
      for (const hint of draft.hints) {
        expect(hint).not.toMatch(/\b[A-E]\b|\d|\$/);
        expect(hint).not.toMatch(/\b(?:answer|correct option|choose option)\b/i);
        for (const id of question.correctOptionIds) {
          expect(hint).not.toContain(question.options.find(o => o.id === id)!.textMarkdown);
        }
      }
    }
    // This catches surface leaks only. Semantic/cumulative leakage and whether
    // hints scaffold thinking without solving it remain a mandatory human review.
  });
});

describe('Final ten-question content and source ledger', () => {
  const drafts = batches.flatMap(b => b.questions);
  it('covers seven domains, six single/two double/two triple responses and six table stems', () => {
    expect(drafts.map(d => d.questionId)).toEqual(expectedIds.flat());
    const questions = drafts.map(d => bank.questions.find(q => q.id === d.questionId)!);
    expect([...new Set(questions.map(q => q.primaryDomain))].sort()).toEqual(['D1','D2','D3','D4','D5','D6','D7']);
    expect([1,2,3].map(n => questions.filter(q => q.selectionCount === n).length)).toEqual([6,2,2]);
    expect(questions.filter(q => q.stemMarkdown.includes('| ---')).length).toBe(6);
    expect(new Set(drafts.flatMap(d => d.hints)).size).toBe(30);
    expect(new Set(drafts.map(d => d.reasoningMarkdown)).size).toBe(10);
  });
  it('copies original solve-first question text/options/sources exactly without answer feedback', () => {
    const copy = text('questions-only.md');
    for (const draft of drafts) {
      const q = bank.questions.find(q => q.id === draft.questionId)!;
      const section = copy.split(`## ${q.id}\n\n`)[1]?.split('\n## ')[0];
      const exact = q.stemMarkdown + '\n\n' + q.options.map(o => `**${o.id}**\n\n${o.textMarkdown}\n`).join('\n') +
        '\nSources:\n\n' + q.sources.map(s => `- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
      expect(section?.trimEnd()).toBe(exact.trimEnd());
      expect(section).not.toContain(q.explanationMarkdown);
    }
  });
  it('retains every original reference and reconciles all three workflow sections from original passages with human review pending', () => {
    expect(sources.references).toHaveLength(12);
    expect(sources.references.filter((r: { status: string }) => r.status === 'ai-source-checked')).toHaveLength(12);
    for (const draft of drafts) {
      const q = bank.questions.find(q => q.id === draft.questionId)!;
      const refs = sources.references.filter((r: { questionId: string }) => r.questionId === q.id);
      expect(refs.map((r: { sourceIndex: number; courseTitle: string; sectionHeading: string; url: string; humanVerifiedBy: null; humanVerifiedAt: null }, i: number) => {
        expect(r.sourceIndex).toBe(i);
        expect(r.humanVerifiedBy).toBeNull(); expect(r.humanVerifiedAt).toBeNull();
        return { courseTitle: r.courseTitle, sectionHeading: r.sectionHeading, url: r.url };
      })).toEqual(q.sources);
      for (const ref of refs) {
        expect(draft.sourceChecks[ref.sourceIndex].claim).toBe(ref.claim);
        expect(draft.sourceChecks[ref.sourceIndex].evidenceLocator).toContain(ref.url);
        expect(draft.sourceChecks[ref.sourceIndex].evidenceLocator).not.toContain('UNVERIFIED');
        expect(ref.status).toBe('ai-source-checked');
        if (ref.reconciliation) {
          expect(ref.reconciliation.result).toBe('ai-source-checked');
          expect(ref.reconciliation.priorAttempts[0].result).toBe('unverified');
          expect(ref.draftClaimStatus).toContain('Corrected under explicit owner authorization');
          expect(ref.evidenceLocator).toBe(draft.sourceChecks[ref.sourceIndex].evidenceLocator);
        }
      }
    }
    expect(sources.references.filter((r: { reconciliation?: unknown }) => r.reconciliation).map((r: { questionId: string }) => r.questionId))
      .toEqual(['Q6','Q10','Q33']);
    expect(sources.references.filter((r: { status: string }) => r.status === 'unverified')).toHaveLength(0);
    expect(ledger.records.filter((r: { sourceVerification: string }) => r.sourceVerification === 'ai-source-checked')).toHaveLength(10);
    for (const row of ledger.records.filter((r: {questionId: string}) => ['Q6','Q10','Q33'].includes(r.questionId))) {
      expect(row.sourceAnnotationReconciliation).toMatchObject({status:'corrected-with-owner-authorization',changesToDraftContent:true});
    }
  });
  it('separates the AI author, independent human review and final owner approval for every record', () => {
    expect(ledger.author.kind).toBe('AI draft author');
    expect(ledger.records).toHaveLength(10);
    expect(ledger.approvalRequirements).toHaveLength(6);
    for (const row of ledger.records) {
      expect(row.author).toBe('Codex (AI)'); expect(row.selectionApproval).toBe('approved');
      expect(row.independentReview).toEqual({ reviewer: 'Repository owner (user; self-designated)', status: 'pending',
        solveFirstAnswer: null, reviewedDraftSha256: null, reviewedG1: null, reviewedAt: null });
      expect(row.finalOwnerApproval).toEqual({ approver: 'Repository owner (user; self-designated)', status: 'approved',
        approvedDraftSha256: row.draftSha256, approvedG1: row.prospectiveG1, approvedAt: ledger.ownerApprovalDecision.recordedAt });
      expect(row.approvedG1).toBeNull(); expect(row.requirements).toEqual([1,2,3,4,5,6]);
      expect(row.additionalBlockers).toEqual([]);
    }
    expect(ledger.ownerApprovalDecision).toMatchObject({statement:'i approve the ten questions',
      independentReviewCompletionClaimed:false,authorizesPublication:false,authorizesPhase3:false});
    expect(ledger.ownerApprovalDecision.approvedQuestionIds).toEqual(expectedIds.flat());
    expect(ledger.ownerApprovalDecision.recordedAt).toBe('2026-10-17T07:40:24Z');
    expect(ledger.finalOwnerApprover.status).toBe('approved');
  });
  it('limits content changes to authorized fields while keeping independent review distinct from owner approval', () => {
    const originalDraftHashes: Record<string, string> = {
      Q4:'ec2b5a8986bb144ae53b2d7a2027cbd9e658a639dbcd53a122142ddf3e01044d',
      Q5:'d4d96a424115ac6eb0c282d611e436e6a0955514b8240f49808bb6c40b30d09c',
      Q6:'5f8a9c4ae9c73f5385d16b46604fcdd56b1dd6de314adfca77ac0c8ce70cd1cd',
      Q10:'d8e54a7746e8c619e7a750f7e0853e3509f1ce818114f7b5a91c6086092746a2',
      Q12:'e2833f3d71d84fa7dd614c70d3a6ae334f5b0e58f7bd082d14dd82beabdd9186',
      Q18:'9b8fdde3d17ea8abfbaff906773acd0aa4fe24b63dfa73306b2eea4d0e3c2398',
      Q25:'f07fb75192da9ce8358d9678c42a8b0d05bb5469d1b02062e62dca15fc85bf17',
      Q26:'b4a60ae9cc2c951eaacfaad104b8cd86db6b3eda0227b65c131c26d3234d29cb',
      Q33:'311134d57ca39f35fa19c2afc12445b1c913e06826762b3c4ccb7ce2a6dc15ca',
      Q59:'67677fab438b4854fb1eee4c918fed8e7e2037d06569a9d23a98598988ff99bb',
    };
    const replacements: Record<string, {index: number; before: string; after: string}> = {
      Q18:{index:2,before:'Check the quarter through two independent routes: the corrected period results and the source totals.',
        after:'After correcting a figure, what other reported values might need a consistency check, and how could you verify them independently?'},
      Q59:{index:1,before:'For each proposal, distinguish changes to information, processing or permitted actions from changes to presentation.',
        after:'Write a brief before-and-after description of each proposal. Which facts about the approved workflow have actually changed?'},
    };
    expect(ledger.records.filter((r: {editorialRefinements?: unknown}) => r.editorialRefinements).map((r: {questionId: string}) => r.questionId))
      .toEqual(['Q18','Q59']);
    expect(ledger.records.filter((r: {sourceStatusCorrections?: unknown}) => r.sourceStatusCorrections).map((r: {questionId: string}) => r.questionId))
      .toEqual(['Q6','Q10','Q33']);
    for (const draft of drafts) {
      const restored = structuredClone(draft);
      const row = ledger.records.find((r: {questionId: string}) => r.questionId === draft.questionId);
      if (row.sourceStatusCorrections) {
        expect(row.sourceStatusCorrections).toHaveLength(1);
        const correction = row.sourceStatusCorrections[0];
        expect(Object.keys(correction.fields).sort()).toEqual(['reasoningMarkdown','sourceChecks[0].claim','sourceChecks[0].evidenceLocator']);
        expect(correction).toMatchObject({authorizedBy:'Repository owner (user)',authorizedOn:'2026-10-17',
          beforeDraftSha256:originalDraftHashes[draft.questionId],afterDraftSha256:row.draftSha256,afterProspectiveG1:row.prospectiveG1});
        expect(draft.reasoningMarkdown).toBe(correction.fields.reasoningMarkdown.after);
        expect(draft.sourceChecks[0].claim).toBe(correction.fields['sourceChecks[0].claim'].after);
        expect(draft.sourceChecks[0].evidenceLocator).toBe(correction.fields['sourceChecks[0].evidenceLocator'].after);
        for (const value of [draft.reasoningMarkdown,draft.sourceChecks[0].claim,draft.sourceChecks[0].evidenceLocator]) {
          expect(value).not.toMatch(/UNVERIFIED|unavailable|unread|not been retrieved|verification remains blocked/);
        }
        expect(draft.reasoningMarkdown).toContain('AI verification is complete; independent human verification is pending.');
        expect(draft.sourceChecks[0].evidenceLocator).toContain('independent human verification pending');
        restored.reasoningMarkdown = correction.fields.reasoningMarkdown.before;
        restored.sourceChecks[0].claim = correction.fields['sourceChecks[0].claim'].before;
        restored.sourceChecks[0].evidenceLocator = correction.fields['sourceChecks[0].evidenceLocator'].before;
      }
      const replacement = replacements[draft.questionId];
      if (replacement) {
        expect(draft.hints[replacement.index]).toBe(replacement.after);
        restored.hints[replacement.index] = replacement.before;
        expect(row.editorialRefinements).toHaveLength(1);
        expect(row.editorialRefinements[0]).toMatchObject({field:`hints[${replacement.index}]`,hintNumber:replacement.index+1,
          status:'owner-approved-editorial-refinement',approvedBy:'Repository owner (user)',approvedOn:'2026-10-17',
          previousText:replacement.before,approvedText:replacement.after,beforeDraftSha256:originalDraftHashes[draft.questionId],
          afterDraftSha256:row.draftSha256,afterProspectiveG1:row.prospectiveG1});
        expect(row.approvedG1).toBeNull();
        expect(row.independentReview.status).toBe('pending'); expect(row.finalOwnerApproval.status).toBe('approved');
      }
      // Undoing only the authorized fields must recover all original serialized
      // records. This protects hints/criteria/options/vocabulary and conclusions.
      expect(sha(JSON.stringify(restored))).toBe(originalDraftHashes[draft.questionId]);
    }
    const reconciled = sources.references.filter((r: {reconciliation?: unknown}) => r.reconciliation);
    expect(reconciled.map((r: {sectionHeading: string}) => r.sectionHeading)).toEqual([
      '14. Rule, reference, or procedure','12. The sequence runs cheapest first','16. Measure the thing you actually care about',
    ]);
    for (const ref of reconciled) {
      expect(ref.reconciliation).toMatchObject({checkedOn:'2026-10-17',
        checkedBy:'Codex (AI; not human sign-off)',exactOriginalSection:ref.sectionHeading,result:'ai-source-checked',humanSignOff:false});
      expect(ref.reconciliation.priorAttempts[0]).toMatchObject({result:'unverified',humanSignOff:false});
      expect(ref.reconciliation.navigation).toMatchObject({entryUrl:'https://agentfactory.panaversity.org/docs/how-to-think-ai-era',
        sidebarLink:'Workflow Design & Diagnosis'});
    }
    expect(ledger.independentAiAssessment).toMatchObject({path:'docs/PHASE-2-INDEPENDENT-REVIEW.md',
      kind:'Independent AI-assisted editorial assessment',humanReview:false});
    expect(ledger.independentAiAssessment.sha256).toBe(sha(readFileSync(new URL('../docs/PHASE-2-INDEPENDENT-REVIEW.md',import.meta.url))));
    expect(sources.independentAiAssessment).toEqual(ledger.independentAiAssessment);
  });
  it('binds the consolidated matrix to final hashes, pending independent review and actual owner approval', () => {
    const rows = text('FINAL-APPROVAL-MATRIX.md').split(/\r?\n/).filter(line => /^\| Q\d+ \|/.test(line))
      .map(line => line.split('|').slice(1,-1).map(cell => cell.trim().replaceAll('`','')));
    expect(rows).toHaveLength(10);
    expect(rows.map(row=>row[0])).toEqual(expectedIds.flat());
    for (const [i,row] of rows.entries()) {
      const record = ledger.records[i];
      expect(row).toEqual([record.questionId,record.draftSha256,record.prospectiveG1,'AI verified; human pending','Pending','Approved (2026-10-17)']);
      expect(record.approvedG1).toBeNull();
      expect(record.independentReview.status).toBe('pending'); expect(record.finalOwnerApproval.status).toBe('approved');
    }
  });
  it('independently recomputes every numerical case without relying on generated prose', () => {
    const math = (id: string) => ledger.records.find((r: { questionId: string }) => r.questionId === id).arithmeticCheck;
    const trial = [{id:'R',correct:6,cost:0.40},{id:'S',correct:8,cost:0.90},{id:'T',correct:8,cost:2},{id:'U',correct:8,cost:1.20}];
    const qualifiers = trial.filter(t => t.correct === 8);
    expect(math('Q5')).toEqual({qualifying:qualifiers.map(t=>t.id),costs:qualifiers.map(t=>t.cost),minimum:Math.min(...qualifiers.map(t=>t.cost))});
    expect(math('Q12')).toEqual({input:36,output:35,missing:36-35});
    const receipts = [420,360,300], refunds = [20,40,0];
    const monthly = receipts.map((v,i)=>v-refunds[i]);
    const sum = (values: number[]) => values.reduce((a,b)=>a+b,0);
    expect(math('Q18')).toEqual({monthly,receipts:sum(receipts),refunds:sum(refunds),total:sum(monthly)});
    expect(sum(monthly)).toBe(sum(receipts)-sum(refunds));
    expect(math('Q25')).toEqual({onlineExcluded:32-18,telephoneExcluded:20-0,totalExcluded:(32-18)+20});
    expect(math('Q33')).toEqual({existing:18+12,assisted:4+23,draftingReduction:18-4,checkingIncrease:23-12,saving:(18+12)-(4+23)});
  });
  it('rejects raw drafts and keeps even their prospective runtime forms unpublished', async () => {
    expect(productionCatalog).toEqual([]);
    const release = {schemaVersion:1,fingerprintVersion:1,source:batches[0].source,guideVersion:batches[0].plannedGuideVersion,
      contentStatus:'reviewed',questions:drafts};
    expect(guideReleaseSchema.safeParse(release).success).toBe(false);
    expect(await validatePublishedRelease(release)).toEqual({ok:false,code:'invalid-release'});
    expect(await validatePublishedRelease({...release,questions:drafts.map(prospective)})).toEqual({ok:false,code:'not-published'});
    expect(readdirSync(folder).every(f => f.endsWith('.md'))).toBe(true);
  });
  it('preserves raw original bank bytes', () => {
    for (const [file, expected] of [
      ['easy-question-bank.json','f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4'],
      ['question-bank.json','e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea'],
    ]) expect(sha(readFileSync(new URL(`../public/${file}`, import.meta.url)))).toBe(expected);
  });
});
