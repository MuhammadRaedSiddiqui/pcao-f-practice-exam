# BUG-005 — Recovery requests fail

Date: 2026-10-15. Status: **SMTP configuration cause identified from owner confirmation; local diagnostic improvement implemented, verification pending.**

The owner answered “no” when asked whether custom SMTP is enabled. Supabase's built-in sender is restricted to project-team email addresses, so ordinary user recovery cannot rely on that sender. This explains the reported failure for non-team recipients. The exact hosted /recover response code was not supplied or retrieved; no live reproduction or email-delivery pass is claimed. Signup succeeds without email confirmation because that flow does not require email delivery.

## Owner decision: postpone recovery

The owner postponed password recovery on 2026-10-15. The default-off VITE_PASSWORD_RECOVERY_ENABLED gate hides Forgot password and explains unavailability in sign-in/signup. The request/update handlers reject calls while disabled, and recovery events do not open the password dialog. Existing implementation/diagnostics are retained for later. No SMTP configuration is being performed now. Apply the UI change to Vercel through a subsequent rebuild/deploy. No new checks were run.

## Local implementation

- Added src/domain/passwordRecovery.ts to translate Supabase failure codes/status into actionable guidance. Restricted sender delivery, disabled email provider, rejected address, rate limit, timeout, security challenge, network failure and generic service errors are distinguished.
- Only allowlisted diagnostic codes and valid HTTP error status are shown. Raw provider messages, email addresses, tokens and account-existence codes are not echoed. Generic server errors are not falsely labelled a confirmed SMTP configuration issue.
- src/hooks/useAccountHistory.ts now uses this mapper instead of discarding every recovery error. Missing account configuration throws explicitly instead of returning success.
- src/ui/AccountHeader.tsx describes an accepted request conditionally: if an account exists, a link has been requested. It does not guarantee delivery.
- Added meaningful unit cases in tests/passwordRecovery.test.ts. They are unrun. No typecheck, build or browser checks were attempted for this change, respecting the retained no-confirmation-checks instruction.

## Hosted work remaining

Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md#password-recovery-email-setup-bug-005): configure a verified SMTP sender directly in Supabase, confirm current Site URL/recovery redirect allowlist, and then verify one real recovery round trip with an authorized mailbox. Keep signup email confirmation disabled. SMTP credentials must not enter frontend environment variables.

Automatic approval review rejected probing for saved administrative token locations because it exceeded the authorized configuration review. No credential lookup or alternate administrative access was performed after that rejection. Owner-supplied non-secret SMTP status provided the configuration evidence instead. Hosted SMTP, sender verification, rate limits and redirect settings were not read or modified, and no emails or account/report mutations occurred.

The previous recovery findings about reopening a dismissed password form, restoring recovery context after reload and invalid/expired callback errors remain unresolved. BUG-007 session-expiry behavior was not verified or changed here.

References: [Supabase SMTP restrictions](https://supabase.com/docs/guides/auth/auth-smtp), [Auth error codes](https://supabase.com/docs/guides/auth/debugging/error-codes), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
