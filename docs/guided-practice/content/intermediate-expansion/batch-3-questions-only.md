# Intermediate expansion — Batch 3 solve-first copy

Exact validated bank stems, option order and sources; no keys or feedback. Record your choices and reasoning before opening the draft or answer-bearing ledger. Q30/Q31 retain every original table column, row, value and unit plus all surrounding constraints.

## Q29

A warehouse analyst asks AI to calculate average delivery times from a file. The brief states the included rows, units, treatment of blanks, and required output. In two fresh chats, the assistant follows them but gives inconsistent averages.

Its replies contain explanations without an execution log. The analyst’s calculation on five included rows disagrees with both answers. The file and configuration are current. Code execution is available but has not been used. She is choosing a next test, rather than asking for a polished explanation.

Which next test best targets the remaining failure?

**A**

Request a longer step-by-step explanation in the current chat, then compare the assistant’s confidence and assumptions with those shown in its previous two answers.

**B**

Use a stronger reasoning model with the request, comparing its written average with the earlier results before deciding whether a tool change is needed.

**C**

Have AI write and run the calculation, first compare its result on five known rows, then check the full result and method.

**D**

Restate the complete inclusion and blank-field rules in another fresh chat, then compare its answer with the first two to identify a majority result.

Sources:

- Workflow Design & Diagnosis — 12. The sequence runs cheapest first — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course
- Code You Never Write — 6. Verifying work you cannot read — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q30

A home-appliance company runs an AI support assistant without staff watching each conversation. It should help customers resolve routine setup problems. An audit finds:

| Measure | Result |
| --- | ---: |
| Correct answers checked | 98% |
| Customers resolving their problem | 24% |

Many unresolved customers report receiving the same accurate instructions repeatedly, without help when a step fails. Staff verified those instructions against the manuals. The service lead must choose what to examine next before calling the assistant effective; the audit does not explain every unresolved case.

Which evaluation best addresses the remaining performance question?

**A**

Inspect unresolved conversation sequences and what customers tried next, checking whether the assistant adapts after a failed step and supports an appropriate next action.

**B**

Check a larger random sample of individual answers against the manuals, accepting the assistant’s performance if its factual accuracy stays above the existing threshold.

**C**

Compare the assistant’s resolution rate with its answer accuracy and classify every unresolved case as an incorrect answer before changing its factual reference material.

**D**

Ask a stronger model to rewrite the accurate instructions more clearly, then judge service quality by reviewers’ ratings of the replacement responses before deployment.

Sources:

- AI Fluency: A Crash Course — 5.3 Performance discernment: is the AI serving people well when you are not watching? — https://agentfactory.panaversity.org/docs/ai-fluency-crash-course

## Q31

A tour operator tests two AI configurations on ten brochure summaries and ten booking-detail extractions. Each task has an independently checked answer standard. Trials use the same inputs and briefs, and costs are equal.

| Configuration | Summaries passing | Extractions passing |
| --- | ---: | ---: |
| R | 9 of 10 | 7 of 10 |
| T | 8 of 10 | 10 of 10 |

The operator requires at least nine passes for each task before repairs. Separate configurations are allowed; combined-model workflows have not been tested. Staff will continue checking results after the initial choice.

Which TWO initial assignments satisfy the stated per-task trial requirement?

**A**

Assign R to booking-detail extraction, carrying over the confidence earned on its more demanding summary task while continuing to check the extracted booking fields.

**B**

Assign R to brochure summaries, using its results on that task as the basis for this assignment and checking subsequent summaries against the standard.

**C**

Assign T to brochure summaries, carrying over its perfect extraction performance while using staff feedback to improve the tone of any summary needing repair.

**D**

Assign T to booking-detail extraction, using its tested performance on those fields as the initial basis rather than inferring ability from its summary results.

**E**

Assign both configurations to each task and accept whichever answer their comparison favours, using agreement to bring the combined workflow above the trial threshold.

Sources:

- What AI Actually Is: A Crash Course — 7. It is brilliant and useless on two tasks in a row (the jagged frontier) — https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course

## Q32

A property maintenance firm lets AI prepare customer notices from approved work orders. The managed route and data use are approved. Notices include an appointment date and a quoted charge; sending them creates a customer commitment.

Company policy assigns approval of those commitments to the account manager. A clerk already checks spelling and layout, but nobody has been assigned to verify dates and charges before sending. The account manager is available for each notice. The team is choosing a gate for this final step.

Which proposed gate makes the sending step ready under these conditions?

**A**

Have the clerk compare dates and charges with work orders before sending, then ask the account manager to review a weekly sample for consistency.

**B**

Have the account manager read the notices for wording before sending, relying on the existing layout check to identify an incorrect date or charge.

**C**

Have the account manager check dates and charges against approved work orders and approve each notice before the workflow sends it to a customer.

**D**

Have the account manager compare every sent notice with its work order before the appointment, correcting any wrong commitment while there is still time.

Sources:

- Governance, Risk & Responsible Use: A Crash Course — 1.3 A human in the loop is not a gate — https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course

## Q34

A consultant asks AI to create a downloadable supplier comparison for a client. The preview contains the requested table, and its cancellation terms have been checked against the attached proposals. AI then exports a file and reports:

> The client document is complete. The references are included, and the file is ready to send.

The consultant has not opened the exported file. Previous exports sometimes changed table wrapping and shortened notes. She must decide whether this deliverable is ready, rather than whether its preview looked correct.

Which verification best addresses that decision?

**A**

Check the on-screen preview again against the proposals and accept the export if every cancellation term still appears correct in that preview’s comparison table.

**B**

Ask AI to list the exported document’s sections and references, then compare that list with the original request before accepting its completion report.

**C**

Open the exported file to confirm that it downloads successfully, then rely on the earlier preview checks for the table’s content and cancellation notes.

**D**

Open the exported file, inspect its table and cancellation notes, and trace the terms to the proposals before deciding whether to send the deliverable.

Sources:

- Just Delegate It: A Crash Course — 10. Verify Before You Accept — https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course

## Q35

A team has an installed board-paper Skill whose method passes when invoked directly. The activation test logs show that a normal request for an annual board paper does not load it. The Skill should handle monthly and annual board papers, but exclude quick status messages.

Its current description says:

> Prepares monthly board papers. Use for monthly board reports. Do not use for annual reports or short status updates.

The team wants to correct the installed Skill’s activation boundary while keeping its procedure and short-status exclusion.

Which change best targets the observed activation failure?

**A**

Add an annual-report formatting example to the procedure, keeping the current description so monthly board papers continue to activate the Skill normally.

**B**

Revise the description to cover monthly and annual board-paper requests and their likely wording, retain the short-status exclusion, and test both kinds of request.

**C**

Remove all exclusions from the description and let every reporting request load the Skill, then use the procedure to decide its output.

**D**

Create a second copy for annual papers, leaving the original description unchanged and copying its procedure so the Skill can produce the same layout.

Sources:

- Skills & Connectors: Teach AI Once, Connect It to Your Apps — 12. The description field is the whole game — https://agentfactory.panaversity.org/docs/skills-connectors-crash-course

## Q36

A community workshop wants code to total equipment checkouts by item. The attached file contains item names and quantities, including entries such as “4 units”, repeated rows, and blank quantities. The coordinator knows the output should be an item-total table plus an exceptions list.

Her draft prompt says:

> Write and run code to total this file by item. Return the totals and exceptions.

Nobody has agreed whether repeated rows are duplicate entries or separate checkouts, or what a blank quantity means. Calculation has not started.

Which revision best prepares this job for a reliable calculation?

**A**

Specify the programming language and conversion functions, letting the assistant choose defaults for repeated rows and blank quantities when generating the item totals.

**B**

Ask for two independently generated scripts and compare their totals, accepting matching results as evidence that the repeated rows and blanks were handled correctly.

**C**

Inspect the input formats, settle duplicate and blank-quantity rules with the coordinator, and record those decisions in the brief before running the calculation.

**D**

Require the assistant to list blank and repeated rows in the exceptions output, while letting its cleanup method decide how those rows affect totals.

Sources:

- Code You Never Write — 5. Brief the problem, not the program — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q37

A distributor’s AI sales brief used to match its offered product range. Since a catalogue migration, fresh chats include retired products while following the required layout. The brief still explicitly requires the currently offered range, and the model has not changed.

Staff know the sales team published a replacement catalogue, but have not checked which catalogue or instruction version the Project loads. The source documents do not update there automatically. The supervisor wants to investigate the drift before revising the request.

Which check best targets the leading explanation?

**A**

Add stronger wording to the requirement and rerun the brief in the existing Project, leaving its reference files unchanged to preserve the working setup.

**B**

Use a stronger model with the existing Project materials, comparing whether its broader product knowledge avoids the retired entries in the next sales brief.

**C**

Start another fresh chat with the same Project context and ask for a shorter brief, reducing the amount of information competing with the requirement.

**D**

Inspect the Project’s loaded catalogue and instruction versions against the replacement sources, update stale configuration, and rerun a case that exposed the retired products.

Sources:

- Workflow Design & Diagnosis — 11. Four causes, told apart by when the symptom appeared — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course

## Q38

A manager asks AI to compare two warehouse layouts. Floor plans and equipment costs are attached, but the current daily order volume is not. It is required to choose between the layouts; it is unavailable to the assistant’s tools.

The manager can provide the figure from the operations record. Meanwhile, she wants useful analysis of the visible trade-offs. A colleague suggests increasing reasoning effort so AI can complete the decision without it. She wants an approach using available material without inventing the missing measurement.

Which TWO actions together best support analysis now and a grounded decision later?

**A**

Analyse the supplied plans and costs, showing how the preferred layout changes under explicitly labelled order-volume assumptions rather than presenting assumptions as measured demand.

**B**

Increase reasoning effort and estimate the missing volume from the scale of the floor plans, treating the inferred number as the current operations figure.

**C**

Ask the manager for the checked order-volume figure, then use it to update the comparison before recommending a layout based on actual daily demand.

**D**

Ask another model to infer the daily volume from the same attachments, using agreement between their estimates as confirmation before choosing the warehouse layout.

**E**

Use a model with a larger context window and rerun the attachments, relying on the extra reading capacity to recover the absent operational measurement.

Sources:

- What AI Actually Is: A Crash Course — 9. "Thinking" is just more prediction before the answer — https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course
- What AI Actually Is: A Crash Course — 5. The context window is the only thing it can see — https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course

## Q39

A retailer schedules a daily competitor-price report. The agreed outcome is a dated comparison file in the team folder, covering the listed products or explicitly stating that no prices could be checked. Staff must review it before using it for pricing decisions.

Today the task dashboard says:

> Run completed.

The reviewer has not located today’s report and has no evidence about its coverage or delivery. Yesterday’s file is present. She must decide what the status proves and what to check next.

Which assessment and next check best fit the current evidence?

**A**

Treat the completed status as success and use yesterday’s report for continuity, asking the next run to explain any changed competitor prices it discovers.

**B**

Treat the status as execution evidence; locate today’s output and check its date, coverage, or explicit no-data result in the destination before accepting success.

**C**

Treat the missing report as proof that no prices changed, and record a no-change result in the folder so the report sequence remains complete.

**D**

Treat the missing report as proof that the prompt is inadequate, rewrite its output instructions now, and rerun the schedule before inspecting the run.

Sources:

- General Agents on the Web: A Crash Course — Ran is not the same as worked — https://agentfactory.panaversity.org/docs/general-agents-web-crash-course
