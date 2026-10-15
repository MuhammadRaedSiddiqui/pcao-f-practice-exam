# BUG-004 — Production account deletion blocked by origin allowlist

Date: 2026-10-15. Status: **Production origin blocker fixed; all eight endpoint checks pass. Authenticated deletion and QA cleanup remain unverified.**

## Approved hosted correction

After the owner explicitly approved the exact origin change, supabase secrets set completed successfully for project ofrlkujlhanfrnrjjtcj. ARCHIVE_ALLOWED_ORIGINS now contains https://pcao-f-practice-exam-one.vercel.app plus the six recorded development origins. The three Edge Functions picked up the setting without a frontend rebuild or function deployment.

All eight targeted HTTP checks passed: production OPTIONS requests return 204 with the exact allowed origin for backup-report, delete-report and delete-account; anonymous POST requests to all three remain 401; an unapproved origin's OPTIONS remains 403 without an allowed-origin header; the recorded 127.0.0.1:5173 development origin remains allowed. [Verification evidence](test-results/bug-004-origin-fix-verification.json).

The production preflight failure is resolved. No actual account deletion was performed during these checks, and the named QA account is not claimed deleted. No authenticated browser/app session or QA password was available. The owner can retry the existing Delete my account button from the production site; the previous origin rejection no longer blocks its request. No frontend code changes, unit suite, typecheck, build, browser regression suite, commit or push occurred. The initial rejection and diagnosis below are historical.

## Initial diagnosis and approval boundary

The owner supplied https://pcao-f-practice-exam-one.vercel.app as the production frontend. A read-only OPTIONS preflight to the deployed delete-account function returned HTTP 403 with code auth and message “This app origin is not allowed.” No Access-Control-Allow-Origin header was returned. The endpoint is reachable; the deployed frontend origin is rejected before the password-authenticated deletion handler runs. The browser exposes this as a failed function fetch, and accountRepository's generic errorFrom converts it into the misleading account-history error reported by QA. No password or account mutation was used in this diagnosis.

The concrete hosted correction is adding that exact HTTPS origin to ARCHIVE_ALLOWED_ORIGINS while retaining the six recorded localhost/127.0.0.1 origins on ports 5173, 4173 and 4210. The setting is shared by backup-report, delete-report and delete-account. Authentication, current-password checks and database ownership rules remain enforced. No wildcard origin is proposed.

Automatic approval review rejected the attempted supabase secrets set command because the user had supplied the URL for investigation but had not explicitly authorized changing the shared production origin trust setting. The command did not execute. No alternative write or workaround was attempted. Applying the correction requires explicit user approval; only then can preflight and authorized in-app deletion be rechecked.

The owner declined a manual account-deletion/support workflow and wants the button to work automatically. No support link was added. The incomplete @example.com reply was not used as a contact address. No frontend code changes were made for this report while the actual hosted blocker awaits approval.

QA account qa-pcaof-20261014@example.com has not been deleted. Computer-use inventory exposed no apps/browser sessions, and opening an in-app Supabase dashboard returned Browser is not available: iab. No authenticated dashboard or app session was available for targeted cleanup. No credentials were searched for or extracted.

Evidence: [production preflight diagnosis](test-results/bug-004-production-origin.json). No unit suite, typecheck, build, browser regression suite, deployment, commit or push occurred. The optional computer-use skill was read for authorized dashboard cleanup: C:/Users/HP/.codex/plugins/cache/openai-bundled/computer-use/26.924.22138/skills/computer-use/SKILL.md. No UI deletion occurred.
