# Supabase account-history setup

The local implementation and hosted migration/functions are ready for development testing. The configured workspace has account features enabled; guests retain browser-based exams and reports.

## Current workspace setup — 2026-10-14

The linked project has migration 202610140001 and all three account-history functions deployed. Platform JWT verification remains enabled. Local origins on localhost/127.0.0.1 at ports 5173, 4173 and 4210 are allowed. Hosted HTTP/SDK signup, backup/recovery, owner isolation and deletion checks pass. Hosted browser signup also verifies automatic real-bank history migration with preserved device bytes and empty history without report rows; temporary test accounts were removed.

Start/restart the frontend with `npm run dev`, open `http://127.0.0.1:5173`, select Create account in the header and wait for completed guest reports to show Backed up automatically. With no completed guest history, the account stays empty. Account history loads automatically after signup or sign-in. Additional eligible completed device reports can be backed up individually. Account settings are available from the header; only Results reports can be exported as PDFs. Sign in from another browser profile and open the account report. Add the actual production origin to ARCHIVE_ALLOWED_ORIGINS and configure Auth recovery redirects/SMTP before publishing accounts. The general provisioning commands below are retained for reproducible setup.

## Registration email guard and cancellation

Migration 202610140002_registration_email.sql is applied in the linked project. It enforces complete-domain email syntax for new/changed Auth emails, including direct signup requests. Existing accounts are retained. No Auth-hook toggle is required; the guard is a database trigger with restricted function privileges. New projects receive it through the normal db push command. Format validation does not establish deliverability or ownership; Confirm Email stays off.

Auth requests have a 30-second timeout and remain cancellable. Cancellation cannot reverse server-side account creation that already completed; on a signup timeout, retry or try signing in with the entered credentials. See [AUTH_FIXES_VERIFICATION.md](AUTH_FIXES_VERIFICATION.md).

## Project configuration

1. Create a Supabase project and retain its project reference.
2. In the email authentication provider, enable email/password signup and disable Confirm Email. Users must receive a session immediately after signup.
3. Set the minimum password length to 8 to match the signup form.
4. Set the Auth site URL to the actual application URL. Allow the exact local/preview/production URLs needed for optional password recovery.
5. Configure a production SMTP sender for password recovery. Signup and ordinary login do not require email delivery.

## Password recovery email setup (BUG-005)

**Normal recovery enabled — 2026-10-15:** The owner requested committing recovery as part of the normal app. Configured accounts now enable recovery by default; VITE_PASSWORD_RECOVERY_ENABLED=false is an explicit opt-out. The local configuration and example use true. Deploy the recovery frontend to Vercel; if Vercel has an explicit false value, change it to true or remove it before rebuilding. SMTP credentials remain exclusively in Supabase. A real recovery email/reset/login still needs confirmation; no live emails were sent by automated checks. Earlier postponement/feature-gate notes below describe historical decisions.

**Setup resumed 2026-10-15:** Gmail SMTP fields and the production Site URL/redirect were supplied in owner screenshots. Local resume/reload/invalid-link fixes now pass TypeScript, all 42 focused unit checks, all seven synthetic recovery browser checks and the production build after explicit owner approval. Keep the recovery flag off until a controlled real-mailbox delivery/reset/login check; hosted SMTP delivery remains unverified. See [PASSWORD_RECOVERY_RESUME_STATUS.md](PASSWORD_RECOVERY_RESUME_STATUS.md). The earlier postponement and setup notes below are historical.

**Postponed by the owner on 2026-10-15.** VITE_PASSWORD_RECOVERY_ENABLED defaults to false when absent. The app hides Forgot password and shows an unavailable notice in sign-in/signup. Recovery requests, password-update handlers and the recovery dialog are gated off while disabled; signup/sign-in remain available. This is an app feature gate, not a change to the hosted Supabase Auth APIs.

Keep the flag absent or false in Vercel and local configuration for now. A rebuild/redeployment is required to apply the local UI change to the deployed site. Later, complete the setup and remaining recovery-flow work below, verify the full flow when authorized, then set VITE_PASSWORD_RECOVERY_ENABLED=true in the relevant build environment and rebuild/redeploy. Do not enable it solely because SMTP credentials were entered.

On 2026-10-15, the project owner confirmed custom SMTP is not enabled. Supabase's default sender only delivers Auth messages to project-team addresses; successful signup without confirmation does not establish that recovery emails can reach ordinary users. Configure custom SMTP before treating public password recovery as available. [Supabase SMTP documentation](https://supabase.com/docs/guides/auth/auth-smtp).

1. Obtain SMTP credentials and an approved sender address from your email provider. Complete the provider's sender/domain verification and required DNS records.
2. In Supabase Dashboard → Authentication → Email → SMTP settings, enable custom SMTP. Set the provider's host, port, username, password, sender email and sender name. Enter the password directly in Supabase; never add SMTP secrets to VITE variables or frontend files.
3. Keep signup's Confirm Email disabled, as required for this app. Recovery email delivery is a separate setup requirement.
4. In Authentication → URL Configuration, set Site URL to the actual app URL and add the precise current app recovery destination to Redirect URLs. The app requests window.location.origin plus its Vite BASE_URL. Include the current ngrok URL when using it; update it when the tunnel changes. Local supabase/config.toml is not proof of hosted dashboard settings. [Redirect documentation](https://supabase.com/docs/guides/auth/redirect-urls).
5. Review the Auth email rate limit and password-reset email template. Its link must use Supabase's generated confirmation URL rather than a hardcoded app home URL.
6. When verification is authorized, use an account and mailbox you control to request one recovery email, follow the link, update the password and confirm the new password can sign in. Do not call delivery verified from a successful API response alone.

Recovery failures now use actionable messages with allowlisted Supabase codes and HTTP status references. email_address_not_authorized identifies the default-sender restriction; over_email_send_rate_limit/HTTP 429 require waiting or reviewing email limits. Generic server failures retain a service-error reference without claiming that SMTP is definitely the cause. Raw provider messages, credentials, tokens, emails and account-existence codes are not copied into the error text. Accepted-request copy does not promise delivery. [Error codes](https://supabase.com/docs/guides/auth/debugging/error-codes).

The UI diagnostic changes have not been run through tests/typecheck/build because of the retained instruction against confirmation checks. No administrative credentials were accessed, no hosted Auth settings changed and no recovery emails sent. The earlier recovery resume/reload/invalid-link findings remain separate unresolved work in ACCOUNT_RECOVERY_DELETION_REVIEW.md.

## Frontend configuration

Copy .env.example to .env.local and set:

~~~dotenv
VITE_ACCOUNT_HISTORY_ENABLED=true
VITE_PASSWORD_RECOVERY_ENABLED=true
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
~~~

Use only the publishable key (or legacy anon key). Privileged keys belong only in the server environment. .env.local is ignored by Git and excluded from frontend deployment uploads.

For Vercel, set the account URL/key/enable variables in the relevant project environments and rebuild/redeploy. Recovery now defaults on for configured accounts. Set VITE_PASSWORD_RECOVERY_ENABLED=false only to disable it explicitly; remove any old false override or set true when deploying recovery. Vite reads them at build time. Missing, invalid or disabled configuration keeps the account UI hidden and the guest app working.

## Database and functions

**Production origin update — 2026-10-15:** The owner approved adding https://pcao-f-practice-exam-one.vercel.app to ARCHIVE_ALLOWED_ORIGINS while retaining localhost/127.0.0.1 at ports 5173, 4173 and 4210. The secret update is applied. All three production function preflights now return 204 with the exact origin; all three anonymous requests remain rejected, an unrelated origin remains rejected, and the existing 127.0.0.1:5173 preflight passes (8/8 checks). No frontend rebuild is needed for this hosted setting. This does not verify authenticated account deletion or remove the named QA account. See BUG_004_ACCOUNT_DELETION_STATUS.md and test-results/bug-004-origin-fix-verification.json.

The repository pins Supabase CLI 2.120.0 as a development dependency. Install it with `npm ci --include=optional`, then run the following from the repository root in an authenticated operator session:

~~~powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase secrets set ARCHIVE_ALLOWED_ORIGINS="http://127.0.0.1:5173,https://YOUR_APP_HOST"
npx supabase functions deploy backup-report --use-api
npx supabase functions deploy delete-report --use-api
npx supabase functions deploy delete-account --use-api
~~~

The `--use-api` deployment path bundles the functions remotely and does not require local Docker.

If Windows reports `No matching Supabase CLI binary package found for win32-x64`, check npm installation logs for `ENOSPC` and ensure enough free disk space for the platform binary. Once space is available, repair the local installation with `npm install -D supabase@2.120.0 --include=optional --save-exact`, then verify `npx supabase --version`. The Windows binary is approximately 147 MiB; leave additional space for the downloaded package/cache. Do not remove browser data or source files to make space.

Review the linked project before applying migrations. Include every actual frontend origin in ARCHIVE_ALLOWED_ORIGINS, with exact scheme/host/port and no trailing slash. The default Vite dev port is 5173; use your actual port if different. Password-recovery redirects are configured separately in Auth.

The account-history migration is supabase/migrations/202610140001_account_history.sql; registration validation is added by 202610140002_registration_email.sql. Account history adds:
- Owner-scoped account preferences and report reads.
- Server-only report write/delete functions.
- Immutable report content, owner/attempt uniqueness and deletion tombstones.
- Per-account upload/storage limits and a server-side write-rate limit.
- Cascades removing account records after Auth user deletion.

Each Edge Function verifies the user token through Supabase Auth before using its built-in server credentials. Its own deno.json pins the SDK/Zod dependencies. Server-only SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided by the function environment; never copy the privileged key into VITE_ variables.

Default limits are 1 MiB per request/report, 1,000 live reports, 250 MiB of live payload data per account, and 30 new report writes per minute. Operators can update the protected archive_limits row after assessing budget/capacity. A matching retry still succeeds when the account is at capacity. Browser uploads process at most five pending reports per synchronization pass; remaining work resumes on a later pass.

No schema destruction or migration of existing local attempt payloads is required.

## Local checks

~~~powershell
npm run typecheck
npm test
npm run build
npm run test:browser
npm run test:account
npx deno check --node-modules-dir=manual --config supabase/functions/backup-report/deno.json supabase/functions/backup-report/index.ts supabase/functions/delete-report/index.ts supabase/functions/delete-account/index.ts
~~~

The regular browser suite tests the default guest app. The separate account suite uses the real Supabase SDK with an explicitly synthetic HTTP boundary on port 4232. Its test Vite configuration and test credentials must not be used for production.

Database tests run the actual migration in embedded PostgreSQL (PGlite) with a minimal Auth schema/role harness. They do not replace hosted Supabase integration, gateway, Auth, SMTP or restore testing.

## Required hosted smoke checks

Before enabling accounts publicly:
- Confirm signup signs in immediately without any verification email, automatically backs up completed guest history without an import prompt, and creates no report rows for an empty browser.
- Verify correct/wrong-password login, session persistence, sign-out and password recovery.
- Back up a completed real-bank report automatically on signup or with its individual backup action; verify its payload/hash and original Results/PDF.
- In a separate device/browser profile, sign in and open that same report.
- Verify a second account cannot read or delete the first account's records.
- Complete an exam offline and verify backup after reopening/reconnecting.
- Exercise duplicate uploads, deletion/tombstones, Results PDF export and current-password account deletion.
- Check actual request limits, pagination, gateway JWT/CORS behavior and report/function errors.

Choose the production plan and managed/off-site backup retention with the project owner. Restore a backup into an isolated environment and verify authentication plus report access. Record recovery point/time, deletion reconciliation, destination and operator responsibilities before calling the durable-history rollout complete.

## Rollback

Disable VITE_ACCOUNT_HISTORY_ENABLED and rebuild/redeploy the frontend. Retain database reports, migrations and functions. Existing ownership markers keep account-bound original device reports private while cloud access is disabled; guest exams/reports remain available. Re-enable the account layer to access those owner-bound copies.

## Device-data behavior

Unchecked “Keep me signed in on this device” sessions use sessionStorage and survive reloads within the same tab’s browser session. Checked sessions use localStorage. The tab’s choice is stored separately in sessionStorage; signing out clears tokens from both stores. If sessionStorage is blocked, unchecked sessions fall back to memory and reload persistence is unavailable. Browser session restoration may restore sessionStorage according to the browser’s own behavior.

New exams continue using the existing localStorage attempt records and shared Web Lock. Separate owner markers prevent another account from claiming/displaying an owned original. IndexedDB contains queue/receipt bookkeeping and optional downloaded cloud copies.

Sign-out clears downloaded cloud copies and rendered account data. Original account-bound device records and pending jobs remain private and bound to their original account. Account deletion removes cloud records and queues/caches, while retained originals remain hidden; users can clear this site's browser data if they want those originals removed. Original unowned guest reports are kept.

Backup runs while the app is open, not as a browser-closed background service. Downloaded files are independent user copies. Browser data is not encrypted by this feature.
