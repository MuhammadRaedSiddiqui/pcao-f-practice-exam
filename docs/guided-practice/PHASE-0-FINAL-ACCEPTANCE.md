# Guided Practice — Phase 0 final acceptance

16 October 2026, Asia/Karachi (UTC+05:00). **Documentation closure only.**

**ACCEPTED — Phase 0 exit.** Owner acceptance conditions are satisfied; no material documentation contradiction or closure blocker remains.

The owner's [final-acceptance instruction](../../test-results/guided-practice/phase-0-final-acceptance/owner-acceptance-request.txt) explicitly accepts the audit, maintained baseline and residual risks subject to consistency/integrity checks, and approves D1–D11. Request SHA-256: `1c518d2882d07e2e2cc46681b586949335e580d2b335b74a9fa061887a3140e0`. This is actual owner authorization; it is not an approval inferred from test results. **Phase 1 is not authorized.** No Guided implementation, guide records, Mock behavior change, deployment, commit or push occurred.

## 1. Accepted baseline and execution conditions

Accept the [Phase 0 audit](PHASE-0-BASELINE.md) and [Phase 0-B maintenance](PHASE-0-B-TEST-MAINTENANCE.md) under their recorded isolated execution policy. The following are previously executed results now accepted by the owner, **not fresh closure-task passes**:

| Check | Accepted result / evidence |
| --- | --- |
| Typecheck | PASS; [final log](../../test-results/guided-practice/phase-0-b/typecheck-final.log), [command/result](../../test-results/guided-practice/phase-0-b/typecheck-final-result.json) |
| Production build | PASS in safe guest/no-telemetry environment; [final log](../../test-results/guided-practice/phase-0-b/build-final.log), [result](../../test-results/guided-practice/phase-0-b/build-final-result.json); existing chunk-size warning retained |
| Full units | 214/214, 23/23 files, `npm test -- --maxWorkers=2`; [final log](../../test-results/guided-practice/phase-0-b/unit-final.log), [result](../../test-results/guided-practice/phase-0-b/unit-final-result.json) |
| Guest browser | 135/135, zero skips/retries; [JSON](../../test-results/guided-practice/phase-0-b/guest-serial.json), run started 2026-10-16T17:39:29.079Z |
| Account browser | 32/32, zero skips/retries; [JSON](../../test-results/guided-practice/phase-0-b/account-final.json), run started 2026-10-16T17:24:37.184Z |
| Analytics browser | 6/6, zero skips/retries; [JSON](../../test-results/guided-practice/phase-0-b/analytics-final.json), run started 2026-10-16T17:27:10.018Z |
| Recovery browser | 8/8, zero skips/retries; [JSON](../../test-results/guided-practice/phase-0-b/recovery-final.json), run started 2026-10-16T17:29:31.684Z |

All **179 original browser cases** remain, with **two additional cases**, 181 total: [case-retention evidence](../../test-results/guided-practice/phase-0-b/case-retention.json). Acceptance is source-specific and conditional on the recorded method: existing dependencies; isolated working-tree copy; synthetic nonpersistent browser contexts; no private environment copied; guest/build account/telemetry flags disabled; intercepted synthetic Supabase/PostHog; external Node/browser networking denied; explicitly owned local servers. Use two-worker full units and sequential browser-suite scheduling on this host, retaining the guest suite's two internal workers and original test deadlines. Analytics ingestion uses the documented condition-based 10-second bound without production SDK changes. Service cleanup evidence records no remaining owned listeners.

Original Phase 0 browser failures (92/135, 5/31, 2/6, 4/7), Phase 0-B initial guest 127/135, contended guest 132/135 and initial unit 207 passed/seven unrun after PGlite setup timeout remain failed/partial runs in the original reports and machine ledgers. The later passing runs do not rewrite them. No further typecheck, unit, build, browser, production, live-account/email/analytics or educational check ran during closure.

## 2. Approved architecture — D1–D11

The following approved requirements are reconciled in the [architecture](GUIDED-PRACTICE-ARCHITECTURE.md). They approve design contracts, not implemented capabilities or editorial content:

| Decision | Approved contract |
| --- | --- |
| D1 | Separate Guided IndexedDB; no Mock storage-format/index changes. |
| D2 | Versioned deterministic q1 bound to validated source identity, question, options, keys, explanations and sources. |
| D3 | Additive Guided routes within the existing mounted Router/App. |
| D4 | Immutable reviewed overlays with independent editorial approval and controlled publication. |
| D5 | Minimal q1 + approved-entry g1/catalog mechanism; optional release digest is only a transport/artifact check. No signing service, generic registry or redundant authority framework. |
| D6 | Initialize/open DB, fetch and hash outside the shared lock; fresh access/protection check plus short revision-checked transaction inside it. |
| D7 | Read the union of indexed IDs and exact raw attempt keys, including orphans; never repair/rewrite the Mock index. |
| D8 | Fully validated expired unfinished records do not block standalone after their verified deadline; post-exam requires a submitted report. Any valid live Mock blocks. Guided never finalizes/mutates Mock. |
| D9 | Typed protection states distinguish malformed index with complete valid raw inventory from corrupt/unreadable records. Fail closed on unknown records/storage failures; explicit Retry/recovery, no deadline guesses, deletion or foreign-owner disclosure. Phase 1 defines non-destructive recovery requirements; safe user-controlled workflow is required before public release. |
| D10 | Preserve source ownership; private derived content becomes inaccessible on authorization loss. No Guided cloud backup, signup migration or new account API. |
| D11 | Preserve existing analytics; suspend Guided attribution and exclude Guided answers/hints/educational content from telemetry. |


In particular, D7–D9 distinguish **inventory confidence**, **live time** and **source eligibility**. A complete raw-key/index union must validate every present attempt. A malformed index alone is a warning after successful complete raw validation; corruption, unreadable records, incomplete enumeration or storage failure fail closed with typed Retry/recovery. A fully validated expired unfinished attempt no longer blocks standalone after its verified deadline, but cannot become a submitted post-exam source. Another valid live attempt still blocks, including a private owner's or orphaned record. No deadline guessing, index repair, finalization, destructive bypass or foreign-owner disclosure is authorized.

The current protection contract is checking/clear/blocked/recovery-required/unsupported with typed reasons. Checking is bounded. Phase 1 must define the finite budget and non-destructive recovery requirements; Phase 4 implements/verifies the safe user-controlled workflow and Phase 6 requires it before public release. If a proposed recovery action would modify Mock data, obtain separate explicit authorization for that action. Source authorization loss immediately makes private derived content inaccessible even if local cleanup later fails.

## 3. Residual risks and dispositions

| Risk | Accepted disposition / next obligation |
| --- | --- |
| PGlite contention | Accept the established two-worker full-unit policy; retain original setup timeout and unchanged passing reruns. No database defect-resolution claim. |
| Concurrent PDF cancellation/timeouts | Accept the documented sequential-suite baseline; unchanged guest run on its own passes 135/135. Cancellation root cause under concurrent load remains uncertain; investigate recurrence under the applicable authorized scope. No blanket concurrency/stress guarantee. |
| Callback router POP warning | Remains recorded despite passing recovery flows. No claim of production-wide navigation correctness or a fixed application defect; review when a concrete dependency/failure emerges or later route/recovery work is authorized. |
| Account-deletion timeout | Remains outside Guided scope unless a concrete dependency emerges. No generic requirement to repair unrelated account behavior before Phase 1. Source fixes require separate authorization. |
| Storage protection/recovery | D7–D9 policy approved, implementation unverified. Required Phase 1 contracts and Phase 4/6 recovery/privacy tests remain future work; public release cannot omit the safe user-controlled workflow. |
| D12 revoked/partially unavailable practice sets | Pending owner behavior decision before pilot publication. No shorter-set, incomplete-tail or affected-release policy is selected now; any cardinality change requires contract/test reconciliation. |
| D13 educational source/review capacity | Actual source access plus named author, independent reviewer and editorial approver required before accepting Phase 2 content. No persons or source approvals assigned/invented here. |
| D14 learner protocol | A practical owner-approved observation protocol is required before Phase 6. The earlier small-sample 2/3×4/5 proposal is neither approved nor established evidence of learning effectiveness. No learners, observations or outcomes fabricated. |

Other previously recorded limits remain: no hosted/live service verification, natural two-hour expiry, other browser engines, physical-device/true 200% zoom or formal screen-reader acceptance is newly established. Future privacy, recovery, source/editorial and educational gates remain binding. Baseline-risk acceptance is not permission to waive a newly demonstrated critical/high defect in a candidate release.

## 4. Documentation changes and precedence

Only these five existing documents are revised, plus this new report:

* [Master plan](GUIDED-PRACTICE-MASTER-PLAN.md): approved baseline/design status, I9 expiry/inventory semantics, Phase 1 contracts and fixtures, recovery/release requirements, unapproved pilot threshold and separate Phase 1 gate.
* [Architecture](GUIDED-PRACTICE-ARCHITECTURE.md): D1–D11 decision record, mandatory q1/g1 with optional r1 transport check, DB preparation outside the lock, raw/index inventory, typed recovery and standalone/post-exam distinction; D12–D14 stay pending.
* [Verification matrix](GUIDED-PRACTICE-VERIFICATION-MATRIX.md): accepted existing results/conditions, negative fixtures and expected outcomes for malformed index versus corruption/expiry, no Mock writes, recovery/privacy release checks and actual future editorial/learner evidence.
* [Risk register](GUIDED-PRACTICE-RISK-REGISTER.md): baseline residual-risk dispositions, D7–D9 mitigation design and future D12–D14 gates; no application defect silently closed.
* [Execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md): accepted owner decisions and closure evidence; Phase 0 gate accepted only after verification; every Phase 1–8 activity remains unchecked.

Current approved D1–D11 text in these reconciled documents and this final-acceptance record supersedes conflicting **pre-approval proposals** in the original guideline/audits. The two historical baseline reports, raw failed/passing evidence and original guideline remain byte-identical; their then-pending approvals and older alternatives are dated evidence, not competing current contracts. D12–D14 are not silently resolved by precedence.

## 5. Closure verification performed

PASS: 233 local links across 8 Guided planning/audit/closure documents resolve; no protected-source/test/bank/config change, no baseline-evidence difference, no changed Git index/private environment and zero completed Phase 1–8 checkboxes.

Before edits, [capture metadata](../../test-results/guided-practice/phase-0-final-acceptance/capture.json) records HEAD `8820340ea82920e6e512d0938b6f754c8f4e7916`, 2026-10-16T17:57:19.647Z, Node v24.18.0, a **375-file** [working-tree manifest](../../test-results/guided-practice/phase-0-final-acceptance/working-tree-before.json), Git status/index, hash-only private-environment inventory and **2022 baseline-evidence files**. The full recursive evidence inventory excludes only the two node_modules dependency junctions; it includes original snapshots, logs, JSON, screenshots, PDFs and test artifacts. No evidence was regenerated or modified.

Verification commands are document/integrity checks, not application tests:

1. `node test-results/guided-practice/phase-0-final-acceptance/closure-audit.mjs capture`: source/evidence SHA-256, Git status/index/HEAD and private-environment hashes before edits.
2. Read the owner request, seven requested audit/planning documents and applicable AGENTS/current specifications; inspect all active-Mock, expiry, lock/digest, publication, recovery/privacy, baseline and pilot-gate references. Exact original planning-document copies and edit records are retained in the closure evidence directory.
3. Reconcile documents, inspect policy conflicts, validate existing baseline JSON/result/log counts and original-case retention without executing those suites. Future command examples remain unexecuted.
4. `node test-results/guided-practice/phase-0-final-acceptance/closure-audit.mjs verify`: resolve all local Markdown file cross-links across the Guided bundle; compare every pre-existing file and all captured baseline evidence; confirm unchanged index/private environment/HEAD and zero completed future-phase checkboxes. Recheck after recording the accepted gate.

Detailed [verification record](../../test-results/guided-practice/phase-0-final-acceptance/verification.json) and before/after manifests provide exact counts, bank hashes and change scope. Final checks include a manual cross-document D1–D14 review; static checks do not prove future Guided implementation behavior.

No application source, existing tests (including maintained Phase 0-B tests), question banks, approved Markdown reference, production configuration, saved learner data or external service was changed. Pre-existing dirty/untracked work remains preserved. No new application test result or human editorial approval is claimed.

## 6. Phase 1 prerequisites and remaining blockers

The baseline and D1–D11 approval prerequisites are satisfied after successful closure checks. **The remaining entry blocker is a separate explicit owner authorization to begin Phase 1 foundation work.** This closure instruction does not provide it.

When separately authorized, Phase 1 must follow the reconciled master plan: synthetic fixtures only, strict source/session/overlay contracts, independent q1/g1 vectors, pure commitment/selector behavior, typed D7–D9 protection and non-destructive recovery requirements, no Mock writer imports and no production guidance/UI exposure. Define the finite checking budget and safe recovery contract rather than inventing a destructive repair. Future implementation and applicable verification must be current-source and separately scoped.

D12, D13 and D14 remain later decision gates at their stated deadlines. Safe user-controlled recovery, ownership loss/cleanup and educational/source validation remain public-release dependencies. They are not fabricated completed work or hidden Phase 0 failures; the owner expressly placed them in later phases.

## 7. Final exit and stop

**ACCEPTED — Phase 0 exit.** Owner acceptance conditions are satisfied; no material documentation contradiction or closure blocker remains.

The checklist records the accepted Phase 0 exit and D1–D11 owner approval, with all Phase 1–8 work unchecked. Stop after this documentation closure. **Phase 1 requires a separate explicit instruction; no implementation, guided-content authoring, application test execution, deployment, commit or push is authorized by acceptance.**
