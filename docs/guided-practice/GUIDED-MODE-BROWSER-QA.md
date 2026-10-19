# Guided Mode — browser QA

19 October 2026 (Asia/Karachi). Evidence root: `test-results/guided-mode-20261019-01/`. Built-in in-app Chromium was available and could access loopback directly. An initial connection attempt preceded server readiness and failed; no port forwarding or public tunnel was used. Browser automation was supplementary to actual built-in-browser interaction.

## Built-in-browser journeys actually performed

| Journey | Performed scope and observed result |
| --- | --- |
| Development, new five-question session | Normal home → Open Guided Practice → default five-item set. Original Q1–Q5 narratives, quotes, select-two and table were inspected. All three hints were revealed progressively; refresh preserved their saved availability. Selecting alone showed no feedback; Check answer displayed saved/locked feedback and every option comparison. Mixed answers were completed. |
| Completion defect and correction | Before: summary existed above the viewport while focus returned to the last question. Fixed stale completed-review index/focus handling. After: completion summary is focused and visible, including production transition and reopened completed sessions. |
| Production-build ten-question session | Normal home → ten-item Set 6 (Q51–Q60). Hints were activated with Enter. Completed all ten using single/two/three selections, observed correct/incorrect complete-set feedback, saved summary and read-only completion. Reopening the tab preserved the completed experience. |
| Both select-three questions | Q59 was committed in the completed ten-item journey; Q26 was separately reached in ten-item Set 3, with all hints, a three-selection commitment, full option feedback and reload. No answer key was used to drive the built-in-browser choices; incorrect selections were intentional QA inputs. |
| Responsive real content | Actual Q52 table and controls inspected at 320×900, 390×900, 768×900 and 1366×900. Table retained a focusable horizontal-scroll region; ArrowRight operated it. No document-wide overflow was measured. |
| Original Mock | Started real Intermediate Mock through the existing difficulty dialog, observed 120-minute timer and hidden explanations/no hints. A second Guided tab correctly paused for that active Mock. Answered/flagged Q1, submitted with 59 unanswered, observed original score 17/1000, 1 correct, 0 incorrect, 59 unanswered and unchanged Results/PDF/Guided Review controls. |
| Results to Guided Review | Inspected the real completed report's dialog: Incorrect & Unanswered 59, Flagged 1, All 60; every source matched with zero unavailable. Started the 60-item retry with empty choices/hints, then returned to original Results. Score 17/1000, answers, submission time and elapsed time remained unchanged. |
| PDF download attempt | An initial call was not executed because the automatic approval service hit a usage limit. After resume, waiting for the built-in-browser download timed out and reset its tool session. That download is **unverified**; no built-in PDF success is claimed. The separate full guest suite exercises actual PDF downloads/content and passed 139/139. |
| Console | `iab-production-console.json` records an empty error/warning collection for the inspected production Q26 page. This is sampled console coverage, not a global no-error claim. |

The initial unrestricted unit run overlapped browser inspection, causing a protection checking-timeout and a browser tool timeout. Guided failed closed and kept its saved record. Explicit Retry recovered after contention. This is retained timing evidence, not an invented application fix or production-load result.

## Automated browser coverage

The normal enabled **production build passed 21/21** cases (`enabled-final.log`, `enabled-final.json`). It covers three complete 5/10-item journeys including Q26/Q59; refresh before answering/after hints/after commitment; a held shared lock proving no feedback before persistence; exact release hashes; twelve/six partitions; frozen 1.0.0 resume without the old asset; closed/reopened tabs; two-tab hints; navigation/resume; missing/corrupt/tampered releases; quota failure; damaged/missing sessions; active/corrupt Mock protection; Results cohorts 60/59/2; exact Q47 fenced artifact; and six responsive layouts.

Responsive automated checks use **320×900, 390×900, 768×1024, 1366×900, 844×390 landscape, and 320×900 with 200% root text**. They check table containment, no page overflow, Enter-operated hint disclosure/focus, minimum 44px hint/action heights and the Chromium accessibility tree. Existing suites add selection focus, touch and source/ownership/recovery/PDF cases; exact totals/failures are in [integration verification](GUIDED-MODE-INTEGRATION-VERIFICATION.md).

Initial normal-app run: **18/21**, with three completion-focus failures. All assertions/deadlines were retained; the stale cursor was corrected and the rebuilt app passed 21/21. Initial/final evidence directories are separate. Existing Guided regression initially recorded 71/72: the deleted-source case tried to click after proactive access polling disabled Start. Test input now respects the disabled state and still requires rejection disclosure and zero created sessions; no security assertion was removed.

The first three SDK privacy checks received no analytics batches because the new wrapper omitted the human-browser user-agent used by the existing analytics harness. With that same test-browser identity configured, the actual SDK checks passed **3/3**, including exact ordinary-view attribution and absence of Guided/question payloads. No SDK settings, transport assertion or deadline was loosened. Both failed and confirmed run files remain.

## Visual evidence

- Before/after completion: `iab-dev-completed.jpg`, `iab-dev-completed-after.jpg`.
- Real full feedback: `iab-dev-feedback.jpg`, `iab-production-q26-feedback-390.jpg`.
- Q52 at all required widths: `iab-production-q52-{320,390,768,1366}.jpg`.
- Ten-item completion: `iab-production-completed-390.jpg`.
- Active-Mock gate: `iab-production-mock-blocked.jpg`.
- Actual Results filters/return: `iab-production-results-guided-all.jpg`, `iab-production-results-return.jpg`.
- Final normal-app landing: `iab-production-landing-final.jpg` (Start enabled; sixty compatible guides), with an earlier `iab-production-landing.jpg` capture retained separately.
- Accessibility snapshot: `iab-production-q26-ax.txt`.
- Automated responsive/failure captures: `enabled-artifacts/`, `enabled-final-artifacts/`, plus each named regression artifact/workspace directory.

Visual inspection is by AI. Chromium keyboard/accessibility-tree checks are not native Windows screen-reader verification, physical touch-device testing or a formal accessibility audit. Firefox/WebKit, native assistive technology, physical devices and actual hosting remain unperformed. No critical/high implementation defect was found in the completed local normal-app scope; reliability/timing limitations and any remaining failed checks are separately retained in the release report.
