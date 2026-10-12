# PCAO-F practice implementation specification

## Scope and status

This is an independent, frontend-only practice app. Attempts live in the visitor's browser. The approved flow has a start page, timed exam page, review-and-submit dialog, and results page with expandable question reviews. The app implements the data and attempt foundation, shared responsive primitives, and all four approved views.

The runtime bank is the reviewed version 1.1.0 file. It passed the app validator and retains every stem, option, selection count, and primary domain from the supplied draft; the separate correction report documents its answer review. Synthetic content remains only under `tests/fixtures/`. New attempts require a complete validated bank. Preserve the approved wording, tables, quotations, option order, corrected Q23 and Q24, and unchanged Q45.

## Runtime data contract

`public/question-bank.json` is fetched at runtime. It contains `schemaVersion` (currently 1), stable `examId`, publisher `version`, `title`, `durationMinutes` (120), `expectedQuestionCount` (60), `contentStatus` (`pending`, `synthetic`, or `reviewed`), ordered `domains`, and ordered `questions`. Domain objects have stable `id`, `title`, and `expectedQuestionCount`. Exact domain counts are D1=8, D2=13, D3=7, D4=10, D5=7, D6=9, D7=6.

Each question has a stable `id`, `primaryDomain`, `selectionCount`, `stemMarkdown`, ordered `options` with stable `id` and `textMarkdown`, `correctOptionIds`, `explanationMarkdown`, `optionExplanations` keyed by every option ID, and at least one `sources` item with `courseTitle`, `sectionHeading`, and optional absolute `url`. Render stable option IDs as visible labels and preserve the supplied Markdown text and array order. Publish a new dataset version when any question, key, explanation, or source changes.

The validator checks required fields, duplicate IDs, known domain references, option IDs, selection counts, answer cardinality, question count and domain totals. Only `contentStatus: "reviewed"` is allowed for real attempts. The loading and error states explain unavailable data. Markdown uses GFM tables and fenced code blocks. Raw HTML is not executed. Wide tables scroll in labelled, keyboard-focusable containers.

Editing a local JSON file does not update the public app. An updated file becomes public only when a build containing it is deployed.

## Attempts and scoring

An attempt stores its ID, start and fixed deadline timestamps, status, current question, answers keyed by question ID, flags, dataset version, and a frozen copy of the validated bank. Submitted attempts additionally store submission timestamp, reason (manual or time expired), and a grading result calculated from their saved selections and snapshot. Recovery validates saved grading results; older submitted records without a stored result still grade from their frozen snapshot. Browser storage recovery validates the saved snapshot and rejects damaged records. Existing attempts use their snapshots for answering, grading, and later review; updated public data is only used by new attempts.

Before submission, the only answer states are Answered (exact required cardinality) and Unanswered (zero or fewer than required selections). The Exam counter, review grid and confirmation use the shared selection-status helper. Flags and current-question markers remain independent. The persistent Exam bar counts a question as answered only when it has exactly the required number of options selected, regardless of correctness. Radio choices can be cleared; checkbox choices can be deselected and cannot exceed the required maximum. Answers, flags, and position save immediately. Domain labels, explanations, and sources stay hidden during the exam.

Remaining time is computed from the fixed deadline. The clock refreshes on interval, visibility, window focus, and page-show events and continues through review and attempt history. Reopening the app automatically finalizes expired saved attempts through the shared idempotent submission helper and opens Results. An edit at the deadline triggers the same finalization without changing recorded answers. Question navigation focuses the question heading. Timer updates do not announce every tick or remount Markdown tables. A question earns one point only when the chosen option IDs exactly match the correct set, independent of order. Blank, partial, and incorrect selections earn zero. Practice score is Math.round((correct / total) * 1000). Practice Passed/Failed uses the unrounded comparison correct * 1000 >= 720 * total. Results headline the score out of 1000, a green Passed or red Failed text badge, and “Passing score: 720 / 1000.” Correct/total and overall percentage are secondary; domain percentages remain. The concise note is “Practice score uses equal-weight question scoring; it is not an official certification score.” History derives the same values from each original snapshot and correct count, without migrating stored grades. Submission is idempotent, including after browser recovery.

Results classifies blanks as unanswered and nonblank nonexact sets as incorrect, including fewer than required selections. The three result counts partition 60 questions. Time used is saved start-to-submission time capped at the deadline. All seven domains show snapshot-based correct/total counts and percentages. Practice priorities list up to three domains below 100%, ordered by unrounded percentages with ties following snapshot order.

Results filters are All, Incorrect, Unanswered and Flagged. Native question disclosures start collapsed and show original IDs, exact frozen Markdown, selected and correct sets, reviewed overall and option explanations, and supplied course titles, exact section headings and links. Selected-correct, selected-incorrect and missed-correct options have text, symbols and colour; there is no separate incomplete-selection badge or category. Selected and correct options remain visible. No runtime explanations or readiness assessments are generated.

## Home source courses and submission confirmation

A visible “Source courses” button near the introduction opens “Courses used for this mock.” A domain helper deduplicates validated question sources by course title and URL pair, retaining first occurrence order and returning only these course-level fields. The reviewed bank produces ten linked courses from 100 references. No question content, section-level references, domains, keys or explanations appear in the drawer.

Introduction: “These practice questions were independently written using concepts from the courses below. Individual question references are available after submission.” This does not imply copied scenarios, official questions or proven correctness.

Use a right-side desktop panel and full-width narrow-mobile panel. Reuse modal focus trapping, initial heading focus, Close, Escape and opener restoration; provide backdrop dismissal where a backdrop is visible. Keep the heading and Close reachable while the body scrolls. Label course links by title, with safe new-tab rel attributes. Show loading and unavailable-bank states with retry. Opening or closing the drawer does not create an attempt, start a timer or change history.

Confirmation shows one consolidated unanswered count and explains that this includes questions without the required number of selections. Deliberate submission remains allowed. Checkbox limits, exact-number instructions and the neutral selection counter remain unchanged.

## Responsive and accessible interface

Use a centred reading column, light neutral background, white cards, subtle borders, one teal accent, and readable sans-serif text. Shared container, card, button, Markdown, and dialog primitives are responsive from 320px upward. Body text is about 16px, controls target at least 44px, focus is visible, text and URLs wrap, and page-wide horizontal scrolling is avoided. Tables may scroll inside labelled containers. Dialog content scrolls within the viewport while actions remain reachable. Support touch, mouse, keyboard, portrait and landscape, safe areas, and enlarged text. Viewport changes must not reset answers, flags, timer, or question position.

Across the four views: stack exam details and history on narrow screens; keep timer, progress, answer cards, and all navigation actions accessible; adapt the review grid and show answered, consolidated unanswered, flagged, and remaining-time details; stack results and domain summaries, wrap filters, and keep expanded explanations and source references readable.

## Verification and handoff

Run typecheck, unit tests, and production build. When a browser is available, inspect every implemented screen and dialog at 320, 390, 768, and 1366 pixels, plus mobile landscape and enlarged text. Test interactions, capture mobile and desktop screenshots, inspect them, and fix visible defects. Exam-screen verification uses a lengthy narrative, long options, wide table, multiple-response item, and expanded explanations with source references. Report viewport and interaction coverage, screenshot paths, fixes, and any unverified behavior. Publishing is outside this phase.
