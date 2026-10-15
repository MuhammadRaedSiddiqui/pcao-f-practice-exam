# Cloud account history — local implementation and verification

Date: 2026-10-14
State: implemented and verified locally; migration and all three functions are deployed to the linked Supabase project. Hosted HTTP/SDK integration checks pass. Hosted browser signup migration/empty-history checks pass; production frontend rollout, other hosted browser/SMTP verification and operational backup/restore remain pending.

## Authentication fixes — 2026-10-14

Current auth validation/cancellation evidence is in [AUTH_FIXES_VERIFICATION.md](AUTH_FIXES_VERIFICATION.md): 136 unit tests, TypeScript/build, all 31 account Chromium cases and hosted direct/browser checks pass. Migration 202610140002 is applied. Older sections below retain their historical totals.

## Signup migration and header update — 2026-10-14

**Automatic signup migration and header authentication — 2026-10-14:** New email/password signup automatically claims and queues valid, completed guest browser reports without an import prompt. Device report bytes remain unchanged; empty browser history creates no account report rows. Unfinished, private/owned, paused/deleted and unreadable records are excluded. Signup prepares durable ownership/queue bookkeeping before starting synchronization, shows pending jobs immediately, and retries recover after reopening. Sign in/Create account and authentication/recovery dialogs now live in the right side of the shared responsive header on Start, Exam and Results; signed-in report management stays on Start/Results. Verification passes TypeScript, all 97 unit tests across 13 files, production build, all 26 account Chromium cases and 34 focused guest foundation/Start/difficulty cases in separate runs. All six required header layouts, keyboard/focus, 44px targets, touch and overflow pass; mobile/desktop signup-header screenshots were inspected. Two hosted browser checks also pass against the configured Supabase project: real Intermediate-bank report migration with original-byte/hash preservation, and empty signup without report rows. Temporary hosted test accounts were deleted. Source/built bank and approved Markdown hashes remain unchanged. Logs are test-results/signup-migration-{typecheck,unit-tests,build,account-browser,guest-browser}.txt; hosted evidence is test-results/signup-migration-hosted-browser.json and content evidence is test-results/signup-migration-content-integrity.json. Development server runs at http://127.0.0.1:5173. The account-enabled build has a nonblocking main bundle warning (about 776 kB; PDF module about 1,834 kB). This change does not establish a new full guest-suite run, production frontend deployment, SMTP verification or restore rehearsal. No SQL/function changes, commit or push occurred.

The first account run reused a stale Vite server and was interrupted after dependency-cache errors; restarting the confirmed test server resolved that environment failure. A subsequent 25/26 run exposed signup synchronization starting before migration queue preparation. The sequencing/pending-state fix passes the final clean 26/26 account run, including durable retry after reopening. The 34-case guest run is targeted regression coverage, not a new 117-case full-suite result.

Screenshots: screenshots/signup-header-{320,390,768,1366}.png, screenshots/signup-header-844-landscape.png and screenshots/signup-header-390-enlarged.png. Existing account sign-in/history screenshots were refreshed by the final suite.

## Hosted setup and integration — 2026-10-14

**Hosted Supabase setup — 2026-10-14:** The linked project records migration 202610140001, and backup-report, delete-report and delete-account are deployed and ACTIVE with platform JWT verification enabled. ARCHIVE_ALLOWED_ORIGINS permits localhost/127.0.0.1 at ports 5173, 4173 and 4210 for development/preview. All nine hosted CORS/anonymous-request checks and all 15 temporary-account integration checks pass: immediate no-confirmation signup, password login, real Intermediate-bank report backup/hash, idempotency/conflict protection, forged-owner rejection, owner-isolated reads/deletes/preferences, fresh-client snapshot recovery, current-password deletion, tombstones and independent per-owner attempt IDs. Both test accounts were deleted and their tokens rejected; no test accounts were retained. Evidence is test-results/cloud-history-hosted-{bootstrap,integration}.json. Frontend production deployment, production origins/Auth redirects, SMTP recovery, hosted browser/offline/PDF checks and operational backup/restore remain pending. No app code/test-suite rerun, commit or push occurred for this setup; only the three Edge Functions were deployed.

The hosted checks create completed, explicitly temporary attempts from the unchanged real Intermediate bank using the same app model and validation/hash helpers. Tests use separate real Auth sessions and a fresh client, then delete both temporary Auth users through the deployed password-protected function. They do not replace hosted browser interaction, recovery-email delivery, offline reconnection/PDF or backup-restoration checks. Earlier local-test boundaries below remain historical descriptions of those runs.

## Implemented behavior

- Optional Supabase email/password signup/sign-in. No username or OTP flow. Email confirmation must be disabled on the hosted project.
- Immediate signup sessions, optional persistent sign-in, password recovery and current-password account deletion.
- Browser-local active exams retain the shared Web Lock, revisions, frozen snapshots, deadline, answers, flags and submission engine.
- Automatic migration of completed unowned guest history on signup, empty account history when there are no completed reports, opt-in automatic backup for new exams, and explicit import/backup for additional guest reports after existing-account sign-in.
- Shared header authentication on Start, Exam and Results; owner-safe durable queue preparation before signup synchronization.
- Durable account-bound queue/receipt bookkeeping, bounded batches, retry/backoff, pause/resume and reconciliation after reopening.
- Shared browser/server validation, 60-question metadata checks and versioned deterministic hashes. Conflicting reports cannot overwrite saved content.
- Owner-scoped metadata pagination, on-demand frozen report recovery and the existing Results/PDF rendering.
- Account isolation across sign-out, switches, late responses and independent queue/cache eviction.
- Optional trusted-device copies, complete JSON export, verified device-copy removal, tombstone report deletion and account deletion.
- Feature-disabled/missing-configuration guest fallback. No privileged credentials are part of the frontend.

New original attempt payloads and existing storage keys remain unchanged; ownership is a separate sidecar. Cloud-only reports are kept separate from writable local attempt references, including during storage events.

## Verification results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Pass | test-results/cloud-typecheck.txt |
| Vitest | 93 tests across 13 files pass | test-results/cloud-unit-tests.txt |
| Production build | Pass | test-results/cloud-build.txt |
| Deno Edge Function typecheck | All three entry points pass | test-results/cloud-edge-typecheck.txt |
| Full existing Chromium suite | 117 cases pass in one run | test-results/cloud-guest-browser.txt |
| Separate account Chromium suite | All 21 cases pass in one final run | test-results/cloud-account-browser.txt |
| Git diff whitespace check | Pass | git diff --check |
| Runtime and built bank integrity | Both hashes preserved | Values below |

The two browser suites were separate runs, not a single 138-case execution. The full guest suite passed after integration; later refinements were confined to account behavior, test fixtures and deployment/documentation. Typecheck, unit tests, build, Deno and account checks were rerun for those refinements.

The build retains a nonblocking chunk warning: main JavaScript about 559 kB and the separate PDF module about 1,834 kB.

The initial account suite identified a preference checkbox reverting during asynchronous saving. Immediate local feedback plus stale-preference-response protection corrected it; the final offline/autobackup case passes. One later cache test used an ambiguous Attempt history locator and was corrected to the banner action. A final review also separated the server pagination cursor from imported rows; the older-import regression passes. The final 21-case suite is clean.

## Coverage and boundaries

Unit/domain tests cover recovery validation, legacy grade/revision normalization, content changes, metadata/hash/owner mismatch, sidecar immutability, damaged ownership, pause/resume, device deletion/rollback and independent account queue/cache cleanup.

The real SQL migration runs inside embedded PostgreSQL (PGlite), using a minimal Auth schema and anon/authenticated/service roles. Seven cases verify immutable/idempotent writes, content conflicts, owner RLS, anonymous/browser write and RPC denial, owner preferences, scoped tombstone deletion, quotas with idempotent retries, and Auth-user cascades. This is database-engine verification, not a deployed Supabase-stack test or a multi-connection concurrency benchmark.

Seven server-handler tests cover authenticated owner derivation, independent grading/hash calculation, forged envelope fields, invalid origins/methods, malformed/active/inconsistent reports, streamed body limits, scoped deletion/password requirements and bounded error responses. Backend calls are test doubles in these handler tests; hosted Auth/admin services were not exercised.

The account browser suite uses the real Supabase JavaScript SDK with an explicitly synthetic HTTP service in tests. It verifies immediate signup without verification calls, import preserving local bytes, fresh-profile recovery and actual PDF generation, offline completion/reconnection, account isolation, deletion after queue eviction, complete JSON download, verified device removal, cloud Results storage events, current-password account deletion preserving unrelated guest/account data, lost acknowledgements, pause/resume, late upload responses, equal-time pagination, offline saved copies, unavailable current banks, two tabs, touch, auth failures, bounded batch import, older imported-report pagination and responsive layout.

This evidence does not establish hosted Supabase Auth/RLS/gateway/SMTP behavior, actual deployed function calls, remote user creation, plan backup retention or a restore rehearsal.

## Visual evidence

Both sign-in and signed-in history pass 320, 390, 768 and 1366 pixels, mobile landscape and enlarged text. Keyboard opening, Escape and focus restoration, overflow and 44px button targets are checked; a separate touch context signs in and opens a report.

Screenshots:
- screenshots/account-signin-{320,390,768,1366}.png
- screenshots/account-signin-844-landscape.png
- screenshots/account-signin-390-enlarged.png
- screenshots/account-history-{320,390,768,1366}.png
- screenshots/account-history-844-landscape.png
- screenshots/account-history-390-enlarged.png

Mobile/desktop sign-in and history screenshots were visually inspected. Account tests remain Chromium-only; Firefox/WebKit and an independent accessibility audit are not established.

The first browser invocation used Playwright's default shared test-results output and cleared older artifacts. Tracked historical records were restored from Git, and fresh guest screenshots were retained in test-results/cloud-guest-screenshots instead of replacing historical screenshot files. Ignored earlier output may have been removed; no historical log was fabricated. The guest and account configurations now use separate artifact subdirectories, preserving retained verification logs in later runs.

## Protected content

| Content | SHA-256 |
| --- | --- |
| public/question-bank.json and dist/question-bank.json | e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea |
| public/easy-question-bank.json and dist/easy-question-bank.json | f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4 |
| tests/fixtures/approved-question-content.md | 7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729 |

The existing scoring, approved Markdown, option order, Intermediate default/title presentation, legacy Original exam label and frozen snapshots remain intact.

## Remaining hosted work

The user is creating the Supabase project. No project URL/key, authenticated deployment access or actual hosted database/function configuration was supplied during this implementation.

[SUPABASE_SETUP.md](SUPABASE_SETUP.md) records:
- Email/password configuration with Confirm Email disabled.
- Frontend public variables and server-only credential boundaries.
- Additive database migration and three function deployment commands.
- Exact allowed origins, recovery redirects and SMTP.
- Configurable limits and bounded client upload behavior.
- Hosted two-account/fresh-device/offline/deletion smoke checks.
- Backup retention, isolated restore rehearsal and production rollback.

Account controls stay disabled until configuration is supplied. No live Supabase integration, production smoke result, public deployment, commit or push occurred. The feature should not be called production complete until the hosted and operational checks pass.
