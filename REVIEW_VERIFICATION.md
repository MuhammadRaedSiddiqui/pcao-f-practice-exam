# Review and submit verification — 2026-10-12

The Exam page now opens a labelled Review and submit dialog using the shared selection-status helper. Its 60-question grid distinguishes answered, unanswered, partially selected, flagged and current questions with symbols, colour and accessible labels. Flags remain independent of answer status. Counts and deadline-based remaining time appear above the grid; the header and actions stay reachable while the body scrolls.

Question buttons close review, persist the selected position and focus the question heading, including when choosing the current question. Back to exam restores the opener and preserves selections, flags and position. Escape closes review or returns from confirmation to review. Dialogs trap keyboard focus and reset their body scroll when opened or changing steps.

Submit exam opens a concise confirmation showing unanswered and partial counts. Students can deliberately submit blanks and partial selections. The existing idempotent stored-submission helper saves selections, submission details and a grade calculated by the shared grader, then opens read-only Results. A per-attempt UI guard prevents repeated finalization. Expiry continues through both dialog steps and takes precedence at the deadline without confirmation. Saved grades are validated on recovery; legacy reports without a stored grade remain readable from their frozen snapshots.

## Checks

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Vitest | 23 passed |
| Production build | Passed |
| Chromium browser suite | 38 passed |
| Review-specific rerun after layout refinements | 11 passed |
| Final responsive rerun after CSS refinements | 6 passed |

Equivalent package CLI entry points ran through Node because the shell runner was unavailable:

- node node_modules/typescript/bin/tsc --noEmit
- node node_modules/vitest/vitest.mjs run --configLoader runner
- node node_modules/vite/bin/vite.js build --configLoader runner
- node node_modules/@playwright/test/cli.js test --config .localtest/review/playwright.config.ts --workers=2

Browser tests used an isolated production preview at 127.0.0.1:4176. The pre-existing development server returned stale dependency-cache errors, so it was excluded from verification. The temporary preview configuration changes only baseURL; tests are the repository's existing browser suite plus review.spec.ts. The temporary preview server was stopped after verification. Browser logs are in test-results/review-checks.txt.

## Coverage and visual review

Coverage includes mixed status counts; flags on complete, partial and unanswered questions; jumps to another and the current question; unchanged answers after Back and Escape; confirmation cancellation; deliberate blank and partial submission; failed-save recovery; repeated clicks; one submission write and one history ID; stored grades; post-submit editing rejection; expiry during review and confirmation; overlapping manual and expiry events; and original frozen snapshots after bank changes.

The review grid and confirmation were exercised at 320×700, 390×844, 768×1024, 1366×768, 700×320 landscape and enlarged text at 320×700. Keyboard trapping, heading focus, opener restoration, 44px minimum question targets, touch submission and page-wide overflow passed. Mobile, tablet, desktop, landscape and enlarged-text screenshots were inspected. Fixes include resetting dialog scroll, restoring focus after ordinary navigation, avoiding browser-default dialog width restrictions, and keeping narrow count labels readable.

Screenshots:
- screenshots/review-submit-{320,390,768,1366,landscape,enlarged}.png
- screenshots/submit-confirmation-{320,390,768,1366,landscape,enlarged}.png

The reviewed runtime bank remains version 1.1.0, 60 questions, 120 minutes, SHA-256 e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea. Work stops at the dialog and its shared submission integration. No deployment was performed.
