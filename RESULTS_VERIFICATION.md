# Results and complete-flow verification — 2026-10-12

Completed reports use the shared grader and each attempt's frozen bank. The overview shows correct/60, percentage, exclusive correct/incorrect/unanswered counts, time used, submission reason, start and submission dates, and dataset version. Blanks are unanswered; nonblank nonexact selections, including partial sets, are incorrect. The three counts total 60. Elapsed time is capped at the deadline. Results are raw practice scores.

All seven domains show correct/total and percentages rounded to one decimal. “Focus your review here” lists up to three domains below 100%, ordered by unrounded percentage; equal percentages retain snapshot order. This is practice feedback. Fully correct attempts have no weakest-domain recommendation.

All, Incorrect, Unanswered and Flagged filters use distinct answer classifications and independent flags. Native keyboard-accessible disclosures start collapsed. Expanded cards show original IDs, exact frozen stems and ordered options, student and correct sets, supplied overall and per-option explanations, and exact course titles, section headings and links. Text and symbols distinguish selected-correct, selected-incorrect and missed-correct options. Partial responses show an incomplete-selection label. Multiple-response reviews identify the complete required set and show the reviewed explanation of why it qualifies. No explanations, source quotations or readiness assessments are generated at runtime.

History and new starts use the established flow. Old reports retain original data after the loaded bank changes; a new attempt freezes the latest validated loaded bank. All earlier screen regressions passed.

## Checks

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Vitest | 28 passed across 6 files |
| Production build | Passed |
| Playwright / Chromium | 47 passed |

The shell runner was unavailable, so equivalent package CLI entry points ran through Node: typescript/bin/tsc --noEmit, vitest/vitest.mjs run --configLoader runner, vite/bin/vite.js build --configLoader runner, and @playwright/test/cli.js test --config .localtest/results/playwright.config.ts --workers=2, all under node_modules.

The temporary browser configuration changes only baseURL. An isolated production preview remains available at http://127.0.0.1:4177. Logs are in test-results/results-checks.txt. The build emits a nonblocking size notice for the approximately 504 kB minified application bundle. No publishing was performed.

## Independent known-answer evidence

An explicitly synthetic fixture covers reordered correct multiple selections, a correct single answer, partial selections, an incorrect multiple set, an incorrect single answer, an explicit empty array and absent responses. Expectations are specified independently of the app's grader.

| Domain | Correct / total | Percentage |
| --- | --- | --- |
| D1 | 2 / 8 | 25% |
| D2 | 3 / 13 | 23.1% |
| D3 | 0 / 7 | 0% |
| D4 | 5 / 10 | 50% |
| D5 | 7 / 7 | 100% |
| D6 | 2 / 9 | 22.2% |
| D7 | 1 / 6 | 16.7% |
| Overall | 20 / 60 | 33.3% |

The overview is 20 correct + 8 incorrect + 32 unanswered = 60. Domain correct counts sum to 20 and totals to 60. Review priorities are D3, D7, D6. Known manual time is 00:37:42; delayed expiry reports 02:00:00. A fully correct attempt scores 60/60 and has no weakest-domain recommendation.

Browser tests verify those exact scores and all four filters, independent flags, partial/wrong-set labels, exact explanations and source metadata, Enter/Space expansion and collapse, initially collapsed reopened reports, and an empty Flagged state. A fresh fixture-2 attempt uses changed content and keys while the recovered fixture-1 report remains structurally unchanged. Refresh preserves active answers; expiry during confirmation opens the latest snapshot's Results. Existing tests cover manual Start → Exam → Review → Results, touch, storage failures and repeated submissions.

## Real data and prerequisites

Runtime version 1.1.0 remains reviewed, with 60 questions and 120 minutes. Its SHA-256 is unchanged:
e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea

The approved source was found at C:/Users/HP/Downloads/PCAO-F-Full-Mock-60-Questions.md. Its SHA-256 matches the correction report:
7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729

An unchanged copy is retained in tests/fixtures/approved-question-content.md for repeatable integrity checks. All 60 IDs, selection counts, exact Markdown stems and ordered option IDs/text match, including corrected Q23/Q24 and unchanged Q45. Runtime questions also match PCAOF-question-bank-v1.1.0-reviewed.json exactly. The real validator passes all required keys, overall explanations, option explanations and sources.

No real-data prerequisite remains for this local implementation. Historical correction-report integration checks are satisfied by current validation and flow tests. Future datasets still require complete reviewed metadata and validation before new attempts.

## Responsive evidence

Real-bank Results, a flagged partial Q8, its table, explanations and sources were tested at 320×700, 390×844, 768×1024, 1366×768, 700×320 landscape, and enlarged text at 320×700. Overview, domain, question and source screenshots were inspected across these sizes. Controls meet the 44px target, disclosures support keyboard input, tables stay within labelled focusable scroll regions, and page-wide overflow checks pass.

Screenshots:
- screenshots/results-overview-{320,390,768,1366,landscape,enlarged}.png
- screenshots/results-domains-{320,390,768,1366,landscape,enlarged}.png
- screenshots/results-question-{320,390,768,1366,landscape,enlarged}.png
- screenshots/results-sources-{320,390,768,1366,landscape,enlarged}.png

Browser verification used Chromium. Publishing remains a later step.
