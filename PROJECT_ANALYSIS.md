# Project analysis — 2026-10-13

The project is a well-developed frontend practice exam. Its four-view workflow, reviewed question bank, snapshot-based grading, deadline recovery and coordinated browser persistence are implemented. The strongest remaining concerns are test synchronization and long-term storage management. No critical grading defect was found in the reviewed code or checks. No application source or original test file was changed during this analysis.

## Architecture and strengths

React and TypeScript coordinate the UI through `src/App.tsx`; Vite builds the static app. Domain modules own bank validation, attempt operations and Results summaries. UI modules provide Markdown, modal dialogs, course sources and completed reports. There is no backend or account synchronization.

- Strict bank validation requires reviewed content, 60 questions, 120 minutes, the seven prescribed domain totals, valid answer sets and complete explanations.
- Attempt snapshots preserve the original bank across content updates. Recovery checks answers, timestamps, metadata and stored grading results.
- Exact-set grading and the unrounded 720/1000 practice threshold are shared between Results and history.
- Web Locks and revision checks prevent stale-tab overwrites and changes to submitted reports. Failed writes return explicit errors and attempt rollback.
- Markdown renders without executing raw HTML. Source links restrict clickable protocols and use safe new-tab attributes.
- Tests cover keyboard use, touch, modal focus, narrow layouts, enlarged text, expiry, storage failure and cross-tab interactions. Inspected mobile and desktop Results screenshots were readable and showed no visible clipping.

## Findings, in priority order

### 1. Browser tests require waits for completed asynchronous actions

The unchanged full browser run passed 80 of 83 cases. `tests/browser/audit-fixes.spec.ts:54` and `tests/browser/foundation.spec.ts:99` capture storage immediately after requesting a flag save. Their failing comparisons show the baseline without the flag and the later record with it. Both passed a sequential rerun.

`tests/browser/audit-fixes.spec.ts:112` clicks Confirm submission and reloads immediately. It reproduced a beforeunload warning on the focused rerun. Confirmation initiates asynchronous locked saving, so click completion does not establish completed submission.

Diagnostic copies added waits for the committed Flagged control and the Results heading; all three cases passed three repetitions each (9/9). Add equivalent waits to the original tests, then rerun the full suite. The diagnostic runs support test timing defects; they are not a replacement for a clean run of the original suite.

### 2. Full snapshots and unlimited history eventually exhaust storage

Each attempt includes the full bank. The diagnostic serialized record contained approximately 190,173 characters. An isolated Chromium profile held 27 such records before `QuotaExceededError`; actual capacity varies with the browser, record contents and other origin storage.

The app preserves completed reports indefinitely and has no export or individual deletion controls. Once space runs out, new starts or saves can fail despite the existing error handling. Add user-controlled export/deletion, or consider IndexedDB with explicit retention. Preserve frozen snapshots and avoid automatically deleting reports. `refreshHistory()` also parses, validates and freezes every report after each edit, so history growth increases work on the main thread.

### 3. Release work remains outside a confirmed deployment

Vercel configuration exists, but the recorded deployment attempt failed and no production URL or live smoke check is established. Important runtime files and tests, including `src/domain/browserStorage.ts` and `tests/browser/persistence-fixes.spec.ts`, were untracked at the start of this analysis; numerous existing edits were also uncommitted. Review and commit the intended release files before deployment. A build from an incomplete commit could omit these reliability changes.

### 4. Performance and maintenance improvements are worthwhile

The production JavaScript bundle is 510.81 kB, or 152.75 kB gzip. Consider loading Results and Markdown separately after measuring the effect. Every dependency uses `latest` in the manifest; `npm ci` is reproducible with the current lockfile, but future dependency refreshes require deliberate review. No repository CI workflow was found. Automate typechecking, unit tests, build and browser checks. Browser evidence covers Chromium; Firefox/WebKit and a formal accessibility audit remain unverified.

`App.tsx` combines persistence queues, cross-tab synchronization, deadlines, finalization and navigation in one component. After resolving the test timing issues, extracting these responsibilities into focused hooks could make lifecycle changes easier to review.

## Verification

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Vitest | 46/46 tests across 7 files passed |
| Production build | Passed; nonblocking bundle-size warning |
| Original full Chromium suite | 80/83 passed across 8 files |
| Sequential rerun of failed cases | 2/3 passed; immediate reload case failed again |
| Diagnostic copies with explicit waits | 9/9 passed across three repetitions |
| Runtime bank and approved-content hashes | Match the recorded approved hashes |
| Production deployment | Not attempted or verified in this analysis |

The previous 83/83 reliability-fix verification remains a historical clean run. The latest unchanged-suite result should be reported separately. Diagnostic scripts and copies are under `.localtest/project-analysis/`; original tests remain unchanged. Tracked screenshots regenerated by verification are restored to their pre-analysis versions.
