# Intermediate expansion — Batch 4 of 5

AI-authored 2026-10-18. Exactly ten unpublished drafts; no human review, educational approval or waiver extension is claimed. Use [the solve-first copy](batch-4-questions-only.md) before this answer-bearing feedback. [Review and identities](../../PHASE-7-BATCH-4-REVIEW.md), [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [original-source ledger](SOURCE-VERIFICATION-LEDGER.md) retain the verification and pending gates. Pilot and Batches 1–3 guides are unchanged.

```json
{
  "authoringFormatVersion": 1,
  "batch": 4,
  "source": {
    "schemaVersion": 1,
    "examId": "pcao-f-practice-easy-01",
    "bankVersion": "1.0.0",
    "difficulty": "intermediate"
  },
  "plannedGuideVersion": "1.1.0",
  "contentStatus": "draft",
  "questions": [
    {
      "questionId": "Q40",
      "sourceFingerprint": "sha256:q1:4883aba83426f77beea33c3863850a547bba4128b43c32e0210207d95a0efec1",
      "hints": [
        "Identify what the covering analyst must be able to repeat, and what evidence established that it worked.",
        "Distinguish preserving the transformation from preserving an example result or instructions for creating another transformation.",
        "Imagine the handover without access to the creator: check which proposal lets a colleague inspect the intended rules and test the same implementation."
      ],
      "decisiveCriteria": [
        "The existing script has passed sample and full-file checks under an agreed cancelled-campaign rule.",
        "Matching input structure and unchanged rules are expected; the handover should retain tested behavior and its purpose.",
        "Keep the runnable implementation, explanatory intent and independently known test together for a colleague; scheduling is unnecessary."
      ],
      "reasoningMarkdown": "A preserves the tested implementation rather than asking another chat to recreate it. Its header and brief explain the expected inputs and cancelled-campaign rule; the known-answer sample gives the covering analyst a repeatable check on the same inputs. Matching exports can then be processed with that script, while checking that the input structure and rules still fit. B retains outputs but loses the implementation: different monthly inputs need not reproduce last month’s totals. C preserves a reusable request but generates new code, which can differ despite the same instructions and needs its own validation. D retains useful conversational context without explicitly handing over the runnable script, intent and test. The course supports saving these artifacts together; the successful checks and expected stability are scenario facts, not a guarantee that future runs cannot fail.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Retains the executable, its plain-language purpose and a known-answer sample together for repeat use.",
          "failsOrLimitsMarkdown": "No failure under this case; the covering analyst must still check that new inputs and rules match and inspect the new results."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Keeps a historical output that may help explain the reporting format.",
          "failsOrLimitsMarkdown": "Prior totals neither preserve the implemented rules nor provide a known answer for a different month’s input."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Makes the brief available across analysts and chats.",
          "failsOrLimitsMarkdown": "Regenerates the implementation instead of retaining the specifically requested tested behavior; repeating the prompt is not a behavioral guarantee."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Retains a report and the discussion that produced it.",
          "failsOrLimitsMarkdown": "Depends on resuming a conversation and does not explicitly package the executable, intent and independent test for the handover."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Executable artifact",
          "definition": "A saved program that can perform the specified operation again."
        },
        {
          "term": "Known-answer sample",
          "definition": "Inputs with independently checked expected outputs used to test the same operation."
        },
        {
          "term": "Handover",
          "definition": "Transfer of the working materials and their purpose so another person can carry out the task."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Keep tested code together with its purpose and a known-answer input/output example for repeatable handover.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 8. Keep the script: a solved problem becomes a button; rendered passage lines 507–531."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q40-v1"
      }
    },
    {
      "questionId": "Q41",
      "sourceFingerprint": "sha256:q1:90780f24e466070be5f1d0a3ffe99df5655138f5d62e8649bdf4c276db675772",
      "hints": [
        "Read the checklist as evidence about what has actually been exercised, rather than what the written method promises.",
        "Consider what each untried row would tell you that the successful ordinary request cannot establish.",
        "For each remaining row, specify an observable expected behavior before choosing a plan; distinguish content behavior from whether the method should run at all."
      ],
      "decisiveCriteria": [
        "Only Normal month is Passed; Empty month, Messy expense entries and Unrelated short message are all Not tried.",
        "The procedure has not changed, so the normal pass remains evidence for that case but does not establish untried behavior.",
        "The next plan must exercise awkward outputs and excluded activation, then repair observed failures and repeat the checks before reuse."
      ],
      "reasoningMarkdown": "C addresses the actual evidence gaps. The table has two columns, Test and Result, and four test rows: Normal month is Passed; Empty month, Messy expense entries and Unrelated short message are Not tried. Not tried means untested, not failed. Empty and messy inputs require output checks against the defined empty-month and grouping rules; the unrelated message tests whether the Skill stays inactive outside its intended work. Repair only failures that testing actually reveals, then rerun the checks before colleagues reuse the package. A repeats an already-covered kind of input; extra normal successes cannot certify the other rows. B inspects wording rather than observing execution. D postpones known checks to colleagues’ future encounters. The course supplies the testing method; these particular rows, their statuses and the unchanged procedure come from the bank.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Can add evidence about wording variation and normal-case layout consistency.",
          "failsOrLimitsMarkdown": "Leaves the empty, messy and unrelated cases untried despite the explicit release checklist."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "May find ambiguous or contradictory instructions before a run.",
          "failsOrLimitsMarkdown": "A model’s clarity score cannot demonstrate the missing output behavior or non-activation on an unrelated request."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Tests each untried category against its intended behavior, repairs observed failures and repeats checks before reuse.",
          "failsOrLimitsMarkdown": "No failure under the scenario; it does not presume those untried cases have failed or demand needless changes to passing behavior."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Collects feedback from a limited group using familiar normal inputs.",
          "failsOrLimitsMarkdown": "Defers the already identified missing checks until colleagues encounter them, rather than closing them before reuse."
        }
      ],
      "closestDistractorIds": [
        "B",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Test coverage",
          "definition": "The cases and behaviors actually exercised by checks, distinct from cases merely described."
        },
        {
          "term": "Negative activation test",
          "definition": "A check that a saved method does not start on a request outside its intended scope."
        },
        {
          "term": "Regression testing",
          "definition": "Rechecking relevant behavior after a repair to establish that the correction works without losing required behavior."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Test intended activation, excluded requests, ordinary outputs and awkward inputs; repair observed failures and retest.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 13. Test, then iterate; rendered passage lines 415–428."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q41-v1"
      }
    },
    {
      "questionId": "Q42",
      "sourceFingerprint": "sha256:q1:ebefaa57b6dd7ca07ab3b7bb9f472b020172472224d72e51d49e44024c7d8f5f",
      "hints": [
        "Translate the librarian’s reaction into something a reviewer could inspect in the next draft.",
        "Compare each proposed addition with the purpose and supplied brief; a measurable style change may still miss the reason the post exists.",
        "Imagine receiving a polished but still unhelpful revision: use that possibility to test whether the selected directions jointly settle the missing content priorities."
      ],
      "decisiveCriteria": [
        "The current draft offers general praise, while the scenario specifies readers and a registration goal.",
        "The club details and sign-up link are already available; directions should use them rather than invent details.",
        "The complete set must specify audience-relevant content and the required registration action, channel and deadline."
      ],
      "reasoningMarkdown": "B and E are the complete keyed set. B anchors the content to busy parents of children aged seven to ten and asks for a relevant club benefit grounded in supplied details. E makes the next step inspectable: registration through the existing sign-up page before Friday. B alone could leave a relevant post without a usable call to action; E alone could attach a link to generic praise without explaining relevance to the intended readers. A repeats subjective warmth and persuasion. C is measurable, but word count and varied openings do not resolve the missing content priorities. D produces more tone choices while deliberately leaving those priorities unsettled. The course supports converting reactions into observable instructions; the audience, deadline, link and available club facts come from the scenario. No club benefit or registration URL is invented here.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "May improve warmth and persuasiveness of the prose.",
          "failsOrLimitsMarkdown": "Repeats a subjective quality request without specifying the relevant content or next step that is missing."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Specifies the actual readers and a relevant benefit supported by the supplied club details.",
          "failsOrLimitsMarkdown": "Needs E to make registration, channel and deadline explicit; audience fit alone does not complete the requested pair."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Creates observable constraints on length and sentence style.",
          "failsOrLimitsMarkdown": "Those constraints address craft rather than the stated audience and registration purpose."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Offers tone alternatives for a later editorial choice.",
          "failsOrLimitsMarkdown": "Leaves the content priorities to each draft, so choosing a variant does not repair the brief’s missing directions."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Specifies the registration action, supplied page and Friday deadline so the reader can act.",
          "failsOrLimitsMarkdown": "Complements B; an actionable ending alone does not ensure the body speaks to the specified parents."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Observable instruction",
          "definition": "A direction whose presence or effect can be checked in the resulting work."
        },
        {
          "term": "Audience relevance",
          "definition": "Content that connects supplied facts to the needs of the intended readers."
        },
        {
          "term": "Call to action",
          "definition": "An explicit request identifying the next action the communication is meant to prompt."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Replace subjective reactions with observable directions that resolve what the work should contain.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 13. Turn a reaction into an instruction; rendered passage lines 617–631."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q42-v1"
      }
    },
    {
      "questionId": "Q43",
      "sourceFingerprint": "sha256:q1:cfdf2e4b3839ded15ffeb837d58324b923791729cf891161cb39c769df9f21a2",
      "hints": [
        "Separate accuracy of the quoted evidence from the inference that makes the recommendation follow.",
        "Identify the premise that has not been assessed, and compare the available ways to obtain evidence about that premise.",
        "Trace the recommendation from specifications to building needs; ask whether each proposed check can evaluate the link that the administrator cannot judge."
      ],
      "decisiveCriteria": [
        "Quotation fidelity and prices are already checked; technical capacity fit remains an unverified premise.",
        "The administrator lacks the relevant expertise, but a qualified facilities engineer is available before purchase.",
        "Acceptance should use that engineer’s assessment against actual building requirements and specifications, then reconsider the recommendation."
      ],
      "reasoningMarkdown": "B checks the remaining premise through the available relevant expertise before purchase. Accurate manufacturer quotations establish what the specifications say; they do not by themselves establish that the capacity suits this building. The engineer can assess that link against the building requirements, after which the administrator can reconsider the recommendation. C repeats useful extraction and price checks but still leaves applicability unresolved. A adds model agreement about the same evidence without validating the technical fit. D improves comprehensibility and reports confidence, which do not give a non-expert the missing basis for judgment. Product discernment supports checking assumptions and relevant standards; the non-expert exercise explains why an answer can feel right without a sound basis for assessment. Engineer availability and the specific capacity gap are case facts. This guide makes no technical sizing judgment and does not presume which unit the review will favor.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Adds a second model comparison and a check on common cited material.",
          "failsOrLimitsMarkdown": "Agreement can preserve the same untested applicability assumption and does not substitute for the available engineering assessment."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Uses relevant expertise to assess capacity against this building’s requirements before the decision.",
          "failsOrLimitsMarkdown": "No failure under the case; the recommendation must be reconsidered using the review rather than treating the initial choice as settled."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Reinforces quotation and price fidelity to original pages.",
          "failsOrLimitsMarkdown": "Repeats checks already established while leaving the decisive capacity-fit premise unexamined."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "May make the rationale easier to discuss and question.",
          "failsOrLimitsMarkdown": "Clarity and self-reported confidence do not establish technical suitability where the administrator cannot judge it."
        }
      ],
      "closestDistractorIds": [
        "C",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Applicability assumption",
          "definition": "A premise that general information or specifications fit the particular situation being decided."
        },
        {
          "term": "Product discernment",
          "definition": "Evaluating whether an AI-produced result meets requirements and relevant standards."
        },
        {
          "term": "Domain expertise",
          "definition": "Knowledge needed to assess claims and assumptions within a particular technical field."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Evaluate requirements, source support and relevant expertise, including assumptions on which an otherwise accurate recommendation depends.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 5.1 Product discernment: is the result good?; rendered passage lines 511–527."
        },
        {
          "sourceIndex": 1,
          "claim": "A non-expert’s sense that an answer looks right does not provide a reliable basis for judging unfamiliar technical content.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 3. Feel what it is like to be a non-expert; rendered passage lines 842–851."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q43-v1"
      }
    },
    {
      "questionId": "Q44",
      "sourceFingerprint": "sha256:q1:85fe11536f8a8266f451304f24260f14cac5b3065d2092d9c083a8e5ba369b91",
      "hints": [
        "Distinguish the upload that is known from onward use that remains unknown, and consider what the next action could change.",
        "Compare proposals by their effect on further exposure, the factual record and the company’s assigned authority.",
        "Ask what would justify any claim that the incident is resolved, and whether the proposed first action would preserve the owner’s ability to investigate."
      ],
      "decisiveCriteria": [
        "The personal-route upload happened; no summary has reached a colleague and onward data handling remains unknown.",
        "The company already supplies an incident channel and an owner for evidence handling and notifications.",
        "Immediate containment and prompt factual reporting must retain uncertainty and follow the owner rather than unilaterally destroy evidence or create advice copies."
      ],
      "reasoningMarkdown": "D fits the stated incident process: prevent further copies, preserve a factual account including what is unknown, promptly use the incident channel and follow the owner’s handling instructions. The known event is the customer-list upload through a personal account; onward exposure has not been established. A may remove visible material and impair evidence, yet cannot prove provider-side removal; it also postpones reporting until cleanup and recreation. B may ask a relevant later investigative question, but waiting for an answer delays reporting an already known incident. C spreads the actual list to more people and bypasses the defined route. The course supplies the immediate response principles; the company’s channel and owner authority are scenario facts. Neither the guide nor the employee can conclude from the visible chat alone that all data was deleted, or that onward disclosure occurred.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Recognizes that exposed material needs controlled handling and the summary needs a safe route.",
          "failsOrLimitsMarkdown": "Unilateral deletion can compromise evidence, does not prove complete removal and delays the defined reporting process."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Seeks information about possible retention that could assist the investigation.",
          "failsOrLimitsMarkdown": "Makes certainty a prerequisite for reporting, although the improper upload is already known and uncertainty can be recorded."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Seeks colleagues’ assistance in understanding the customer information.",
          "failsOrLimitsMarkdown": "Creates unnecessary additional copies and distributes the list before using the incident channel."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Contains further copying, records known and unknown facts, reports promptly and respects the incident owner’s handling authority.",
          "failsOrLimitsMarkdown": "No failure under the case; subsequent investigation and any deletion or notification decisions remain with the stated process."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Containment",
          "definition": "Limiting further spread or harm while an incident is being assessed."
        },
        {
          "term": "Evidence handling",
          "definition": "Preserving and managing relevant records under the responsible incident process."
        },
        {
          "term": "Exposure uncertainty",
          "definition": "An explicit lack of knowledge about where data went or how it was retained, rather than a claim that no exposure occurred."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Contain further spread, record facts and uncertainty, report promptly and follow the incident owner’s evidence-handling process.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — The first-hour procedure; rendered passage lines 629–637."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q44-v1"
      }
    },
    {
      "questionId": "Q45",
      "sourceFingerprint": "sha256:q1:e2f3a49c93ecf6b0598c064bbc3a845ba5bf64de1d700b328c8bb5094da38b42",
      "hints": [
        "Classify the result each job requires before choosing how to produce it.",
        "Compare the work involved in exact record processing with the judgment involved in communicating supplied facts to a person.",
        "For each proposed pairing, describe what observable check would establish fitness for that job; consider whether the chosen approach actually produces the required kind of result."
      ],
      "decisiveCriteria": [
        "Matching 1,500 records and exact item totals require the agreed rules to be executed over the files.",
        "The single reply requires courteous wording grounded in the supplied facts and approved remedy, not additional research.",
        "Match the approach to each work type and check both outputs against their separate requirements before use."
      ],
      "reasoningMarkdown": "C pairs execution for the stock matching and totals with conversational drafting for the customer reply, retaining verification of both. The retailer has already supplied files and agreed rules, so exact processing is required whether or not a chat notices anomalies. A offers an explanation of totals without establishing that the full computation ran. B can fill a fixed template, but the case calls for drafting an appropriate courteous explanation; choosing code for both ignores that distinct judgment. D postpones mandatory exact processing and also assigns wording selection to code. This is a functional choice about the two jobs, not memorization of a product label or a claim that programs can never generate messages. The course distinguishes computational transformations from drafting; the data volume, rule readiness, supplied remedy and absence of research needs come from the scenario. Execution still needs rule and result checks, and the reply needs factual and tone checks.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Conversational work fits drafting a courteous reply from approved facts.",
          "failsOrLimitsMarkdown": "A strong written explanation of stock totals does not replace executing the specified matching and totals across all records."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Execution fits exact stock processing, and a program can populate a template.",
          "failsOrLimitsMarkdown": "Using the same approach to determine courteous wording misses the separate drafting judgment requested for this one reply."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Assigns each job to its required type of work and explicitly checks both results before use.",
          "failsOrLimitsMarkdown": "No failure under the case; computed output must implement the agreed rule and the draft must preserve the approved facts and remedy."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Pattern inspection could be supplementary exploratory work.",
          "failsOrLimitsMarkdown": "Defers the exact processing already required and routes the language judgment toward computation rather than conversational drafting."
        }
      ],
      "closestDistractorIds": [
        "B",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Code execution",
          "definition": "Actually running instructions to transform data or calculate results."
        },
        {
          "term": "Drafting judgment",
          "definition": "Choosing and revising language to suit a purpose, recipient and factual constraints."
        },
        {
          "term": "Acceptance criteria",
          "definition": "The requirements used to decide whether a work product is suitable for its intended use."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Choose computation for exact data transformations and conversational work for drafting, then check the result appropriate to the job.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 3. The dividing line: which problems are code problems; rendered passage lines 275–310."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q45-v1"
      }
    },
    {
      "questionId": "Q46",
      "sourceFingerprint": "sha256:q1:d902c4744306955276f43600170dd6fe353489bd4fac0bf316d4fc38c44cae6b",
      "hints": [
        "Trace the attended trial from its inputs to the place a reviewer receives the result, under the intended unattended conditions.",
        "Separate facts already established by the trial from obligations that depend on a device or an interpretation of the outcome.",
        "Imagine a week with no material and a week when delivery fails: ask what the reviewer could observe in each proposed design and what a realistic trial would need to establish."
      ],
      "decisiveCriteria": [
        "Cloud sources worked in the attended trial, but its local output destination depends on a laptop that will be off.",
        "Start time and review authority are defined; empty-week reporting and observable delivery success are not.",
        "Use the approved reachable destination, define outcome semantics and exercise the changed route twice with the laptop off before regular scheduling."
      ],
      "reasoningMarkdown": "A closes the known dependency and outcome gaps, then tests the revised route under the actual laptop-off condition twice. The approved cloud folder removes the specific local-destination dependency; an explicit empty-week result and success signal let staff distinguish valid absence of news from missing delivery. The clock and named reviewer already exist and do not resolve those gaps. B keeps the inaccessible destination and offers only a completion notification. C relies on reactive requests after a missing file rather than preparing a functioning unattended route. D fixes the destination but still equates completed execution with a meaningful delivered outcome and leaves empty versus missing unclear. The course supplies resource, outcome and walkthrough checks; the approved sources/folder and existing review gate are case facts. No current product capability or successful unattended trial is inferred from the attended run, and review before circulation remains required.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Uses the approved cloud destination, defines empty and success outcomes and tests the changed route twice with the laptop off.",
          "failsOrLimitsMarkdown": "No failure under the scenario; the named reviewer must still inspect the brief before circulation."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Adds a notification and retains access when the coordinator eventually returns.",
          "failsOrLimitsMarkdown": "Continues to depend on the offline laptop and supplies neither proof of delivery nor a defined empty-week outcome."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Preserves content-producing steps and gives the reviewer a reactive fallback.",
          "failsOrLimitsMarkdown": "Does not close known destination and outcome gaps or test unattended operation before regular runs."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Removes the stated local-folder dependency.",
          "failsOrLimitsMarkdown": "Completion status alone cannot distinguish a delivered empty-week result from absent output; the revised route is also untested."
        }
      ],
      "closestDistractorIds": [
        "D"
      ],
      "vocabulary": [
        {
          "term": "Unattended dependency",
          "definition": "A resource or action that must remain available without a person or their active device."
        },
        {
          "term": "Success signal",
          "definition": "Observable evidence that the required result exists in the required place and form."
        },
        {
          "term": "Empty-case semantics",
          "definition": "An agreed meaning and representation for a run with no qualifying material."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Before unattended runs, establish reachable resources, observable success, authority and empty-case behavior.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/general-agents-web-crash-course — The four answers before you schedule; rendered passage lines 674–691."
        },
        {
          "sourceIndex": 1,
          "claim": "Walk the workflow twice and inspect delivery and edge behavior before enabling regular scheduling.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/general-agents-web-crash-course — Walk it before you schedule it; rendered passage lines 695–704."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q46-v1"
      }
    },
    {
      "questionId": "Q47",
      "sourceFingerprint": "sha256:q1:0936e23c11886f0ed9b2674108be37bf5a3fb10b5f3d2895c79dedf03f45ba1b",
      "hints": [
        "Compare the package’s structural roles with the course convention before changing the method itself.",
        "The scenario already validates several parts of the package; distinguish those facts from the role of each name in the displayed hierarchy.",
        "Map directory, entry document, metadata and optional supporting material to their separate requirements; evaluate which proposal repairs a mismatch with the least collateral change."
      ],
      "decisiveCriteria": [
        "The stock-summary folder, descriptive metadata and tested instructions already meet the stated content requirements.",
        "The displayed entry document is guide.md; the course requires the main file to be named exactly SKILL.md inside the Skill folder.",
        "Rename that file within the existing folder, retaining valid content, then check the resulting package; no extra assets or scripts are required."
      ],
      "reasoningMarkdown": "D makes the smallest correction: stock-summary/ remains the folder, while its guide.md file becomes SKILL.md with the existing valid frontmatter and tested instructions retained. The fenced tree shows a directory and an indented file, so changing the directory name is a different operation. A changes descriptive text but does not satisfy the exact main-file convention. B renames the directory to the filename and leaves the wrong file inside. C creates a reference attachment rather than the installable package the analyst requested. The course establishes the exact main filename and folder convention; the case establishes the valid metadata, working method and lack of required external assets/scripts. This is a structure-to-content distinction, not a diagnosis that the tested instructions need rewriting. Check the corrected package before sharing; no successful installation is claimed here.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Keeps working instructions and adds an explanatory description.",
          "failsOrLimitsMarkdown": "Metadata cannot substitute for the course’s required main filename; no alternative discovery behavior is established."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Attempts to apply the required identifier while preserving document contents.",
          "failsOrLimitsMarkdown": "Applies a file requirement to the directory and still leaves guide.md as the document inside it."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Makes the method available as readable Project reference material.",
          "failsOrLimitsMarkdown": "A reference PDF is not the requested installable Skill package and does not repair its entry document."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Corrects the actual file name inside the existing valid folder while retaining metadata and instructions, followed by a package check.",
          "failsOrLimitsMarkdown": "No failure under this case; packaging validation still precedes handing it to colleagues."
        }
      ],
      "closestDistractorIds": [
        "B",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Entry document",
          "definition": "The main file a package convention requires at the designated location."
        },
        {
          "term": "Frontmatter",
          "definition": "Structured metadata at the start of the document, separate from its instruction body."
        },
        {
          "term": "Package structure",
          "definition": "The arrangement and naming of a directory and its files, distinct from the method’s substantive instructions."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "The main Skill file must be named exactly SKILL.md inside the conventionally named folder; metadata and instructions are separate content requirements.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 11. Anatomy of a SKILL.md; rendered passage lines 365–403."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q47-v1"
      }
    },
    {
      "questionId": "Q48",
      "sourceFingerprint": "sha256:q1:ef14ca1915dae6d9f47d273164da19972b4ac6cddd959369a8dc52199a14fd91",
      "hints": [
        "Separate what was believed before consultation, what was learned before the choice and what happened afterward.",
        "Check whether the change in choice followed a condition already recorded or merely followed the assistant’s preference.",
        "Consider what a later reviewer could learn from each proposed note about the original judgment and the reason it changed, including the limits of a single outcome."
      ],
      "decisiveCriteria": [
        "The pre-AI note commits to the forty-seat room at 70% confidence and specifies a reversal if confirmed registrations exceed forty.",
        "The organiser independently verifies forty-six registrations, meeting that prior condition, and later observes forty-three attendees.",
        "Keep the original belief, confidence and condition; add the checked evidence and outcome comparison without retroactively editing the belief."
      ],
      "reasoningMarkdown": "B preserves the judgment’s timeline. The checked registration count meets the recorded condition: 46 > 40, so moving to the larger room follows the organiser’s own prior rule rather than unexplained deference. Actual attendance is 43, a later outcome distinct from the 46 confirmed registrations; both exceed forty, but they are different observations. The original 70% confidence is a prior confidence judgment, not a measured accuracy rate or proof from this single event. A rewrites the earlier belief using later knowledge. C misclassifies a verified trigger-based reversal as automatic loss of independence. D retains the final result but removes the baseline needed to understand the change. The course supports precommitting a position, a checkable reversal condition and later learning; the counts, verification and room choice are supplied case facts. The record should distinguish original expectation, evidence-based update and eventual outcome without pretending they were identical.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Recognizes that the final choice accommodated the observed attendance.",
          "failsOrLimitsMarkdown": "Replaces the actual prior belief after evidence arrived, erasing the comparison that an honest prediction record protects."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Retains the original position and confidence, documents the verified reversal trigger and compares the later outcome without rewriting history.",
          "failsOrLimitsMarkdown": "No failure under the case; the registration count and attendance must remain distinct and a single event cannot establish long-run calibration."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Keeps a record of the initial position and questions unexamined AI influence.",
          "failsOrLimitsMarkdown": "The organiser checked the fact herself and it met her pre-set reversal condition; changing on that basis does not invalidate independent judgment."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Keeps the final room choice and attendance as outcome evidence.",
          "failsOrLimitsMarkdown": "Removes the prior position and confidence needed to see what was predicted and why the decision changed."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Prediction lock",
          "definition": "A recorded position committed before AI input, with a checkable condition for changing it."
        },
        {
          "term": "Hindsight revision",
          "definition": "Altering an earlier belief after learning what happened, obscuring the original judgment."
        },
        {
          "term": "Calibration",
          "definition": "How well confidence judgments correspond to outcomes over an appropriate body of observations."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Commit the original position and a checkable reversal condition before AI input, retaining the baseline for later comparison and learning.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/how-to-think-ai-era — Discipline 1: The Prediction Lock; rendered passage lines 253–307."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q48-v1"
      }
    },
    {
      "questionId": "Q49",
      "sourceFingerprint": "sha256:q1:6de5c5648967a64017891b3e88c8f018ef0bf45e091ea39f69bb01db4afc2e90",
      "hints": [
        "Locate the remaining mismatch after the stated diagnostic checks have already been performed.",
        "Separate calculations about historical observations from claims about events that have not yet occurred or been committed.",
        "Ask what evidence would be required to justify the requested certainty, then assess which task change could still support a decision while that uncertainty remains."
      ],
      "decisiveCriteria": [
        "Prompt, context, feature, model and current configuration checks are already exhausted in the scenario.",
        "Next month’s donation total is neither committed nor received; history and repeated precise forecasts do not make it a known fact.",
        "Change the guarantee into conditional planning, using a range or adjustable drivers with explicit assumptions and examining different outcomes."
      ],
      "reasoningMarkdown": "C changes the task to a useful planning aid with visible assumptions. A range or adjustable driver model can show how decisions depend on possible receipts without promising an exact unknown total. The case explicitly rules out the cheaper prompt, context, feature and configuration fixes as a route to the requested guarantee; it does not show that forecasting in general is useless. A may improve the evidence base but agreement on a number does not guarantee future donations. B makes the derivation more transparent without removing uncertainty about future events. D repeats a fresh-session and consistency check already unable to supply dependable certainty. The course supports task-fit diagnosis after cheaper checks; the charity’s uncommitted receipts and completed diagnostic history are scenario constraints. No actual donation forecast, confidence interval or numerical planning range is supplied or invented.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Additional history may help build or evaluate a forecast.",
          "failsOrLimitsMarkdown": "Agreement after more input still cannot guarantee the exact uncommitted future receipts."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Explained calculations can expose assumptions and mistakes for review.",
          "failsOrLimitsMarkdown": "Additional reasoning and transparency do not turn a conditional forecast into a certain future fact."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Reshapes the goal into conditional planning, states assumptions and examines decisions under differing donation outcomes.",
          "failsOrLimitsMarkdown": "No failure under the case; assumptions and model results still need review and updating as evidence arrives."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Provides another consistency check in a fresh conversation.",
          "failsOrLimitsMarkdown": "Repetition of a precise number does not resolve the already-tested expectation mismatch or establish an exact future total."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Expectation mismatch",
          "definition": "A requested outcome that exceeds what the available evidence and tools can establish."
        },
        {
          "term": "Driver model",
          "definition": "A model relating an outcome to explicit adjustable inputs or assumptions."
        },
        {
          "term": "Conditional planning",
          "definition": "Comparing decisions under stated possible outcomes rather than treating an uncertain forecast as guaranteed."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "After cheaper diagnostic checks, reshape an impossible exact future guarantee into conditional analysis with stated assumptions.",
          "evidenceLocator": "AI original-course check for Batch 4, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 12. The sequence runs cheapest first; rendered passage lines 572–598."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q49-v1"
      }
    }
  ]
}
```
