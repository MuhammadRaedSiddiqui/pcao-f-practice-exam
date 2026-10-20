# Guided Mode — production-packaging implementation report

19 October 2026. **Authorized local packaging/preflight complete. No hosted Preview or production deployment, public feature enablement, commit, push or Phase 8 occurred.** Phase 7 remains COMPLETE / OWNER ACCEPTED. R1–R4, native/device/engine execution, effective remote service policy and hosted acceptance remain outstanding; this is not a production-ready declaration.

The owner confirms **https://pcao-f-practice-exam-one.vercel.app** as the release origin and authorizes preservation of both exact guide histories. Read-only inspection independently verifies Vercel project **`prj_xORMQWCLTT939SudblG9TjeIGJqL`**, `muhammad-raeds-projects/pcao-f-practice-exam`, with official alias pointing to Ready production deployment **`dpl_5K9V9V8HiRyciEuUyAU7oWYbvFpj`**. No checkout/project link or host configuration was changed. [Full hosting findings](GUIDED-MODE-VERCEL-READONLY-FINDINGS.md) distinguish verified metadata from values that could not be read safely.

## Prepared implementation

- New **`vite.guided-production.config.ts`** merges the ordinary app configuration with **`build/guidedProductionRelease.ts`**. It overrides only the Guided flag and pinned compile-time catalog, emits the two exact approved assets, and retains ordinary **production mode/environment loading**. Account, recovery, analytics and privacy code/configuration are not replaced with loopback QA overrides. Existing `vite.config.ts`, `build/guidedLocalRelease.ts`, default empty catalog and ordinary deployment files remain byte-identical.
- **`npm run build:guided:release`** selects explicit local release packaging into **`.localtest/guided-production/enabled/`**. It is a normal production compilation with production service environment policy, independent of the earlier loopback-only `guided-local` build. The wrapper sets production NODE_ENV and rejects a conflicting supplied value. Locally served verification remains bound to loopback by the verification runner.
- **`npm run build:guided:hosted`** is prepared for future Vercel Preview/Production builds only. It requires the corresponding Vercel environment, verified project ID, confirmed origin and explicit valid account/analytics configuration; existing recovery defaults are preserved. It emits `dist` in either hosted profile. This is a build guard, not deployment authorization. Running it here outside the required environment correctly fails before bundling.
- **`release/guided/vercel.json`** is an inactive future configuration: ordinary install/output/SPA routes retained, hosted build command selected, exact JSON MIME and one-year immutable cache headers limited to the two versioned assets. Local production preview mirrors those headers and returns a genuine uncached 404 for unknown guidance JSON. Actual Vercel cache/routing/MIME behavior is still unexecuted.
- **`scripts/prepare-guided-upload.mjs`** assembles an allowlisted source workspace without env files, project links, drafts, tests, screenshots, synthetic accounts or evidence. The selected **`.localtest/guided-production/upload-verified/`** has **74** hashed files and the proposed configuration as root `vercel.json`. It is neither uploaded nor linked. Existing root `.vercelignore` continues excluding staging assets from ordinary uploads.
- **`scripts/create-guided-release-manifest.mjs`** records source revision plus a digest of the actual uncommitted prepared inputs, lock/toolchain, environment policy, every bundle/bank/asset hash, both exact authorization maps, routes/cache/MIME, source/session/privacy/hosting compatibility and fallback/withdrawal procedure. It rejects changed accepted inputs and differing enabled/fallback trees, and refuses to overwrite an existing manifest.

The source revision is **`8820340ea82920e6e512d0938b6f754c8f4e7916`** plus the existing uncommitted worktree; a clean committed release is not invented. Prepared input digest **`cb4c18c72430836a05596f39c6f6b899e3023783d45aab9282c492a61c89b814`** binds the selected source inventory. [Release manifest](../../release/guided/production-release-manifest.json) SHA-256 is **`2465b2b0af1d61091da9c73ee1d57109f5da16e4b2111a3ef40acb4813fd839c`**. Generation log is `manifest-generation-confirmed.json`; original failed generation remains evidence.

## Exact accepted identities

Candidate remains **`118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba`**. Both source rows bind schema 1 / `pcao-f-practice-easy-01` / bank 1.0.0 / Intermediate. The catalog keeps 1.0.0 first and 1.1.0 last, preserving array-order current starts and exact frozen-version authorization.

| File | SHA-256 |
| --- | --- |
| `intermediate-1.0.0.json` — ten guides | `e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8` |
| `intermediate-1.1.0.json` — sixty guides | `100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67` |
| `catalog.json` — both exact maps | `a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8` |
| Original candidate `manifest.json` | `4e3b59ea6214a53b998429cb4e5d6bc76cb20ce75bda2be44725f900324b73e3` |

No accepted educational wording, q1/g1, source/review identity, revocation rule, guide/session schema, reader/persistence/protection contract, bank, Mock grading/timer or Results/PDF code changed. No educational review was repeated. Exact versioned content is never overwritten. A changed binding would stop preparation and require renewed authority.

## Executed verification and corrections

Final **851/851 units**, **TypeScript pass**, corrected disabled/enabled **production builds pass**, and corrected **12/12 browser/HTTP/fallback checks** with one worker and zero retries. A later direct wrapper build matches all nine manifest-enabled file hashes exactly. Full details and initial failures are in [local verification](GUIDED-MODE-PRODUCTION-PREFLIGHT-VERIFICATION.md).

Two development-time type errors in new packaging/QA code were caught and corrected. A more consequential audit mistake was also preserved: calling Vite config resolution before build initialized NODE_ENV to development even with mode production. The first combined audit/browser run therefore was not genuine production-compilation evidence. Standalone builds were correct. Diagnostic reproduced the mismatch; corrected audit explicitly asserts production compilation, wrapper rejects conflicting NODE_ENV, corrected outputs/fallback match and browser 12/12 was rerun to new paths with unchanged assertions/deadlines. Initial wrong-compilation artifacts, screenshots, passing browser results and rejected manifest log remain historical facts. No application workaround or coverage weakening was introduced.

R1 remains open: current full passes do not resolve or accept earlier 837/838 and 834/838 aggregate timing failures. R2–R4 remain carried forward. No equivalent-load, actual-host, native reader/device or real recovery-email result is inferred.

## Selected package and reproduction

The selected compiled output is **`.localtest/guided-production/enabled/`**, ordinary disabled verification output is **`disabled/`**, compatible local fallback is **`rollback-confirmed/`**, and selected source upload workspace is **`upload-verified/`**, all below `.localtest/guided-production/`. Earlier `rollback`, `upload` and `upload-final` are retained intermediate evidence and are not the selected package. The selected fallback preserves both safe maps/assets, source banks and exact matching reader/application files; it is not an existing hosted rollback deployment.

For a future reproduction, use the selected source inventory and dependency lock, a reviewed normal production environment, and `npm ci` followed by the explicit release build command. Local verification used the existing installed toolchain recorded in the manifest; no clean hosted installation has occurred. Do not upload local `.env` files or reuse QA service overrides. Production-specific app bundle hashes must be recorded anew if approved hosted service values differ; approved guidance bytes/maps must remain exact. Output-only manifest verification can compare current files against the enumerated hashes without regenerating any educational input.

Only **two pre-existing files** change: `package.json` adds three packaging commands; `tests/normal-guided/authorized-code-hashes.json` updates only that exact package fingerprint for authorized packaging. Existing operational assertions and all other historical/content pins remain intact, with old bytes preserved in the assessment baseline. All new build scripts/configuration, tests, manifest and reports are separately inventoried in `test-results/guided-production-preflight-20261019-01/work-changes.json` and preservation evidence.

Final preservation verifies **969 of 971 baseline files unchanged**, with exactly those two authorized changes and **zero unexpected changes**. All **20** prior build artifacts remain exact. Application source, accepted educational/approval/Phase 7 history, old screenshots and both earlier evidence directories remain unchanged. The assembled local archive is `.localtest/guided-production/PCAO-F-Guided-production-preflight-20261019.zip`; it contains the selected source/build/fallback package, manifest and these handoff reports. It is not a published asset or deployment.

## Handoff and approval boundary

Read [updated risks and manual matrix](GUIDED-MODE-PRODUCTION-PREFLIGHT-RISKS-AND-DECISIONS.md), [exact hosting-preview plan](GUIDED-MODE-HOSTING-PREVIEW-VERIFICATION-PLAN.md), and [proposed production/fallback procedure](GUIDED-MODE-PRODUCTION-ENABLEMENT-AND-ROLLBACK.md). Preview has no service environment configured; effective production values remain unverified after automatic review rejected an environment-loading read. Request non-secret policy evidence and separately authorized Preview administration/deployment, then return actual Preview/manual/fallback results for an **independent final production decision**. No private user browser storage was inspected, mutated or transferred. Existing deployments and the original 4261 preview remain unchanged.
