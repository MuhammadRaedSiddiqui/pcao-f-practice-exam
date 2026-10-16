# BUG-001 — Start dialog double-click reaches Q1

Status: **Fix implemented locally; verification pending**. Verified 2026-10-15 against https://wager-geranium-crafter.ngrok-free.dev/ using headless Chromium, a 1919 × 998 viewport and a fresh isolated guest context for every trial. Analytics and other external-origin traffic were blocked. No account signup/sign-in, cloud report writes or live-account mutations occurred.

## Local fix — 2026-10-15

A startClickPending ref is armed only after a successful saved new/replacement attempt, before the dialog closes. Main's click capture handler cancels continuation clicks with detail greater than 1, preventing the label's default radio activation and delegated change handling. The guard remains armed for triple-click continuations. A new single click (detail 1) or keyboard activation (detail 0) releases it immediately; there is no timed input delay. Leaving Exam resets the guard. The existing start lock, attempt data, deadline and persistence logic remain in place.

Added tests/browser/start-click-through.spec.ts with 18 proposed regression cases: both difficulties at the reported viewport and six required layouts; triple-click plus reload/submission; replacement starts; keyboard and touch with immediate deliberate answer input. Cases assert exactly one attempt, empty saved answers/revision 0 and zero answered before deliberate input. These cases have not run and their behavior is not established.

Automatic approval review rejected the attempted npm run typecheck because the retained user instruction said “do not run confirmation tests” and “do not run browser tests”; the review did not interpret “fix it” as authorization for checks. The command did not execute. No workaround or alternate test execution was attempted. TypeScript and focused browser verification require explicit user approval. No new screenshots, runtime pass, build, deployment, commit or push are claimed. The original reproduction evidence below remains historical evidence from before this change.

## Reproduction results

| Difficulty | Input | Trials | Fresh Q1 result |
| --- | --- | --- | --- |
| Intermediate | Start Exam double-click, Playwright delay 100 ms | 2 | Option B selected in both; 1 / 60 answered |
| Advanced | Same double-click | 2 | No selection in either; 0 / 60 answered |
| Intermediate | Single click control | 1 | Empty answers; 0 / 60 answered |
| Advanced | Single click control | 1 | Empty answers; 0 / 60 answered |

Each context began with no saved attempt. Every trial created exactly one attempt. In the two Intermediate double-click trials, localStorage recorded answers as {"Q1":["B"]}, currentQuestionId Q1 and revision 1. The same answer remained after reload. Single-click controls and Advanced double-click trials retained empty answers and revision 0.

The user's screenshot identifies Intermediate, matching the reproduced case. The report's Advanced wording is not confirmed by these trials. Geometry matters: at this viewport the second Advanced click hits question text instead of an answer. This does not establish safety for other Advanced layouts or timings.

## Event-level cause

The Start Exam button occupied x=1116.5, y=758, width=118, height=44. Its center was (1175.5, 780). The first pointer click targeted Start Exam with click detail 1. The start transition closed the dialog and rendered Q1. The second pointer click at the same screen position targeted Intermediate's option B label with click detail 2; the label activated its radio input, emitted change and caused a normal saved answer edit.

src/App.tsx:301 guards repeated start operations, and the observed single attempt confirms that guard works. src/App.tsx:333 closes preparation and opens Exam immediately. src/App.tsx:623 accepts the resulting radio change without a transition-input guard. The initial attempt itself starts empty; the stray click creates its first saved answer afterward.

The existing tests/browser/start.spec.ts:33 invokes button.click() three times on the original element. That checks duplicate starts but does not perform coordinate-based pointer hit-testing against the newly rendered view, so it misses this failure.

## Impact and limits

High severity is supported: an unintended answer is silently persisted and survives reload. Submission uses saved answers, so the stray answer is eligible for normal grading. These verification trials did not submit reports; submitted-report persistence was inspected in code rather than re-exercised in the browser. Reproducibility is established for Intermediate at the tested viewport/timing, not every viewport and double-click interval.

During the original verification, no application code was changed and no unit suite, build or broader browser suite was run. The fix should prevent trailing pointer input from a dialog activation reaching the new view, while preserving deliberate answer input and keyboard access. A regression should use real pointer double-clicks and check both stored empty answers and the 0 / 60 counter, alongside the one-attempt assertion.

## Evidence

- [Event traces, storage and reload evidence](test-results/bug-001-reproduction.json)
- [Targeted reproduction script](test-results/bug-001-reproduce.cjs)
- [Intermediate double-click screenshot](screenshots/bug-001-intermediate-double-1.png)
- [Intermediate single-click control](screenshots/bug-001-intermediate-single-1.png)
- [Advanced double-click control](screenshots/bug-001-advanced-double-1.png)

The Intermediate screenshot was visually inspected and shows option B selected with 1 / 60 answered immediately after start.
