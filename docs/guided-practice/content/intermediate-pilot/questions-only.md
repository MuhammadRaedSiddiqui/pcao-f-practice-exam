# Intermediate pilot — solve-first questions

Review batch 1 (Q4, Q5, Q6, Q10, Q12), then batch 2 (Q18, Q25, Q26, Q33, Q59). Record an independent answer, reasoning and any ambiguity before opening the guides or review ledger. This document contains the original stems, options and references exactly; it deliberately has no answer key or feedback. All ten are proposed candidates; selection approval is pending.

## Q4

An organiser wants AI to help prepare a course leaflet for working adults who are beginners. Classes run on weekday evenings. The leaflet should explain practical benefits in plain language.

She wants to compare different structures and give feedback before any full leaflet is written. Her current prompt says:

> Write a course leaflet now. Use a professional tone and include a course outline.

The assistant has not started. She is choosing changes that together give it the necessary direction.

Which TWO changes together make the prompt match her stated requirements?

**A**

Give the readers’ starting level, evening timetable, and useful outcomes; use familiar wording for people studying alongside their normal jobs and commitments.

**B**

Request several outline options with a complete leaflet under each one, so she can compare structures alongside examples of their finished wording.

**C**

Ask AI to score three outline options against the course aims and expand the highest-scoring one, giving the organiser a reason for its choice.

**D**

Offer three possible layouts in brief form, then pause for her comments and approval of a direction before developing the finished text.

**E**

Set a short word limit and ask AI to check grammar and tone, then return a polished leaflet that the organiser can review.

Sources:

- AI Prompting in 2026: A Crash Course — 7. The brainstorm-iterate loop — https://agentfactory.panaversity.org/docs/ai-prompting-2026

## Q5

A team tests four AI configurations on the same eight representative report tasks, using identical briefs and inputs. All configurations have approved access to the required files. Costs below cover one complete trial.

| Configuration | Correct without repair | Trial cost |
| --- | ---: | ---: |
| R | 6 of 8 | $0.40 |
| S | 8 of 8 | $0.90 |
| T | 8 of 8 | $2.00 |
| U | 8 of 8 | $1.20 |

The team requires eight correct results before manual repair and then the lowest tested cost. These trials do not guarantee future performance.

Which initial choice best fits those criteria?

**A**

Choose T because it meets the quality threshold; budget for the more expensive configuration as insurance against difficult reports that may arrive later.

**B**

Choose R and reserve the savings for manual corrections; keep checking report quality so repaired results meet the same standard as the trials.

**C**

Choose U because it meets the quality threshold and costs less than T; review future results to confirm that the savings continue to hold.

**D**

Choose S and keep reviewing new reports; its tested results meet the required standard without paying more than other qualifying configurations cost.

Sources:

- AI Prompting in 2026: A Crash Course — 12. Cost, speed, and which model to use when — https://agentfactory.panaversity.org/docs/ai-prompting-2026

## Q6

A visitor centre uses a shared Project to draft ticket information. Its ticket guide has changed from version 2 to version 3; version 3 replaces the older prices. The team must preserve version 2 for archive checks, but new drafts should have only one active price reference.

The drafting steps and layout have not changed and already sit in a reusable Skill. Staff work on other Projects too. The centre wants to update knowledge without creating another copy of changing prices.

Which configuration change best meets that need?

**A**

Keep both guides in the active Project and add an instruction to prefer version 3; leave the existing Skill unchanged for future ticket drafts.

**B**

Replace the active Project guide with version 3 and retain version 2 in a separate archive; keep the unchanged drafting steps in the Skill.

**C**

Keep version 2 as the Project reference and put version 3 prices in the Skill, so the procedure applies the current values when used.

**D**

Remove the old guide from the Project and put version 3 prices in staff’s global custom instructions, keeping the same Skill for the layout.

Sources:

- Workflow Design & Diagnosis — 14. Rule, reference, or procedure — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course
- Skills & Connectors: Teach AI Once, Connect It to Your Apps — 4. Skills vs Connectors vs Projects vs Custom Instructions — https://agentfactory.panaversity.org/docs/skills-connectors-crash-course

## Q10

A care centre’s office manager uses AI to summarise an administrative handover. The short, fresh chat contains the complete notes, including each unfinished task and its named owner. The manager needs a list of actions and owners.

Her prompt says:

> Summarise these notes clearly for the next shift.

The first response gives a readable overview but omits the action list and owners. No calculation is involved. She has not changed the prompt or checked whether its instructions express the required output.

Which check should she try first?

**A**

Open another fresh chat with the same notes and prompt, then compare the two summaries for signs that previous context affected the missing details.

**B**

Use a stronger model with the same notes and prompt, then see whether its more capable analysis recovers the tasks and owners automatically.

**C**

Compare the prompt with the needed output, add an explicit action-and-owner list requirement, then check the revised result against the supplied notes.

**D**

Upload the handover notes again and keep the current prompt, then compare its summary with the previous output to test whether anything was missed.

Sources:

- Workflow Design & Diagnosis — 12. The sequence runs cheapest first — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course

## Q12

An office assistant has AI write a script to reorganise workshop registrations. The approved rule keeps every registration once, including records with blank phone numbers. Duplicate registration IDs are not present.

A hand-checked sample produces the expected names and order. The full run reports:

| Check | Result |
| --- | ---: |
| Input registrations | 36 |
| Output registrations | 35 |
| Execution errors | 0 |

The missing registration has not been identified. The assistant cannot read the code and has not checked its handling of blank fields.

Which next check best addresses the full-run discrepancy?

**A**

Repeat the hand-checked sample with the same script, then compare its names and ordering again before deciding whether the full output is usable.

**B**

Insert a registration with a deliberate error into the sample and check whether the script catches it before accepting its other validation results.

**C**

Ask a second assistant to reproduce the sample result independently; use agreement to decide whether the original script’s full output is dependable.

**D**

Compare input and output IDs to locate the missing registration, then request a plain-language account of the rule that caused its removal.

Sources:

- Code You Never Write — 6. Verifying work you cannot read — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q18

A repair service asks AI for net receipts: receipts minus refunds. All figures are dollars, and there are no other adjustments. The complete source export contains:

| Period | Receipts | Refunds |
| --- | ---: | ---: |
| April | 420 | 20 |
| May | 360 | 40 |
| June | 300 | 0 |

AI replies:

> April $400; May $340; June $300. Quarterly net receipts: $1,040.

The analyst has verified that the three rows match the source. She is choosing corrections to the displayed calculation before including it in the quarterly report.

Which TWO corrections together make the displayed figures consistent with the source and stated rule?

**A**

Change the quarterly total to $1,000 while retaining the displayed monthly amounts, because the source shows three periods and no adjustments.

**B**

Change May’s net receipts to $320, calculating the amount from that month’s receipts and refunds rather than carrying forward the displayed figure.

**C**

Change May’s net receipts to $300 by assigning the combined April and May refunds to May, keeping the quarterly total consistent with the source.

**D**

Change the quarterly total to $1,020 after correcting the monthly amounts; check that adding those amounts matches total receipts less total refunds.

**E**

Keep the quarterly total at $1,040 and describe the May difference as a timing adjustment, so the report reconciles without changing its result.

Sources:

- AI Prompting in 2026: A Crash Course — 10. Data analysis (the model writes and runs code) — https://agentfactory.panaversity.org/docs/ai-prompting-2026
- Code You Never Write — 6. Verifying work you cannot read — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q25

A charity uses AI to shortlist applicants for a free training course. Every applicant’s availability and experience are included. Applying online or by telephone is permitted, and the agreed selection rules do not favour either route.

The first run reports:

| Route | Applicants | Shortlisted |
| --- | ---: | ---: |
| Online | 32 | 18 |
| Telephone | 20 | 0 |

Staff confirmed that the eighteen selected applicants meet the rules. They have not checked exclusions. The charity is choosing a review before offering places, without assuming that the pattern proves unfair treatment.

Which review best examines the concern raised by this pattern?

**A**

Review excluded applications from both routes alongside selected cases against the same rules, checking whether telephone applicants were removed for reasons the rules support.

**B**

Ask another assistant to rerun the shortlist from the same brief, comparing its selected names with the first run before offering the available places.

**C**

Set aside places for telephone applicants in proportion to their numbers, then check the new shortlist against the original availability and experience requirements.

**D**

Review all shortlisted applications once more and compare their average experience with the full applicant pool, checking that selection favoured suitably qualified people.

Sources:

- Governance, Risk & Responsible Use: A Crash Course — 4.1 Look at who was excluded — https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course

## Q26

A coordinator reviews an AI plan for a small conference and records her decisions while preparing the final version.

| AI contribution | Coordinator’s action and reason |
| --- | --- |
| Print a twelve-page visitor pack | Shortened it to two pages for quick reading |
| Add a luggage desk | New idea she kept because many visitors arrive by train |
| No entrance-access check mentioned | Added a check because step-free access must be confirmed |

She is selecting entries that describe what she actually did, rather than simply rating the whole plan positively.

Which THREE entries accurately record these decisions and their stated reasons?

**A**

MODIFY the visitor pack: keep its purpose but reduce its length, because visitors need the information in a form they can read quickly.

**B**

ACCEPT the visitor pack: retain the original suggestion without changes, because its complete printed format gives visitors the information needed at the conference.

**C**

SURFACED the luggage desk: keep an idea she had not considered, because arrivals by train make somewhere to leave luggage useful for visitors.

**D**

MISSED the access check: add a requirement the AI left out, because the coordinator needs evidence that the entrance provides the required step-free access.

**E**

MODIFY the luggage desk: record her reason for keeping it as a change to the proposal, because the train-arrival evidence refines its suggested purpose.

Sources:

- How to Think in the AI Era: Crash Course — Discipline 2: The Reasoning Receipt — https://agentfactory.panaversity.org/docs/how-to-think-ai-era

## Q33

A team compares its existing method with an AI-assisted method for an internal meeting brief. In one parallel trial, both finished briefs meet the same agreed quality standard. Human checking includes corrections and preparation of the usable final file.

| Method | Drafting | Human checking |
| --- | ---: | ---: |
| Existing | 18 minutes | 12 minutes |
| AI-assisted | 4 minutes | 23 minutes |

The team’s goal is less total staff time per usable brief. Tool charges are negligible and equal for this comparison. It is deciding what this trial supports before replacing the existing method.

Which conclusion best fits the measured result and current evidence?

**A**

The new method saved three minutes through completion; run both for further cycles and check whether that saving continues at the same quality standard.

**B**

The new method saved fourteen minutes, so adopt it now and record the extra checking as a separate review activity outside the drafting workflow.

**C**

The new method made work slower because checking rose by eleven minutes; retain the existing method until checking time falls below twelve minutes.

**D**

The new method saved twenty-six minutes against the old total; adopt it while treating its short drafting time as principal evidence of the improvement.

Sources:

- Workflow Design & Diagnosis — 16. Measure the thing you actually care about — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course

## Q59

A company has approved a daily AI workflow that drafts internal answers from public FAQ pages. It uses one model family, reads only those pages, saves in the team folder, and cannot send messages. A supervisor reviews drafts before staff use them.

The team proposes changes. Its governance owner requires review when the approved workflow’s data, capability, model, audience, or consequences change. The original approval is available. The team is deciding which proposals need that review before use, not which should automatically be rejected.

Which THREE proposed changes trigger the stated governance re-check?

**A**

Enable the workflow to send its answers to customers, extending it from internal draft preparation to external messages while keeping the basic answer layout.

**B**

Repeat the approved daily run tomorrow with the same sources, model, permissions, destination, review arrangements, and purpose, after confirming none of those conditions changed.

**C**

Change the heading style in the internal drafts, keeping their content, audience, sources, model, permission scope, destination, and human review exactly as already approved.

**D**

Add named employee complaint notes as an input source, using the same model and output format to include this information in the drafted answers.

**E**

Switch the workflow to another model family, retaining the same sources and output layout but changing the system that processes information and produces drafts.

Sources:

- Governance, Risk & Responsible Use: A Crash Course — 8.5 Re-check when the workflow changes — https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course
