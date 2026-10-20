import fs from 'node:fs';
const dir='docs/guided-practice/',out='test-results/guided-practice/phase-7-batch-5/';
const read=p=>JSON.parse(fs.readFileSync(out+p,'utf8')),rows=read('draft-identities.json'),refs=read('source-checks.json'),audit=read('sixty-item-inventory.json'),oldQ58=read('q58-hint-refinement-before.json');
for(const log of ['focused-initial.log','focused-final.log'])if(!/285 passed/.test(fs.readFileSync(out+log,'utf8')))throw new Error('Passing focused evidence required');
if(!read('preservation-after.json').ok)throw new Error('Protected files changed');
const currentQ58=rows.find(r=>r.questionId==='Q58');if(currentQ58.sourceFingerprint!==oldQ58.identity.sourceFingerprint||currentQ58.draftSha256===oldQ58.identity.draftSha256||currentQ58.prospectiveG1===oldQ58.identity.prospectiveG1)throw new Error('Hint refinement identity evidence mismatch');
const identities=rs=>'| ID / review ID | Existing draft SHA-256 | q1 | Prospective g1 at recorded version |\n| --- | --- | --- | --- |\n'+rs.map(r=>'| '+r.questionId+' / '+r.reviewId+' | '+r.draftSha256+' | '+r.sourceFingerprint+' | '+r.prospectiveG1+' |').join('\n');
const sourceTable='| Item / source index | Original section and inspected lines | Supporting claim / status |\n| --- | --- | --- |\n'+refs.map(r=>'| '+r.questionId+' / '+r.sourceIndex+' | ['+r.courseTitle+']('+r.url+') — '+r.sectionHeading+'; '+r.originalPassageLines.join('–')+' | AI checked: '+r.claim+' |').join('\n');
const tables={Q52:'| Copy | Location |\n| --- | --- |\n| Draft | Temporary task workspace |\n| Finished report | Permanent assistant-account storage |\n| Firm’s document folder | No report copy |',Q53:'| Step | What happens |\n| --- | --- |\n| Draft | Prepare proposed wording for review |\n| Approve | Decide whether the amendment is acceptable |\n| Release | Sign and send the agreed amendment |',Q58:'| Week | Attendees |\n| --- | ---: |\n| Before reminders | 40 |\n| After reminders | 50 |'};
const command='node node_modules/vitest/vitest.mjs run --configLoader runner tests/guidedPhase7Batch5Content.test.ts tests/guidedPhase7Batch4Content.test.ts tests/guidedPhase7Batch3Content.test.ts tests/guidedPhase7Batch2Content.test.ts tests/guidedPhase7Content.test.ts tests/guidedPilotContent.test.ts tests/guidedContent.test.ts tests/guidedFingerprints.test.ts tests/guidedSchema.test.ts tests/realBank.test.ts tests/approvedContent.test.ts --maxWorkers 2';
const review=`# Phase 7 — Batch 5 review and owner handoff

2026-10-18 (Asia/Karachi). **Exactly ten Batch 5 drafts, original-course verification, focused validation and sixty-item inventory reconciliation are complete. Phase 7 remains in progress and is not complete. Stop for owner review.** The owner technically accepts Batch 4 for continued drafting only; final educational approval of Batches 1–4 is not supplied. Current authority covers this batch and inventory audit, not final educational approval, catalog publication or release integration.

Batch 5: **0/10 independent human educational reviews, 0/10 final owner educational approvals, no actual approved g1**. All fifty expansion guides: **0/50 independent human educational reviews and 0/50 owner educational approvals**. The ten earlier pilot versions retain owner acceptance under their exact narrow waiver, with 0/10 documented independent human reviews. No waiver extension, signature, source-review completion, learner-usability or learning-effectiveness finding is invented.

## Verified scope and inputs

Read the [accepted implementation plan](PHASE-7-IMPLEMENTATION-PLAN.md), [fifty-question inventory](PHASE-7-QUESTION-INVENTORY.md), evolving content/source ledgers, Batch [1](PHASE-7-BATCH-1-REVIEW.md)/[2](PHASE-7-BATCH-2-REVIEW.md)/[3](PHASE-7-BATCH-3-REVIEW.md)/[4](PHASE-7-BATCH-4-REVIEW.md) reviews, existing pilot guides and [approval identities](content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md), source bank, schema/q1/g1/catalog/loader contracts and focused tests. The [master plan’s Phase 7 requirements](GUIDED-PRACTICE-MASTER-PLAN.md#phase-7--complete-intermediate-guided-practice) remain the future completion/release gates. The attached Batch 5 authorization narrows this pass to content and inventory work; it does not authorize those later gates.

Before drafting, the validated bank and plannedBatch=5 inventory agreed on **Q50, Q51, Q52, Q53, Q54, Q55, Q56, Q57, Q58, Q60**, original positions **50/51/52/53/54/55/56/57/58/60**. Ten unique IDs; **eight single-response / two two-response, identified from source as Q50 and Q54**. D1–D7 **2/2/1/2/1/1/1**. Embedded tables exactly **Q52/Q53/Q58**. **42 original options, ten reference occurrences**. [Inventory evidence](../../${out}inventory-check.json) retains these results. No original question, answer key, selection count, option order, quote or table was rewritten.

Frozen Intermediate bank SHA-256: **f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4**. Source schema 1 / exam pcao-f-practice-easy-01 / bankVersion 1.0.0 / difficulty Intermediate. The Advanced bank is also unchanged under the preservation manifest.

## Deliverables and candidate contracts

- [Ten Batch 5 draft records](content/intermediate-expansion/batch-5.md).
- [Exact solve-first copy](content/intermediate-expansion/batch-5-questions-only.md), with original stems, options and sources but no keys or feedback.
- [Sixty-question content-inventory audit](PHASE-7-60-QUESTION-CONTENT-INVENTORY-AUDIT.md), with complete existing identity reconciliation and compatibility considerations.
- [Updated content ledger](PHASE-7-CONTENT-LEDGER.md): fifty drafts; all forty prior rows exact.
- [Updated source ledger](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md): ten newly inspected passages; all forty-eight prior records and prior metadata exact.

Each new guide follows the existing schema: three progressive hints, three scenario-derived criteria, complete original-set reasoning, ordered satisfaction/limitation explanations for every option, closest distractors, relevant vocabulary, indexed source claims/locators and draft-only metadata. Draft version **1**; planned guideVersion **1.1.0**. Review IDs identify candidates, not review events. Scenario facts and approved keys come from the frozen bank; course passages establish general principles; the application is AI-authored interpretation awaiting independent review.

Draft SHA-256 hashes UTF-8 JSON.stringify(draft) in stored property order. q1 binds the validated original source tuple. Prospective g1 uses the unchanged canonicalizer with only approval.status projected to approved **in memory**. No approved projection is persisted, allowlisted or promoted. Actual approvedG1/new independent-review/owner fields remain null. Any subsequent affected content, source, review-ID or version edit requires recomputation and renewed review. The sixty-item audit is metadata-only and never assembles a sixty-entry release.

## Original-course verification

**10/10 necessary references freshly inspected by the AI author**, ten distinct sections on seven original pages. The inventory’s preliminary 1/10 availability count was not treated as completed verification. All seven pages retrieved successfully; Workflow was reached through the original AI Fluency sidebar and its exact sections 5, 14 and 9 read. The other six pages opened directly. There were **no failed Batch 5 source retrievals and no secondary-source substitutions**. Earlier retrieval failures remain untouched historical evidence.

${sourceTable}

[Per-reference evidence](../../${out}source-checks.json) and the source ledger retain exact bank title, original URL, heading, zero-based index, inspected lines, brief supporting excerpt, passage summary, teaching claim and limitations. Line locators may drift, so headings/URLs and excerpts remain alongside them. Source coverage for all expansion drafts is now **58/58 AI-checked reference occurrences**; the pilot’s **12/12** earlier checks remain historical evidence, giving **70** overall. Only the ten Batch 5 occurrences were newly inspected here; no fresh re-verification of the prior sixty references is claimed. Human source checks remain pending for the fifty new guides.

No necessary Batch 5 teaching claim remains source-pending in the AI audit. The boundaries matter: Q50’s price uncertainty and no-chat access are case facts; Q51’s inherited access is explicitly confirmed in the case rather than asserted universally of extensions; Q52 states its finished copy is durable; Q53 supplies this manager’s availability and commitment boundary. Q54’s source-only/absent-term restriction is given by the scenario, while the course supports staged checks. Q55’s available close-ups support exact labels; inferred or generated detail does not become original evidence. Q57’s capability change remains a test. Q58 applies a logical-gap principle without claiming that any specific confound actually changed. Q60 has no actual-use observations yet.

## Exact tables and evidence interpretation

Q52:

${tables.Q52}

The three copy/location rows are separate observations. The finished report remains durable and reopenable; the temporary draft does not imply its loss. The empty firm-folder row leaves the specified destination incomplete despite approved content and an available authorized save route. Correct C saves and verifies the intended document there. A confuses durability with destination satisfaction; B invents loss and regeneration; D substitutes a final label/temporary workspace for the firm’s records. No numerical calculation or retention period is supplied or invented.

Q53:

${tables.Q53}

The guide distinguishes reversible preparation, substantive acceptability judgment and signed release. The manager can judge every proposal before it acts; signed/sent commitments cannot simply be withdrawn. Correct D uses AI draft input and retains human approval and release before sending. A unnecessarily prohibits reversible input preparation; B delegates the approval call while checking only identifiers/recipients later; C reviews after release. Data-route approval does not authorize every downstream decision. No general legal rule is introduced. There is no arithmetic in this table.

Q58:

${tables.Q58}

The current checked log supports **50 − 40 = 10 attendees**. It does not by itself establish a reminder effect; course availability and other promotion remain unexamined. Correct C checks the inferential connection with relevant changes/comparative evidence. A repeats correct arithmetic, B adds agreement on the same evidence, and D improves uncertainty wording without testing causation. The guide neither proves nor disproves the reminder effect and invents no comparison-group result or actual competing change. No percentage effect or causal effect size is calculated. The original quoted AI conclusion remains exact in the solve-first copy.

Tests compare every **complete original raw/validated stem** with the solve-first content, preserving surrounding constraints and original option order as well as every table cell. Dedicated mutations for all three tables delete a row, change a heading, reverse rows, change a substantive value/meaning and change alignment. Every mutation must differ from the source and change q1. All exact-copy and mutation checks pass. Hints contain no table verdict, decisive value or final arithmetic result.

## Hint and all-option review

The AI author reviewed all thirty hints separately and cumulatively. Hint 1 frames reasoning, Hint 2 focuses evidence/constraints and Hint 3 asks for an action the learner must carry out. No final sequence gives letters, complete answer sets, final arithmetic, copied full winning text or exhaustive elimination. Automated surface checks are **limited evidence**, not independent certification of semantic quality. Functional requirements take precedence over label memorization.

| Item | Hint progression | Closest distractors / independent-review focus |
| --- | --- | --- |
| Q50 | Recipient use and conversion → access and evidence status → simulate receiving only the handover | B/E preserve some communication but depend on chat/later questioning. Review cumulative form/status cues without giving the full A/D bundle. |
| Q51 | Promise versus contents → task needs and actions → trace cleanup reach before exposure | D/C provide scans or internal identity without task-fit control. No malicious intent or actual deletion is presumed. |
| Q52 | Separate copy rows → survival versus destination → trace the finished document to acceptance evidence | A/B confuse durability with required custody or transfer temporary status between copies. Hints do not declare which row fails the requirement. |
| Q53 | Consequences per step → judged input versus decision → locate judgment before a commitment leaves | B/A conflate signature or accountability with ownership of each stage. Hints do not assign the table’s three owners for the learner. |
| Q54 | Where errors can propagate → prior review and permitted evidence → missing-term walkthrough | B/D substitute late self-review or labeled outside estimates. Hints do not disclose the complete extraction-stop/evidence-limit pair. |
| Q55 | Relationships versus exact labels → source versus reconstruction → trace a branch and label to evidence | C/D accept plausible reconstruction or generated polish. Review multimodal input reasoning without treating any capability label as proof of fidelity. |
| Q56 | Location and users of correction → rule versus example/private pattern → covering-user simulation and transfer evidence | B/C supply an example or repeated reminder rather than shared behavior. Hints omit the winning configuration label. |
| Q57 | Untested intervention → local versus global consistency → controlled comparison under unchanged requirements | D/A offer explanations or repeat exhausted changes. No stronger-setting guarantee appears. |
| Q58 | Observed change versus explanation → checked facts versus inference → discriminating observation and confidence update | D/A rephrase or recalculate without testing the inference. The final hint teaches a check rather than pointing at these distractors. |
| Q60 | Experienced versus unknown use → preference versus representative work → expose friction and evaluate refinement | D/C substitute votes or model screenshot judgment for actual task evidence. No friction result or winning view is invented. |

All **42/42 original options** have nonblank ordered satisfaction and failure/limit explanations. Correct-option limitations identify companion requirements, scope and subsequent checks without negating the key. Vocabulary appears in every guide. All **150 expansion hints and fifty expansion reasoning blocks are distinct strings**; this does not prove independent educational quality.

Keys: **Q50 A+D; Q51 B; Q52 C; Q53 D; Q54 C+E; Q55 B; Q56 D; Q57 C; Q58 C; Q60 A.** Q50 explicitly explains why artifact usability and visible uncertainty are complementary and why each alone is incomplete. Q54 explains the extraction-first human stop and continued source/missing-term discipline, including each A/B/D exclusion. No supplier price, vendor ranking, missing map label, staffing plan or user-test outcome is invented.

An AI cumulative review refined **only new Q58 Hint 3** after the initial passing run. The initial wording contrasted the proposed check with recalculating/rewriting, unnecessarily cueing two distractor functions. The final wording asks for a discriminating observation and how its result would affect confidence, retaining the learner’s decision. [Original wording and identity](../../${out}q58-hint-refinement-before.json) are preserved. q1 is unchanged; draft SHA/prospective g1 were recalculated and the final focused run passes unchanged assertions. No earlier-batch guide was edited. No unresolved AI-identified source/key/table/option defect remains; independent semantic/cumulative review is still required for every new guide, especially Q50/Q53/Q54/Q58.

## Exact ten final candidate identities

${identities(rows)}

[Identity evidence](../../${out}draft-identities.json) records version, source, original set/cardinality and null actual approval fields. The original Q58 pre-handoff identity remains separate evidence and is not the current candidate.

## Focused validation and protected files

| Check | Outcome |
| --- | --- |
| [Initial focused run](../../${out}focused-initial.log) | **285/285 tests in eleven files**, zero failures/skips/retries. |
| [Final focused run](../../${out}focused-final.log) | **285/285 tests in eleven files**, zero failures/skips/retries, after the Q58 cumulative-hint refinement and regenerated identities/inventory. No assertion was relaxed. Counts are per run, not cumulative. |
| Batch 5 checks | Exact scope/order/positions/domains/types/source; strict draft/item schema; three hints; all 42 options and ten sources; deterministic SHA/q1/g1 and content/review-ID/version/source sensitivity; full-set reasoning; exact original solve-first/table preservation and targeted mutations. |
| Sixty-item checks | Sixty per-item recomputations at their existing versions; exact 10+50 disjoint membership and five ordered tens; required domains/48-10-2 responses; 180 hints, 252 option comparisons, 70 source references; unchanged pilot approval identities and narrow waiver. Version-only g1 sensitivity demonstrated for all ten pilot entries without persisting changed identities. |
| Publication-negative checks | Every new raw draft fails the approved-only entry contract. Batch 5 raw release-shaped test input fails invalid-release; its ten in-memory approved-status projections fail not-published in the actual empty catalog. This negative test is not an exported release; no sixty-entry release is constructed. |
| [Before manifest](../../${out}preservation-before.json) / [after check](../../${out}preservation-after.json) | **223/223 protected file hashes unchanged**, including both banks, ten pilot guides/approvals, forty earlier drafts/solve-first files/reports, accepted plan/inventory, runtime/configuration/build inputs and earlier evidence. |
| Shared ledgers | All forty prior content rows and forty-eight prior source records/metadata remain exact. Original narratives and before copies retained; only ten new content rows and references authored. |
| Full app/browser/release suites, typecheck/build, preview/native accessibility | **Not run** under this content-only authorization; earlier results retain their original scope. |

Command: ${command}.

The four earlier Phase 7 test files change only evolving-state expectations: permit the two Batch 5 files, require the now-complete fifty-row draft ledger and scope Batch 4 source/draft assertions to its original forty guides/48 references. Earlier guide/key/option/schema/digest/source validations remain. Six before copies in this evidence folder retain the four old tests and both shared ledgers. The 84 added cases include the sixty independent per-item inventory bindings; the earlier 201 checks remain in the run.

[Tooling observations](../../${out}tooling-attempts.json) preserve the initial helper-generation shell quoting failure and consequent missing-module invocation. The failed one-liner wrote no helper or protected file; writing the new helper with apply_patch corrected setup before baseline capture. This was not a source retrieval or content-test failure. No failed/corrected earlier evidence is removed. [Document checks](../../${out}document-checks.json) validate links and reported identities; current project status is updated without deleting prior history.

## Inventory outcome, remaining gates and stop

The [sixty-item audit](PHASE-7-60-QUESTION-CONTENT-INVENTORY-AUDIT.md) confirms all sixty original IDs, no omission/duplicate/overlap, D1–D7 **8/13/7/10/7/9/6**, and **48 single / 10 double / 2 triple**. The ten accepted pilot guides remain at their exact 1.0.0 identities; all fifty new guides remain drafts planned at 1.1.0. Merely changing the pilot version would change g1, so version/approval/frozen-session compatibility needs a separately authorized release decision and tests.

Owner decisions next: accept or request revisions to this batch and inventory evidence; confirm independent reviewer capacity and separately authorize the next educational-review stage. That future stage must cover solve-first reasoning, original sources, each/cumulative hint, every option/full set, vocabulary and arithmetic against exact final identities, then separate owner educational approval. No such review or approval is begun or inferred here. Full Phase 7 release integration/acceptance is a separate later authorization.

**Stop here. All fifty new guides are authored; Phase 7 is not complete.** Production stays disabled/catalog empty. No pilot/prior-draft/bank/runtime/Mock/storage/ownership/persistence/answer-commitment/flag/allowlist change, publication, deployment, commit, push or Phase 8 occurred. Native accessibility, physical-device/other-browser coverage and historical PDF cancellation, recovery intermittency, timing/resource-pressure release dispositions remain outstanding. Later compatibility, full applicable regressions, sixty-item report/session coverage, readability/resource/fault evidence, rollback and host acceptance are not supplied by this inventory pass.
`;
fs.writeFileSync(dir+'PHASE-7-BATCH-5-REVIEW.md',review);
const membership='| ID / bank position | Cohort / batch | Domain | Responses | Existing guideVersion | Hints / options / references | Educational status |\n| --- | --- | --- | --- | --- | --- | --- |\n'+audit.rows.map(r=>'| '+r.questionId+' / '+r.bankPosition+' | '+(r.cohort==='accepted-pilot'?'Accepted pilot / '+r.batch:'Expansion draft / '+r.batch)+' | '+r.domain+' | '+r.selectionCount+' | '+r.guideVersion+' | '+r.hintCount+' / '+r.originalOptionCount+' / '+r.sourceReferences+' | '+(r.ownerEducationallyAccepted?'Owner accepted; exact pilot waiver':'Independent review and owner approval pending')+' |').join('\n');
const batchTable='| Cohort | Exact IDs | Count | Version / educational state |\n| --- | --- | --- | --- |\n| Accepted pilot | '+audit.rows.filter(r=>r.cohort==='accepted-pilot').map(r=>r.questionId).join(', ')+' | 10 | 1.0.0; owner accepted under exact pilot waiver |\n'+audit.batches.map(b=>'| Phase 7 Batch '+b.batch+' | '+b.ids.join(', ')+' | 10 | 1.1.0 planned; unpublished drafts |').join('\n');
const inventoryReport=`# Phase 7 — Sixty-question Intermediate content-inventory audit

2026-10-18 (Asia/Karachi). **Content inventory reconciled: sixty unique source-matched guide records, comprising ten owner-accepted pilot versions and fifty new unpublished drafts. Phase 7 is not complete.** This is an inventory/per-entry identity audit only. No combined release artifact, catalog entry, approval allowlist or public feature was constructed or changed. Batch 5 authorization expressly stops before final educational approval and full release integration.

## Authority, evidence and method

The [implementation plan](PHASE-7-IMPLEMENTATION-PLAN.md), [fifty-question inventory](PHASE-7-QUESTION-INVENTORY.md), [evolving expansion ledger](PHASE-7-CONTENT-LEDGER.md), [pilot approval matrix](content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md), [pilot waiver ledger](content/intermediate-pilot/CONTENT-REVIEW-LEDGER.md), both source ledgers and [Phase 7 master requirements](GUIDED-PRACTICE-MASTER-PLAN.md#phase-7--complete-intermediate-guided-practice) define the audit boundaries. Batches [1](PHASE-7-BATCH-1-REVIEW.md)/[2](PHASE-7-BATCH-2-REVIEW.md)/[3](PHASE-7-BATCH-3-REVIEW.md)/[4](PHASE-7-BATCH-4-REVIEW.md) retain their historical results; [Batch 5 review](PHASE-7-BATCH-5-REVIEW.md) records the new candidates and final validation.

[Machine-readable sixty-row audit](../../${out}sixty-item-inventory.json) contains the exact source, draft and prospective g1 identities, file/batch/version, original key/cardinality, source counts and approval/waiver status for every item. It contains inventory metadata, not a release’s guide records. [Audit generator](../../tests/phase7-sixty-inventory-audit.mjs) reads the seven existing authoring documents (two five-guide pilot files, five ten-guide expansion files) and recomputes every identity with the unchanged contracts. It checks raw-bank SHA, strict authoring/item coverage, the two ledger families, original-source metadata and pilot approval bindings. No file is rewritten by treating pilot prose as a new version.

Frozen bank byte SHA-256 **f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4**; source schema 1 / pcao-f-practice-easy-01 / bankVersion 1.0.0 / Intermediate. All sixty IDs follow the real bank’s one-based positions, including Q59 in the existing pilot rather than Batch 5. Bank bytes and every prior accepted identity are unchanged.

## Coverage reconciliation

**60 unique IDs, 0 omissions, 0 duplicates, 0 overlap between the ten pilot and fifty expansion records.** The fifty new records exactly match the original inventory in five ordered, disjoint batches of ten.

${batchTable}

| Domain | Pilot + expansion total | Required | Result |
| --- | ---: | ---: | --- |
${Object.entries(audit.domains).map(([d,n])=>'| '+d+' | '+n+' | '+n+' | Match |').join('\n')}

| Response type | Pilot | Expansion | Total / required |
| --- | ---: | ---: | --- |
| Single | 6 | 42 | 48 / 48 |
| Two-response | 2 | 8 | 10 / 10 |
| Three-response | 2 | 0 | 2 / 2 |

Both triple-response items, Q26 and Q59, remain in the accepted pilot. Batch 5’s double-response items are Q50 and Q54, read from the original source. All sixty records have **three hints each (180 total)**, **252/252 original option comparisons in original order**, exact original selection sets and valid indexed reference metadata. The expansion has **150 hints**, fifty distinct reasoning blocks and **58 AI-source-checked reference occurrences**. The pilot retains **30 hints** and **12 historical AI source checks**. The combined **70** source references reconcile to original question sources; only Batch 5’s ten references were freshly inspected during this pass. The audit does not relabel historical AI checks as new human or current-pass verification.

## Complete sixty-row membership and status

${membership}

Every row’s q1, draft SHA-256 and prospective g1 matches its recorded ledger, at the guideVersion in that row. Full identities are also listed below so the audit can be reviewed independently of a summary count. The guideVersion is part of g1; all pilot g1 values below are existing 1.0.0 values, not recomputed approvals at 1.1.0.

## Exact existing sixty identity bindings

${identities(audit.rows)}

These are candidate/prospective digests, with **null actual approvedG1 in all sixty runtime draft records**. The pilot’s owner decision separately binds its exact draft/prospective-g1 identities; it did not populate production. Review IDs do not represent independent review completion.

## Educational and source boundaries

| Gate | Accepted pilot ten | Expansion fifty |
| --- | --- | --- |
| Owner educational acceptance | 10/10, exact existing versions | 0/50; pending |
| Documented independent human educational reviews | 0/10; requirement expressly waived for these exact pilot versions | 0/50; required, not waived |
| AI original-source checks | 12/12 historical checks retained | 58/58 recorded AI checks; latest ten newly inspected |
| Human original-source/semantic hint-review evidence | No completion invented; pilot waiver boundary retained | Pending for every new item |
| Runtime approved digests / production catalog | Null / empty | Null / empty |

The [Phase 6 owner acceptance](PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md) and its ten-question educational waiver remain unchanged. Technical acceptance of Batches 1–4 is not educational approval. The expansion ledger explicitly keeps newIndependentReviewWaiver=false and all independent-human/source/semantic-hint/final-owner fields null. There is no owner approval to transfer from the pilot to any new question.

All fifty drafts have complete structural/provenance coverage and AI-authored option/set/criteria/vocabulary feedback. That does not establish independent semantic correctness, non-leakage or learning benefit. Outstanding educational work includes solve-first reasoning, original-passage checking, individual and cumulative hints, strongest competing options/full sets, terminology, arithmetic and separate final owner approval tied to exact digests. Final educational approval is not begun in this pass and needs separate authorization/capacity. No participant observations or signatures are supplied.

## Compatibility consideration: pilot 1.0.0 and planned full 1.1.0

The accepted pilot wrappers record plannedGuideVersion **1.0.0**; all fifty expansion wrappers record plannedGuideVersion **1.1.0**. Source identity and q1 remain the same because the frozen bank has not changed. g1 includes source, guideVersion and the canonical guide entry. An in-memory counterfactual check shows **all ten pilot g1 values would change solely from substituting 1.1.0**, even with identical wording/review ID. The audit stores only that sensitivity outcome, not alternative pilot candidates or new approvals. Existing pilot files, hashes, versions and acceptance bindings remain unchanged.

Consequently, a future sixty-entry 1.1.0 release cannot silently treat the old 1.0.0 prospective digests as its new digests. Nor should it rewrite existing session items/hints/commitments/index to make them look current. The existing catalog addresses source plus guideVersion, and approval is checked against the exact per-question digest; frozen-item validation also recomputes under the saved version. A separately authorized integration must resolve the full-version identities/approval scope while preserving old-version digest authorization and compatible frozen sessions, with any revocation explicit. Retaining distinct compatible version/catalog records is an available design direction, not a publication decision taken here.

Production currently has no published pilot catalog entry; the owner-accepted pilot is a local artifact, not evidence of a historical public release. Future integration must state which local/saved artifacts it supports and must not claim that absent production approval already exists. No changed pilot version/digest, new public path, migration or catalog is implemented here. Saved-session/rollback compatibility is a future verification obligation, not passed merely because version sensitivity is understood.

## Verification and preservation

The final [focused run](../../${out}focused-final.log) passes **285/285 tests in eleven files**, zero failures/skips/retries, after the new Q58 hint refinement. The [initial run](../../${out}focused-initial.log) also passed 285/285; it remains evidence that surface guards alone did not catch the AI editorial concern. The [pre-refinement Q58 record](../../${out}q58-hint-refinement-before.json) retains its original wording/identities. Final SHA/g1 values in this audit match the corrected candidate; q1 is unchanged.

The 84 added focused cases include Batch 5 scope/schema/source/options/identity and exact Q52/Q53/Q58 table checks, sixty independently recomputed inventory rows, approval/waiver boundaries and pilot version sensitivity. Existing 201 content/fingerprint/schema/pilot/real-bank/approved-content cases remain. Raw drafts are rejected by approved-only contracts; Batch 5’s in-memory prospective test projections are rejected by the actual empty production catalog. No sixty-item release-shaped object is created or written. The exact command and limitations are in the Batch 5 review.

[Protected-file baseline](../../${out}preservation-before.json) and [after verification](../../${out}preservation-after.json) show **223/223 byte hashes unchanged**. This includes the ten accepted pilot guides and approval files, all forty Batch 1–4 drafts, their solve-first files/reports, prior evidence, both banks and captured runtime/configuration/build inputs. The evolving ledgers append the last ten records while preserving all forty prior content rows, forty-eight source records and earlier metadata/history. Four earlier test files change evolving-state expectations only; their before copies remain preserved. Project status additions retain old guidance/history.

No unrelated full application/browser, release, typecheck/build or native accessibility suite was run. No production release, deployment, commit, push or Phase 8 occurred. [Document checks](../../${out}document-checks.json) bind the reports’ links and identities. Earlier failures and the new helper setup failure are retained separately; no application success is invented from tooling recovery.

## Remaining deficiencies and release dependencies

No omission, duplicate, overlap, identity drift, source-metadata mismatch or unresolved AI-identified Batch 5 source/key/table/option defect remains in this inventory audit. Q58’s overly targeted hint wording was refined before handoff. Human educational/semantic assessment remains a deficiency for all fifty new guides; prior batch human-review focus points remain open. The pilot version transition remains an unresolved future approval/compatibility decision, not a defect to patch under this content authorization.

The authoritative Phase 7 exit still requires sixty accepted source-matched entries, exact approved full-version identities, frozen pilot compatibility and explicit revocations, 5/10 standalone coverage across all sixty, compatible sixty-item post-exam cohorts, applicable full regressions/Mock invariants, readability/resource/fault and accessibility evidence, release/rollback readiness and separate owner acceptance. Native Windows screen-reader, physical-device/other-browser decisions, historical PDF cancellation, recovery intermittency and timing/resource-pressure risk dispositions remain outstanding. The recorded pressure failures and owner’s sequential one-worker browser direction retain their prior scope. No production responsiveness, measurable learning effectiveness or elapsed stability period is claimed.

Owner next decides acceptance/revisions of Batch 5 and this inventory, confirms reviewer capacity and separately authorizes any final educational-review stage or later full integration. Publication and deployment remain separate decisions. **Stop for owner review. Content authoring coverage is complete; Phase 7 is not complete, educational approval is not complete, and release integration has not begun.**
`;
fs.writeFileSync(dir+'PHASE-7-60-QUESTION-CONTENT-INVENTORY-AUDIT.md',inventoryReport);
fs.writeFileSync(out+'tooling-attempts.json',JSON.stringify({failedSourceRetrievals:[],failedFocusedTests:[],authoringRefinements:[{questionId:'Q58',field:'hints[2]',reason:oldQ58.reason,beforeDraftSha256:oldQ58.identity.draftSha256,afterDraftSha256:currentQ58.draftSha256,beforeProspectiveG1:oldQ58.identity.prospectiveG1,afterProspectiveG1:currentQ58.prospectiveG1,q1Unchanged:true}],observations:[{action:'Initial preservation-helper generation',result:'PowerShell/native-command quoting produced a Node eval SyntaxError (Expected unicode escape). No helper file was written; the following invocation returned MODULE_NOT_FOUND. The new helper was written using apply_patch and baseline capture then succeeded with 223 files before content edits. No protected file was changed.'}]},null,2)+'\n');
console.log('Wrote Batch 5 review and metadata-only sixty-question audit with all exact identity bindings');
