# PCAO-F Practice — Unified Implementation and Project Status

**Status date:** 2026-10-13\
**Project:** Independent PCAO-F Practice  
**Workspace:** `C:\Users\HP\OneDrive\Desktop\PCAO-F`  
**Delivery state:** User-approved difficulty UI and both reviewed banks integrated and verified locally. Publishing remains a separate step.

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
Start → Choose difficulty → Timed Exam → Review and submit → Confirmation → Results
  ↑          ↑             │
  │          └── Question jump / Back to exam
  └── Attempt history / Open report / Start new attempt

Expiry during an active attempt or either review step → Results
Reopening an expired saved attempt → Shared finalization → Results
```

| Area | Status |
| --- | --- |
| Runtime banks | Advanced 1.1.0 and Intermediate 1.0.0, independently reviewed and validated |
| Exam size and duration | 60 questions; 120 minutes |
| Start and browser-local history | Implemented |
| Timed Exam | Implemented |
| Review grid and submission confirmation | Implemented |
| Results overview, domains, filters, and question reviews | Implemented |
| Persistence and frozen snapshots | Implemented |
| Exact-set grading and idempotent submission | Implemented |
| Responsive, keyboard, and touch behavior | Verified in Chromium at the recorded sizes |
| TypeScript | Passed |
| Unit tests | 55 passed across 8 files |
| Browser tests | 101 Chromium cases passed in one final full run across 9 files |
| Production build | Passed; generated output in `dist/` |
| Difficulty selection | Both levels available; Advanced defaults, Intermediate loads the supplied Easy bank |
| Intermediate integration | Complete; real starts, snapshots, grading, reports and courses verified |
| Publishing | Not performed |

Latest Intermediate integration verification on **2026-10-13** passed TypeScript, 55 unit tests, build and all 101 Chromium cases in one final run. Evidence is [INTERMEDIATE_INTEGRATION_VERIFICATION.md](INTERMEDIATE_INTEGRATION_VERIFICATION.md) and `test-results/intermediate-{typecheck,unit-tests,build,browser-checks}.txt`. Both banks are enabled; runtime/built hashes are unchanged. The updated production preview on port 4210 remains running. No deployment occurred.

The earlier difficulty-selection verification on **2026-10-13** passed TypeScript, 53 unit tests, production build and all 95 Chromium cases in one final full run. The production preview on `http://127.0.0.1:4210` is left running for UI review. Evidence and screenshots are recorded in [DIFFICULTY_MAPPING_CORRECTION.md](DIFFICULTY_MAPPING_CORRECTION.md); raw logs are `test-results/difficulty-{typecheck,unit-tests,build,browser-checks}.txt`. The second reviewed bank is pending after UI approval; no question content or deployment was added.

The earlier reliability-fix verification completed on **2026-10-13**: TypeScript, 46 unit tests, and production build passed; all 83 Chromium cases passed in one full run against a fresh production preview on `http://127.0.0.1:4192`. The preview was stopped afterward. Evidence is `test-results/reliability-fix-checks.txt`. The earlier QA-fix verification on 2026-10-12 passed 35 unit tests and 74 browser cases across its full run and corrected touch rerun, using port 4180. Earlier UI-update and Results previews used 4178 and 4177. These are local checks; no public deployment is established.

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
| [src/domain/browserStorage.ts](src/domain/browserStorage.ts) | Shared Web Lock for browser storage mutations across tabs |
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

### Advanced runtime inventory

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

### Intermediate runtime inventory

`public/easy-question-bank.json` is reviewed version 1.0.0, exam ID `pcao-f-practice-easy-01`, with the supplied title Independent PCAO-F Practice — Easy. It contains 60 questions, 120 minutes, 48 single-answer/10 select-two/2 select-three items, 252 options, complete explanations and 70 source entries that deduplicate to ten courses. Its domain distribution matches the shared contract below. SHA-256 is `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`; the build copy matches. The two banks remain separate, with one bank frozen per attempt.

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

An attempt stores its ID, revision, start timestamp, fixed deadline, status, current question ID, selections keyed by question ID, flags, dataset version, and a frozen validated bank snapshot. Older records without a revision are still readable and use revision 0 for the next edit; no snapshot or grade migration is required. Browser writes hold a shared Web Lock, enforce the latest revision and submitted status, and synchronize other tabs through storage events. Existing indexed records use one write; failed multi-write additions roll back successful writes.

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

Submit exam opens concise confirmation showing one consolidated unanswered count, including questions without the required number of selections, and a reminder for any flagged questions (including answered items). Students may deliberately submit those responses. Correctness is not disclosed before finalization.

Confirming saves selections, submission metadata, and grade once, locks the record, and opens Results. Cancel returns to review. Escape closes review or returns from confirmation to review before finalization.

The clock continues through both steps. The modal shows the only visible countdown; the background header countdown is concealed until returning to the exam. Expiry takes precedence and finalizes without confirmation. A failed submission write remains visible within confirmation and allows retry.

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
| Refresh or browser navigation during an unexpired saved attempt | Native leave confirmation where supported; accepting reload returns home and Resume restores selections, flags, position, snapshot, and deadline |
| Attempt history from Exam | Leave exam dialog warns that time continues; cancellation restores focus, confirmation preserves the attempt; home explicitly reminds that the timer runs |
| Expired saved attempt | Shared finalization and Results |
| Failed submission write | Confirmation error and retry |
| Repeated submission/expiry events | Existing submitted record and result preserved |
| Updated loaded bank | Old snapshots retained; fresh starts use validated loaded data |
| Empty Results filter | Explicit empty state |

Storage failures, damaged indexes, replacement rollback, and retry behavior have unit/browser evidence. Missing reviewed content is not invented to bypass validation.

## 11. Testing and verification

### Latest Intermediate integration verification

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Exit 0 | `test-results/intermediate-typecheck.txt` |
| Vitest | 55 passed; 8 files | `test-results/intermediate-unit-tests.txt` |
| Production build | Exit 0 | `test-results/intermediate-build.txt`; `dist/` |
| Playwright / Chromium | 101 cases passed in one final full run; 9 files | `test-results/intermediate-browser-checks.txt` |
| Browser last-run state | Passed; no failed tests | `.localtest/difficulty/browser-artifacts/.last-run.json` |
| Dataset/reference hashes | Match recorded values | Rechecked for this consolidation |

The recorded build contains approximately **517.03 kB** minified JavaScript (**154.38 kB** gzip) and **20.49 kB** CSS (**4.95 kB** gzip). Vite's JavaScript chunk-size warning above 500 kB is nonblocking; the build succeeds.

### Unit test inventory

| File | Tests | Coverage |
| --- | ---: | --- |
| [tests/bank.test.ts](tests/bank.test.ts) | 5 | Bank validation and invalid content |
| [tests/attempt.test.ts](tests/attempt.test.ts) | 29 | Exact scoring, limits, snapshots, replacement, submission, legacy grades/revisions, stale writes, rollback, expired starts, and valid timestamp metadata |
| [tests/markdown.test.tsx](tests/markdown.test.tsx) | 1 | Markdown and raw HTML nonexecution |
| [tests/realBank.test.ts](tests/realBank.test.ts) | 4 | Both reviewed banks, Intermediate hash/catalog, single/multiple grading and frozen difficulty |
| [tests/results.test.ts](tests/results.test.ts) | 9 | Independent totals, filters, priorities, time, snapshots, four practice examples, exact/unrounded threshold |
| [tests/courses.test.ts](tests/courses.test.ts) | 2 | Course-pair deduplication, course-only fields, ten courses from 100 references |
| [tests/approvedContent.test.ts](tests/approvedContent.test.ts) | 1 | All approved stems/options/IDs/order/counts and reference hash |
| [tests/difficulty.test.ts](tests/difficulty.test.ts) | 4 | Availability, independent requests/cache, out-of-order completion and retry |
| **Total** | **55** | |

### Browser test inventory

| File | Cases | Coverage |
| --- | ---: | --- |
| [tests/browser/foundation.spec.ts](tests/browser/foundation.spec.ts) | 8 | Complete real flow across layouts, enlarged text, touch, and snapshots |
| [tests/browser/exam.spec.ts](tests/browser/exam.spec.ts) | 11 | Cardinality, controls, persistence, expiry, suspended-clock recovery, storage, focus, and layouts |
| [tests/browser/start.spec.ts](tests/browser/start.spec.ts) | 8 | Repeated starts, replacement, loading/errors, history, refresh, expiry, and old reports |
| [tests/browser/review.spec.ts](tests/browser/review.spec.ts) | 11 | Statuses, flags, focus, jumps, cancellation, submission races/retries, and layouts |
| [tests/browser/results.spec.ts](tests/browser/results.spec.ts) | 9 | Known totals, filters, explanations/sources, updated bank/new attempt, and six layouts |
| [tests/browser/ui-update.spec.ts](tests/browser/ui-update.spec.ts) | 13 | Drawer layout/focus/links/scroll/dismissal/loading/retry/touch, unchanged storage, insufficient-selection refresh/grading, four legacy scores and original snapshots |
| [tests/browser/audit-fixes.spec.ts](tests/browser/audit-fixes.spec.ts) | 14 | Answered flags (0/1/multiple), native refresh/Back warnings, cancellation/recovery, six leave-dialog layouts, expiry and controlled elapsed-time checks |
| [tests/browser/persistence-fixes.spec.ts](tests/browser/persistence-fixes.spec.ts) | 9 | Stale/simultaneous tabs, report synchronization, Start-page expiry, stable index writes, initial rollback, damaged dates, and unsupported saving |
| [tests/browser/difficulty.spec.ts](tests/browser/difficulty.spec.ts) | 18 | Six selector layouts, real Intermediate flows, both-bank snapshots, replacement/back, expiry, sources, legacy reports, touch, errors/retry and response races |
| **Total** | **101** | |

The suite covers Start → Exam → Review → Results, refresh recovery, deadline expiry, saved reports, and a new attempt after a dataset update. Controlled clocks test expiry without waiting 120 real minutes.

### Successive phase totals

| Stage | Unit tests | Chromium cases | Other checks |
| --- | ---: | ---: | --- |
| Timed Exam completion | 20 passed | 27 passed | TypeScript/build passed |
| Review completion | 23 passed | 38 passed | TypeScript/build; review-specific 11-case and responsive 6-case reruns passed |
| Results and full-flow completion | 28 passed | 47 passed | TypeScript/build and approved content integrity passed |
| Course drawer and practice score update | 35 passed | 60 passed | TypeScript/build; source/course counts, threshold, persistence, accessibility and screenshots |
| QA audit fixes | 35 passed | 74 cases passed across full run and touch rerun | TypeScript/build passed; native leave warnings, flags, one visible clock, loading and elapsed-time regressions |
| Reliability fixes | 46 passed | 83 passed in one full run | TypeScript/build; shared locks and revisions, Start expiry, write consistency, timestamp recovery and stable test clocks |
| Difficulty selection | 53 passed | 95 passed in one final full run | TypeScript/build; dialog, selected bank/difficulty, legacy recovery, layouts and corrected synchronization waits |
| Intermediate integration | 55 passed | 101 passed in one final full run | TypeScript/build; both real banks, independent availability, snapshots, replacement, sources and retries |

These are successive suite totals, not numbers to add together. Supplementary reruns repeat covered cases. Current 55/101 coverage supersedes the earlier 53/95, 46/83, 35/74 and 35/60 snapshots; the QA-fix full run had one outdated touch navigation expectation, corrected and passed on a focused rerun.

Earlier reports reference `test-results/exam-checks.txt` and `test-results/review-checks.txt`; those raw logs are absent from the current output directory. Historical reports remain. The retained `results-checks.txt` preserves the earlier clean 60-case full run. Previous QA-fix results and the corrected touch rerun are retained in `qa-audit-fix-checks.txt`.

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
| Leave exam warning | `leave-exam-{320,390,768,1366,landscape,enlarged}.png` |
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
- [QA-fix verification log](test-results/qa-audit-fix-checks.txt)
- [Earlier clean full verification log](test-results/results-checks.txt)

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

Git attributes pin both reviewed runtime banks and the approved Markdown reference to LF. Their index bytes match the reviewed source hashes, and focused real-bank/content-integrity checks passed before the requested commit and push. These rules preserve checksums across Windows and Unix checkouts.

### Remaining delivery work

Difficulty UI approval, data validation and Intermediate integration are complete. Both reviewed banks are usable locally.

Vercel deployment is authorized and its configuration is prepared, but no public deployment, live URL, or production smoke verification is established. Deployment remains a separate delivery step.

No current-bank integration prerequisite remains for local use. The reviewed dataset passes actual validation, integrity, scoring, and full-flow checks.

### Verification limits

Browser evidence is for Chromium, not Firefox or WebKit. Keyboard, touch, focus, and native disclosure behavior were exercised; a formal independent accessibility audit is not recorded.

Attempts are browser-local. Clearing storage removes local records. Cloud backup/account synchronization is not implemented.

The nonblocking bundle-size warning remains; optional optimization is separate from completed functional work. Concurrency evidence now covers simultaneous same-browser tabs under the shared lock, stale revisions, immutable submitted reports, repeated clicks, and overlapping expiry/manual events. It does not establish backend or cross-device transactions. Saving requires Web Locks; browsers without that API retain read-only report access.

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
| [test-results/results-checks.txt](test-results/results-checks.txt) | Historical clean 60-case full verification |
| [test-results/reliability-fix-checks.txt](test-results/reliability-fix-checks.txt) | Historical 46-unit/83-Chromium reliability verification |
| [test-results/qa-audit-fix-checks.txt](test-results/qa-audit-fix-checks.txt) | Historical QA-fix checks and corrected touch rerun |
| [tests/fixtures/approved-question-content.md](tests/fixtures/approved-question-content.md) | Approved content reference |

This unified record reconciles those documents with current source helpers, dataset statistics, hashes, lockfile, test inventory, and available evidence. Original reports remain unchanged. It does not replace runtime data or generate new question-review material.

## Vercel deployment preparation — 2026-10-12

The user authorized production deployment after the local implementation. Vercel CLI 59.17.0 is installed. Added `vercel.json` with the Vite preset, locked dependency installation (`npm ci`), `npm run build`, and `dist/` output. Added `.vercelignore` to exclude screenshots, tests, diagnostics, historical root bank copies and local helpers; `public/question-bank.json` remains included. Local `.vercel/` project links are Git-ignored.

A fresh production build passed with the existing nonblocking 506 kB bundle warning. The built runtime bank matches the reviewed source checksum. Required build/runtime inputs remain included under the ignore rules. `vercel deploy --dry --json` could not inventory an unlinked project. Both `vercel whoami` and `vercel deploy --prod --yes --project pcao-f-practice-exam` failed with `connect EACCES 34.160.81.0:443` because the sandbox cannot contact Vercel. No project link, deployment URL or production smoke verification is established. The attempt log is `test-results/vercel-deployment-attempt.txt`.

Complete deployment from a terminal with account/network access using `vercel --prod` in the repository root, selecting `pcao-f-practice-exam` when prompted. After a successful deployment, verify the live app and the runtime bank before recording a URL here. At this earlier deployment-preparation step, verification remained 35 unit and 60 Chromium cases; tests were not rerun for deployment-only configuration and documentation changes. The later QA-fix verification is recorded below.

## QA audit fixes — 2026-10-12

Addressed BUG-001 with a flagged-question reminder in final confirmation; BUG-002 with native beforeunload warnings for unfinished, unexpired saved attempts, a focus-managed leave-for-history dialog, and explicit home timer-running copy; BUG-003 by concealing the background countdown while a timed modal is open. The modal countdown remains accessible. Cancelling leaves the attempt unchanged; submission/expiry remove the warning, and expiry closes the leave dialog. Browser-native warnings use browser-supplied text and remain subject to browser support/user activation.

BUG-004 was already correct: a held bank request shows Loading and disables Start, followed by Ready after successful validation; invalid data shows Unavailable. Regression assertions now cover those states. BUG-005 was not reproduced: controlled submission at 92.5 seconds shows 01:58:28 remaining and 00:01:32 used; submission at 103 seconds shows 01:58:17 remaining and 00:01:43 used. Saved report time does not grow during an additional 11 seconds after submission. No scoring, timestamp, schema, bank, or frozen-snapshot rules were changed.

Verification: TypeScript, 35 Vitest tests, and build passed. The full 74-case Chromium run passed 73 cases; an existing touch test needed the new leave-confirmation tap, then passed its focused rerun. Six leave-dialog screenshots and updated review/confirmation captures were inspected at 320, 390, 768, 1366, landscape, and enlarged text; dialog bodies scroll where needed while heading/actions remain reachable. Bank checksum is unchanged.

The sandbox denied Windows process cleanup, stalling initial browser runners. Final checks ran with permission outside the sandbox against the fresh preview on 4180; temporary runners/previews were stopped afterward. Use `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4180 --strictPort` and `node node_modules/@playwright/test/cli.js test --config test-results/qa-audit.playwright.config.ts` to repeat the browser checks. This fix is local; no deployment was performed during the QA-fix work.

## Reliability fixes — 2026-10-13

Resolved the four project-analysis findings. Shared Web Locks serialize browser mutations; optional saved-record revisions reject stale edits, submitted-report changes, and resurrection of replaced attempts. Storage events load newer answers or open the immutable submitted report in other tabs. Pending answer feedback remains immediate while the committed record is kept separately, and failed/conflicting saves reconcile to actual storage.

Saved unfinished attempts are monitored on Start, including after reopening before the deadline. Expiry closes replacement confirmation and opens Results. A new start finalizes expired attempts before replacement, preserving their reports; queued expiry cannot navigate away from a newer attempt.

Existing indexed attempts use a single record write. New additions restore successful writes after a later write failure, with explicit messaging if restoration fails. Recovery rejects unrenderable dates, reversed submission timestamps, incomplete submission metadata and deadline/reason inconsistencies. New timestamps are validated, and submission after a backward clock adjustment is bounded by the start time. Legacy records without revisions or stored grades remain supported.

Controlled browser clocks now install before their pause target. Tests that inspect storage immediately after Start wait for the exam heading, reflecting coordinated asynchronous saving. Final verification passed TypeScript, 46 Vitest tests across 7 files, production build and all 83 Chromium cases across 8 files in one full run. Responsive, keyboard and touch cases cover 320, 390, 768 and 1366 pixels, mobile landscape and enlarged text. New `screenshots/submission-other-tab-320.png` and `screenshots/submission-other-tab-1366.png` were visually inspected; the saved-report message is visible and Results receives focus. Runtime, built-bank and approved-Markdown checksums are unchanged.

Evidence: `test-results/reliability-fix-checks.txt`. The full production-preview run used port 4192 and `.localtest/reliability-fixes/playwright.config.ts`; temporary preview and test processes were stopped. The approximately 511 kB bundle warning remains nonblocking. These fixes are local; no deployment occurred. Earlier phase reports and verification logs remain historical records.

## Project analysis verification — 2026-10-13

A subsequent analysis reran TypeScript, all 46 unit tests and the production build successfully. The unchanged 83-case Chromium suite against a fresh production preview on port 4192 passed 80 cases and failed three. The enlarged-text leave/history test and the snapshot/resize test captured storage immediately after an asynchronous flag request; their baseline lacked the flag that appeared in the later comparison. Both passed a sequential focused rerun. The reload-after-submission test failed again because it reloaded immediately after clicking Confirm submission, before waiting for the Results view and leave-warning cleanup.

Diagnostic copies under `.localtest/project-analysis/` added waits for the committed Flagged control and the Results heading. All three cases passed three repetitions each (9/9). Original app source and test files were not changed. This evidence supports test synchronization defects; it does not establish a new clean run of the unchanged full suite. The earlier 83/83 reliability-fix record remains historical evidence. See [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) for findings and recommended work.

An isolated Chromium profile stored 27 approximately 190,173-character full attempt records before a `QuotaExceededError`. This is a diagnostic capacity observation, not a portable browser limit. Full snapshots and unlimited history make long-term storage management a maintenance concern. Runtime and approved-Markdown hashes remain unchanged. The build produced 510.81 kB JavaScript (152.75 kB gzip) with the existing nonblocking size warning. Mobile and desktop Results screenshots were inspected. No deployment was attempted during this analysis.

## Difficulty selection initial mapping — 2026-10-13 (historical)

All new-start actions open an Intermediate/Advanced segmented-selector dialog with comparison bullets. Intermediate uses the unchanged reviewed bank. Advanced is selectable for UI review, shows Coming soon and cannot start until its separate bank is supplied and enabled. Selection and abandonment confirmation share one modal; cancellation writes nothing, existing timers continue, expiry closes preparation and expired reports are preserved. New attempts save immutable difficulty metadata with their frozen snapshots; Exam, Results and history display it. Legacy records show Original exam and remain readable without migration. Source courses now identify the selected level and never reuse Intermediate links for Advanced.

TypeScript, 53 unit tests across 8 files, build and all 95 Chromium cases across 9 files passed in one final full run. Keyboard, touch, focus, expiry, replacement, failed writes, cross-tab behavior, legacy reports and six layouts are covered. Mobile/desktop panels and scrolled narrow/enlarged layouts were visually inspected. The toggle stacks for enlarged text; heading and actions remain accessible. Bank/reference/built-bank hashes are unchanged. The 516.74 kB bundle warning remains nonblocking.

See [DIFFICULTY_VERIFICATION.md](DIFFICULTY_VERIFICATION.md) for raw logs, screenshots and commands, and [DIFFICULTY_IMPLEMENTATION_PLAN.md](DIFFICULTY_IMPLEMENTATION_PLAN.md) for the approved staged plan. The local production preview on port 4210 is left running for UI review. UI approval and the actual Advanced bank are pending; no deployment was performed. Earlier verification and analysis records remain historical.

## Difficulty bank mapping correction — 2026-10-13

The user confirmed that the existing reviewed bank is Advanced. Advanced now uses `public/question-bank.json`, is selected by default and supports real starts; Intermediate is selectable for UI review but remains Coming soon with Start disabled. Its future bank is reserved at `public/question-bank-intermediate.json`. Source courses default to Advanced and show its ten validated courses; Intermediate displays an availability message. Saved attempts retain their recorded difficulty metadata and frozen snapshots; no migration or bank-content edit was performed.

The corrected mapping passed TypeScript, 53 unit tests, production build and all 95 Chromium cases across 9 files in one final full run. Corrected screenshots were refreshed and mobile/desktop panels inspected. The runtime/built-bank checksum is unchanged. The corrected-mapping log is `test-results/difficulty-mapping-browser-checks.txt`; the initial run and its navigation-wait/filesystem issues are documented in the correction report.

See [DIFFICULTY_MAPPING_CORRECTION.md](DIFFICULTY_MAPPING_CORRECTION.md) for verification and corrected screenshots. UI approval and the Intermediate bank remain pending. The local preview on port 4210 remains available; no deployment was performed.

## Uploaded Intermediate bank validation — 2026-10-13

The user approved the difficulty UI and uploaded `public/easy-question-bank.json`. Running the actual `validateQuestionBank(input)` with reviewed content required returned `ok: true`: schema 1, exam ID `pcao-f-practice-easy-01`, version 1.0.0, reviewed, 60 questions, 120 minutes, prescribed seven domain totals, 48 single-answer/10 select-two/2 select-three items, 252 options and 70 source entries. SHA-256: `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`. No bank, validator or runtime configuration changes were made.

See [EASY_BANK_VALIDATION.md](EASY_BANK_VALIDATION.md) and `test-results/easy-bank-validation.json`. UI approval and data validation are complete; runtime integration is pending. This is a data-contract check, not an independent answer-key review or another full-app test/build. Earlier full-app verification remains 53 unit and 95 Chromium cases.

## Intermediate bank integration — 2026-10-13

Connected the user-supplied reviewed `public/easy-question-bank.json` to Intermediate and enabled both banks. Advanced remains the default and uses the unchanged original file. Both banks load independently; either ready bank permits selection, and each selected bank must validate before starting. Home identifies level/dataset versions and retries failures without blocking the other bank. Source courses use the selected bank. Existing snapshots and difficulty metadata are preserved, including after bank changes and starts at the other level.

Final checks passed TypeScript, 55 unit tests across 8 files, build and all 101 Chromium cases across 9 files in one full run. Actual Intermediate mobile/desktop answering, resume, scoring, frozen reports, cross-level starts, confirmed replacement, touch, missing/invalid bank retry and late-response switching were verified. Six selector layouts and new mobile/desktop screenshots were inspected; extra course-drawer overflow checks passed. Runtime/built hashes for both banks are unchanged.

Evidence: [INTERMEDIATE_INTEGRATION_VERIFICATION.md](INTERMEDIATE_INTEGRATION_VERIFICATION.md) and `test-results/intermediate-{typecheck,unit-tests,build,browser-checks}.txt`. The preview on port 4210 remains running. UI approval and local integration are complete; publishing remains separate. Earlier validation/mapping/Phase 1 records remain historical.
