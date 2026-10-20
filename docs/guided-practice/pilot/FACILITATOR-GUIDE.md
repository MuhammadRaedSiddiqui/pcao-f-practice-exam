# D14 facilitator guide

**Current D14 policy — owner-authorized amendment, 2026-10-18:** [Owner-led evaluation and explicit final pilot acceptance](../D14-OWNER-ACCEPTANCE-AMENDMENT.md) replace the mandatory three-external-student requirement for the current ten-question Intermediate pilot only. No recruitment, participant consent, interviews, participant observation records or three-student evaluation are required. Policy authorization does not evidence a personal walkthrough; final owner pilot acceptance remains pending. No independent learner-usability or measurable learning-effectiveness evidence has been obtained. Native accessibility/device coverage, historical PDF/recovery release-risk decisions and full Phase 6 acceptance remain separate outstanding requirements. Participant arrangements, tasks and templates below are superseded planning history; technical setup and native accessibility instructions retain their separate scope. Production remains disabled/catalog empty; no source/content/configuration change, application-suite rerun, publication, deployment, commit, push or Phase 7.

**Preparation only: no invitations, consent collection or learner observations are authorized yet.** Use the authoritative [D14 protocol, §5](../PHASE-6-READINESS-AND-RISKS.md#5-d14-learner-observation-proposal). The owner's 18 October acceptance/waiver permits these exact ten records in this local pilot and supersedes the older independent-review prerequisite for them only. Independent human reviews remain 0/10. This evaluation is formative usability/instructional observation, not a learning-effectiveness study.

## Owner arrangement approval — complete before recruitment

| Decision | Owner-approved value/reference |
| --- | --- |
| Named facilitator and role; suitability/conflicts | ___ |
| At least three consenting participants; preferably PCAO-F preparation students; eligibility/recruitment method and dates | ___ |
| Safeguards against pressure, including teacher/student relationships; any eligibility/guardian arrangements if applicable | ___ |
| Written consent or explicitly recorded consent method; no audio/video by default | ___ |
| Withdrawal contact and process | ___ |
| Exact approved local note and consent storage locations, access roles and linkage handling | ___ |
| Retention period, deletion date/event, deletion owner, backup/sync handling | ___ |
| Profile separation and saved-app-session cleanup schedule | ___ |
| Supported browser/input/reader combinations and accessibility accommodations | ___ |
| P03 advance assignment and familiarity rationale | ___ |
| Owner authorization/date covering these arrangements | ___ |

Do not put personal contact information, consent documents, recordings or participant notes in the repository. This checkout is under OneDrive; it is not an approved participant-note location merely because it is local. Owner must decide an appropriate location and whether any sync/backups are allowed. Do not change system sync settings as part of this preparation.

| Participant pseudonym | Assigned session | Prior familiarity/exposure, volunteered only | Advance allocation rationale/date |
| --- | --- | --- | --- |
| P01 | Set 1: Q4/Q5/Q6/Q10/Q12 | ___ | Covers first five |
| P02 | Set 2: Q18/Q25/Q26/Q33/Q59 | ___ | Covers second five |
| P03 | Proposed Set 1; owner must finalize Set 1 or 2 before any observation | ___ | Balance familiarity across assignments; decision/date ___ |

No participant has been recruited or assigned in fact. The table is a proposed schedule. If familiarity information requires a different P03 allocation, record the owner-approved change in advance, without using observed answer performance to choose. P01 and P02 together must encounter all ten accepted guides; if someone withdraws, do not claim coverage they did not provide. Arrange an additional consenting participant only under the approved recruitment plan if needed.

## Session script, approximately 30–45 minutes

Before arrival: launch the exact candidate via [setup](LOCAL-PILOT-SETUP.md), record manifest/artifactId, OS/browser/input and set. Use a fresh dedicated participant profile with no real account/report. Verify ten guides/two five-question sets. Keep other participants' profiles/notes closed. Have the blank [observation sheet](OBSERVATION-TEMPLATE.md), [consent](CONSENT-TEMPLATE.md) and [participant instructions](PARTICIPANT-INSTRUCTIONS.md) available. Avoid running other QA workloads during the session.

Opening (roughly 5 minutes): “We are testing the application. We are not assessing your intelligence or ability. Your answers will not predict certification results. Think aloud naturally; hints are available whenever useful. You may take breaks or stop at any time.” Explain approved note access/retention/withdrawal arrangements, confirm questions and actual consent before any task. Record only pseudonym and consent reference in the observation sheet. Stop if consent is absent or unclear.

Practice (roughly 20–30 minutes): ask the learner to choose their assigned five-question set. Do not show keyed authoring documents or this package's private identity/answer evidence. For **each question**, use these neutral prompts at natural pauses:

1. What is the scenario asking you to decide?
2. Which information is most important?
3. Why did you choose this answer?
4. Which other option seemed plausible, and why did you reject it?
5. If you used a hint, what did it help you understand?
6. After feedback, can you explain the correct reasoning in your own words?

Before commitment, record the learner's initial reasoning and strongest rejected alternative. For multiple responses, ask how the chosen set covers the scenario constraints and why excluded options fail. Do not supply the constraints, key, arithmetic, option eliminations or vocabulary definitions. Do not require all hints to be used: note “not requested” when appropriate, and assess cumulative leakage only for hints actually seen. After feedback, distinguish their paraphrase from your interpretation. Record whether they can explain constraints and reject the strongest alternative; use qualitative observed/unclear/not observed notes, with no invented numerical success target.

Observe control location, terminology, hint usefulness/leakage, explanations, single/multiple selection counts, tables, navigation/saving, locked-answer understanding, unexpected errors and assistance. Ask neutrally to go Next/Previous once and reload once, after a save acknowledgment. Invite them to inspect Finish and the read-only summary; do not unlock answers. Give operational help only when necessary and record its exact wording and trigger. Ask “What would you try next?” before helping; do not coach toward correctness.

Close (roughly 5 minutes): “What was most confusing?” “What would make this more useful?” Ask what saving locally, locked answers and previously seen questions mean to them. Remind them of withdrawal contact and approved note handling. Record voluntary comments only. Perform approved session/profile cleanup after retention requirements are satisfied; do not delete evidence impulsively while investigating a defect.

## Defects and stopping

Pause the affected task for key/content disputes, hint leakage, privacy exposure, data loss or unsafe protection behavior. Preserve only approved pseudonymous evidence. Log exact steps and artifact in [findings/defects](FINDINGS-AND-DEFECTS-TEMPLATE.md). Do not edit content or app code, bypass protection or substitute synthetic material. Request separate implementation/content authorization for a blocking runtime problem or unrelated fix; affected content changes require fresh identities and educational approval. Repeated confusion needs an owner-reviewed action and consented retest, even without three-person consensus. The owner reviews actual findings before accepting D14; no automated test can replace those observations.

## Separate native accessibility workstream

Use the complete existing [§6 SR1–SR12 procedure and acceptance checklist](../PHASE-6-READINESS-AND-RISKS.md#6-native-screen-reader-procedure-and-accessibility-acceptance). It remains **unexecuted and unaccepted**.

Use a real installed Windows reader, such as NVDA or Narrator, launched normally by its operator; use its documented heading, form and table navigation commands. Do not install software or invent spoken results. Record actual Windows, browser and reader versions, speech/braille mode, zoom/text scale, viewport, keyboard/physical input, operator/date and pilot artifactId. This owner-approved-content pilot may supply SR1–SR7 and relevant SR11 states. SR2's D12 policy is now accepted: test existing 5/10 selection/reset and two five-item sets; do not add custom overlap content. Do not force learners to complete ten questions as part of D14.

Use separately prepared, excluded synthetic fixtures for SR8 report dialogs, SR9–SR10 fault/private-account/protection cases and SR12 recovery/disabled-preview checks. These are separate artifacts: record their identities and existing procedure, never enable real accounts in this pilot. Reuse engineering evidence where applicable, but leave native-reader rows not run until a human operator performs them. Record unavailable reader/fixtures or unsupported combinations as coverage gaps.

For every SR row record: action/expected result ___; actual spoken output and reading order ___; focus destination ___; keyboard commands/mode changes ___; pass/fail/not run ___; defect/evidence ___; operator/date ___; artifact/fixture ___ . Leave speech/output fields blank until heard. Check no precommit or protected instruction leaks, hint/commit status and focus, radio/checkbox counts, tables, reload/summary, dialog containment/return, errors and actual 200% text/reflow. Physical touch/other engines require explicit results or owner-reviewed gaps. DOM assertions, screenshots and this technical smoke are not native accessibility acceptance.
