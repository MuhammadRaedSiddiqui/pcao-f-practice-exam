# Guided Practice built-in browser review — 2026-10-18

**Resolution — 2026-10-18:** The owner authorized fixes to all four findings. They are implemented and verified in the [subsequent fix report](BROWSER-REVIEW-FIXES-2026-10-18.md). This original review and its candidate/evidence are preserved as history.


Completed the local pilot flow in the built-in Chromium browser using browser UI controls, accessibility snapshots and screenshots. This follows the owner's request to switch from Chrome after native Windows capture failed. This is agent-operated engineering QA; it is not a personal owner walkthrough, independent learner evidence, native screen-reader acceptance or final D14/Phase 6 acceptance.

Candidate artifact: `54e951d2075559d5a34ac84ab87792f16badd4aff33ed13e60aabd9bd964b1aa`. All 81 manifest inputs match their hashes and the preceding collapsed-hints candidate. No application source, question bank, guide, approval contract or production configuration changed. No application suites, typecheck or build were rerun. The local server was restarted with the existing launcher after initial connection refusal and remains available at http://127.0.0.1:4256/guided.

## Findings for owner review

### BBQA-001 — medium: revisit labels do not match session question numbers

In the completed ten-question run, the summary reports “Items to revisit: Q4, Q5, Q59.” During practice the corresponding questions are displayed as Question 1, Question 2 and Question 10 of 10. No bank ID is displayed alongside those session headings, and the revisit list is plain text without links. The five-question Set 2 run similarly reports Q18 for its Question 1 of 5. The user cannot reliably map the recommendations to the displayed question numbers or jump to the recommended questions.

Reproduce: reveal hints on the first question, answer the second incorrectly, reveal a hint on the tenth, commit every answer and finish. Expected: identify session question numbers and provide a direct review action; bank IDs can be supplemental labels. Actual: bank IDs only. UI location: [summary rendering](../../../src/ui/guided/GuidedSessionPage.tsx#L138). Evidence: [summary screenshot](../../../test-results/guided-practice/builtin-browser-review/completed-summary.png), [ten-question snapshot](../../../test-results/guided-practice/builtin-browser-review/completed-ten-question.txt), [five-question snapshot](../../../test-results/guided-practice/builtin-browser-review/completed-five-question.txt).

### BBQA-002 — medium: disabled Finish provides no explanation or route to skipped questions

In five-question Set 2, commit Question 1, skip Questions 2–4 with Next, then commit Question 5. Next and Finish practice are disabled. The page gives no committed/remaining count, list of unanswered questions or explanation of why Finish is unavailable. Finish has neither a title nor aria-describedby. Previous remains usable, so this is a discoverability problem rather than a trapped session. Returning through the skipped questions and committing them correctly enables Finish, including from a middle question.

Expected: display the number of remaining commitments and a “Go to next unanswered question” action. Actual: a disabled button with no explanation. Evidence: [disabled Finish screenshot](../../../test-results/guided-practice/builtin-browser-review/disabled-finish.png), [incomplete-session snapshot](../../../test-results/guided-practice/builtin-browser-review/incomplete-last-question.txt). UI location: [navigation and Finish](../../../src/ui/guided/GuidedSessionPage.tsx#L165).

### BBQA-003 — low: navigating past feedback requires substantial scrolling

At the default built-in browser pane size, checking an answer moves the view to its feedback heading. Previous/Next/Finish appear only after decisive criteria, full reasoning, every option comparison and source details. Navigation is not visible near the feedback summary. This makes advancing repetitive and easy to overlook. Consider a compact navigation row near the answer summary or a contained sticky navigation row. This is an observed usability improvement, not a broken navigation control.

### BBQA-004 — low: local banner retains earlier evaluation wording

The notice still says “D14 local pilot — supervised evaluation preparation.” The current policy authorizes owner-led evaluation and separate explicit acceptance. The banner does not impose the old student requirement, but its wording has not caught up with the current review stage. Suggested wording: “D14 local pilot — owner review.” The accounts/cloud/telemetry and formative-use notice can remain. Location: [test-only local banner](../../../tests/local-pilot/vite.config.ts#L45).

## Exercised flow and results

- Started a new ten-question session containing all ten pilot questions. Final UI: 9 correct of 10, 7 correct without hints, 4 hints requested; revisit Q4/Q5/Q59. One intentionally incorrect response verified the negative feedback path. All other committed choices matched the displayed keys.
- Started and completed five-question Set 2. Final UI: 5 correct of 5, 4 correct without hints, 2 hints requested; revisit Q18. Answered out of order and finished from Question 2 after completing all other commitments.
- Verified three compact hint rows above choices, progressive durable unlocking, independent collapse, keyboard Space/Enter activation, reload with all saved hints collapsed, and reopening a saved hint after completion without changing displayed summary counts.
- Verified one-, two- and three-answer controls, disabled Check for insufficient cardinality, disabling excess unselected checkboxes at the required count, and Clear selection before commitment.
- Verified drafts survive Previous/Next, correct and incorrect feedback, immutable commitments, and unavailable unrequested hints after commitment. Original explanation and Vocabulary sections were absent from the inspected Guided feedback.
- Verified leaving to the saved-session list, resuming at the saved question, opening removal confirmation and choosing Keep session, completed status/View practice, reload persistence, browser Back/Forward and read-only completed navigation.
- Opened the five-question QA session in a second tab: saved draft/hint loaded, a second hint and answer committed there appeared in the first tab. Closed that extra QA tab afterward.
- Inspected screenshots of hints, feedback, summary and footer. No clipping was observed in those views at the existing pane size; no viewport override or physical-device claim.
- The captured warning/error console entries for both QA tabs were empty at the end. One browser locator read used an unsupported level filter and was corrected; another rapid click met a transient detached node during a save rerender, then succeeded after observing the current state. These are retained automation limitations, not reproduced application defects.

Two new local QA records remain: ten-question `6cdbfdd2-b2ce-4b95-8f05-fc66cf9f1817`, five-question `513542e9-7e43-4568-8461-eaf6af2bb010`. The pre-existing owner session `9692aefc-da98-4de4-a3cd-e8aa8b169e2c` was not opened or changed; it remained listed with its prior saved time. No records were deleted. The completed ten-question tab remains available for owner inspection.

## Limits and acceptance status

No blocking failure was observed in the exercised Guided flow. This is not exhaustive regression coverage. Native Chrome remains unverified in this review because Windows capture failed. Native spoken screen-reader output, physical touch/devices, other browser engines, storage-failure/protection injection, active Mock interaction, post-exam integration, account/cloud flows, PDFs and recovery were not exercised here. Earlier PDF/recovery/resource-pressure/local startup timing limitations remain unchanged.

Final owner pilot acceptance remains separate and pending, as do native accessibility/device verification, historical PDF/recovery release-risk dispositions and explicit full Phase 6 acceptance. No independent learner-usability or measurable learning-effectiveness evidence has been obtained. No publication, production enablement, deployment, commit, push or Phase 7 occurred. Stop for owner review.

Evidence and integrity: [captured manifest](../../../test-results/guided-practice/builtin-browser-review/pilot-manifest.json), [integrity and observations](../../../test-results/guided-practice/builtin-browser-review/integrity-and-observations.json).
