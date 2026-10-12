# PCAO-F Full Mock — 60 Questions

This practice mock contains 60 questions with a 120-minute practice limit. Follow the selection count stated for each question.

## Q1 — Select ONE

A housing association uses AI to prepare account-correction letters from approved rent records. The letters may change a resident's balance or promise a repayment arrangement. AI creates drafts only. Before release, an authorized reviewer must check each proposed adjustment and promise against the underlying records and approve the letter.

The service manager currently reviews 40 letters a day. Each full check takes three minutes, and she has two hours available. Next month, the expected volume rises to 80 letters a day. A deputy has the same approval authority and could provide another two hours if the director reallocates her duties. Administrative clerks can check arithmetic, but cannot approve adjustments or repayment promises.

The drafting process has performed well, and clerks already catch most numerical errors. The director wants the higher volume handled within the working day. She wants to preserve the existing release standard while making the workflow practical, rather than leaving a review requirement that staff cannot actually complete.

Which redesign best meets those requirements?

**A.** Have clerks check every source record and let the manager approve a consolidated summary. This uses existing staff while keeping final approval with an authorized person.

**B.** Allocate the deputy to share the full checks, record both reviewers in the workflow, and confirm that their available time covers the expected daily volume.

**C.** Have AI perform a second check, with the manager reviewing exceptions and the deputy reviewing a sample of other letters before the daily batch is released.

**D.** Have the manager approve standard letter templates, then let clerks release letters that match them. Reserve the deputy for unusual adjustments and repayment arrangements.

## Q2 — Select ONE

A repair-service team asked AI to identify every request needing a callback under a written checklist. A callback is needed when the customer reports that a repair failed or asks for a promised update. The supervisor then checked the original text of every request AI selected. She has not reviewed any unselected requests, and no other process has checked them.

| Recorded result | Number of requests |
| --- | ---: |
| Requests supplied to AI | 360 |
| Requests selected for a callback | 36 |
| Selected requests checked against the original text | 36 |
| Checked selections that met the checklist | 36 |
| Unselected requests checked against the checklist | 0 |

The AI-generated review note states:

> All selected requests were confirmed. The system therefore identified every request needing a callback, and the remaining 324 requests can be closed without further callback review.

Which assessment is best supported by the recorded evidence?

**A.** The review establishes a 10% callback rate for this intake. Further checking would assess consistency, rather than change the conclusion that 36 requests required follow-up.

**B.** The review supports the selection method because all chosen cases qualified. Checking another intake would be the strongest way to confirm that this intake was fully covered.

**C.** The selections are supported, but closure should wait until a second model independently returns the same callback list. Agreement would substantiate coverage of this intake.

**D.** The 36 selections are supported, but coverage remains unknown. Review unselected requests against the checklist before treating the note as evidence that none were missed.

## Q3 — Select ONE

A community sports trust is reconciling membership renewals. Its policy permits member-level records for this purpose only in its managed AI workspace. Other routes require separate approval. Member IDs are needed to match renewals to existing accounts; the analysis does not decide eligibility or contact members.

The table records actions in execution order. No member records entered any AI system before step 4. The permissions described in step 3 were actually applied before processing began.

| Step | Checkpoint | What was recorded or done |
| --- | --- | --- |
| 1 | Task and ownership | AI would prepare a draft reconciliation. The membership officer would verify matches and unresolved cases against the source records before updating accounts. |
| 2 | Data classification | The privacy officer classified the member IDs and renewal rows as internal personal data, and confirmed that the authorized renewal purpose covered this reconciliation. |
| 3 | Capability and access | Security inspected the provider’s built-in file-processing capability and approved it for this task. Access was limited to the supplied renewal files, with account updates, messages, and unrelated files unavailable. |
| 4 | Processing route | Because the managed workspace's upload queue was slow, the analyst uploaded the records through a personal temporary chat in the same AI product, without separate route approval. |
| 5 | Accuracy check | The analyst accepted the computed renewal total after comparing it with a second total generated by the same AI; neither total was tested against independently known results. |
| 6 | Final use | The membership officer began the planned source checks. No account updates or member messages had yet occurred. |

At which step does the process FIRST depart from the stated policy or course-supported method?

**A.** Step 2: retaining member IDs prevents the rows from becoming anonymous. The privacy officer should have required aggregate data before allowing a renewal analysis.

**B.** Step 5: agreement between two AI-generated totals does not provide an independent known-answer check. The analyst has not yet substantiated the computed renewal figure.

**C.** Step 4: the temporary conversation is a different processing route. Its privacy controls do not supply the separate authorization required for these member-level records.

**D.** Step 3: limiting access to supplied files prevents meaningful reconciliation. Security should have granted account-update access so the capability could complete the entire workflow.

## Q4 — Select exactly TWO

An archive coordinator wants duplicate downloads moved into a review folder. Under the archive rule, files are duplicates only when their complete contents are identical. The most recently filed copy must remain in place. Files with different contents must remain separate, even when their names or sizes match. If filing order cannot be established, that group must stay untouched and be listed for the coordinator.

The approved folder is backed up. The coordinator will inspect a complete move manifest before authorizing any changes. The proposed prompt is:

> Work only in the approved archive folder. Group duplicate files by matching filename and file size. Keep the newest filed copy and propose moving the others into the review folder. If filing dates are missing or tied, use the order of files in the folder listing. Show every proposed move and wait for approval. Leave other files unchanged.

Which TWO independent revisions make the prompt comply with the duplicate and uncertainty rules while preserving the requested workflow?

**A.** Base duplicate groups on verified equality of complete file contents, rather than filename and size. Keep the existing manifest and approval step before any movement.

**B.** Compare extracted text and document titles to identify equivalent copies, including differently named files. Retain the newest filing date and show the resulting groups for approval.

**C.** Use the earliest dated copy when filing dates are tied or missing, recording that fallback in the manifest so the coordinator can inspect it before approval.

**D.** Leave a duplicate group untouched when its filing order is unresolved. List the uncertainty separately instead of choosing a retained copy from the folder listing.

**E.** Ask a second model to review the proposed duplicate groups and date choices against the manifest. Move only groups where both models agree after coordinator approval.

## Q5 — Select ONE

A museum communications team is choosing one AI configuration for batches of 30 short exhibition briefs. All three configurations are approved for the same source material. In matched trials, staff used the same brief and review standard. After the recorded verification and repairs, every final batch met that standard. The table shows the complete work required; there were no additional steps.

Each batch must be ready within 28 minutes. Only 18 minutes of staff review time are available, and the tool charge must stay within $3 per batch. Generation finishes before review begins, so those times are added when planning turnaround. The team cannot add staff or reduce the review standard.

The next batches are expected to have the same size and task mix. The team wants the lowest tool cost among the tested configurations that satisfy all three limits. It will use these measurements as planning estimates and continue monitoring actual results.

| Configuration | Generation time | Staff verification and repair time | Tool charge per batch |
| --- | ---: | ---: | ---: |
| K | 2 minutes | 36 minutes | $0.40 |
| L | 6 minutes | 20 minutes | $1.30 |
| M | 10 minutes | 17 minutes | $2.50 |

Which choice is best supported by these trials and operating limits?

**A.** Choose K because its low generation cost leaves room for verification. Keep the existing review standard and use the observed repair time when scheduling each batch.

**B.** Choose L because its measured total turnaround is shortest and its cost is lower than M. Keep the full verification and repair process used in the trials.

**C.** Choose M because its measured generation and review work fit both time limits and the budget. Confirm those conditions continue to hold on later batches.

**D.** Generate with K and ask L to repair the drafts before staff review. Use their individual trial times to plan a cheaper combination within the limits.

## Q6 — Select ONE

A consultancy prepares reports for two clients using the same AI account. The same analysts are authorized to work on both clients, and both clients' material is approved for the available environment. Their reporting conditions differ: one requires every statement of a service commitment to cite its contract section; the other requires unresolved commitments to be listed separately for discussion.

The report layout and assembly procedure are otherwise identical. Analysts currently start new chats and paste whichever client instructions and reference files they remember. During staff rotation, one report inherited the other client's treatment of unresolved commitments. The procedure itself was followed correctly.

The available setup supports shared Projects with their own instructions and reference files, account-wide custom instructions, and reusable Skills. The director wants each client’s chats to start with only that client’s standing rules, including chats that do not run the report procedure. She wants one maintainable assembly procedure. General preferences, such as concise language, should still apply across unrelated work.

Which configuration best meets those needs?

**A.** Use a separate shared Project for each client’s rules and references, keep the common assembly procedure in a reusable Skill, and reserve custom instructions for global preferences.

**B.** Keep both clients in one shared Project and require a client-name field in each request. Store both rule sets beside the references and use one assembly Skill.

**C.** Put each client’s reporting conditions inside a separate assembly Skill, leaving Projects for reference files. Let each analyst choose the appropriate Skill when starting a new chat.

**D.** Put both client rule sets in account-wide custom instructions with a client-name condition. Keep the common procedure reusable and attach each client’s reference files when needed.

## Q7 — Select ONE

A training coordinator has been producing workshop handouts in one AI conversation. The initial brief required a short safety reminder on every handout and used an attached, current policy. The first twelve handouts followed that requirement. After many rounds of alternative examples, discarded drafts, and unrelated planning notes, recent handouts have omitted the reminder.

The coordinator checks the original brief: the reminder, audience, source policy, and output format were all clearly specified. The source policy is still current, and the model and enabled features have not changed. Restating the reminder once in the existing conversation fixes one handout, but the omission returns later. The same task is still within the model's demonstrated capabilities.

She suspects the accumulated conversation is contributing to the problem, but timing alone does not establish the cause. She wants a small comparison that can test that explanation before changing shared instructions, replacing the model, or redesigning the handout workflow.

Which next step provides the clearest confirmation test?

**A.** Ask for a summary of the conversation and continue in the existing session. Compare the next handout with the last one to see whether summarization improves compliance.

**B.** Use a more capable model on the full conversation, preserving the existing source and brief. Compare its next handout with the recent drafts before changing configuration.

**C.** Promote the reminder to a shared standing instruction, then repeat the handout in the current conversation. Check whether the new configuration prevents another omission.

**D.** Run the same task and brief in a fresh conversation with the current policy and only necessary task facts. Compare reminder compliance without changing the model.

## Q8 — Select exactly TWO

A studio asks AI to calculate billed courier costs for completed shipments and compare the result with a $200 budget. Canceled shipments must be excluded. All figures are in dollars; quoted charges are estimates, while billed charges are the amounts actually charged.

| Shipment | Status | Quoted charge | Billed charge |
| --- | --- | ---: | ---: |
| P1 | Completed | 45 | 40 |
| P2 | Completed | 60 | 55 |
| P3 | Canceled | 25 | 0 |
| P4 | Completed | 45 | 35 |
| P5 | Completed | 50 | 40 |

The visible execution record confirms that code ran, read all five records, and summed the quoted-charge column without filtering status. It produced 225. The assistant reports:

> The code processed all five records without an error. Courier costs were $225, which is $25 over budget. I also checked that the five quoted charges add to $225, confirming the report.

Which TWO conclusions are supported by the request, source records, and execution evidence?

**A.** The agreement between the code result and the added quoted charges validates the reported cost. The budget comparison can be accepted while billing differences are noted separately.

**B.** The record establishes that code executed and read every shipment. It does not establish that the calculation used the requested charge measure or eligible shipment set.

**C.** Removing the canceled shipment’s quoted charge gives $200, bringing the report into line with the requested shipment set and showing that the budget was exactly used.

**D.** The unsupported overspend indicates a code-execution failure. A second execution of the same sum would be needed before using the records to revise the reported figure.

**E.** The requested billed total is $170, which is $30 below budget. The source records do not support the reported $25 overspend, despite the successful execution.

## Q9 — Select ONE

An art-school administrator commissioned a small studio-reservation prototype through AI. It runs in one browser, uses made-up booking data, and helps staff test the form layout and scheduling rules. Staff checked the examples by hand, including a deliberately conflicting reservation, and the prototype handled those examples correctly.

The school now wants students to log in from different devices, see only their own bookings, and pay reservation fees. Double bookings must be prevented when two students request the same studio at once. Confirmed bookings must survive browser closure, and somebody must be responsible for recovering the service when it fails. These are required features, rather than possible future additions.

The prototype currently has no account isolation, shared persistent booking store, payment integration, or recovery process. The administrator can continue refining it with AI, and the approved development environment permits that work. She needs to choose how to carry the project forward while preserving the useful prototype and addressing the changed scope.

Which approach best fits the new requirements?

**A.** Extend the prototype with a shared booking file and student logins, then launch a small pilot. Let staff resolve conflicts and verify payments after confirmation.

**B.** Use the prototype to settle requirements, then develop and validate the service through an engineering workflow covering accounts, shared state, payments, recovery, and named operational ownership.

**C.** Build student accounts and payments around the prototype, store each student’s bookings in their browser, and appoint staff to recover booking records from daily exports.

**D.** Ask a stronger coding model to add all required functions in one pass. Approve release when login, booking, and payment examples succeed in the prototype environment.

## Q10 — Select ONE

A mentor is writing a reference letter for a volunteer applying to a small leadership programme. She made the assessment herself and supplied her own notes through an approved AI route. AI drafted most of the letter, including the narrative connecting the volunteer's examples to the programme's criteria. The mentor then checked every factual claim, removed an unsupported example, and confirmed that the recommendation expresses her own judgment.

The programme values a mentor's personal account of working with the applicant. Its forms ask the mentor to sign the reference, but do not settle whether drafting assistance must be disclosed. The mentor has checked the relevant organizational and programme rules; none requires or prohibits disclosure, and there is no unresolved legal or contractual issue.

She will retain responsibility for the signed recommendation. She wants to communicate accurately about the assistance because the recipient could reasonably understand the letter as personally composed, not merely personally approved.

Which disclosure choice best fits this situation?

**A.** Sign the checked letter without a drafting note, because the mentor owns its claims and judgment. Her verification makes the composition method immaterial to the recipient.

**B.** State that AI evaluated the volunteer’s suitability and drafted the reference, while the mentor verified the facts and approved its recommendation before signing the letter.

**C.** State briefly that AI assisted with drafting and that the mentor checked and owns the assessment. Describe its actual role without presenting the judgment as delegated.

**D.** Add the organization’s general statement that staff may use AI tools. Keep the letter’s specific assistance unstated because the published notice already describes the possible process.

## Q11 — Select ONE

A training coordinator asks AI to report whether 28 staff members who attended a workshop have earned its certificate. The attendance register confirms that all 28 attended. Their assessment scores have not yet been supplied.

The current provider handbook is the authoritative source for the certificate rule. Its complete relevant passage states:

> Workshop attendance satisfies the participation requirement. A certificate is issued to participants who also score at least 70% in the assessment. Participants below 70% may take one further assessment.

The AI report cites this passage and states:

> All 28 staff have completed the workshop and therefore qualify for certificates. The provider allows a further assessment for participants who want to improve their scores.

The coordinator must decide what the report can currently say about certificate eligibility.

Which revision is best supported by the cited passage and available records?

**A.** Confirm attendance and list all 28 as provisionally qualified, with certificates pending score entry. Keep the further assessment as an optional improvement opportunity for participants.

**B.** Remove the eligibility finding and request assessment scores. Retain the further-assessment statement because the handbook confirms that another assessment is available to workshop participants.

**C.** Confirm attendance, leave certificate eligibility unresolved pending scores, and limit the further-assessment statement to participants below 70%, as specified in the cited rule.

**D.** Classify the 28 as currently ineligible because their scores are absent. Replace the improvement statement with the handbook’s further-assessment condition and update eligibility when scores arrive.

## Q12 — Select exactly TWO

A food-bank coordinator wants a handover note for volunteers starting the evening shift. It should tell them what to do about overdue packing requests. The approved request log gives each request’s age, recorded next step, and responsible person; some entries have no person assigned. Volunteers cannot create assignments themselves.

The current prompt is:

> Use the request log to write a short, professional evening handover. Explain the overdue work and make the note helpful. Stay within 150 words and use only the supplied records.

The last note described the backlog clearly but used phrases such as “coordinate follow-up” without saying what a volunteer should do. It also grouped assigned and unassigned requests together. The coordinator’s feedback was “too general; make it more practical.”

The word limit and source restriction will remain.

Which TWO compatible additions supply concrete content requirements addressing the observed failures?

**A.** Write for volunteers beginning this shift, using direct instructions for the immediate work they can perform. Link each instruction to the relevant overdue request in the log.

**B.** Rank the overdue requests by age and show their request IDs in that order. Include the size of the backlog so volunteers can judge its urgency.

**C.** Use the approved handover’s calm tone and short sentences as a style example. Check the revision for clarity and remove wording that sounds abstract or formal.

**D.** For each overdue request, state its recorded next step and responsible person. Where no person is recorded, mark assignment as unresolved for the coordinator instead of inventing one.

**E.** Add a brief explanation of the log’s status terms and distinguish overdue from completed work. Use consistent labels so volunteers can interpret the summary without specialist knowledge.

## Q13 — Select ONE

A design studio is considering a slide-formatting extension built by its own research team. It would apply the studio’s fonts and spacing to a supplied deck. The deck is approved for AI processing, and a designer will review the result before release. The extension has not been enabled in the design team’s environment.

Security has verified the publisher and opened the package. The formatting code matches the stated task, but the package also includes a search utility used by the research team. In the proposed session, that utility could read every mounted project folder. It has no sending or deletion capability. The format task needs only the supplied deck and the approved style file.

The publisher offers to disable the search utility, and security can restrict the session’s mounted files. A demonstration on invented slides produced the correct layout. The studio wants to decide whether the extension is ready to use on its real project.

Which assessment best fits the evidence and the proposed task?

**A.** Proceed after disabling the search utility and verifying that the session can reach only the deck and style file. Keep the planned designer review of formatting.

**B.** Proceed after disabling the search utility and adding a formatting-only instruction. The verified publisher and inspected code make the existing mounted folders acceptable for this task.

**C.** Proceed in the existing session with the search utility retained but unused. Confirm through a monitored trial that the extension opens only the required deck and style file.

**D.** Proceed after obtaining the research team’s documented approval of the package. Retain its tested environment and add a designer check of the resulting slide layout.

## Q14 — Select ONE

A distributor uses one shared AI workspace to draft product sheets. Its product manager issues a dated catalogue every month. The catalogue is the sole authority for current dimensions and stock codes. The drafting procedure and writing rules change rarely.

Last month’s catalogue and this month’s replacement are both visible in the workspace. Some drafts combine their dimensions. The product manager wants one active authority for drafting, a separately accessible archive, and a visible record of which catalogue supplied each draft. Staff must not maintain a second copy of the product values inside another configuration file.

The four proposals below can all be implemented in the available workspace.

| Proposal | Active drafting material | Update and trace method |
| --- | --- | --- |
| R | Latest catalogue in the reference store; stable rules and procedure separately | Replace the active catalogue, archive the superseded version outside drafting retrieval, and record the catalogue version on each draft |
| S | All catalogue versions in the reference store; newest-date preference in the rules | Add each new catalogue and record whichever version the draft cites |
| T | Product values copied into the procedure; catalogues held in the archive | Update the procedure’s values each month and record its release date |
| U | Latest catalogue in the reference store; selected dimensions copied into standing rules | Replace the catalogue monthly, update copied dimensions, and record both dates |

Which proposal meets the maintenance and traceability requirements?

**A.** Choose S because its date preference selects current information while preserving comparison material. Recording the cited version gives the product manager an inspectable source trail.

**B.** Choose T because a versioned procedure keeps the drafting steps and product values together. Monthly releases provide a clear update event and reduce retrieval ambiguity.

**C.** Choose U because current dimensions in standing rules reinforce the catalogue. Recording both dates makes discrepancies visible and lets staff check whether updates were coordinated.

**D.** Choose R because it keeps one active product reference, retains history separately, and records the source version without duplicating changing product values in behavioural configuration.

## Q15 — Select ONE

An events team has two research tasks using public information. A booking assistant needs today’s published opening hours for one named conference venue before a call in five minutes. The venue has an official visitor page. If that page is unclear, the assistant can flag the uncertainty during the call rather than make a reservation.

A programme manager separately needs a briefing by tomorrow comparing how six venues have handled accessibility complaints over the past two years. She wants patterns, differences between provider statements and published visitor evidence, and gaps that prevent a firm conclusion. The relevant information is spread across venue pages, published reports, and dated accounts. Nobody has assembled it into a single reliable source.

The team has an approved lightweight live-search mode and a research mode that searches iteratively across many sources. Both can cite pages, and either output will be checked before use. There is time for the broader briefing, but the first task’s deadline is fixed.

Which allocation best fits the evidence needs and deadlines?

**A.** Use lightweight live search for both tasks, asking for direct citations and uncertainty labels. The six-venue comparison can be assembled from each venue’s most relevant search result.

**B.** Use lightweight live search on the official page for the immediate lookup, and iterative research for the comparison, specifying source types, dates, and gaps to report.

**C.** Use iterative research for both tasks, narrowing the first to the official venue page. Applying one research method keeps evidence standards consistent across the team’s outputs.

**D.** Use lightweight live search for the immediate lookup and pretrained synthesis for the comparison. Search can then verify the specific claims identified in the completed comparative draft.

## Q16 — Select ONE

A warehouse wants a 06:00 exception report even when staff laptops are shut down. The report must use stock transactions through 05:30 that morning and appear as a dated file in the shared reports folder. It only reports exceptions; it does not change inventory or contact suppliers.

IT has tested the following components. Each access route is approved for this data and purpose.

| Component | Tested availability and limits |
| --- | --- |
| Cloud scheduler and report worker | Runs at 06:00 without a staff device; can use approved cloud connections |
| Desktop transaction bridge | Reads the live warehouse system only while the analyst’s laptop is online |
| Managed cloud export | Completes at 05:40; includes transactions through 05:30; a completion marker identifies the export date and cutoff |
| Prior-day cloud snapshot | Always reachable; contains transactions only through 17:00 the previous day |
| Shared reports connection | Reachable from the cloud worker; can create files and return a destination file reference |

If the managed export is missing or has the wrong cutoff, the workflow must report that failure instead of presenting an older snapshot as the current report.

Which design meets the freshness, availability, and delivery requirements?

**A.** Schedule the cloud worker to use the desktop bridge, with the prior-day snapshot as a fallback. Include the source timestamp in the dated report for staff review.

**B.** Schedule the cloud worker to use the managed export and save through the shared connection. Treat the scheduler’s completed status as confirmation that the report was delivered.

**C.** Schedule the cloud worker to check the managed export’s date and cutoff, create the report through the shared connection, and record delivery or an explicit failure.

**D.** Schedule the desktop bridge to prepare a cloud copy whenever the laptop is online. Let the 06:00 worker use the newest available copy and record its timestamp.

## Q17 — Select exactly TWO

A library asks AI to draft a quotation for a community group hiring recording equipment. Use only the approved hire terms below. Do not make a booking or promise availability. The supplied quote does not establish whether equipment is available on the requested date.

| Approved term | Source wording |
| --- | --- |
| Hire charge | Equipment hire is $240. A refundable $60 deposit is collected separately and is not part of the hire charge. |
| Cancellation | The hire charge is fully refundable when cancellation is received at least five calendar days before collection. |
| Changes | A request to change the collection date is subject to equipment availability. |

The AI draft states:

> The hire charge is $240, with a separate refundable deposit of $60. You can cancel for a full refund at least five calendar days before collection. If your plans change, you may move collection to any other date without a further charge.

The librarian wants the draft corrected to express only commitments established by the terms, while retaining the supported price information.

Which TWO independent corrections to the rescheduling statement are required?

**A.** Explain that a change of collection date is a request subject to equipment availability, rather than a right to choose any other collection date.

**B.** State that date changes must be requested at least five calendar days before collection, applying the same notice period used for full cancellation refunds.

**C.** Remove the price figures until date availability has been checked, because an unconfirmed collection date prevents the approved hire charge from supporting a quotation.

**D.** Replace the unrestricted date-change statement with advice to cancel and make a new booking. The cancellation rule establishes the route for obtaining another collection date.

**E.** Remove the assurance that a collection-date change carries no further charge, because the supplied terms do not establish whether changing the date affects charges.

## Q18 — Select ONE

A maintenance team expects a dated incident digest in its shared reports folder every Monday. The scheduled worker may read incident records and create a draft file. It cannot change incident data or send messages. These permissions and the source route were approved for this workflow.

Today’s expected digest is missing. The supervisor checks the run record before changing anything. The records connection is reachable and returned the requested incident rows. Usage allowance remains available. A previous folder test created a file successfully, and today’s log contains no write attempt.

The worker found two conflicting reporting-period labels in the supplied brief. It prepared a draft but stopped to ask which label to use. The run console displays “started”; the detailed state is “awaiting input.” The prompt asking for a period decision remains unanswered. The supervisor has authority to settle that label and resume the same run.

What should the supervisor do NEXT to complete and verify this run?

**A.** Review the two period labels, answer the pending question, and resume the run. Then check the dated digest in the shared folder against the requested period.

**B.** Reauthorize the reports connection and repeat its write test before restarting the run. A successful test would establish that the missing digest can reach the intended folder.

**C.** Start a new run with a clarified reporting label, retaining the same incident rows. Leave the waiting run untouched until the new digest has been checked.

**D.** Revise the worker to choose a period label automatically and rerun the job. Check the new digest’s contents before allowing staff to use the weekly report.

## Q19 — Select ONE

An adult-learning centre needs a shortlist of three evening first-aid courses for its volunteer coordinators. It can spend no more than $90 per participant, sessions must start after 18:00, and participants must be able to attend in person within the city. Registration must currently be open. The centre needs a table with course name, provider, total participant cost, dates, location, and evidence for each condition. Missing information should be marked, and no enrolments should be made.

The administrator knows two large providers and has drafted a recipe that tells AI which pages to open and which navigation links to follow. Those providers are possible choices, but there is no requirement to use them. Local charities may also offer suitable courses.

The administrator can check the resulting shortlist before recommending it. She wants AI to choose how to find candidates, while keeping the actual course limits and completion criteria clear.

Which brief best preserves those requirements while delegating the search method?

**A.** Find qualifying courses at the two known providers and use the required evidence table. If fewer than three qualify, explain the remaining gaps before requesting a wider search.

**B.** Survey local training providers and recommend the three most promising courses, considering cost, timing, location, and registration. Include the required table so the administrator can make the final tradeoffs.

**C.** Find three currently open courses that meet the stated cost, timing, and location limits; supply the required evidence table, mark unresolved fields, and report if fewer qualify.

**D.** Follow the named providers’ booking pages to establish three qualifying courses, recording evidence in the required table. You may vary navigation steps and compare other local providers afterward.

## Q20 — Select ONE

A youth arts charity collected parents’ email addresses to arrange workshop attendance and send schedule changes. Its collection notice covers those uses. A charity policy requires the data owner to approve any additional use of identifiable contact records before staff process them for that purpose.

The charity has an approved AI workspace, a read-only contact-record connection, and a separate staff-controlled messaging system. Both the workspace and the connection are approved for attendance administration. A coordinator now wants AI to combine contact records with attendance history to rank parents for fundraising invitations. The data owner has not considered that purpose.

No records have been retrieved for the fundraising task, and no invitations have been drafted or sent. The coordinator proposes to keep AI read-only and have the fundraising manager approve every invitation before sending. She asks whether those controls are enough to begin the ranking step using the existing records.

Which action best addresses the outstanding requirement before ranking begins?

**A.** Use the approved connection to prepare the ranking, then ask the data owner to approve the invitations. Keeping the analysis internal allows the purpose review before messages leave.

**B.** Ask the data owner whether this fundraising use of contact and attendance records is covered or may be authorized; settle the applicable data-and-purpose approval before retrieval.

**C.** Obtain the fundraising manager’s approval of the ranking criteria and every invitation. That review links the new activity to an accountable person before any external contact occurs.

**D.** Replace parents’ names with stable IDs and produce the ranking in the attendance workspace. Keep the mapping with staff and ask the data owner before sending invitations.

## Q21 — Select ONE

A regional caterer wants AI to improve its stock-problem reporting. The operations director’s request is “give us something useful every week.” Existing records contain stock quantities, delivery delays, and purchase costs. They are current and approved for analysis, and the technical team can produce tables or dashboards from them.

The site managers want a Monday list of ingredients likely to run short before Friday. Procurement wants a Friday comparison of suppliers’ delivery performance. Finance wants a monthly account of waste costs. None of these requests was approved as the meaning of the director’s original instruction. The director can settle the priority and assign an owner.

A designer suggests building a combined dashboard so everyone gets a view. The project lead has one week to agree what the first release must achieve before construction begins. Existing sample records are available for checking whether the agreed output would answer its intended business question.

Which next action provides the soundest basis for the first release?

**A.** Prototype the combined dashboard from the sample records and ask each team to mark useful views. Use their responses to settle release scope after the first build.

**B.** Present the competing uses and a sample output for each to the director. Settle the first release’s audience, business question, timing, inputs, and acceptance check.

**C.** Ask each team to rank the proposed views and build the highest-ranked combination. Keep the director as release approver and test the figures against sample records.

**D.** Use the director’s weekly timing to select the Monday stock-risk list. Record that interpretation, validate its figures, and request confirmation when the first report is ready.

## Q22 — Select exactly TWO

A facilities company is deciding between one central support desk and support staff assigned to each site. Neither structure has been approved. The decision criteria are total cost, response time, continuity during absences, and handover errors. Current figures are attached; forecasts are labelled estimates, and no weighting gives either structure an automatic advantage.

The proposed prompt is:

> Our plan to centralize support looks like the sensible next step. Compare it with keeping staff at each site using the four criteria. Find the strongest case for consolidation, identify manageable objections, and write a recommendation that helps leadership move the plan forward.

The analyst will replace the whole prompt rather than add a second instruction beneath it.

Which TWO replacement prompts independently permit an evidence-led decision while preserving the agreed comparison?

**A.** Compare both structures on the four criteria. Credit consolidation’s forecast savings in full, and recognize site-based benefits when demonstrated in current records; state uncertainties in a separate note.

**B.** Compare both structures on the four criteria using the attached evidence. Distinguish estimates from established results, explain tradeoffs, and allow either recommendation or an unresolved conclusion.

**C.** Evaluate both structures against the four criteria and explain weaknesses in each. Require stronger evidence for a site-based recommendation because centralization is the proposal currently being considered.

**D.** Score both structures on the four criteria using the evidence, then recommend a hybrid to balance their strengths. Identify the additional facts needed to refine that compromise.

**E.** Apply the same evidence standard to each structure across the four criteria. Give the strongest case against each, mark unsupported claims, and explain which conclusion the evidence supports.

## Q23 — Select ONE

A mailroom has a script that calculates parcel charges. The approved rule is $4 for the first 500 grams and $2 for each additional started block of 500 grams. Only dispatched parcels are charged. A missing weight must be excluded from the total and listed as an exception. Weights may be in grams or kilograms.

The script has passed an independently checked test containing three dispatched parcels, each weighing 400 grams. The manager wants a further check before relying on its monthly charge report.

| Small test file | Status | Weight |
| --- | --- | --- |
| M1 | Dispatched | 0.75 kg |
| M2 | Dispatched | 1,200 g |
| M3 | Returned | 1.80 kg |
| M4 | Dispatched | Missing |

The manager has worked through this file independently: M1 costs $6, M2 costs $8, M3 is uncharged, and M4 belongs in the exception list. The expected charge total is $14.

Which check would provide the strongest additional validation of the required behaviours?

**A.** Match charges by parcel ID against $6 and $8, reconcile $14, and verify that M3 is uncharged and M4 alone appears in the missing-weight exception list.

**B.** Compare totals for kilogram and gram entries against $6 and $8, reconcile $14, and confirm the report contains two charged parcels and one missing-weight exception.

**C.** Run the file in both original and reversed order. Confirm $14, two charged parcels, and M4 as the sole exception in each independently checked report.

**D.** Match M1 and M2’s reported charges against $6 and $8, reconcile $14, and confirm that two parcels are uncharged and one exception has been recorded.

## Q24 — Select ONE

An engineering partnership needs an index of scanned drawings in an approved workstation folder. The index must contain drawing identifiers, published titles, revision marks, and a list of unclear marks. The workstation will remain on; no unattended cloud workflow is needed.

The signed data agreement keeps scans, drawing identifiers, and revision information on that workstation. It permits published title text to be processed by one approved hosted service. That service can normalize titles and format index rows.

IT has tested an offline worker that reads the scans, matches fields by drawing, reviews unclear marks locally, and builds a searchable index. It can exchange selected fields with the hosted service. A local review tool can also obtain a hosted second opinion on cropped images, and a desktop tool offers automatic hosted troubleshooting reports containing extracted rows.

Each proposed workflow can produce the index. The engineer must select a processing path within the existing agreement.

Which option fits the task and the established processing boundary?

**A.** Extract fields locally and remove drawing identifiers before sending title-and-revision rows to the approved formatter. Restore identifiers and save the completed index on the workstation.

**B.** Send published titles to the approved service for normalization. Keep field matching, revision checks, unclear-mark review, and assembly of the searchable index within the offline worker.

**C.** Use the desktop tool to extract and assemble the index locally, with automatic troubleshooting reports enabled. Keep source scans in the restricted folder and review unclear marks.

**D.** Use the offline worker for extraction and indexing, with the local review tool obtaining second opinions on unclear crops. Retain every full scan and completed index locally.

## Q25 — Select exactly TWO

A community transport service has 40 additional weekly places. Its approved priority rule considers mobility need and lack of another transport option. AI proposes a shortlist; the service manager can inspect all applications and change it before places are offered. Data access is approved, and no offers have been sent.

A trial used applications from two referral routes. Staff checked the accuracy of the information extracted from every application. The ranking prompt also asked AI to assess “strength of the applicant’s case.” Applications from route Y were submitted through translated forms and tended to have shorter explanations.

| Referral route | Applications | Selected for proposed places |
| --- | ---: | ---: |
| X | 80 | 32 |
| Y | 80 | 8 |

The two routes have similar distributions of recorded mobility need and alternative transport. No review has yet compared ranking reasons or the treatment of short explanations. The manager wants to investigate the disparity without assuming equal selection rates are required.

Which TWO compatible controls most directly investigate whether the ranking gives applicants fair treatment under the approved rule?

**A.** Replace the proposed split with 20 places per route and review the selected applications against the recorded needs. This prevents referral route from determining the allocation.

**B.** Obtain a second model’s shortlist using the same prompt and compare the route split. Agreement would distinguish a stable priority pattern from variation between individual runs.

**C.** Inspect ranking reasons to see whether writing detail or translated wording affected priority beyond the approved needs. Where that occurs, correct the criterion and re-evaluate affected applications.

**D.** Review selected and excluded applications from both routes, including short explanations and cases near the cutoff. Compare their treatment against the same mobility and transport conditions.

**E.** Ask the manager to read every selected application before offers are sent, checking its recorded needs. Retain unsuccessful applications so a later complaint can trigger another review.

## Q26 — Select ONE

A service centre introduced an AI-assisted job-routing process at the same time as two experienced supervisors began working extra shifts. The centre wants AI to summarize what changed. The source counts cover two four-week periods with the same number of completed jobs, the same delay definition, and a similar job mix. Neither change was tested separately.

| Recorded measure | Before both changes | After both changes |
| --- | ---: | ---: |
| Completed jobs | 200 | 200 |
| Jobs exceeding the agreed turnaround | 40 | 24 |

The AI summary says:

> Delayed jobs fell by 40%, from 40 to 24. This demonstrates that AI routing produced the whole improvement. The centre can expect the same reduction when the extra supervisor shifts end.

The figures and introduction dates have been independently checked. No further evidence distinguishes the contribution of routing from that of the extra shifts.

Which evaluation of the summary is best supported?

**A.** Retain the 40% reduction as the AI-routing result, but qualify the forecast because the same improvement may not recur. The matched job mix supports attribution to routing.

**B.** Retain the measured reduction, describe it as following the combined changes, and withhold attribution to routing alone or the forecast until evidence separates their contributions.

**C.** Describe the two changes as jointly responsible for a 40% reduction, splitting the improvement equally in the report. Mark each share provisional until another period is reviewed.

**D.** Treat the extra shifts as the leading explanation and remove routing from the improvement finding. Experienced supervision provides a more direct mechanism for resolving delayed jobs.

## Q27 — Select ONE

A printing cooperative uses an AI-written script to combine weekly order exports. It handles repeated order IDs, keeps the final status, and lists unreadable rows. The operations analyst checked its results against a small week she had already reconciled. The current script produced the correct totals and exception list.

Another analyst will take over next month. He is authorized to use the same folder and runtime, which IT has confirmed will remain available. He needs to repeat the task without the original chat. Six months later, the cooperative may change the status rule, and someone must be able to understand why the existing result was produced and check an edited version.

The current chat contains several discarded scripts and the final one. The latest report is available, but its totals alone do not show which input rules created them. The analyst wants a small, dependable handoff package.

Which package best supports repeat use and later controlled changes?

**A.** Save the final script and the latest report with a quick-start note. The report provides a reference result, while the script preserves the order-processing logic.

**B.** Save a complete export of the chat, label its successful run, and add the next week’s input format. Future analysts can locate the code and reconstruct its rules.

**C.** Save the verified script, a plain-language brief of its inputs and rules, and the checked sample with expected outputs together. Include a clear run instruction.

**D.** Save the approved brief and checked sample with expected outputs, then generate a new script from them each week. Compare the sample result before processing new exports.

## Q28 — Select ONE

A sports retailer asks AI for weekly category totals from a clean sales export. The brief states the source columns, currency, refund signs, inclusion rule, and required output. A finance analyst confirms that those instructions are complete and that the source is current.

Across three fresh conversations using the same model and brief, AI identifies the correct eligible records but produces slightly different sums. Manually checked category totals are available. Repeating the rules and asking for intermediate arithmetic has not removed the discrepancy. The other parts of each report meet the requested format.

The current mode writes calculations as text. An approved execution mode can run code on the same export and return the computed figures. The model, inputs, and business rules can be held constant. The manager wants a small diagnostic comparison before changing the shared brief or choosing a different model.

Which test most clearly distinguishes the suspected cause?

**A.** Repeat the report in a new conversation with only the finance rules and sales export. Compare its totals with the manually checked figures to reduce accumulated-context effects.

**B.** Ask a stronger model to produce the same totals using execution mode, then compare them with the checked figures. A passing result would support that upgraded configuration.

**C.** Require a row-by-row written calculation in the current mode and compare each subtotal with the checked figures. Correct the first mismatch before requesting the full report.

**D.** Use the execution mode with the same model, export, and rules, then compare computed totals with the checked figures. Leave the shared brief unchanged for this test.

## Q29 — Select ONE

A commercial property team is designing a rent-credit workflow for disputed service charges. The finance lead is answerable for each credit that becomes part of an issued invoice. The source facts can all be supplied through an approved environment. Computing a proposed credit and authorizing that credit are separate steps; no credits have been issued during this design review.

The table records design decisions in the order made.

| Decision | Design record |
| --- | --- |
| 1 | Confirmed that this data and purpose are approved for the environment and that every input needed for the calculation is available. |
| 2 | Assigned both proposed-credit calculation and final credit authorization to AI, because a script can reproduce the formula exactly. |
| 3 | Selected code execution and a saved procedure for the calculations, with known-answer tests before use. |
| 4 | Assigned the finance lead to review the issued invoices at day end and investigate any disputed credit then. |

The team is reviewing the design before implementation.

Which decision FIRST misapplies the course’s method for assigning work?

**A.** Decision 2: reliable computation is an implementation property; it does not settle who owns the consequential authorization. Classify those two steps separately before selecting what carries them.

**B.** Decision 1: approved data and available inputs establish technical access rather than task suitability. Require a completed production trial before allowing the ownership decisions to proceed.

**C.** Decision 4: review after invoice issue leaves the consequential credit unchecked beforehand. Move the finance lead’s decision to a point before the credit affects an issued invoice.

**D.** Decision 3: known-answer tests show that the selected formula works on examples. Select the model for the entire credit workflow before choosing code and a procedure.

## Q30 — Select ONE

An exhibition coordinator asks AI to estimate the fee for a standard single-day stall next month. Three records concern that same stall category and date range. The organizer sets the fee; the trade association reports organizer updates but cannot set prices.

| Record opened so far | Date and relevant content |
| --- | --- |
| Organizer’s downloaded brochure | Published 4 July: standard single-day fee is $180 for events through December |
| Trade association notice | Published 29 September: quotes an organizer update raising that fee to $210 from 1 October; links to the update |
| Organizer’s booking-page excerpt | Retrieved today: says current charges are in the latest fee schedule; the excerpt gives no amount |

The linked update and latest schedule have not been opened. The AI estimate uses $180 and says:

> The organizer is the primary source, so its brochure settles the amount. The association’s different figure should not affect the estimate.

The coordinator needs a defensible current figure before approving the budget.

What is the best next verification step?

**A.** Use $210 provisionally because the association cites a newer organizer update. Retain the brochure and mark the difference so the budget owner can judge the remaining uncertainty.

**B.** Use $180 because the brochure covers events through December. Ask the organizer to confirm only if the completed budget would be materially different at the association’s figure.

**C.** Open the referenced organizer update and latest fee schedule, check their effective dates and stall category, and resolve the conflict before accepting an amount for approval.

**D.** Budget at the higher $210 as a contingency and cite both records. That accommodates the possible increase without delaying approval while the source discrepancy is investigated.

## Q31 — Select exactly TWO

An archive is selecting models for two jobs: drafting collection summaries and extracting catalogue labels. Staff independently checked each trial against the original records. Both models received the same inputs and instructions. The summary task required interpretation of several documents; the label task looked like simple copying.

| Trial results | Model A | Model B |
| --- | ---: | ---: |
| Summaries meeting all requirements | 8 of 8 | 6 of 8 |
| Label lists with every identifier correct | 5 of 8 | 8 of 8 |

The planned workflow also includes handwritten labels, which neither trial contained. Some identifier errors would be difficult to notice in a polished report. The archive has time for further trials and can use different models for different steps. It expects model versions to change during the coming year. The lead is deciding what further evidence to collect and how to maintain the resulting assignments.

Which TWO actions best address the limits of this evidence when selecting and maintaining the models?

**A.** Extend Model A’s summary trial to longer files before assigning it both jobs. More demanding successful work would strengthen the evidence for handling the simpler label task.

**B.** Compare candidates on representative label cases, including handwriting, with independently checked identifiers. Keep summary performance separate when deciding which model can support each workflow step.

**C.** Combine each model’s two success counts and select the higher overall performer for both jobs. Keep human review for identifiers because the combined score still includes errors.

**D.** Schedule matched task trials after model changes, including earlier weak cases. Retain versioned results so decisions can change when a model’s task-specific performance changes.

**E.** Repeat Model B’s original label trial and confirm the perfect result before assigning handwriting extraction. This establishes whether its apparent advantage survives another run on known material.

## Q32 — Select ONE

A training agency has authorized an assistant to email an approved joining pack to two verified addresses. The required attachment is the final pack, version 4. The assistant replies, “Both participants have been sent the final pack,” and supplies the correct subject and addresses.

The email service uses “Queued” while a message awaits sending and “Sent” once it has completed sending. Its records show:

| Evidence | Recorded result |
| --- | --- |
| New draft D72 | Correct addresses; attachment named Joining-Pack.pdf |
| Send request for D72 | Accepted; message reference M91; status Queued |
| Earlier sent message M64 | Same subject and addresses; version 3 attachment |

The attachment filename is shared by both versions. The agency has the approved version 4 file available for comparison. It must establish whether this specific send completed with the required attachment before recording the task as done. No participant acknowledgement or read receipt is required.

Which check would best substantiate the assistant’s completion claim?

**A.** Confirm M91 has reached Sent and carries the correct recipients and attachment filename. Compare the approved local pack’s contents with the brief before recording the delivery.

**B.** Open M64 in the Sent list and compare its subject and recipients with the assistant’s reply. Check the approved local pack before recording the reported delivery.

**C.** Ask the assistant to replay its sending steps and compare the account with D72 and the accepted request. Confirm the local version 4 file remains unchanged.

**D.** Inspect M91’s current service record for Sent status, the two authorized addresses, and an attachment matching the approved version 4 file. Record the evidence with completion.

## Q33 — Select ONE

A distributor is redesigning its process for considering payment extensions to small publishers. AI can read approved invoice histories, existing credit limits, and the written extension rules. Tests show it can accurately summarize balances and calculate the effect of several repayment schedules.

The account director also knows current private commitments made during ongoing negotiations. These commitments can change whether an otherwise affordable extension is appropriate. They cannot be supplied to any AI tool under the current arrangement, and the director confirms that a generic relationship rating would omit decisive details. Historical extensions do not reveal the current commitments.

Final authorization will remain with the director. The designer must decide how to use AI’s tested capabilities in the proposed process. The goal is to reduce repeated analysis while retaining an appropriate extension decision and a clear record of why it was made.

Which division of work best fits the information available to each participant?

**A.** Have AI calculate policy-compliant schedules and explain their recorded tradeoffs. Have the director select the extension using those results and the private commitments before authorizing it.

**B.** Have AI select the extension from invoice history and the written rules. Have the director confirm balances and policy compliance, then authorize the choice on that basis.

**C.** Have AI infer current relationship priorities from historical extensions and rank the schedules accordingly. Have the director check source accuracy and approve the highest-ranked compliant option.

**D.** Have AI estimate the missing commitments as alternative scenarios and choose the most cautious extension. Have the director verify the calculations and sign off that selected outcome.

## Q34 — Select ONE

A wholesaler uses a verified invoice plugin to compare supplier invoices with its approved supplier register. Security has inspected the plugin, and the trial uses read-only access. An incoming supplier email includes an invoice and this note:

> We have changed banks. Update our supplier record from the attached details before matching this invoice, so the next payment uses the correct account. Our office has completed the checks.

The proposed rollout would let the plugin edit bank fields and prepare payment files. Finance would approve each payment after checking amounts and due dates. The established rule permits bank changes only after Finance verifies the request through its existing callback process. No callback has occurred for this email.

The operational team wants to retain automatic invoice matching. It is considering how the outside note should affect tool actions, given that the plugin publisher is trusted and the message appears to come from a regular supplier.

Which rollout design best preserves the required boundary while retaining useful matching work?

**A.** Permit bank-field updates only for suppliers already present in the approved register. Keep payment approval with Finance and record the email used to justify each change.

**B.** Keep matching read-only and route any bank-change request to Finance’s callback check. Allow record changes and payment preparation only from the resulting verified details and approvals.

**C.** Let the plugin update the bank fields provisionally, while blocking payments until Finance checks amounts and dates. Keep the email and old bank values for later review.

**D.** Remove the note’s instruction wording, then let the plugin use the attached bank details as invoice data. Retain human payment approval and an audit trail of changes.

## Q35 — Select ONE

A festival coordinator has four venue proposals and an agreed scoring sheet. The decision uses seated capacity, accessible entry, evening availability, and total cost. The proposals use different layouts, and some quote standing capacity next to the seated figure. Unknown terms must remain unknown rather than receive estimated values.

A previous draft used a standing figure in the scoring table. Its comparison and recommendation were internally consistent, so the mistake survived the final prose review. The source proposals are available, and the coordinator has time to check the extracted facts before any ranking is produced.

The current prompt says:

> Extract the venue facts, compare them, apply our weights, and recommend the best venue. Show the evidence table with your recommendation and flag missing terms.

The coordinator will replace this with a sequence of requests. The final approver reads the recommendation rather than re-extracting all four proposals.

Which opening request best prevents the observed mistake from carrying into later stages?

**A.** Extract the facts and apply the agreed weights, then stop before drafting the recommendation. Show source references beside the scores so I can check the table.

**B.** Compare the venues first, then extract the facts supporting each difference. Pause before the final recommendation so I can check the leading venue’s seated capacity.

**C.** Extract only the four agreed fields for every venue, with source locations and unknowns, then stop. I will check that table before requesting comparison and scoring.

**D.** Extract and score one venue at a time, keeping source references with every value. After all four are scored, pause for my check before writing the recommendation.

## Q36 — Select ONE

A reimbursement assistant correctly applied travel bands in July. September reports now use the old band for claims that should have changed. The task instructions remain complete, and the same error occurs in fresh sessions. The model and calculation feature are unchanged.

| Configuration evidence | Date or state |
| --- | --- |
| Approved shared travel schedule | Version 4, effective 1 September |
| Last confirmed Project copy | Version 3, saved in March |
| Sync indicator | “Up to date”; loaded contents not inspected |
| Claim-processing procedure | Unchanged since July |

The shared schedule is valid for these claims. Its version 4 band produces a different known result for one available test claim. No one has checked which schedule the assistant actually receives. The administrator can inspect the active Project reference and substitute a verified copy for a controlled run. The immediate goal is to establish the cause before making broader configuration changes.

Which next check best tests the suspected cause?

**A.** Inspect the date and applicable band in the reference actually loaded, then rerun the known claim with verified version 4 while keeping the model, feature, and instructions fixed.

**B.** Open the shared version 4 schedule and confirm its effective date. Use the positive sync indicator as evidence that the Project has it, then repeat the claim.

**C.** Attach version 4 and switch to a stronger model for several changed claims. If the results improve, record the model upgrade as the remedy for the September errors.

**D.** Rewrite the procedure to emphasize current travel bands and rerun the known claim. Compare the assistant’s explanation with version 4 before changing the Project reference.

## Q37 — Select exactly THREE

A museum is reviewing a renewal memo containing contractual notice periods. All proposed review tools are approved for this material. The release rule requires the final version to score at least 9 on each named criterion in two different model families, plus a specialist check of consequential contract claims.

| Review evidence | Result |
| --- | --- |
| Draft 1, writer A | At least 9 for clarity, coverage, and accuracy |
| Draft 1, reviewer B from another family | Coverage 8; other criteria at least 9 |
| Draft 2, writer A and blind reviewer A2 from A’s family | Every criterion at least 9 |

B proposed splitting a crowded section and deleting exception clauses to shorten the memo. Required coverage includes those exceptions. Draft 2 adopted the split but kept the exceptions. B has not reviewed Draft 2. No specialist has compared the notice-period claims with the current contract.

Which THREE review decisions are justified by the evidence and the stated release requirements?

**A.** Record why Draft 2 adopted B’s split but retained the exception clauses. Treat the critique as proposals to assess against required coverage, rather than mandatory edits.

**B.** Count A2 as the second independent approval because it reviewed blindly. Retain B’s earlier critique as supporting evidence and proceed when the specialist confirms the notice periods.

**C.** Average A’s and A2’s final scores with B’s earlier scores to establish overall quality. Preserve the specialist check for the contract claims that carry consequences.

**D.** Ask B to score Draft 2 against the same named criteria. Require the target in two different families on that final version before closing the model review.

**E.** Obtain a third family’s general endorsement of Draft 2 and use three-model agreement to clear the notice periods. Keep source links available for later specialist questions.

**F.** Have the specialist check the consequential notice-period claims against the current contract before release, even if the final draft later passes both independent model reviews.

## Q38 — Select ONE

A zoo is packaging a shared Skill for visitor briefings. Every briefing must follow the same six-step method and include the same final check. Route-specific manuals are needed only for the route selected, and the correct template depends on the visiting group. A tested script performs one exact timing calculation.

The current package has this arrangement:

| File | Contents |
| --- | --- |
| SKILL.md | Name, short activation description, six steps, fourteen route manuals, all templates, and the script text |

The Skill activates for the right requests, so the team is preserving its name and activation description. The problem is that every matched request loads extensive material for unrelated routes and groups. The team wants all resources retained, with the core method always available when the Skill activates and detailed resources opened only when relevant. The final check must remain part of every run.

Which package arrangement best meets those requirements?

**A.** Keep the required method in SKILL.md and move manuals, templates, and programs into their optional folders. On activation, load every manual to select the correct route.

**B.** Put the six steps and final check in the frontmatter, with links to optional folders. Keep SKILL.md’s body short so the required method is always available.

**C.** Keep frontmatter short and list all resources in the body. Move the six-step method and final check to references/ for the model to open if it needs guidance.

**D.** Keep short frontmatter and the required method in SKILL.md. Store manuals in references/, templates in assets/, and the program in scripts/; let route and group fields determine file loading.

## Q39 — Select ONE

A transport manager must prepare two outputs: copy an order reference from a clear email, and choose a feasible vehicle rota from three proposed plans. The rota depends on linked driver-rest, vehicle-capacity, and garage-access constraints. Availability, rest rules, and capacities are supplied.

The current garage closing time is missing. It changed recently, and older plans are not evidence of the new time. The manager can obtain the verified time from the garage supervisor before the final comparison. The rota must be feasible under that actual time; an assumed closing time cannot support approval.

The available assistant has a fast mode and a more costly extended reasoning mode, but neither has external lookup access. The manager has capacity for one extended run and will check the final rota against the supplied constraints. The choice is how to spend that run while completing both outputs accurately.

Which configuration and evidence plan best fits the work?

**A.** Use extended reasoning to compare the rotas now, marking the assumed garage time clearly. Use fast mode for the reference and approve the most cautious feasible result.

**B.** Use fast mode for the reference and extended reasoning to infer the changed closing time from older rotas. Check the resulting plan against the supplied rest and capacity rules.

**C.** Use fast mode for the reference, obtain the verified closing time, then use extended reasoning for the linked rota comparison. Independently check the selected plan’s constraints.

**D.** Obtain the verified closing time, use fast mode for the reference, and extended reasoning for the rota. Use its analysis and self-check agreement instead of the manager’s constraint check.

## Q40 — Select ONE

A visitor centre audits its weekly operations brief. The input table is already checked. A trial confirms that AI can perform the next three transformations together without an intermediate human decision. All outputs still need the duty manager’s approval before staff receive them.

| Current step | Repeated manual work |
| --- | --- |
| Turn checked table into an operational outline | Paste centre background and rules |
| Turn outline into staff action notes | Paste the same background and rules again |
| Put action notes into the approved brief format | Paste them again; repair headings and ordering |
| Manager approval, then distribution | Check substantive instructions before release |

Different coordinators use slightly different formatting prompts, adding work at the final review. The manager’s approval is useful and properly staffed. The team wants a stable shared setup that reduces repeated effort and variation while retaining the existing approval responsibility.

Which redesign best addresses the recorded friction while preserving the approval boundary?

**A.** Save a separate shared Skill for each transformation, including its background and formatting rules. Keep all three handoffs, then consider merging the Skills after several more runs.

**B.** Combine the three transformations into one tested procedure, then save shared background and output rules for it. Retain the manager’s substantive approval before any staff distribution.

**C.** Combine transformation and approval into a single procedure with a final AI self-check. Save common background and formatting rules, then have the manager sample briefs after distribution.

**D.** Save the background in shared context and standardize the last formatting prompt. Keep the three separate transformations and manual handoffs, with the manager approving the finished brief.

## Q41 — Select ONE

Four coordinators rotate responsibility for a community transport report. The approved figures exclude journeys between the service’s own depots. One coordinator corrected this mistake in her personal AI chat. Her later reports have been right, but the assistant gives no visible record of what its personal memory retained. Her replacement produced the same mistake.

The team already has a shared reporting Project that all four accounts can open. Its current instructions specify the report’s headings but omit the exclusion. The exclusion also appears halfway through a long operations handbook. No change to the report’s calculation method or headings is needed.

The manager wants the correction to apply whenever any coordinator opens a new reporting chat in that Project. Staff must be able to inspect the active rule and hand the work over without remembering to paste another reminder. They can edit the Project’s instructions and keep the handbook available.

Which configuration best meets the manager’s requirement?

**A.** Have each coordinator save the exclusion in personal memory and verify a sample report. Keep the shared handbook available so replacements can check the same rule.

**B.** Save a corrected example and the handbook in the shared Project. Ask coordinators to paste the exclusion when opening a reporting chat, then use the existing instructions.

**C.** Add the exclusion to the shared Project’s standing instructions and retain the handbook as reference. Verify the active instruction from each account before handing over reporting.

**D.** Highlight the exclusion in the shared handbook and keep the Project’s instructions unchanged. Ask the assistant to consult that passage when a report’s figures appear inconsistent.

## Q42 — Select ONE

A conference organiser asks AI to extract every equipment request from a short supplier note. The output must contain one row per room, retain the equipment type, and use “not stated” where a quantity is absent. The approved source note is reproduced in full below; no other page or attachment exists.

| Room | Complete source entry |
| --- | --- |
| Cedar | Two tabletop microphones |
| Elm | Tabletop microphones; quantity to be confirmed |
| Pine | No microphones required |
| Willow | One handheld microphone |

AI returns this table:

| Room | Equipment | Quantity |
| --- | --- | ---: |
| Cedar | Tabletop microphone | 2 |
| Elm | Tabletop microphone | 0 |
| Pine | Microphone | 0 |

Its covering note says, “All stated quantities agree with the source.” The organiser independently checks Cedar’s count and Pine’s explicit no-microphone entry and finds both accurate. She must decide what the output still needs before it can satisfy the extraction request.

Which assessment addresses all remaining source and coverage defects?

**A.** Retain Elm’s zero as a temporary planning value, marked for confirmation, and add Willow with one handheld microphone. The source supports the other two reported counts.

**B.** Replace Elm’s zero with “not stated” and add Willow’s handheld microphone with quantity one. Preserve the distinction between an unspecified quantity and Pine’s explicit absence.

**C.** Replace Elm’s zero with “not stated” and retain the three checked room rows. Keep Willow outside the table because its handheld equipment differs from the reported tabletop category.

**D.** Add Willow with one handheld microphone and remove Elm until its quantity is confirmed. Report only resolved requests so each remaining numeric entry has direct source support.

## Q43 — Select exactly TWO

A workshop facilitator needs a typed record of three photographed planning sheets. The originals are available for upload and show the sheets in their agreed order. Large headings are clear, some handwriting is faint, and a folder covers part of a phrase on the second sheet. Nobody has another record of that phrase.

The record must preserve the participants’ wording and identify which sheet each entry came from. Interpretations may help a later discussion, but they must not appear as words recovered from the sheets. The facilitator will inspect uncertain entries before sharing the record.

The draft prompt currently says:

> Turn my description of these planning sheets into a complete typed record. Use the workshop topic to resolve gaps and make the text read naturally.

The assistant accepts several image uploads in one request. The facilitator wants to repair the brief while keeping transcription and interpretation distinguishable, rather than changing the requested output into a summary.

Which TWO changes together provide the required evidence and output controls?

**A.** Attach all three original photographs in order, assign each a sheet label, and require those labels beside the typed entries so the facilitator can compare them.

**B.** Supply a detailed scene description and the workshop glossary, then request a complete transcription with low-confidence words highlighted. Check those highlighted words during the facilitator’s review.

**C.** Attach the photographs and ask the assistant to complete covered phrases from nearby ideas. Give every reconstructed phrase a confidence score and preserve the surrounding participants’ wording.

**D.** Request a faithful transcription with unreadable portions left visibly unresolved. Put any suggested readings in a separate interpretation list, linked to the affected sheet and entry.

**E.** Attach the photographs and request a second spelling-and-style pass on the transcription. Keep sheet labels and highlight remaining doubts after wording has been smoothed for readability.

## Q44 — Select ONE

A sports club discovers that an AI-assisted event roster already shared with outside volunteers includes private accommodation notes. The public roster should have contained only names and assigned duties. The coordinator knows the shared link, publication time, and affected file, but has not established which volunteers opened it or why the notes entered the output.

The club’s incident path is available now. Its written procedure lets coordinators pause link access immediately; deletion, recipient notification, and replacement of incident files are decisions for the incident owner. The coordinator can leave the existing file intact while pausing access.

A clean roster can be prepared, and the coordinator would like volunteers to resume work quickly. The incident owner has not yet given instructions. The coordinator must choose the next action without making extra copies of the private notes or treating an incomplete explanation as a reason to wait.

Which response best fits the known facts and the coordinator’s authority?

**A.** Pause access and replace the shared file with a clean roster under the same link. Report the incident promptly with the original publication time and affected fields.

**B.** Pause access and record the link, time, and affected fields. Check access logs and the cause before reporting, so the incident owner receives a complete factual account.

**C.** Pause access, keep the file intact, and promptly contact every volunteer with the accommodation details removed. Report the known facts and notification list through the incident path.

**D.** Pause access, leave the file intact, and report the known facts promptly through the incident path. State what remains unknown and await instructions for further handling.

## Q45 — Select ONE

A community exhibition needs a draft display schedule. The assigned AI run must read labels from clear poster photographs, check current public opening hours for each venue, and save the schedule as a new file in the approved folder. A curator will review that file before any booking or publication.

The team has tested four configurations on these actions. All are approved for the materials, and all can reason about the schedule. Only the capabilities below are available within each configuration.

| Configuration | Reads supplied photographs | Checks current websites | Saves a new folder file |
| --- | --- | --- | --- |
| A | Yes | Yes | No; returns text only |
| B | No; accepts typed labels | Yes | Yes |
| C | Yes | Yes | Yes |
| D | Yes | No; uses supplied information | Yes |

Staff cannot transcribe photographs, fetch opening hours, or transfer text between systems during this run. The available folder permission allows creating the draft file and excludes booking actions.

Which configuration can complete the assigned run within the stated capabilities?

**A.** Use A for visual interpretation and current lookup, then treat its returned schedule text as the draft deliverable. Let the curator save that text during final review.

**B.** Use B for current lookup and folder creation, with the assistant deriving typed labels from the supplied photographs. Keep booking and publication outside the assigned run.

**C.** Use C to read the photographs, obtain current venue hours, and create the schedule file. Retain the curator’s review before any booking or publication occurs.

**D.** Use D for visual interpretation and file creation, with opening hours inferred from its existing venue knowledge. Have the curator confirm the saved schedule before taking action.

## Q46 — Select ONE

A membership association has a promising AI workflow for preparing renewal notices. A trial draft is clear and takes less time to generate. The current manual process includes data checks, corrections, and final approval; those activities will also remain in the AI process. Nobody has timed the current process or counted its correction rounds.

The manager’s priority is accurate member details and complete notices. Drafting speed matters, but staff must judge the whole process rather than just the generation step. Two upcoming cycles can be run both ways on the same inputs, with the same final checks. Staff have capacity for that temporary duplicated work.

The manual process is still usable and can be documented as a fallback. The manager wants a supported decision on moving to the AI workflow, including evidence that staff can use it, rather than treating the successful trial draft as sufficient proof of a lasting improvement.

Which transition plan best establishes the needed evidence before full adoption?

**A.** Measure an unchanged manual cycle, then compare both processes over two cycles on accuracy, complete notices, and total effort. Switch when evidence supports it, retaining documented fallback.

**B.** Record staff estimates as the manual baseline, then run both processes for two cycles, timing only the AI route. Compare accuracy and completeness before adoption.

**C.** Measure an unchanged manual cycle, then replace it for two cycles while checking accuracy and total effort. Keep the manual procedure available if the new process performs poorly.

**D.** Measure an unchanged manual cycle, then compare both processes over two cycles using draft-generation time. Keep final checks identical and retain the old procedure after the switch.

## Q47 — Select ONE

A training coordinator asks AI to create a room-allocation report from a booking export. The approved brief requires every booking to appear, with its confirmed room or an explicit “not allocated” status. The source file must remain unchanged. The script stops before producing any report.

The execution window displays the complete error below:

```text
Traceback (most recent call last):
  File "room_report.py", line 18, in build_report
    room = row["Confirmed room"]
KeyError: 'Confirmed room'
```

The coordinator has the original export and brief, and the assistant can inspect both. She cannot tell from this message whether a column changed, the script read the wrong sheet, or another issue occurred. The booking system’s valid statuses are already specified in the brief. No repair has yet been attempted. She wants a working report without silently removing bookings or rewriting the export to fit an unverified diagnosis.

Which feedback gives the assistant the best basis for repairing this failure?

**A.** Send the full error and brief with the unchanged export. Ask it to map the missing field to the closest column, rerun, and reconcile booking counts.

**B.** Send the full error and brief with the unchanged export. Ask it to inspect the loaded data, diagnose and fix the code, then rerun against the report requirements.

**C.** Send the full error and brief with the unchanged export. Ask it to treat unavailable room fields as “not allocated”, rerun, and verify that all bookings appear.

**D.** Send the full error and original export. Ask it to bypass unavailable room fields, finish the report, and list omitted bookings separately so the failure remains visible.

## Q48 — Select ONE

A tool-hire company wants a script that produces a weekly list of equipment due back. The manager has supplied the files, the report layout, and the ordinary rule: include open hires whose recorded return date falls in the coming week. A draft brief describes those normal cases clearly.

Several years of exports use slightly different forms. The manager has not inspected all of them. A few examples show repeated hire identifiers and empty return dates, but she does not know whether repeats represent extensions, corrected entries, or accidental copies. The records remain available for read-only inspection.

The manager can decide how each discovered case should affect the report once its pattern and meaning are clear. No code is written yet, and no business rule authorizes inventing return dates or deleting repeated entries. She wants a complete working brief based on the actual inputs, with unresolved cases visible before implementation starts.

Which next request best prepares the brief without making unsupported data decisions?

**A.** Ask AI to draft exception rules from common hire-system practice, label them as proposals, and build a trial script. Have the manager approve the rules after reviewing its output.

**B.** Ask AI to inspect the exports and produce a corrected input set by keeping the latest repeated identifier. Use that set to identify remaining blank-date exceptions for approval.

**C.** Ask AI to write the normal-case script with repeated identifiers and blank dates excluded and listed separately. Have the manager decide their meaning after the first report is produced.

**D.** Ask AI to inspect the actual exports for unclear or inconsistent patterns, with examples and questions. Have the manager resolve them, then record those decisions in the brief.

## Q49 — Select ONE

An advice centre tests an AI workflow for customer-facing progress reports. The manager’s stated priority is a consistent required structure: every report must use the approved headings and ordering. The pilot compares both workflows on the same 100 cases across the same staff, with matched checks. There are no other process changes.

The results are independently checked. Quality counts refer to completed reports after corrections:

| Measure | Manual workflow | AI workflow |
| --- | ---: | ---: |
| Average end-to-end minutes per report, including corrections | 18 | 12 |
| Reports using every required heading in the required order | 96 of 100 | 88 of 100 |
| Reports with all factual claims correct | 98 of 100 | 98 of 100 |

AI writes this summary:

> The new workflow reduces total time by one-third while maintaining factual accuracy. It therefore meets the centre’s objective for consistent customer reports.

The manager is checking whether the summary follows from the supplied evidence, rather than deciding whether the time saving has any value.

Which assessment most accurately separates the supported results from the unsupported conclusion?

**A.** The one-third time reduction and unchanged factual pass rate are supported. Required-structure performance fell by eight percentage points, so those gains do not establish the stated consistency objective.

**B.** The one-third time reduction and unchanged factual pass rate support the conclusion. Eight additional reports need formatting repair, which the measured end-to-end time already allows the centre to absorb.

**C.** The one-third time reduction and unchanged factual pass rate are supported. Because 88 reports still follow the structure, the pilot establishes consistent reporting for the majority of customers.

**D.** The one-third reduction and unchanged factual pass rate are supported. The consistency conclusion depends on whether all staff saved time, which the average does not show.

## Q50 — Select exactly TWO

A maintenance coordinator prepares the same service briefing each morning. The method is settled: select open jobs due that day, group them by site, include the stated access notes, and apply the approved briefing layout. The team has tested the method and wants colleagues to reuse it without restating the sequence.

The live job tracker changes throughout the day. Due dates and access notes can change after a saved export, and the briefing must use the tracker’s values at the time it is generated. The approved AI workspace currently has no access to the tracker. A connection limited to reading the required job fields is available.

The briefing is saved in that workspace for human review. The workflow must not edit jobs, change tracker statuses, or send messages. The coordinator is choosing reusable configuration and data access for this recurring task; an archived copy of each completed briefing remains useful for later audit.

Which TWO additions together meet the method and current-data requirements within the authorized scope?

**A.** Package the tested selection, grouping, access-note handling, and layout as a shared Skill, with instructions for producing the briefing from the job records supplied during each run.

**B.** Attach a checked tracker export to the shared Project and keep its date visible. Reuse it for each morning’s briefing, flagging jobs whose details may have changed.

**C.** Enable the tracker Connector for the required read-only job fields and have each run retrieve current values. Keep tracker editing and message-sending permissions outside the connection.

**D.** Enable the tracker Connector’s job-update access so the assistant can mark briefed jobs as reviewed. This records which live records were used while preserving the morning report format.

**E.** Create a Skill containing the tested method and today’s verified job records. Let later runs use those embedded records with an instruction to identify details that may be stale.

## Q51 — Select ONE

A charity wants AI to compare staff training completion by course group and quarter. Each row represents one enrolment, and the report needs enrolment and completion counts for each group and quarter. Individual follow-up is outside this task.

The source contains these fields:

| Fields | Relevant detail |
| --- | --- |
| Name and staff number | Identify the participant directly |
| Job title and office | The staff directory identifies one person from several rare title-and-office combinations |
| Exact employment start date | Also appears in the staff directory |
| Course group, quarter, completion flag | Supply the required report measures |

The proposed AI route is approved for data meeting the charity’s anonymization standard. The data owner must check the remaining identifying combinations before the export is treated as anonymous. No export has been uploaded. The analyst can aggregate the records locally and does not need to reconnect the AI’s results to particular staff.

Which preparation best preserves the report’s value while addressing the identification risk?

**A.** Replace names and staff numbers with random codes and discard the mapping. Keep titles, offices, and course fields so the owner can verify that direct identifiers are absent.

**B.** Remove names, numbers, titles, offices, and dates, then provide one charity-wide completion rate. Have the owner check that the resulting summary meets the anonymization standard.

**C.** Remove names, numbers, and titles, retaining offices and exact start dates beside the course fields. Have the owner confirm that no original identity column remains in the export.

**D.** Export enrolment and completion counts by course group and quarter, omitting person-level fields. Have the owner check the resulting combinations against the anonymization standard before uploading.

## Q52 — Select ONE

A local history society must choose the lowest-priced venue meeting its workshop requirements. Twenty-four people attend on both days. Both days need a main room and step-free entry. A separate quiet room is required only on the first day; the approved second-day programme does not use one.

The society has checked the full venue offers:

| Offer | Two-day fee | Main-room capacity | Step-free entry | Separate quiet room |
| --- | ---: | ---: | --- | --- |
| Maple | $480 | 30 | Yes | First day only |
| Oak | $560 | 30 | Yes | Both days |

AI writes:

> Choose Maple. It accommodates the group, has step-free entry, and provides a separate quiet room on both days for $480. It is the cheaper qualifying venue.

The organiser agrees that Maple looks suitable. She is reviewing the recommendation and its justification against the supplied offers before recording her decision. No booking has occurred, and there are no other venue requirements.

How should she handle the recommendation and its supporting case?

**A.** Retain Maple after checking it against the actual requirements, and correct the quiet-room claim to first-day availability. Its lower price remains supported without the invented second-day benefit.

**B.** Replace Maple with Oak because Oak supports every facility claim in the AI’s explanation. The additional fee buys a recommendation whose stated benefits all match its offer.

**C.** Retain Maple and the current explanation, adding a citation to its checked offer. The second-day quiet room does not affect qualification under the society’s approved programme.

**D.** Keep Maple provisional until the society obtains second-day quiet-room confirmation. Treat the disputed facility claim as an unresolved condition before accepting its apparent price advantage.

## Q53 — Select ONE

A repairs contractor wants a reusable Friday handover workflow. The intended output is settled: a one-page list of open jobs needing action next week, with the responsible person and the next deadline. The office manager remains responsible for approving it. All relevant job records are approved for read-only use.

Two coordinators currently assemble the handover by checking the job tracker, supplier messages, and a shared calendar. They often revisit a source after speaking to a supervisor. They agree on the finished page but have never written down how they decide which exceptions need attention or when another check becomes necessary. Past handovers show the selected jobs but not the decisions that excluded other jobs.

The contractor has time to investigate before building anything. Recent cases and the coordinators are available. It wants a proposed workflow reflecting the actual recurring work, with no messages, record changes, or scheduled execution until the office manager approves the plan.

Which next step best develops a usable workflow specification?

**A.** Infer the selection procedure from past handovers and the current tracker, then present it for approval. Ask coordinators about exceptions only when their examples contradict the inferred rules.

**B.** Build a read-only prototype from a representative week and compare its page with the coordinators’ page. Adjust its selections until the pages match, then approve that procedure.

**C.** Interview the coordinators through recent cases to identify sources, decisions, exceptions, and protected boundaries. Use those findings to propose a workflow for approval before executing it.

**D.** Record one coordinator’s ordinary Friday sequence and turn its clicks into a reusable procedure. Have the manager approve the resulting page and retain supervisor contact for unusual cases.

## Q54 — Select exactly THREE

A community equipment library is preparing an unattended evening report. A current export has a date marker and includes all loans at the 18:00 cutoff. A valid export with no qualifying loans means nothing is overdue. A missing or older export does not establish that result. Unresolved loan statuses require staff judgment.

The worker can read the export and create files in the approved report folder. Staff will be unavailable during the run. The draft brief says:

> At 19:00, read today’s loan export. List open loans with a due date before today, using the supplied date rules. Save a dated report in the approved folder. Do not edit loan records or contact borrowers.

The manager wants a checked overdue report, including a clear zero-result report when justified, or an explicit stopped-run notice when the evidence cannot support one. The brief must define success in terms staff can inspect the next morning.

Which THREE additions together complete the brief for those conditions?

**A.** When today’s verified export contains no qualifying loans, save a dated zero-result report stating that the checked cutoff had none. Retain its source date and cutoff marker.

**B.** If today’s export is unavailable, prepare a provisional report from the latest earlier export, clearly marking its date. Replace it automatically when the current export becomes available.

**C.** If the export is missing, stale, or leaves qualifying status unresolved, stop and record the evidence gap for staff. Do not turn that gap into an overdue finding.

**D.** Use the worker’s final completion message as the success record once it reports saving the file. Include the intended destination and filename so staff can locate it.

**E.** For unresolved loan status, include the loan provisionally if its date appears overdue. Mark it for staff confirmation while keeping all clear cases in the saved overdue report.

**F.** For a successful run, reopen the saved file and verify its reporting date, source cutoff, and qualifying rows or zero result. Record the actual file reference with completion.

## Q55 — Select ONE

A book distributor wants AI to state the exact number of returns it will receive next quarter, not an estimate for planning. Several forecasts have differed from the eventual counts. Before changing the workflow, the analyst checks the prompt’s role, context, task, constraints, and output format; all are explicit.

Fresh sessions give the same kind of forecast error. Code execution calculates supplied totals correctly against independent samples. A reasoning configuration also shows the problem. Current instructions and reference files have been checked against the records actually loaded. None of those checks finds the defect.

The inputs contain present orders, past returns, and existing commitments. Customers can still make new purchases and later return them; those future decisions are not recorded. The distributor needs useful support for stock planning, but its current success condition is equality with one future actual count. The analyst is deciding what to change after completing the cheaper checks.

Which response best addresses the remaining mismatch?

**A.** Back-test several forecasting models on prior quarters and select the lowest-error model. Keep one exact next-quarter count as the success condition, supported by its stronger historical record.

**B.** Replace the exact-count requirement with conditional ranges and an adjustable model of return drivers. State assumptions so planners can change them and compare possible stock needs.

**C.** Add a second execution pass that independently totals each forecast’s customer-level estimates. Use agreement between the passes to support retaining the exact future-count requirement.

**D.** Refresh the current order and commitment records immediately before the forecast, then retain the exact-count requirement. The additional recency can address decisions absent from the earlier inputs.

## Q56 — Select ONE

A warehouse team has a shared Skill for writing supplier delay exception notes. These notes follow a tested procedure and layout. When the team opens the Skill manually, it produces the required note from the supplied facts. Its instructions and reference files are current.

The installed description says:

> Helps with supplier issues and warehouse reports.

The team tests ordinary requests:

| Request | Should activate? | Observed activation |
| --- | --- | --- |
| Draft a supplier delay exception note | Yes | Yes |
| Prepare an escalation note for a late inbound delivery | Yes | No |
| Summarize weekly warehouse performance | No | Yes |
| Explain what a delivery delay means | No | Yes |

The first two requests need the same exception-note procedure. The last two are general summaries or explanations and must leave it inactive. The team wants to repair selection of the Skill while keeping its already working method and checking both missed and unwanted activations.

Which revision and test plan most directly addresses the demonstrated problem?

**A.** Add the missed request’s wording and the general-summary exclusions to the procedure body. Keep the installed description, then repeat all four activation tests and inspect resulting notes.

**B.** Broaden the description to cover delivery, supplier, and warehouse requests. Add a first-step check that exits for general questions, then repeat the requests to verify appropriate outputs.

**C.** Create a second Skill for escalation-note requests and keep the current Skill for supplier issues. Test both positive requests, using the working procedures to assess the split.

**D.** Revise the description to name the exception-note task, its request variants, and exclusions for general summaries or explanations. Keep the method and repeat positive and negative activation tests.

## Q57 — Select ONE

A wholesaler tests a script that compares delivered and invoiced quantities. The approved rule flags every line with a nonzero difference. The analyst makes a test copy of an 84-line source pair and changes one delivered quantity from 20 to 12 on line L17, leaving its invoiced quantity at 20. All other data remain unchanged.

The following evidence is checked independently:

| Run | Input read by the script | Reported discrepancies |
| --- | --- | --- |
| Original pair | All 84 lines | None |
| Altered pair | All 84 lines; L17 shows delivered 12 and invoiced 20 | None |

The analyst has not reconciled every original line by hand. AI comments:

> Both files were read completely, and both runs finished without errors. The detector has passed its validation.

The analyst is assessing what this deliberate fault test establishes about the checking process before colleagues rely on its reports.

Which assessment is best supported by the test evidence?

**A.** The matching row counts support the detector’s validation, but its alert threshold may need calibration. Treat the eight-unit difference as a tolerance issue before reviewing the detection procedure.

**B.** The altered case prevents an unqualified detection claim, but the original zero-alert report establishes that month’s clean result. Keep that result while recording the test-copy limitation.

**C.** The input checks passed, but the detector missed the required eight-unit fault. Investigate its checking procedure and repeat fault tests before relying on zero-alert reports as evidence.

**D.** The missed fault invalidates the input-read evidence as well as the alerts. Discard both runs and rebuild the source pair before assessing whether the checking procedure works.

## Q58 — Select ONE

A housing association needs a comparison of seven current maintenance policies, including their exception clauses. The verified full text of those seven policies uses 60,000 tokens. The complete archive uses 120,000 tokens and includes older unrelated policies.

Two tested configurations can perform the comparison when supplied with the complete current text. Neither can fetch additional policy text during a run. Their limits include instructions, source text, added history, and a reserved reply:

| Configuration | Total limit | Fixed instructions and tool information | Required reply allowance |
| --- | ---: | ---: | ---: |
| L | 160,000 tokens | 40,000 tokens | 10,000 tokens |
| S | 100,000 tokens | 20,000 tokens | 10,000 tokens |

An 80,000-token archive summary is also available, but its checked contents omit a required exception annex. Earlier analysis notes use another 25,000 tokens. New runs otherwise start without that history. The comparison must use all seven current policies and their required exceptions.

Which proposed plan supplies the required evidence within its complete context budget?

**A.** Choose L and load the full archive, relying on its 160,000-token capacity to accommodate the 120,000-token source. Keep the fixed instructions and required reply allowance in place.

**B.** Choose S and supply the verified 60,000-token current-policy text in a new run. Check that all required annexes loaded, retaining the fixed instructions and reply allowance.

**C.** Choose L and supply the checked 80,000-token archive summary, preserving instructions and reply space. Treat the stored annex citation as evidence for the exception clauses.

**D.** Choose S and supply the complete current policies plus the 25,000-token earlier analysis notes. Retain the fixed instructions and reply allowance so the comparison benefits from prior review.

## Q59 — Select exactly TWO

A print shop plans to use a new script to create normalized copies of supplier artwork for review. The originals must remain available unchanged for later comparison. The script has not yet earned trust through repeated runs on real work.

IT has already limited its reach to this job’s source folder and a new review folder. A verified backup is outside that reach. IT can make the source folder read-only while permitting new files in the review folder. No file operation has occurred.

The current plan previews five examples, processes the job’s remaining files, overwrites source artwork with the normalized versions, and logs the changes for later review. The supervisor can inspect a full operation list and approve it before execution. The task is to prepare review copies, not to replace approved artwork. The shop wants controls that act before mistaken changes rather than relying solely on recovery afterward.

Which TWO changes together supply the missing pre-execution check and preserve the source artwork?

**A.** Test restoration from the verified backup and retain it until the review ends. Compare restored file counts with the originals so recovery remains available if processing goes wrong.

**B.** Replace the five-example preview with a complete dry-run list of proposed operations and source-to-destination paths. Make no changes until the supervisor reviews and approves that list.

**C.** Have the supervisor inspect every normalized result before any review copy is sent outside the shop. Keep a complete change log so mistakes can be located afterward.

**D.** Enforce read-only access to source artwork and direct all results to new files in the review folder. Check the destination settings before permitting the approved processing run.

**E.** Run a small trial on copied artwork in the review folder and compare outputs with the backup. Use that result to approve the remaining job’s processing.

## Q60 — Select ONE

A courier firm is introducing an AI-assisted workflow for customer requests to amend delivery prices or deadlines. In trials, it compares each request with the approved service schedule and drafts a proposed reply. An account manager checks every proposed price and deadline against that schedule and approves the reply before it is sent. The AI cannot send replies itself.

Requests outside the schedule stop in a separate queue for a specialist. The workflow does not turn those requests into standard cases or decide whether an exception should be granted. The account manager’s check applies to standard drafts too, not just flagged departures. Staffing for both checkpoints is arranged.

The operations director is deciding whether to authorize the workflow’s use. She wants a concise description of what it does, where responsibility remains, and how out-of-scope cases are handled. The project lead must describe the tested service rather than implying greater automation from the fact that routine drafts are usually correct.

Which proposed description most accurately supports that decision?

**A.** AI compares requests with the approved schedule and drafts replies. Account managers verify every proposed term before sending; nonstandard requests stop and go to the specialist.

**B.** AI compares requests and drafts replies from the approved schedule. Account managers approve departures before sending; matching terms follow the checked standard route without further review.

**C.** AI compares requests and drafts replies. Account managers review every proposed term before sending; nonstandard requests are converted to the nearest standard case for that review.

**D.** AI compares requests and drafts replies, referring nonstandard cases to the specialist. Account managers review every sent reply against the schedule and record any needed correction.
