# Guided Mode — release-readiness review

19 October 2026. **Assessment complete; production readiness is not established.** Phase 7 remains COMPLETE / OWNER ACCEPTED within its existing local/test boundary. This assessment neither reopens that phase nor authorizes publication. No application defect was confirmed in the sampled browser paths; the strict full unit suite still has aggregate timing failures, native/device/browser checks remain unexecuted, and hosted packaging/smoke/rollback and owner release decisions remain open.

## Evidence reviewed and preservation

Reviewed the six existing Guided Mode documents: [owner handoff](GUIDED-MODE-OWNER-HANDOFF.md), [completion](GUIDED-MODE-COMPLETION-REPORT.md), [integration](GUIDED-MODE-INTEGRATION-VERIFICATION.md), [browser QA](GUIDED-MODE-BROWSER-QA.md), [version integrity](GUIDED-MODE-CONTENT-VERSION-INTEGRITY.md) and [release readiness](GUIDED-MODE-RELEASE-READINESS.md), plus [change inventory](../../test-results/guided-mode-20261019-01/work-changes.json), [Phase 7 final acceptance](PHASE-7-FINAL-OWNER-ACCEPTANCE-AND-COMPLETION.md) and [release handoff](PHASE-7-RELEASE-READINESS-HANDOFF.md). The handoff calls this a six-deliverable set; it has five companion reports, not six additional reports. Earlier Phase 6 readiness/final QA and Phase 7 integration failure records were reviewed for the reliability dispositions below.

The accepted candidate remains `118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba`. [Preservation results](../../test-results/guided-release-readiness-20261019-01/preservation-after.json) verify **929/929** assessment-baseline files, **42/42** prior verification inputs and **20/20** prior build artifacts byte-identical. This includes source, banks, approved content and identities, acceptance history, historical screenshots and the entire previous normal-app evidence directory. The original integration test is byte-identical to its saved pre-assessment copy. All four staged release hashes still match their build-time pins. No existing report, screenshot, application file or maintained test was edited in this assessment.

New evidence is confined to [the excluded assessment directory](../../test-results/guided-release-readiness-20261019-01/) and these three new reports. Original failing logs were preserved in place, not replaced by passing probes. No deployment, feature enablement, commit, push or Phase 8 occurred.

## Unit failure investigation

The prior **837/838** run failed exactly `tests/guidedPhase7Integration.test.ts:73`, parameter case **V07/V08/V14: 1.1.0 10-item exact frozen lifecycle through reopened IDB**, at **5023 ms**, with Vitest's unchanged default **5000 ms total test budget**. Original evidence is [units-closeout.log](../../test-results/guided-mode-20261019-01/units-closeout.log). A separate earlier one-worker run failed the 1.0.0 ten-item case at 5024 ms. A focused passing rerun was already recorded; it did not make either full run green.

This case performs session construction, create, ten navigations, thirty durable hint writes and reads, ten selections and commitments, ten database closes/reopens and whole-record comparisons, finish, immutable-cohort checks and validation. The deadline covers the entire sequence, rather than a single UI operation or database response. Strict schema, digest, revision and protection validation is intentional and was not bypassed.

Bounded diagnostic executions used real candidate preparation/domain/repository code, fake IndexedDB as in the original unit test, one worker, zero retries and the same five-second deadline. Probe sources/configurations and logs are retained beside their metrics. They are under `test-results/`, outside the maintained `tests/**/*.test.ts(x)` include.

| New execution | Actual result / interpretation |
| --- | --- |
| Exact lifecycle probe, original Vitest equality | **1/1 passed**, 2988.03 ms lifecycle. The 41 whole-record equalities consumed 67.34 ms total; slowest measured repeated repository command was 76.93 ms. CPU was 3.156 s user / 0.172 s system; maximum measured event-loop delay 56.66 ms. [Metrics](../../test-results/guided-release-readiness-20261019-01/metrics-vitest.json), `probe-vitest.log`. |
| Comparative diagnostic using Node deep equality | **1/1 passed**, 2644.42 ms lifecycle; equality cost 19.90 ms. Other operations also varied substantially, so the wall-time difference is not attributable to the matcher. Diagnostic only; no maintained assertion was replaced. `metrics-node.json`, `probe-node.log`. |
| Entire original test-file order, original assertions, timing instrumentation | **87/88 passed**. The 1.1.0 ten-item lifecycle passed at 4115.61 ms; equality cost 77.17 ms. Failure moved to V04/V05 deterministic five-item partition/all frozen starts, again the aggregate five-second deadline. Other lifecycle walls: 3008.06 / 3762.32 / 1384.77 ms. `ordered-probe.log`, `ordered-*.json`. Browser reconnection occurred during this run; it was not a controlled idle-machine experiment. |
| Unchanged full suite, explicit `--maxWorkers 1` | **834/838 passed**, 43 files passed / one failed, exit 1, 208.06 s. All four failures are aggregate five-second deadlines in the same integration file; the original failing lifecycle passed. [Full log](../../test-results/guided-release-readiness-20261019-01/units-assessment.log). |

The last full command was `node node_modules/vitest/vitest.mjs run --configLoader runner --maxWorkers 1`. Its failures were:

| Case | Reported elapsed |
| --- | ---: |
| V04/V05 complete deterministic 5-item partition and all frozen starts | 5029 ms |
| V12/V13 exclusions, final overlaps, insufficient sizes and unaffected frozen sessions | 5481 ms |
| V16/V17 exact frozen-report cohorts and unchanged report hash/PDF data | 5010 ms |
| V18 actual production runtime uses array order for starts and exact-source post-exam selection | 5006 ms |

**Finding:** a specific persistence correctness defect has not been demonstrated. Failures move among expensive aggregate cases while their unchanged assertions pass in other executions. Aggregate scheduling/workload variability and a brittle total-test budget are supported explanations, but no controlled causal isolation proves environmental contention alone. Repeated real validation also costs time; a product performance limitation is not ruled out. No measured application response missed its own budget in these lifecycle probes. The full-run failures prevent a clean full-unit acceptance claim and leave resource/performance readiness unresolved.

Deep equality contributes too little to justify a harness correction on this evidence. Splitting aggregate tests might eventually give more meaningful coverage, but this assessment does not rewrite coverage merely to pass. **No deadline increase, retry, assertion weakening, skipped test, runtime caching/validation shortcut or test-source change was made.** No further rerun was used to chase a green result. Owner disposition or separately scoped causal/performance work is required; see decision R1 in [open risks](GUIDED-MODE-OPEN-RISKS-AND-DECISIONS.md).

## Built-in browser assessment

Used the normal application’s locally served production output at **http://127.0.0.1:4261/guided**, with one active local browser workflow. Existing accepted build bytes were verified unchanged. New checks are observations, not an invented count added to the previous **302/302** browser suite. No necessary application fix resulted, so unaffected automated browser suites were not repeated. Previous TypeScript, three successful builds and 302/302 selected browser results remain historical exact-artifact evidence; no fresh build/typecheck pass is claimed.

Created one separate five-question QA Guided session (`a3dcbae7-aabc-45db-a3de-b954612afcae`), leaving older sessions intact. Exercised Q26 (table/three responses) and Q27 navigation/reload. Verified:

- Enter starts a selected fixed set and places focus on “Question 1 of 5”. Hint 2/3 initially expose disabled state and unlock instructions. Enter reveals each progressive hint; collapsing Hint 1 leaves Hint 2/3 independently open, with expanded states in the tree.
- Space selects A/C/D in named checkbox controls within “Select exactly 3 answers”; only the exact count enables checking. Enter commits; status becomes “Answer saved and locked”, focus moves to the correct-feedback heading and the first answer remains locked.
- Feedback exposes criteria, every option comparison and sources, without Original explanation or Vocabulary. Heading/navigation structure and status/alert roles are present in the accessibility representation. This is semantic inspection, not proof of native spoken announcements.
- The table exposes column headers and cells in a named, keyboard-focusable scroll region. ArrowRight moved its scroll position to 27 px with focus retained. Tab from Next reaches “Go to next unanswered question”; Enter on Next advances. Reload restores Question 2 with heading focus and saved progress.
- At **320, 390, 768 and 1366 CSS px**, Q26 table/feedback has no document-wide horizontal overflow. Wide table content scrolls inside its region (714 px content; containers 237/307/657/672 px). Screenshots were inspected. The feedback focus outline is visible. This sample is not a review of every guide, contrast state, zoom mode or device.
- A deliberately nonexistent session route shows the recovery alert with Retry/return/history actions. Enter Retry reconciles to the same alert with heading focus; Enter Return exits to landing. No existing record was deleted or corrupted to create this state. Corrupt database, quota and multi-tab failure coverage is reused from earlier automation, not freshly simulated here.

New evidence includes [layout metrics](../../test-results/guided-release-readiness-20261019-01/browser-layouts.json), `q26-feedback-ax.txt`, four `q26-feedback-*.jpg` images, settled missing-session recovery tree/image and final landing image. A wait initially guessed the wrong feedback heading (“Answer feedback”); inspection found the actual correct heading and focus. That tool locator miss was not an application failure. Initial snapshots also captured normal pending save/load states; conclusions use settled states.

Existing Mock history still displays its prior completed Intermediate report, **17/1000, 1/60 correct, dataset 1.0.0**, with unchanged displayed timestamp. No Mock was started, resumed, submitted or deleted. Browser storage payload hashing was unavailable in the tool’s read-only DOM scope; this observation is not a claim of a fresh byte-level browser-storage audit. Source/fixture/contract hashes remain unchanged. Local browser error log was empty at closeout. The new QA session remains saved, and the preview tab remains available.

## Hosted observation and remaining release work

Read-only built-in browsing confirmed the documented origin **https://pcao-f-practice-exam-one.vercel.app/** serves the existing practice app. Its `/guided` path currently shows **404 NOT_FOUND**, captured in `production-guided-404.jpg` and its tree. No sign-in or hosted mutation was performed. This is a route availability observation, not hosted Guided acceptance, remote environment inspection or an inventory of real sessions. Earlier web-tool access failure was only a tool access limitation; the later browser result is the usable observation.

The reviewed repository still uses Vercel’s ordinary `npm run build` → `dist`, an empty frozen production catalog, and default compiled local catalog `undefined`. The explicit local mode stays outside `dist`, rejects hosting environments and disables accounts/recovery/analytics. `guided-release/` is excluded from deployment upload. The production feature remains unavailable; no publication mechanism was enabled. Actual hosted build configuration, environment values and linked deployment identity were not independently authenticated (`.vercel/project.json` is absent).

The [deployment plan](GUIDED-MODE-PRODUCTION-DEPLOYMENT-PLAN.md) specifies exact assets/maps and compatible rollback. The [risk/decision register](GUIDED-MODE-OPEN-RISKS-AND-DECISIONS.md) retains historical reliability failures and the unexecuted native/device/browser checklist. **Separate owner approval for exact public publication and production deployment is required after those decisions and applicable verification.** No owner risk acceptance, personal walkthrough, native accessibility result, real historical production session or learner-effectiveness result is inferred here.
