# Intermediate bank integration and verification

Date: 2026-10-13. UI approval, uploaded-bank validation and runtime integration are complete locally. Both difficulties are available.

## Runtime behavior

| Difficulty | Runtime file | Exam ID | Version |
| --- | --- | --- | --- |
| Advanced (default) | `public/question-bank.json` | `pcao-f-practice-01` | 1.1.0 |
| Intermediate | `public/easy-question-bank.json` | `pcao-f-practice-easy-01` | 1.0.0 |

The selected bank must pass the app validator before Start is enabled. Both exams retain 60 questions, 120 minutes, the prescribed domain distribution, exact-set grading and the existing practice score. The supplied Intermediate title remains "Independent PCAO-F Practice — Easy"; the application labels its difficulty Intermediate. Neither bank's content or metadata was rewritten.

Both banks load independently at startup. Start is available when at least one reviewed bank is ready; a loading or failed bank disables only that level's start action. The Start page identifies available dataset versions and offers retry for failed banks. Selecting Intermediate starts its own frozen snapshot and records Intermediate difficulty. Resume, Results, history, source references and reports retain the original snapshot; later bank changes and starts at the other level do not alter it.

Source courses are derived from the selected bank. Both banks independently deduplicate to ten courses; Intermediate has 70 reference entries and Advanced has 100. Existing legacy records remain Original exam. Existing difficulty metadata, saved answers, deadlines and reports are not migrated.

## Final checks

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Passed | `test-results/intermediate-typecheck.txt` |
| Unit tests | 55/55 across 8 files passed | `test-results/intermediate-unit-tests.txt` |
| Production build | Passed | `test-results/intermediate-build.txt` |
| Full Chromium suite | 101/101 across 9 files passed in one final run (2.5 minutes) | `test-results/intermediate-browser-checks.txt` |
| Advanced source and build hash | Unchanged: `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` | Hash checks and integrity tests |
| Intermediate source and build hash | Unchanged: `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4` | Hash checks and new real-bank unit test |
| Approved Advanced Markdown | Integrity test passed | Existing approved-content unit test |

Two real-bank unit cases were added for Intermediate validation/catalog identity, unchanged bytes, frozen snapshots, grading and saved difficulty. Six browser cases were added: two mobile/desktop real flows, two loading/failure/retry cases, a missing Advanced bank with usable Intermediate, and rapid toggling with a late Intermediate response. Existing selector, touch, source-course and replacement tests now exercise available Intermediate; replacement confirms a switch from an unfinished Advanced attempt to Intermediate. Start tests cover both unavailable banks and independent availability.

The initial focused 26-case run passed 20 and exposed six outdated focus assertions: Cancel previously preceded Close in the tab cycle because Intermediate Start was disabled. The assertions now include the enabled Start button before wrapping to Close. All corrected cases pass in the final complete suite.

The production build is 517.03 kB JavaScript (154.38 kB gzip) and 20.49 kB CSS (4.95 kB gzip). The existing bundle-size warning remains nonblocking. Chromium is verified; Firefox/WebKit and a formal independent accessibility audit are not included in this evidence.

## Visual evidence and preview

The selector, cancellation and keyboard behavior pass at 320, 390, 768, 1366, mobile landscape and enlarged text. Touch can start Intermediate. New mobile/desktop captures show the real Intermediate exam, Results and question review; both course-drawer captures pass overflow checks. Images were visually inspected.

- [Intermediate selector mobile](screenshots/difficulty-intermediate-390.png)
- [Intermediate selector desktop](screenshots/difficulty-intermediate-1366.png)
- `screenshots/intermediate-exam-{320,1366}.png`
- `screenshots/intermediate-results-{320,1366}.png`
- `screenshots/intermediate-question-review-{320,1366}.png`
- `screenshots/intermediate-courses-{320,1366}.png`
- `screenshots/difficulty-replacement-1366.png`

The fresh production preview at `http://127.0.0.1:4210` remains running. The browser configuration is `.localtest/difficulty/playwright.config.ts`. Both runtime files remain included in Vercel inputs. No deployment was performed in this phase; the current local implementation is complete.
