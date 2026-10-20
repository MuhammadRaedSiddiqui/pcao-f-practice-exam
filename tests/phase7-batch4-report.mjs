import fs from 'node:fs';
const dir='docs/guided-practice/',out='test-results/guided-practice/phase-7-batch-4/';
const rows=JSON.parse(fs.readFileSync(out+'draft-identities.json','utf8')),refs=JSON.parse(fs.readFileSync(out+'source-checks.json','utf8'));
for(const log of ['focused-initial.log','focused-final.log'])if(!/201 passed/.test(fs.readFileSync(out+log,'utf8')))throw new Error('Missing passing evidence');
const preservation=JSON.parse(fs.readFileSync(out+'preservation-after.json','utf8'));if(!preservation.ok||preservation.protectedFiles!==200)throw new Error('Preservation check required');
const identityTable='| ID / prospective review ID | Draft SHA-256 | q1 | Prospective g1 |\n| --- | --- | --- | --- |\n'+rows.map(r=>'| '+r.questionId+' / '+r.reviewId+' | '+r.draftSha256+' | '+r.sourceFingerprint+' | '+r.prospectiveG1+' |').join('\n');
const sourceTable='| Item / source index | Original section and inspected lines | Verified teaching claim |\n| --- | --- | --- |\n'+refs.map(r=>'| '+r.questionId+' / '+r.sourceIndex+' | ['+r.courseTitle+']('+r.url+') — '+r.sectionHeading+'; '+r.originalPassageLines.join('–')+' | '+r.claim+' |').join('\n');
const fence='```';
const text=`# Phase 7 — Batch 4 review and owner handoff

2026-10-18 (Asia/Karachi). **Exactly ten Batch 4 drafts authored, original passages inspected and focused validation complete; stop for owner review.** Full Phase 7 remains in progress. Owner acceptance of Batch 3 is technical acceptance for continued drafting only. It grants no final educational approval of Batches 1–3 and no extension of the exact ten-pilot waiver. No Batch 5 guide is authored.

Batch 4 remains **0/10 independent human educational reviews, 0/10 final owner educational approvals and no approved g1**. Across Batches 1–4 these counts are **0/40 and 0/40**, with every approved digest null. AI source inspection and automated checks do not supply human source verification, solve-first performance, review signatures, learner-usability or learning-effectiveness evidence.

## Scope and authoritative inventory

Read the [accepted initialization plan](PHASE-7-IMPLEMENTATION-PLAN.md), [fifty-row inventory](PHASE-7-QUESTION-INVENTORY.md), evolving content/source ledgers, [Batch 1](PHASE-7-BATCH-1-REVIEW.md), [Batch 2](PHASE-7-BATCH-2-REVIEW.md) and [Batch 3](PHASE-7-BATCH-3-REVIEW.md) reviews, established Phase 2 content conventions, original passages and unchanged schema/source/fingerprint/approval contracts. [Phase 6 owner acceptance](PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md) remains intact. The attached “Phase 7 Batch 4 Authorization” supplies this pass’s bounded authority; no conflict with the frozen ordering was found.

Verified before drafting against the real bank and plannedBatch=4 inventory: **Q40, Q41, Q42, Q43, Q44, Q45, Q46, Q47, Q48, Q49**, original one-based positions **40–49**, ten unique IDs. **Nine single-response / one two-response; Q42 is the double-response item. D1–D7 = 1/2/1/2/2/1/1. Embedded table: Q41; fenced packaging artifact: Q47. 41 original options and 12 original references.** See [inventory evidence](../../${out}inventory-check.json). These facts were read, not inferred from expected counts.

Frozen Intermediate bank byte SHA-256: **f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4**. Source identity: schema 1 / exam pcao-f-practice-easy-01 / bankVersion 1.0.0 / difficulty Intermediate. Both banks retain their original bytes. No question wording, key, selection count, option order or scenario artifact was rewritten.

## Deliverables and provenance

- [Ten Batch 4 draft records](content/intermediate-expansion/batch-4.md), using the established fenced-JSON authoring wrapper.
- [Exact solve-first copy](content/intermediate-expansion/batch-4-questions-only.md), containing original stems/options/sources without answers or feedback.
- [Content ledger](PHASE-7-CONTENT-LEDGER.md): forty authored drafts; thirty prior rows unchanged; ten Batch 5 rows unchanged and unauthored.
- [Source-verification ledger](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md): twelve new passage records; all thirty-six prior records and earlier metadata/history retained exactly.

Each guide contains three progressive hints, three decisive criteria, scenario-specific reasoning, every original option’s satisfaction and limits, closest plausible distractors, relevant vocabulary, indexed source checks and draft-only review metadata. Draft version **1**; planned guideVersion **1.1.0**. Scenario facts come from the frozen bank, correct selections and option requirements from its unchanged keys/explanations, general principles from the inspected courses, and the case-specific teaching application from the AI author. No later human decision or new operational fact is asserted.

Draft SHA-256 hashes UTF-8 JSON.stringify(draft) in stored property order. q1 binds the unchanged validated source tuple. Prospective g1 uses the existing canonicalizer on an **in-memory projection** changing only approval.status to approved. It establishes identity/structural compatibility, not approval or publication. No approved release or projection is persisted, catalogued or allowlisted. All actual approvedG1/human/owner approval fields remain null. Content, source, review-ID or guide-version edits require new identities and affected re-review.

## Original-course verification

**12/12 references inspected anew by the AI author for this batch**, twelve distinct passages on seven original course pages. The inventory’s preliminary 1/12 availability count was not reused as verification. Combined authored source coverage is **48/48 reference occurrences**, with **0/40 independent human source reviews**. [Per-reference evidence](../../${out}source-checks.json) and the evolving source ledger retain exact course titles, original URLs, section headings, zero-based indices, inspected ranges, short supporting excerpts, summaries, claims and limitations.

${sourceTable}

All seven original pages retrieved successfully in this pass. Workflow was reached through its original AI Fluency sidebar, then sections 13 and 12 were inspected; the other six opened directly. There were **no failed Batch 4 source retrievals or secondary-source substitutions**. Previous retrieval failures remain preserved history. Rendered line numbers can drift, so exact headings/URLs and short excerpts accompany them. No accessible-but-uninspected reference was promoted to evidence. **No necessary Batch 4 teaching claim remains source-blocked in the AI audit; independent human source review is still pending.**

Support has explicit boundaries. Q43’s non-expert exercise illustrates unreliable intuitive acceptance; assigning the available engineer to the capacity check is the scenario application, not a quotation from that exercise. Q44’s company channel/owner and unknown onward exposure come from the case. Q46’s approved cloud route and prior review authority are given facts, not certification of a current service. Q47 is governed by the stated course package convention; the guide invents no alternative loader behavior. Q48’s numbers are case observations, and Q49 supplies no data from which to compute a numerical forecast.

## Q41 table and decision conditions

The original table is reproduced exactly in the solve-first stem:

| Test | Result |
| --- | --- |
| Normal month | Passed |
| Empty month | Not tried |
| Messy expense entries | Not tried |
| Unrelated short message | Not tried |

Both headings, delimiter row, four test rows, all cell wording and ordering remain exact. There are no numeric units or arithmetic operations in this table. It supplies **one observed pass and three untried cases**, not three failures or a release success rate. Surrounding constraints remain exact: four-section output, expense grouping, a defined empty-month rule, successful normal activation/output, unchanged procedure, intended colleague reuse and no other release checks.

Correct C tests empty/messy outputs against the rules and unrelated-request non-activation, repairs observed failures and retests before reuse. An unchanged procedure preserves the relevance of the normal pass; it cannot turn untried cases into observed successes. A repeats normal inputs, B reviews instructions rather than behavior, and D postpones the identified missing evidence until colleagues encounter it. No defect is presumed before a test reveals one. Hints do not name table statuses, provide a verdict on any untried case, list C’s entire plan or enumerate exclusions of A/B/D.

The focused equality test compares the **complete original stem** with the solve-first copy. Dedicated assertions check each exact row and heading; row deletion, header change, status change and row reversal must actually change the stem and its q1. Thus a changed table cannot retain the original identity.

## Q47 fenced artifact and interpretation

The original artifact is retained with its text language tag, opening/closing fences, newline placement and two spaces before the file:

${fence}text
stock-summary/
  guide.md
${fence}

The raw bank stem, validated stem and solve-first copy agree exactly, including all surrounding constraints: valid name/description frontmatter, tested instructions, name stock-summary, intended-request description, no required external assets/scripts and the smallest packaging correction. The directory is already appropriately named; the required main **file** is exactly SKILL.md inside it. Correct D renames guide.md while retaining its valid contents and checking the package. A cannot replace the convention with a description note; B confuses directory and file requirements; C changes the requested installable package into a Project reference. No fallback metadata-discovery mechanism or successful installation is invented.

Targeted mutations change the file name, folder name, indentation, fence language tag and fence delimiters; each mutation is nonidentical and changes q1. Hints avoid the canonical filename, the existing filename and an instruction to rename it. They ask the learner to map structural roles and compare the smallest correction, leaving the course convention and selected operation for the learner to apply.

## Hint, option and numerical audit

The AI author read each hint independently and each three-hint sequence cumulatively. The progression frames the problem, identifies relevant evidence/comparisons, then asks for a concrete reasoning action. No hint contains a standalone option letter, copied complete winning option, final arithmetic result or complete Q42 pair. None enumerates all losing options. Distinct functional requirements replace product-label drills. Automated surface checks support this editorial finding but **do not certify independent semantic or cumulative non-leakage**.

| Item | Hint 1 → Hint 2 → Hint 3 | Closest distractors and independent-review focus |
| --- | --- | --- |
| Q40 | Repeatable work/evidence → transformation versus examples → colleague handover test | C/D preserve intent or history but omit the tested implementation handover. Review cumulative same-implementation cue without disclosing the complete artifact bundle. |
| Q41 | Checklist as observed evidence → added information from untried rows → expected behavior per remaining case | B/D look like quality review or cautious rollout. Judge whether the activation/output cue is appropriately helpful while leaving case outcomes undecided. |
| Q42 | Inspectable revision → purpose versus measurable style → polished-but-unhelpful counterexample | C/D improve craft or variety without settling content. No audience/action pair is supplied in hints; review the combined cue strength. |
| Q43 | Quote accuracy versus inference → unassessed premise/evidence → specification-to-building trace | C/A repeat accurate facts or model agreement. Hints name neither the engineer nor a unit choice; review applicability cues. |
| Q44 | Known/unknown event → spread/record/authority → justification for resolution claim | A/B offer cleanup or investigation but delay the stated process. Review whether cumulative authority/evidence cues remain scaffolding rather than the whole response sequence. |
| Q45 | Required result → exact processing versus communication → approach-specific acceptance checks | B/A each fit one part but force one approach on both. Hints avoid naming the complete execution/drafting pairing or any product. |
| Q46 | Trace trial under intended conditions → established versus dependent obligations → distinguish empty from missing through observations | D fixes reach but omits outcome semantics/trial. Hints do not specify the cloud destination, trial count or entire winning preparation. |
| Q47 | Structure before content → valid parts and naming roles → map hierarchy requirements | B/A confuse roles or metadata with structural convention. Human focus: whether structural cues preserve recall/application without revealing the required filename. |
| Q48 | Belief/evidence/outcome timeline → prior reversal condition versus preference → later reviewer’s learning | C/D mislabel a justified update or erase its baseline. Hints provide no counts, comparison result or conclusion that the trigger was met. |
| Q49 | Remaining diagnostic mismatch → history versus unsettled future → evidence needed for certainty/useful task | A/B can improve analysis without supplying a guarantee. Hints do not name a range or driver model; review whether task-fit cues retain the learner’s decision. |

**41/41 original options** have nonblank satisfaction/limitation comparisons in original order. All closest distractors are actual non-keyed options. Correct-option limits state companion work, scope or later checks without contradicting the key. Each guide has relevant terms with definitions. Across Batches 1–4, all **120 hints and forty reasoning blocks are distinct strings**; uniqueness is not evidence of independent educational quality.

Key audit: **Q40 A; Q41 C; Q42 B+E; Q43 B; Q44 D; Q45 C; Q46 A; Q47 D; Q48 B; Q49 C.** Q42 explains both complementary selections: B supplies audience-relevant content, E supplies the registration action/channel/deadline. Each alone leaves part of the stated goal unresolved. A/C/D are explained individually; measurable style is not dismissed as inherently useless, only insufficient for this content problem.

Numerical/evidence audit: Q48’s checked registrations meet the pre-set reversal condition (**46 > 40**). Later attendance is **43**, also above forty but a different observation from registrations. **70%** is the recorded prior confidence, not an observed accuracy rate; a single outcome does not establish long-run calibration. No registration/attendance equality is inferred. Q45’s 1,500 rows justify required exact processing but supply no total to calculate. Q41 requires categorical test interpretation, not invented failure arithmetic. Q49 supplies no numerical donation forecast. No final values appear in hints.

No unresolved AI-identified Batch 4 source, key, table, artifact or option defect remains. No new earlier-batch defect was identified requiring owner repair. Earlier human-review concerns remain pending; no prior content/report/approval record was changed to address them.

## Exact final draft identities

${identityTable}

[Machine-readable identities](../../${out}draft-identities.json) retain draftVersion 1, guideVersion 1.1.0, source bindings, original sets/cardinality, provenance and null approval fields. Prospective review IDs are candidate identifiers, never performed-review evidence.

## Focused validation and preservation

| Check | Outcome |
| --- | --- |
| [Initial focused run](../../${out}focused-initial.log) | **201/201 tests in ten files**, zero failures/skips/retries. Twenty new Batch 4 cases plus the established 181 focused checks. |
| [Final focused run](../../${out}focused-final.log) | **201/201 tests in ten files**, zero failures/skips/retries. Added explicit g1 source-identity sensitivity and changed-draft SHA sensitivity checks; no content or assertions were relaxed. Counts are per run, not cumulative. |
| Inventory/schema/identity | Exact ten IDs/positions/domain/type/source/q1, all draft SHA/prospective g1 values, three hints, complete options/indexed sources, deterministic serialization/key canonicalization and content/review-ID/version/source sensitivity pass. |
| Q41/Q47 and selection sets | Full stem/copy equality, exact table/tree preservation and targeted mutation detection pass. Q42’s complete complementary set and Q48’s trigger/observation distinction pass. |
| Production negative checks | Raw drafts rejected as invalid-release. Both ten-entry and combined forty-entry in-memory approved projections rejected as not-published by the unchanged empty production catalog. |
| [Before manifest](../../${out}preservation-before.json) / [after check](../../${out}preservation-after.json) | **200/200 protected file byte hashes unchanged**, including both banks, ten accepted pilot guides/approvals, Batches 1–3 drafts/solve-first/reports, accepted plan/inventory, runtime/configuration/build inputs and earlier evidence. |
| Evolving shared ledgers | Thirty earlier content rows, thirty-six earlier source records and all earlier source metadata remain exact. Ten Batch 5 rows remain exact/unauthored. Prior narrative retained. |
| Full app/browser regressions, typecheck/build, preview and native accessibility | **Not run** for this unpublished content pass. Existing results retain their historical scope. |

Command: node node_modules/vitest/vitest.mjs run --configLoader runner tests/guidedPhase7Batch4Content.test.ts tests/guidedPhase7Batch3Content.test.ts tests/guidedPhase7Batch2Content.test.ts tests/guidedPhase7Content.test.ts tests/guidedPilotContent.test.ts tests/guidedContent.test.ts tests/guidedFingerprints.test.ts tests/guidedSchema.test.ts tests/realBank.test.ts tests/approvedContent.test.ts --maxWorkers 2.

The three existing Phase 7 test files change only evolving-state expectations: allow the two Batch 4 Markdown files; scope Batch 3’s source/draft assertions to its original thirty guides/36 references; leave only Batch 5 unauthored. All prior guide/key/schema/option/digest/source checks remain. [Batch 1 test before](../../${out}batch1-test-before.ts), [Batch 2 test before](../../${out}batch2-test-before.ts), [Batch 3 test before](../../${out}batch3-test-before.ts), [content ledger before](../../${out}content-ledger-before.md) and [source ledger before](../../${out}source-ledger-before.md) retain the earlier bytes. Current status entries are added to project guidance without rewriting historical reports or acceptance decisions. [Document checks](../../${out}document-checks.json) validate local links and reported identities.

No Batch 4 source or focused test failure required a content correction. The [initial document check](../../${out}document-checks-initial.json) flagged only its own not-yet-created output target. The checker now materializes its progress artifact before validating the report’s self-link, then replaces it with completed results; all links and identities are checked without an exception or relaxed assertion. The corrected document check passes. Drafts and identities did not change. Earlier failed/corrected attempts remain unchanged evidence. A read-only lookup used four shortened documentation filenames that do not exist; rg --files located the actual GUIDED-PRACTICE-prefixed files. Git status reported an inaccessible global ignore file; it still returned the working-tree listing. These tooling observations are not application failures or approval rejections and prompted no configuration changes. [Tooling observations](../../${out}tooling-attempts.json) retain these limits.

## Remaining owner decisions and stop

Review the [solve-first copy](content/intermediate-expansion/batch-4-questions-only.md) before the answer-bearing drafts. Record independent human findings against these exact identities: original passages, each hint and cumulative sequence, every option/full set, terminology, Q41/Q47 evidence preservation and Q48 numerical conditions. The owner then supplies separate educational approval or requested revisions. Confirm independent reviewer identity/capacity for the expanded content; no reviewer assignment or waiver is invented. Technical acceptance of Batches 1–3 is not educational acceptance.

**Stop after Batch 4 for owner acceptance/revision review. Batch 5 is unauthored and requires explicit authorization.** Full Phase 7, full sixty-item educational acceptance and any release remain later gates. Production stays disabled/catalog empty. No bank, accepted pilot content/approval, prior draft, Mock behavior, storage/ownership/persistence/answer-commitment contract, allowlist or flag changed. No publication, deployment, commit, push or Phase 8 occurred. Native accessibility/device/other-browser obligations and historical PDF cancellation, recovery intermittency and timing/resource-pressure release dispositions remain outstanding and unchanged.
`;
fs.writeFileSync(dir+'PHASE-7-BATCH-4-REVIEW.md',text);
fs.writeFileSync(out+'tooling-attempts.json',JSON.stringify({failedSourceRetrievals:[],failedTests:[],contentCorrections:[],observations:[{action:'Read-only documentation lookup',result:'Four shortened paths were absent; rg --files resolved the actual GUIDED-PRACTICE-prefixed paths. No file mutation.'},{action:'git status --short',result:'Working-tree listing succeeded with warnings about an inaccessible user-global ignore file. No Git configuration mutation.'},{action:'Initial document link check',result:'Only the checker output self-link was absent when inspected before its output existed. Initial result retained in document-checks-initial.json. The checker now creates a progress artifact before full link evaluation and replaces it with final results; corrected check passes with no ignored link or changed draft.'}]},null,2)+'\n');
console.log('Wrote Batch 4 report with ten exact identity triplets and twelve source outcomes');
