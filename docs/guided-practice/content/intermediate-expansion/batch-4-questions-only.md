# Intermediate expansion — Batch 4 solve-first copy

Exact validated bank stems, option order and sources; no keys or feedback. Record choices and reasoning before opening the draft or answer-bearing ledger. Q41 retains every table row, column and status; Q47 retains the exact fenced tree, file/folder names, indentation and surrounding constraints.

## Q40

An agency used AI to write a script that combines monthly campaign exports. The script applies the agreed cancelled-campaign rule and produces the required totals and exceptions. It passed a small hand-checked sample and full-file checks.

The file structure and rules are expected to stay the same next month. A covering analyst will need to repeat the job. The creator wants the tested behavior and its purpose to survive between chats, rather than requesting fresh code from memory each month. No automatic schedule is needed.

Which handover best supports repeatable use of the tested solution?

**A**

Keep the script file with a plain-language header, its brief, and the known-answer sample in one task folder; rerun it on new matching exports.

**B**

Keep the current results and ask the covering analyst to recreate the script from those totals, comparing each report with the previous month’s output.

**C**

Save the brief as a reusable prompting Skill and generate a new script each month, using the same instructions to preserve behavior across analysts.

**D**

Save the conversation link and current report in the Project, having the covering analyst continue that thread whenever an export needs the same transformation.

Sources:

- Code You Never Write — 8. Keep the script: a solved problem becomes a button — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q41

A club has built a Skill for monthly activity summaries. Its instructions define four sections, expense grouping, and how to report a month with no activities. A normal test loads the Skill and produces the correct summary.

The release checklist currently shows:

| Test | Result |
| --- | --- |
| Normal month | Passed |
| Empty month | Not tried |
| Messy expense entries | Not tried |
| Unrelated short message | Not tried |

The club wants colleagues to reuse it. The tested procedure has not been changed, and no other release checks have been performed.

Which next test plan best addresses the remaining release evidence?

**A**

Run the normal month repeatedly with different wording, approving team use if the four-section layout stays consistent across all of those successful summary requests.

**B**

Ask a stronger model to inspect the instructions and score clarity, approving team use if it finds no contradiction in the written empty-month rule.

**C**

Test empty and messy inputs against the rules and try the unrelated request for non-activation; repair observed failures and rerun the checks before reuse.

**D**

Release the Skill to a small group using normal months, asking colleagues to report any empty-month or messy-input problems when they eventually encounter them.

Sources:

- Skills & Connectors: Teach AI Once, Connect It to Your Apps — 13. Test, then iterate — https://agentfactory.panaversity.org/docs/skills-connectors-crash-course

## Q42

A library uses AI to draft a reading-club announcement. Its prompt says:

> Write a friendly post promoting our holiday reading club.

The draft praises reading. The librarian calls it “too generic”. The intended readers are busy parents of children aged seven to ten. The desired next step is to register through the supplied sign-up page before Friday; the club details and link are already available.

She wants feedback that changes the next draft in an observable way, rather than another request to make it better.

Which TWO additions together turn that feedback into useful directions?

**A**

Make the announcement warm and persuasive, using vivid language about reading so the revised post feels less generic to the people who see it.

**B**

Write for busy parents of children aged seven to ten, explaining the club’s relevant benefit using the details rather than general praise of reading.

**C**

Keep the message under a word limit and add varied sentence openings, so the librarian can judge whether its style has become more distinctive.

**D**

Give three alternative versions with different tones and ask the librarian to choose the strongest one, leaving the announcement’s content priorities to each draft.

**E**

End with a clear request to register through the supplied sign-up page before Friday, using the link so readers can take that next step.

Sources:

- Workflow Design & Diagnosis — 13. Turn a reaction into an instruction — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course

## Q43

An administrator asks AI to compare two ventilation units. AI recommends one and supplies quotations from the manufacturers’ specifications. The administrator confirms that the quotations are copied accurately and that the units’ prices are correct.

The recommendation also assumes that the chosen unit’s technical capacity fits the building. The administrator cannot assess that technical assumption. A qualified facilities engineer can review the specifications and building requirements before purchase. She needs to decide what verification remains before accepting the recommendation.

Which check best addresses the remaining basis for the recommendation?

**A**

Run the same comparison through another model family, accepting the recommendation if both models select the same unit and cite the same manufacturer specifications.

**B**

Have the engineer assess the capacity assumption against the building requirements and specifications, then reconsider the recommendation using that review before choosing the unit.

**C**

Recheck every quoted sentence and price against the original pages, accepting the recommendation if those factual details remain correct throughout the complete comparison.

**D**

Ask AI to explain the capacity assumption in simpler language and score its confidence, letting the administrator accept it once the explanation is clear.

Sources:

- AI Fluency: A Crash Course — 5.1 Product discernment: is the result good? — https://agentfactory.panaversity.org/docs/ai-fluency-crash-course
- AI Fluency: A Crash Course — 3. Feel what it is like to be a non-expert — https://agentfactory.panaversity.org/docs/ai-fluency-crash-course

## Q44

An employee preparing a summary accidentally uploads a named customer list through a personal account rather than the required managed route. She notices it immediately. No colleague has received the summary, and she does not know whether the uploaded data went onward.

The company has an incident channel and an owner who directs evidence handling and any notifications. A colleague suggests deleting the chat first, then reporting that the data was removed. She needs to respond before creating further copies.

Which immediate response best fits the incident process?

**A**

Delete the chat and customer list first, then report the remaining risk once visible copies are gone and the summary has been recreated safely.

**B**

Ask the provider whether the list was retained, waiting for its answer before reporting so the incident owner receives an account of the exposure.

**C**

Send the uploaded list to an internal group for advice, asking colleagues to identify which customer details need removal before raising a formal incident.

**D**

Stop further copying, record the known data, route, time, and uncertainty, report promptly through the incident channel, and follow the owner’s evidence-handling instructions.

Sources:

- Governance, Risk & Responsible Use: A Crash Course — The first-hour procedure — https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course

## Q45

A retailer has two jobs. The first matches 1,500 stock records with a returns export and produces exact item totals using an agreed rule. The second drafts one courteous reply explaining an approved delivery delay to a customer.

The files and rules are ready. Facts and the approved remedy for the reply are supplied. Neither job needs external research. The manager is choosing an approach for each job; she wants computed data results and an appropriately worded draft, with checks before either is used.

Which pairing best fits the work required?

**A**

Use a strong reasoning chat for both jobs, asking it to explain the stock totals and then adapt that reasoning to the customer’s reply.

**B**

Use code execution for both jobs, turning the approved delay facts into a fixed template while asking the program to determine courteous wording.

**C**

Use executed code to match and total the stock records, and conversational drafting for the reply; check both outputs against their supplied requirements.

**D**

Use conversational analysis to identify the stock pattern first and compute only if anomalies appear, while using code to choose the customer reply’s wording.

Sources:

- Code You Never Write — 3. The dividing line: which problems are code problems — https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course

## Q46

A team wants a weekly AI news brief while the coordinator’s laptop is off. An attended trial used the approved cloud news sources and produced a report, but saved it in a folder on that laptop.

The schedule has a Monday start time and a named reviewer before circulation. An approved cloud folder is available. Nobody has specified how an empty week should be reported or how staff will distinguish a delivered report from a run that merely completed. No unattended trial has been performed.

Which preparation best closes the remaining design gaps before scheduling regular runs?

**A**

Use the cloud folder as the output destination, define the empty-week result and success signal, then test the route twice with the laptop off.

**B**

Keep the trial’s local destination and add a completion notification, letting the reviewer open the file when the coordinator next turns on the laptop.

**C**

Schedule the trial’s existing steps and have the reviewer request a brief if Monday’s file is missing, preserving the method that produced good content.

**D**

Move the destination to the cloud folder and enable the clock, relying on completion status to distinguish an empty week from a missing report.

Sources:

- General Agents on the Web: A Crash Course — The four answers before you schedule — https://agentfactory.panaversity.org/docs/general-agents-web-crash-course
- General Agents on the Web: A Crash Course — Walk it before you schedule it — https://agentfactory.panaversity.org/docs/general-agents-web-crash-course

## Q47

An analyst has a reusable stock-summary method that works when pasted into chat. She wants colleagues to install it as a Skill using the course’s package structure, rather than copy its prompt manually.

Her folder contains:

```text
stock-summary/
  guide.md
```

The document has valid name and description frontmatter followed by the tested instructions. There are no required external assets or scripts. The name is stock-summary, and its description names the intended requests. She is choosing the smallest packaging correction while preserving that working content.

Which correction makes this package match the required structure?

**A**

Keep guide.md and add a note in its description saying that it is the main file, allowing the loader to discover instructions from metadata.

**B**

Rename the folder to SKILL.md and keep guide.md inside it, using the folder name to identify the method while preserving the tested document unchanged.

**C**

Export guide.md as a PDF and attach it to each colleague’s Project, treating that reference as the installed Skill whenever a summary is requested.

**D**

Rename guide.md to SKILL.md inside stock-summary, retaining its valid frontmatter and instructions, then check the resulting package before handing it to colleagues.

Sources:

- Skills & Connectors: Teach AI Once, Connect It to Your Apps — 11. Anatomy of a SKILL.md — https://agentfactory.panaversity.org/docs/skills-connectors-crash-course

## Q48

Before asking AI, an organiser records:

> Choose the forty-seat room. Confidence: 70%. Switch to the larger room if confirmed registrations exceed forty.

AI then reports forty-six confirmed registrations from the booking file. The organiser checks that count herself and chooses the larger room. On the day, forty-three people attend.

She considers replacing her original note with “I expected more than forty”. The original note, checked count, and actual attendance are available. She wants an honest record of her judgment and the evidence that changed it.

Which review note best preserves that record?

**A**

Replace the initial expectation with more than forty, because the final room choice and actual attendance show that this was the judgment she reached.

**B**

Retain the original position and confidence, record the verified count that triggered reversal, and compare the expectation with attendance without rewriting her earlier belief.

**C**

Retain the forty-seat position but describe the larger-room choice as unexplained AI influence, because changing after the assistant’s answer invalidates an independent judgment.

**D**

Record only the successful final room choice and attendance, removing the confidence and earlier position so the audit focuses on results rather than guesses.

Sources:

- How to Think in the AI Era: Crash Course — Discipline 1: The Prediction Lock — https://agentfactory.panaversity.org/docs/how-to-think-ai-era

## Q49

A charity wants AI to guarantee the exact total of donations it will receive next month. The brief and historical data have been checked. Fresh sessions and a capable model using code still return different precise forecasts. The configuration is current.

Next month’s total is not yet committed or received. The coordinator accepts that prompt, context, feature, and configuration checks have not produced a dependable exact answer. She needs a planning result the team can use rather than another unsupported guarantee.

Which change best addresses the remaining problem?

**A**

Gather additional history and ask the model to reconcile its forecasts into an exact total, treating agreement after the larger input as the guarantee.

**B**

Increase reasoning effort and require each forecasting step to be explained, using the detailed calculation as the basis for the charity’s exact funding guarantee.

**C**

Replace the exact guarantee with a range or adjustable driver model, state the assumptions, and examine how planning changes under different donation outcomes.

**D**

Reset the session with a brief and the same data, accepting the first precise forecast that remains unchanged when the assistant repeats its explanation.

Sources:

- Workflow Design & Diagnosis — 12. The sequence runs cheapest first — https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course
