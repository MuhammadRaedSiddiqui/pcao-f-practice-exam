# Observed UI bug fixes - 16 October 2026

## Changes

Resolved the two browser-observed findings from [the real-browser QA report](REAL_BROWSER_QA_2026-10-16.md).

- **RBQA-001:** Shared dialogs now explicitly use fixed viewport positioning, centred insets and content-based height within their existing maximum height. The root page stops scrolling while a dialog is open, and dialog-body overscroll is contained. The header/actions stay outside the scrolling body. Drawer-specific geometry still overrides the shared modal geometry.
- **RBQA-002:** Zero-unanswered confirmation now says, “All questions have the required number of selections.” The incomplete-answer warning is conditional on a positive unanswered count and uses singular “question” when the count is one. The independent flagged-question reminder remains.

Changed application files: `src/styles.css` and `src/ui/ReviewSubmitDialog.tsx`. Pre-existing working-tree changes were preserved. No answer, snapshot, score, deadline, storage or bank schema logic changed.

The deletion-timeout concern (RBQA-003) and obsolete browser-suite maintenance concern (RBQA-004) were source-review findings, not the two reproduced UI defects addressed here. They remain open.

## Verification

- TypeScript passed: `test-results/observed-bug-fixes/typecheck.txt`.
- The first default-worker unit run passed 193 tests but timed out during the 30-second PGlite setup hooks in two suites; their 11 tests were skipped. Log: `unit.txt`.
- An unchanged complete rerun using `npm.cmd test -- --maxWorkers=2` passed **204/204 tests across 20 files**. Log: `unit-rerun.txt`. No timeout limits or test expectations were changed to obtain this pass.
- Production build passed with the existing size warnings: `build.txt`.
- Both built banks retain the source hashes recorded in `content-integrity.json`.

The Chrome extension connection used for the prior QA was unavailable. Follow-up browser checks used the real Chromium in-app browser through accessibility controls, mouse/keyboard and screenshots. No Playwright runner, DOM selector, page evaluation, storage injection or clock injection was used.

The local-only fixture `test-results/observed-bug-fixes/dialog-qa.html` renders the actual shared Dialog and ReviewSubmitDialog with synthetic data. It creates no saved attempts or account requests. Browser checks verified:

1. Opening a long dialog from a deeply scrolled page, then scrolling its body to the last paragraphs.
2. Resizing that open dialog through 320, 390, 768 and 1366 pixel widths and 844x390 landscape. Heading, Close and actions stayed visible. The 768-wide screenshot's captured height was 948 pixels despite the requested 1024-pixel height; no exact 1024-height capture is claimed.
3. Backdrop wheel scrolling did not move the background page. Inner-body scrolling remained available.
4. Shift+Tab/Tab wrapped between the final action and Close; Escape restored the opener.
5. A full-height drawer at 320 pixels retained its header, scrollable body and actions.
6. Enlarged inherited text at 320 pixels remained contained; action labels wrapped while remaining visible. This was the fixture's explicit 200% font-size control, not a physical-device or browser-zoom audit.
7. Zero-unanswered confirmation omitted the outstanding-answer warning; one and five unanswered retained it, with appropriate singular/plural text. All three retained the synthetic attempt's four-flag reminder. The confirmation action remained usable.

The rebuilt production app was also served locally on port 4173. A guest Intermediate attempt was submitted blank to create a completed report without account writes. The real app retained its 60-unanswered warning and produced the expected 0/1000 report. From scrolled Results, the actual difficulty selector was opened and resized through all five configurations. Its heading/Close and Cancel/Start stayed visible; body scrolling and fresh landscape reopening also passed, without requiring Ctrl+Home.

Native accessibility evidence and screenshots are under `test-results/observed-bug-fixes/`. Key images are `production-selector-320x740.png`, `production-selector-landscape-reopened.png`, `long-modal-landscape-scrolled.png`, `drawer-320.png`, `long-modal-enlarged-body-320.png` and `confirmation-all-answered.png`.

## Limits and cleanup

This is focused verification of the two UI fixes, not another full account/exam regression run or independent accessibility audit. Physical Chrome/device rotation, Safari, Firefox and live accounts were not retested. The earlier broader QA report retains its other limits.

The generated guest report remains only in the in-app browser's local history. No personal account data, hosted account/report data, emails or passwords were changed. Temporary browser viewport overrides were reset and the QA servers were stopped. No deployment, commit or push occurred.
