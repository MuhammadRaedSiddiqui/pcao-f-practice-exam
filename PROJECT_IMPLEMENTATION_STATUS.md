# PCAO-F Practice — Unified Implementation and Project Status

**Status date:** 2026-10-12  
**Project:** Independent PCAO-F Practice  
**Workspace:** `C:\Users\HP\OneDrive\Desktop\PCAO-F`  
**Delivery state:** Complete local implementation; publishing remains a later step.

This document combines all implemented features, current project status, data rules, testing results, and verification evidence. Current statements below supersede older phase-specific status statements. Original reports remain available for traceability.

## Contents

1. [Current status](#1-current-status)
2. [Scope and architecture](#2-scope-and-architecture)
3. [Reviewed dataset and validation](#3-reviewed-dataset-and-validation)
4. [Attempt lifecycle and persistence](#4-attempt-lifecycle-and-persistence)
5. [Start and attempt history](#5-start-and-attempt-history)
6. [Timed Exam](#6-timed-exam)
7. [Review and submit](#7-review-and-submit)
8. [Results](#8-results)
9. [Accessibility and responsive layouts](#9-accessibility-and-responsive-layouts)
10. [Error handling and recovery](#10-error-handling-and-recovery)
11. [Testing and verification](#11-testing-and-verification)
12. [Independent grading and content integrity](#12-independent-grading-and-content-integrity)
13. [Screenshots and evidence](#13-screenshots-and-evidence)
14. [Local setup and commands](#14-local-setup-and-commands)
15. [Remaining work and maintenance](#15-remaining-work-and-maintenance)
16. [Source records](#16-source-records)

## 1. Current status

The complete approved flow is implemented:

```text
Start → Timed Exam → Review and submit → Confirmation → Results
  ↑          ↑             │
  │          └── Question jump / Back to exam
  └── Attempt history / Open report / Start new attempt

Expiry during an active attempt or either review step → Results
Reopening an expired saved attempt → Shared finalization → Results
```

| Area | Status |
| --- | --- |
| Runtime bank | Reviewed and validated; version 1.1.0 |
| Exam size and duration | 60 questions; 120 minutes |
| Start and browser-local history | Implemented |
| Timed Exam | Implemented |
| Review grid and submission confirmation | Implemented |
| Results overview, domains, filters, and question reviews | Implemented |
| Persistence and frozen snapshots | Implemented |
| Exact-set grading and idempotent submission | Implemented |
| Responsive, keyboard, and touch behavior | Verified in Chromium at the recorded sizes |
| TypeScript | Passed |
| Unit tests | 35 passed across 7 files |
| Browser tests | 60 passed in Chromium |
| Production build | Passed; generated output in `dist/` |
| Current real-data integration prerequisites | None outstanding for the local app |
| Publishing | Not performed |

The latest full verification completed on **2026-10-12**. The current UI-update verification preview uses `http://127.0.0.1:4178`; the earlier Results preview used port 4177. This is a local preview, not a published deployment. Restart it with the commands in section 14 when needed.

This record includes the current local UI update: consolidated unanswered status, a course-source drawer, and equal-weight practice scoring out of 1000 with practice Passed/Failed. Verification evidence for this update is recorded below.

## 2. Scope and architecture

The app is an independent, frontend-only practice exam using React, TypeScript, Vite, Zod, React Markdown, and GFM support. Attempts remain in the visitor's browser. Backend accounts, cloud attempt storage, and cross-device synchronization are outside the implemented scope.

Question content comes from the runtime bank rather than component code. Results and history show an equal-weight practice score out of 1000 with Passed/Failed at the unrounded 720 threshold. Correct/total and percentage remain secondary. These are practice results, not official certification scores or readiness predictions.

### Repository map

| Path | Responsibility |
| --- | --- |
| [src/App.tsx](src/App.tsx) | Coordinates Start, Exam, Review, Results, loading, persistence, timer events, and finalization |
| [src/domain/bank.ts](src/domain/bank.ts) | Strict dataset schema, validation, and runtime fetch |
| [src/domain/attempt.ts](src/domain/attempt.ts) | Attempt creation, answers, flags, navigation, storage, recovery, grading, replacement, and submission |
| [src/domain/results.ts](src/domain/results.ts) | Completed-result classifications, filters, domain summaries, priorities, and elapsed time |
| [src/ui/primitives.tsx](src/ui/primitives.tsx) | Shared buttons, cards, containers, and modal dialogs |
| [src/ui/MarkdownContent.tsx](src/ui/MarkdownContent.tsx) | Safe Markdown and labelled scrolling tables |
| [src/ui/ReviewSubmitDialog.tsx](src/ui/ReviewSubmitDialog.tsx) | Review grid, status counts, remaining time, and confirmation |
| [src/ui/ResultsPage.tsx](src/ui/ResultsPage.tsx) | Results overview, metadata, domains, filters, and expandable reviews |
| [src/styles.css](src/styles.css) | Shared and screen-specific responsive styles |
| [public/question-bank.json](public/question-bank.json) | Authoritative runtime dataset |
| `tests/*.test.ts(x)` | Unit and content-integrity tests |
| `tests/browser/` | Playwright full-flow and interaction tests |
| `tests/fixtures/` | Explicit synthetic fixtures and approved Markdown reference |
| `screenshots/` | Visual evidence |
| `test-results/` | Latest retained verification output |
| `dist/` | Generated production build |

### Lockfile versions

| Package | Version recorded in package-lock.json |
| --- | --- |
| React / React DOM | 19.3.0 |
| TypeScript | 7.0.2 |
| Vite | 8.3.4 |
| Vitest | 5.0.3 |
| Playwright test | 1.64.0 |
| Zod | 4.6.6 |
| React Markdown | 10.1.0 |
| remark-gfm | 4.0.1 |

Use `npm ci` to reproduce the lockfile. The manifest uses `latest` ranges; the table describes the current lockfile, not future releases.

## 3. Reviewed dataset and validation

### Runtime inventory

| Property | Value |
| --- | --- |
| Runtime file | `public/question-bank.json` |
| Schema version | 1 |
| Exam ID | `pcao-f-practice-01` |
| Dataset version | 1.1.0 |
| Title | Independent PCAO-F Practice |
| Content status | `reviewed` |
| Questions | 60 |
| Duration | 120 minutes |
| Single-answer items | 48 |
| Select-two items | 10 |
| Select-three items | 2 |
| Ordered options | 254 |
| Correct answer sets | 60 |
| Overall explanations | 60 |
| Individual option explanations | 254 |
| Source reference entries | 100 |

The source count represents reference entries; the validated bank produces ten unique course title/URL pairs.

### Seven domains

| Domain | Title | Questions |
| --- | --- | ---: |
| D1 | Prompting and Task Execution | 8 |
| D2 | Output Evaluation and Validation | 13 |
| D3 | Product and Model Selection | 7 |
| D4 | Workflow Integration and Solution Design | 10 |
| D5 | Configuration and Knowledge Management | 7 |
| D6 | Governance, Risk, and Responsible Use | 9 |
| D7 | Troubleshooting and Optimization | 6 |
| **Total** | | **60** |

### Data contract

Bank-level fields are `schemaVersion`, `examId`, `version`, `title`, `durationMinutes`, `expectedQuestionCount`, `contentStatus`, ordered `domains`, and ordered `questions`. A domain has a stable ID, title, and expected question count.

| Question field | Purpose |
| --- | --- |
| `id` | Original stable question ID |
| `primaryDomain` | Reference to one defined domain |
| `selectionCount` | Required number of selections |
| `stemMarkdown` | Approved question content |
| `options` | Ordered option IDs and Markdown text |
| `correctOptionIds` | Reviewed complete correct set |
| `explanationMarkdown` | Reviewed overall explanation |
| `optionExplanations` | Reviewed explanation for every option ID |
| `sources` | Course title, exact section heading, and optional absolute URL |

The strict validator checks required fields, unique question/domain/option IDs, known domain references, option membership, selection counts, key cardinality, complete option explanations, 60 questions, 120 minutes, and exact domain totals. Real starts require `contentStatus: "reviewed"` and complete validation.

Approved wording, option order, Markdown tables, quotations, code blocks, selection counts, and primary domains remain preserved. Corrected Q23/Q24 and unchanged Q45 are retained.

Keys and explanations are reviewed practice metadata from the supplied bank, not official certification keys. The application does not invent or reconstruct them at runtime.

### Checksums and artifact identities

| File | SHA-256 |
| --- | --- |
| `public/question-bank.json` | `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` |
| `PCAOF-question-bank-v1.1.0-reviewed.json` | `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` |
| Historical `PCAOF-question-bank-v1.1.0-de3c2c3f.json` | `de3c2c3f88208666dfed5265f907846e8a89b94520fe12eba85bd16a31ada58b` |
| `tests/fixtures/approved-question-content.md` | `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729` |

The historical corrected-artifact hash and current runtime hash identify different files. The runtime bank and reviewed copy have identical hashes.

A future question, key, explanation, or source change requires a new dataset version. Editing local JSON does not update a public app; a build containing that data must be deployed. Existing attempts keep their original datasets.

## 4. Attempt lifecycle and persistence

### Stored record

An attempt stores its ID, start timestamp, fixed deadline, status, current question ID, selections keyed by question ID, flags, dataset version, and a frozen validated bank snapshot.

Submitted records additionally hold submission time, reason (`manual` or `time expired`), and grading result. Recovery validates the snapshot, allowed selections, flags, deadline relationship, submission metadata, and any saved grade. Legacy reports without stored grades remain readable using their snapshots.

Browser storage keys are:

```text
pcao-f:attempt-ids:v1
pcao-f:attempt:v1:<attempt-id>
```

The history index deduplicates IDs. Damaged records are rejected rather than silently loaded. Records are local to the device/browser.

### Shared domain helpers

| Helpers | Responsibility |
| --- | --- |
| `createAttempt` | Validate a bank and freeze the starting snapshot |
| `selectionStatus` | Classify required cardinality as answered; blank or insufficient selections as unanswered |
| `answerQuestion`, `setFlag`, `setCurrentQuestion` | Apply validated answer, flag, and navigation edits |
| `remainingMilliseconds` | Compute remaining time from the fixed deadline |
| `isExactSet`, `gradeAttempt` | Grade exact correct sets against the snapshot |
| `saveAttempt`, `recoverAttempt`, `listAttempts` | Persist, validate, and enumerate saved records |
| `startStoredAttempt` | Start or replace explicitly confirmed unfinished attempts |
| `submitAttempt`, `submitStoredAttempt` | Finalize once and preserve already submitted records |
| `questionOutcome`, `summarizeResults` | Derive completed result classifications and summaries |

### Selection status and scoring

| Response | Exam/review grid | Results | Points |
| --- | --- | --- | ---: |
| Blank | Unanswered | Unanswered | 0 |
| Fewer than required selections | Unanswered | Incorrect | 0 |
| Required cardinality, wrong set | Answered | Incorrect | 0 |
| Exact correct set | Answered | Correct | 1 |

“Answered” describes cardinality, not correctness. Flags are independent of every selection or result state.

The grader accepts a correct multiple-answer set in any order. Missing, extra, wrong, or duplicate selections do not qualify. There is no partial credit. Overall percentage is rounded to one decimal:

```text
percentage = round((correct / total) × 1000) / 10
```

### Deadline and idempotency

The deadline is fixed at start plus 120 minutes. Refresh, browser suspension, and navigation do not reset it.

Interval, visibility-change, window-focus, page-show, and edit checks catch expiry. Reopening an expired saved attempt uses the same finalization path. At or after the deadline, expiry takes priority over a manual submission request.

The stored submission helper recovers the latest saved selections, returns an existing submitted record unchanged, saves grading on first submission, and avoids duplicate history IDs. A per-attempt UI guard prevents repeated finalization. Double-click and overlapping manual/expiry events are tested. Submitted attempts reject edits and open read-only Results.

## 5. Start and attempt history

The Start page shows exam details, instructions, timing rules, Start/Resume controls, and compact browser-local history. Item-level question content, keys, explanations, domains and references remain hidden. The Source courses button near the description opens a modal drawer titled “Courses used for this mock,” showing ten course title/URL pairs deduplicated from the validated bank’s 100 source entries. It uses the requested independent-writing introduction, course-level fields only, labelled safe new-tab links, loading/error/retry states, desktop right-side positioning and full-width mobile positioning. The fixed heading/Close stay reachable while the body scrolls. Focus traps, Escape/backdrop/Close dismissal and opener restoration reuse the shared dialog. Opening/closing it does not write attempt storage or start a timer.

New starts revalidate the loaded bank, freeze it, persist the attempt, and open Question 1. Repeated clicks are guarded. Replacing unfinished attempts requires confirmation; the replacement helper restores prior records on write failure where storage permits. Completed reports are retained.

Resume restores original selections, flags, snapshot, position, and deadline. Expired saved attempts use shared submission and open Results.

History shows completion dates, practice scores out of 1000, Passed/Failed text badges, correct/total, dataset versions, and Open report actions. Derived practice values require no stored-record migration. It explains browser-local storage. Loading, empty, unavailable-bank, damaged-history, and storage-failure states have appropriate messages and retry controls.

Starting again from Results uses this same flow and the latest validated bank currently loaded by the application.

## 6. Timed Exam

The persistent bar displays title, exact-cardinality answered count, and deadline-based remaining time. Each question displays position, original Markdown, selection instructions, options, and flag control.

Radio selections can be cleared. Multiple-response checkboxes allow deselection and replacement and enforce the required maximum. Answers, flags, and navigation save immediately.

Previous/Next respect first/last boundaries. Navigation focuses the heading and returns the view to the question's top. Domain labels, correctness, explanations, and sources remain hidden until submission.

Timer updates do not remount Markdown tables, preserving their keyboard focus and horizontal scroll. Every tick is not announced. Leaving for review or history retains saved answers and the original deadline.

## 7. Review and submit

### Review dialog

The labelled heading is **Review and submit**. The dialog contains a clear legend, all 60 question numbers, unanswered/answered/flagged counts, remaining time, Back to exam, and Submit exam.

Answer, flag, and current-question markers coexist. Symbols, text, accessible names, and colour distinguish them. Flags can accompany answered or unanswered responses.

Clicking a number closes review, saves the position, and focuses its question heading, including when choosing the current question. Back to exam preserves position, selections, and flags and restores the opener.

### Confirmation

Submit exam opens concise confirmation showing one consolidated unanswered count, including questions without the required number of selections. Students may deliberately submit those responses. Correctness is not disclosed before finalization.

Confirming saves selections, submission metadata, and grade once, locks the record, and opens Results. Cancel returns to review. Escape closes review or returns from confirmation to review before finalization.

The clock continues through both steps. Expiry takes precedence and finalizes without confirmation. A failed submission write remains visible within confirmation and allows retry.

### Dialog accessibility and mobile refinements

Dialogs have associated headings, focus trapping, initial heading focus, Escape handling, and focus restoration. Body scroll resets on opening or changing steps. Headers/actions remain reachable while content scrolls. Width and label refinements avoid browser-default modal restrictions and keep narrow-screen counts readable.

## 8. Results

### Overview

Results headlines Practice score out of 1000, a green Passed or red Failed text badge, and “Passing score: 720 / 1000.” Correct answers out of 60 and overall percentage are secondary. Exclusive correct/incorrect/unanswered counts, elapsed time, submission reason, attempt/submission dates, and dataset version remain.

`practiceScore = Math.round((correctCount / totalQuestions) * 1000)`; `passed = correctCount * 1000 >= 720 * totalQuestions`. Status uses the unrounded fraction. For 60 questions, 0 → 0 Failed, 43 → 717 Failed, 44 → 733 Passed, 60 → 1000 Passed. A synthetic helper test covers 18/25 = exactly 720 and 1439/2000 rounding to 720 while still failing. Results and home show: “Practice score uses equal-weight question scoring; it is not an official certification score.”

Blank responses are unanswered. Every nonblank nonexact set is incorrect, including partial selections:

```text
correct + incorrect + unanswered = 60
```

Time used equals submission minus start, bounded at zero and capped at the fixed deadline. Late recovery does not add extra exam time.

### Domains and practice feedback

All seven domains use the frozen dataset and shared grader. Each shows correct/total and percentage.

“Focus your review here” lists up to three domains below 100%, ordered by unrounded percentages. Ties retain snapshot order. This is practice feedback, not a certification prediction. A fully correct attempt has no weakest-domain recommendation.

### Filters and expandable reviews

Filters are **All**, **Incorrect**, **Unanswered**, and **Flagged**, with counts and pressed states. Incorrect excludes blanks. Flags remain independent. Empty filters show a clear empty state.

Native question disclosures start collapsed and support keyboard operation. Detailed Markdown mounts when expanded. Each review includes:

- Original question ID, position, domain, outcome, and independent flag. No incomplete-selection badge or separate partial status.
- Exact stored stem and ordered options.
- Student selections and complete correct selections.
- Reviewed overall explanation and every option explanation.
- Course title, exact section heading, and supplied source link.

Selected-correct, selected-incorrect, and missed-correct options have distinct text, symbols, and colour. Multiple-response reviews identify the complete required set and present the supplied explanation of why it qualifies. No runtime source quotations or explanations are generated.

Attempt history and Start new attempt use established navigation. Reopened reports retain their snapshots and begin with collapsed reviews.

## 9. Accessibility and responsive layouts

Shared styles use a centered reading column, neutral background, white cards, readable text, teal primary controls, visible focus, and generally 44px-or-larger interactive targets.

Markdown supports GFM tables and fenced code. Raw question HTML is not executed. Wide tables scroll within labelled, keyboard-focusable regions rather than producing page-wide horizontal scrolling. Long prose and URLs wrap.

Dialogs provide labels, trapped focus, Escape, heading focus, and restoration. Question navigation and Results entry focus headings. Native disclosures provide expand/collapse behavior. Viewport changes retain selections, flags, position, and deadline.

| Configuration | Recorded size |
| --- | --- |
| Small mobile | 320 × 700 |
| Mobile | 390 × 844 |
| Tablet | 768 × 1024 |
| Desktop | 1366 × 768 |
| Mobile landscape | 700 × 320 |
| Enlarged text | 320 × 700 with 24px body text |

Verification covers keyboard interaction, table scrolling, touch, reduced motion in Exam checks, long narratives, quotes, multiple responses, expanded explanations, and source URLs. Screenshots were inspected; page-wide overflow checks passed.

## 10. Error handling and recovery

| Condition | Behavior |
| --- | --- |
| Bank loading | Loading message; new start unavailable |
| Bank missing, malformed, incomplete, or unreviewed | New starts blocked; retry offered |
| Unsafe/unreadable history | Error and retry; new starts paused to protect records |
| Empty history | Clear browser-local empty state |
| Failed answer/flag/navigation write | Error shown; unsuccessful UI change not committed |
| Failed unfinished-attempt replacement | Prior records restored where storage permits; recovery feedback |
| Damaged saved record | Rejected with an error |
| Refresh during Exam | Resume restores selections, flags, position, snapshot, and deadline |
| Expired saved attempt | Shared finalization and Results |
| Failed submission write | Confirmation error and retry |
| Repeated submission/expiry events | Existing submitted record and result preserved |
| Updated loaded bank | Old snapshots retained; fresh starts use validated loaded data |
| Empty Results filter | Explicit empty state |

Storage failures, damaged indexes, replacement rollback, and retry behavior have unit/browser evidence. Missing reviewed content is not invented to bypass validation.

## 11. Testing and verification

### Latest full verification

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Exit 0 | `test-results/results-checks.txt` |
| Vitest | 35 passed; 7 files | Same log |
| Production build | Exit 0 | Same log; `dist/` |
| Playwright / Chromium | 60 passed | Same log |
| Browser last-run state | Passed; no failed tests | `test-results/.last-run.json` |
| Dataset/reference hashes | Match recorded values | Rechecked for this consolidation |

The recorded build contains approximately **506.28 kB** minified JavaScript (**151.38 kB** gzip) and **18.43 kB** CSS (**4.59 kB** gzip). Vite's JavaScript chunk-size warning above 500 kB is nonblocking; the build succeeds.

### Unit test inventory

| File | Tests | Coverage |
| --- | ---: | --- |
| [tests/bank.test.ts](tests/bank.test.ts) | 5 | Bank validation and invalid content |
| [tests/attempt.test.ts](tests/attempt.test.ts) | 15 | Exact scoring, limits, snapshot/persistence rules, replacement, submission, and legacy grades |
| [tests/markdown.test.tsx](tests/markdown.test.tsx) | 1 | Markdown and raw HTML nonexecution |
| [tests/realBank.test.ts](tests/realBank.test.ts) | 2 | Actual reviewed bank and single/multiple grading |
| [tests/results.test.ts](tests/results.test.ts) | 9 | Independent totals, filters, priorities, time, snapshots, four practice examples, exact/unrounded threshold |
| [tests/courses.test.ts](tests/courses.test.ts) | 2 | Course-pair deduplication, course-only fields, ten courses from 100 references |
| [tests/approvedContent.test.ts](tests/approvedContent.test.ts) | 1 | All approved stems/options/IDs/order/counts and reference hash |
| **Total** | **35** | |

### Browser test inventory

| File | Cases | Coverage |
| --- | ---: | --- |
| [tests/browser/foundation.spec.ts](tests/browser/foundation.spec.ts) | 8 | Complete real flow across layouts, enlarged text, touch, and snapshots |
| [tests/browser/exam.spec.ts](tests/browser/exam.spec.ts) | 11 | Cardinality, controls, persistence, expiry, suspended-clock recovery, storage, focus, and layouts |
| [tests/browser/start.spec.ts](tests/browser/start.spec.ts) | 8 | Repeated starts, replacement, loading/errors, history, refresh, expiry, and old reports |
| [tests/browser/review.spec.ts](tests/browser/review.spec.ts) | 11 | Statuses, flags, focus, jumps, cancellation, submission races/retries, and layouts |
| [tests/browser/results.spec.ts](tests/browser/results.spec.ts) | 9 | Known totals, filters, explanations/sources, updated bank/new attempt, and six layouts |
| [tests/browser/ui-update.spec.ts](tests/browser/ui-update.spec.ts) | 13 | Drawer layout/focus/links/scroll/dismissal/loading/retry/touch, unchanged storage, insufficient-selection refresh/grading, four legacy scores and original snapshots |
| **Total** | **60** | |

The suite covers Start → Exam → Review → Results, refresh recovery, deadline expiry, saved reports, and a new attempt after a dataset update. Controlled clocks test expiry without waiting 120 real minutes.

### Successive phase totals

| Stage | Unit tests | Chromium cases | Other checks |
| --- | ---: | ---: | --- |
| Timed Exam completion | 20 passed | 27 passed | TypeScript/build passed |
| Review completion | 23 passed | 38 passed | TypeScript/build; review-specific 11-case and responsive 6-case reruns passed |
| Results and full-flow completion | 28 passed | 47 passed | TypeScript/build and approved content integrity passed |
| Course drawer and practice score update | 35 passed | 60 passed | TypeScript/build; source/course counts, threshold, persistence, accessibility and screenshots |

These are successive suite totals, not numbers to add together. Supplementary reruns repeat covered cases. Current 35/60 results supersede older totals.

Earlier reports reference `test-results/exam-checks.txt` and `test-results/review-checks.txt`; those raw logs are absent from the current output directory. Historical reports remain. The retained latest full log includes regressions for all implemented screens.

### Fixes and environment notes

Verification prompted fixes for timer-driven Markdown remounting, review opener restoration after ordinary navigation, dialog scroll reset, restrictive browser-default dialog widths, and narrow status labels. Final checks passed after these fixes.

The shell runner was unavailable during implementation, so package CLI entry points ran through Node. An existing development server returned stale optimized-dependency errors; browser verification used an isolated production preview. The passing recorded suite tests the production build. For the current update, all 60 browser tests passed against an isolated production preview on 4178. The first run had a stale percentage-in-history assertion; it was updated to the required practice-score behavior. A focused passing rerun captured the score cards and completed history at all six sizes. No production UI defects remained after screenshot inspection.

## 12. Independent grading and content integrity

### Synthetic known-answer results

The Results fixture is explicitly synthetic and test-only. It includes reordered correct multiple selections, correct single answers, partial sets, wrong multiple sets, wrong singles, explicit empty arrays, and absent responses.

| Domain | Correct / total | Percentage |
| --- | --- | --- |
| D1 | 2 / 8 | 25% |
| D2 | 3 / 13 | 23.1% |
| D3 | 0 / 7 | 0% |
| D4 | 5 / 10 | 50% |
| D5 | 7 / 7 | 100% |
| D6 | 2 / 9 | 22.2% |
| D7 | 1 / 6 | 16.7% |
| **Overall** | **20 / 60** | **33.3%** |

Expectations are specified independently of the app's grader: **20 correct + 8 incorrect + 32 unanswered = 60**. Domain correct counts sum to 20 and totals to 60. Priorities are D3, D7, D6.

Known manual time is **00:37:42**. Delayed expiry reports **02:00:00**. A fully correct attempt is 60/60 and has no weakest-domain recommendation.

Browser tests check these values, all filters, independent flags, consolidated pre-submit unanswered status, selected-correct/selected-incorrect/missed-correct markers, exact explanations/sources, empty Flagged state, and keyboard disclosures. A fresh `fixture-2` attempt uses changed content and keys while its `fixture-1` report remains structurally unchanged.

### Approved Markdown comparison

The approved source was located at:

```text
C:/Users/HP/Downloads/PCAO-F-Full-Mock-60-Questions.md
```

Its checksum matches the correction report. The unchanged repeatable test reference is [tests/fixtures/approved-question-content.md](tests/fixtures/approved-question-content.md).

The integrity test parses all 60 approved question blocks and compares IDs, selection counts, exact Markdown stems, and ordered option IDs/text with runtime JSON. Every comparison passes, including corrected Q23/Q24 and unchanged Q45. Runtime questions also match the reviewed JSON copy exactly.

### Historical audit versus current app tests

The original correction report records review against ten supplied course files, 100 exact section references, numerical-condition checks, 1,296 option-subset/correct-set-permutation cases, and rejection of 11 invalid fixtures.

Those **1,296 cases used a standalone reference scorer**, not the app's Vitest suite. They are historical data-audit evidence. That audit used supplied local course text without live-site revalidation. Current app validator/grader tests are separate.

The correction report's old “App handoff: still required” list is now satisfied: runtime bank placement, actual validation, tests/typecheck/build, fetch/scoring behavior, frozen old reports/new versions, and reviewed-attempt enablement are complete. Its old wording is not a current blocker.

## 13. Screenshots and evidence

Screenshot filenames reused by regression tests may have been refreshed by later runs. Phase reports retain the historical test totals.

All families below are under `screenshots/`:

| Evidence | Filename family |
| --- | --- |
| Current Start | `updated-home-{320,390,768,1366,landscape,enlarged}.png` |
| Course drawer, initial and scrolled | `source-courses-{size}.png`, `source-courses-scrolled-{size}.png` |
| Passing Results and score cards | `practice-passed-{size}.png`, `practice-score-cards-{size}.png` |
| Practice history | `practice-history-{size}.png` |
| Start confirmation/enlargement | `start-confirmation-320.png`, `start-enlarged-320.png` |
| Completed history | `start-history-1366.png` |
| Exam narrative | `exam-narrative-{320,390,768,1366,landscape,enlarged}.png` |
| Exam table/quotation | `exam-table-{320,390,768,1366,landscape,enlarged}.png` |
| Review grid | `review-submit-{320,390,768,1366,landscape,enlarged}.png` |
| Confirmation | `submit-confirmation-{320,390,768,1366,landscape,enlarged}.png` |
| Results overview | `results-overview-{320,390,768,1366,landscape,enlarged}.png` |
| Domains | `results-domains-{320,390,768,1366,landscape,enlarged}.png` |
| Expanded question | `results-question-{320,390,768,1366,landscape,enlarged}.png` |
| Sources | `results-sources-{320,390,768,1366,landscape,enlarged}.png` |

For these current families, `{size}` is 320, 390, 768, 1366, landscape, or enlarged. The changed home, drawer, review/confirmation, Results and history were inspected at all six configurations; card captures expose the full score in landscape. Body content scrolls while drawer heading/Close and dialog actions remain reachable. No page-wide overflow or clipped controls were found.

Direct examples:

- [Current home mobile](screenshots/updated-home-320.png)
- [Drawer mobile](screenshots/source-courses-320.png)
- [Drawer desktop](screenshots/source-courses-1366.png)
- [Practice score desktop](screenshots/practice-passed-1366.png)
- [Practice history mobile](screenshots/practice-history-320.png)
- [Exam narrative mobile](screenshots/exam-narrative-320.png)
- [Exam table desktop](screenshots/exam-table-1366.png)
- [Review mobile](screenshots/review-submit-320.png)
- [Confirmation desktop](screenshots/submit-confirmation-1366.png)
- [Results mobile](screenshots/results-overview-390.png)
- [Results desktop](screenshots/results-overview-1366.png)
- [Domains mobile](screenshots/results-domains-320.png)
- [Expanded question desktop](screenshots/results-question-1366.png)
- [Sources enlarged](screenshots/results-sources-enlarged.png)
- [Latest full verification log](test-results/results-checks.txt)

## 14. Local setup and commands

Run commands from the repository root with Node/npm available.

### Install and develop

```powershell
npm ci
npm run dev
```

### Verify

```powershell
npm run typecheck
npm test
npm run build
npm run test:browser
```

Install Chromium if missing:

```powershell
npx playwright install chromium
```

The checked-in Playwright configuration uses the development server at `http://127.0.0.1:4173` and may reuse an existing server outside CI.

### Production preview

```powershell
npm run build
npm run preview -- --port 4178
```

Open `http://127.0.0.1:4178` while the preview process runs.

### Equivalent entry points used for recorded checks

```powershell
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run --configLoader runner
node node_modules/vite/bin/vite.js build --configLoader runner
node node_modules/@playwright/test/cli.js test --config playwright.ui-update.config.ts
```

`playwright.ui-update.config.ts` targets the separately running production preview on port 4178 with two workers and does not launch its own server. The normal browser-test config still uses port 4173. Historical temporary configs describe earlier phases.

## 15. Remaining work and maintenance

### Remaining delivery work

Publishing is deferred. This implementation establishes no public deployment, public URL, or hosting configuration. Deployment checks belong to the later publishing step.

No current-bank integration prerequisite remains for local use. The reviewed dataset passes actual validation, integrity, scoring, and full-flow checks.

### Verification limits

Browser evidence is for Chromium, not Firefox or WebKit. Keyboard, touch, focus, and native disclosure behavior were exercised; a formal independent accessibility audit is not recorded.

Attempts are browser-local. Clearing storage removes local records. Cloud backup/account synchronization is not implemented.

The nonblocking bundle-size warning remains; optional optimization is separate from completed functional work. Concurrency evidence covers repeated clicks and the tested overlapping expiry/manual events, not a backend or cross-device transaction system.

### Maintenance rules

Preserve approved Markdown, order, corrected Q23/Q24, and unchanged Q45. Never invent real keys, explanations, or sources. Keep synthetic fixtures outside runtime data.

Version future content/key/explanation/source changes. Require a complete reviewed validated bank for new attempts. Old attempts must continue using frozen snapshots.

Use two-space indentation, semicolons, strict types, functional React components, PascalCase component filenames, and `*.test.ts(x)` unit tests. Match nearby formatting; no formatter/linter is configured.

Add meaningful tests for scoring, validation, persistence, or snapshot changes. For UI changes, verify documented sizes, keyboard access, touch targets, overflow, and screenshots. Run type checking, unit tests, build, and relevant browser coverage.

Git is initialized locally on `main`; `origin` targets `https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam.git`. A remote push is not yet confirmed. Use short imperative commit subjects. Future PRs should explain behavior/data changes, checks, and mobile/desktop evidence.

## 16. Source records

| Record | Role |
| --- | --- |
| [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md) | Functional/data/persistence/responsive contract |
| [AGENTS.md](AGENTS.md) | Repository guidelines and current status |
| [EXAM_VERIFICATION.md](EXAM_VERIFICATION.md) | Historical Exam verification |
| [REVIEW_VERIFICATION.md](REVIEW_VERIFICATION.md) | Historical Review verification |
| [RESULTS_VERIFICATION.md](RESULTS_VERIFICATION.md) | Historical Results/full-flow verification |
| [question-bank-validation-report.md](question-bank-validation-report.md) | Historical correction/content audit |
| [README.md](README.md) | Quick local setup |
| [package.json](package.json) and [package-lock.json](package-lock.json) | Commands and locked dependencies |
| [test-results/results-checks.txt](test-results/results-checks.txt) | Retained full verification output |
| [tests/fixtures/approved-question-content.md](tests/fixtures/approved-question-content.md) | Approved content reference |

This unified record reconciles those documents with current source helpers, dataset statistics, hashes, lockfile, test inventory, and available evidence. Original reports remain unchanged. It does not replace runtime data or generate new question-review material.
