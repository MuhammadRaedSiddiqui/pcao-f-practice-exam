# Guided Mode — protected Vercel Preview deployment

19 October 2026, Asia/Karachi. **Feature branch pushed; automatic protected Preview Ready; core hosted journeys verified. Mandatory hosted verification remains incomplete** for the explicit gaps below. Phase 7 remains COMPLETE / OWNER ACCEPTED; Production enablement and Phase 8 remain outside this authorization.

## Authorization and release identity

The owner authorizes committing and pushing only `feature/guided-mode-vercel-preview` to `MuhammadRaedSiddiqui/pcao-f-practice-exam` for automatic protected Preview deployment. The owner separately approved guest-only Preview service policy in this chat. No Production branch push, merge, force-push, Production deployment or service change is authorized.

Accepted candidate: `118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba`. Original educational decisions, waiver history, approval/review/source bindings and validation algorithms remain unchanged.

| Immutable input | SHA-256 |
| --- | --- |
| Ten-guide 1.0.0 | `e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8` |
| Sixty-guide 1.1.0 | `100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67` |
| Two-row catalog | `a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8` |
| Accepted candidate manifest | `4e3b59ea6214a53b998429cb4e5d6bc76cb20ce75bda2be44725f900324b73e3` |

Fresh read-only verification matches all four hashes and exact catalog order: historical 1.0.0/10 first, current 1.1.0/60 last. The preceding packaging manifest is retained unchanged as historical preflight, not relabeled as this branch's final release manifest.

## Git, Vercel and access audit

Original checkout remains on `main` at `8820340ea82920e6e512d0938b6f754c8f4e7916`, with its existing dirty worktree preserved. Read-only `git ls-remote --heads origin` found only `main` at that SHA; the feature branch did not exist. A separate worktree under `.localtest/guided-vercel-preview-worktree` now holds the new feature branch. No existing branch was reset, overwritten or force-pushed.

Authenticated Vercel API and built-in browser confirm project `prj_xORMQWCLTT939SudblG9TjeIGJqL`, `muhammad-raeds-projects/pcao-f-practice-exam`, connected to the exact GitHub repository. Actual production branch is `main`; Git deployment creation is enabled, with no ignored-build command or custom branch environments observed. System environment variables are exposed. Project framework is Vite; checked-in `vercel.json` supplies install/build/output settings.

Production at audit: Ready deployment `dpl_5K9V9V8HiRyciEuUyAU7oWYbvFpj`, commit `8820340ea82920e6e512d0938b6f754c8f4e7916`, official alias `https://pcao-f-practice-exam-one.vercel.app`.

Existing Vercel Authentication has Require Log In enabled and Standard Protection selected (`all_except_custom_domains` in API). The protection page lists no domain exceptions and no automation-bypass secret. No protection setting was changed. The owner signed into the built-in browser for authenticated testing; no credentials were extracted or copied.

## Service policy and build isolation

Preview environment listing is empty. Production lists account/Supabase and analytics variables scoped only to Production. Values were not pulled, decrypted or printed; no Production environment classifier was executed.

The approved [Preview policy](../../release/guided/preview-service-policy.json) disables accounts, password recovery and analytics, supplies no external service endpoints/keys, and permits only synthetic browser-local sessions. The build selects guidance only for the exact feature branch in this project's Preview environment. It rejects this branch if classified as Production, rejects conflicting remote service values, and applies the approved non-secret policy from tracked source. Preview compilation ignores local env files and explicitly compiles disabled service flags and empty service endpoints/keys. This uses existing feature/service mechanisms; the loopback-only local build guard remains intact.

Other branches and normal Production builds keep ordinary Vite configuration, the empty production catalog and disabled Guided availability. Production service settings remain unchanged. Only the two immutable guidance JSON files are emitted; staging catalog, authoring documents and candidate/review metadata are not public assets.

Vercel rejected an attempted branch-scoped non-secret origin variable with `branch_not_found` because the branch did not yet exist remotely. No variable was created. The final approach versions the approved policy with the branch so no preliminary hosting push or project-wide Preview variable change is required.

## Scope and reproducibility

Unrelated uncommitted automatic-account-backup behavior is excluded. Original committed preferences, account UI and signed-in attempt binding remain intact; only the Guided read-only source port and optional request cancellation are added to the relevant account modules. Original checkout screenshots and other dirty files are untouched. Exact checkout line-ending rules preserve approval/source bytes across platforms without committing unrelated line-ending-only changes.

The source commit contains 272 explicitly reviewed files, including the preceding uncommitted Guided phases: runtime under `src/domain/guided`, `src/hooks/useGuidedPractice.ts`, `src/ui/guided`, App/Results wiring, the narrow account source port, immutable `guided-release` inputs, `build/` and `scripts/` release tooling, `release/guided` manifests/policy, Vite/Vercel configuration, checkout byte rules, tests and phase/release documentation. The [exact committed file inventory and diff](https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/commit/2acad5c5346d82a1cc2562331cf9fed653cf6093) is authoritative; excluded local `staged-audit.json` records the tree `f9ef9cf7e0a069a665abd82058a0ca27bc8b628c`. All 76 manifest source inputs match their pinned bytes. The staged path/credential-pattern scan has zero findings; it does not prove absence of every possible unknown credential.

Local env files, credentials, personal profiles/storage, `ngrok.exe`, node_modules, ZIPs, raw logs/screenshots and historical generated evidence stay excluded. Historical unit-preservation checks require supplemental excluded local archives; this is distinct from the release build, which succeeded from clean Git source without those archives. `git diff --check` reports retained historical Markdown hard-break/trailing-space and mixed-ending lines; those exact preservation-bound bytes were not normalized to suppress warnings. Unstaged checkout-only CRLF refreshes in package-lock/test configuration are not application edits or additional committed changes.

## Executed checks and failures

Original checkout: fresh TypeScript pass and 19/19 existing packaging units. These precede the isolated branch changes and are not final-branch acceptance. Prior reported 851/851 units and 12/12 browser checks remain historical preflight evidence.

Isolated worktree: locked `npm ci` completed successfully, adding 215 packages. TypeScript passes. Full final units pass **864/864 in 46 files**, one worker and zero retries. Clean exported staged Git source installed locked dependencies offline and built both enabled Preview and ordinary disabled Production output. All four immutable input hashes survived the clean checkout. Six deliberate invalid builds reject missing/corrupt catalog, missing/corrupt current asset, feature branch classified as Production, and wrong project. Static bundle scans found no test endpoints, authoring evidence or high-confidence secret markers. The new release manifest records source and bundle SHA-256 identities.

Sequential browser runs, all one worker and zero retries: **21/21** actual clean-build Guided journeys, **12/12** local packaging HTTP checks, **72/72** Guided regression, **7/7** D12 and **139/139** original guest Mock/Results/PDF regression: **251/251**. Local HTTP emulation does not establish actual hosted Vercel headers. Original-worktree preservation matches **971/971** baseline files including **251** historical screenshots. Raw results remain excluded under `test-results/guided-vercel-preview-20261019-01` and the isolated worktree's test-results directories.

Initial unit runs retain five preservation failures (858/863), then one unrelated automatic-backup UI expectation failure (863/864). Checkout bytes were restored to the pinned baseline, and the branch-specific account test now checks the original committed two-checkbox preference UI. The unrelated automatic-backup change stays excluded. The final source passes 864/864. A first browser setup ran zero tests because port 4263 was already occupied; dedicated ports 4408–4410 then passed without terminating the existing server. No runtime assertion, response budget or deadline was weakened.

Preparation failures are retained under the new excluded `test-results/guided-vercel-preview-20261019-01` directory in the original checkout. An initial integrity comparison compared upload-substituted `vercel.json`/`.vercelignore` against ordinary root versions, producing two expected differences; this was not educational drift. A temporary preparation command emptied the isolated package file during installation, causing npm EJSONPARSE; the file was reconstructed from reviewed source and a new installation succeeded. Original failed logs remain intact. Initial broad byte-preservation attributes caused CRLF-only diffs; explicit checkout-ending rules replace those broad rules. No runtime assertion or deadline was weakened.

## Deployment, hosted QA and rollback

Source commit: **`2acad5c5346d82a1cc2562331cf9fed653cf6093`**, `feat(guided): integrate approved guided mode for Vercel preview`.

Remote branch: [feature/guided-mode-vercel-preview](https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/tree/feature/guided-mode-vercel-preview). Only `HEAD:refs/heads/feature/guided-mode-vercel-preview` was pushed, normally, without force. No PR or merge was created.

Observed automatic Git deployment: **`dpl_PMTayBa6hfU8Mkqy4KEWDFtBYTGt`**, source `git`, expected project/branch/full SHA, **READY**. API target is null (non-Production Preview), while existing main deployments explicitly show target `production`. Build logs independently identify the feature branch, `npm ci`, `npm run build`, `Vercel build policy: guided-preview` and `dist` output. Linux installed 219 platform-specific packages, audited 220 with zero reported vulnerabilities; Windows installed 215. Existing chunk-size/dynamic-import and npm install-script warnings remain in the log. There was no failed remote build or Production settings correction.

Immutable deployment URL: [initial Preview](https://pcao-f-practice-exam-qxl1bd9a1-muhammad-raeds-projects.vercel.app). Stable branch alias used for synthetic QA: [protected Guided Preview](https://pcao-f-practice-exam-git-feature-e3fbe4-muhammad-raeds-projects.vercel.app/guided). Anonymous HTTP to the immutable deployment returns **302 to Vercel SSO**, `Cache-Control: no-store`, and `X-Robots-Tag: noindex`; authenticated built-in browser access succeeds. No bypass secret or access exception was created. The installed `vercel curl` implementation can create a project-wide bypass token, so it was not used. A read-only deployment-file-tree API request returned 404; that does not mean the hosted immutable files are absent.

### Actual built-in-browser results

| Check | Observed result |
| --- | --- |
| Root, direct `/guided`, reload and session deep link | App loads; sixty approved questions available; five-question saved commitment survives deep-route reload |
| Five-question Set 1 | Completed all five; progressive Hint 1/2/3; single and two-response items; saved/locked feedback; completed read-only review; no feedback before Check |
| Ten-question Set 3 | Completed all ten; one/two/three-response items and tables; two selections disable Check for a three-response item; exactly three enable it and disable extra choices |
| Keyboard and focus | Space selects; Enter commits; focus moves to saved-feedback heading and then to completion heading |
| Current release selection | New Set 1 includes Q1 and all twelve five-question sets are offered, consistent with the sixty-entry 1.1.0 selection rather than the ten-entry historical set |
| Responsive artifacts | Q21/Q26 tables and Q47 fenced tree rendered; 375×812 and 1280×900 checks show no page-width overflow (document widths 360 and 1265 respectively); viewport reset afterward |
| Invalid session | Invalid address displays session-unavailable recovery; a valid absent UUID displays safe Retry/return recovery with no unsaved hint or feedback |
| Hosted immutable JSON | Authenticated browser displays real JSON PRE documents. Hash of exact UTF-8 PRE text matches **both approved asset SHA-256 values** above: current 256,992 bytes/60 questions and historical 38,698 bytes/10 questions. Both documents report content type `application/json`. These are hosted document-text hashes, not a captured raw-response/header trace |
| Missing immutable asset | `/guided/deliberately-missing.json` displays Vercel **404 NOT_FOUND**, rather than the app shell |
| Excluded paths | `/tests/guided-browser/`, `/guided/catalog.json` and `/release/guided/vercel-preview-release-manifest.json` each show Vercel **404 NOT_FOUND** |
| Original Mock | Synthetic Intermediate timed attempt starts, accepts an answer, shows no hints; another same-origin tab is blocked from Guided while Mock is active; submission releases that block |
| Original Results / Guided Review | Mock remains 17/1000, 1 correct and 59 unanswered. Active-page Guided Review reports 59 eligible/59 matched/0 unavailable; creates a fresh 59-item retry with zero commitments; return restores the unchanged original results |
| Services | Account controls absent; compiled guest-only service policy selected by actual remote build. No real account, email, analytics or cloud data was used |
| PDF | Hosted PDF module finishes loading and Export control enables. Click attempted with documented download observation; tool stalled/reset without returning a file path. **Actual completed hosted PDF download remains unverified** |

Saved synthetic session IDs: five `b1f74b2a-f9bd-4cf5-bca2-c507f8ebd636`; ten `5362223a-3d1b-4da2-a873-51f7d8ca06de`; tree `4f931d5a-baa2-45b3-a6cb-29e30c4df259`; post-exam retry `df953428-daa4-445c-a572-a3ec55810abf`. All were created by UI on the Preview origin. No local browser storage was imported across origins.

Built-in browser evidence and six initial screenshots are under excluded `test-results/guided-vercel-preview-20261019-01/`: `hosted-saved-feedback.png`, `hosted-completed-review.png`, `hosted-table.png`, `hosted-mobile-tree.png`, `hosted-desktop-tree.png`, `hosted-mock-block.png`, plus later retry capture and the two hosted JSON check records. Browser tool transcripts retain exact actions and observations. Some immediate screenshot/AX captures show transient rendering; settled text observations above are separate evidence. `preview-first-metadata.json`, `vercel-build-first.log` and `production-after-first-preview.json` preserve sanitized platform results. The report does not manufacture a numerical hosted test-suite pass count from interactive checks.

### Failures, limitations and remaining mandatory hosted work

The first native-select Playwright operation timed out; native `setValue` selected the displayed option successfully. An attempt to select a fourth checkbox was correctly rejected because it was disabled. A repeated-action helper initially parsed an accessibility diff instead of a full state and stopped without mutation; subsequent reads use full state. Native same-tab navigation during an active Mock was aborted; a new same-origin tab demonstrated blocking without discarding the timed attempt. In a background page, Guided Review rejected access after visibility invalidation; an active visible page passed the same source check and created the fresh retry. No visibility guard was bypassed or weakened.

The documented download observer stalled for approximately 767 seconds despite its configured 60-second wait, then reset the browser tool. A later bounded observer also timed out/reset. Browser state recovered without app/storage changes, but no completed PDF artifact was obtained. This is an unresolved observation/tool limitation, not proof of successful PDF export or a diagnosed application defect. Local 139/139 guest regression includes PDF checks and remains separate evidence.

**Do not mark the complete requested hosted matrix passed.** Remaining mandatory items are: captured actual HTTP 200/cache headers for both JSON paths; controlled hosted old 1.0.0 frozen-session reader/resume and no-migration replay; controlled missing/revoked-content saved-session rejection; actual failed durable-write/no-feedback behavior on host; and completed actual hosted PDF download. Signed-in ownership behavior would require a separately approved synthetic-service policy because accounts are intentionally disabled here. No actual-host compatible rollback rehearsal was selected or performed. Current/historical asset bytes are verified on host, but this alone does not execute the historical reader. These controlled cases passed locally where specified by the 251 browser checks; they are not relabeled hosted. The built-in browser exposes DOM reads but no authenticated response/header capture or controlled IndexedDB-fixture operation. No fixture API or storage-injection escape hatch was published to obtain the missing results.

Production identity was re-read after hosted QA and remains `dpl_5K9V9V8HiRyciEuUyAU7oWYbvFpj` at `8820340ea82920e6e512d0938b6f754c8f4e7916`, branch `main`, with the same protection policy. No new Production deployment was observed.

A final documentation-only commit on this same branch records these results. Its resulting automatic Preview must be checked against that final SHA. The final local delivery copy may append the observed final SHA/deployment identity after that check, avoiding a self-referential commit/deployment loop.

Compatible rollback requires the same compatible reader, both exact maps/assets and banks. Empty catalog/feature-off blocks saved-session resume and is suspension, not seamless rollback. No actual hosted rollback is claimed yet.

R1–R4 remain open: aggregate unit timing, historical PDF cancellation, recovery intermittency and resource-pressure/Set 1 timing. New sequential passes cannot prove causal resolution or equivalent-load production stability. Native Windows screen readers, physical devices and non-Chromium engines remain unexecuted. Separate production risk/support/rollback and publication decisions remain required.
