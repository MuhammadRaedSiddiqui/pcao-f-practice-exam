# Real-browser QA and project analysis - 16 October 2026

**Follow-up:** The two browser-observed UI defects, RBQA-001 and RBQA-002, were subsequently fixed and verified locally. See [OBSERVED_BUG_FIXES_2026-10-16.md](OBSERVED_BUG_FIXES_2026-10-16.md). The observations below preserve the original QA evidence; RBQA-003 and RBQA-004 remain source-review concerns.

## Outcome

The main guest, exam, report and account journeys passed in real Chrome. TypeScript, all 204 unit tests across 20 files, and the production build passed. A complete Advanced exam answered through browser controls scored 60/60 and 1000/1000; the deliberately mixed Intermediate exam scored 1 correct, 2 incorrect and 57 blank, or 17/1000.

This is a broad functional QA pass, not an exhaustive release certification. The responsive selector issue below remains open, along with source-review concerns and the explicit coverage gaps. No application fixes, deployment, commit or push were performed.

## Environment and method

- Tested the current working tree, including the changes already present when this run began. Prior changes were preserved.
- Built with `npm.cmd run build` and served the resulting `dist/` on `http://127.0.0.1:4173`.
- Used the user's real Chrome browser through the browser connector: accessibility controls, actual mouse/keyboard input, double clicks, reloads, separate tabs and screenshots. No Playwright runner, locator, DOM snapshot, page evaluation, JavaScript storage injection or injected clock was used for browser QA.
- Automated the 60-question Advanced run by reading the reviewed bank from the filesystem, matching its expected option letters to Chrome's current accessibility controls, clicking each answer, checking its selected state, and navigating through all 60 questions. This checks the implementation against the supplied key; it is not an independent review of that key.
- Used a real hosted Supabase disposable account after explicit authorization. A separate `localhost:4173` origin provided empty local history for cloud-only recovery. Account deletion was separately confirmed at the final action.
- Used a QA-only static server on port 4210 for controlled HTTP 503 and malformed-bank responses. It served the same built frontend and did not alter either reviewed bank. That origin had an older existing completed report; it was neither opened, edited nor deleted.
- Chrome viewport overrides exercised 320x740, 390x844, 768x1024, 1366x900 and 844x390. These are viewport checks, not physical touch-device tests. Early screenshot/viewport problems required resetting the override before setting each new size. Later selector captures replaced the earlier stale frames.
- The first attempt to open the development origin revealed an existing signed-in account. QA moved to the separate preview origin before creating attempts or making account changes.

## Observed browser findings

### RBQA-001 - P2: selector header can leave the viewport after resize

With Results scrolled down and the difficulty selector open, shrinking/rotating the viewport can move the dialog heading and Close button above the viewport. Reopening the selector at the retained scroll position reproduced the clipped header at 844x390. Cancel and Start remained visible, and Escape still dismissed the dialog. Ctrl+Home restored the header, showing that outer-page scrolling affects the dialog's visibility.

Reproduction:

1. Open a completed report and scroll to the report actions/reviews.
2. Open Start new attempt and select Advanced.
3. Resize from a taller viewport to 320x740 or 844x390 without closing the dialog.
4. Inspect the heading and Close control. At the affected scroll position they are above the visible viewport.
5. Close and reopen at landscape, then press Ctrl+Home to compare.

Evidence: `test-results/visual-qa-20261016/advanced-selector-320x740.jpg`, `advanced-selector-844x390.jpg`, `selector-landscape-fresh.jpg` and `selector-landscape-home-key.jpg`.

Investigate the shared dialog's viewport anchoring and outer-document scroll handling in `src/styles.css:48` and `src/ui/primitives.tsx:19`. The precise root cause was not established, and physical-device rotation remains unverified. This was observed through Chrome viewport overrides; it should not be dismissed as a passing responsive check.

### RBQA-002 - P3: complete-exam confirmation refers to outstanding answers

The Advanced final confirmation correctly reported zero unanswered questions but still said, "You can submit with these outstanding answers." Render that guidance only when the unanswered count is nonzero. Source: `src/ui/ReviewSubmitDialog.tsx:29`. The native browser evidence contains the zero-unanswered confirmation immediately before Advanced submission.

## Source-review findings

### RBQA-003 - P2: account deletion has no application-level timeout or cancellation

`src/services/accountRepository.ts:18` invokes the Edge Function without a timeout or abort signal. The installed functions SDK only creates its timeout controller when a timeout option is supplied. Meanwhile `src/ui/AccountPanel.tsx:100` disables Close and the form's Cancel action while deletion is pending. A stalled response therefore has no bounded application recovery path. The ordinary wrong-password and successful deletion paths passed; a hung network request was not induced in this run.

Add a bounded request/response timeout and safe retry/reconciliation behavior. Preserve the distinction between an uncertain network outcome and confirmed server deletion.

### RBQA-004 - P2: existing browser tests target removed UI

The maintained browser suite still includes actions for removed bulk import and account JSON export, such as `tests/account-browser/account.spec.ts:46` and `:112`. Some difficulty/course tests also retain the former level-specific drawer assumptions. These cases no longer describe the current product. They were statically inspected, not run or rewritten: the user requested real-browser QA without Playwright DOM automation. Historical full-suite pass totals cannot establish current regression health.

## Browser coverage completed

| Area | Observed result |
| --- | --- |
| Ready Home and both reviewed banks | Both datasets available; correct level/version information |
| Shared course drawer | Ten course links, shared-level copy, Escape dismissal and opener focus restoration |
| Difficulty selection | Intermediate default; comparison copy; Advanced selection; cancel creates no attempt; reopening resets to Intermediate |
| Repeated start input | Double-click starts for both levels opened with zero answers selected; subsequent deliberate input worked |
| Intermediate answering | Radio selection/clear, flagging, Previous/Next, heading focus, partial select-two response, maximum-choice enforcement and deselection |
| Persistence | Reload returned Home; Resume restored Q2, prior answers, flag and continuing deadline; later partial Q4 survived history navigation |
| Review and confirmation | Correct answered/unanswered/flagged counts; 60 jump controls; reverse/forward focus wrapping; jump to Q4; cancel final confirmation; flagged reminder |
| Leave confirmation | Stay preserves current state; leaving for history displays the continuing-timer reminder |
| Intermediate grading | Q1=C correct, Q2=A incorrect, Q4=A partial/incorrect, other 57 blank; 17/1000, Failed; expected domain result |
| Intermediate reviews | Incorrect, Flagged and Unanswered filter counts; partial response excluded from blank filter; selected A and missed correct D shown with supplied explanations and sources |
| Signup validation | `a@b` rejected with complete-domain guidance; correction succeeds |
| Real signup and migration | Immediate disposable-account signup; completed guest report automatically backed up; local/cloud duplicate coalesced |
| Account settings | Dedicated page, heading focus, backup preference, no bulk import/export controls; mobile/tablet/desktop/landscape screenshots |
| Session restoration | Unchecked signup session survived same-tab reload; sign-out hid private reports; wrong-password login failed and valid login recovered the report; checked login restored in another same-origin tab |
| Fresh-origin account recovery | Empty `localhost:4173` device history listed the hosted report after sign-in; Open account report rendered the original score, answers, flag and timing |
| Settings during Advanced exam | Leave confirmation named settings; returning via history/Resume preserved Q41, 40 answers and original deadline |
| Advanced complete-answer run | All 60 questions answered through Chrome controls, including select-two/select-three items; 60/60 answered in review |
| Advanced grading | 1000/1000, Passed, 60 correct, zero incorrect/blank, all seven domains at 100% |
| Cross-tab submission | Second tab resumed Q60 with 60 saved answers; submission automatically opened immutable Results in the original tab with the other-tab notice |
| Automatic backup after completion | Advanced report reached Backed up without manual upload |
| Empty review | Flagged (0) showed no matching questions; all-correct review guidance displayed |
| PDF downloads | Both levels downloaded; export remained complete while an empty/non-All filter was selected |
| Table accessibility | Q45 table remained inside its container at narrow width; focus outline visible; Right-arrow keys exposed the final column |
| Recovery callback safety | `?type=recovery` alone did not authenticate or open password update; expired callback produced safe guidance and removed auth fields from the URL; resend entry opened the email form; no email sent |
| Account deletion | Unchecked acknowledgment disabled submission; incorrect current password rejected and field cleared; correct password deleted the test account; subsequent hosted sign-in rejected the deleted credentials |
| Bank failure isolation | HTTP 503 Advanced plus invalid Intermediate made Home Unavailable with Start disabled; course drawer provided retry |
| Bank failure recovery | Healthy Intermediate recovered the shared courses and enabled its Start while Advanced remained unavailable; selecting failed Advanced disabled Start; retry after restoring Advanced re-enabled it |

The native evidence JSON is an action/observation journal, not a count of independently isolated test cases. It began during Intermediate Results testing, so earlier observations are documented here and in the conversation rather than retrospectively fabricated as raw records. Some entries contain accessibility diffs; read them together with preceding states. Recovery resend cancellation was not independently verified and is not claimed as a pass.

## PDF, build and content verification

- Typecheck: passed. Log: `test-results/visual-qa-20261016/typecheck.txt`.
- Unit tests: 204/204 across 20 files. Log: `test-results/visual-qa-20261016/unit.txt`.
- Build: passed. Log: `test-results/visual-qa-20261016/build.txt`. Existing bundle warnings remain: main JavaScript 788.51 kB, optional analytics 305.91 kB, PDF module 1,834.25 kB. No performance budget or load-time benchmark was run.
- Intermediate PDF: 650,551 bytes, 121 pages, expected title/17 score, all Q1-Q60 IDs, manual submission and sources.
- Advanced PDF: 811,059 bytes, 122 pages, expected title/1000 score, all Q1-Q60 IDs, manual submission and sources despite exporting from Flagged (0).
- First, second and last pages of both PDFs were rendered and visually inspected. Those six sampled pages were readable with no observed clipping. This does not assert a page-by-page visual inspection of all 243 pages.
- Source/built Advanced SHA-256: `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea`.
- Source/built Intermediate SHA-256: `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`.
- Approved Markdown SHA-256: `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729`.

## Coverage gaps and limits

- Real mailbox delivery, valid recovery-link acceptance, recovery dismissal/resume with a real session, password update and subsequent login. No controlled mailbox was supplied; no recovery email was sent and no password was changed. Browser tooling requires user handoff for a password change.
- Natural 120-minute expiry, suspension and expiry/manual-submit races were not exercised end to end. Unit coverage is supporting evidence only.
- Native Back/reload warning behavior is not newly established. Tool-driven reload restored the saved attempt, but exposed no native dialog; this does not prove that a human-triggered warning is missing.
- Physical touch, reliably controlled 200% text enlargement, Firefox, Safari/WebKit and an independent accessibility audit. Browser zoom key attempts did not establish a controlled enlargement pass.
- Full offline/reconnect, quota exhaustion, damaged storage, missing Web Locks, simultaneous stale writes, lost backup acknowledgments, pagination, two distinct-account switching, individual report tombstone deletion and trusted-device offline caching were not all repeated in the real browser.
- Analytics delivery/dashboard attribution, live Vercel/ngrok behavior, hosted configuration review, direct post-deletion database-row inspection and operational database restore were not verified.
- Not every screen was tested at every viewport. The selector has a documented failure; screenshots of Results, settings and the long table do not establish a universal responsive pass.

## Artifacts and cleanup

Evidence is under `test-results/visual-qa-20261016/`: native browser journal, screenshots, content hashes, PDF checks/renders and logs. `inspect_pdf.py` can repeat the PDF content/sample-render checks against the generated downloads. `bank_failure_server.py` and its JSON mode file provide the local HTTP fault harness; the final mode file serves healthy banks.

The disposable account `qa-visual-1792116584903@example.com` was deleted after owner confirmation. Its two test reports no longer have an account through which they can be accessed, and the app returned to signed-out, empty Home. Backend cascading deletion is supported by implementation/unit tests but was not independently queried with admin credentials in this run. The generated PDFs remain in Downloads as QA evidence. Existing personal account data on the original development origin and the older port-4210 report were not modified. No credentials or auth tokens were deliberately saved to the evidence files.

All servers started for this QA run were stopped after verification. Temporary viewport overrides were reset. Application source and reviewed content were not edited.
