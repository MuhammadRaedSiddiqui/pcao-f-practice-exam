# Difficulty selection implementation plan

Status: user-approved UI and plan. Both phases are complete locally: Advanced uses the original bank; Intermediate uses the validated uploaded `public/easy-question-bank.json`. Final evidence is in `INTERMEDIATE_INTEGRATION_VERIFICATION.md`.

## Intended experience

Clicking any new-exam action opens a "Choose exam difficulty" dialog. A two-position segmented toggle displays Intermediate on the left and Advanced on the right, with Advanced initially selected. Beneath it, a short bullet list describes the selected level in comparison with the other level, followed by exam details and availability. The footer has Cancel and a primary action labelled "Start Advanced exam" or "Start Intermediate exam".

User-confirmed mapping: the existing reviewed bank is Advanced, and the uploaded `public/easy-question-bank.json` is Intermediate. The current bank is Advanced, as confirmed by the user. The default selection is Advanced each time the dialog opens. Selection remains local to the dialog until an attempt is started.

The first implementation keeps the existing bank contract: 60 questions, 120 minutes, the prescribed seven domain totals, reviewed metadata, exact-set grading and the existing practice score. The second bank's actual shape will be checked after upload. Any incompatibility will be reported before changing those rules.

## Dialog layout and copy

1. Heading: "Choose exam difficulty".
2. Supporting text: "Choose the question bank for your next practice exam."
3. Segmented selector: Intermediate / Advanced, defaulting to Advanced.
4. Selected-level heading and three short comparison bullets.
5. Exam facts from the selected validated bank; no actual Intermediate facts are claimed before that bank is supplied.
6. Loading, availability or retry message where applicable.
7. Cancel and the selected-level Start action.

Draft comparison copy for UI review:

| Intermediate | Advanced |
| --- | --- |
| More direct application of individual concepts. | More complex scenarios combining multiple concepts. |
| More focused scenarios with fewer competing constraints. | More competing constraints and tradeoffs to evaluate. |
| Emphasis on identifying a suitable approach. | Emphasis on evaluating which approach best fits the scenario. |

These descriptions express the proposed distinction. Before release with both banks, reconcile them with the actual reviewed content. No readiness predictions or official-certification claims are added.

Historical pre-upload behavior: before the Intermediate bank was supplied, its toggle remains selectable for UI inspection. The panel shows "Intermediate exams will be available after the question bank is added." The Intermediate Start action is disabled. No Advanced-bank fallback or mock Intermediate exam is created. Advanced remains usable independently.

## Start and replacement flow

All new-exam entry points use the same dialog: Start exam, Start another exam, and Start new attempt from Results. Resume attempt and Open report continue directly to their original saved content.

Flow: new-exam action -> choose difficulty -> validate selected bank -> existing unfinished-attempt confirmation if needed -> locked persistence -> Question 1.

- Opening, toggling or cancelling the selector creates no record and starts no new timer.
- An existing unfinished attempt's deadline continues while the selector is open. Include the existing timer-running reminder when relevant.
- The selected bank must be available and validated before offering abandonment confirmation. A missing Intermediate bank cannot discard an existing attempt.
- Retain selected difficulty and bank through replacement confirmation. Name the target level in the confirmation and final action.
- Return to the selector when the user keeps the unfinished attempt, with its selection retained. Closing the flow restores focus to the original opener.
- Revalidate availability and recover the latest history under the shared lock on final confirmation. A concurrently created unfinished attempt requires fresh confirmation.
- Preserve the existing rule that expired attempts earn reports before replacement. Expiry closes both selection and replacement dialogs and follows shared finalization.
- Disable repeated Start actions while starting and preserve the existing guards, revisions, rollback and cross-tab synchronization.
- Keep save errors visible in the active step with retry. Recheck the deadline when the locked operation executes.

Use one preparation-dialog state with selection and replacement steps so two native modal dialogs are never stacked. Maintain the existing native dialog's focus trapping, heading focus, Escape, scrolling and restoration behavior.

## Data and architecture

Create `src/domain/difficulty.ts` with the `advanced | intermediate` type and a small catalog for labels, descriptions and bank locations. Keep `public/question-bank.json` as the existing bank so its bytes and hash stay intact. Intermediate now uses `public/easy-question-bank.json`; both banks are available after validation.

Extend bank loading to accept a catalog-selected path while preserving the current default path for existing callers. Track loading, ready and error states independently per level. Cache validated responses per level, deduplicate concurrent requests, and prevent an earlier response from replacing the currently selected level's panel. Missing or invalid Intermediate data must not block Advanced starts or saved reports.

Add an optional `difficulty` field to stored attempts and their recovery schema. New attempts record the chosen level at creation together with the frozen snapshot. Resume, edits, submission and history retain that value. Recover legacy records without it and display "Original exam" rather than guessing a historical difficulty. Do not migrate existing snapshots or stored grades.

Build `src/ui/DifficultySelectionDialog.tsx` using the shared Dialog and Button controls. The visual toggle is an accessible radio group, with exactly one selection and native keyboard behavior. `App.tsx` coordinates selection, per-level availability, replacement and start. Results, Exam and history display the saved difficulty.

The Source courses drawer must identify which bank its course list describes. Keep the current list associated with Advanced; when Intermediate is supplied, offer the corresponding validated list. Never show Advanced sources as if they describe Intermediate.

## Implementation sequence

### Phase 1: feature implementation and UI review

1. Add the difficulty catalog and independent bank loading.
2. Add optional attempt metadata with legacy recovery and snapshot preservation.
3. Build the segmented-selector dialog and draft comparison panels.
4. Route all new starts through it and integrate existing replacement, expiry and saving behavior.
5. Display saved difficulty in Exam, Results and history; clarify Source courses context.
6. Verify functionality and responsive layouts, capture Advanced and unavailable-Intermediate panels, and present them for UI approval.

The production app includes only the existing reviewed bank. Use clearly marked synthetic banks only in tests, through test fixtures or intercepted responses, to exercise the Intermediate loading/start path without shipping fabricated content.

### Phase 2: integrate the supplied Intermediate bank after UI approval

1. Inspect and validate the supplied file against the existing contract; preserve its reviewed stems, option order, keys, explanations and sources.
2. Confirm the bank-to-level mapping and comparison descriptions against the supplied content.
3. Add the Intermediate file at the reserved path and enable its catalog entry.
4. Verify both real-bank starts, source lists, difficulty labels, scoring and frozen reports independently.
5. Update implementation/specification/status documentation and deliver the completed local feature. Deployment is a separate step from UI approval and bank integration.

## Verification and acceptance criteria

- Every new-exam action opens the selector; Advanced is initially selected.
- Switching the toggle updates bullets, availability and action label with no storage writes.
- Intermediate can be inspected but cannot start before its real bank is supplied.
- Loading/error/retry states belong to the selected bank; rapid toggling cannot start the wrong bank.
- New attempts use exactly the selected bank and persist its level. Overlapping question IDs or dataset version strings across banks do not mix content, because attempts own their snapshots.
- Resume/report actions bypass selection; legacy attempts remain readable and retain their original deadlines and grading.
- Cancelling either preparation step preserves existing records. Replacement, expiry, storage failure, repeated clicks and simultaneous tabs retain their current safeguards.
- Source-course lists remain associated with the bank they describe.
- Keyboard, screen-reader semantics, focus restoration, touch targets and overflow are checked at 320, 390, 768 and 1366 pixels, mobile landscape and enlarged text. Inspect mobile and desktop screenshots of both selections and replacement confirmation.
- Run TypeScript, meaningful unit tests, production build and the full Chromium suite. Update existing browser tests for the added selector step and await completed saves/submission rather than merely completed clicks; include the three timing issues identified in the project analysis.
- Keep `IMPLEMENTATION_SPEC.md`, `PROJECT_IMPLEMENTATION_STATUS.md` and `AGENTS.md` aligned when implementation and verification change. Preserve earlier verification records as historical evidence.

## Scope boundaries

This work adds bank selection and saved difficulty labels. It does not generate question content, change scoring or timing, shuffle approved question/option order, add cloud storage, implement automatic difficulty classification, or perform the separate storage-retention/bundle-optimization work identified by the project analysis.
