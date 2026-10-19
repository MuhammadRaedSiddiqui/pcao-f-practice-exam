# Guided Practice — queued navigation command resolution

18 October 2026, Asia/Karachi. **Narrow correction and verification; owner review and full Phase 6 acceptance remain pending.**

## Authority and preserved baseline

The owner accepts D12 and PDF readiness as technically complete for continued development, subject to existing release gates. The owner explicitly rejects a clean Guided baseline for the [targeted handoff](PHASE-6-TARGETED-REMEDIATION.md)'s **37/38** result and authorizes diagnosis plus an evidence-supported correction of queued navigation persistence. That failure remains genuine historical evidence; four later passes never closed it.

Read the [Phase 3/4 report](PHASE-3-4-IMPLEMENTATION-REPORT.md), [Phase 5 report](PHASE-5-IMPLEMENTATION-REPORT.md), [targeted Phase 6 report](PHASE-6-TARGETED-REMEDIATION.md), [architecture/protection contracts](GUIDED-PRACTICE-ARCHITECTURE.md), current specification/status and repository instructions. A fresh **479-file** snapshot, Git status/index/HEAD and hash-only private-environment inventory are retained in [phase-6-queued evidence](../../test-results/guided-practice/phase-6-queued/). The dirty starting tree is preserved. Tests use its isolated source copy, installed dependencies and synthetic services, without private environment files or external networking.

The original test file `tests/guided-browser/guided-protection.spec.ts`, including its complete-record assertion and deadlines, is unchanged. It ran **first**, before runtime edits or added regression execution, and passed 1/1 (`original-first`). This does not contradict the recorded failure or establish safety by itself.

## Established lifecycle and root cause

### Actual command path before correction

1. `GuidedAnswering` invokes the controller's Reveal Hint or Check answer handler. The controller captures the saved session/revision, marks the operation busy, increments/captures its intent epoch, then calls `repository.execute`.
2. The repository captures the same intent, reads the record and validates its schema, frozen q1/g1/catalog approval and source proof **outside** the shared lock. It checks that captured intent is still active, then requests the existing `pcao-f:attempt-storage:v1` Web Lock through `withGuidedProtection`.
3. Another tab can hold that lock. Meanwhile, navigation commits browser history/router location before React's deferred transition finishes. The old controller remains mounted. Its former invalidation depended on passive effect cleanup/setup for session/owner changes or unmount; those effects have not necessarily run yet.
4. If the lock becomes available in that interval, protection scans the current Mock inventory. The repository checks the unchanged old epoch and source proof, enters a short IDB readwrite transaction, compares the complete current record to its prepared record, checks intent/access again and issues `put`. It awaits transaction completion before acknowledgment/notification.
5. Revision checks legitimately find revision 0: nobody else wrote. They cannot detect a route change that never reached the intent epoch. The hint becomes1 and revision 1. Later React cleanup cannot undo that completed transaction; rejecting a late UI acknowledgment does not undo storage.

The installed router source confirms history push/replace precedes synchronous router subscriber notification, while `RouterProvider` schedules ordinary updates through a React transition. The installed scheduler uses MessageChannel in this browser. This is a navigation invalidation gap, not a revision conflict, catalog change, D12 selection change, download issue or account mutation.

### Deterministic reproduction and causal evidence

`deterministic-before` deliberately holds React's scheduled MessageChannel work, while leaving browser history/router notifications and IndexedDB/Web Locks operational. The test first queues a real UI hint behind another tab's real shared lock. It then navigates to `/guided`, verifies that URL while the original Question 1 heading is still rendered, and releases the lock before allowing React work to resume. The complete-record safety assertion **fails 1/1** with exactly `T1.maxHintRevealed`0→1, revision 0→1 and a changed `updatedAt`.

The synchronous event-array attachment records this order:

```text
history-push (route: other)
lock-enter   (route: other)
guided-put   (route: other, revision: 1, T1 hint: 1)
lock-complete
```

An independent **stronger negative control**, `queued-before-control`, subsequently uses the final repository-request barrier against the two exact pre-fix runtime files. Their hashes are checked against this task's starting snapshot. It confirms the actual repository command is queued, then records `command-queued → history-push → lock-enter → guided-put(revision 1, hint 1) → lock-complete` and fails the same complete-record assertion1/1. This rules out an unrelated background protection poll satisfying the queue prerequisite. Its archived probe source, [control record](../../test-results/guided-practice/phase-6-queued/negative-control.json) and [event sequence](../../test-results/guided-practice/phase-6-queued/queued-before-control-events.json) remain separate from corrected regressions. The probe expects the old runtime's absence of synchronous invalidation; the complete-record safety assertion is unchanged. Only the isolated copy temporarily uses pre-fix files; the corrected candidate is restored and all 156 input hashes verified before confirmation.

This independently demonstrates the mechanism capable of producing the recorded failure. The historical failed run did not capture its internal React scheduling, so its precise delay duration is not retrospectively invented. The controlled ordering establishes the defect and an applicable correction without relying on a lucky rerun. It does not claim normal users encounter the artificial scheduler hold itself.

The fault barrier is test-only. It retains actual lock callbacks/transactions and uses a small synchronous array of stage/route-class/revision/hint metadata. No live user records, account IDs, tokens, callback URLs or confidential payloads are logged. There is no asynchronous per-event tool binding or console streaming. Intentional scheduler control supplies the fault ordering; observers can affect timing, so wall-clock durations are not the causal oracle. Initial reproduction output, diff, screenshot/context and attachments remain in the evidence directory.

## Smallest runtime correction

- New [navigationIntent.ts](../../src/domain/guided/navigationIntent.ts) holds the current location key and synchronous invalidation listeners. A changed accepted key notifies listeners immediately; duplicate-key router updates do nothing. Returning Back/Forward to an earlier key is another change and invalidates again, rather than restoring a previous epoch.
- [main.tsx](../../src/main.tsx) seeds that key and observes location changes through the existing router's public `subscribe` API, before mounting `RouterProvider`. It creates no router, route, storage, network operation or service.
- [useGuidedPractice.ts](../../src/hooks/useGuidedPractice.ts) registers a layout-effect listener. On accepted navigation it synchronously increments the existing epoch and clears `sessionRef`, without setting React state or waiting for rendering. Layout cleanup also invalidates synchronously before unsubscribing on unmount. Existing passive effects still own route loading/reconciliation and repository lifetime.

The repository's existing pre-lock, post-lock and transactional intent checks now observe a changed epoch while the old React screen is still present. The canceled queued command returns `cancelled` without a Guided `put`; its late controller result fails the existing epoch check. The matched fixed-source reproduction passes (`deterministic-after`,1/1). Final deterministic cases additionally record `intent-invalidate` before the queued lock entry and no `guided-put`.

Repository/storage/protection/access/session logic and the shared lock helper are **byte-identical** to the starting candidate. No hashing, network access, database initialization or other asynchronous work was added inside a transaction or critical section. Expected revisions, exact complete-record comparisons, fresh active-Mock/source-owner proofs, idempotent immutable first commitments, transaction durability and after-commit notifications are unchanged. There are no delays, automatic command retries, deadline increases, storage migrations or compensating rewrites.

A durable write completed before navigation remains stored. This correction cancels invalidated work awaiting preparation/protection/lock or a pre-write intent check; it does not roll back completed transactions or reinterpret an independent tab's legitimate revision. It does not add a broad transactional undo mechanism.

## Deterministic verification and separate outcomes

[guidedCommandCancellation.test.ts](../../tests/guidedCommandCancellation.test.ts) adds 7 unit cases. Six control hint/commit invalidation during asynchronous source preparation, awaiting protection, and the transaction's read completion before the existing active check. Each compares the entire IDB record and verifies no commit notification. Preparation/protection cases include an away-and-back key sequence so the old intent cannot revive. One case verifies duplicate-key notification and unsubscribe behavior. Existing stale-revision/idempotency/uncertain-ack/owner/Mock cases remain intact.

[guided-queued-navigation.spec.ts](../../tests/guided-browser/guided-queued-navigation.spec.ts) adds 9 browser cases:

| Ordering | Required evidence |
| --- | --- |
| Hint and commitment queued; PUSH with deferred React cleanup |New history/router key before lock release; original session still rendered; synchronous invalidation; no Guided put; complete saved record unchanged |
| Hint and commitment queued; Back then Forward |Two accepted location invalidations, original URL restored, canceled command cannot revive; complete record unchanged |
| Hint and commitment queued; Home/unmount |Instruction unmounted before release; late operation cannot write; complete record unchanged |
| Hint and commitment already durably saved |Navigation/Back/Forward/reload preserves every saved field and commitment |
| Other tab writes legitimately while first tab's hint is canceled |Only the other tab's T2 hint/revision advances; compare full expected record and reload; canceled T1 hint is not replayed |

Queued cases wait for actual shared-lock contention and use a subsequent lock sentinel to drain existing requests before reading. They recheck complete records after return and session reload. PUSH cases expressly hold React work; POP cases verify actual Back/Forward notifications without assuming every browser POP follows the same deferred-render path. No deadline was enlarged.

### Initial results and corrections preserved

| Run | Actual outcome |
| --- | --- |
| `original-first` |Original unchanged failing test 1/1 pass; no closure inferred |
| `deterministic-before` |1/1 fails complete-record assertion on uncorrected runtime; reproduces hint 0→1/revision 0→1 |
| `deterministic-after` |Matched controlled hint case 1/1 pass after runtime correction |
| `focused-cancellation` |63/63 in 4 files: cancellation, repository, protection and recovery contracts |
| `typecheck-development` |Pass |
| `ordering-expanded` |7/9 pass; two new POP cases stop at an incorrect setup assertion that the original heading must still be visible while scheduler work is held. Their saved-record assertions were not reached; these are not classified as product passes |
| `ordering-repaired` |9/9 pass. Corrected only that new POP setup assumption, added exact invalidation counts/no-put assertions and retained all complete-record/reload checks and deadlines |
| `queued-before-control` |Stronger independent negative control on exact pre-fix runtime:1/1 fails the complete-record assertion with command explicitly queued before history and put afterward; corrected runtime then restored exactly |

The first reproduction was a single hint/PUSH case; it was subsequently expanded into the parameterized final suite. Its original failure artifacts and event ordering remain separate. All existing test files/assertions/timeouts remain byte-identical. No initial result is overwritten by a later run.

## Final applicable regression matrix

The final candidate is frozen in [final-candidate-manifest.json](../../test-results/guided-practice/phase-6-queued/final-candidate-manifest.json), including exact root/tested hashes. Suites use the accepted isolated environment: no private environment, sanitized production/account/analytics flags, external Node denial and browser deny proxy, synthetic account/SDK interception, fresh contexts, owned services, two unit workers, sequential browser suites and zero automatic retries. PDF preview keeps one worker and original 30-second cases. Per-run command/result/log/JSON/lifecycle/cleanup records accompany the [cycle ledger](../../test-results/guided-practice/phase-6-queued/final-cycle-results.json).

| Final check | Result | Evidence stem |
| --- | --- | --- |
| TypeScript |Pass, initial and confirmed |`typecheck-final`; `typecheck-confirmed` |
| Full units |**578/578 in 36 files** |`unit-final` |
| Production build |Pass; existing warnings retained |`build-final` |
| Initial full existing Guided plus new ordering, two workers |**47/47** = unchanged existing 38/38 + new 9/9 |`guided-existing-final` |
| Later full Guided confirmation, two workers |**40/47; 7 failures** under measured resource pressure; original target/new 9 pass |`guided-confirmed` |
| Unchanged full Guided confirmation, one worker |**47/47**; same assertions/deadlines |`guided-isolated-confirmation` |
| Full post-exam Guided |**24/24** |`post-exam-final` |
| D12 |**7/7** |`d12-final` |
| Full Mock/guest, including PDF readiness |**139/139** |`guest-final` |
| Account |**32/32** |`account-final` |
| Analytics |**6/6** |`analytics-final` |
| Recovery |**8/8** |`recovery-final` |
| Actual intercepted SDK / Guided isolation |**3/3** |`guided-sdk-final` |
| Disabled production preview |**4/4** |`disabled-preview-final` |
| Production-preview PDF |**14/14** |`pdf-preview-final` |
| Enabled flag / empty production catalog |**4/4**, isolated test environment only |`empty-catalog-final` |

Each evidence stem has logs and command/result records; browser stems also have JSON and cleanup records. The Guided and post-exam runs cover all 62 prior cases alongside 9 new ordering cases. All runs have zero automatic retries/skips/flaky classifications; the later two-worker run's 7 actual failures are retained. Counts overlap and are not unique additional coverage. Build retains main/PDF chunk-size and mixed static/dynamic import warnings: main 704.25 kB, PDF remains a separate 1,834.25 kB chunk. No warning or timeout threshold changed.

Only the new browser test's queue barrier changed after the initial cycle freeze: it locally identifies a repository request from its module frame, records no stack, and prevents an unrelated protection poll satisfying the command barrier. Complete-record/no-put assertions and deadlines are unchanged. Stronger focused 9/9, repeated TypeScript and the two-worker 40/47 outcome are in [confirmation results](../../test-results/guided-practice/phase-6-queued/confirmation-results.json); the unchanged one-worker 47/47 is separate. [Input equivalence](../../test-results/guided-practice/phase-6-queued/late-test-strengthening.json) proves identical application/unit/build/normal-browser inputs; those successful suites were not repeated for this test-only strengthening. No application/test/configuration changes followed the [confirmed manifest](../../test-results/guided-practice/phase-6-queued/confirmed-candidate-manifest.json). [Exact runtime preimages/delta](../../test-results/guided-practice/phase-6-queued/runtime-delta.json) match starting hashes.

The later 40/47 completed naturally, with six 30-second startup/interaction budgets exceeded and an orphaned-Mock suspension response of 3055 ms against the unchanged2500 ms assertion. The original queued-hint and all 9 new ordering tests passed; no recorded hint mutation recurred. [Resource evidence](../../test-results/guided-practice/phase-6-queued/resource-pressure.json) measures all four cores 100% busy and 108,953,600 bytes free of 4,164,005,888 during that run. After completion, free RAM was 1,148,555,264 bytes before the one-worker run ([follow-up record](../../test-results/guided-practice/phase-6-queued/resource-after-run.json)). This is correlation, not proof of each failure's cause or a controlled performance benchmark. No test was weakened or deadline raised. Lower concurrency changes an execution condition; its pass does not erase the two-worker failures or establish all response budgets under pressure. That obligation remains a release blocker. Manual interruption was not performed; the run completed naturally with all 47 cases recorded.

The [verification summary](../../test-results/guided-practice/phase-6-queued/verification-summary.json) retains every initial/final case; [causal ordering](../../test-results/guided-practice/phase-6-queued/causal-ordering.json) compares pre-fix history→lock→put with final history→intent invalidation→lock and zero puts. These current passes verify the scoped correction without reclassifying the original historical failure.

## Preservation audit

[Final integrity audit](../../test-results/guided-practice/phase-6-queued/final-integrity.json) checks the 479-file starting snapshot, exact 156 tested candidate inputs and current inventory. Only existing runtime files `src/main.tsx` and `src/hooks/useGuidedPractice.ts` changed; `src/domain/guided/navigationIntent.ts` is the sole new runtime module. The two new test files and this report are added; current status/spec/planning documentation is updated. All existing test files, including the original target test, remain byte-identical. There are no unexpected existing/new file changes or root/tested input mismatches.

D12 loader/selectors/UI and approved PDF-readiness UI are unchanged. Repository/protection/access/session/fingerprints, original Mock parser/storage/grading/timers, App, account/recovery hooks, analytics, original PDF/export renderers, dependencies, test/hosting configuration and private environment are unchanged. Source and built banks retain SHA-256 Intermediate `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4` and Advanced `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`; approved Markdown is unchanged.

All educational drafts/ledgers/matrix and previous implementation reports retain their starting bytes and hashes. Owner approvals 10/10, independent human review 0/10 and AI sources 12/12 remain distinct; runtime approvedG1 fields remain null. [Historical evidence](../../test-results/guided-practice/phase-6-queued/historical-evidence.json) retains the original 37/38 and its diagnostic reruns. No human signatures or observations were supplied.

The complete original-report oracle passes raw saved report, hash/model/score/flags/answers/timestamps and all 61 parsed PDF pages before/after Guided completion/return: [report integrity](../../test-results/guided-practice/phase-6-queued/original-report-integrity.json). Existing real-bank/legacy downloads, owner/account/report protections and ordinary analytics remain verified by their full regressions; actual intercepted SDK checks retain Guided cloud-write/telemetry isolation. No live account/report data was used for fault injection or mutated.

Production catalog remains frozen empty, source/built public guidance is absent and environment/preview remain default-off. The isolated enabled-empty-catalog check changes no production setting. Six built files are hashed, with no checked synthetic/draft sentinel matches; deployment exclusions remain intact. Git HEAD/index/private-environment hashes are unchanged; all twelve owned QA/proxy ports are stopped. Two inherited links to absent historical reliability-fix-checks.txt remain identified; no new broken documentation links. There was no publication, hosted mutation, deployment, commit or push.

## Remaining release blockers and owner decisions

- Owner review/acceptance of this specific navigation correction and its actual final evidence remains pending. D12/PDF readiness are already technically owner-accepted for continued development, subject to release gates. Full Phase 6 remains unaccepted.
- Historical PDF cancellation/timeouts and password-recovery missing-dialog causes remain unresolved. This work changes neither behavior and does not close those obligations because subsequent suites pass.
- General response budgets under severe resource pressure remain open: the later two-worker 40/47 has six 30-second timeouts and a3055 ms protection response against 2500 ms. No broader performance correction or unconditional clean baseline is inferred from other passing runs.
- All ten educational records and hash-bound approvals remain unchanged: owner approvals 10/10, independent human reviews 0/10 and AI source checks 12/12. Independent solve-first/source/cumulative-hint/all-option reviews/signatures and educational exit remain pending.
- D14 protocol decision, at least three consenting five-question observations, recorded defects and remediation remain pending; no participants or observations are invented.
- Native screen-reader/human accessibility acceptance and physical-device/other-browser coverage decisions remain unexecuted. Synthetic Chromium and AI evidence do not supply those approvals.
- Content publication, exact release artifact/host/rollback, full local readiness, production enablement, deployment and actual-host acceptance require separate decisions. Production flag remains off/catalog empty. No hosted account/report/configuration mutation, deploy, commit, push or Phase 7 start occurred.

Stop after this handoff for owner review. A current passing Guided suite can establish the scoped correction's verification; it cannot rewrite the genuine prior 37/38 failure or accept public release.
