# Guided Practice — Phase 5 implementation report

**Subsequent owner decision — 17 October 2026:** Phase5 technical implementation is accepted for continued internal development, with existing PDF/recovery, educational, accessibility and public-release limits retained. Only bounded Phase6 readiness/diagnosis is authorized; see [readiness handoff](PHASE-6-READINESS-AND-RISKS.md). Full Phase6 acceptance/publication/deployment remain pending. The original implementation report and results below are historical evidence and remain unchanged.

17 October 2026, Asia/Karachi. Internal synthetic implementation; **Phase 5 owner acceptance pending**. The owner conditionally accepts Phase 3/4 technical evidence for continued internal development and explicitly amends Phase 5's content-entry prerequisite for synthetic approved fixtures only. Educational, accessibility, reliability and Phase 6/publication gates remain in force. No Phase 6, deployment, hosted mutation, commit or push is authorized or performed.

## Implemented functionality

Completed Mock Results has an optional Guided Review action behind the existing disabled-by-default flag. The existing Results controls, filters, Attempt input and PDF implementation retain their behavior. The separate dialog defaults to Incorrect & Unanswered and offers Flagged and All Questions; it reports eligible, matched and unavailable counts and reason partitions. Blank and nonblank partial answers belong to the default union; flags are independent of correctness. Snapshot order is retained, including all eligible questions up to the accepted 60-item bound. Empty/all-correct, zero-eligible, partial, unsupported and conflicting-source cases preserve ordinary review and export.

Starting revalidates the frozen submitted report, exact source identity, q1 and catalog-approved g1. A new durable Guided session starts with empty choices, zero hints and no commitments. Original selections, flags, score and timestamps are never copied into retry responses. Exposure notice appears in the dialog, active retry and summary. Completed sessions stay read-only. Return to original results reopens only the hash-matching, still-authorized source, including a source obtained through existing account APIs after reload. Route/owner checks discard obsolete returns. No report payload or account identifier is placed in a URL/history state.

Guided UI is loaded with the application shell so its first offline opening does not depend on fetching a new UI chunk. This adds no offline installer: a full offline shell reload remains outside the existing app contract. Compatible published guidance still needs its release resource; cached frozen approved sessions can resume subject to source access. Actual offline trusted-copy testing uses an already-loaded shell and re-establishes the shell online before reload.

Analytics attribution is suspended during the Guided Review dialog and session, and resumes at the actual destination. The transition retains suspension until routing completes, avoiding a spurious intermediate Results pageview. No Guided telemetry events were added.

## Source access and eligibility decisions

- Present local originals are authoritative. Parse, submitted status and original reportHash are checked outside the lock; raw source bytes, owner marker and current owner are checked afresh inside the shared Mock/protection lock. A changed/damaged/private present original cannot be bypassed by a cloud download.
- Missing local sources are eligible only for private account-origin sessions owned by the current account. The adapter uses existing authenticated receipt/download validation online and existing owner-isolated trusted-copy metadata/payload validation offline. It makes no report/cache/queue/ownership writes. All source reads are prepared outside the shared lock.
- New source lookups have a 15-second bound with request abort. Missing, stalled or unverifiable sources fail closed with Retry and leave ordinary Results usable. Existing account callers retain their request behavior; optional AbortSignal parameters are additive.
- Owner epochs fence late downloads; the short synchronous proof rechecks the owner and deletion/ownership marker. Every read/create/command uses fresh approved-session and active-Mock checks. Live/orphan/private Mock, corrupt inventory and recovery behavior retain D7–D9; Guided never finalizes or repairs Mock.
- A verified cloud tombstone authorizes cleanup only of derived Guided records matching that exact source and account owner, with a fresh recheck under the existing lock. Sign-out/local tombstones retain existing derived-only cleanup. Missing data/network failures alone do not prove deletion. Failed local cleanup is reported separately; inaccessible content remains hidden.
- Known legacy snapshots may omit difficulty/revision/result under the existing parser. Conflicting explicit difficulty, unsupported source/version and q1 mismatches are unavailable. Historical release resolution uses the submitted snapshot and exact source catalog entry; it never fetches/substitutes newest bank questions. Partial matching validates the approved release, then each eligible frozen pair; standalone whole-release rules remain unchanged.

## Phase 2 approval reconciliation

The inspected content ledger and final approval matrix record the owner's direct “i approve the ten questions” decision on 17 October 2026, bound to all ten final draft SHA-256/prospective g1 values. **Final owner approval: 10/10. Documented independent human solve-first/source/hint reviews: 0/10. AI source checks: 12/12. Phase 2 educational exit: pending.** These are separate gates. No human review or approval was inferred from AI checks or technical tests. Runtime approval fields stay null/draft; production catalog remains empty. No content, q1/g1/draft hashes or approval fields changed.

The Phase 3/4 report and current planning notes now explicitly distinguish owner approval from incomplete educational review and record this limited technical-continuation authorization. Phase 2's matrix and handoff have scope-reconciliation notes; their original handoff evidence remains historical.

## Verification

Evidence root: [phase-5](../../test-results/guided-practice/phase-5/). One comprehensive final verification cycle completed on the frozen candidate; no application/test/configuration edits followed its source manifest. Results below describe each individual run. Execution uses the accepted isolated working-tree copy, installed dependencies, no private environment, sanitized account/telemetry/build flags, denied external Node/browser networking, synthetic intercepted account/SDK HTTP, fresh browser contexts, owned servers, two unit workers and sequential browser suites with zero automatic retries. Original failures and unchanged reruns are separate artifacts.

Focused development evidence: initial unit run 117/118 failed because the new test incorrectly tried to render an unfinished Attempt in the submitted-only Results component. The original component correctly rejected it; the assertion now verifies that rejection. Repaired focused run 118/118; final focused candidate 119/119 after adding owner-specific tombstone cleanup coverage. An intermediate typecheck caught an unused new test import; it was removed.

Initial post-exam browser run 16/21: active retry lacked the exposure notice (fixed); the newest-bank test tried to mutate an intentionally frozen fixture (now clones it); new account tests looked for Settings-only controls on Home/History; and the recovery setup reloaded into the correctly restored modal before clicking behind it. These setup paths were corrected without weakening product assertions. The second run 21/23 exposed a first-use offline lazy-chunk failure (fixed by loading UI with the shell) and same-document hash callback setup (now initializes the callback on the first navigation). Targeted offline/recovery repair 2/2 and source-bound/tombstone/trusted-copy checks 3/3 pass.

The new actual-SDK test first exposed an extra Results transition pageview (fixed by retaining suspension through navigation). A subsequent artificial clock advance outran real asynchronous protection and correctly triggered checking-timeout; the new test now exercises cohort and route boundaries with real timers. Existing SDK engagement-clock tests remain unchanged. Repaired targeted SDK 1/1 passes. No existing guest/account/analytics/recovery assertion, test, timeout, retry policy or PDF implementation was weakened or removed.


| Final candidate check | Result | Evidence |
| --- | --- | --- |
| C1 TypeScript | PASS | [log](../../test-results/guided-practice/phase-5/typecheck-final.log) |
| C2 full unit suite | PASS — 441/441 in 34 files | [log](../../test-results/guided-practice/phase-5/unit-final.log) |
| C3 production build | PASS | [log](../../test-results/guided-practice/phase-5/build-final.log) |
| Phase 5 browser | PASS — 24/24 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/post-exam-final.log) · [JSON](../../test-results/guided-practice/phase-5/post-exam-final.json) |
| Existing Guided browser | PASS — 38/38 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/guided-existing-final.log) · [JSON](../../test-results/guided-practice/phase-5/guided-existing-final.json) |
| C4 complete guest | PASS — 135/135 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/guest-final.log) · [JSON](../../test-results/guided-practice/phase-5/guest-final.json) |
| C5 account | PASS — 32/32 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/account-final.log) · [JSON](../../test-results/guided-practice/phase-5/account-final.json) |
| C6 analytics | PASS — 6/6 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/analytics-final.log) · [JSON](../../test-results/guided-practice/phase-5/analytics-final.json) |
| C7 recovery | PASS — 8/8 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/recovery-final.log) · [JSON](../../test-results/guided-practice/phase-5/recovery-final.json) |
| Actual intercepted SDK isolation | PASS — 3/3 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/guided-sdk-final.log) · [JSON](../../test-results/guided-practice/phase-5/guided-sdk-final.json) |
| Disabled production preview | PASS — 4/4 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/disabled-preview-final.log) · [JSON](../../test-results/guided-practice/phase-5/disabled-preview-final.json) |
| Enabled runtime / empty catalog | PASS — 4/4 (0 failed, 0 skipped, 0 flaky) | [log](../../test-results/guided-practice/phase-5/empty-catalog-final.log) · [JSON](../../test-results/guided-practice/phase-5/empty-catalog-final.json) |

All final browser runs use zero automatic retries; initial development failures remain in their own logs/JSON and the [browser run ledger](../../test-results/guided-practice/phase-5/browser-run-ledger.json). The [single-cycle ledger](../../test-results/guided-practice/phase-5/final-cycle-results.json) and [candidate manifest](../../test-results/guided-practice/phase-5/final-candidate-manifest.json) identify exact execution order and source. Build retains chunk-size and mixed static/dynamic import warnings (main about703kB, PDF about1834kB); no warning threshold was changed. No PDF or recovery fix is claimed.

The current 135/135 guest pass does not close the previously observed intermittent PDF320 failure. Current recovery results do not erase the prior 7/8 then unchanged8/8 failure evidence. The new Phase5 recovery navigation case passes, with no new product reproduction in that path after correcting callback/modal test setup. Unconditional clean-regression/release acceptance remains conditional on those reliability obligations.

## Original Mock and PDF integrity

The integrated synthetic flow captures raw source bytes, existing reportHash, every Mock/index/owner key, full report-export model (including score/answers/flags/timestamps and all 60 question records), and actual generated PDF text before launch. It completes a guided retry, reloads it, returns to the original Results and compares every field and extracted PDF page text/filename. Both initial development runs and the final 24/24 Phase5 run passed this full before/after case. The original 17/1000 score, four flags, raw bytes, hash, full report model and all 61 extracted PDF pages remain identical; see [original-report integrity](../../test-results/guided-practice/phase-5/original-report-integrity.json). PDF binary metadata is deliberately not the content oracle.

Cloud/trusted fixtures separately assert identical source cloud rows, zero report backup/deletion calls and no new Mock original keys across launch/reload/return. Owner loss, local deletion, remote tombstone, stale raw source and other active Mock are tested independently. Normal Results/PDF/legacy/account regression results remain separate from these synthetic integrity checks.

Historical reliability evidence remains unchanged: [prior guest PDF failure](../../test-results/guided-practice/phase-3-4/guest-completion-review.json), [prior recovery7/8](../../test-results/guided-practice/phase-3-4/recovery-completion-review.json) and [unchanged recovery8/8 rerun](../../test-results/guided-practice/phase-3-4/recovery-unchanged-verification.json). These are separate historical runs, not part of the current passing cycle.

## Phase 3/4 outstanding acceptance requirements

Conditional technical acceptance permits this Phase 5 cycle only. Independent educational review, human learning walkthrough, actual native screen-reader announcement/reading-order review and unconditional reliability acceptance remain open. Automated native roles, keyboard and viewport checks are not native screen-reader evidence. D12 revoked/partially available standalone practice-set policy remains an owner publication decision. The existing intermittent legacy PDF-export failures and prior recovery reload timing evidence remain separate release blockers/risks; no PDF fix or historical failure erasure is claimed.

## Phase 5 acceptance checklist

| Requirement | Assessment |
| --- | --- |
| Optional submitted Results launch, independent cohorts/default/counts/empty and unsupported states | PASS; final 24/24 browser and focused/domain coverage |
| Exact frozen source/q1/approved g1, no latest-bank substitution, empty new retries | PASS |
| Current local, owner-bound local, downloaded and trusted historical access; owner/deletion/stale/live-Mock protection | PASS in synthetic fixtures; no live-service guarantee |
| Original bytes/hash/score/answers/flags/timestamps and complete PDF report content unchanged through completion/return | PASS; full model and all 61 PDF pages equal |
| Durable commands, existing 38 Guided scenarios and derived-only cleanup | PASS |
| Required full current-source verification cycle | Executed once; per-suite results above |
| Production disabled/catalog empty; no synthetic/draft asset leakage; protected data/source and pre-existing work | PASS; final integrity record |
| Six responsive layouts, computed 200% text, keyboard exit/focus and inspected states | PASS; native screen-reader/human review remains pending |
| Educational acceptance and Phase3/4 final release requirements | PENDING; no prerequisite waiver beyond synthetic technical work |
| Phase5 owner acceptance / Phase6 entry | PENDING owner review; Phase6 not authorized |

## Remaining Phase 6 and public-release blockers

Phase 5 owner review/acceptance and separate explicit Phase 6 authorization; independent human educational sign-offs for all ten exact drafts; D12 policy; D14 practical learner-observation protocol and actual consented observations; native screen-reader/human accessibility walkthrough; PDF reliability disposition and retained recovery evidence; full release readiness for an exact approved artifact. The production feature remains disabled by default with an empty catalog and no public guides. No synthetic/draft content is published. Any later publication/deployment needs separate authorization.

## All changed files

Compared with the pre-task working-tree manifest, the following existing files changed or new files were added. The pre-existing dirty tree is preserved; this list describes only Phase5 changes. Ignored execution logs, isolated workspace outputs, manifests, extracted PDF evidence and harnesses live under the evidence root.

- [AGENTS.md](../../AGENTS.md)
- [IMPLEMENTATION_SPEC.md](../../IMPLEMENTATION_SPEC.md)
- [PROJECT_IMPLEMENTATION_STATUS.md](../../PROJECT_IMPLEMENTATION_STATUS.md)
- [README.md](../../README.md)
- [docs/guided-practice/GUIDED-PRACTICE-ARCHITECTURE.md](../../docs/guided-practice/GUIDED-PRACTICE-ARCHITECTURE.md)
- [docs/guided-practice/GUIDED-PRACTICE-EXECUTION-CHECKLIST.md](../../docs/guided-practice/GUIDED-PRACTICE-EXECUTION-CHECKLIST.md)
- [docs/guided-practice/GUIDED-PRACTICE-MASTER-PLAN.md](../../docs/guided-practice/GUIDED-PRACTICE-MASTER-PLAN.md)
- [docs/guided-practice/GUIDED-PRACTICE-RISK-REGISTER.md](../../docs/guided-practice/GUIDED-PRACTICE-RISK-REGISTER.md)
- [docs/guided-practice/GUIDED-PRACTICE-VERIFICATION-MATRIX.md](../../docs/guided-practice/GUIDED-PRACTICE-VERIFICATION-MATRIX.md)
- [docs/guided-practice/PHASE-2-FINAL-HANDOFF.md](../../docs/guided-practice/PHASE-2-FINAL-HANDOFF.md)
- [docs/guided-practice/PHASE-3-4-IMPLEMENTATION-REPORT.md](../../docs/guided-practice/PHASE-3-4-IMPLEMENTATION-REPORT.md)
- [docs/guided-practice/PHASE-5-IMPLEMENTATION-REPORT.md](../../docs/guided-practice/PHASE-5-IMPLEMENTATION-REPORT.md)
- [docs/guided-practice/content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md](../../docs/guided-practice/content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md)
- [screenshots/guided-practice/phase-5/availability-correct.png](../../screenshots/guided-practice/phase-5/availability-correct.png)
- [screenshots/guided-practice/phase-5/availability-legacy.png](../../screenshots/guided-practice/phase-5/availability-legacy.png)
- [screenshots/guided-practice/phase-5/availability-stale.png](../../screenshots/guided-practice/phase-5/availability-stale.png)
- [screenshots/guided-practice/phase-5/availability-unsupported.png](../../screenshots/guided-practice/phase-5/availability-unsupported.png)
- [screenshots/guided-practice/phase-5/availability-zero.png](../../screenshots/guided-practice/phase-5/availability-zero.png)
- [screenshots/guided-practice/phase-5/post-exam-1366.png](../../screenshots/guided-practice/phase-5/post-exam-1366.png)
- [screenshots/guided-practice/phase-5/post-exam-200-text.png](../../screenshots/guided-practice/phase-5/post-exam-200-text.png)
- [screenshots/guided-practice/phase-5/post-exam-320.png](../../screenshots/guided-practice/phase-5/post-exam-320.png)
- [screenshots/guided-practice/phase-5/post-exam-390.png](../../screenshots/guided-practice/phase-5/post-exam-390.png)
- [screenshots/guided-practice/phase-5/post-exam-768.png](../../screenshots/guided-practice/phase-5/post-exam-768.png)
- [screenshots/guided-practice/phase-5/post-exam-landscape.png](../../screenshots/guided-practice/phase-5/post-exam-landscape.png)
- [screenshots/guided-practice/phase-5/protected-active-mock.png](../../screenshots/guided-practice/phase-5/protected-active-mock.png)
- [screenshots/guided-practice/phase-5/protected-changed.png](../../screenshots/guided-practice/phase-5/protected-changed.png)
- [screenshots/guided-practice/phase-5/protected-deleted.png](../../screenshots/guided-practice/phase-5/protected-deleted.png)
- [screenshots/guided-practice/phase-5/protected-private.png](../../screenshots/guided-practice/phase-5/protected-private.png)
- [src/App.tsx](../../src/App.tsx)
- [src/domain/guided/access.ts](../../src/domain/guided/access.ts)
- [src/domain/guided/loader.ts](../../src/domain/guided/loader.ts)
- [src/domain/guided/runtime.ts](../../src/domain/guided/runtime.ts)
- [src/domain/guided/storage.ts](../../src/domain/guided/storage.ts)
- [src/hooks/useAccountHistory.ts](../../src/hooks/useAccountHistory.ts)
- [src/hooks/useGuidedPractice.ts](../../src/hooks/useGuidedPractice.ts)
- [src/services/accountRepository.ts](../../src/services/accountRepository.ts)
- [src/styles.css](../../src/styles.css)
- [src/ui/ResultsPage.tsx](../../src/ui/ResultsPage.tsx)
- [src/ui/guided/GuidedPractice.tsx](../../src/ui/guided/GuidedPractice.tsx)
- [src/ui/guided/GuidedSessionPage.tsx](../../src/ui/guided/GuidedSessionPage.tsx)
- [src/ui/guided/PostExamGuidedDialog.tsx](../../src/ui/guided/PostExamGuidedDialog.tsx)
- [tests/fixtures/guidedRuntime.ts](../../tests/fixtures/guidedRuntime.ts)
- [tests/fixtures/postExamReport.ts](../../tests/fixtures/postExamReport.ts)
- [tests/guided-analytics-browser/post-exam-analytics.spec.ts](../../tests/guided-analytics-browser/post-exam-analytics.spec.ts)
- [tests/guided-browser/guided-post-exam.spec.ts](../../tests/guided-browser/guided-post-exam.spec.ts)
- [tests/guidedPostExam.test.tsx](../../tests/guidedPostExam.test.tsx)
- [tests/guidedProtection.test.ts](../../tests/guidedProtection.test.ts)
- [vite.guided-test.config.ts](../../vite.guided-test.config.ts)

## Inspected visual evidence

[320px](../../screenshots/guided-practice/phase-5/post-exam-320.png), [390px](../../screenshots/guided-practice/phase-5/post-exam-390.png), [768px](../../screenshots/guided-practice/phase-5/post-exam-768.png), [1366px](../../screenshots/guided-practice/phase-5/post-exam-1366.png), [landscape](../../screenshots/guided-practice/phase-5/post-exam-landscape.png) and [actual 200% text](../../screenshots/guided-practice/phase-5/post-exam-200-text.png) were visually inspected. Body scrolling is contained; heading, Close and actions remain reachable. Automated checks assert viewport bounds, no page overflow, Escape/opener focus and computed doubled paragraph text. Empty eligible, partial, unsupported, stale and private states are retained in the same directory; [inspection record](../../test-results/guided-practice/phase-5/visual-review.json) separates AI visual inspection from pending native screen-reader/human review. No physical-device or native screen-reader acceptance is claimed.

## Final preservation and handoff

[Final integrity](../../test-results/guided-practice/phase-5/final-integrity.json) compares the original 451-file working-tree manifest, tested candidate, protected source/content/configuration, raw built/source banks, approval ledgers, production assets, Git index/HEAD and hash-only private-environment inventory. No unexpected pre-existing file edits or tested-source differences are allowed. Existing normal browser suites and their deadlines/assertions remain byte-identical. Only Guided storage writes and read-only existing account access were added; no schema/backend/service changes. [Cleanup](../../test-results/guided-practice/phase-5/final-cleanup.json) records stopped test/proxy ports; every run also retains its own owned-PID lifecycle/cleanup. The final handoff stops at Phase5 implementation, verification and documentation. Phase5 is not self-accepted.
