# Authentication bug fixes — verification

Date: 2026-10-14

**BUG-AUTH-001 / BUG-AUTH-002 — fixed, 2026-10-14:** Signup now checks ASCII mailbox syntax, local/total lengths, fully qualified domain labels and alphabetic/IDNA suffixes before sending the request. Migration 202610140002_registration_email.sql enforces the same rule on new/changed auth.users emails, including direct Auth API signup; it is applied to the linked hosted project. Existing accounts and unchanged legacy emails are preserved. This is format/domain-shape validation, not DNS/deliverability or ownership verification; email confirmation remains disabled. Auth dialogs keep Cancel, Close and Escape available while submitting. A scoped AbortController transport cancels requests/body reads, rejects late responses and fences cancelled session writes/events; signup/signin/recovery/password-update requests time out after 30 seconds with an actionable retry/sign-in message. Timeout retains entered fields; cancelling clears the password and restores opener focus. Narrow device-report rows no longer wrap into an overflowing column. TypeScript, all 136 unit tests across 16 files, production build and all 31 account Chromium cases pass. Pending signup cancellation works at all six layouts with all three dismissal methods, no late session/ownership migration and successful subsequent sign-in; timeout/retry and ordinary signup/backup/recovery regressions pass. Mobile/desktop pending-dialog screenshots were inspected. Direct hosted malformed-signup rejection and valid-signup health checks pass; hosted browser migration/empty signup also pass, with temporary accounts removed. The short-domain direct API rejection currently returns HTTP 500/code 23514; the app detects the same format locally and shows a clear message without issuing that request. See AUTH_FIXES_VERIFICATION.md and test-results/auth-fixes-{typecheck,unit-tests,build,account-browser}.txt plus hosted/content JSON evidence. Reviewed source/built hashes are unchanged. Development server runs at http://127.0.0.1:5173. No new full guest-suite run, frontend production deployment, commit or push occurred; only the new SQL migration was applied.

## Changes

- BUG-AUTH-001: src/domain/email.ts defines the client format rule. The new SQL migration implements the same predicate and a before-insert/email-update trigger on auth.users. Direct signup cannot bypass it. The helper functions have fixed search paths and are executable by the Auth database role, not browser roles. Existing invalid accounts are not deleted or blocked from unchanged-email login updates. No mailbox-delivery or ownership claim is made.
- BUG-AUTH-002: src/services/authRequests.ts owns one manual authentication request, aborts transport and body reads, fences cancelled session writes/events and rejects responses arriving after cancellation. src/ui/AccountHeader.tsx cancels on Close/Cancel/Escape/unmount, ignores obsolete UI completions and keeps form values after a 30-second timeout. A completed server-side account creation cannot be rolled back by cancelling the browser request; timeout guidance includes trying sign-in.
- Narrow local report rows: column layouts use nowrap and an automatic backup-section flex basis, preventing hidden page overflow behind the dialog.

## Final checks

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Pass | test-results/auth-fixes-typecheck.txt |
| Unit tests | 136 tests / 16 files pass | test-results/auth-fixes-unit-tests.txt |
| Build | Pass; existing size warning, main about 779 kB, PDF about 1,834 kB | test-results/auth-fixes-build.txt |
| Account Chromium suite | 31/31 in one final clean run | test-results/auth-fixes-account-browser.txt |
| Hosted direct signup | Short/malformed domains rejected; no session; valid full-domain signup immediately succeeds | test-results/auth-fixes-hosted-email.json |
| Hosted browser signup | Real Intermediate report migration and empty signup pass; temporary users removed | test-results/auth-fixes-hosted-browser.json |
| Reviewed content | Source/built banks and approved reference hashes unchanged | test-results/auth-fixes-content-integrity.json |

New tests include 31 syntax fixtures, actual SQL/browser predicate parity, Auth-role insertion/email updates, legacy account preservation and browser-role privilege denial. Transport tests cover ignored aborts/late responses, timeout/retry, hung body reads and independent report/refresh requests. Browser regressions cover a@b correction without a signup request, pending Close/Cancel/Escape at 320, 390, 768, 1366, landscape and enlarged text, opener focus, page overflow, aborted requests, no late account/ownership changes and retry with retained fields. Screenshots screenshots/auth-pending-{390,1366}.png were inspected. The existing touch/account suite passes.

Initial verification caught SQL regex anchoring/quoting issues before deployment, then a typed mock signature. A 27/31 browser run exposed the narrow report-row overflow and a cancelled-route fixture error; both were corrected. Five focused bug cases and the final full 31-case account run pass. A hosted UI attempt stopped before sending signup because the dev server was not running; after restarting it, the two hosted UI checks passed and cleanup completed. These runs do not replace the historical full guest suite or establish SMTP/restore/production frontend verification. No original user account was deleted during testing.

## Operator notes

Apply migrations with npx supabase db push. Migration 202610140002 is already applied in this workspace's linked project. No Auth-hook toggle or Edge Function redeployment is needed. Supabase currently exposes the database guard rejection for a direct short-domain signup as HTTP 500/code 23514; this is a rejected creation, not a successful signup. Ordinary app validation provides the specific complete-domain error. Keep email confirmation disabled per the approved flow. The rule cannot prevent registration using somebody else's syntactically valid address or prove that a mailbox exists. Those require a separately approved ownership-verification flow.
