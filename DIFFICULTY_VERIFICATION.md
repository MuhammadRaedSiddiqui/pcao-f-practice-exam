# Difficulty selection — implementation and verification

Historical initial-mapping record. The user subsequently confirmed that the current bank is Advanced. The corrected mapping, refreshed screenshots and verification are recorded in [DIFFICULTY_MAPPING_CORRECTION.md](DIFFICULTY_MAPPING_CORRECTION.md).

Date: 2026-10-13. Phase 1 is complete locally and ready for UI review. The real Advanced bank is intentionally pending UI approval and upload.

## Implemented behavior

- Start exam, Start another exam and Results Start new attempt open one preparation dialog. Intermediate/Advanced are native radio controls styled as a segmented toggle, with comparison bullets below.
- Intermediate defaults on opening and uses the unchanged reviewed runtime bank. Advanced can be inspected but shows Coming soon and a disabled Start action. No Advanced runtime questions or fallback bank were added.
- Selection and replacement are steps of the same modal. Keep unfinished attempt returns to selection; Cancel, Close and Escape dismiss the flow. Existing timers continue, and expiry closes the preparation and preserves the report.
- New attempts save difficulty with the original frozen snapshot. Exam, Results and history display it. Legacy attempts retain their snapshots, grading and deadlines and show Original exam. Saving rejects relabelling an existing attempt.
- Loading caches and in-flight requests are separate per level. The reserved Advanced path is `public/question-bank-advanced.json`; the catalog keeps `available: false` until the supplied reviewed bank is integrated. Unit fixtures exercise enabled Advanced loading without shipping synthetic content.
- Source courses are associated with the selected level. Intermediate has the existing ten courses; Advanced has an availability message and no Intermediate links.
- Saving disables preparation controls and retains repeated-start guards, Web Locks, record revisions, rollback and cross-tab recovery.

## Verification results

| Check | Result | Evidence |
| --- | --- | --- |
| TypeScript | Passed | `test-results/difficulty-typecheck.txt` |
| Vitest | 53/53 tests across 8 files passed | `test-results/difficulty-unit-tests.txt` |
| Production build | Passed | `test-results/difficulty-build.txt` |
| Full Chromium suite | 95/95 cases across 9 files passed in one final run | `test-results/difficulty-browser-checks.txt` |
| Runtime and built bank | Both retain SHA-256 `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` | File hashes and integrity tests |
| Approved Markdown | Retains SHA-256 `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729` | File hash and approved-content test |

Seven unit cases were added: four cover unavailable banks, request deduplication/cache, independently completing banks and isolated retry; three cover chosen difficulty/snapshot persistence, invalid/changed metadata and legacy records. Twelve browser cases cover six selector layouts plus saved labels, Results entry, replacement/back, expiry, source association, legacy reports and touch.

Existing browser tests now confirm Intermediate after opening the new selector and wait for completed flag saves, navigation and submission where needed. The three timing issues reported in the project analysis are corrected in the original tests. An initial 94-case run passed 91 cases; two new waits incorrectly expected success inside deliberate-failure cases and one recovery baseline needed a navigation-completion wait. Those test updates were corrected and passed a focused three-case rerun. After final styling and legacy coverage, the complete 95-case run passed.

The final bundle is 516.74 kB JavaScript (154.29 kB gzip) and 20.49 kB CSS (4.95 kB gzip). The existing above-500-kB warning remains nonblocking. Chromium is verified; Firefox/WebKit and a formal independent accessibility audit remain outside this evidence.

## Visual and interaction review

Checked 320×700, 390×844, 768×1024, 1366×768, 700×320 landscape and 320×700 with 24px body text. Keyboard selection, focus trapping, opener restoration, cancellation, disabled Advanced starts, touch targets and page-wide/dialog overflow pass. At narrow sizes the modal body scrolls while heading/Close and footer actions remain reachable. The toggle stacks under enlarged text to keep labels readable. Both selected panels were captured, with extra scrolled captures for 320, landscape and enlarged text, and mobile/desktop images were visually inspected.

Screenshot families:

- `screenshots/difficulty-intermediate-{320,390,768,1366,landscape,enlarged}.png`
- `screenshots/difficulty-advanced-{320,390,768,1366,landscape,enlarged}.png`
- `screenshots/difficulty-{intermediate,advanced}-scrolled-{320,landscape,enlarged}.png`
- `screenshots/difficulty-replacement-1366.png` (default browser viewport; filename retained)
- `screenshots/start-confirmation-320.png`

UI-review examples: [Intermediate mobile](screenshots/difficulty-intermediate-390.png), [Advanced mobile](screenshots/difficulty-advanced-390.png), [Intermediate desktop](screenshots/difficulty-intermediate-1366.png), [Advanced desktop](screenshots/difficulty-advanced-1366.png).

## Local preview and follow-up

Verification used a fresh production preview at `http://127.0.0.1:4210` with `.localtest/difficulty/playwright.config.ts` and two workers. The preview is left running for UI review. Repeat with:

```powershell
node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4210 --strictPort
node node_modules/@playwright/test/cli.js test --config .localtest/difficulty/playwright.config.ts
```

After UI approval, inspect the supplied second bank, validate it against the existing contract, reconcile the comparison copy with the actual content, add the Advanced file and enable the catalog entry. No deployment, score/timing change, bank content rewrite, legacy migration or storage-retention feature was performed in this phase.
