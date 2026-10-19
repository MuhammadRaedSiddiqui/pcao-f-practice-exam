# Intermediate expansion — Batch 3 of 5

AI-authored 2026-10-18. Exactly ten unpublished drafts; no human review, educational approval or waiver extension is claimed. Use [the solve-first copy](batch-3-questions-only.md) before this answer-bearing feedback. [Review and identities](../../PHASE-7-BATCH-3-REVIEW.md), [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [original-source ledger](SOURCE-VERIFICATION-LEDGER.md) retain the verification and pending gates. Existing pilot and Batch 1–2 guides are unchanged.

```json
{
  "authoringFormatVersion": 1,
  "batch": 3,
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
      "questionId": "Q29",
      "sourceFingerprint": "sha256:q1:d6cec55f246519ed4377b7bca0a66b2d2c2a22f2d7e05fe0b97ac05da36a9cf9",
      "hints": [
        "Locate the remaining evidence gap after the brief, current inputs and fresh conversations have already been checked.",
        "Distinguish an explanation of a numerical result from evidence that the specified calculation actually occurred.",
        "Use the independently checked subset to plan a discriminating test, then consider what still needs checking before trusting the rest."
      ],
      "decisiveCriteria": [
        "The inclusion, units and blank rules are complete; fresh chats still disagree with an independent calculation.",
        "No execution evidence is present even though code execution is available.",
        "A calculation test must use known rows first and then inspect the full result and method."
      ],
      "reasoningMarkdown": "C is the keyed next test. Running the specified calculation and comparing its five-row result with the analyst’s independently known result directly tests the missing execution feature. The full output and calculation method still require review: executed code can apply the wrong inclusion or blank rule. A adds explanatory fluency without proving computation. B changes reasoning capacity but still compares written averages, which is less direct than the available calculation test. D repeats checks already performed and treats agreement as correctness. The course supports diagnostic sequencing and known-answer checks; this case supplies the completed prior checks, current file and known subset. No actual delivery average can be calculated from the information given.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Could expose assumptions in a written explanation.",
          "failsOrLimitsMarkdown": "More detail or confidence does not establish that the calculation ran or that its result is correct."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Tests whether additional reasoning capability changes the result.",
          "failsOrLimitsMarkdown": "Leaves actual execution untested and compares written answers rather than using the available known-answer computation test."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Runs the calculation, checks it against independently known rows and retains full-result and method verification.",
          "failsOrLimitsMarkdown": "No failure under the case; a subset pass alone is not proof that all rows and rules were processed correctly."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Restates explicit data-handling rules and provides another response to compare.",
          "failsOrLimitsMarkdown": "Fresh context and complete rules were already checked; a majority can reproduce the same numerical error."
        }
      ],
      "closestDistractorIds": [
        "B"
      ],
      "vocabulary": [
        {
          "term": "Known-answer test",
          "definition": "A comparison between a computed result and a result independently established for the same input."
        },
        {
          "term": "Execution evidence",
          "definition": "An observable record that the requested operation actually ran."
        },
        {
          "term": "Method verification",
          "definition": "Checking that the calculation implements the intended rules, not merely that it finishes."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "After prompt and context checks, test the feature appropriate to the remaining error.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 12. The sequence runs cheapest first; rendered passage lines 572–586."
        },
        {
          "sourceIndex": 1,
          "claim": "Test computed work against independently known input/output and inspect the method as well as results.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 6. Verifying work you cannot read; rendered passage lines 434–450."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q29-v1"
      }
    },
    {
      "questionId": "Q30",
      "sourceFingerprint": "sha256:q1:5cc0a822d9123a1eda988a82aeb77715ae6ab7f33df41c364e82b4c12dfc4428",
      "hints": [
        "Separate a measure of individual replies from a measure of whether the service achieves its purpose.",
        "Read each table row with its measure label, then distinguish the manual checks already performed from the reported customer experience.",
        "List plausible reasons a customer might still be stuck, and identify the observation that would distinguish those explanations."
      ],
      "decisiveCriteria": [
        "The audit reports 98% correct answers checked and 24% of customers resolving their problem; these are distinct measures.",
        "Manuals support the instructions, while many unresolved customers report repeated accurate steps without help when a step fails.",
        "Evaluation must investigate behavior across interactions and subsequent user actions without assigning one cause to every unresolved case."
      ],
      "reasoningMarkdown": "A targets the unanswered service-performance question. The Measure/Result table reports 98% for checked answer correctness and 24% for customer problem resolution. Accuracy is already supported by manual checks, but does not establish that the interaction helps a customer recover when a step fails. Inspecting unresolved conversation sequences and later actions can test the reported repetition/adaptation problem. B only extends the existing individual-answer accuracy audit. C falsely equates every unresolved outcome with a factual error, though the causes may differ. D proposes a rewrite and reviewer ratings without investigating the actual service behavior. The table supplies no shared denominators or case linkage from which to compute the overlap of accurate answers and unresolved customers. It supports investigation, not a claim that every unresolved case has the same cause.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Examines unresolved interactions, adaptation after failed steps and what customers do next under the service’s resolution goal.",
          "failsOrLimitsMarkdown": "No failure under the case; findings must distinguish causes instead of assuming all unresolved customers had identical experiences."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Could provide more evidence about the accuracy of individual responses.",
          "failsOrLimitsMarkdown": "Does not investigate the remaining interaction/outcome problem after those instructions have been checked against manuals."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Recognizes that accuracy and resolution differ in the audit.",
          "failsOrLimitsMarkdown": "Misclassifies unresolved cases as factual mistakes without evidence and changes references already supporting the instructions."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "May improve readability and uses external review of proposed wording.",
          "failsOrLimitsMarkdown": "Ratings of replacements do not establish why the actual unattended interactions fail to help users."
        }
      ],
      "closestDistractorIds": [
        "D",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Performance discernment",
          "definition": "Evaluating whether independent AI behavior serves the people interacting with it."
        },
        {
          "term": "Resolution measure",
          "definition": "Evidence about whether a user’s problem was actually resolved."
        },
        {
          "term": "Causal attribution",
          "definition": "Assigning a result to a cause; this requires evidence beyond observing two different measures."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Evaluate independent AI behavior through user outcomes across interactions, not individual response accuracy alone.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 5.3 Performance discernment: is the AI serving people well when you are not watching?; rendered passage lines 551–558."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q30-v1"
      }
    },
    {
      "questionId": "Q31",
      "sourceFingerprint": "sha256:q1:8e9ca9883a6985336ee32f04612eef4a0ce0a6360ab99d63697aba19059909f2",
      "hints": [
        "Treat the decision as separate qualification checks for distinct tasks rather than a single overall ranking.",
        "Keep each table value attached to its task column and compare it with the rule for performance before repair.",
        "Build a qualification grid before considering assignments, leaving untested combinations marked separately."
      ],
      "decisiveCriteria": [
        "Each task requires at least nine passes before repairs, using equal-cost trials with the same inputs and briefs.",
        "Separate assignments are allowed; performance in a neighboring task does not qualify a task-specific result.",
        "A combined-model workflow has no tested result, and future outputs still need staff checking."
      ],
      "reasoningMarkdown": "The complete keyed set is B and D. In the Configuration/Summaries passing/Extractions passing table, R records 9 of 10 summaries and 7 of 10 extractions; T records 8 of 10 summaries and 10 of 10 extractions. Comparing each cell with the nine-pass requirement gives R summaries 9 ≥ 9 and T extractions 10 ≥ 9; R extractions 7 < 9 and T summaries 8 < 9 do not qualify. B assigns the qualifying summary configuration and D the qualifying extraction configuration, jointly covering both tasks. A and C transfer success across columns instead of using same-task evidence; later repairs cannot satisfy a before-repair threshold. E invents qualifying performance for an untested combined workflow. Equal costs remove cost as a differentiator, and staff checks remain required after this initial assignment; the trial does not guarantee future results.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Retains checking of extraction results and recognizes R’s summary performance.",
          "failsOrLimitsMarkdown": "R has only seven extraction passes, so confidence from summaries does not meet the extraction threshold."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Assigns R to summaries on its nine passing summaries and keeps subsequent checks.",
          "failsOrLimitsMarkdown": "Needs D’s qualifying extraction assignment to cover both tasks; one passing task does not qualify the other."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Recognizes T’s perfect extraction trial and proposes later feedback on summaries.",
          "failsOrLimitsMarkdown": "T has eight passing summaries, below the required threshold before repairs; extraction success and future repair do not change that observation."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Assigns T to extraction on its ten passing extraction results and uses same-task evidence.",
          "failsOrLimitsMarkdown": "Complements B for summaries; this trial still provides only an initial basis, not an assurance about all future outputs."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Proposes comparison between configurations as a possible workflow.",
          "failsOrLimitsMarkdown": "That joint workflow has no measured trial score, and agreement cannot manufacture the required pass count."
        }
      ],
      "closestDistractorIds": [
        "C",
        "E"
      ],
      "vocabulary": [
        {
          "term": "Task-specific evaluation",
          "definition": "Judging performance using evidence from the particular job to be assigned."
        },
        {
          "term": "Qualification threshold",
          "definition": "A minimum observed result required before an option is eligible."
        },
        {
          "term": "Jagged capability",
          "definition": "Uneven AI performance across tasks, even when the tasks appear related."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Capability can differ sharply between neighboring tasks; evaluate the task being assigned.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course — 7. It is brilliant and useless on two tasks in a row (the jagged frontier); rendered passage lines 387–392."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q31-v1"
      }
    },
    {
      "questionId": "Q32",
      "sourceFingerprint": "sha256:q1:5151a2da310f91e1db3c334a7512d57c62e18ae117baa4b1823e2560e98cf879",
      "hints": [
        "Define what must be established before a notice becomes a customer commitment.",
        "Compare the checks already performed with the facts and authority that the company’s policy makes relevant.",
        "Follow a notice through each proposed review, noting what evidence would authorize its release at that point."
      ],
      "decisiveCriteria": [
        "Sending a notice commits the company to a date and charge; the account manager holds approval authority.",
        "Spelling and layout are checked, but dates and charges still need verification against approved work orders.",
        "The available responsible manager must verify and approve each notice before sending, not a later sample."
      ],
      "reasoningMarkdown": "C combines the required role, evidence and timing. The account manager checks each appointment date and quoted charge against the approved work order and approves the notice before transmission. The managed route is already approved; that does not supply the missing commitment gate. A adds useful clerk fact-checking but substitutes later manager sampling for the required approval of each commitment. B uses the right person before sending but reviews wording rather than the decisive facts. D uses the right role and facts after the commitment has already been made. The course supports a specified gate; the company policy, manager availability and particular commitment facts come from the scenario.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Adds source-based date/charge checking by the clerk.",
          "failsOrLimitsMarkdown": "The account manager approves only a later sample, rather than each customer commitment before release."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Places the responsible manager before the sending step.",
          "failsOrLimitsMarkdown": "A wording review and layout check do not verify dates and charges against the approved records."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses the available authorized manager, checks the commitment facts against approved work orders and requires approval before each send.",
          "failsOrLimitsMarkdown": "No failure under the case; the existing clerical check remains useful supporting work."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Compares notices with work orders through the responsible manager.",
          "failsOrLimitsMarkdown": "The review happens after sending, when the customer commitment already exists."
        }
      ],
      "closestDistractorIds": [
        "B",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Approval gate",
          "definition": "A defined check and decision that must precede the controlled action."
        },
        {
          "term": "Commitment fact",
          "definition": "A detail, such as a date or charge, on which an external promise depends."
        },
        {
          "term": "Accountable role",
          "definition": "The role that holds responsibility for approving the particular action."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "A useful review gate specifies responsible role, risk-relevant checks and timing before consequential release.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 1.3 A human in the loop is not a gate; rendered passage lines 228–245."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q32-v1"
      }
    },
    {
      "questionId": "Q34",
      "sourceFingerprint": "sha256:q1:a86f03cb4f526d79b5468087a38af9f24b3a7f2762a6886ce36443072904aae0",
      "hints": [
        "Identify the work product being accepted and where a change could occur between preparation and delivery.",
        "Separate checks of the preview, claims about the saved file and observations of the file itself.",
        "Choose a material term and follow it through the representations to the client-facing artifact and its supporting proposal."
      ],
      "decisiveCriteria": [
        "The decision concerns the exported supplier comparison, not the preview that was previously checked.",
        "Past exports changed wrapping and shortened notes; the export has not been inspected.",
        "Acceptance must examine the actual file’s table and cancellation notes and trace consequential terms to the proposals."
      ],
      "reasoningMarkdown": "D checks the artifact the client would receive and the support for its material terms before a sending decision. The verified preview is useful prior evidence but cannot establish that export preserved table readability, references and cancellation notes. A rechecks the preview rather than that transformation. B asks the assistant for another assertion about contents. C establishes access to the file but relies on the preview for content despite known export risks. The course supplies a claim-focused trace/challenge/decision method and human review of final client deliverables; applying it to export differences follows the case’s explicit history. No actual export defect is presumed before inspection.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Reconfirms terms against the original proposals in the preview.",
          "failsOrLimitsMarkdown": "Leaves the actual exported representation and possible loss of notes or readability unchecked."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Compares a reported contents list with the requested structure.",
          "failsOrLimitsMarkdown": "The tool’s self-report does not demonstrate what the saved table and notes actually contain."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Opens the artifact and tests download/access.",
          "failsOrLimitsMarkdown": "Access alone does not verify the consequential table/notes survived export intact."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Inspects the actual exported table and cancellation notes and traces the terms to the proposals before sending.",
          "failsOrLimitsMarkdown": "No failure under the scenario; the inspection may accept the file or identify a correction rather than assume export must have failed."
        }
      ],
      "closestDistractorIds": [
        "C"
      ],
      "vocabulary": [
        {
          "term": "Deliverable acceptance",
          "definition": "A decision that the actual work product meets its intended use and evidence requirements."
        },
        {
          "term": "Representation change",
          "definition": "A transformation, such as export, that may alter how information is retained or displayed."
        },
        {
          "term": "Material term",
          "definition": "A condition important enough that its alteration could affect the recipient’s decision."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Verify material claims against sources and have a person review final client work before acceptance.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 10. Verify Before You Accept; rendered passage lines 735–755."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q34-v1"
      }
    },
    {
      "questionId": "Q35",
      "sourceFingerprint": "sha256:q1:c4984b103ccef221a19fcda105dd94cd89baf281c0579500edfebb4869668d6a",
      "hints": [
        "Distinguish failure to start the saved method from failure while carrying it out.",
        "Compare the intended request boundary with the current eligibility text, including requests that should remain outside it.",
        "Simulate monthly, annual and short-message requests against that text; identify the mismatch that a targeted change and retest would need to address."
      ],
      "decisiveCriteria": [
        "The installed procedure passes direct invocation; the observed failure is that an annual request does not load it.",
        "The current description explicitly excludes annual reports, contrary to the intended monthly-and-annual board-paper scope.",
        "Correct the relevance boundary while retaining the short-status exclusion and testing intended included/excluded requests."
      ],
      "reasoningMarkdown": "B targets the installed Skill’s description, which states when its already-working method is selected. It adds annual board-paper coverage and likely request wording while keeping quick status messages outside the boundary. A changes unloaded procedure content without correcting the explicit exclusion. C removes every exclusion and admits work that should remain out of scope. D duplicates a working method in a separate copy instead of fixing the installed Skill’s requested activation boundary. The teaching point is whether a change controls selection or execution; a feature label alone does not diagnose the problem. Retesting must check both intended inclusions and the retained exclusion.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Could improve an example used once the procedure is running.",
          "failsOrLimitsMarkdown": "Annual requests are still excluded by the description, so this does not address the observed failure to load."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Changes the installed relevance boundary to include monthly and annual board papers, preserves the status-message exclusion and retests.",
          "failsOrLimitsMarkdown": "No failure under the case; the revised wording must be checked using ordinary intended and excluded requests."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Makes annual requests more likely to trigger the method.",
          "failsOrLimitsMarkdown": "Also admits short status messages and unrelated reporting, violating the required exclusion."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Could provide a separate annual procedure with the same layout.",
          "failsOrLimitsMarkdown": "Leaves the installed boundary wrong and creates another copy of a method that already works."
        }
      ],
      "closestDistractorIds": [
        "D",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Activation boundary",
          "definition": "The range of requests for which a saved method should be selected."
        },
        {
          "term": "Negative trigger",
          "definition": "A stated condition that excludes a request from activating a capability."
        },
        {
          "term": "Regression check",
          "definition": "A check that an intended change preserves behavior that should still work or remain excluded."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Relevance descriptions and negative triggers control the intended activation boundary.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 12. The description field is the whole game; rendered passage lines 404–414."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q35-v1"
      }
    },
    {
      "questionId": "Q36",
      "sourceFingerprint": "sha256:q1:4f6f8d469e195db81d11db3a61bd3b59133d1822635b3aba90cffdb90fb75592",
      "hints": [
        "Separate the mechanics of reading a quantity from the business meaning of counting a record.",
        "Look for input cases whose contribution to a total is not determined by the current brief.",
        "Write down how competing interpretations would change the totals, and identify which interpretation the brief actually authorizes."
      ],
      "decisiveCriteria": [
        "The input includes unit-bearing quantities, repeated rows and blank quantities; the required output is totals plus exceptions.",
        "Repeated rows may be duplicate records or separate checkouts, and blanks have no agreed meaning.",
        "Input formats and coordinator-approved counting/blank rules must be established in the brief before computation."
      ],
      "reasoningMarkdown": "C prepares a calculation whose business meaning can be checked. Inspect the actual formats, then settle how repeated entries and blanks affect counts with the coordinator and record those rules before running. A chooses implementation details while leaving substantive defaults to the assistant. B can produce matching totals from scripts sharing the same unstated wrong rule. D lists uncertain rows but still lets cleanup decide their effect on totals. The guide does not decide whether repeats are duplicates, whether blanks mean zero, or how many checkouts occurred: those answers are absent. The course supports complete outcome/rule/edge-case briefs; any example rule in that course is not automatically this workshop’s rule.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Specifies technical parsing and conversion choices.",
          "failsOrLimitsMarkdown": "A language or function cannot establish what repeated rows and blank quantities mean for this organization."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Adds comparison between independently generated implementations.",
          "failsOrLimitsMarkdown": "Agreement can reflect the same missing-rule assumption, leaving the intended total undefined."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Inspects the input and records coordinator-approved rules for ambiguity before calculation.",
          "failsOrLimitsMarkdown": "No failure under the case; implementation and computed results still need validation after the rules are settled."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Makes repeated and blank rows visible as exceptions.",
          "failsOrLimitsMarkdown": "Visibility does not authorize the cleanup defaults that still determine the totals."
        }
      ],
      "closestDistractorIds": [
        "D",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Business rule",
          "definition": "A locally agreed meaning or constraint that determines how records should be treated."
        },
        {
          "term": "Edge case",
          "definition": "An input condition that needs explicit handling beyond the ordinary case."
        },
        {
          "term": "Parsing",
          "definition": "Interpreting a stored value’s format, distinct from deciding its business meaning."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "A computation brief needs input, outcome, local rules and advance handling of imperfect data.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 5. Brief the problem, not the program; rendered passage lines 360–383."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q36-v1"
      }
    },
    {
      "questionId": "Q37",
      "sourceFingerprint": "sha256:q1:deb163b6dbd6da54583aedf25593eb8cd9165e103a61dbe1f135b82e5c9d958a",
      "hints": [
        "Use the timing of the drift and the checks already performed to choose where to investigate first.",
        "Distinguish a source being published elsewhere from the version actually supplied to this workflow.",
        "Trace a retired product in a failed brief back through the loaded references and instructions, then plan how to test any evidence-based correction."
      ],
      "decisiveCriteria": [
        "The brief worked before a catalogue migration, but fresh chats now include retired products while preserving layout.",
        "The current-range requirement is explicit and the model is unchanged; Project source documents do not refresh automatically.",
        "Inspect actual loaded catalogue/instruction versions, repair confirmed stale configuration and rerun an exposing case."
      ],
      "reasoningMarkdown": "D investigates the leading stale-configuration hypothesis. A published replacement catalogue does not establish that the Project loads it; comparing loaded reference/instruction versions with the replacement can reveal the mismatch. Update what is confirmed stale, then rerun a case that included retired products to test the correction. A strengthens a rule already present without inspecting the input. B cannot replace company-specific authoritative configuration with broader model knowledge. C repeats a fresh-context approach that already fails and does not identify the loaded version. Timing guides investigation rather than proving that a particular file or instruction is stale in advance.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Reinforces the current-range requirement and preserves the existing workflow.",
          "failsOrLimitsMarkdown": "Leaves the suspected stale references or instructions unexamined even though the rule is already explicit."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Tests another model’s capability.",
          "failsOrLimitsMarkdown": "Greater capability does not establish which company catalogue is authoritative or repair outdated supplied context."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Reduces conversation length and asks for a shorter output.",
          "failsOrLimitsMarkdown": "Fresh chats already fail, and neither action checks which catalogue or instruction version the Project loads."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Checks the actual supplied versions, repairs confirmed staleness and tests the correction against the observed failure.",
          "failsOrLimitsMarkdown": "No failure under the case; the version audit must establish the mismatch rather than treating timing alone as proof."
        }
      ],
      "closestDistractorIds": [
        "A",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Stale configuration",
          "definition": "Saved instructions or reference material that no longer match the intended current workflow."
        },
        {
          "term": "Loaded source",
          "definition": "The actual reference supplied to a run, which may differ from a document published elsewhere."
        },
        {
          "term": "Failure-case replay",
          "definition": "Repeating an input that exposed a problem to check whether an evidence-based correction addresses it."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use timing as a diagnostic hypothesis and inspect actual configuration dates/versions when behavior drifts.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 11. Four causes, told apart by when the symptom appeared; rendered passage lines 542–571."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q37-v1"
      }
    },
    {
      "questionId": "Q38",
      "sourceFingerprint": "sha256:q1:df4762227b47abf53dd617264496c85b199ee378aaf59c9c0011998f439c7b91",
      "hints": [
        "Separate the analysis supported by the attachments from the decision that depends on an unavailable measurement.",
        "Distinguish an observation from an assumption, and consider what extra reasoning or reading capacity actually adds to the available evidence.",
        "For a trial recommendation, label each premise as observed, assumed or unavailable, then identify which premises would need a new source."
      ],
      "decisiveCriteria": [
        "Plans and costs are supplied, but current daily order volume is necessary for the actual layout choice and unavailable to the tools.",
        "The manager can supply a checked operations figure; more reasoning or context capacity cannot recover a fact never provided.",
        "Useful conditional analysis now must keep assumptions visible and be updated with the checked measurement before an actual-demand recommendation."
      ],
      "reasoningMarkdown": "A and C are the complete keyed set. A uses the available plans/costs to analyze conditional trade-offs, keeping assumed demand separate from observed volume. C obtains the manager’s checked operations figure and updates the comparison before recommending on actual demand. A alone leaves the decisive measurement unresolved; C supplies that fact but does not replace the useful conditional work requested meanwhile. B presents an inference from plan size as a measured current figure. D uses agreement between guesses as confirmation. E increases room for the same attachments, not access to absent information. The course supports the limits of reasoning and context; the measurement’s necessity, tool unavailability and manager access are case facts. No demand figure or winning layout is invented.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Allows useful analysis of supplied evidence and explicitly labelled assumptions without claiming those assumptions are measurements.",
          "failsOrLimitsMarkdown": "Needs C’s checked input before making the actual-volume decision; a conditional preference is not the final grounded recommendation."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Attempts to use available plans and stronger reasoning to estimate demand.",
          "failsOrLimitsMarkdown": "Mislabelling an inferred quantity as the current operations measurement does not supply the required fact."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Obtains the checkable private measurement and incorporates it before a recommendation based on actual demand.",
          "failsOrLimitsMarkdown": "Complements A’s interim analysis; obtaining the fact is not itself the requested comparison of visible trade-offs."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Compares another model’s inference from the same available evidence.",
          "failsOrLimitsMarkdown": "Agreement cannot establish the unavailable private measurement and may repeat the same unsupported assumption."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Provides more capacity for reading the supplied attachments.",
          "failsOrLimitsMarkdown": "Extra capacity cannot reveal a measurement that is absent from those attachments and inaccessible to the tools."
        }
      ],
      "closestDistractorIds": [
        "D",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Conditional analysis",
          "definition": "An analysis that states how conclusions depend on explicitly identified assumptions."
        },
        {
          "term": "Observed measurement",
          "definition": "A value established from the relevant record or observation rather than inferred as if it were known."
        },
        {
          "term": "Information boundary",
          "definition": "The limit of the facts supplied or retrievable for the task."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Extra reasoning can help analyze supplied premises but does not create an independent truth guarantee.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course — 9. \"Thinking\" is just more prediction before the answer; rendered passage lines 420–426."
        },
        {
          "sourceIndex": 1,
          "claim": "A larger context capacity does not supply task facts absent from the available context.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course — 5. The context window is the only thing it can see; rendered passage lines 352–358."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q38-v1"
      }
    },
    {
      "questionId": "Q39",
      "sourceFingerprint": "sha256:q1:089422428373d94a5034057940dfab085fa3cfab3f8f9d6b81a3127a8d5fac91",
      "hints": [
        "Separate evidence that a mechanism ran from evidence that its intended outcome exists.",
        "Compare today’s observations with the agreed result, paying attention to which observations concern another day or merely an execution status.",
        "List what each current observation proves and what remains unknown, then choose a check that could resolve those unknowns without guessing a cause."
      ],
      "decisiveCriteria": [
        "Success requires today’s dated product comparison in the team folder, or an explicit statement that no prices could be checked.",
        "Run completed is execution evidence; today’s output, coverage and delivery have not been verified, and yesterday’s file is insufficient.",
        "Locate and inspect actual outcome evidence before assuming no changes, no data or an inadequate prompt; staff review still precedes pricing use."
      ],
      "reasoningMarkdown": "B treats the dashboard message within its evidential limits and checks the actual result at the agreed destination. Today’s dated file must cover the listed products or explicitly state that no prices could be checked; a completed run alone establishes none of those conditions. A substitutes yesterday’s file without verifying today’s obligation. C interprets missing output as no price change and manufactures a record from that assumption; no-change and unable-to-check are also different outcomes. D diagnoses a prompt failure before examining the run or its delivery. The course supports observable success signals and investigation before redesign. Even a successfully located report still requires the stipulated staff review before pricing decisions.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Offers continuity using an available earlier report.",
          "failsOrLimitsMarkdown": "Does not establish today’s date, required coverage or delivery and treats execution status as outcome success."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Checks today’s actual dated, covered or explicitly no-data output at the destination before accepting success.",
          "failsOrLimitsMarkdown": "No failure under the case; staff must still review the report before using it for pricing."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Attempts to keep a continuous record of reporting results.",
          "failsOrLimitsMarkdown": "A file not yet located proves neither no price change nor no available data; the proposed record would be unsupported."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Proposes a correction if instructions are the problem.",
          "failsOrLimitsMarkdown": "Assumes that cause without first determining what the current run produced or where it delivered it."
        }
      ],
      "closestDistractorIds": [
        "A",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Execution status",
          "definition": "A report about whether a process started, ran or finished."
        },
        {
          "term": "Outcome evidence",
          "definition": "Observations establishing that the required result was produced and delivered."
        },
        {
          "term": "Explicit no-data result",
          "definition": "A reported inability to check the required data, which differs from finding no change."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Completed execution does not establish a correct, complete and delivered result; inspect observable outcome evidence.",
          "evidenceLocator": "AI original-course check for Batch 3, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/general-agents-web-crash-course — Ran is not the same as worked; rendered passage lines 686–691."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q39-v1"
      }
    }
  ]
}
```
