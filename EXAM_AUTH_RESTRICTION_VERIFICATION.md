# Authentication deferred during exams

Date: 2026-10-16

## Behavior

- While the Exam view is open, including Review, Submit and Leave dialogs, guest users see Guest mode and a reminder to sign in or create an account after leaving or submitting.
- Signed-in users retain their email in the header. Account settings is hidden in Exam.
- Authentication forms, recovery actions and recovery errors are absent from Exam. The interactive header unmounts, invoking the existing pending-request abort cleanup. The account hook stays mounted; session refresh, ownership, storage, deadlines, grading and backup logic are unchanged by this change.
- Recovery context is retained. After leaving Exam, the interactive header mounts again and pending recovery can open its password dialog.
- The restriction follows the current Exam view, including restoration/loading transitions. An unfinished attempt does not disable authentication on Home, History or Settings. Navigation still uses the existing leave confirmation and continuing deadline.
- This is an interface restriction. Session expiry, recovery callbacks and changes in other tabs still use existing session/ownership handling.

## Implementation

- `src/App.tsx`: derive the Exam-view restriction, pass it to AccountHeader and omit the Settings link during Exam.
- `src/ui/AccountHeader.tsx`: separate status rendering from interactive authentication/recovery forms.
- `src/styles.css`: wrapping guidance text using existing header layout and colors.
- `tests/accountHeader.test.tsx`: five regression cases cover guest guidance, signed-in identity without account actions, recovery suppression/restoration, normal guest controls and loading/unconfigured states.

Existing working-tree changes were retained. No database, Edge Function, authentication-provider configuration or question-bank changes were needed.

## Verification

- `npm run typecheck`: passed.
- `npm run build`: passed; the existing large-chunk warning remains.
- Initial unit run: 203 tests passed across 21 files; both PGlite database suites timed out during setup, skipping their 11 tests. PowerShell's npm wrapper did not forward the requested worker options.
- Unchanged database retry through `node_modules/.bin/vitest.cmd run --configLoader runner --maxWorkers=2 tests/archiveDatabase.test.ts tests/registrationDatabase.test.ts`: all 11 tests passed across two files.
- Combined result: all 214 tests across 23 files passed across the two runs, including all five new header cases. This is not a claim of a single clean full-suite run.

Real in-app Chromium checks used accessibility, mouse and keyboard controls through the computer-use/browser tools. No Playwright or DOM browser automation was used.

The source app ran on `http://127.0.0.1:4186` with analytics disabled and Supabase pointed exclusively to a synthetic HTTP boundary on port 4287, using the real SDK. The local helper is `.localtest/exam-auth-qa.mjs`. It supplies synthetic sessions/recovery and is not a complete report-backup emulator. These checks do not establish a new cloud-backup or hosted regression pass.

Observed:

1. Home offered Sign in/Create account. Starting Intermediate changed the header to Guest mode with no auth controls.
2. Saved an answer and a flag; reload preserved both and the running countdown. The Exam restriction remained.
3. Home navigation opened Leave exam. Confirming restored authentication while the unfinished attempt remained saved. Resuming restored the restriction and saved answer/flag.
4. Review and Submit confirmations worked. Manual submission returned Results with Sign in/Create account and the saved score of 17/1000 (one correct, 59 unanswered).
5. Synthetic email/password sign-in worked outside Exam and displayed account identity plus the Settings link.
6. A synthetic recovery callback opened Choose a new password outside Exam. Cancel retained Finish password reset. No password was entered or updated.
7. Starting an Advanced exam with that pending recovery retained the email, hid Settings/recovery actions and showed no password dialog. Reload preserved this behavior.
8. Confirming Leave exam restored the pending Choose a new password dialog. Cancelling again revealed Settings and Finish password reset outside Exam.

Guest screenshots inspected at 320x740, 390x844, 768x1024, 844x390 and 1366x900. Signed-in screenshots inspected at 320x740 and 1366x900. Header text wrapped and remained readable without visible clipping. Browser viewport overrides were reset and the temporary tab closed. Both temporary QA server ports subsequently stopped responding.

Evidence: `test-results/exam-auth-restriction/guest-exam-{320,390,768,landscape,1366}.png`, `exam-header.png`, `signed-in-exam-{320,1366}.png`, and `recovery-after-leaving{.png,-ax.txt}`.

## Limits

Natural expiry, enlarged text, physical touch, other browser engines, live email/password recovery, cross-tab session changes and pending-request navigation races were not newly exercised in the browser. Existing unit coverage for request cancellation and recovery context passed. No hosted accounts, reports, passwords or configuration were changed; no recovery email was sent. No deployment, commit or push occurred.
