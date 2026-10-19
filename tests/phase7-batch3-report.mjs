import fs from 'node:fs';
const dir='docs/guided-practice/',out='test-results/guided-practice/phase-7-batch-3/';
const rows=JSON.parse(fs.readFileSync(out+'draft-identities.json','utf8')),refs=JSON.parse(fs.readFileSync(out+'source-checks.json','utf8'));
const identityTable='| ID / review ID | Draft SHA-256 | q1 | Prospective g1 |\n| --- | --- | --- | --- |\n'+rows.map(r=>'| '+r.questionId+' / '+r.reviewId+' | '+r.draftSha256+' | '+r.sourceFingerprint+' | '+r.prospectiveG1+' |').join('\n');
const sourceTable='| Item / source index | Exact original source section / inspected lines | Verified teaching claim |\n| --- | --- | --- |\n'+refs.map(r=>'| '+r.questionId+' / '+r.sourceIndex+' | ['+r.courseTitle+']('+r.url+') — '+r.sectionHeading+'; '+r.originalPassageLines.join('–')+' | '+r.claim+' |').join('\n');
const text=`# Phase 7 — Batch 3 review and owner handoff

2026-10-18 (Asia/Karachi). **Batch 3 drafting, original-source inspection and focused validation complete; owner review pending.** Full Phase 7 is in progress. Exactly ten new drafts were prepared; no Batch 4/5 records were authored. The owner's acceptance of Batch 2 is technical acceptance for continued drafting only. It supplies no final educational approval of Batch 1–2 and no extension of the accepted ten-pilot waiver.

Batch 3 has **0/10 independent human reviews, 0/10 owner educational approvals and no actual approved g1**. Across the thirty new Phase 7 drafts these counts remain **0/30 and 0/30**, distinct from the original ten accepted pilot versions. No human source/solve-first/hint review, review signature, learner result or educational acceptance is inferred from automated checks or AI authorship.

## Exact authorized scope and inventory

Read: [initialization plan](PHASE-7-IMPLEMENTATION-PLAN.md), [fifty-row inventory](PHASE-7-QUESTION-INVENTORY.md), evolving content/source ledgers, [Batch 1 review](PHASE-7-BATCH-1-REVIEW.md), [Batch 2 review](PHASE-7-BATCH-2-REVIEW.md), Phase 2 content standards and the unchanged source-bank/schema/loading/q1/g1 contracts. The attached “Phase 7 Batch 3 Authorization” is the current bounded authority. No conflict with original bank-order batching was found.

**IDs in validated bank order: Q29, Q30, Q31, Q32, Q34, Q35, Q36, Q37, Q38, Q39.** Original positions are those same one-based positions; exact IDs were read from the real bank and authoritative plannedBatch=3 rows, not synthesized. Verified **10 unique items, 8 single-response / 2 two-response, D1–D7 = 1/3/2/0/1/1/2, embedded tables Q30/Q31, 42 options and 12 source references**. The double-response items are Q31 and Q38. [Inventory evidence](../../${out}inventory-check.json).

Frozen Intermediate bank byte SHA-256 matches **f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4**. Source identity is schema 1 / exam pcao-f-practice-easy-01 / bankVersion 1.0.0 / difficulty Intermediate. Both bank files remain unchanged. No replacement scenario, table, option ordering, answer key or selection count was generated.

## Deliverables and provenance

- [Ten Batch 3 draft records](content/intermediate-expansion/batch-3.md), fenced JSON in the established authoring schema.
- [Exact Batch 3 solve-first copy](content/intermediate-expansion/batch-3-questions-only.md), without answers or feedback; every original stem, quote, table, option and source is retained.
- [Updated fifty-row content ledger](PHASE-7-CONTENT-LEDGER.md): thirty authored new drafts; twenty later rows unchanged/unauthored; every existing Batch 1–2 row preserved exactly.
- [Updated original-course ledger](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md): prior 24 references and Batch 2 metadata preserved exactly, twelve new checks appended, previous retrieval/decision histories retained.

Every new guide has three progressive hints, three decisive criteria, scenario-specific reasoning, all-option satisfaction/limits, closest plausible distractors, relevant vocabulary, zero-based source checks and draft-only review metadata. Draft version **1**, authored 2026-10-18, planned guideVersion **1.1.0**. Draft SHA-256 hashes UTF-8 JSON.stringify(draft) in stored property order. q1 binds the exact validated source tuple; prospective g1 uses the existing canonicalizer on an in-memory projection changing only approval.status to approved. This is an identity/structural check, not a runtime approval or release. All approvedG1 and human/owner approval fields stay null. Content, source, review-ID or version edits require new digests and affected re-review.

Scenario facts and table values come from the frozen bank. Correct sets and original option requirements come from its approved key/explanations. The course provides general principles; applying those principles to the fictional case is AI author interpretation and remains subject to independent human review. No real product, company, grant, data-processing approval or operational outcome is invented.

## Original-course verification

**12/12 exact reference passages independently inspected by the AI author in this Batch 3 pass**, twelve distinct sections on eight original course pages. Earlier batch verification and the inventory’s 0/12 preparation count were not treated as current evidence. Combined new-draft source coverage is now **36/36 reference occurrences**, with no human source sign-off implied. [Per-reference evidence](../../${out}source-checks.json) records exact titles/headings/URLs/indices, inspected line ranges, short supporting excerpts, passage summaries, teaching claims and relevant limits.

${sourceTable}

All eight original pages were available during this pass. Workflow was reached through its original AI Fluency sidebar link, then exact sections 12 and 11 were read; the other seven pages opened directly. There were no failed Batch 3 retrievals and no secondary-source substitutes. Original passages may change after inspection; exact headings/URLs and excerpts supplement rendered line ranges. Earlier retrieval failures remain unchanged historical evidence. **No necessary Batch 3 claim remains source-pending or blocked in the AI audit.** Independent human original-source verification remains required for educational acceptance.

The scope of support is bounded. Courses do not establish the fictional sample figures, pre-repair threshold, staffing authority, missing private measurement or actual export content. The Q29 source supports known-answer execution checks, not a guarantee that running code is sufficient. Q37 timing supports a stale-configuration hypothesis, not an already proven mismatch. Q38 sources explain reasoning/context limits; the case additionally states that tools cannot access the missing measurement. The actual-result inspection in Q34 follows the course’s claim/source method and the scenario’s stated export risk.

## Table preservation and interpretation

Q30’s original table is preserved exactly:

| Measure | Result |
| --- | ---: |
| Correct answers checked | 98% |
| Customers resolving their problem | 24% |

Both measure labels, result values, percent units, alignment row and row order are unchanged in the copied stem. Surrounding constraints also remain exact: unattended routine setup support; manuals substantiate the instructions; many unresolved customers report repeated accurate instructions without help when a step fails; the audit does not explain every unresolved case. Accuracy of individual answers is distinct from user resolution. The two figures do not supply common denominators or case linkage, so the guide does **not** subtract them to infer overlap or label all unresolved customers as factual-error cases. Correct A investigates the unresolved interaction sequences and later actions. B repeats accuracy checking; C overstates what unresolved outcomes prove; D rates replacement wording without investigating the observed service behavior.

Q31’s original table is preserved exactly:

| Configuration | Summaries passing | Extractions passing |
| --- | ---: | ---: |
| R | 9 of 10 | 7 of 10 |
| T | 8 of 10 | 10 of 10 |

Column names, configuration labels, cell ordering and “of 10” units remain exact. Surrounding constraints remain: independently checked answer standard for each task; matched inputs/briefs; equal costs; at least nine passes per task before repairs; separate configurations permitted; combined workflows untested; later staff checks continue. Per-cell threshold audit: R summaries **9 ≥ 9** qualifies; R extractions **7 < 9** fails; T summaries **8 < 9** fails; T extractions **10 ≥ 9** qualifies. The complete keyed assignment is **B+D**, not a general ranking or a combined-model result. Costs cannot break a tie because they are equal; later repairs do not repair the trial evidence retroactively. Future checking remains necessary.

There are two dedicated table-preservation cases plus a full solve-first equality case. They compare the actual original stem and table rows to the copy and verify q1 changes on row deletion, reordered rows, edited headings and changed values. Hint guards exclude digits/percentages/option letters; no decisive table value, final qualification or selected pair appears in a hint.

## Hint and option audit

The AI author read every hint separately and in cumulative order. Each sequence frames the problem, points to evidence or constraints, then asks for a reasoning action. None supplies answer letters, the complete multi-select set, final arithmetic, copied full winning wording or an exhaustive elimination list. A surface pass is limited evidence; **semantic/cumulative non-leakage still requires independent human review**. Functional tests and evidence boundaries replace product-label memorization.

| Item | Hint 1 → Hint 2 → Hint 3 | Strongest alternatives / remaining human focus |
| --- | --- | --- |
| Q29 | Remaining evidence gap → explanation versus execution → known-subset test plan | B: stronger reasoning can seem helpful but is less direct than testing execution. Human focus: test action without implying code guarantees correctness. |
| Q30 | Reply measure versus purpose → label/value reading and checked evidence → competing explanations/observations | D/B: readability or more accuracy samples may help other questions. Review that cumulative cues preserve investigation rather than supplying the sole cause. |
| Q31 | Task qualification → column and pre-repair boundary → qualification grid | C/E: neighboring-task success or an untested combination cannot qualify. Review grid cue strength; learner still compares all cells and determines the complete pair. |
| Q32 | Commitment boundary → existing checks versus policy → trace release authority | B/A: person/timing or fact checking alone is incomplete. Hints do not enumerate the entire winning role/fact/time combination. |
| Q34 | Actual accepted artifact → distinguish representations → trace a material term | C: opening/download success is insufficient. Review whether the final reasoning action is helpful without restating every winning inspection step. |
| Q35 | Failure to start versus execute → intended eligibility/exclusions → simulate request cases | D/A: duplicate or edit the method versus correct activation. Hints omit Skill/description labels; assess the functional distinction. |
| Q36 | Format versus business meaning → unspecified contribution → compare interpretations and authority | D/B: listing exceptions or agreement between scripts does not settle local meaning. No duplicate/blank default is supplied. |
| Q37 | Timing and completed checks → published versus supplied source → trace an erroneous product | A/C: stronger prose or another fresh chat leaves loaded versions unknown. Human focus: avoid treating the leading hypothesis as established. |
| Q38 | Supported analysis versus missing decision fact → observation/assumption and capacity → label recommendation premises | D/B: agreeing estimates or inferred demand are not measurements. Review cumulative strength for the A/C pair; no demand figure or preferred layout appears. |
| Q39 | Execution versus outcome → day/status relevance → list proven/unknown facts and discriminating check | A/D: old-file continuity or prompt diagnosis can look expedient. Hints do not invent a missing-output cause or supply all required success conditions. |

All **42/42 original options** are evaluated in original order. Correct-option limits state scope, companion work or future checks without negating the key. The ten reasonings differ by scenario, with no generic feedback copied across questions. All ninety hints and thirty reasoning blocks across Batches 1–3 are distinct strings; this is not proof of semantic quality. Vocabulary is provided for every guide under the existing schema; runtime UI visibility is unchanged.

Key audit: **Q29 C; Q30 A; Q31 B+D; Q32 C; Q34 D; Q35 B; Q36 C; Q37 D; Q38 A+C; Q39 B.** Q31’s pair supplies a qualifying assignment for each task and explains A/C/E exclusions. Q38’s pair supplies useful conditional analysis now and a checked private fact before actual-demand advice; B/D/E cannot supply that absent measurement. A alone leaves it absent, while C alone does not perform the interim trade-off analysis requested. No warehouse layout, checkout total or delivery average is manufactured.

No newly identified prior-batch defect was found requiring a separate repair. Existing Batch 1–2 human-review concerns remain pending. No earlier draft, solve-first file, review report or prior ledger/source record was edited.

## Exact final draft identities

${identityTable}

[Machine-readable identities](../../${out}draft-identities.json) retain version, original key/cardinality and the null approved/human/owner fields. Review IDs are prospective references only, not signatures. These ten new records remain drafts.

## Focused validation and preservation

| Check | Outcome |
| --- | --- |
| [Initial focused run](../../${out}focused-initial.log) | **181/181 tests in nine files**, zero failed/skipped/retried. Includes twenty new Batch 3 checks and all 161 established focused checks. |
| [Final focused run](../../${out}focused-final.log) | **181/181 tests in nine files**, zero failed/skipped/retried. Strengthened the test-only table-mutation check to ensure row reversal actually changes the input before digest comparison. No guide/identity/expectation was relaxed or changed; counts are per run, not cumulative. |
| Source/schema/identity | Exact IDs/positions/source/q1, ten draft SHA/g1 pairs, strict three-hint cardinality, 42 options, twelve indexed source checks, deterministic serialization/object-key canonicalization and content/review-ID/version/source sensitivity pass. |
| Tables and selection sets | Both full stems/tables preserved; edited columns/values/rows change q1; independent four-cell threshold comparisons and both complete multi-select sets pass; no Q30 overlap computation is invented. |
| Production negative checks | Raw drafts rejected as invalid-release; both new ten-entry and combined thirty-entry in-memory approved projections rejected as not-published by the actual empty production catalog. |
| [Before manifest](../../${out}preservation-before.json) / [after check](../../${out}preservation-after.json) | **182/182 protected files unchanged**, including both banks, pilot guides/approvals, runtime/configuration/build inputs, Batches 1–2 drafts/solve-first/reviews, accepted plan/inventory and earlier evidence. |
| Evolving shared ledgers | All prior twenty content rows, all prior twenty-four source rows and prior batch metadata remain exact. Twenty later rows remain unchanged/unauthored. Original before copies retained in this evidence folder. |
| Full app/browser/release suites, typecheck/build, preview, native accessibility | **Not run**, as requested for unpublished content; earlier evidence retains its original scope. |

Command: node node_modules/vitest/vitest.mjs run --configLoader runner tests/guidedPhase7Batch3Content.test.ts tests/guidedPhase7Batch2Content.test.ts tests/guidedPhase7Content.test.ts tests/guidedPilotContent.test.ts tests/guidedContent.test.ts tests/guidedFingerprints.test.ts tests/guidedSchema.test.ts tests/realBank.test.ts tests/approvedContent.test.ts --maxWorkers 2.

The two existing Phase 7 test files change only evolving-state assumptions: allow the two Batch 3 Markdown files; leave Batches 4–5 empty; filter the source/draft checks to preserve prior-batch scope. Existing Batch 1–2 guide/schema/digest/key/option/source assertions remain. [Batch 1 test before](../../${out}batch1-test-before.ts), [Batch 2 test before](../../${out}batch2-test-before.ts), [content ledger before](../../${out}content-ledger-before.md) and [source ledger before](../../${out}source-ledger-before.md) are preserved. No application code or production schema changed. Earlier failed authoring/test/retrieval evidence is preserved; no failed Batch 3 source/test result is omitted or reclassified.

## Remaining gates and owner decision

No unresolved AI-identified source, table, option or key defect remains in Batch 3. Independent educational review remains pending for every new guide, especially cumulative cue strength in Q30/Q31/Q32/Q38, hypothesis versus proof in Q29/Q37, and information/representation boundaries in Q34/Q36/Q39. Review solve-first answers, the exact original passages, all hints/options/sets, vocabulary and arithmetic against these final identities, then obtain separate owner educational approval. Technical acceptance of earlier batches is not that approval, and the original pilot waiver is not extended.

Next: use [the Batch 3 solve-first copy](content/intermediate-expansion/batch-3-questions-only.md), review the draft/evidence and provide the Batch 3 acceptance or revision decision. **Stop here for owner review. Batches 4 and 5 remain unauthored and require separate authorization.**

Production remains disabled and the catalog empty. No original banks, accepted pilot guidance/approvals, Batch 1–2 content, Mock behavior, Guided persistence/commitment/ownership/protection, analytics, backend or account requirement changed. No publication, enablement, deployment, commit/push or Phase 8. Native accessibility/device/other-browser obligations and historical PDF cancellation, recovery intermittency, timing/resource-pressure release dispositions remain outstanding; no new release-readiness, responsiveness or learning-effectiveness result is claimed.
`;
fs.writeFileSync(dir+'PHASE-7-BATCH-3-REVIEW.md',text);console.log('Wrote Batch 3 review with ten exact identity triplets');
