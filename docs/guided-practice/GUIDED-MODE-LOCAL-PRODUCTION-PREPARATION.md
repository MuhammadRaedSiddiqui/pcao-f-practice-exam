# Guided Mode — local Production preparation

19 October 2026, Asia/Karachi. Scope: local development, verification and **one local commit only**. No push, PR, merge, deployment, remote environment/service change or Phase 8 is authorized. Phase 7 remains COMPLETE / OWNER ACCEPTED.

Preparation branch: `release/guided-mode-production-prep`. Parent: `ad41043d614486b825178c610084b6e1594c7240` on the verified feature history. The original main checkout and existing feature checkout, including their unrelated dirty files, are preserved. The final commit SHA belongs in the post-commit receipt; this document does not invent a self-referential commit identity.

## Implementation and future build policy

`scripts/build-vercel.mjs` now selects the existing approved Production packager when **all** of these conditions hold: Vercel Production, branch `main`, explicit `VITE_GUIDED_PRACTICE_ENABLED=true`, verified project `prj_xORMQWCLTT939SudblG9TjeIGJqL`, and `GUIDED_RELEASE_ORIGIN=https://pcao-f-practice-exam-one.vercel.app`. Missing/wrong targets and invalid feature-flag values fail closed. The feature Preview branch remains prohibited from Production.

That path sets only `GUIDED_RELEASE_PROFILE=production` before using `vite.guided-production.config.ts`. It compiles the accepted catalog and emits both immutable assets. The existing packager requires explicit valid account and analytics policy, checks configured enabled-service endpoints/keys, and preserves the existing recovery default. No Production account, recovery, analytics or privacy variable is replaced with the guest Preview policy. Existing Vercel routes, immutable cache headers and `npm run build` entry remain unchanged.

An absent/false Production Guided flag retains the ordinary disabled build and empty catalog. The exact feature branch in Preview retains its separately approved guest-only build. Other Preview branches retain their existing ordinary policy. This local code change does **not** set any remote variable or enable the deployed application. Future Production must use its reviewed existing service values; never copy the guest Preview service policy or the synthetic verification values into Production.

No application, account-preference, automatic-backup, Mock, Results, PDF, source-bank, Guided persistence/schema, approval/revocation or session-reader implementation changed. Guided progress remains browser-local. The catalog preserves historical 1.0.0 first and current 1.1.0 last, selecting sixty approved guides for new sessions while retaining ten-guide historical compatibility.

## Accepted content integrity

Candidate: `118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba`.

| Input | SHA-256 |
| --- | --- |
| Historical `intermediate-1.0.0.json` | `e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8` |
| Current `intermediate-1.1.0.json` | `100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67` |
| Approved `catalog.json` | `a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8` |

All three hashes match in the clean source export; both emitted asset versions match. Existing fingerprint, approved-only validation, revocation, compatibility and content-preservation tests are retained. No approved educational content was edited or regenerated. Original Phase 7 acceptance and educational histories remain unchanged.

## Local verification

TypeScript passes. Full units: **874/874 in 47 files**, including ten new Production-policy checks, with an explicit one-worker Vitest invocation. No unit assertion or deadline changed.

Production-enabled, Preview-enabled and Production-disabled builds pass. A clean export of the reviewed Git index reproduces every Production output path and SHA-256 byte for byte. The source export contains no local env files, caches, test evidence or credentials. Dependencies were installed with `npm ci --offline --ignore-scripts --no-audit --no-fund` in the isolated worktree (215 packages); the clean source export reuses that exact locked dependency runtime. This is local clean-source reproducibility, not a fresh hosted installation or verification of actual remote Production environment values.

Seven deliberately invalid builds are rejected: wrong project, wrong origin, missing service policy, invalid enabled-service endpoint, feature Preview classified as Production, corrupt catalog and corrupt current asset. Output inventory permits only the app shell/chunks, unchanged public banks and the two approved versioned assets. Scans reject authoring/test seams and high-confidence credential patterns. Browser service verification uses only public synthetic test values and disposable storage; those compiled test bundles are **verification artifacts**, not an upload package for real Production services.

**218 distinct browser checks pass across the confirmed coverage.** All runs use one worker, zero retries and the existing suite deadlines/assertions. The two earlier missing-fixture failures are retained separately below.

| Browser coverage | Result | Compiled configuration |
| --- | --- | --- |
| Guided release journeys | 21/21 | Clean Production, synthetic services configured |
| Packaging/HTTP/version reader | 10 initial passes plus 2/2 focused confirmation | Clean Production and ordinary disabled safety build |
| Accounts/ownership/settings/backups | 32/32 | Clean Production, synthetic services |
| Password recovery | 8/8 | Same Production build; recovery default retained |
| Analytics/privacy/service failure | 6/6 | Same Production build; synthetic ingestion |
| Original guest Mock/Results/PDF regression | 139/139 | Compiled guest-only Preview build |

No new critical/high application, security, persistence or authorization defect was observed in the exercised scope. Full original guest coverage took 6.5 minutes and exited cleanly. Local HTTP emulation does not establish new actual-host results.

Evidence is excluded under `test-results/production-prep-20261019/`, with release results under `test-results/guided-vercel-preview/production-prep-{normal,packaging,packaging-fallback}/`. The build audit records tested code tree `470d2e6125f94eb48b5ff69772af3ae780dd57a0` and all output hashes. The final staging set adds this report only to that tested tree. Historical manifests remain historical and are not relabeled as manifests for this new code tree.

### Preserved failures and setup limitations

- The initial unit run lacked excluded historical build/acceptance fixtures: 781 passed, five failed and 88 skipped. Fifty original supplemental files were copied into the isolated worktree without changing assertions. An intermediate confirmation was interrupted after detecting that the npm wrapper had dropped the worker argument. Final validation used the direct Vitest entry with an explicit single worker, restored the exact historical build-preservation inputs and passed all 874 tests. New compiled outputs remain separately preserved.
- The initial output scan rejected the literal `sb_secret_` classifier prefix in the bundled Supabase SDK. Inspection established that this was SDK code, not a credential. The corrected scan checks complete token-shaped values; the original failed scan/build log remains preserved.
- Initial packaging browser results were **10/12**: both frozen-version cases successfully resumed, then failed when their local fallback asset path was absent. An exact separately inventoried copy of the new compiled bundle supplied that missing fixture; both affected cases passed unchanged in a focused **2/2** confirmation. This local identical-bundle replay is not a distinct hosted rollback rehearsal. Existing evidence was not overwritten and no assertion/deadline changed.
- Existing Vite chunk-size and ineffective dynamic-import warnings remain. No attempt was made to conceal them or refactor unrelated runtime code.

## Included and excluded files

Exactly six files belong to the reviewed staging set:

- `scripts/build-vercel.mjs`
- `tests/guidedVercelProduction.test.ts`
- `tests/production-guided/production-prep.mjs`
- `tests/production-guided/services-setup.ts`
- `tests/production-guided/services.config.ts`
- `docs/guided-practice/GUIDED-MODE-LOCAL-PRODUCTION-PREPARATION.md`

Existing account/Mock runtime files, approved content, dependencies/lock, root Vite/Vercel configuration, historical reports/screenshots and unrelated automatic-backup modifications are excluded from the commit. No `.env` file, secret, generated build, cache, raw log or browser profile is staged. Staged diff whitespace and high-confidence credential/path scans pass.

Preservation audit: **639/639** captured original-checkout files and **588/588** existing feature-checkout files remain byte-identical. Both checkouts retain their original HEAD and exact dirty Git status. No screenshot or historical report was replaced. The preparation worktree contains only the intended tracked changes; generated verification files remain excluded.

## Remaining release obligations

Local build preparation is ready; this is not final Production release acceptance. R1 aggregate timing, R2 historical PDF cancellation, R3 recovery intermittency and R4 resource-pressure/Set 1 timing remain open. Passing local suites do not establish a root-cause fix or equivalent-load stability.

The original checkout's hosted QA closeout records eleven passing bounded hosted checks, including one actual hosted PDF download. Its controlled Preview rollback report records **NOT VERIFIED** because no meaningfully distinct compatible target was available; no alias switch occurred. Those are prior results, not newly executed work here. Compatible rollback must preserve the reader, both maps/assets and banks; feature-off/empty-catalog fallback is suspension, not continued saved-session access.

Before any future Production push/deployment: obtain the owner's separate instruction, resolve or explicitly disposition rollback and R1–R4, complete or disposition native accessibility/physical-device/other-engine coverage, review actual Production service/environment and recovery/redirect policy, and plan separately authorized actual-origin smoke. No real historical profile migration, real account operation, reset email, manual accessibility acceptance or Production smoke is claimed. None of these outstanding release gates prevents this specifically authorized local preparation commit.

No remote system was modified. Stop after the one local commit and its read-only verification/receipt; no push or deployment follows from this report.
