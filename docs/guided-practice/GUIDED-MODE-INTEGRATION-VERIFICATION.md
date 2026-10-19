# Guided Mode — integration verification

19 October 2026 (Asia/Karachi). Every browser suite was executed sequentially with **one worker and zero retries**. Existing timeouts and security/content/persistence assertions were retained. All logs/artifacts are under `test-results/guided-mode-20261019-01/`. A later passing run never erases an initial failure.

## Current executed results

| Suite | Result | Exact evidence |
| --- | --- | --- |
| Normal enabled production app | 21 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/enabled-final.json) |
| Default disabled production app | 2 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/disabled-guard-final.json) |
| Enabled-empty production app | 2 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/empty-guard-final.json) |
| Existing Guided | 72 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/guided-confirmed.json) |
| D12 | 7 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/d12.json) |
| Original Mock/Results/PDF (full guest) | 139 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/guest.json) |
| Account | 32 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/account.json) |
| Analytics | 6 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/analytics.json) |
| Recovery | 8 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/recovery.json) |
| Actual SDK Guided privacy | 3 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/guided-analytics-confirmed.json) |
| Retained Phase 7 candidate | 10 passed / 0 failed / 0 skipped / 0 flaky | [JSON](../../test-results/guided-mode-20261019-01/retained-candidate.json) |

TypeScript: [closeout log](../../test-results/guided-mode-20261019-01/typecheck-closeout.log). Builds: [enabled/disabled/enabled-empty normal Vite builds](../../test-results/guided-mode-20261019-01/build-publication-guard.log); exact release emission and no guidance in default/empty output are checked. The enabled app bundle is the same application code exercised by the 21-case normal run; the later configuration refinement compiles out only the default catalog global. Full closeout units: **1 failed | 837 passed (838)** ([log](../../test-results/guided-mode-20261019-01/units-closeout.log)). Candidate identity: [reverification](../../test-results/guided-mode-20261019-01/candidate-reverified.log).

Final selected browser total: **302 passed, 0 failed**.

The full closeout unit run remains **837/838**, with the 1.1.0 ten-item lifecycle reaching its unchanged five-second aggregate deadline at 5023ms. The exact unchanged case passed alone (**1 passed, 87 unselected**) in [the focused run](../../test-results/guided-mode-20261019-01/unit-lifecycle-focused.log). This distinguishes focused success from the still-failed full-run budget; it does not establish a clean 838/838 full run or resolve historical resource-pressure risk. No assertion or timeout was changed.

## Reproducible commands

- `npm run typecheck`; final runner invokes the identical `node node_modules/typescript/bin/tsc --noEmit`.
- `node tests/normal-guided/build.mjs`: normal `vite.config.ts`, explicit local enabled mode and sanitized disabled/enabled-empty production builds; output under `.localtest/guided-mode/`. It runs no test runtime transform in the enabled build.
- `node node_modules/@playwright/test/cli.js test --config tests/normal-guided/playwright.config.ts`; `GUIDED_QA_KIND` chooses enabled/default/empty, `GUIDED_QA_RUN` chooses a fresh evidence suffix.
- `node node_modules/@playwright/test/cli.js test --config tests/normal-guided/regression.config.ts`; `GUIDED_REGRESSION` selects guided/d12/guest/account/analytics/recovery/guided-analytics. Global setup redirects historical relative screenshot/PDF output into each excluded suite workspace.
- `node node_modules/@playwright/test/cli.js test --config tests/normal-guided/candidate.config.ts`: original ten candidate cases under new evidence paths, distinct from normal-app proof.
- `node node_modules/vitest/vitest.mjs run --configLoader runner --maxWorkers 1`. No test timeout was increased.

[Original sequential command exits](../../test-results/guided-mode-20261019-01/regression-exits.json) and [closeout exact arguments/exits](../../test-results/guided-mode-20261019-01/final-verification-exits.json) retain per-command results. The one-off runners refuse existing log paths; do not rerun them over this evidence.

## Failures and limitations retained

1. `units-initial.log`: npm consumed the requested worker option instead of forwarding it. 43 workers spawned; **808 passed, 13 failed, 11 skipped (832)**. Database setup and strict lifecycle budgets failed, and simultaneous built-in inspection reached a protection checking-timeout. No state repair or security bypass occurred.
2. `units-final.log`: directly limited two-worker run, **821 passed, 4 failed, 7 skipped (832)**. Historical preservation tests were separately aligned with exactly five newly authorized code/configuration pins; all content, identity and historical pins remain exact.
3. `units-one-worker.log`: **837 passed, 1 failed (838)**, with the old 1.0.0 ten-item IDB lifecycle hitting its unchanged five-second limit (5024ms). The six additional units validate packaging pins and hosted-build rejection. Final closeout is separately reported above, not substituted into this run.
4. `enabled-initial.log` and `enabled.json`: **18/21**; three completion-focus failures. The stale completed-review cursor was corrected and rebuilt; `enabled-final.log/json` records **21/21**, including focused/visible summaries.
5. `guided-run.log` and `guided.json`: **71/72**; native launch input waited on a button already disabled by proactive access polling after source deletion. The maintained test respects that disabled state or exercises the fresh launch rejection, and still requires an alert, no feedback and zero derived records. Confirmed suite is separate.
6. `guided-analytics-run.log`: **0/3**; wrapper omitted the existing analytics harness's human user-agent and received no actual SDK batches. Same established user-agent was added; `guided-analytics-confirmed.log` records **3/3**, with unchanged transport/privacy assertions.
7. Built-in PDF waiting timed out/reset the browser tool; no native download success is claimed. The app returned to ready Results controls; actual headless PDF download/content regressions are separately included in the passing full guest suite.
8. Existing large-bundle and ineffective-dynamic-import build warnings remain. Synthetic recovery/history fixtures still produce the documented router POP-blocker warning. No assertion/deadline was changed to hide them.

[Browser QA](GUIDED-MODE-BROWSER-QA.md) documents actual interactive journeys and screenshots. [Release readiness](GUIDED-MODE-RELEASE-READINESS.md) retains native/device/host, origin/legacy and historical reliability decisions. Low-concurrency passes do not establish production-load stability.

## Preservation and exact files

[Final preservation](../../test-results/guided-mode-20261019-01/preservation-final.json): 400 captured baseline files, 396 unchanged, 4 explicitly authorized changes; **251 historical screenshots and all 4 original candidate files unchanged**. [Exact modified/added files](../../test-results/guided-mode-20261019-01/work-changes.json) and [verification input hashes](../../test-results/guided-mode-20261019-01/verification-inputs.json) define this work. Root pre-existing dirty changes were not reset or committed.
