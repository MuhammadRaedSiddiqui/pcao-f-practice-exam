# Guided Mode — protected Vercel Preview deployment

19 October 2026, Asia/Karachi. **In progress; not yet pushed or deployed.** This report will record actual results before completion. Phase 7 remains COMPLETE / OWNER ACCEPTED; Production enablement and Phase 8 remain outside this authorization.

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

Necessary source, pinned release inputs, build configuration, tests and documentation will be explicitly staged and reviewed. Local env files, credentials, personal profiles/storage, `ngrok.exe`, node_modules, ZIPs, raw logs/screenshots and historical generated evidence stay excluded. Historical unit-preservation checks require supplemental excluded local archives; this is distinct from the release build, which must succeed from clean Git source without those archives.

## Executed checks and failures

Original checkout: fresh TypeScript pass and 19/19 existing packaging units. These precede the isolated branch changes and are not final-branch acceptance. Prior reported 851/851 units and 12/12 browser checks remain historical preflight evidence.

Isolated worktree: locked `npm ci` completed successfully, adding 215 packages. TypeScript passes. Full final units pass **864/864 in 46 files**, one worker and zero retries. Clean exported staged Git source installed locked dependencies offline and built both enabled Preview and ordinary disabled Production output. All four immutable input hashes survived the clean checkout. Six deliberate invalid builds reject missing/corrupt catalog, missing/corrupt current asset, feature branch classified as Production, and wrong project. Static bundle scans found no test endpoints, authoring evidence or high-confidence secret markers. The new release manifest records source and bundle SHA-256 identities.

Sequential browser runs, all one worker and zero retries: **21/21** actual clean-build Guided journeys, **12/12** local packaging HTTP checks, **72/72** Guided regression, **7/7** D12 and **139/139** original guest Mock/Results/PDF regression: **251/251**. Local HTTP emulation does not establish actual hosted Vercel headers. Original-worktree preservation matches **971/971** baseline files including **251** historical screenshots. Raw results remain excluded under `test-results/guided-vercel-preview-20261019-01` and the isolated worktree's test-results directories.

Initial unit runs retain five preservation failures (858/863), then one unrelated automatic-backup UI expectation failure (863/864). Checkout bytes were restored to the pinned baseline, and the branch-specific account test now checks the original committed two-checkbox preference UI. The unrelated automatic-backup change stays excluded. The final source passes 864/864. A first browser setup ran zero tests because port 4263 was already occupied; dedicated ports 4408–4410 then passed without terminating the existing server. No runtime assertion, response budget or deadline was weakened.

Preparation failures are retained under the new excluded `test-results/guided-vercel-preview-20261019-01` directory in the original checkout. An initial integrity comparison compared upload-substituted `vercel.json`/`.vercelignore` against ordinary root versions, producing two expected differences; this was not educational drift. A temporary preparation command emptied the isolated package file during installation, causing npm EJSONPARSE; the file was reconstructed from reviewed source and a new installation succeeded. Original failed logs remain intact. Initial broad byte-preservation attributes caused CRLF-only diffs; explicit checkout-ending rules replace those broad rules. No runtime assertion or deadline was weakened.

## Deployment, hosted QA and rollback

Feature commit SHA, remote branch URL, Preview deployment ID and Preview URL: **pending**. No hosted success is claimed before observation.

Hosted matrix pending: authenticated root/deep routes and reload, assets/status/MIME/cache/hash, missing endpoints, current five/ten-question sessions, single/two/three responses, staged hints, durable locking/feedback, navigation/resume/completion/review, long tables/tree, mobile/desktop keyboard/focus, invalid-session recovery, controlled old/current frozen fixtures and revocation rejection, Mock blocking/isolation, report/PDF preservation, and actual hosted PDF download. No private session storage is transferred across origins.

Compatible rollback requires the same compatible reader, both exact maps/assets and banks. Empty catalog/feature-off blocks saved-session resume and is suspension, not seamless rollback. No actual hosted rollback is claimed yet.

R1–R4 remain open: aggregate unit timing, historical PDF cancellation, recovery intermittency and resource-pressure/Set 1 timing. New sequential passes cannot prove causal resolution or equivalent-load production stability. Native Windows screen readers, physical devices and non-Chromium engines remain unexecuted. Separate production risk/support/rollback and publication decisions remain required.
