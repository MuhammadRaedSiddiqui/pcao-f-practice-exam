# Guided Practice — Phase 6 targeted remediation

Implementation started 17 October; handoff 18 October 2026, Asia/Karachi. **Authorized D12/PDF implementation and verification are complete. Owner review and full Phase 6 acceptance remain pending. One Guided regression remains open.**

## 1. Authority, scope and candidate

The owner accepts [PHASE-6-READINESS-AND-RISKS.md](PHASE-6-READINESS-AND-RISKS.md), approves its §3 D12 policy and authorizes that implementation/tests plus the narrowly proposed §2 PDF-module readiness correction. Recovery remains evidence-only diagnosis. This authorization supplies no human educational review, D14 acceptance, publication, production enablement, hosted mutation, deployment or Phase 7 authority.

Read the complete planning bundle, final Phase 2 matrix/ledgers, Phase 3/4 and Phase 5 reports and accepted readiness handoff. Before edits, captured a fresh **473-file** working-tree snapshot, Git status/index/HEAD and hash-only private-environment fingerprints under [phase-6-targeted evidence](../../test-results/guided-practice/phase-6-targeted/). Pre-existing work is preserved; Git HEAD alone cannot identify the dirty candidate. Tests/build ran in an isolated source copy using installed dependencies, without copying private environment files, with external networking denied and synthetic service boundaries.

D1–D11, all ten educational records/approval fields, original banks, Mock attempt/report formats, scoring/timers, ownership/account behavior and Guided telemetry policy remain unchanged. No recovery behavior, navigation/storage behavior, Blob URL lifetime, eager PDF bundling, service worker, dependency, backend/schema, production catalog or configuration change is included.

## 2. D12 algorithm and actual behavior

[`practiceSets`](../../src/domain/guided/selectors.ts) returns shared descriptors for selection and display. For n verified eligible items, size s=5 or 10 and zero-based set j:

```text
if n < s: insufficient-coverage; disable that size
setCount = ceil(n / s)
startIndex = min(j * s, n - s)
endIndex = startIndex + s                 # exclusive
repeatedCount = 0 if j == 0 else max(0, j*s - startIndex)
```

`selectPracticeSet` freezes exactly s consecutive eligible items. Invalid size, coverage or index is rejected; an out-of-range index is unavailable. There is no randomization, duplicate question within a set, shorter set or alternate bank/version substitution. Ordinary 10/60-item coverage retains disjoint sets; only a final remainder set overlaps. For 11 eligible items:

| Size | Eligible positions in each set | Repeated questions in each set |
| --- | --- | --- |
| 5 | 1–5; 6–10; 7–11 | 0; 0; 4 |
| 10 | 1–10; 2–11 | 0; 9 |

Positions refer to the verified eligible order, not original bank question numbers. The set union reaches every eligible item.

The [landing controls](../../src/ui/guided/GuidedPractice.tsx) use these descriptors for count, range and repeat disclosure. Sizes are disabled independently with available/required counts. Changing length resets selection to set 0. Each option and a wrapping accessible selected-set description disclose range/repeats; this description remains readable when a narrow native select truncates its option. The explanation states that no question repeats within a set. If refreshed coverage invalidates the selected index, the old choice is explicitly unavailable and Start remains disabled until an explicit valid choice; no replacement is silently selected.

### Approved content, exclusions and frozen sessions

[Standalone release validation](../../src/domain/guided/loader.ts) still requires strict release/catalog schema, exact source identity, approved per-entry digests, known question/domain membership and structural validity. After those checks, revoked or exact-source q1-mismatched entries may be classified as exclusions for **new standalone sets**. `resolveEligibility` preserves typed exclusion reasons/counts and never inserts such items into eligible coverage. Other failures remain fatal. A digest from another source/version/question cannot authorize content, and editing an approval string cannot publish it. Unsupported or unapproved data supplies no substitute questions.

No session schema, q1/g1 algorithm, catalog approval, storage format or migration changed. `startSession` re-resolves eligibility and freezes the same exact descriptor membership before repository protection/access checks and durable creation. Existing frozen sessions validate their own items and current approval/access; they do not regenerate from current coverage or setIndex. Unrelated withdrawals or newly disabled sizes preserve saved membership, wording, selections, hints, first commitments, position and revision. Revoking an item inside a frozen session makes that session inaccessible under the existing all-items validation rule, preserving the record and hiding instruction. Damaged or mismatched frozen items remain unavailable. No salvage, replacement, regrading or access bypass was added.

Post-exam release validation, cohort membership/order/counts, snapshot-only selection and all-eligible retry behavior are unchanged. Standalone 5/10 constraints do not pad or truncate post-exam cohorts.

### Cardinality, coverage and safety verification

- [guidedD12.test.ts](../../tests/guidedD12.test.ts) adds **130 cases**. Its 122 coverage cases exhaust n=0…60 for both sizes, verifying exact cardinality, internal uniqueness, determinism, ordered membership, complete eligible union and measured repeat counts. Additional cases cover independent 6/11 boundaries, invalid/stale indices, duplicate coverage, first/middle/last/multiple/all revocations, creation membership, source mismatch, wrong level/version, forged/changed digests, malformed releases, unknown questions and frozen committed-state preservation/protection.
- Existing selector/content/post-exam unit expectations changed only for the approved policy and PDF readiness. Exact negative source/approval/partition, report and cohort oracles remain. Structurally malformed published releases still fail as a unit.
- [Seven D12 browser cases](../../tests/guided-d12-browser/guided-d12.spec.ts) verify displayed and durable final-set membership for 5/10, insufficient 4/9 coverage, revoked exclusion, frozen sessions across unrelated/inside withdrawals and stale selected indices. The separate excluded synthetic runtime/configuration cannot populate or enable production. Screenshot/overflow checks cover 320 and 1366 pixels.

## 3. PDF module readiness

[ResultsPage.tsx](../../src/ui/ResultsPage.tsx) now distinguishes actual module **loading**, **ready** and **error** states. Opening Results still starts the existing lazy import; it does not generate a PDF. A guarded effect acknowledges actual import completion, fences late updates after unmount and shares the existing import promise/cache. A failed import clears that promise so an explicit retry can load again.

While loading, the disabled/busy action says “Loading PDF export…” and explains that first-use offline export requires dependency loading to finish. Export becomes enabled only after the import resolves. Import failure shows “PDF export unavailable,” a reconnect/retry explanation and **Retry PDF loading**. Retry starts another loading attempt. Keyboard focus returns to export or retry after settlement when appropriate, without stealing initial heading focus. Generation/download preparation errors retain their separate original message.

The same immutable Attempt feeds `createReportPdf`. `reportPdf.ts`, `reportMarkdown.ts`, `reportExport.ts`, filenames, contents, original answers/flags/grades/timestamps, lazy generation and the existing 1000 ms Blob URL revocation are unchanged. There is no eager bundling, service-worker caching, broad PDF refactor, added telemetry or speculative cancellation fix. This correction addresses the demonstrated import-availability gap; it does **not** explain or resolve historical download cancellation.

### Cold/warm/offline verification

[pdf-readiness.spec.ts](../../tests/browser/pdf-readiness.spec.ts) runs the same four scenarios in development and separately built production preview:

1. A fresh browser context reaches actual import readiness without creating a Blob. First generation works after going offline; warm offline reuse works too. Filename, PDF header and original localStorage bytes are checked.
2. Hold the actual development module or hashed production chunk in flight. Verify disabled loading/disclosure; go offline and release the request. Verify explicit import error, disabled export and zero generated Blobs. Reconnect, retry by keyboard, verify readiness/focus and download the original report.
3. Fail an online module request, verify error/retry and no premature generation, then retry successfully online.
4. Leave Results during a pending import; late completion changes no departed UI. Return to Results uses the loaded module and exports the original report.

“Cold” here means a fresh browser context with the PDF module not loaded; it is not a controlled disk/CPU/cache-eviction stress experiment. The original PDF suite additionally parses all pages and verifies original paragraphs/table cells/metadata, real-bank frozen snapshots, legacy reports, retries/resource cleanup and touch activation. Preview ran both PDF files with one worker under the original 30-second case budget. Guest regression used the accepted two-worker isolated policy. No timeout increase or weaker content/download assertion was used.

## 4. Recovery diagnosis and uncertainty

Root recovery source/tests/configuration remain byte-identical. An evidence-only Vite transform in the isolated diagnostic server observed the existing `recoveryContext.matches(next)` result once, SDK event names, hook recovery/loading/session-presence booleans, header mode/busy state, native modal show/close calls and close-event open/ref state. It did not change decisions, call matching twice or write authentication data. Appended observer hooks collected allowlisted booleans/enums/timestamps/local module basenames and response durations. No account ID, email, token, callback URL, request body or trace was recorded in the state evidence.

Two Cancel and two Escape reopen/reload cases **passed 4/4** under original 45-second test and 5-second assertion deadlines. All eight document loads reached the password modal. After reload, DOM-ready→recovery state took 116–578 ms and recovery-state→modal-open59–149 ms. Header effects sometimes logged 1–2 ms after a child modal opened; that is observer ordering, not unauthorized opening. StrictMode close/show lifecycle events were observed without reproducing an unsolicited missing dialog. Maximum first-page module response was about 1.11 seconds; later contexts on the same server about 0.19–0.23 seconds. Resource contention was not established causally.

The historical missing-dialog assertion and the readiness workstream's separate cold-start budget timeout remain distinct. The latter had an approximately 29-second initial navigation and eventually restored the dialog; it does not explain the original absent-dialog assertion. Router POP warnings also occur in passing flows. Neither router/callback readiness nor async synchronization nor another specific mechanism is established as the historical cause. Passing observations and final 8/8 normal recovery do not close that obligation. No recovery behavior/deadline change was made.

See [diagnostic summary](../../test-results/guided-practice/phase-6-targeted/recovery-diagnostic-summary.json), `recovery-state-1.json` through `-4.json`, [instrumentation record](../../test-results/guided-practice/phase-6-targeted/recovery-instrumentation.json), generator and observer source in the evidence directory. Normal final recovery used unmodified source/configuration and no instrumentation.

## 5. Verification, failures and reruns

All run names below refer to files in [phase-6-targeted](../../test-results/guided-practice/phase-6-targeted/). Command/result/log/lifecycle records identify the isolated workspace, environment, deadlines, workers and cleanup. No private environment was copied; normal guest/build account/telemetry were disabled, enabled service tests used synthetic boundaries, external Node/browser networking was denied, suites ran sequentially with fresh contexts and zero automatic retries.

### Development and initial failures retained

| Run | Actual result and correction |
| --- | --- |
| `focused-domain` |192/197; five new revocation parameter cases unpacked arrays as scalars. Corrected new test table shape; no product/safety weakening |
| `focused-domain-repaired` |155/155 across D12/selectors/content, including all 130 D12 cases |
| `typecheck-development` |Pass |
| `d12-development`; `d12-final-development` |5/5 initially; 7/7 after frozen/stale-selection coverage; final run includes disclosure screenshots |
| `pdf-readiness-development` |3/4; new status lookup matched both loading and existing review-count status. Scoped lookup to PDF-loading status, retaining assertion |
| `pdf-readiness-repaired` |4/4 |
| `recovery-state-diagnostic` startup |Not executed: generated config quote escaping failed; startup/cleanup errors retained. Repaired evidence-only generator and already-exited owned-process cleanup |
| `recovery-state-diagnostic-repaired` |4/4 with original assertions/deadlines and appended observers |
| Initial `unit-final` |569/571 in 35 files. Two old expectations asserted immediately ready PDF in server HTML and whole standalone rejection for one source mismatch. Updated to disabled/busy actual-import loading and exact safe mismatch exclusion; report/filter/cohort oracles remain |

After the initial full unit run, only `tests/guidedPostExam.test.tsx` expectation maintenance changed. [Exact maintenance hashes](../../test-results/guided-practice/phase-6-targeted/unit-expectation-maintenance.json) and [browser/build input equivalence](../../test-results/guided-practice/phase-6-targeted/browser-build-input-equivalence.json) prove all application/browser/build inputs stayed identical. TypeScript, full units and build were then confirmed; successful full browser suites were not repeated for that unit-only update. No claim is made that the first full unit run passed.

### Complete applicable final outcomes

| Check / run | Actual outcome |
| --- | --- |
| `typecheck-final`; `typecheck-confirmed` |Pass both |
| `unit-final`; `unit-confirmed` |569/571 initially; **571/571 in 35 files** after the two expectation corrections |
| `build-final`; `build-confirmed` |Pass both |
| `post-exam-final` |**24/24 pass** |
| `guided-existing-final` |**37/38 pass; one unresolved failure** |
| `d12-final` |**7/7 pass** |
| `guest-final` |**139/139 pass**: 135 existing + 4 readiness |
| `account-final` |**32/32 pass** |
| `analytics-final` |**6/6 pass** |
| `recovery-final` |**8/8 pass**, uninstrumented |
| `guided-sdk-final` |**3/3 pass**, actual intercepted SDK/isolation |
| `disabled-preview-final` |**4/4 pass** |
| `pdf-preview-final` |**14/14 pass**: 10 existing + 4 readiness |
| `empty-catalog-final` |**4/4 pass**, isolated enabled flag/empty catalog |
| `route-cancellation-diagnostic` |**4/4 pass**, original assertion/deadlines with observers |

[Verification summary](../../test-results/guided-practice/phase-6-targeted/verification-summary.json), [original cycle](../../test-results/guided-practice/phase-6-targeted/final-cycle-results.json) and [confirmed gates](../../test-results/guided-practice/phase-6-targeted/confirmed-gates-results.json) preserve identities/counts/failures. Per-suite JSON and logs retain every result separately; overlapping suites/reruns are not unique additional coverage. Main JavaScript is 704.12 kB and PDF remains a separate 1,834.25 kB chunk. Existing chunk-size and ineffective dynamic-import warnings remain unsuppressed and did not fail the build.

### Open Guided queued-route persistence failure

The existing test at [guided-protection.spec.ts](../../tests/guided-browser/guided-protection.spec.ts), “changing Guided routes invalidates a queued hint before it can persist” (line 121), holds the shared lock from another tab, clicks Reveal Hint, leaves for `/guided`, releases the lock and goes Back. The full run read a changed record: `T1.maxHintRevealed` **0→1**, revision **0→1**, with an updated timestamp. The unchanged assertion requires the complete original saved record. This is a persistence/cancellation failure; a clean Guided regression is not established.

Four focused runs appended observers only to an isolated test copy: route class, click/history/POP timing, lock request/entry and Guided revision/hint-count writes. They passed the original complete-record assertion. Hint-click→leave-link took 81–318 ms; history changed to landing about 3–6 ms after the leave click; Back POP occurred 136–599 ms after the hint click. No Guided `put` followed those hint clicks. Observers preserve lock callback return values but can affect scheduling. [Timing summary](../../test-results/guided-practice/phase-6-targeted/route-cancellation-summary.json) retains each sequence; these passes do not erase or explain the initial failure.

App, hook, repository, protection and navigation sources are unchanged from the accepted candidate. Inspection shows cancellation relies on the hook intent epoch and repository checks around preparation/transactions; the failed run did not capture those internal decisions. A stale command, lifecycle race or another cause is not proven. No concrete behavior fix is justified yet and none was applied. The diagnostic test copy was restored exactly before integrity verification. Further causal diagnosis and any navigation/storage remedy require separate bounded owner scope; retain this release blocker and the unchanged safety assertion.

### Unexecuted and blocked checks

Native screen-reader acceptance, independent human educational review, D14 participant observations, physical-device/other-browser coverage and hosted release/rollback smoke remain **unexecuted**. They are not replaced by AI visual inspection or synthetic browser checks. Closure of the Guided cancellation failure and historical PDF cancellation/recovery obligations remains **blocked by insufficient causal evidence and separately authorized remediation**, not classified as passing.

The first handoff write hit disk exhaustion and left this report empty. After the owner resumed with space available, the report was reconstructed from preserved logs/manifests and audited. This infrastructure interruption changed no tested source and triggered no additional application fix or full-suite rerun.

## 6. Integrity audit

[Final integrity](../../test-results/guided-practice/phase-6-targeted/final-integrity.json), [content integrity](../../test-results/guided-practice/phase-6-targeted/content-integrity.json) and the [final handoff inventory](../../test-results/guided-practice/phase-6-targeted/handoff-audit.json) provide the exact checks:

- **Only four runtime files changed:** `src/domain/guided/loader.ts`, `selectors.ts`, `src/ui/guided/GuidedPractice.tsx` and `src/ui/ResultsPage.tsx`. All other 50 source files in the starting manifest remain identical, including App, account/recovery hooks, Guided storage/protection/access/session/schema/fingerprints, analytics and original PDF/report renderers. Dependencies/hosting configuration/private environment are unchanged.
- New verification files are `tests/guidedD12.test.ts`, `tests/browser/pdf-readiness.spec.ts`, `tests/guided-d12-browser/guided-d12.spec.ts`, `tests/fixtures/guidedD12Runtime.ts` and `playwright.guidedD12.config.ts`. Existing selector/content/post-exam unit expectations and the revoked-session browser copy assertion changed for authorized behavior; `vite.guided-test.config.ts` adds only the excluded synthetic D12 mode. Cancellation assertions/deadlines remain unchanged. Current status/spec/planning documents record actual outcomes without accepting full Phase 6.
- Content-folder bytes, all ten draft SHA-256/q1/prospective-g1 identities, owner bindings and human-review fields/signatures are unchanged. The prior independent hash recomputation remains valid for byte-identical inputs: **10/10 final owner approvals; 0/10 independent human reviews; 12/12 AI source checks**. All ten authoring records remain draft and runtime `approvedG1` null. Accepted readiness worksheets remain unsigned.
- Source and isolated built bank hashes match: Intermediate `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`; Advanced `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`. The approved Markdown fixture remains unchanged. No public guide files were added.
- The original-report integration oracle retains identical raw report, hash/model/metadata and all 61 parsed PDF pages before/after Guided launch/completion/return: [report integrity](../../test-results/guided-practice/phase-6-targeted/original-report-integrity.json). Existing real-bank/legacy PDF tests pass. Binary PDF equality is not claimed because generation metadata may vary.
- Account regressions verify owner isolation, signup migration/backups, trusted/downloaded reports and stored-attempt boundaries through synthetic services. Real intercepted SDK tests verify no Guided cloud writes/telemetry; ordinary analytics passes separately. No hosted account/report/configuration mutation occurred.
- `productionCatalog` stays frozen empty; `.env.example` retains false and the private local environment contains no Guided enablement. The isolated build/default-preview is off. Enabled-empty-catalog verification uses temporary isolated environment only. Six output artifacts are hashed; no public guidance or selected synthetic/draft sentinels appear. `.vercelignore` continues excluding documentation, tests, evidence and test configurations. Local checks establish no new hosted-state claim.
- The [confirmed candidate manifest](../../test-results/guided-practice/phase-6-targeted/confirmed-candidate-manifest.json) matches actual root/tested application/test/configuration bytes after restoring observer copies. Historical Phase 3/4 and Phase 5 PDF/recovery evidence retains recorded hashes. Git HEAD/index and private environment are unchanged. All twelve owned QA/proxy ports have no listener.

[Visual inspection](../../test-results/guided-practice/phase-6-targeted/visual-review.json) records inspected 320/1366 D12 and 320 PDF-retry screenshots. Wrapping range/repeat and reconnect/retry copy is readable; automated no-page-overflow assertions pass. The narrow native select can clip its option label, so the full disclosure also appears in wrapping text. This supplies no native assistive-technology or human acceptance.

## 7. Remaining blockers and owner decisions

| Blocker / decision | Current disposition and required next action |
| --- | --- |
| Targeted implementation acceptance |Owner review of this report, exact candidate and actual outcomes remains pending; full Phase 6 is not accepted |
| Guided queued-route hint persistence |Existing Guided 37/38, observer reruns 4/4. Cause unknown. Separately authorize bounded internal timing diagnosis and then a concrete navigation/storage fix if demonstrated; preserve safety oracle |
| Historical PDF cancellation/timeouts |Import readiness is specifically corrected/tested. Cancellation cause remains unresolved; no speculative Blob change or broad reliability closure |
| Historical recovery missing dialog |Measured current restoration passes; original cause unknown. Any behavior/deadline fix needs separate concrete approval |
| Independent educational review |All ten exact-hash solve-first/source/cumulative-three-hint/strongest-distractor/full-option reviews and human signatures remain pending; owner approval is distinct |
| D14 |Owner protocol decision and at least three consenting five-question observations, defects/remediation remain pending; no recruitment/observations occurred |
| Accessibility/input coverage |Execute accepted readiness native screen-reader script/checklist and human walkthrough; decide physical/other-browser coverage and remediate observed defects |
| Public release/artifact/rollback |Exact content approval, artifact/host/rollback and full local readiness remain separate owner decisions; no publication or production enablement |
| Deployment/host acceptance/Phase 7 |Separately authorize only after required gates; no hosted mutation, deploy, commit, push or later-phase start occurred |

D12 policy approval is recorded; it is no longer an undecided-policy blocker. Its implementation awaits owner review. Recommended next sequence: review this handoff; authorize bounded diagnosis of remaining reliability failures; approve concrete remedies only with causal evidence; complete exact-hash human educational review and native accessibility; decide/execute D14; then assemble a separately approved release candidate and deployment/rollback request. **Stop here for owner review.**
