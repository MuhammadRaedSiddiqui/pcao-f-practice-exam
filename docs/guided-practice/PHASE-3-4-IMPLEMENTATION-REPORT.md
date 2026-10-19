# Guided Practice — combined Phase 3 + 4 implementation report

**Phase 5 authorization amendment — 17 October 2026:** The owner conditionally accepts Phase 3/4 technical evidence for continued internal development, while release readiness remains conditional on educational, accessibility and reliability requirements. Phase 5 implementation and isolated verification are explicitly authorized with synthetic approved-content fixtures only; this narrowly amends the original approved-content entry prerequisite. Production stays disabled/catalog empty. No publication, Phase 6, deployment, commit or push. Phase 5 acceptance requires owner review. Earlier authorization/stop statements below are historical.


17 October 2026, Asia/Karachi. **Internal implementation; individual Phase 3 and Phase 4 owner acceptance pending.** The owner's combined authorization covers implementation, isolated testing and documentation. It does not approve educational publication, deployment, commit/push or Phase 5.

The original [master plan](GUIDED-PRACTICE-MASTER-PLAN.md), [architecture](GUIDED-PRACTICE-ARCHITECTURE.md), [risk register](GUIDED-PRACTICE-RISK-REGISTER.md), [matrix](GUIDED-PRACTICE-VERIFICATION-MATRIX.md), [Phase 1 contracts/review](PHASE-1-REVIEW.md), [Phase 2 handoff](PHASE-2-FINAL-HANDOFF.md) and [execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md) remain applicable. Combined authorization supplies technical entry permission for both phases without inventing earlier educational acceptance or either new phase's exit acceptance.

## Phase 3 — interface

Implemented the separate Home card and additive `/guided` / UUID-only `/guided/session/:sessionId` routes within the existing mounted App. The root Mock Exam/Results history contract is unchanged. Narrow hosting rewrites are prepared locally; no host was deployed.

The landing page offers Intermediate fixed five- or ten-question sessions, default five, numbered sets, length-change set reset, eligible counts, saved sessions and explicit removal confirmation. Advanced remains “Coming later.” Repeated exposure and browser-local storage limitations are stated. The disabled production build hides the Home card and presents unavailable direct routes without deleting saved practice.

The question screen has native radio/checkbox groups, a selection cap and Clear, Previous/Next, three sequential optional hints, collapse/reopen without resetting hint counts, exact-count Check answer and explicit Finish. Pending choice selection is visual only and labelled saving; Check remains disabled during persistence. New hints and correctness wait for a successful durable command. The first saved commitment locks permanently. The last answer's feedback stays available until Finish.

Precommit rendering receives only `PrecommitViewModel`: prompt, options, count, saved/pending selections and previously requested hints. Correct keys, criteria, reasoning, vocabulary, comparisons and sources are absent from that branch, including accessibility text. Committed feedback uses the frozen question/guide and renders all-option comparisons, original explanations, vocabulary and source evidence through the existing safe Markdown renderer. Completed sessions have local counts and exposure caveats, with read-only question browsing; no timed Mock score, pass/fail or certification-readiness claim.

Heading focus, native labelled groups, saving/error live regions, recovery focus, minimum targets, scoped styles, responsive stacked comparisons and the shared contained dialog/table primitives are implemented. Guided context suspends existing page/engagement telemetry and restores the real destination. Account hooks remain mounted; Guided issues no exam, PDF, answer, hint or practice-session events.

### Phase 3 files

New: `src/ui/guided/GuidedPractice.tsx`, `GuidedSessionPage.tsx`, `src/hooks/useGuidedPractice.ts`, `src/domain/guided/runtime.ts`, presentation/recovery/storage unit suites, synthetic runtime fixture and the Guided browser suite/configuration.

Additive integration: `src/App.tsx`, `src/main.tsx`, `src/domain/navigation.ts`, `src/domain/analytics.ts`, `src/styles.css`, `vercel.json`, `.env.example`, `.vercelignore`. Documentation changes are listed in the final integrity manifest. Existing Results/PDF, Mock mutation/grading/timer modules and banks are preserved. All prior browser cases/assertions remain; the enlarged-text Start case received an explicit enabled/focused prerequisite before keyboard activation, documented below.

### Phase 3 exit assessment

The interface is implemented with durable Phase 4 storage rather than a public in-memory milestone. The original Phase 3 behavior/guard criteria remain independently assessed below. Human educational walkthrough and actual native screen-reader reading/announcement review are not supplied by synthetic/browser-role checks. **Owner acceptance remains pending; no public pilot readiness is claimed.**

## Phase 4 — persistence and protection

`src/domain/guided/storage.ts` implements the Phase 1 repository port using separate IndexedDB `pcao-f-guided`, database version 1, key-path store `sessions`. Only selected frozen question/guide subsets are stored. No Guided localStorage index, Mock ownership marker, archive store, cloud job, backend endpoint or new dependency is created.

Creation/recovery validates strict sessions, q1/g1 and catalog approval outside the shared lock. Creation requires an absent ID and revision zero. Commands prepare hashes/source proofs outside the lock, acquire the existing `pcao-f:attempt-storage:v1` Web Lock, perform a fresh complete protection/source check, compare the prepared record against the transactional current record, apply the accepted pure transition and await transaction completion. No network, DB initialization or digest work runs inside the shared lock or a live transaction. Effective commands increment one revision; same commitment-ID and completed Finish retries are no-ops. Stale changes are rejected and reconciled explicitly, without merging or automatic command resubmission. A read invalidated by a concurrent write may be freshly prepared at most twice before surfacing an explicit conflict; those retries never replay a user command.

Open/read/write waits are bounded. Blocked opens and newer database/record schemas never reset storage. Quota/denial/closed/aborted/uncertain acknowledgements produce actionable states and explicit Retry; no new instructional reveal occurs on failure. Retry rereads the route session or all accessible landing records before reenabling work. Unknown/corrupt records stay intact and cannot suppress unrelated valid listings. Explicit removal deletes only the selected verified Guided key after revision/source/protection checks and confirmation.

Saved drafts, navigation, hint maxima, locked feedback and completion resume exactly. Completed-session browsing is ephemeral read-only navigation and does not rewrite completed records. Cross-tab notifications contain only `{sessionId, revision}` after a completed transaction. Notifications are advisory and always cause validated rereads; one-second visible polling, focus/pageshow and storage events provide a fallback without BroadcastChannel. Visibility/pagehide and route changes remove instruction; restoration requires a new guard. React StrictMode teardown closes the repository without breaking effect replay.

### D7–D9 protection and recovery

`browserProtection.ts` reads the union of the Mock index and all raw exact-prefix keys under the shared lock, including orphans and inaccessible owners. Full parse validation supplies deadlines. Any valid live Mock blocks; verified expired unfinished records permit standalone and never become submitted post-exam sources. A complete valid raw scan with a malformed/stale index warns without repair. Corrupt/unreadable/unsupported records, incomplete enumeration, denied storage, missing Web Locks or a five-second checking budget failure fail closed.

The recovery interface gives a generic reason, preserved-originals explanation, explicit full-scan Retry, existing access-controlled History and return actions. It never guesses expiry, exports foreign data, rewrites an index, deletes/quarantines Mock data or finalizes an exam. Damaged Mock records that need repair remain blocked pending separately authorized repair. This is the approved non-destructive recovery workflow, not a data-repair bypass. Guided IDB failures are kept distinct from Mock inventory failures.

### Ownership and source access

`access.ts` validates submitted local/trusted-original source reports and hashes outside the lock, then checks the unchanged raw source, current owner and ownership/tombstone marker afresh under it. Source/owner epochs invalidate late callbacks. Sign-out/account change unmounts private instruction immediately. Signup-claimed guest sources bind their access scope in a separate durable Guided-only revision before resume, preserving all content/responses and original report bytes.

Cleanup targets only an explicitly lost account owner or confirmed source tombstone, with a fresh recheck and Guided-only deletion under the same lock. Merely opening another guest tab does not delete another tab's private session. Failed cleanup leaves content inaccessible and reports a local cleanup issue without misreporting a server deletion failure. Standalone sessions stay browser-local and are never claimed or backed up.

There is no Phase 5 report-launch UI. Cloud-only sources without an accessible validated local original are conservatively unavailable through the current adapter. Existing cloud-download/launch integration belongs to the separately authorized Phase 5; no source is replaced with the latest bank. The source-access port keeps asynchronous preparation separate from synchronous fresh checks.

### Phase 4 files and exit assessment

New: `src/domain/guided/storage.ts`, `browserProtection.ts`, `access.ts`; controller above; `tests/guidedStorage.test.ts`, `guidedRecovery.test.ts`, persistence/protection browser cases. `browserStorage.ts` adds an optional abort signal and correct async return typing to the existing shared helper without changing lock identity or Mock behavior.

The obsolete Phase 1 “no UI/persistence exists” assertion in `guidedProtection.test.ts` was updated for the authorized phase: every Guided module still forbids Mock writers; pure Phase 1 modules still forbid browser persistence; Results still has no Phase 5 integration. No existing guest/account/analytics/recovery browser assertion, case, timeout or retry policy was weakened. The single maintained Start test now waits for the bank-dependent Start button to be enabled and verifies focus before pressing Enter. Its original file is retained with the before-manifest hash, and the final integrity audit checks that this prerequisite is the only edit. A controlled delayed-bank probe separately verifies this loading/readiness sequence.

Durability/protection implementation is complete within this standalone internal scope. Public release and owner exit acceptance remain pending. The exact verification and remaining limitations below determine readiness; implementation does not self-accept this phase.

## Verification and evidence

Evidence root: [phase-3-4](../../test-results/guided-practice/phase-3-4/). Tests run in its isolated source copy with installed dependencies, no private environment, sanitized feature/account/telemetry environment, external Node network denied, a deny-only browser proxy, fresh Chromium contexts and synthetic account HTTP boundaries. Full units use two workers; browser suites execute sequentially, with zero automatic retries. Each run has command/result metadata, logs and (for browsers) JSON/artifacts. All development failures remain separate from later passing runs.

<!-- FINAL-RESULTS -->
| Check | Observed result and evidence |
| --- | --- |
| C1 TypeScript | PASS, `typecheck-verification.log` |
| C2 all applicable units | PASS, **431/431 across 33 files**, `unit-verification.log`; no skips |
| C3 production build | PASS, `build-verification.log`; existing main/PDF chunk-size warnings remain |
| Guided Phase 3/4 browser matrix | PASS, **38/38**, `guided-verification.json`; includes independent browser SHA vectors and deterministic read/write races |
| Actual analytics SDK isolation | PASS, **2/2**, `guided-telemetry-verification.json`; synthetic intercepted HTTP only |
| C4 existing guest matrix | Latest full run **134/135**, `guest-completion-review.json`: legacy PDF export at 320 waits for a download until its unchanged 30-second test deadline. All other cases passed. |
| C5 existing account matrix | PASS **32/32**, `account-completion-review.json` |
| C6 existing analytics matrix | PASS **6/6**, `analytics-completion-review.json` |
| C7 existing recovery matrix | Review run **7/8**, `recovery-completion-review.json`: Cancel→reopen→reload did not restore the password dialog within the existing 5-second assertion; the pending-reset header action remained. One unchanged complete rerun **8/8**, `recovery-unchanged-verification.json`. Root cause/timing remains unresolved; no recovery fix is claimed. |
| C8 built preview, flag off | PASS **4/4**, `release-preview-verification.json`; direct routes, reload, preserved unsupported data, exact served bank bytes and delayed Start readiness |
| Enabled runtime, empty real catalog | PASS **4/4**, `empty-catalog-verification.json`; unavailable without draft/synthetic fallback |

The last full normal-browser matrix predates only Guided-specific changes. `normal-regression-inputs-verification.json` proves no shared/normal regression source changed afterward. The final C1/C2/C3 and Guided/SDK/preview/empty suites were rerun against that final source. Counts are individual suite runs, not cumulative unique coverage. All command metadata, browser JSON, attachments and cleanup records remain in the evidence root; [browser run ledger](../../test-results/guided-practice/phase-3-4/browser-run-ledger.json) retains the failed-case mapping.

Earlier complete normal runs are also preserved: `guest-initial` 135/135, account32/32, analytics6/6 and recovery8/8; then `guest-completion-final` 131/135 with three PDF failures (legacy320, legacy768, actual Advanced cancelled download) and one Start loading/focus setup failure, alongside account32/32, analytics6/6 and recovery8/8. The single Start prerequisite maintenance passed in the later full 134/135 run; no PDF fix or blanket clean guest acceptance is claimed. PDF implementation and report models are byte-preserved.

Final source/asset/instruction/content/private-environment/index checks are recorded in [integrity evidence](../../test-results/guided-practice/phase-3-4/final-integrity.json). Source and built bank hashes match the original approved bytes; Phase 1 contracts/empty catalog, Phase 2 content and original Results/PDF/Mock model files remain unchanged. The isolated built assets contain neither synthetic content markers nor the checked draft-content markers. Test-only runtime replacement/configuration is excluded from hosting. No root build output is substituted with the synthetic test build.

Final integrity audit: **PASS**, with no unexpected existing-file edits, no tested-source mismatch, no private-environment/index/HEAD change and no new broken documentation links. Two inherited links to the absent historical `reliability-fix-checks.txt` are identified separately; no historical evidence was fabricated. [Cleanup audit](../../test-results/guided-practice/phase-3-4/final-cleanup.json) confirms all nine test/proxy ports stopped, with 41 retained per-run cleanup records. The working tree remains uncommitted and retains its original pre-existing work.

| Applicable invariant | Result / scope |
| --- | --- |
| I1 bank/content | Source/built raw SHA-256 and approved Markdown unchanged; existing integrity units pass |
| I2 timing/grading | Existing units and normal guest cases retain deadlines, exact-set scores and threshold; no natural two-hour wait is claimed |
| I3 delayed Mock visibility | Existing guest negative reveal cases pass; Guided hidden on live Mock, including direct orphan/private records |
| I4 report compatibility | Original parser/model/PDF source and frozen report bytes preserved in unit/browser fixtures. Full Results→Guided→PDF launch integration belongs to Phase 5 and is not implemented or claimed. PDF download reliability remains blocked. |
| I5 storage separation | Dedicated database, writer-import checks and before/after Mock/archive/source byte assertions pass; no Guided cloud requests |
| I6 exact version | Unchanged Phase 1 mutation/golden checks plus browser Web Crypto vectors, frozen-session validation and stale revision cases pass |
| I7 approval | Empty production catalog, synthetic test-only catalog, rejection/revocation/policy-pending and artifact exclusion checks pass; human review remains open |
| I8 evidence | Initial failures, interrupted/not-run matrix, repaired reruns and native-AT/human gaps are separately retained |
| I9 active Mock | Full inventory/expiry/corruption/denial/lock-budget and queued hint/commit races pass; fresh source/owner/visibility checks pass |
| I10 reveal/commit | Durable hints/first commitment, failure/no-leak, selection cap, reload/finish and immutable/idempotent revision cases pass |
<!-- END-FINAL-RESULTS -->

### Preserved development failures and corrections

Initial typecheck failed on the new Markdown prop shape; a later browser-test typecheck caught an unused fault-injection argument. Initial focused units passed 57/58: a synthetic access double incorrectly denied standalone sessions after owner loss; its behavior was corrected without changing the expected invariant. The repaired focused suite passed 58/58.

Initial Guided browser execution passed 4/23 and failed 19/23: 18 stopped at the nested-label exact lookup and one at incomplete synthetic restored-session seeding. Explicit selector label/control pairs and normal synthetic UI sign-in fixed those setup paths. The next bounded development run stopped at four failures (one interrupted and 23 not run): controlled checkboxes briefly reverted during saves; Guided quota exceptions were wrongly mapped to Mock inventory failure; the new navigation test used an incorrect existing dialog title. Pending selections, error separation and the accurate unchanged product-title oracle corrected these issues. The subsequent complete run passed 28/28; the next candidate passed 31/31.

A stronger blocked-open test initially timed out (20/21 passed) because fake timers stopped fake-indexeddb's task queue. It now uses a real blocked version upgrade and fakes only timeout/Date, asserts still-pending at 4999 ms, then checks the 5000 ms failure; repaired 21/21 passed. Earlier root-rem “200%” screenshots changed spacing without doubling explicit body text and are **not accepted enlarged-text evidence**. The final probe verifies actual computed question font size doubles and reinspects reflow.

Actual 200% dialog inspection exposed clipping even though partial button-visibility assertions passed. The Guided-only narrow header now stacks Close above the heading, and the test checks full heading/Close/action bounds. Keyboard review then found lost focus after saving; a same-document BroadcastChannel was incorrectly receiving notifications from its own freshly created channel and unmounting the question. One channel per document, acknowledgement-based focus restoration and heading focus/scroll corrected it. The initial focus-ref typecheck failure and the initial one-pass/one-fail focus run are retained; the repaired targeted run passed both cases.

Real intercepted analytics SDK checks first recorded no ingestion because the synthetic browser boundary lacked its required user-agent/CORS setup. After correcting that test setup, they exposed an actual privacy defect: the next normal pageview carried a Guided title and SDK prior-page duration/scroll metadata. Guided pathname/title scrubbing and dropping the SDK's prior-page diagnostics removed that spill. Home-to-Guided-to-Home and direct-entry cases now exercise the actual SDK and intercepted payloads, not only unit doubles. No live analytics was sent.

The 37-case review run passed 34 and failed three. Two deliberate lock races first lost foreground focus to the setup tab, so the fresh-focus protection correctly withheld the control that the test needed to click. Setup now returns focus and awaits the ready control before the other tab holds the lock. The third exposed an intermittent single-radio reset during optimistic saving. The answer component now retains its pending selection until the durable model acknowledges the same IDs and keeps commands disabled through that handshake; it no longer clears pending state on a stale passive effect. These failures and their final rerun remain separate evidence. Route-intent cancellation, fresh owner checks and bounded inventory resource checks also have focused fault cases.

One earlier completion matrix was explicitly paused after the new dialog defect was observed. Subsequent suite launches returned 125 without execution; `matrix-pause-record.json` records why. Those are not passes or skipped cases inside a completed suite. No automatic retries were configured.

The subsequent `guided-handoff` run passed 36/37; all three previous failing cases passed, but the no-BroadcastChannel test exposed a prepared-read race. Another tab saved between the initial read and the under-lock comparison, causing a read-only conflict to be treated like a failed user command. The controller now bounds fresh read preparation to two further attempts while leaving write conflicts explicit. A deterministic browser case returns a valid older record for the first preparation, then checks that the actual locked commitment appears without Retry or any record mutation. The original failed run remains intact.

### Browser coverage and visual review

Synthetic flows cover complete 5/10 sessions, both five-item sets, single/two/three choices, exact counts, monotonic hints/collapse, draft clearing/navigation/reload, locked correct/incorrect feedback, explicit Finish, completed reload/browsing, guided-only confirmed removal, route Back/Forward and unchanged Mock leave confirmation. Fault/privacy coverage includes failed hints/commitments, quota/abort, denied/newer/corrupt IDB, stale revisions, no BroadcastChannel, live indexed/orphan/private Mock suspension, verified orphan expiry, malformed index warning, corrupt/denied Mock storage, missing locks, queued lock timeout/Retry, background unmount, private source deletion and sign-out.

Layout cases capture landing, answering/hints and feedback at 320/390/768/1366 and 844×390, plus the corrected text enlargement case. Browser assertions check minimum button targets, keyboard activation, page-wide overflow and dialog actions after scrolled narrow resize. Touch is Chromium emulation, not a physical device. A long synthetic table tests contained horizontal scrolling. The final 23 screenshots are retained in [the screenshot folder](../../screenshots/guided-practice/phase-3-4/) with hashes/inspection notes in [visual review](../../test-results/guided-practice/phase-3-4/visual-review.json). Actual native screen-reader output, physical-device behavior and Firefox/WebKit remain unverified; roles/focus assertions are not presented as those checks.

## Educational and release blockers

| Remaining defect / gap | Disposition |
| --- | --- |
| Existing intermittent PDF export | Separate release blocker; observed latest legacy320 timeout and earlier legacy768/Advanced cancellation. Implementation untouched; no reliability resolution inferred from other passes. |
| Intermittent recovery dialog after reload | Latest full run7/8, one unchanged rerun8/8. Keep as unresolved regression evidence/timing risk requiring diagnosis before an unconditional integrated acceptance. No unrelated recovery patch. |
| Guided behavior | No remaining reproduced defect in final38/38 or unit checks. This is bounded synthetic evidence, not universal correctness or owner acceptance. |
| Educational/native-AT/D12/D14 | Human educational review, native screen-reader output and policy/protocol decisions remain the applicable independent gates. |

Production feature remains disabled by default and `productionCatalog` remains empty. Ten Phase 2 records retain 10/10 owner approvals but 0/10 documented independent solve-first/source/hint reviews. Their content, hashes, runtime approval fields and ledgers are unchanged. Synthetic content has no educational approval claim and is injected only by the excluded test configuration; there is no development/runtime fallback to draft educational content.

D12 remains pending: affected/revoked/partial sets show explicit policy-pending/unavailable handling and are never silently shortened or substituted. D14 is still required before Phase 6. The existing intermittent PDF regression remains a **separate release blocker**, irrespective of any individual passing export in this cycle. No PDF implementation change is included. Existing account-deletion timeout and historical router-warning limitations remain outside this scope.

Actual human instructional walkthrough and native screen-reader verification remain outstanding. Local-only browser storage can be evicted/cleared; Guided has no backup. Origin events/polling can suspend only content that remains visible, not undo material already seen, and old/offline builds cannot learn future revocations. These are experience/integrity safeguards, not an anti-cheating or resource-secrecy system.

| Individual phase | Exit-readiness assessment | Owner decision |
| --- | --- | --- |
| Phase 3 interface | Internal technical implementation and synthetic flow/visual evidence ready for review. Required human educational walkthrough/native screen-reader evidence remain incomplete; unresolved normal regression risks must be considered separately. No unconditional exit/public-readiness claim. | Pending explicit review; not accepted |
| Phase 4 persistence/protection | Internal durability/isolation/recovery implementation and bounded fault/race evidence ready for review. Separate source-cloud/Results launch work remains Phase5, and public gates/normal regression risks remain open. No unconditional exit/public-readiness claim. | Pending explicit review; not accepted |

Neither educational acceptance nor public-release readiness is inferred. Stop after implementation, tests and documentation; no Phase 5, publication, hosted mutation, deployment, commit or push.

## Phase 5 pre-implementation approval reconciliation

The content ledger and final approval matrix record the owner’s direct statement “i approve the ten questions”, dated 17 October 2026, with ten final owner approvals bound to each unchanged draft SHA-256/prospective g1. They also record zero completed independent human solve-first/source/hint reviews. These are separate roles and gates: owner approval is 10/10; independent review is 0/10; Phase 2 educational acceptance and publication remain pending. Actual runtime approvedG1 fields stay null and entries stay draft. References above to “educational approval pending” refer to that incomplete gate, not to an absence of the recorded owner decision. No approval fields or content were changed during this reconciliation. The current Phase 5 amendment permits synthetic technical work only.
