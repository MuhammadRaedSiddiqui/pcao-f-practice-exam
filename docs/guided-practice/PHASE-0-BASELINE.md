# Guided Practice — Phase 0 baseline and architecture audit

Audit date: **16 October 2026, Asia/Karachi (UTC+05:00)**. Owner authorization: the current message explicitly approves Phase 0 and isolated local typecheck/unit/build/browser verification. **No Phase 1, application implementation, test maintenance or deployment is authorized or performed.**

Read alongside the [master plan](GUIDED-PRACTICE-MASTER-PLAN.md), [architecture](GUIDED-PRACTICE-ARCHITECTURE.md), [verification matrix](GUIDED-PRACTICE-VERIFICATION-MATRIX.md), [risk register](GUIDED-PRACTICE-RISK-REGISTER.md), [execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md) and [original guidelines](../GUIDED_PRACTICE_IMPLEMENTATION_PLAN.md). The five planning documents remain proposals: the recommendations below do not silently amend or approve them.

## 1. Outcome and scope

The baseline audit has exercised the current working-tree application through an isolated copy, preserved the original tree, and reviewed the proposed integration against actual source. TypeScript, all 214 unit tests across 23 files and the isolated production build pass. A separate production-preview guest smoke passed 24 assertions, with current screenshots, legacy/frozen report fixtures and a downloaded PDF.

The maintained browser suites are **not clean**. Many cases still expect removed UI or old navigation roles; analytics delivery checks also exhibit timing/synchronization problems, and recovery had one initial timing failure that passed an unchanged focused rerun. Those failures are not converted into historical or diagnostic passes. Full counts and individual failures are recorded below and in the machine-readable ledger.

The principal architecture issues are an index-only active-attempt lookup that misses orphaned records, indefinite blocking if expired records must first save a report, and a missing explicit recovery policy for corrupt storage. Dedicated IDB, exact source binding, additive routes and frozen guidance fit the application. Recommended simplifications and required owner decisions appear in §7.

**Phase 0 audit deliverables are complete. The Phase 0 exit gate is not approved.** A clean maintained-browser regression baseline and owner decisions remain prerequisites under the master plan; passing compilation does not waive them.

## 2. Instructions and current-source inspection

Reviewed the five planning documents, original Guided guideline, root [AGENTS.md](../../AGENTS.md), [README](../../README.md), [implementation specification](../../IMPLEMENTATION_SPEC.md), [unified status](../../PROJECT_IMPLEMENTATION_STATUS.md), package/lockfile, runtime banks, schemas, routing, App coordination, attempt persistence/grading/results, account/analytics boundaries, styling, existing unit/browser fixtures and the current QA reports. No nested AGENTS.md was discovered outside excluded dependency/Git/artifact directories. Relevant historical references include [real browser QA](../../REAL_BROWSER_QA_2026-10-16.md), [observed bug fixes](../../OBSERVED_BUG_FIXES_2026-10-16.md), [exam auth restriction](../../EXAM_AUTH_RESTRICTION_VERIFICATION.md), [routes verification](../../SETTINGS_HISTORY_ROUTES_VERIFICATION.md) and [project analysis](../../PROJECT_ANALYSIS.md).

Newest source and applicable specification govern actual behavior. Older references to a three-view app, no accounts, difficulty-specific source drawers, bulk import/export, optional routing or authentication controls during Exam are obsolete. The owner's current approval supersedes historical restrictions on local checks only within the stated isolated scope. No historical deployment authorization is reused.

## 3. Reproducible working-tree baseline and preservation

| Property | Observed value |
| --- | --- |
| Repository | `C:\Users\HP\OneDrive\Desktop\PCAO-F` |
| Branch / HEAD | `main` / `8820340ea82920e6e512d0938b6f754c8f4e7916` |
| Capture time | 2026-10-16 19:09:35 PKT / 14:09:35 UTC |
| Manifest scope | All 373 unique tracked and non-ignored untracked working-tree files; byte sizes and SHA-256 per file. Private root .env files have a separate hash-only inventory. |
| Manifest SHA-256 | `eba3ad73c3b50fd39c7ad72dd42d54cefc28c8741fc10a04df93da0abc8813e1` |
| Node / npm | Node v24.18.0, npm 11.6.4 |
| Host | Windows 10.0.19045 x64; 4 logical CPUs; PowerShell |
| Browser | Isolated Playwright Chromium 156.0.8078.4 |
| Dependency policy | Existing node_modules only; no npm ci/install/update, browser download or lockfile change. |

The exact initial 373-file tree is retained in [baseline-working-tree.zip](../../test-results/guided-practice/phase-0/baseline-working-tree.zip), SHA-256 `598da1ec53a0543b97d77e2fa28fcbb4985443b11e6b5d44ddf7c1111ef919aa`, with the [pre-audit manifest](../../test-results/guided-practice/phase-0/source-manifest-before.json), [full Git status](../../test-results/guided-practice/phase-0/git-status-before.txt), [index entries](../../test-results/guided-practice/phase-0/git-index-before.txt), [tracked HEAD-to-working-tree binary patch](../../test-results/guided-practice/phase-0/tracked-working-tree.patch) and [environment record](../../test-results/guided-practice/phase-0/environment.json). Each original file was rehashed against the initial manifest before archiving. The [execution workspace](../../test-results/guided-practice/phase-0/workspace/) has unchanged source/tests/config/banks but regenerated copied screenshots, so use the archive for a byte-exact initial tree. Reproduction uses this snapshot and installed lockfile versions; HEAD alone is insufficient.

Pre-existing edits include root instructions/spec/status/README/recovery/setup docs, attemptModel/bankValidation, account hook/repository/UI modules, vite.config.ts and many tracked screenshots. Untracked items include the five planning documents/original Guided guideline, account settings test, account verification report, ngrok helper and QA screenshots. They were not cleaned, stashed, reset, normalized, committed or overwritten.

Ignored dependency/Git internals, prior dist/test-results/local helper outputs and local deployment-link state are not copied recursively into the source snapshot. Original private environment values are never copied or published; only their filenames/hashes are recorded locally. The source snapshot intentionally reproduces a safe verification configuration rather than live account/analytics configuration. A node_modules junction reuses installed dependencies; generated test/build outputs stay in the audit copy/evidence tree. Original dist and screenshots remain untouched.

Git emitted read warnings for the inaccessible global ignore file and LF→CRLF warnings while producing the patch. No line-ending conversion was performed. OS process command-line enumeration through Get-CimInstance was denied; cleanup used audit launch logs and exact loopback listener PIDs instead. Neither limitation invalidates file-byte hashes.

### Source and content identities

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `public/easy-question-bank.json` | 170822 | `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4` |
| `public/question-bank.json` | 216403 | `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` |
| `tests/fixtures/approved-question-content.md` | 113600 | `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729` |
| `package-lock.json` | 152042 | `f27c9435ebac5dce4ae2bf0a7da23b625a8c36b98fcbd8a81828bec8086daf54` |
| `src/App.tsx` | 41795 | `8a6a469f6f9fb0edac2878cd25b889a7712eb4e250d3c0fedbf1de14156115f7` |
| `src/domain/attempt.ts` | 7350 | `eac84bf34ac817494557b0f6346c781cf44fb26143833fc98024d2b452399495` |
| `src/domain/attemptModel.ts` | 8557 | `ff3a6075f7b85b99a1988ee426d6481d200b66fbec48884c2ebcfbc1419f4c9d` |

Both banks remain reviewed schema 1, 60 questions, 120 minutes, 48 single/10 select-two/2 select-three, domain totals 8/13/7/10/7/9/6. Intermediate is examId `pcao-f-practice-easy-01`, version 1.0.0; Advanced `pcao-f-practice-01`, version 1.1.0. Existing real-bank/approved-content unit tests ran in this audit. No educational source was independently verified or content approved here.

## 4. Verification isolation and exact execution policy

All substantive commands ran from `test-results/guided-practice/phase-0/workspace`, an exact initial copy of source/tests/config/banks. Existing tests and production configurations in both original and copied trees remain unchanged. New `.audit-*.config.ts` files are explicitly audit-only wrappers, not changes to existing tests or configuration.

Isolation controls:

* No private .env copied; inherited VITE_/SUPABASE_/POSTHOG_ variables removed. Guest/build explicitly disable account history and PostHog. Original synthetic Vite account/analytics/recovery configurations supply only `.synthetic.test` endpoints and synthetic keys.
* A Node preload rejects non-loopback fetch/socket connections; Chromium uses a deny-only loopback proxy for unhandled external traffic. Synthetic Playwright route handlers fulfill account and analytics requests before network. Fresh nonpersistent browser contexts use only test-generated attempts/accounts.
* Two configured browser workers, zero retries, original test timeouts and assertions; account/analytics/recovery each ran one worker because each has one test file. All suites use owned servers with reuse disabled. Existing tests' fixed screenshot/PDF paths resolve inside the isolated copy.
* No hosted SDK account creation, email, real report backup/deletion, PostHog ingestion, deployment, push or external configuration mutation. Current-source production build uses a deliberately guest/no-telemetry environment; it does not verify live deployment settings.

Launcher and every exact argv/cwd/result are retained in [audit.mjs](../../test-results/guided-practice/phase-0/audit.mjs), [deny-network.mjs](../../test-results/guided-practice/phase-0/deny-network.mjs) and `*-command.json` / `*-result.json` beside the logs. Scripts execute installed tools, not downloaded packages. C1–C8 correspond to the planning matrix.

### Initial launcher failures, not application failures

The first typecheck/unit/build launches each exited1 before their npm script executed: Node's Windows ESM preload required a file URL, not `C:/...`. Their logs (`typecheck.log`, `unit-initial.log`, `build.log`) and launcher version `audit-launch-v1.mjs` are retained. Corrected only the evidence harness to use pathToFileURL, then ran the actual unchanged application checks with distinct `*-actual*` names. Initial app test count was 0, not 214 failures. No source/test repair occurred.

### Actual command results

| Check / command inside audit workspace | Current result | Evidence |
| --- | --- | --- |
| C1 `npm run typecheck` | PASS, exit 0 | [typecheck-actual.log](../../test-results/guided-practice/phase-0/typecheck-actual.log) |
| C2 `npm test` | PASS, 214/214 tests, 23/23 files, one actual full run; Vitest duration 30.17s. No PGlite retry needed. | [unit-actual-initial.log](../../test-results/guided-practice/phase-0/unit-actual-initial.log) |
| C3 `npm run build` | PASS, exit 0, 518 modules; Vite build 8.63s. Warning: chunks>500kB. Guest main 665.01kB; PDF 1834.25kB. | [build-actual.log](../../test-results/guided-practice/phase-0/build-actual.log) |
| C4 `npm run test:browser -- --config .audit-guest.config.ts` | FAIL:92 passed,43 failed,0 skipped,135 total. | [guest log](../../test-results/guided-practice/phase-0/guest-browser-initial.log), [JSON](../../test-results/guided-practice/phase-0/guest-browser.json) |
| C5 `npm run test:account -- --config .audit-account.config.ts` | FAIL: 5 passed,26 failed,0 skipped,31 total. Original script's earlier --config is overridden by explicit audit wrapper. | [account log](../../test-results/guided-practice/phase-0/account-browser-initial.log), [JSON](../../test-results/guided-practice/phase-0/account-browser.json) |
| C6 `npm run test:analytics -- --config .audit-analytics.config.ts` | FAIL: 2 passed,4 failed,0 skipped,6 total. | [analytics log](../../test-results/guided-practice/phase-0/analytics-browser-initial.log), [JSON](../../test-results/guided-practice/phase-0/analytics-browser.json) |
| C7 `node node_modules/@playwright/test/cli.js test --config .audit-recovery.config.ts` | FAIL: 4 passed,3 failed,0 skipped,7 total. Installed CLI equivalent of the documented recovery command; no npx download. | [recovery log](../../test-results/guided-practice/phase-0/recovery-browser-initial.log), [JSON](../../test-results/guided-practice/phase-0/recovery-browser.json) |
| C8 `npm run preview -- --port 4188 --strictPort`, then `node ../browser-smoke.mjs` | PASS:24 supplementary assertions; Chromium156; no primary guest page/console errors. | [smoke result](../../test-results/guided-practice/phase-0/browser-smoke.json), [log](../../test-results/guided-practice/phase-0/production-smoke.log) |
| `node ../storage-inspection.mjs` | PASS as a diagnostic:10 existing-storage scenarios recorded, including orphan omission and failed expiry save; not a Guided implementation test. | [storage inspection](../../test-results/guided-practice/phase-0/storage-inspection.json) |

Detailed per-case status, error/location and duration are in [browser-case-ledger.json](../../test-results/guided-practice/phase-0/browser-case-ledger.json). Full-run counts, focused runs and diagnostics are separate; do not sum them into a new suite total. Failed tests may stop before their named behavior is exercised.

### Focused reruns and altered-wait diagnostic

| Run | Exact change from original suite invocation | Result / interpretation |
| --- | --- | --- |
| `node node_modules/@playwright/test/cli.js test --config .audit-recovery-focused.config.ts --grep 'recovery resumes after Cancel'` | Same test source/timeout; one worker and already-owned synthetic server; separate output/report. | PASS 1/1,25.6s. Initial Cancel recovery failure remains in full run; timing flake suspected, not a confirmed deterministic recovery defect. |
| `node node_modules/@playwright/test/cli.js test --config .audit-analytics-focused.config.ts --grep 'guest identity survives\|automatic expiry'` | Same two tests/assertions/five-second polls, one worker, separate report. | FAIL 0/2. One fails initial pageview poll; expiry case later fails reloaded-pageview count. Delivery/synchronization still unresolved. |
| Same grep with `.audit-analytics-long-wait.config.ts` | **Diagnostic only:** wrapper expect timeout15000ms instead of 5000ms; existing tests not edited. | FAIL 0/2: guest flow reaches an unpolled Results-pageview assertion; expiry reaches obsolete expectation that reload emits a second Start pageview even though current routing restores Results. Does not replace or repair baseline. |
| `node ../analytics-probe.mjs` | Separate synthetic guest probe with 8s observation, then SDK inspection/manual synthetic capture; all traffic intercepted. | SDK loaded, not opted out, synthetic host/token confirmed, `/e/` POST observed before manual capture; no console/page errors. Initial missing events do not establish globally broken ingestion. |

Some CLI suites emitted all case results but stalled while tearing down their Vite server process trees. Only known audit-owned listeners were stopped after their cases completed; [teardown-intervention.json](../../test-results/guided-practice/phase-0/teardown-intervention.json) records exact PID/port/path/time. Their final reports include this extra elapsed time. This is a harness/environment limitation, not evidence that app execution took the reported entire suite duration. Focused runs reused only those known audit servers and omitted server ownership/teardown. No assertions were relaxed except the clearly labelled analytics wait diagnostic.

Relevant warnings/errors: original npm preloads failed with ERR_UNSUPPORTED_ESM_URL_SCHEME before application execution; browser processes warned that FORCE_COLOR overrides NO_COLOR; Vite warned about large production chunks; recovery navigation logged React Router's warning about POP entries not created by the router. Full failed assertions and contexts are retained. Primary guest smoke and the separate synthetic analytics probe recorded no page errors or warning/error console entries; existing suite logs are not a complete console capture for every browser context.

## 5. Current behavior and integration boundaries

| Area | Current source / boundary | Guided consequence |
| --- | --- | --- |
| Routing | [main](../../src/main.tsx) keeps App mounted above `/`, `/history`, `/settings`. [navigation](../../src/domain/navigation.ts) validates root Exam/Results history pointers. | Add guided child routes and view mapping; keep root flowState and existing blocker. New route rewrites are later configuration work, not performed here. |
| Bank loading | [bankValidation](../../src/domain/bankValidation.ts) strict reviewed 60/120 contract; [difficulty](../../src/domain/difficulty.ts) independently caches both banks. | No bank edits or embedded hints; new subset validator must not be the full 60-question validator. |
| Attempt editing | [App](../../src/App.tsx) separates optimistic controls from committed selections; [attempt](../../src/domain/attempt.ts) enforces revisions and submitted immutability under [Web Lock](../../src/domain/browserStorage.ts). | Reuse lock discipline and pure exact-set helper; keep guided state/store/writers independent. No timed-control extraction needed. |
| Timer/finalization | App monitors indexed history on interval/focus/visibility/pageshow; existing finalizer saves under lock, then checks owner visibility before opening Results. | Guidance should not invent a second finalizer or write a report merely to unlock learning. Orphans are not in this monitor's history. |
| Results | [results](../../src/domain/results.ts) distinguishes blank from nonblank incorrect; [ResultsPage](../../src/ui/ResultsPage.tsx) reads frozen Attempt and exports same snapshot through PDF module. | Separate combined Guided filter/callback; do not change ordinary ResultFilter or prefill historical answers. |
| Ownership | [archiveStorage](../../src/domain/archiveStorage.ts) markers remain separate from Mock bytes; inaccessible owners are hidden; [account hook](../../src/hooks/useAccountHistory.ts) uses epochs and current-owner checks. | Live foreign-owner Mock still blocks generically; private post-exam sessions must inherit scope and disappear on signout/source loss. Standalone remains account-free. |
| Analytics | [service](../../src/services/analytics.ts) buffers SDK events; [domain](../../src/domain/analytics.ts) has a closed view union and active-time context. | Add a small explicit suspended/null context later; flush previous context once. No new guided events/content, no mapping Guided to Exam. Existing analytics test timing must be maintained. |
| UI | Shared [primitives](../../src/ui/primitives.tsx), [Markdown](../../src/ui/MarkdownContent.tsx) and [styles](../../src/styles.css); account forms unmount during Exam. | Reuse rendering/focus/dialog primitives, but retain guided-only controls and precommit model. Broad styling/refactors would add risk. |

Existing wireflow: Home/History → difficulty preparation (no attempt yet) → guarded create/replace under shared lock → frozen 60-question Exam → Review/Submit modal → idempotent saved submission → read-only Results/PDF. Leaving via links/Back/Forward uses current confirmation while original deadline continues. Account report opening validates owner/downloaded frozen payload; it does not become a writable attempt. Guided adds a separate branch outside this flow.

### Current production-preview evidence

The fresh guest smoke selected Intermediate Q1=C, flagged it, advanced, reloaded/resumed with identical saved state/deadline, visited table/select-three Q26, selected one partial option, reviewed and submitted. Saved result is 1/60 (17/1000), one incorrect partial and 58 blank; report bytes stay identical through expanded review, resize and PDF export. Captured real-bank [Intermediate fixture](../../test-results/guided-practice/phase-0/intermediate-report-fixture.json), [Advanced blank-report fixture](../../test-results/guided-practice/phase-0/advanced-report-fixture.json) and [legacy fixture](../../test-results/guided-practice/phase-0/legacy-report-fixture.json) are test-created records only. Legacy omitted revision/difficulty/result and opened as Original exam.

Current screenshots cover Home/table Exam/Results at320,390,768,1366 and 844×390; Review/Submit, expanded Results, History, guest Settings and long Advanced Q3 are captured separately in [screenshots](../../test-results/guided-practice/phase-0/screenshots/). Inspected Home320, Intermediate table320, Results1366 and Advanced narrative390 images: reading layout and contained table overflow are visible, with no page-wide horizontal overflow in assertions. Other captured images are retained evidence, not claimed as individually inspected. Synthetic body32px capture confirms CSS text enlargement only; it is **not** a native 200% browser-zoom or physical-device pass. Guest smoke used mouse/control automation; full suites contain keyboard/touch cases with their own pass/fail records.

## 6. Existing defects, obsolete expectations and maintenance specification

No failed case has been edited, skipped or silently made green. Findings below distinguish observed results from diagnosis; inherited behavior is not a regression introduced by this audit.

| Finding | Current evidence / classification | Separately required maintenance |
| --- | --- | --- |
| B0-T1: navigation roles and paths | Current header History/Settings are links; many tests use button roles and old “Go to attempt history”/in-page actions. Guest failure sites are enumerated in ledger; account/recovery/analytics also use Settings button roles. **Outdated expectation**, not proof navigation is broken. Production smoke reaches current routes. | Update affected locators and route/focus assertions, preserving active-exam confirmation, Back/Forward, reload and ownership coverage. Wait for committed saves before storage comparisons. |
| B0-T2: removed account heading/features |25 of 26 account failures stop at the old “Your account” heading. Account fixture screenshots show accepted signed-in identity and actual Settings link. Further source expectations still include bulk import, JSON export and old opt-out settings. **Outdated expectation**; downstream backup/isolation behavior is not verified by an early-failing test. | Replace common sign-in completion oracle with current header/session/Settings state. Rewrite removed-feature cases around automatic migration/backup, report-only PDF and trusted copies; retain cancellation/timeout/ownership/privacy cases. Do not reintroduce removed features to satisfy tests. |
| B0-T3: auth during Exam | Account case line 366 expects signup over active Exam; current specification explicitly hides auth controls during Exam. **Outdated requirement**. | Assert status-only Exam/Review/Submit, preserved session/recovery context and controls restored after existing leave/submit flow. |
| B0-T4: source drawer by difficulty | Existing difficulty/course cases retain per-level headings/toggles, but current drawer is shared. **Outdated expectation**. | Verify one shared deduplicated course list and independent exam-bank loading/retry; retain drawer focus/scroll/error coverage. |
| B0-T5: analytics waits/routes | Initial full run 4 failures; focused cases 0/2; longer-wait diagnostic advances to a later unpolled Results-pageview assertion and an obsolete second-Start-pageview expectation after reload. Current router restores Results. Synthetic probe confirms initial event transport eventually occurs. **Observed synchronization/delivery-timing and outdated-route failures**, not a confirmed universal app analytics defect. Two other initial failures use obsolete Settings button oracle. | Diagnose SDK batching/initialization with timestamps; await emitted events and assert current virtual route restoration. Preserve allowlist/privacy/identity/exact-once assertions. No live project sends. Establish a current clean suite before claiming analytics regression health. |
| B0-T6: recovery timing/roles | Initial Cancel/reload fails first dialog visibility; unchanged focused run passes1/1. Two other failures use obsolete Settings button. Router warning about POP to a non-router-created entry appears during callback cleanup. **Timing flake plus old roles**; warning is observed, concrete navigation failure not established. | Maintain role expectations; rerun recovery lifecycle serially and diagnose callback/history warning without changing auth safeguards. No new actual email/reset verification. |
| B0-A1: index-only recovery misses orphan records | In-memory existing-function diagnostics show live valid record with missing/empty index is recoverable by ID yet listAttempts returns[] and no error. Current App will not monitor that record for expiry. **Confirmed existing storage limitation and proposed-guard design gap**. | See §7: future read-only union scan; any Mock index repair/recovery UX requires its own approval. Do not silently index, submit or delete orphans in Guided code. |
| B0-A2: expired save failure | Existing submitStoredAttempt on a valid expired fixture with write failure returns error and preserves bytes. Requiring status submitted to unlock standalone can block indefinitely despite elapsed deadline. **Confirmed fault behavior; avoidable proposed policy trap**, not a grading defect. | Approve distinction between live-Mock protection and submitted-report eligibility; no forced Mock write merely to use standalone learning. |
| B0-A3: deletion request has no application timeout | Current accountRepository.invoke supplies no timeout/abort and deletion UI disables dismissal while pending; matches earlier recorded issue. **Pre-existing source finding**, hung live deletion not exercised. | Separate bounded deletion/reconciliation task if owner wants it; not a Guided refactor or proof deletion fails normally. Synthetic account suite currently cannot verify all deletion flows due old heading. |
| B0-H1: audit launcher/teardown | Windows preload URL startup failure corrected only in evidence launcher; some Playwright-owned server teardown stalls require targeted listener stop. **Audit environment**, not app defect. | Retain failure/intervention logs; future baseline harness should manage known servers explicitly and capture teardown separately. |

All 43 guest failures were reviewed against their earliest assertion and current source/spec:17 old navigation button roles;21 assumptions that reload/post-expiry returns Home with Resume/Open report/history controls;1 old native Back-warning expectation where the router now uses its SPA blocker;1 level-specific drawer expectation;2 expectations that the Intermediate Exam header displays the frozen Easy title;1 bank-failure fixture that blocks only Advanced although Intermediate can still supply shared courses. These classifications are retained per case in [browser-case-disposition.json](../../test-results/guided-practice/phase-0/browser-case-disposition.json). They identify maintenance scope, not passes for the remaining assertions. The 92 passing cases include current bank loading, difficulty preparation, many expiry/concurrency checks, long narrative/table layouts, Results and PDF tests; see the ledger for exact membership.

Current source/PDF/bank behavior passing one smoke or unit suite does not prove unreachable portions of failed browser tests passed. No new reproducible grading, score mutation or premature-answer defect was confirmed in exercised current workflows. Genuine application defects hidden behind obsolete test setup remain possible and require maintained tests; this audit does not assert their absence.

## 7. Architecture review: recommended versus unresolved

These are **recommendations for owner approval**, not approved design amendments. Existing planning documents were left unchanged except the execution checklist's truthful Phase 0 record.

| Decision | Audit recommendation / reason | Status / deadline |
| --- | --- | --- |
| D1 dedicated IDB | Keep separate `pcao-f-guided` store using installed idb and frozen selected subsets. Existing localStorage full-bank records already face quota pressure; IDB transactions avoid new record/index rollback logic. No dependency/backend needed. | Ready for approval before Phase 1 contract freeze. |
| D2 source fingerprints | Keep q1 fixed tuple over validated frozen data, explicit source identity, ordered options/explanations/sources and version. Preserve raw-file hash separately; no current-bank substitution, no reportHash reuse as q1. Independent vectors remain future Phase 1 work. | Ready for approval; no hash function implemented here. |
| D3 additive routing | Keep mounted App/router; add guided children and UUID session pointer only. No second router/view coordinator or Mock URL migration. | Ready for approval; hosting edits deferred to approved implementation. |
| D4 content/versioning | Keep independent immutable overlays, strict schemas, editorial ledger, per-entry approved digests and frozen old sessions. Publication/revocation needs explicit editorial decisions. | Ready in principle; reviewer identities/source access required before Phase 2. |
| D5 simplify publication | Keep q1 source identity plus approved entry digest/version catalog as mandatory core. Release digest can be a transport/artifact check, not a separate authority/workflow framework. Use one small canonicalizer and explicit checked-in release files/tests; no plugin, signing service, generic registry or migration engine. | Approve before Phase 1; retaining the current three domain-separated digests is also acceptable if kept as small functions. |
| D6 lock scope | Existing lock helper accepts a callback returning a Promise at runtime; no behavior rewrite is necessary. Open/validate IDB and hash outside the shared Mock lock; acquire only for fresh protection/access read plus short revision-checked transaction. Never hold Mock lock while DB opening is blocked or while fetching. | Ready clarification; transaction-abort/uncertain-outcome tests required in Phase 4. |
| D7 active record inventory | `listAttempts()` alone is insufficient. Add a later guided-only read adapter that enumerates exact `pcao-f:attempt:v1:` keys and unions them with indexed IDs, deduplicates, then validates under the shared lock. Keep ownership markers distinct. Do not modify existing Mock serialization/index semantics. | **Required amendment before Phase 1 guard contract.** Audit diagnosed only; no implementation. |
| D8 valid expired records | Recommended: a fully validated expired record no longer blocks **standalone** guidance because no exam time remains; App finalization can proceed through its existing flow. Post-exam Guided Review still requires a validated submitted report. Never reveal report feedback from an unfinished record or force-save it merely for Guided entry. This removes expired-orphan/quota deadlock without permitting guidance during a live exam. | **Owner decision required**; differs from plan's conservative “must finalize first” rule. |
| D9 corrupt/unreadable storage | Fail closed when a record's active state cannot be established; provide Retry and generic storage guidance, not a permanent spinner. Missing referenced record alone is not an active attempt; a valid unindexed live record is. Inaccessible owner's valid live attempt blocks until its actual deadline or submission, revealing no identity. Corrupt records need an explicit, separately approved local recovery/quarantine/restore policy; no guessing deadlines or automatic deletion. | **Unresolved release blocker.** Define typed unknown/recoverable states in Phase 1; approve an ownership-safe recovery workflow before student release. A failed index parse with enumerable valid keys should be reported separately from unknown unreadable records. |
| D10 private sources | Retain owner binding/epochs and clear private derived content on signout/source deletion; no original answers/tokens in guided records. Standalone progress never enters signup migration/cloud queue. Use existing validated local/trusted/cloud source access, not a new guided account API. | Ready principle; confirm cleanup/persistence disclosure before Phase 4. |
| D11 telemetry | Keep current optional analytics intact; explicitly suspend context while Guided is active. Extend typed view compatibility minimally; do not add learning telemetry or let Guided inherit Exam active time. | Ready principle; current analytics baseline maintenance remains needed. |
| D12 practice sets/revocation | Numbered 5/10 sets make all 10/60 reachable. Current proposal disables incomplete trailing sets; revoking one of ten leaves four still-valid items unreachable in a five-item partition. Choose an explicitly labelled shorter remaining set or withhold the affected release until replacement approvals; never silently shrink/fallback or include revoked guidance. | Confirm policy by Phase 2/3, before pilot publication. No adaptive scheduling needed. |
| D13 educational review | Source/key/explanation consistency, semantic non-leakage and independent editorial approval are hard requirements. Ten-item ledger is practical if author/reviewer/source access exist; all 60 production records require item-level review, not sampling. | Reviewer/source access not yet established; content phase blocker, not invented approval. |
| D14 learner pilot | Three learners/five questions with a 2/3×4/5 threshold is an unvalidated planning suggestion, not a proven learning metric. Recommend formative think-aloud usability evidence with an owner-approved protocol; record exposure/hint use/interpretation. Agree recruitment/consent, participants, criteria and acceptable alternative before Phase 6; no statistical efficacy/mastery claim. | **Owner confirmation needed before Phase 6**, not a reason to fabricate pilot data or block foundation over unavailable participants today. |

### Guard recovery decision table (proposed amendment)

| Observed local state | Recommended access | Recovery without implicit Mock edits |
| --- | --- | --- |
| Valid indexed or orphaned in-progress record, now<deadline | Block Guided everywhere; Resume only if accessible | Wait for real deadline, resume/submit through existing Mock flow; no foreign-owner details. |
| Valid expired in-progress record | Standalone may open after a fresh under-lock check if D8 approved; report-based review unavailable | Existing App finalization/retry preserves original answers/report; Guided makes no save call. |
| Valid submitted records only | Allow compatible Guided sessions | Use frozen report identity for post-exam cohorts. |
| Dangling index ID with no record | No active record to protect; warn about stale index | Do not rewrite index as part of Guided. Reconcile only in approved maintenance. |
| Index malformed but key enumeration succeeds | Scan raw records; report index problem separately | Unknown/unreadable record still blocks; owner must approve whether known-valid inventory permits standalone before index repair. |
| Corrupt record or storage read/enumeration denied | Block instructional rendering, actionable error/retry | Ownership-safe explicit recovery policy required; do not silently discard data, trust a guessed expiry, or offer a cheating bypass. |
| Owner marker with no attempt | Marker alone is not a running exam | Preserve marker; no session/report resurrection. |

A browser-local guard protects ordinary examination experience, not deliberate developer-tools manipulation, a different browser/origin, or already seen answers. Cross-tab removal of visible guidance is event/poll dependent; the write/reveal commands share a lock, but there is no promise of instantaneous secrecy. Hidden tabs must recheck before re-rendering. Do not expand this into an anti-cheating security system or backend.

## 8. Risks, dependencies and separate work

Existing risk register remains applicable. R1 is addressed by exact source capture; R2/R3 are now backed by current failed/partial browser evidence; R4/R5/R6 require Phase 1 tests; R9 is still editorial capacity; R13/R14/R16 require IDB/fault/concurrency validation; R15/R17 require source-owner/frozen-report checks; R19/R24 prohibit premature release/progression. New audit-specific decisions D7–D9 and D12 must be reflected in implementation contracts once approved.

Separately request **baseline-test maintenance only**: current link/heading/feature expectations, account shared sign-in helper, status-only Exam auth, shared course drawer, committed-save waits and analytics event synchronization. Preserve negative safety tests and user-visible product behavior. Re-run all maintained suites afterward; no app patch is preauthorized by that recommendation. Diagnose any remaining concrete application defect separately before changing source.

The deletion timeout issue is a separate application task, not essential architectural preparation for Guided. A corrupt/orphaned-storage recovery UI or Mock index repair also changes Mock-facing behavior/data and requires an explicit scope/design approval; it was neither implemented nor authorized by this audit. Phase 1 can only proceed under an owner-accepted contract for unresolved guard/recovery policy and the master plan's baseline-maintenance prerequisites.

Phase 1 dependencies: owner accepts this audit, approves D1–D11 decisions/amendments applicable to domain contracts, dispositions baseline-browser failures and authorizes necessary test maintenance, then explicitly authorizes Phase 1. D12 must be settled before pilot UI/publication; D13 before Phase 2 content, D14 before Phase 6 learner recruitment. No reviewer, participant, source verification, deployment or risk acceptance has been invented.

## 9. Unverified behavior and limits

NOT RUN: hosted production/app smoke, actual Supabase account/email/password/report changes, real PostHog ingestion, SMTP delivery, deployments, other browser engines, physical touch, native 200% zoom, formal screen-reader/independent accessibility audit, natural two-hour wall-clock expiry, new Guided functionality and educational learner/source-review validation. These require later approved environments/fixtures or external-operation authorization. Synthetic sessions and clock-driven existing tests cannot establish their live equivalents.

No Guided code exists to verify actual q1/g1/r1 compatibility, IDB schema, active guard, hint leakage, locking or storage migration. Phase 0 verifies current application baselines and feasibility only. Existing failed tests leave downstream areas unverified; table§6 identifies the earliest obsolete assertion rather than claiming later assertions passed. An internal diagnostic using extended waits does not constitute accepted maintenance or a current clean suite.

## 10. Objective Phase 0 acceptance and handoff

| Criterion | Status | Evidence / next decision |
| --- | --- | --- |
| Applicable instructions and six product/planning references read | Complete | §2 and exact captured files |
| Reproducible dirty-tree/source/dependency identity recorded | Complete |373-file manifest, source snapshot, patch, Git index/status, environment |
| Current typecheck/unit/build executed without live services | PASS |214/214 unit; command/log ledger |
| Existing browser commands run and failures/reruns separated | Complete audit; suites FAIL | Guest 92/135, account 5/31, analytics 2/6, recovery 4/7; focused/diagnostics separate |
| Original banks/content reference and built bank identities preserved | PASS | Before/after/built manifests |
| Current Mock/legacy/snapshot/PDF and responsive baseline captured | Complete within stated scope |24-assertion preview smoke, fixtures, screenshots, PDF; §9 limits |
| Integration boundaries/reuse and architecture complexity assessed | Complete review; approval pending |§5/§7 D1–D14 |
| Orphan/private/corrupt/expired protection risks explicitly evaluated | Complete review; decisions unresolved |10-case storage diagnostic and recovery decision table |
| All observed failures dispositioned without repair or invented passes | Complete |§6, earliest-assertion disposition and remaining timing uncertainties |
| Original source/tests/config/private environment/index unchanged | PASS, with authorized checklist update only |Final preservation record,373-file initial archive; no app/test/bank/config changes |
| Baseline is clean enough to claim current full regression pass | **NO** |Browser maintenance and timing investigation outstanding |
| Owner accepts architecture and Phase 0 exit | **PENDING — not preapproved** |Explicit owner decision required |
| Phase 1 implementation authorization | **NOT GIVEN** |Separate explicit approval after prerequisites/dispositions |

Stop after the audit. Recommended next approval is the scoped baseline-test maintenance and architecture decisions above; do not start Phase 1 automatically. A subsequent Phase 1 instruction must explicitly accept this audit/remaining risk dispositions and the chosen protection contract. Any production deployment remains separately authorized.

Final service cleanup: audit-owned ports 4173/4188/4232/4234/4236/4299 have no remaining listeners, recorded in [final-port-check.json](../../test-results/guided-practice/phase-0/final-port-check.json). All temporary browser contexts were closed. See [preservation-after.json](../../test-results/guided-practice/phase-0/preservation-after.json) for source/index/private-env comparison and [content-integrity.json](../../test-results/guided-practice/phase-0/content-integrity.json) for built/source bank identities. Audit helper scripts, generated outputs and the archive are confined to the ignored evidence directory; only this report and the execution checklist change the non-ignored documentation tree.
