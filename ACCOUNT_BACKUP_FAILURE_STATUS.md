# Account backup origin correction — 2026-10-16

Status: **Approved ngrok-origin correction applied; all 11 HTTP checks and authenticated backup/read/cleanup pass.** This fixes the confirmed rejection of https://wager-geranium-crafter.ngrok-free.dev. The exact origin of the latest QA run remains unconfirmed, so this does not establish that every observation in that report had this cause.

## Applied correction

Following explicit owner approval, Supabase ARCHIVE_ALLOWED_ORIGINS was updated on project ofrlkujlhanfrnrjjtcj. The setting now includes the exact ngrok origin plus the previously recorded Vercel origin and six development origins. The shared backup-report, delete-report and delete-account functions picked up the change without a frontend rebuild or function deployment. Authentication, RLS, immutable-report validation and current-password deletion safeguards were unchanged.

All 11 targeted HTTP checks pass: production and ngrok preflights return 204 with their exact allowed-origin headers for all three functions; all three anonymous requests remain 401; the recorded local origin remains allowed; an unrelated origin remains 403 without an allow-origin header. Evidence: test-results/backup-origin-after.json.

A further authenticated HTTP-only check used the approved ngrok Origin header and the installed SDK. Immediate no-email signup, preference/history reads, a real Intermediate-bank report backup, receipt retrieval and current-password deletion of the disposable account all succeeded with HTTP 200. The report was created and retrieved; cleanupComplete=true. Evidence: test-results/backup-ngrok-authenticated-after.json. This verifies the authenticated API path, while the preflights independently verify the browser-origin policy. It is not a browser test or a replay of the original QA account's queue.

No browser tests/automation, email sends, existing account/report/password mutations, frontend source patch, unit/type/build run, frontend deployment, commit or push occurred for this approved correction. Only the disposable diagnostic account/report was created and deleted. The earlier approval rejection below is historical and was respected until the owner approved the exact change.

## Original investigation — 2026-10-15 (historical)

Status: direct authenticated API backup/read works; the previously supplied ngrok origin is rejected. Exact origin correction is prepared but NOT applied because automatic approval review requires explicit authorization for the shared trust-setting change. The actual URL used for this new QA report was not supplied; clarification was requested asynchronously. Do not claim that the new report's cause is definitively established until the app origin is confirmed.

## Findings

- Public Supabase Auth health returns 200. Both report/preference tables exist; anonymous REST reads correctly return 401/42501.
- Public Auth settings confirm email/password enabled, signup enabled and immediate signup (mailer_autoconfirm=true).
- One disposable no-email account was created via the installed SDK. Authenticated preferences and account-list queries returned 200. A valid completed Intermediate real-bank report was backed up with status created; authenticated receipt read returned 200 with the saved row. Password-protected delete-account returned success and cleanupComplete=true. No QA account, existing report or existing password was changed, and no email was sent. This HTTP-only check rules out a general current backend/database outage; it does not reproduce the browser's failed request.
- Vercel production preflights pass for backup-report, delete-report and delete-account. All anonymous function requests remain rejected with 401. The recorded local origin remains allowed and an unrelated origin remains rejected.
- The origin https://wager-geranium-crafter.ngrok-free.dev from earlier bug reports receives 403/auth, This app origin is not allowed, from all three function preflights, without an allow-origin header. That can prevent browser backup while direct Auth/REST access works. The tunnel currently returns ERR_NGROK_3200/offline; the local ngrok inspection API is unavailable, so it does not establish which origin the latest QA run used.

## Prepared correction and approval boundary

ARCHIVE_ALLOWED_ORIGINS would retain http://localhost:5173, http://127.0.0.1:5173, http://localhost:4173, http://127.0.0.1:4173, http://localhost:4210, http://127.0.0.1:4210 and https://pcao-f-practice-exam-one.vercel.app, adding only https://wager-geranium-crafter.ngrok-free.dev. This setting is shared by backup-report, delete-report and delete-account. Token-derived ownership, report validation/RLS and current-password deletion requirements remain unchanged.

The exact setting file is prepared at test-results/backup-origins.env. Automatic approval review rejected supabase secrets set because adding the external ngrok origin persistently expands a shared security boundary and the general fix request was not treated as explicit approval of the exact setting/blast radius. The command did not execute. No alternate write, proxy or other workaround was attempted. Explicit approval of this exact origin and shared scope is required before applying it; if the QA origin differs, investigate that origin instead.

## Evidence and next verification

- test-results/backup-service-diagnostics.json
- test-results/backup-authenticated-diagnostics.json
- test-results/backup-tunnel-origin.json
- test-results/backup-reported-origin.json
- test-results/backup-origin-before.json: all 11 expectations pass, including the three expected ngrok denials; this is baseline evidence, not proof of a fix.
- test-results/verify-backup-origin-fix.mjs --after is prepared to check exact-origin allowances, existing production/local allowances, anonymous rejection and unrelated-origin rejection after an authorized correction.

No browser tests or browser automation were performed. No frontend patch, unit suite, typecheck/build, hosted configuration change, deployment, commit or push occurred. Only the disposable HTTP diagnostic account/report was created and deleted. The reported qa-audit-phasec@example.invalid account was not accessed or removed.
