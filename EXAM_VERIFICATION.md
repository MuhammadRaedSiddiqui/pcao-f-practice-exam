# Timed Exam page verification — 2026-10-12

Implemented the persistent exam title, answered count, remaining time, question position, flag toggle, original Markdown card, explicit selection instructions, answer cards, navigation and shared Review & submit action. Start and its replacement confirmation remain covered by regression tests. The existing review dialog and Results use the shared state and finalization helpers; no next-phase dialog work or deployment was performed.

## Checks

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Vitest | 20 passed |
| Production build | Passed |
| Playwright / Chromium | 27 passed |

The shell runner was unavailable, so equivalent package CLI entry points were executed through Node child processes in this workspace:

- node node_modules/typescript/bin/tsc --noEmit
- node node_modules/vitest/vitest.mjs run --configLoader runner
- node node_modules/vite/bin/vite.js build --configLoader runner
- node node_modules/@playwright/test/cli.js test --workers=2

Output is recorded in test-results/exam-checks.txt.

## Behavioral evidence

- Complete selections count as answered regardless of correctness; partial selections do not count.
- Radio answers can be cleared. Two- and three-answer items enforce limits while allowing deselection and replacement.
- Answers, flags, position and the original deadline survive reload and Resume. Blank and partial questions permit navigation; first/last boundaries are disabled.
- Failed storage writes retain recorded answers, flags and position; retry succeeds after storage recovers.
- Simulated suspension catches up from the deadline on visibility return. Expiry continues inside review, rejects late edits, submits the latest recorded answers, closes review and focuses Results.
- Repeated expiry events produce one submitted storage write and preserve the submission timestamp. Reopening after expiry automatically opens the original report.
- Original snapshots and report grading remain intact after bank changes. Start regression tests include confirmation, repeated clicks, loading, invalid banks and storage failures.
- Markdown unit coverage includes GFM tables, fenced code and non-execution of raw HTML. Browser checks verify narrative paragraphs, table rows, quoted prompts and hidden domain/explanation/source metadata.
- A timer-driven Markdown remount discovered during keyboard testing was fixed by hoisting the renderer components. Table focus and horizontal scroll now survive timer updates.

## Responsive and visual evidence

Exam interactions and page-wide overflow were checked at 320×700, 390×844, 768×1024, 1366×768 and 700×320, plus enlarged text at 320×700. Reduced motion and keyboard table scrolling were exercised; existing touch coverage passed.

Original Q3 (long narrative and table) and Q8 (table and quoted prompt) were visually inspected on desktop and mobile. Desktop narrative table cells wrap at word boundaries; wide mobile tables scroll within their labelled focusable containers. Selected and keyboard focus states are distinct from the amber review flag. Navigation controls meet the 44px target.

Screenshots for both questions at each size are screenshots/exam-narrative-{320,390,768,1366,landscape,enlarged}.png and screenshots/exam-table-{320,390,768,1366,landscape,enlarged}.png.

Browser verification used Chromium; deadline and background recovery were exercised with controlled clock and browser events.

The reviewed runtime bank remains version 1.1.0, 60 questions, 120 minutes, SHA-256 e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea.
