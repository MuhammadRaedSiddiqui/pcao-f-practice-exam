# Guided Practice — Phase 6 readiness and risks

**CURRENT — Phase 6 COMPLETE, OWNER ACCEPTED (2026-10-18):** The owner's explicit instruction to mark Phase 6 complete records final acceptance of the current ten-question Intermediate local pilot, including the reviewed UI fixes, on artifact `72dc45bef4b5c344fd093dcbb847925041cdc2db8c239c73f3e66d9a2cea16bc`. [Owner acceptance and completion](PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md) is the authoritative current status and separately records final amended-D14 pilot acceptance. Older Phase 6/D14 acceptance-pending wording below is superseded history. Native accessibility/device verification and historical PDF/recovery/timing risk dispositions remain unperformed/outstanding release obligations; no results or walkthrough signatures are invented. Production stays disabled/catalog empty; Phase 7 is not authorized or started. Documentation-only completion; no application suites, publication, deployment, commit or push.


**Current D14 policy — owner-authorized amendment, 2026-10-18:** [Owner-led evaluation and explicit final pilot acceptance](D14-OWNER-ACCEPTANCE-AMENDMENT.md) replace the mandatory three-external-student requirement for the current ten-question Intermediate pilot only. No recruitment, participant consent, interviews, participant observation records or three-student evaluation are required. Policy authorization does not evidence a personal walkthrough; final owner pilot acceptance remains pending. No independent learner-usability or measurable learning-effectiveness evidence has been obtained. Native accessibility/device coverage, historical PDF/recovery release-risk decisions and full Phase 6 acceptance remain separate outstanding requirements. Older D14 participant/observation clauses below are superseded planning history where they differ from this amendment. Production remains disabled/catalog empty; no source/content/configuration change, application-suite rerun, publication, deployment, commit, push or Phase 7.

**Subsequent owner decision — targeted work handed off 18 October 2026:** The owner accepts this readiness report, approves §3 D12 and separately authorizes the narrow §2 PDF readiness correction and tests. The [targeted remediation report](PHASE-6-TARGETED-REMEDIATION.md) records that completed work and remaining defects. This report remains the historical readiness evidence/proposal; its unsigned human worksheets and original diagnostics are unchanged. Full Phase 6 acceptance remains pending.

17 October 2026, Asia/Karachi. **Bounded readiness/diagnosis handoff; full Phase 6 acceptance and public release remain pending.**

## 1. Phase 5 acceptance and preserved candidate

The owner states: “I accept Phase 5's verified technical implementation for continued internal development.” This accepts the [Phase 5 technical evidence](PHASE-5-IMPLEMENTATION-REPORT.md). It does not resolve intermittent PDF/recovery failures, provide independent human educational approval, or accept release readiness. The same request authorizes only this readiness/diagnostic workstream. D12 policy implementation, content publication, production enablement, hosted mutations, deployment, commit and push remain unauthorized.

Read the original [implementation guideline](../GUIDED_PRACTICE_IMPLEMENTATION_PLAN.md), complete five-document [planning bundle](GUIDED-PRACTICE-MASTER-PLAN.md), [architecture](GUIDED-PRACTICE-ARCHITECTURE.md), [risk register](GUIDED-PRACTICE-RISK-REGISTER.md), [verification matrix](GUIDED-PRACTICE-VERIFICATION-MATRIX.md), [execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md), [final Phase 2 matrix](content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md), its underlying ledgers/drafts, [Phase 3/4 report](PHASE-3-4-IMPLEMENTATION-REPORT.md) and Phase 5 report. Earlier phase-stop and pending-acceptance statements in those reports remain historical; this dated decision supersedes them only within the stated scope.

D1–D11 remain unchanged: separate Guided IndexedDB; exact q1/g1 and catalog approval; mounted additive routes; frozen reviewed overlays; preparation outside the existing shared lock, fresh checks and short transactions inside; complete raw/index Mock inventory; validated-expiry/typed non-destructive recovery; owner/source isolation; and suspended Guided telemetry. No application, repository test, content, schema, dependency, approval or configuration change is included here.

Before documentation edits, captured 472 working-tree files, Git index/HEAD and hash-only private-environment fingerprints in [Phase 6 evidence](../../test-results/guided-practice/phase-6/). All **148 Phase 5 final-candidate application/test/configuration inputs match** the accepted manifest. The dirty working tree is preserved; HEAD alone is not the candidate identity. [Content/candidate audit](../../test-results/guided-practice/phase-6/content-and-candidate-check.json) independently recomputes all ten draft SHA-256, q1 and prospective g1 values and owner bindings. This is an integrity check, not a semantic review or new runtime approval.

## 2. PDF and recovery diagnostics

### Execution and historical evidence

Used an isolated copy of the current candidate, installed dependencies, sanitized environment, no private environment copied, external Node networking denied, a deny-only browser proxy, synthetic account interception and fresh Chromium contexts. Suites ran sequentially with one worker and zero retries. Existing repository tests and deadlines are unchanged: PDF test budget 30 seconds; recovery 45 seconds and visibility assertion 5 seconds. Timing/network/native-dialog/Blob/download observers were appended only to two isolated test copies. Trace and observer overhead can influence timing; these are diagnostic runs, not a replacement full baseline.

Preserved historical failures and passing reruns without reclassification:

| Evidence | Observation | Current disposition |
| --- | --- | --- |
| [Phase 3/4 guest review](../../test-results/guided-practice/phase-3-4/guest-completion-review.json) | 134/135; legacy PDF320 waited for a download until the 30-second test deadline; failure snapshot already shows “The report could not be exported. Please try again.” | Open; that run lacks network/generation-stage tracing needed to assign a cause |
| [Earlier guest completion](../../test-results/guided-practice/phase-3-4/guest-completion-final.json) | 131/135; legacy320/768 PDF timeouts, actual Advanced cancelled download, separate Start setup failure | Cancellation is observed; its trigger is unproven |
| [Recovery review](../../test-results/guided-practice/phase-3-4/recovery-completion-review.json) | 7/8; after reload no password dialog within 5 seconds, while Finish password reset remained in the header | Marker/session-derived recovery affordance survived; automatic dialog restoration failure remains unexplained |
| [Unchanged recovery rerun](../../test-results/guided-practice/phase-3-4/recovery-unchanged-verification.json) | 8/8 | Passing rerun does not erase failure |
| [Phase 5 guest](../../test-results/guided-practice/phase-5/guest-final.json) / [recovery](../../test-results/guided-practice/phase-5/recovery-final.json) | 135/135 and 8/8 respectively | Accepted historical technical evidence, not proof of resolved intermittency |

### Current focused results

| Run | Result and timing evidence | Interpretation |
| --- | --- | --- |
| `pdf-original`: unchanged legacy320, three repetitions | **3/3 pass**; each checks two offline exports, full PDF content/layout and preserved storage. First click→Blob 1.485–6.459s; click→download 1.585–6.537s. All six downloads have null failure; no failed requests | Warm module export works in these contexts. Not a reliability closure |
| `pdf-loading-probe`: unchanged actual Advanced plus controlled delayed import | **2/2 pass** as diagnostic expectations: Advanced exports original frozen content; held first PDF import fails offline with `net::ERR_INTERNET_DISCONNECTED` and the existing export-error alert, then online retry generates/downloads successfully | Demonstrates a module-readiness availability gap; not proof that it caused historical PDF320 failures |
| `recovery-cancel`: unchanged Cancel→reopen→reload, five repetitions | **4 pass, 1 test-budget timeout**; failure is retained. Trace: initial `goto` ~29.1s; reload started with ~4.4s left before the 45s budget expired. Vite module responses include ~11.6–16.3s durations. Final failure snapshot contains the restored open password dialog; trace assertions finish during teardown | Current failure is slow startup/load exhausting the test budget, distinct from the historical missing-dialog assertion. Do not label the test passed or equate the causes |
| `pdf-preview`: preserved production-artifact probes | **2/2 pass** as diagnostic expectations. Warm online/offline click→download 1.014s/0.545s; held hashed PDF chunk fails offline with the same network error/alert, then online retry downloads in 1.357s | Confirms the controlled lazy-module failure also exists in the production artifact. Warm offline success does not cover pending dependencies; no rebuild or enablement |

Commands and exact source/environment metadata are retained as `*-command.json`, logs/results, JSON and traces under the evidence root. Main commands were `node test-results/guided-practice/phase-6/run-browser.mjs pdf-original guest tests/browser/report-export.spec.ts --grep 'complete legacy report download and keyboard access at 320' --workers=1 --repeat-each=3`, the equivalent `recovery-cancel recovery ... --grep 'recovery resumes after Cancel and after reload' --repeat-each=5`, `pdf-loading-probe guest ... --grep 'diagnostic offline before PDF module|exports actual advanced snapshot' --workers=1`, and `pdf-preview release --grep 'production preview' --workers=1`. [Diagnostic summary](../../test-results/guided-practice/phase-6/diagnostic-summary.json), decoded `*-events.json` and [recovery trace summary](../../test-results/guided-practice/phase-6/recovery-cancel-trace-summary.json) retain stages/timestamps. Repetitions are separate outcomes, not unique scenario coverage.

### Cause assessment and proposed next scope

| Candidate cause | Evidence-based assessment |
| --- | --- |
| Lazy loading/offline export | **Demonstrated under controlled ordering.** Results starts `loadReportPdf()` in an effect and ignores prefetch errors. The export button does not expose module readiness. Going offline while the import is pending produces a failed import and no download. Existing `networkidle` in the legacy helper is not an application-level module-readiness contract. Prefetch completion is essential to current first-use offline success |
| PDF generation | Successful Advanced click→Blob ~11.31s; a browser long task reached ~5.56s. Generation can occupy a meaningful part of the test budget. No generation exception reproduced in the unforced current exports |
| Download cancellation/URL lifetime | No current unforced cancellation; original source removes the anchor then revokes its Blob URL after 1000ms. Successful current events do not prove that lifetime is universally sufficient. Historical cancellation has no causal trace; do not change URL lifetime speculatively |
| Resource contention | Slow development module delivery and browser long tasks are measured; CPU, disk, antivirus, scheduler and competing-process attribution were not measured. Host contention is a hypothesis, not an established root cause. No concurrent suite/PGlite stress run was added |
| Router/callback readiness | Existing router POP warning appears during callback cleanup, including passing recovery repetitions. Warning occurrence alone does not explain the missing-dialog failure. Auth recovery flag/context, header mode and native modal opening are separate readiness stages |
| Async synchronization/native dialog | Current traces show native close events while the same modal is reopened; the shared Dialog checks current open state before forwarding close. No trace demonstrates a stale close removing the recovery modal after reload. Historical missing-dialog cause remains open; no lifecycle fix justified yet |

Historical PDF320/768 snapshots show an export-error alert and the restored Export button while the test still awaits `download`. The 30-second timeout therefore does **not** demonstrate 30 seconds of ongoing PDF generation: the test's download-only wait masks an already surfaced application failure. The shared catch covers import, generation and download preparation, so the snapshot cannot identify which threw. The controlled offline-import probe reproduces that outward state with an explicit network cause; historical causality remains unproven. The Advanced `download.failure() === 'canceled'` case reached a download event and is a separate failure stage. These distinctions are retained in [historical failure extraction](../../test-results/guided-practice/phase-6/historical-failures.json).

**Concrete PDF change proposal, awaiting separate scope approval:** add explicit Results PDF-module readiness/error state tied to actual import completion, disclose “preparing offline export” until dependencies are ready, and provide a meaningful online Retry after failure. Preserve report input, content, lazy generation and all existing assertions. Verify cold and warm production-artifact paths, going offline during prefetch, return online/retry and immutable PDF content. This addresses the demonstrated readiness gap; it does not promise to fix historical cancellation. If the owner requires immediate offline export before dependencies have loaded, that requires a separately chosen eager-bundling/caching contract and artifact-size review. No application change was made.

For recovery, the next diagnostic should capture hook adoption/recovery booleans, header mode transitions and native show/close ordering in an evidence-only instrumented copy, synchronized with navigation, accepted session and marker identity. Compare a cold server with a warmed server at the same deadlines and preserve each result. Do not expose tokens in normal logs. Do not increase deadlines or patch effects without reproducing the historical missing-dialog state and showing its causal transition. Current observations justify no recovery application fix. Any application fix requires a new owner scope decision.

## 3. D12 proposal — fixed size with disclosed overlap

**Proposed only; not approved, implemented or tested as new behavior.** Source order remains deterministic, with no randomness or domain/adaptive selector. Reject revoked or mismatched items before constructing sets. Never include duplicate questions within one set, silently shorten a set, or borrow from another source/version/difficulty. A malformed release, forged/unapproved digest, unknown question/domain, unsupported schema or source identity conflict still fails closed as a release; these are not ordinary missing coverage.

For `n` verified eligible items and requested size `s ∈ {5,10}`:

1. If `n < s`, disable that size and explain “n available; s required.” No set exists.
2. Otherwise offer `ceil(n/s)` numbered sets. For zero-based set `j`, start at `min(j*s, n-s)` and take exactly `s` consecutive eligible items.
3. Ordinary divisible coverage retains current disjoint sets. Only the last set overlaps when a remainder exists. Disclose the repeated question count and actual range before Start; e.g. “Set 2 of 2 · eligible questions 5–9 · repeats 1 question from Set 1.” Repeat exposure remains disclosed in summaries.

| Eligible n | Size 5 proposed sets (1-based eligible positions) | Size 10 |
| --- | --- | --- |
| 0–4 | Disabled | Disabled |
| 5 | 1–5 | Disabled |
| 6 | 1–5, 2–6 (4 repeat) | Disabled |
| 9 | 1–5, 5–9 (1 repeat) | Disabled |
| 10 | 1–5, 6–10 | 1–10 |
| 11 | 1–5, 6–10, 7–11 (4 repeat) | 1–10, 2–11 (9 repeat) |
| 60 | Twelve disjoint sets | Six disjoint sets |

The union covers every eligible item; each individual set has exactly s distinct items. This is a proposed extension to the approved ordinary partition rule, requiring a D12 decision, not a reinterpretation of D1–D11.

### Compatibility and implementation changes required after approval

- `loader.ts`: `validateStandaloneRelease` currently rejects a whole standalone release on any q1 mismatch; the loader validates it before eligibility. To offer remaining exact matches, a narrowly scoped path must retain whole-release schema/catalog/digest validation but classify per-item `fingerprint-mismatch`/`revoked` as exclusions. Do not treat all validation errors as coverage loss or simply reuse a report flag without auditing callers. Unknown source membership still rejects the release.
- `selectors.ts`: keep `affectedPublishedEntries` and reason partitions as diagnostics; replace the blanket affected/remainder `policy-pending` refusal with the approved set computation over verified `items`. Validate size/index and out-of-range behavior. Keep insufficient coverage and all source/approval checks.
- Share one computed set description between selection, `startSession` and landing presentation, so advertised count/range/overlap equals actual frozen membership. `GuidedPractice.tsx` currently uses `Math.floor(count/size)`, a blanket policy-pending condition and selectable insufficient sizes with a disabled Start. Update to ceiling/count descriptors, disabled size options, explicit overlap and length-change reset. Handle coverage changes invalidating the selected index before creation; stale intent must not silently select a different set.
- `startSession` uses `selectPracticeSet`; update creation tests and preserve source/protection checks at the storage boundary. The existing schema already enforces `items.length === selectionSize`, unique items and a nonnegative setIndex, so overlap **between** new sessions need not change schema/q1/g1/Mock formats. Set index is creation provenance, not permission to regenerate saved items from today's catalog.
- **Frozen sessions:** retain exact saved items, wording, drafts, hints, commitments and index when all frozen digests remain approved and source access is authorized. Resume uses current item approval/access validation, not today's set partition or coverage count. A session containing a revoked, mismatched or unverifiable frozen item stays inaccessible under the current all-items validation rule; preserve its bytes and current safe recovery state. Do not shrink, replace, migrate, rescore or expose its invalid content. This proposal adds no partial frozen-session rendering or recovery bypass. Old offline builds cannot discover future revocations.
- Keep post-exam cohorts unchanged: all X eligible matched items up to 60, independent filters, exact snapshot order and no standalone 5/10 padding. D12 is a standalone set policy.

Required future tests (all **unexecuted**, since D12 source is unchanged): exhaustive n=0…60 for both sizes; exact cardinality/uniqueness/order/union; last-set overlap count/range; stability across identical calls and object-key order; divisible 10/60 behavior; fractional/negative/huge/out-of-range indices; revoked first/middle/last/multiple and all items; source q1 mismatch exclusion; digest/catalog/schema/unknown-member failure remaining fatal; no cross-level fallback; disabled sizes and accessible explanation; size reset and stale coverage/index rejection; UI membership equals creation; fresh access/protection check; unchanged saved sessions after coverage reduction/promotion and disabled size; revoked frozen session remains preserved/unavailable; same-ID other version; no Mock/archive writes; unchanged post-exam filters/counts. Existing `guidedSelectors.test.ts` whole-release mismatch and `policy-pending` assertions encode current policy and require explicit, reviewed replacements while retaining rejection/safety oracles. Catalog contracts themselves need no weaker approval rule.

## 4. Ten-question human-review worksheet

Verified now: **10/10 final owner approvals; 0/10 independent human reviews; 12/12 AI source references; 0 production catalog entries/public guides.** All ten actual records remain draft with null actual approvedG1. The [content ledger](content/intermediate-pilot/CONTENT-REVIEW-LEDGER.md), [source ledger](content/intermediate-pilot/SOURCE-VERIFICATION-LEDGER.md) and final matrix remain unchanged. The worksheet below is a blank work aid, not a signature, approval ledger update or permission to publish.

**Blind order:** use [questions-only.md](content/intermediate-pilot/questions-only.md) before opening the keyed drafts or worksheet item details below. Record your selected set, the ask, 2–4 decisive constraints, rejected alternatives and ambiguity first; date/seal that note. Prior exposure to keys/AI commentary must be declared; do not retrospectively describe an exposed solution as blind. The owner is self-designated reviewer separately from AI author and separately from final approver; an additional unexposed reviewer may be needed if independence cannot be met.

Then conceal feedback/key and read H1, H1+H2, H1+H2+H3 in that order. At each stage record whether the hint teaches a reasoning action or supplies winning wording, an arithmetic result, eliminations or a complete multi-answer set. Review cumulative leakage, not just explicit answer letters. Only then compare the key, strongest distractor and every original/guide option explanation. Check every original source passage, terminology, arithmetic and complete-set coverage; distinguish case assumptions from course claims. Record disagreements as defects, withhold the affected item and obtain separately authorized corrections; never silently edit the bank.

Sign only after closing defects and checking the exact draft/q1/prospective-g1 below. A later change invalidates the affected sign-off and needs new hashes and renewed reviewer/owner decisions. Existing owner approval remains historical for the unchanged exact drafts; this task adds no human signatures.


#### Q4 — D1, select 2; gp2-intermediate-q4-v1

Exact review target: [batch 1](content/intermediate-pilot/batch-1.md), original question and options A/B/C/D/E.

- Draft SHA-256: `ec2b5a8986bb144ae53b2d7a2027cbd9e658a639dbcd53a122142ddf3e01044d`
- q1: `sha256:q1:9a83ec0a394581b92434e2585ca83c5f31c5e5daa8286834040fb6cfaa0306a1`
- Prospective g1: `sha256:g1:6a2fbf8a697535b62306cbf4f2dc29270cf89ab40549c9ee6d8d7f961476a6df`

Source tasks: index 0, **AI Prompting in 2026: A Crash Course**, 7. The brainstorm-iterate loop. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Choose two complementary prompt changes that fit the readers and preserve organiser feedback before full drafting.” with your reasoning; test candidate closest distractor(s) B/C and name the strongest independently. Review every option A/B/C/D/E and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q5 — D3, select 1; gp2-intermediate-q5-v1

Exact review target: [batch 1](content/intermediate-pilot/batch-1.md), original question and options A/B/C/D.

- Draft SHA-256: `d4d96a424115ac6eb0c282d611e436e6a0955514b8240f49808bb6c40b30d09c`
- q1: `sha256:q1:ce4cbf6d597d22c22b9fda28adc28c97562edfda5acdbb9618215b402596693e`
- Prospective g1: `sha256:g1:88b880aaa208bb372735e81ecb95fc97547bdb5a2852d2765999d9af69cb0a5f`

Source tasks: index 0, **AI Prompting in 2026: A Crash Course**, 12. Cost, speed, and which model to use when. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Apply the before-repair quality threshold, then minimize tested cost among qualifying configurations.” with your reasoning; test candidate closest distractor(s) C and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q6 — D5, select 1; gp2-intermediate-q6-v1

Exact review target: [batch 1](content/intermediate-pilot/batch-1.md), original question and options A/B/C/D.

- Draft SHA-256: `a0b78d6236ecb974b7a8cefcbed7d8836035dfacd5d40ff035df3637157ec51c`
- q1: `sha256:q1:6bf7156dbe9af2e8cb7a28d191bca1bb77eb754172ee78246e97eadf83a1fa45`
- Prospective g1: `sha256:g1:a51817b1730baf110075cc2a45b69d58f22981a1cd0e5a9607e0622ab61fb9a3`

Source tasks: index 0, **Workflow Design & Diagnosis**, 14. Rule, reference, or procedure; index 1, **Skills & Connectors: Teach AI Once, Connect It to Your Apps**, 4. Skills vs Connectors vs Projects vs Custom Instructions. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Update changing ticket facts while retaining old evidence and the unchanged reusable procedure.” with your reasoning; test candidate closest distractor(s) A and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q10 — D7, select 1; gp2-intermediate-q10-v1

Exact review target: [batch 1](content/intermediate-pilot/batch-1.md), original question and options A/B/C/D.

- Draft SHA-256: `8c962f7eb6caf0a0d18a033dba2e67659a818bf630bd2109bc009498ea027eea`
- q1: `sha256:q1:9409e7944553ad094d080a397daff595a9ddc361d09c138d206cd4c8724663c0`
- Prospective g1: `sha256:g1:029ee148bcb0000a2f264c01d14705b3765e5eb04b73564d3b28ec41f7623ba6`

Source tasks: index 0, **Workflow Design & Diagnosis**, 12. The sequence runs cheapest first. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Identify the first discriminating check for a missing action-and-owner output in a complete, fresh handover chat.” with your reasoning; test candidate closest distractor(s) B and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q12 — D2, select 1; gp2-intermediate-q12-v1

Exact review target: [batch 1](content/intermediate-pilot/batch-1.md), original question and options A/B/C/D.

- Draft SHA-256: `e2833f3d71d84fa7dd614c70d3a6ae334f5b0e58f7bd082d14dd82beabdd9186`
- q1: `sha256:q1:83e2e0474692c99cc4f732bd0c39ebd9439708784d657c4a8d33ec5a125b0e13`
- Prospective g1: `sha256:g1:865c6477f6da9676310a0bd27f527e1235bc126bc79ce047ef941b501b46de3f`

Source tasks: index 0, **Code You Never Write**, 6. Verifying work you cannot read. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Investigate the actual full-run registration loss against the retain-every-registration rule.” with your reasoning; test candidate closest distractor(s) B and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q18 — D2, select 2; gp2-intermediate-q18-v1

Exact review target: [batch 2](content/intermediate-pilot/batch-2.md), original question and options A/B/C/D/E.

- Draft SHA-256: `0e66340a855d171e14a32b8aee5bcf42e2d60c880eb8ef4457ee057c404c5c59`
- q1: `sha256:q1:7c8aa2c80923840442570680195933c5f185099ba20071a8980e3d6d28c8fcff`
- Prospective g1: `sha256:g1:1e313528cde8ed5ee4614299e294e7cb14d2c76400a0c0f08740e7ba81623060`

Source tasks: index 0, **AI Prompting in 2026: A Crash Course**, 10. Data analysis (the model writes and runs code); index 1, **Code You Never Write**, 6. Verifying work you cannot read. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Correct the affected monthly figure and dependent quarter total using only receipts minus refunds.” with your reasoning; test candidate closest distractor(s) A/C and name the strongest independently. Review every option A/B/C/D/E and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q25 — D6, select 1; gp2-intermediate-q25-v1

Exact review target: [batch 2](content/intermediate-pilot/batch-2.md), original question and options A/B/C/D.

- Draft SHA-256: `f07fb75192da9ce8358d9678c42a8b0d05bb5469d1b02062e62dca15fc85bf17`
- q1: `sha256:q1:60acadbaed616dcac911d547fb14ff6f62f84f23ee5c729fa2c908f896aa4e1e`
- Prospective g1: `sha256:g1:8f1c0147f61634b1bb89e36783fba00f8bbc7af31b4c7897f830ea9980a57c82`

Source tasks: index 0, **Governance, Risk & Responsible Use: A Crash Course**, 4.1 Look at who was excluded. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Investigate possible unsupported exclusions without presuming unfairness or changing the agreed selection criteria.” with your reasoning; test candidate closest distractor(s) D/B and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q26 — D2, select 3; gp2-intermediate-q26-v1

Exact review target: [batch 2](content/intermediate-pilot/batch-2.md), original question and options A/B/C/D/E.

- Draft SHA-256: `b4a60ae9cc2c951eaacfaad104b8cd86db6b3eda0227b65c131c26d3234d29cb`
- q1: `sha256:q1:f63805bcb80dfbafac7d4dbf2b52f95ea8c9acfdfd5b0a2a90ec38a650d92298`
- Prospective g1: `sha256:g1:b5cf42e7cb2efd5b2267a922b3ae01260dda3aae9ed042b97fcda9720baa5377`

Source tasks: index 0, **How to Think in the AI Era: Crash Course**, Discipline 2: The Reasoning Receipt. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Record the actual decision and reason for each AI contribution using the receipt categories.” with your reasoning; test candidate closest distractor(s) E and name the strongest independently. Review every option A/B/C/D/E and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q33 — D4, select 1; gp2-intermediate-q33-v1

Exact review target: [batch 2](content/intermediate-pilot/batch-2.md), original question and options A/B/C/D.

- Draft SHA-256: `d4db6146a8fa2191cd296d019f925a9e6eeed7baee45cb04c9b559da58a34a47`
- q1: `sha256:q1:8ecba5c6203302ec120128e096ba85b94798d01d08a1b9335debfd20c7c5e521`
- Prospective g1: `sha256:g1:3472873a3c414db40859bb26ddaf5d6266b817fe655c9d5e54f9b66db7dfb0aa`

Source tasks: index 0, **Workflow Design & Diagnosis**, 16. Measure the thing you actually care about. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Measure total staff time to a usable equal-quality brief and limit the conclusion to one observed trial.” with your reasoning; test candidate closest distractor(s) B and name the strongest independently. Review every option A/B/C/D and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**

#### Q59 — D6, select 3; gp2-intermediate-q59-v1

Exact review target: [batch 2](content/intermediate-pilot/batch-2.md), original question and options A/B/C/D/E.

- Draft SHA-256: `030e6095f6253a11c64019e9b7f7bba70748cb19d0042382ae98de3865bfe105`
- q1: `sha256:q1:9960556ebecbff7485993dfb158e9bd712cf77eee6ba9f158f0d8513a816c5ca`
- Prospective g1: `sha256:g1:3eac27881f33c58c0bea05c6a05a834c0287bc3bfc0dc6585fff6f5abf2faa46`

Source tasks: index 0, **Governance, Risk & Responsible Use: A Crash Course**, 8.5 Re-check when the workflow changes. Record passage locator, access date, supporting/contradicting evidence and case assumptions for **each** reference.

Reviewer-only work after sealing the solve-first note: compare the ask “Identify three changes that cross the stated approval scope and require review before use.” with your reasoning; test candidate closest distractor(s) C and name the strongest independently. Review every option A/B/C/D/E and the complete selected set.

Blank evidence: solve-first answer/reason/ambiguity ___; source evidence ___; H1 ___; H1+H2 ___; H1+H2+H3 leakage verdict ___; strongest alternative and decisive rejection ___; each option/set verdict ___; vocabulary/arithmetic ___; defect IDs/resolution ___; reviewer name ___; date ___; exact three hashes verified ___; signature ___; disposition (approve/changes requested/withhold) ___. **Unsigned; no human review recorded.**


## 5. D14 learner-observation proposal

**Current D14 policy — owner-authorized amendment, 2026-10-18:** For the current ten-question Intermediate pilot, owner-led evaluation and separately provided explicit final owner pilot acceptance replace the mandatory external-student evaluation. Recruitment, participant consent, interviews, observation records and three-student sessions are not required. Policy authorization is recorded; a personal walkthrough is not evidenced and final pilot acceptance remains pending. No independent learner-usability or measurable learning-effectiveness evidence has been obtained. Native accessibility, historical PDF/recovery risk decisions and full Phase 6 acceptance remain separate outstanding requirements. See [authoritative amendment](D14-OWNER-ACCEPTANCE-AMENDMENT.md).

### Historical three-participant protocol — superseded

The original protocol below is retained verbatim as superseded planning history. Its participant gates are no longer mandatory for this pilot; no consent, sessions or findings are asserted.

**Proposal awaiting owner approval; no recruitment, consent or observation performed.** Use at least **three consenting participants**, preferably with varied familiarity and including someone who uses keyboard/accessibility aids if they voluntarily agree. This is not a substitute for specialist screen-reader testing. Owner must approve facilitator, participant suitability, consent process, tasks, data retention and supervised local scope before invitations. Use only independently reviewed exact content after that gate, or clearly label any earlier synthetic rehearsal as tooling/usability rehearsal with no educational-content claim.

Each participant completes one untimed **five-question** session. Assign the existing first five-item set to P01, second to P02, and one of those sets to P03 based on balancing prior familiarity; document assignment before starting. This covers all ten across the group and includes select-one/two/three, tables and differing domains. It does not require custom mixing, adaptive behavior or approval of D12 overlap. Declare previous exposure and optional hints; no pressure to answer correctly or quickly.

Allow roughly 30–45 minutes with breaks/withdrawal at any time. Obtain explicit consent for anonymized notes and separate opt-in for any recording; no recording by default, no account signup/telemetry, no real names or sensitive examples in evidence. Store only pseudonymous task notes in an owner-approved location, restrict access, agree a deletion date and a withdrawal contact. Do not promise a retention period before the owner chooses it.

For each of five questions, ask the learner to think aloud: “What decision is being requested?”, “Which constraint decides between the strongest options?”, “Which plausible alternative do you reject, and why?” For multi-select, ask how the set covers all constraints and why each excluded option fails. Facilitator remains neutral, records any assistance and does not reveal the key before commitment. Ask the learner to find/request a hint only if useful, explain its effect, navigate away/back once, check the answer, explain feedback in their own words and finish the session. Record vocabulary stumbling, table/option reading, controls, selection counts, saved/locked-state understanding and feedback/navigation friction. End with local-storage/repeat-exposure caveat comprehension and two open questions about confusion and usefulness.

Observation row: participant pseudonym/consent reference; artifact/hash/set; question ID; prior exposure; initial reasoning and rejected alternative; hint stage and learner paraphrase; confusing term; navigation/feedback issue; facilitator intervention; outcome; defect ID. Leave every row blank until observed. Count completion and requests descriptively; do not create an invented pass-rate target such as 2/3 learners answering 4/5.

Defect log: exact reproduction, anonymized quote with consent, affected digest/UI state, severity, owner, proposed remediation, disposition and retest evidence. Content/key/leakage/privacy/data-loss issues block the affected pilot and require editorial/technical review. Repeated usability confusion requires remediation and retest of the affected task with consent; absence of three-participant consensus does not dismiss a serious finding. Obtain separate scope for source/content changes and renew approvals/hashes. Owner then reviews actual notes and unresolved defects before accepting the local pilot.

**Interpretation:** think-aloud observations show usability and reasoning expressed during these exposed/assisted tasks. They do not establish measurable learning gains, retention, transfer, unseen mastery, pass prediction or causal effectiveness. Those claims would require a separately designed study with independent unseen measures and appropriate sampling/comparison. No observations or effectiveness results are fabricated here.

## 6. Native screen-reader procedure and accessibility acceptance

**Prepared, not executed.** Operator uses an actual installed Windows screen reader (for example NVDA or Narrator) with a real supported browser and keyboard. Record exact OS, browser/reader versions, speech/braille mode, zoom/text scaling, viewport, input, artifact digest, synthetic fixture/catalog identity and whether the build is development or production preview. Reader roles/DOM assertions, screenshots and AI inspection cannot fill the observed-speech fields. Use the reader's own documented heading/form/table commands; record any commands or mode changes required.

Use isolated guest/synthetic-account data on an owned local origin; keep external traffic denied. For enabled Guided tests use the existing excluded synthetic configuration, not production flags/catalog. Do not enter real accounts or expose unreviewed real guides. Complete the disabled production-preview path separately. Every row needs expected result, actual spoken output/reading order, focus destination, pass/fail/not-run, defect/evidence and operator/date.

| Step | Action | Expected observable result / acceptance |
| --- | --- | --- |
| SR1 entry | Read Home landmarks/headings, follow Open Guided Practice; also open /guided directly | Descriptive entry and untimed/local/repeat caveats, logical heading order, focus reaches page heading; no Mock score claims |
| SR2 size/set | Navigate native selects by keyboard; choose 5/set1, change size to10 and back | Label/value/set range understood; reset announced/readable; unsupported/insufficient states explained. Any proposed D12 overlap case stays unexecuted until policy implementation approved |
| SR3 answering | Start 5; read scenario/options using browse mode, then operate radio/checkbox with Tab/arrows/Space | Legend announces exact count, every option has complete name/state; multi-select cap and Clear usable; visible focus persists after save. No correctness, explanations, glossary, sources or unrevealed hints in reading order |
| SR4 hints | Reveal one at a time, collapse/show, request all three | Short saving/result status; new hint readable on demand, no unsolicited full-feedback speech; focus remains useful and final reveal moves appropriately; expanded state/count clear; collapse retains hint count |
| SR5 commit | Try incomplete selection, then correct cardinality; activate Check answer | Incomplete submission unavailable with understandable count; only saved commitment exposes feedback; focus to “Correct/Not quite — answer saved and locked”; first answer cannot change |
| SR6 reasoning/table | Traverse criteria, every option, original explanations, glossary and sources; use labelled table region | Logical reading order and row/column context; table scrolls using keyboard without whole-page overflow; source link name/destination understandable; returning does not lose position unexpectedly |
| SR7 navigation/resume | Previous/Next, reload draft/hint/committed states, finish five; reload and browse completed session | Correct question heading/progress, saved counts and lock; summary focused and read-only; caveat understandable; no focus on vanished/disabled control or repeated full explanation announcements |
| SR8 report dialog | Open synthetic submitted Results, Guided Review, all three filters, partial and zero cohorts | Dialog title/counts/independent filters announced; focus contained, Escape/Close return to opener; zero case has ordinary-review exit; exposed retry notice remains; return to original Results focuses meaningful destination |
| SR9 errors/protection | With prepared synthetic fault fixtures: denied/quota save, corrupt/newer Guided, corrupt Mock, private source loss, another tab starts Mock | No unsaved hint/feedback; readable distinction between Guided-save and Mock-protection failure; bounded Retry; instructional subtree disappears from reader navigation and focus has safe destination; no foreign identity/raw content; originals preserved |
| SR10 interrupted flows | Retry full protection check; background/foreground, conflicting tab write, signout synthetic private source | Recheck before instructions return; explicit conflict/retry without automatic resubmission; no stale private content or trapped focus |
| SR11 dialogs/reflow | Keyboard through long scrolled dialogs, shrink viewport; repeat at 320/390/768/1366 and 844×390, plus actual 200% text | Heading/Close/actions reachable, contained scrolling, visible focus, no clipped labels or page-wide horizontal scroll; verify actual scale geometrically/computed text, not device scale factor alone |
| SR12 normal/disabled | Run ordinary Mock/Review/Submit/Leave, Results/PDF, History/Settings and synthetic recovery; inspect disabled preview direct URLs | Mock feedback delayed, native dialog containment/return correct; account actions absent during Exam; recovery resumes outside it subject to open diagnostic issue; disabled guidance announces unavailable and preserves saved records |

Acceptance checklist (all **unchecked** pending execution):

- [ ] Native reader identifies names/roles/states, headings/landmarks and table context accurately; actual speech/order recorded.
- [ ] Entire workflow works without mouse, with useful focus after save, hints, commitment, errors, navigation, reload, modal close and suspension.
- [ ] No precommit or blocked/private instructional content is reachable by reader navigation; no full explanation unexpectedly announced by live regions.
- [ ] Exact-count selection, disabled reasons, saving/locked states, filter counts, empty/partial feedback and exposure/storage caveats are understandable.
- [ ] Dialog trap/Escape/return and scrolled resize pass; all controls/actions remain reachable in every required reflow/text condition.
- [ ] Contrast, non-color status cues, visible focus, 44px control targets and text/URL wrapping checked by the operator; failures logged, not inferred from styles.
- [ ] Physical touch and any additional browser/reader combinations have explicit results or owner-reviewed coverage gaps; Chromium emulation is not physical-device evidence.
- [ ] All blocking accessibility defects remediated under authorized scope and retested; human accessibility acceptance signed against the exact artifact. No approval inferred from this checklist.

## 7. Production preview and artifact requirements

Current source `runtime.ts` enables Guided only when `VITE_GUIDED_PRACTICE_ENABLED === 'true'`. `.env.example` is false; the inspected private local environment has no Guided override (only that fact is recorded). `productionCatalog` is `frozenCopy([])` and public contains no guide files. Test-only `vite.guided-test.config.ts` replaces runtime content under an excluded configuration; this is not a production content path. `.vercelignore` excludes Markdown, tests, evidence, screenshots, private environment and synthetic Vite configurations. Narrow Guided rewrites are present alongside History/Settings; Vite preview fallback is not proof of actual-host rewrite behavior.

The preserved Phase 5 disabled build is reused byte-for-byte for focused preview diagnostics, not rebuilt. [Preview asset manifest](../../test-results/guided-practice/phase-6/preview-artifact-manifest.json) records all six files. Source and preserved built bank hashes remain Intermediate `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`, Advanced `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`. A focused unchanged disabled-preview case **passes 1/1**: no Home entry, unavailable direct route and no synthetic/unapproved question UI (`disabled-preview-check.json`). The previous complete disabled/empty-catalog preview results remain historical; no hosted production configuration is inspected or changed here.

Before a future release, freeze the entire working tree/lockfile/configuration and sanitized build environment, not only Git HEAD. Bind all reviewed q1/g1/guideVersion/opaque review IDs, source/built banks, approved Markdown, served HTML/CSS/JS/guide files and SHA-256 manifest; exclude draft/synthetic markers and private artifacts. Reconcile independent reviewer and separate owner approvals with the **same** digests. Verify default-off, enabled-empty and separately authorized approved-enabled states; direct routes/reload; failed/mismatched/revoked assets; owner/source loss; telemetry exclusion; retained frozen sessions and compatible disabled rollback. No flag/catalog promotion is authorized now. Build/preview acceptance, publication, deployment and actual-host smoke remain separate decisions. Rollback preserves both Mock data and Guided IDB and cannot teach an old offline build a future revocation.

## 8. Release-blocker register and exact owner decisions

| ID / plan risk | Status | Evidence needed to close / accountable role |
| --- | --- | --- |
| B1 PDF reliability (R2/R3) | **Open release blocker** | QA/implementation owner: diagnose historical timeouts/cancellation; owner scope for demonstrated readiness fix, affected regression and exact artifact evidence; passing focused runs alone insufficient |
| B2 recovery reload (R3/R10) | **Open regression/release obligation** | QA/implementation owner: causal trace of historical missing-dialog state or explicit owner disposition with limits; separate current cold-start timeout; no timeout inflation |
| B3 independent educational approval (R7/R8/R9) | **Blocked pending human work: 0/10** | Named human reviewer: signed solve-first/source/cumulative-hint/all-option records on final hashes; resolve instructional disputes. Owner draft approval10/10 already recorded, remains distinct |
| B4 D12 (R21/R22) | **Owner decision pending; unimplemented** | Owner approves exact fixed-size overlap/error/frozen-session semantics, then explicitly authorizes implementation and tests described in §3 |
| B5 D14 (R20) | **Owner-led policy authorized; final owner pilot acceptance pending** | Owner-led evaluation and separately supplied explicit final pilot acceptance of exact candidate/scope; no required recruitment/consent/interviews/participant records/three-student evaluation. No walkthrough inferred; no independent learner-usability or measurable learning-effectiveness evidence obtained |
| B6 native accessibility (R11) | **Not executed; release check outstanding** | Human operator/accessibility reviewer executes §6 with real reader/output and resolves blocking defects; physical input/other-browser gaps documented |
| B7 exact release artifact/rollback (R1/R19) | **Current source integrity checked; release candidate not accepted** | QA/release owner reconciles approvals, source/build/served hashes, full applicable I1–I10 matrix and compatible rollback on final authorized source |
| B8 publication/deployment/host acceptance (R12/R19/R24) | **Not authorized / not executed** | Owner separate exact guide publication/flag decision, artifact/host deployment approval and actual-host acceptance. No real accounts/reports/config mutations inferred |

Other retained limits: owner conditional Phase3/4 continuation does not supply final educational/accessibility/reliability release acceptance; storage eviction, already-seen material, old/offline revocation and lack of Guided backup remain disclosed limitations. Account-deletion timeout remains outside this workstream; no speculative repair or new blocker manufactured without a concrete dependency.

Remaining decisions, in order:

1. Approve or revise **D12** exact algorithm, disabled sizes, exclusions and preserved frozen-session behavior; separately authorize its implementation (no approval inferred here).
2. Authorize the **specific PDF readiness change** if desired; agree further bounded causal recovery/cancellation diagnostics and any later concrete fix scope. Reliability acceptance remains explicit and evidence-bound.
3. Supply ten independent human review records; confirm any reviewer independence/exposure issue and the corrected-record reapproval process. No repeat owner content approval is needed for unchanged drafts merely because this worksheet exists.
4. Apply amended **D14** owner-led evaluation and record explicit final owner pilot acceptance separately when supplied. External participant arrangements and observations are not required; retain their original protocol as superseded history.
5. Commission native screen-reader/human accessibility execution and decide supported browser/input coverage and any explicit residual gaps.
6. After those obligations, authorize and accept **full Phase 6 QA/readiness** on one exact candidate. This bounded authorization does not grant that acceptance.
7. Separately decide guide publication/catalog promotion/production enablement, deployment artifact+host+rollback and post-deploy smoke/production acceptance. Phase7/8 progression requires later decisions; neither begins here.

## 9. Recommended Phase 6 execution sequence and verification ledger

1. Review this bounded handoff and make D12/reliability scope decisions; preserve today's candidate/evidence. Keep production disabled/catalog empty.
2. Complete independent human review of the ten exact records, logging ambiguities/leakage. Authorize any specific corrections, regenerate affected digests and obtain renewed affected approvals before content acceptance.
3. Implement only separately approved D12/reliability changes, starting with deterministic reproductions. Run affected focused tests, preserve failures and obtain technical review. Continue recovery/cancellation diagnosis until its release disposition is evidence-based.
4. Execute the prepared native reader and human accessibility script on synthetic internal fixtures; remediate authorized defects and retest. Reconcile required browser/touch/text coverage.
5. Apply owner-led evaluation and separate explicit final pilot acceptance under amended D14; do not invent a walkthrough or independent learner/effectiveness evidence. External participant sessions are no longer required.
6. Once source/content is stable and full Phase6 execution is authorized, run **one** appropriate final comprehensive cycle (C1–C8/I1–I10 and required Guided/account/telemetry/recovery/legacy/PDF cases) on the exact release candidate; verify artifact, approval and rollback manifests. Do not repeat full suites merely to seek a clean run.
7. Owner separately accepts readiness and, if desired, publication/enablement/deployment. Only after deployment authorization execute actual-host checks and request production acceptance; stop before Phase7 unless explicitly authorized.

| Check in this workstream | State |
| --- | --- |
| Read authoritative bundle/reports; Phase5 acceptance recorded | Complete |
| Current candidate/content/approval/bank/catalog integrity | Complete; exact hash audit, no approval change |
| Focused PDF/recovery diagnostics | Executed; individual failures/passes and causal limits in §2, including preserved production artifact |
| D12 implementation and its proposed tests | **Unexecuted; separate decision required** |
| Human content/source/hint sign-offs | **0/10; pending human evidence** |
| Amended D14 owner evaluation/final acceptance | Policy authorized; walkthrough not evidenced; explicit final owner pilot acceptance pending. Original external-participant protocol superseded, not an outstanding gate |
| Native screen-reader/accessibility acceptance | **Unexecuted; script only** |
| Full typecheck/unit/build/browser cycle | **Not rerun**; no application source changed; Phase5 results are historical |
| Hosted accounts/reports/configuration, guide publication, enablement, deployment, commit/push | **Not performed; outside authorization** |

Final [preservation and cleanup audit](../../test-results/guided-practice/phase-6/final-integrity.json): **PASS**. Nine existing status/report documents changed and this report is the only new repository deliverable. All 148 candidate inputs, original application/tests/public/content files, private-environment fingerprints, historical result hashes, preserved build bytes and Git index/HEAD remain unchanged. All ten worksheet records remain unsigned. No new broken document links; two inherited links to the absent historical `reliability-fix-checks.txt` remain identified without fabricated evidence. All owned diagnostic ports (4173/4188/4236/4299) are stopped. This integrity PASS does not turn the failed recovery diagnostic or pending release checks into passes.

Stop at this readiness handoff. Full Phase6 acceptance is pending.
