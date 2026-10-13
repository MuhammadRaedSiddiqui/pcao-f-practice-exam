# Difficulty bank mapping correction

Date: 2026-10-13. The user confirmed that the existing reviewed bank is Advanced. This record supersedes the initial mapping in `DIFFICULTY_VERIFICATION.md`.

## Corrected behavior

- Advanced uses the unchanged `public/question-bank.json`, is selected by default, and starts real exams.
- Intermediate remains selectable for comparison/UI review, shows Coming soon, and has a disabled Start action. Its future file is `public/question-bank-intermediate.json`, with `difficultyCatalog.intermediate.available` false until integration.
- The toggle keeps Intermediate on the left and Advanced on the right. Comparison descriptions stay associated with their respective levels.
- Source courses default to Advanced and show its ten validated courses. Intermediate shows an availability message and no Advanced links.
- New attempts save Advanced difficulty; Exam, Results and history display it. Existing attempts retain their recorded difficulty and frozen snapshots. No question content or stored attempt migration was performed.
- The implementation plan, specification, README and current project/agent status reflect the corrected mapping. The second bank is now expected to be Intermediate after UI approval.

## Verification

TypeScript, all 53 unit tests across 8 files and the production build passed after the correction. The build contains 516.70 kB JavaScript (154.29 kB gzip); the existing chunk-size warning is nonblocking. The final Chromium result is recorded in `test-results/difficulty-mapping-browser-checks.txt`.

The final complete Chromium run passed all 95 cases across 9 files in one run (2.4 minutes). Its last-run state is passed with no failed tests. The earlier screenshot write error did not recur.

The first mapping-correction run passed 93/95 cases. One case read navigation immediately after requesting its asynchronous save; it now waits for the destination heading, and its checkbox storage assertion polls for the committed answer. The other failure was an `UNKNOWN` filesystem error writing an existing screenshot under the OneDrive workspace. The initial output is retained in `test-results/difficulty-mapping-browser-initial.txt`. The complete suite was rerun after the navigation-test correction.

Runtime and built-bank hashes remain `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`. Unit tests verify approved Markdown integrity. Screenshots were refreshed across 320, 390, 768, 1366, landscape and enlarged text; corrected mobile/desktop panels and enlarged labels were visually inspected.

Examples: [Advanced mobile](screenshots/difficulty-advanced-390.png), [Advanced desktop](screenshots/difficulty-advanced-1366.png), [Intermediate mobile](screenshots/difficulty-intermediate-390.png), [Intermediate desktop](screenshots/difficulty-intermediate-1366.png).

The production preview at `http://127.0.0.1:4210` remains available for UI review. No deployment was performed. UI approval and upload/integration of the Intermediate bank remain pending.
