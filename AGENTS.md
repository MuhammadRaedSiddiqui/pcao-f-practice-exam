# Repository Guidelines

## Project Structure & Module Organization

This frontend-only app uses React, TypeScript, and Vite. `src/App.tsx` coordinates Start, Exam, Review and Results; `src/ui/ResultsPage.tsx` renders completed snapshot reports; `src/styles.css` contains responsive styles. Keep validation, attempt, and Results summary logic in `src/domain/`, reusable controls and Markdown rendering in `src/ui/`, and runtime data in `public/question-bank.json`. Unit tests are in `tests/*.test.ts(x)`, browser tests in `tests/browser/`, and synthetic fixtures in `tests/fixtures/`. Read [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for the unified implementation and current status. Read [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md) before changing the flow or schema.

## Current Local Status

The reviewed bank is version 1.1.0: 60 questions, 120 minutes, and SHA-256 `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`. It validates and permits local attempts. The four views, browser persistence, fixed-deadline timer, exact-set grading, and frozen attempt snapshots are implemented.

The Start page includes exam details, instructions, Start/Resume controls, and compact browser-local attempt history with completion dates, practice scores out of 1000, Passed/Failed badges, correct/total and report actions. New starts revalidate and freeze the loaded bank before persistence and opening Q1. Repeated Start clicks are guarded; replacing an unfinished attempt requires confirmation and restores prior records if a storage write fails. Resume retains the original answers, flags, snapshot, position, and deadline; expired resumes use the shared submission function and open results. Loading, empty, and storage-failure states are implemented, and item-level data remains hidden on the Start page.

The timed Exam page has a persistent title, answered count (exact required cardinality), and deadline-based timer. It saves answers, flags, and navigation immediately; supports radio clearing, checkbox deselection and limits; hides domains and review material; and focuses the question heading after navigation. Visibility, focus, page-show, interval, and edit checks use shared finalization at expiry, including automatic recovery on reopening. Markdown renderer identities stay stable so timer updates preserve table focus and scroll. Review and submit uses `src/ui/ReviewSubmitDialog.tsx` with shared selection-status and submission helpers.

Review and submit has a status legend, independent flags/current markers, all 60 question numbers, counts, time remaining, confirmation with flagged reminders and expiry precedence. Only the modal countdown is visible while a timed dialog is open. Unfinished, unexpired attempts use native browser leave warnings where supported; Attempt history from Exam opens a focus-managed leave confirmation, and home explicitly reminds that the timer continues. Expiry closes the leave dialog and finalizes through the existing helper. Focus trapping, Escape, opener restoration and question-heading jumps are implemented. Submission saves a validated grade once and opens read-only Results.

Results uses the shared grader and frozen snapshots, with exclusive outcome counts, capped elapsed time, submission metadata, seven domain percentages and up to three practice review priorities. All/Incorrect/Unanswered/Flagged filters and initially collapsed native disclosures show exact reviewed content, per-option outcomes and explanations, and supplied course sections/links. Before submission, blank or insufficient selections are Unanswered and exact cardinality is Answered; flags/current remain independent. After submission, blank responses are Unanswered and every nonblank nonexact set is Incorrect, with selected and correct sets visible and no incomplete-selection badge. Results headline an equal-weight Practice score out of 1000 and practice Passed/Failed at the unrounded 720 threshold; correct/total is secondary. History derives the same values from original snapshots without stored-grade migration. The home Source courses drawer shows ten deduplicated course title/URL pairs from the validated bank, with focus trapping, dismissal/restoration and mobile scrolling, without question-specific references or storage changes. The three outcome counts total 60. Domain review priorities rank unrounded percentages and retain snapshot order for ties. Approved Markdown integrity and independently specified synthetic overall/domain results are tested. See [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for current evidence; [RESULTS_VERIFICATION.md](RESULTS_VERIFICATION.md) remains historical.

The latest QA-fix verification on 2026-10-12 passed TypeScript, 35 Vitest tests, and production build. The 74-case Chromium run passed 73 cases; the one existing touch test passed its focused rerun after adding the new leave-confirmation interaction. Coverage includes repeated starts, confirmation and keyboard focus, refresh recovery, expired resumes, original report snapshots after bank changes, storage failures, touch interaction, and layouts at 320, 390, 768, and 1366 pixels plus mobile landscape and enlarged text. Mobile and desktop screenshots are in `screenshots/`. The reviewed bank checksum is unchanged. The app has not been published.

## Documentation and Verification Records

[PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) is the unified handoff document for all implementations, project status, data rules, test results, screenshots, local commands, and remaining work. Keep it and this status section aligned when behavior or verification changes. Preserve earlier phase reports as historical records; their test totals are successive suite snapshots, not cumulative counts.

The latest QA-fix log is [test-results/qa-audit-fix-checks.txt](test-results/qa-audit-fix-checks.txt); [test-results/results-checks.txt](test-results/results-checks.txt) preserves the earlier clean 60-case full run. Unit coverage spans 7 files and browser coverage spans 7 test files. Chromium is the verified browser; Firefox/WebKit and a formal independent accessibility audit are not recorded. The production build passes with a nonblocking warning for the approximately 506 kB JavaScript bundle. QA-fix checks used port 4180; those temporary previews were stopped afterward. The earlier UI-update preview used port 4178 (earlier Results checks used 4177); the normal browser-test configuration uses port 4173. The earlier UI update reran typecheck, unit tests, build, and all 60 browser tests; a focused passing rerun added score/history screenshots. Later documentation-only updates do not imply a new test run.

The approved Markdown reference is [tests/fixtures/approved-question-content.md](tests/fixtures/approved-question-content.md), SHA-256 `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729`. All 60 stems, ordered options, IDs, and selection counts match it. Historical correction-report app-integration prerequisites are complete. Publishing remains a later step; no public deployment is established.

## Build, Test, and Development Commands

Run `npm ci` for locked dependencies. `npm run dev` starts Vite; `npm run preview` serves the production build. Run `npm run typecheck` for TypeScript, `npm test` for Vitest, `npm run build` to create `dist/`, and `npm run test:browser` for Playwright. Install Playwright Chromium first if it is missing.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, strict types, and functional React components. Name component files in PascalCase (for example, `MarkdownContent.tsx`), functions in camelCase, and unit tests `*.test.ts(x)`. Keep question content out of components. No formatter or linter is configured; match nearby code.

## Testing Guidelines

Add meaningful Vitest cases when validation, scoring, persistence, or snapshot rules change. Use clearly marked synthetic test fixtures. For UI changes, verify Playwright interactions at 320, 390, 768, and 1366 pixels, plus mobile landscape and enlarged text. Inspect mobile and desktop screenshots in `screenshots/`; check keyboard access, touch targets, and page-wide overflow.

## Question Data & Safety

Require the complete reviewed bank to validate before starting a new attempt. Never invent answer keys, explanations, sources, official scaled scores, certification pass/fail predictions, or readiness assessments. Equal-weight practice score and practice Passed/Failed at 720/1000 are explicitly authorized. Preserve approved Markdown, option order, corrected Q23/Q24, and unchanged Q45. Do not execute raw HTML from question content. Existing attempts must keep their frozen snapshots. Local JSON changes become public only after deployment.

## Commits & Pull Requests

Git is initialized locally on `main`, with `origin` configured for `https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam.git`. Use short imperative subjects, such as `Validate question option IDs`. PRs should explain behavior and data changes, link an issue when available, report checks, and include mobile and desktop screenshots for UI changes.
