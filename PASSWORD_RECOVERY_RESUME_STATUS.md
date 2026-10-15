# Password recovery resumed — 2026-10-15

The owner resumed password-recovery setup and supplied screenshots of Gmail SMTP configuration and Supabase URL Configuration. Visible SMTP fields use smtp.gmail.com:587 with matching sender/username and a masked password. The subsequent screenshot confirms https://pcao-f-practice-exam-one.vercel.app/ as Site URL and an added allowed redirect. The SMTP save outcome, credentials and actual email delivery have not been independently verified. No SMTP secrets were read or stored in source files.

## Local implementation

- Pending password recovery now has a tab-session marker containing only the accepted account ID and JWT session_id. It is created only from the SDK PASSWORD_RECOVERY event, restored only with the matching SDK session, and cleared after password update, sign-out, explicit login or account/session mismatch. Parsing claims/reading a marker does not authenticate or authorize an update; Supabase remains the authority. Blocked sessionStorage falls back to current-tab memory and cannot resume after reload.
- A Finish password reset header button reopens the password form after Cancel, Close or Escape. Matching recovery context automatically opens it on reload. Password update retains current-account/session checks, minimum eight-character validation and the existing cancellation/timeout boundary; success is shown explicitly.
- SDK initialization errors are observed. Invalid/expired/used callback links show safe actionable copy and a Request a new recovery link action. Raw provider descriptions and callback credentials are excluded from the UI; auth callback parameters are removed while preserving unrelated URL state.
- At the owner’s request, recovery is now a normal part of configured accounts: it defaults on, and only VITE_PASSWORD_RECOVERY_ENABLED=false disables it. Local configuration and .env.example use true. The recovery test configuration no longer supplies a special enable override. This local implementation must still be deployed to reach Vercel; remove/change any existing Vercel false override when deploying. SMTP secrets remain outside the frontend.

## Final normal-app enablement verification

After the owner requested committing recovery into the normal app, final checks pass with the test-only enable override removed:

- TypeScript: passed.
- Focused recovery/context/cancellation unit checks: 46 passed across three files, including enabled-by-default and explicit-false cases.
- Synthetic Chromium recovery checks: all seven passed in one run (57.5 seconds).
- Production build: passed; main 788.51 kB, lazy PostHog 305.91 kB, PDF 1,834.25 kB. Existing size warnings are nonblocking.

Evidence: test-results/recovery-enable-{typecheck,unit-tests,browser,build}.txt. Checks ran on the current working tree; unrelated pending exam UI changes are excluded from the recovery commit. Local recovery is enabled; no real emails were sent and no hosted configuration or deployment was changed. Frontend rollout and a real-mailbox recovery/reset/login check remain outstanding.

## Earlier verification and limits

Before changing the default enablement, the following checks passed:

- TypeScript: npm run typecheck, exit 0.
- Focused unit checks: 42 passed across recoveryContext, passwordRecovery and authRequests. These exercise same-session reload/token refresh, account/session isolation, clear/fallback/malformed-state behavior, safe URL detection/cleanup, error diagnostics and cancellation. This run includes the final implementation refinements.
- Focused Chromium: all seven cases in tests/recovery-browser/recovery.spec.ts passed in one run (1.1 minutes), using playwright.recovery.config.ts and vite.recovery-test.config.ts. Cancel, Close and Escape each allow reopening and reload restoration; successful password update removes pending context; expired callback errors are safe and offer resend; a URL flag cannot grant recovery; sign-out clears the form/context.
- Production build: passed, exit 0. Existing nonblocking chunk warnings remain: main 785.25 kB, lazy PostHog 305.91 kB and PDF 1,834.25 kB.

Evidence: test-results/recovery-resume-typecheck.txt, recovery-resume-unit-tests.txt, recovery-resume-browser.txt and recovery-resume-build.txt. Browser tests used the installed SDK with synthetic/intercepted Auth endpoints and a separate test server, which the runner stopped afterward. No recovery emails were sent. A synthetic successful password PUT confirms the UI/SDK request/cleanup flow, not hosted password policy, mailbox delivery or a real subsequent login.

The earlier automatic-review rejection was respected; checks ran only after the owner's explicit approval. No broad account/guest/analytics browser suite was run because no new failure or source change justified it.

The owner subsequently requested committing recovery into the normal app. It now defaults on for configured accounts and is enabled locally; VITE_PASSWORD_RECOVERY_ENABLED=false remains an explicit opt-out. Vercel needs the updated frontend, plus removal/change of any explicit false override. A real-mailbox recovery request, actual receipt, link opening, password update and login still need confirmation using an allowed callback. Hosted SMTP settings/credentials and email delivery were not independently verified. No emails, hosted configuration changes, real account/password/report mutations, deployment, commit or push occurred.

The account-deletion dialog finding in ACCOUNT_RECOVERY_DELETION_REVIEW.md remains separate and unchanged. Earlier recovery findings 1–3 are now implemented and covered by focused local verification; the historical report is preserved.
