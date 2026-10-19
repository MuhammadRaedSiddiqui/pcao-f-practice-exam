import fs from 'node:fs';
const dir='docs/guided-practice/', evidence='test-results/guided-practice/phase-7-batch-2/';
const rows=JSON.parse(fs.readFileSync(evidence+'draft-identities.json','utf8'));
const before=JSON.parse(fs.readFileSync(evidence+'q24-authoring-adjustment-before.json','utf8'));
const table='| Item / review ID | Draft SHA-256 | q1 | Prospective g1 |\n| --- | --- | --- | --- |\n'+rows.map(r=>
  '| '+r.questionId+' / '+r.reviewId+' | '+r.draftSha256+' | '+r.sourceFingerprint+' | '+r.prospectiveG1+' |').join('\n');
const report=`# Phase 7 — Batch 2 review and owner handoff

2026-10-18 (Asia/Karachi). **Batch 2 drafting/source checks/focused validation complete; owner review pending.** Full Phase 7 remains in progress. All ten Batch 2 records are unpublished drafts, with **0/10 independent human reviews, 0/10 final owner educational approvals and null approved-g1 fields**. Across new Batches 1–2 those counts are 0/20 and 0/20. The owner's acceptance of initialization/Batch 1 is technical acceptance for continued drafting only; it is not educational approval, a review signature or an extension of the accepted pilot’s narrow waiver.

## Scope, inventory and deliverables

The [accepted initialization plan](PHASE-7-IMPLEMENTATION-PLAN.md), [Batch 1 review](PHASE-7-BATCH-1-REVIEW.md), [fifty-row inventory](PHASE-7-QUESTION-INVENTORY.md), established schemas/source-loading/fingerprint contracts, both review ledgers and the relevant original passages were read. This request authorizes only Batch 2. No batching conflict was identified; no original scenario or key was rewritten. The initialization plan, inventory and Batch 1 review stay byte-identical as historical evidence; current continuation is recorded here and in the content ledger.

Exact source-order IDs: **Q16, Q17, Q19, Q20, Q21, Q22, Q23, Q24, Q27, Q28**. These are the same ten original bank positions, verified against both the validated frozen bank and the plannedBatch=2 inventory rows. Bank SHA-256 matches **f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4**. Coverage: **ten unique items; nine single-response / one two-response (Q23); D1–D7 = 2/1/1/3/1/1/1; embedded table only in Q21; 41 original options; 10 original reference occurrences**. See [inventory evidence](../../${evidence}inventory-check.json).

- [Batch 2 fenced-JSON drafts](content/intermediate-expansion/batch-2.md).
- [Batch 2 exact solve-first source copy](content/intermediate-expansion/batch-2-questions-only.md), created separately so Batch 1’s solve-first copy remains unchanged.
- [Updated content ledger](PHASE-7-CONTENT-LEDGER.md), preserving all prior Batch 1 rows exactly and adding only these ten records. Thirty remaining rows stay unauthored.
- [Updated original-course ledger](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md), preserving all fourteen Batch 1 reference records exactly and appending ten Batch 2 checks.

Source identity: schema 1 / pcao-f-practice-easy-01 / bankVersion 1.0.0 / Intermediate. Final draft version **1**, authored 2026-10-18; planned guideVersion **1.1.0**, following the accepted full Intermediate release plan. No release is constructed. q1 uses the validated source tuple; draft SHA hashes UTF-8 JSON.stringify(draft) in stored order; prospective g1 changes only approval.status to approved in an in-memory structural projection. That projection still fails the actual empty production catalog. Review IDs identify candidates, not reviewer actions. Content, source, version or review-ID changes require recalculation and renewed affected educational review.

## Actual original-source checks

**10/10 passages inspected anew by the AI author for Batch 2, across ten distinct sections on six original course pages.** The inventory’s preliminary 2/10 availability was not reused as verification. The combined source ledger now contains 24/24 AI-checked reference occurrences for twenty draft guides; this remains 0/20 documented independent human source reviews. Each new reference records exact original metadata/index, a rendered passage range, a short verbatim supporting excerpt, a supporting-passage summary, the teaching claim and its scope limit.

| Item / source index | Original source and inspected passage | Grounded principle and limitation |
| --- | --- | --- |
| Q16 / 0 | [Workflow Design & Diagnosis](https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course), §11, lines 542–562 | Timing selects a hypothesis and a test; the case’s long-chat pattern supports a fresh-context test, not a proven diagnosis. |
| Q17 / 0 | [AI Fluency](https://agentfactory.panaversity.org/docs/ai-fluency-crash-course), §2, lines 257–320 | Compare participation and decision freedom across working arrangements; ongoing human exploration is the case requirement. |
| Q19 / 0 | [Governance](https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course), §2.4, lines 314–326 | Route/data/purpose authorization; the administrator’s existing approval and essential names are case facts. |
| Q20 / 0 | [Just Delegate It](https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course), §5, lines 484–511 | Source-bounded claims, inspectable evidence and explicit absence; no claim about actual allergy safety is added. |
| Q21 / 0 | [Workflow Design & Diagnosis](https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course), §2, lines 265–289 | Traceable/testable requirements and clarification of ambiguous delivery wording; the proposed time is not an agreement. |
| Q22 / 0 | [AI Prompting in 2026](https://agentfactory.panaversity.org/docs/ai-prompting-2026), §13, lines 832–860 | Model critiques flag concerns; grades/votes do not settle a fact contradicted by the supplied clause. |
| Q23 / 0 | [AI Prompting in 2026](https://agentfactory.panaversity.org/docs/ai-prompting-2026), §6, lines 472–492 | Neutral comparison and permission for uncertainty; no staffing choice or unstated cost is invented. |
| Q24 / 0 | [AI Prompting in 2026](https://agentfactory.panaversity.org/docs/ai-prompting-2026), §3, lines 272–289 | Match retrieval scope and verify freshness/source support; no current council deadline or fee is asserted. |
| Q27 / 0 | [Skills & Connectors](https://agentfactory.panaversity.org/docs/skills-connectors-crash-course), §9, lines 329–341 | Distinguish procedure from data access by function; per-run freshness and read-only approval are scenario constraints. |
| Q28 / 0 | [Workflow Design & Diagnosis](https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course), §8, lines 462–490 | Accountable map maintenance, scheduled/early review and evidence of actual checking; a volume change is not proof every check failed. |

All six original pages retrieved successfully in this pass. The workflow page was reached by following its original sidebar link from AI Fluency; sections 11, 2 and 8 were then inspected. There was no failed Batch 2 retrieval and no substituted secondary summary. Prior Batch 1 retrieval limitations remain historical evidence, unchanged. Line locators can drift with course edits, so exact headings/URLs and short support excerpts are retained. [Per-reference evidence](../../${evidence}source-checks.json) distinguishes original-course support from scenario facts, frozen-bank keys and AI author interpretation. **No necessary unsupported Batch 2 teaching claim or source blocker remains identified by the AI audit.** Independent human checking remains pending.

## Q21 table and constraint audit

The exact source table is:

| Requirement | Recorded basis |
| --- | --- |
| Weekly PDF | Manager’s email |
| Delivery by Saturday 9 a.m. | AI’s suggested interpretation |

Both column labels, both rows, the deadline text and both attribution cells are preserved byte-for-byte within the solve-first stem. Full question/options/sources are copied from the validated bank; the bank itself remains unchanged. The reasoning reads each requirement together with its recorded basis and explains why merely appearing in a table does not make the second row agreed. The weekly output is supported; the delivery time is a suggestion. Surrounding constraints remain: recipient, source file and PDF layout already agreed; “soon after Friday’s close” is ambiguous; no delivery cutoff has been agreed; Saturday staffing depends on it; the workflow has not been built. The guide proposes no replacement time and changes none of those facts.

Correct C establishes an operationally usable deadline with the lead, preserves the agreement separately from the request, then designs a schedule. Closest A has a legitimate implementation-test idea but delays requirement agreement. B adds false provenance and an unverified target. D improves notification without settling the staffing deadline. Focused tests compare every original table cell and the complete surrounding stem, and verify that replacing the suggested-deadline attribution changes q1.

## Hint and option quality findings

All thirty Batch 2 hints were reviewed individually and in cumulative order by the AI author. The sequence in each item moves from framing to discriminating evidence to a reasoning action; no sequence lists the keyed letter(s), final numerical result, copied full winning text or exhaustive eliminations of the alternatives. The final automated surface checks pass. These are AI editorial findings, **not independent proof of semantic non-leakage**.

| Item | Hint 1 → Hint 2 → Hint 3 | Closest alternative and independent-review focus |
| --- | --- | --- |
| Q16 | Timing → changed/stable inputs → isolate influence and preserve decisions | A/C: stronger wording or capability can look helpful, but do not isolate the suspected context influence. Review whether the third hint over-directs the test. |
| Q17 | Participation during development → exploration versus end approval → trace who proposes/challenges/revises | D: self-scoring is iteration, but not the educator’s desired involvement. Hints omit mode labels; review functional understanding over memorization. |
| Q19 | Data need and processing conditions → actual data path → authority plus matching utility | A/B: privacy settings or managed-looking interface can distract from route authorization. Hints prescribe no product/account label. |
| Q20 | Wording versus claim meaning → permitted evidence boundary → trace a promise and its gaps | C: softening tone retains the unsupported meaning. Review cumulative source cues without assuming a real allergy fact. |
| Q21 | Proposed versus agreed requirement → compare both table columns → observable timely-use check | A/B: implementation testing or a precise-looking time cannot establish the missing agreement. Hints give no row answer or invented deadline. |
| Q22 | Writing quality versus disputed fact → reviewers versus clause → trace claim then retain useful feedback | A: more reviewers may seem independent, but the clause is decisive. Hints give no threshold value. |
| Q23 | Permitted conclusions → equal burden of proof → simulate unresolved evidence | B/C: challenge can coexist with a preselected winner. Review cumulative strength carefully; no A/D pair or complete replacements appear in hints. |
| Q24 | Change rate/breadth → evidence obtained → verify source and round | C/B: prior official data or repeated current-looking claims still fail the needed current-round check. Hints omit retrieval-mode labels. |
| Q27 | Method versus input effort → capture time → trace later access/values/processing | A/C: enabling once or refreshing daily still leaves later snapshots. Hints omit Skill/Connector labels; review whether later-run simulation preserves useful reasoning. |
| Q28 | Map versus actual work → staffing/volume impact → ongoing mismatch detection and responsibility | B/A: one-time updating or a team label is incomplete maintenance. Hints do not supply a complete owner/date/trigger checklist. |

**41/41 original options** have nonblank satisfaction and limitation/failure explanations in original order, including each keyed option. Correct-option limits qualify scope or remaining implementation checks without contradicting the answer. Closest distractors are real excluded options. Every draft has relevant vocabulary, three decisive criteria and item-specific reasoning. All sixty hints and twenty reasoning blocks across Batches 1–2 are distinct.

Exact key audit: Q16 B; Q17 A; Q19 C; Q20 A; Q21 C; Q22 B; Q23 **A+D**; Q24 D; Q27 B; Q28 D. Q23 explains the pair’s complementary roles (symmetric comparison and visible evidence limits), and separately explains why B/C/E fail. There is no final recommendation for the real staffing choice because none is supplied by the scenario. Q22 retains **at least fifty**, not exactly fifty. No Batch 2 arithmetic answer is required: Q16’s early successes, Q21’s proposed time and Q28’s volume change are scenario evidence, not inferred performance guarantees or a new calculated target.

No newly identified Batch 1 content defect was found during this pass. Its already recorded human-review focus points remain pending. Batch 1 content, solve-first copy, review report and all existing ledger/source rows are unchanged. No repair was made to it.

## Exact ten final draft identities

${table}

All ten prospective review IDs use gp7-intermediate-q<ID>-v1. None indicates a performed review. [Machine-readable identities](../../${evidence}draft-identities.json) include source identity, version, key/selection count, provenance and the null human/owner/approved fields.

## Focused validation and preservation

| Check | Result |
| --- | --- |
| [Initial focused run](../../${evidence}focused-initial.log) | **160 passed / 1 failed**, eight files, no skip/retry. The conservative phrase filter matched the ordinary grammar “requested answer is” in Q24 Hint 1; it exposed no actual option or numerical result. |
| Authoring correction | Reworded only new Q24 Hint 1 to “Classify the information need by how quickly the facts can change and the breadth of the requested result.” Its q1 stayed unchanged; draft SHA/prospective g1 were recomputed. Assertions were not relaxed. [Original wording/identity](../../${evidence}q24-authoring-adjustment-before.json) is preserved; original draft SHA was ${before.initialIdentity.draftSha256}, prospective g1 ${before.initialIdentity.prospectiveG1}. |
| [Corrected focused run](../../${evidence}focused-final.log) and [current-candidate confirmation](../../${evidence}focused-current.log) | Each passes **161/161 checks in eight files**, zero skips/retries. Confirmation follows addition of short supporting excerpts to the source ledger; guide identities remain unchanged. Includes 18 new Batch 2 checks, all 19 established Phase 7/Batch 1 checks and existing content/fingerprint/schema/pilot/real-bank/approved-content checks. Counts are per run, not cumulative. |
| Schema/source/integrity | Ten-item order/positions/domain/type/table expectations; all exact q1/draft SHA/g1 values; complete 41-option and ten-source coverage; strict draft and prospective item schema; deterministic g1 under object-key reordering and content/version sensitivity; exact solve-first copy. |
| Production negative checks | Raw drafts fail approved-only release validation as invalid-release. Both Batch 2 projections and combined twenty-item prospective projections fail the unchanged actual production catalog as not-published. Catalog remains empty. |
| [Before manifest](../../${evidence}preservation-before.json) / [after check](../../${evidence}preservation-after.json) | **163/163 protected file hashes unchanged**, including both banks, accepted pilot guides/approvals, source/configuration/build files, Batch 1 draft/solve-first/review/plan/inventory and earlier evidence. Separate before copies prove all prior shared-ledger records remain identical. |
| Full application/browser regression, typecheck/build, preview/native accessibility | **Not run**, as requested for unpublished content. No prior application result is reclassified as a new run. |

Command: node node_modules/vitest/vitest.mjs run --configLoader runner tests/guidedPhase7Batch2Content.test.ts tests/guidedPhase7Content.test.ts tests/guidedPilotContent.test.ts tests/guidedContent.test.ts tests/guidedFingerprints.test.ts tests/guidedSchema.test.ts tests/realBank.test.ts tests/approvedContent.test.ts --maxWorkers 2.

The existing Phase 7 test file changes only evolving authoring-state expectations: it filters the combined source ledger to Batch 1’s exact fourteen references, permits the two new Batch 2 Markdown files and leaves only Batches 3–5 rows empty. All prior Batch 1 content/digest/option/source assertions remain. [The original test copy](../../${evidence}batch1-test-before.ts) is retained. The shared ledgers are the authorized evolving artifacts; [before content ledger](../../${evidence}content-ledger-before.md) and [before source ledger](../../${evidence}source-ledger-before.md) preserve their exact prior bytes.

## Decisions and stop condition

Batch 2 is ready for independent human and owner review, with no unresolved AI-identified source/key/option defect. Human semantic hint review remains especially important for Q21/Q23/Q27/Q28, alongside source, all-option/set, terminology and evidence-boundary review for every item. No signatures, human activities, learner-usability results or learning-effectiveness findings are invented. Technical completion does not provide final educational approval.

Next: solve [the exact Batch 2 questions](content/intermediate-expansion/batch-2-questions-only.md) before reading the answer-bearing draft/ledger, record independent findings against the exact identities above, and provide the owner decision on Batch 2/revisions. **Stop here for owner review. Batches 3–5 are not authored and require separate authorization.** The original pilot waiver remains limited to its ten accepted versions.

Production remains disabled/catalog empty. No original question, answer key, accepted guide, prior approval, Mock behavior, Guided storage/commitment/ownership/protection, analytics, backend or account requirement changed. No publication, enablement, deployment, commit/push or Phase 8. Native accessibility/device/other-browser obligations and historical PDF cancellation, recovery intermittency, timing/resource-pressure release-risk dispositions remain outstanding. Full Intermediate educational acceptance, compatibility/readability/full regression evidence and any release remain later gates.
`;
fs.writeFileSync(dir+'PHASE-7-BATCH-2-REVIEW.md',report);
console.log('Wrote Batch 2 review with ten final identities');
