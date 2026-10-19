# Intermediate expansion — Batch 5 of 5

AI-authored 2026-10-18. Exactly ten unpublished drafts; no human review, educational approval or waiver extension is claimed. Use [the solve-first copy](batch-5-questions-only.md) before this answer-bearing feedback. [Batch review and identities](../../PHASE-7-BATCH-5-REVIEW.md), [sixty-item inventory audit](../../PHASE-7-60-QUESTION-CONTENT-INVENTORY-AUDIT.md), [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [original-source ledger](SOURCE-VERIFICATION-LEDGER.md) preserve provenance and pending gates. The accepted pilot and Batches 1–4 remain unchanged.

```json
{
  "authoringFormatVersion": 1,
  "batch": 5,
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
      "questionId": "Q50",
      "sourceFingerprint": "sha256:q1:4255f9ab941f9642dc24cbde8b3790b3f73678fab898174c8a2bcde3758eb939",
      "hints": [
        "Consider how the incoming coordinator will use the handover and what information must survive the change of medium.",
        "Compare the recipient’s access with the status of the information already reviewed; not every entry has the same evidential standing.",
        "Imagine receiving only the proposed handover: list what you could act on, what still needs checking and where you would find the basis for that distinction."
      ],
      "decisiveCriteria": [
        "The recipient has no chat access and needs a downloadable one-page handover with schedule, named responsibilities and open checks.",
        "Dates and roles are confirmed, while both supplier prices remain unverified; conversion is ready and no research is requested.",
        "The full selection must specify a usable standalone artifact and retain unresolved labels/checks without downgrading confirmed facts."
      ],
      "reasoningMarkdown": "A and D jointly meet the handover need. A specifies the downloadable one-page artifact, its schedule, responsibility table and open-checks structure, with enough context to work without the chat. D keeps both unverified labels beside their supplier prices and carries their checks into that artifact, while preserving the confirmed status of dates and roles. A alone specifies the container but does not explicitly protect the price caveats during conversion; D alone preserves status but does not specify the required portable form and structure. B produces another chat response and depends on later questions. C hides uncertainty from the incoming user and represents unsettled prices as settled. E relies on access the coordinator explicitly lacks. The course supports a usable deliverable with caveats retained; the two price flags, access restriction and particular handover sections are scenario facts. No supplier price, missing confirmation or new research result is invented.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Specifies the requested portable format, required structure and context independent of the conversation.",
          "failsOrLimitsMarkdown": "Needs D’s explicit preservation of price uncertainty; a well-structured file can still drop caveats in conversion."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Keeps dates and roles prominent in a concise response.",
          "failsOrLimitsMarkdown": "Does not provide the standalone downloadable handover and shifts missing context into later questions."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Places supplier prices into a budget presentation and retains a private reminder.",
          "failsOrLimitsMarkdown": "Removes uncertainty labels from the recipient’s evidence and hides the checks with the departing organiser."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Keeps both unverified labels attached to their prices and visible checks while retaining confirmed dates and roles.",
          "failsOrLimitsMarkdown": "Complements A; preserving status does not itself specify the downloadable one-page artifact and all its sections."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Offers an introduction and a pointer to fuller discussion.",
          "failsOrLimitsMarkdown": "Leaves essential schedule and open-price evidence behind a conversation the recipient cannot access."
        }
      ],
      "closestDistractorIds": [
        "B",
        "E"
      ],
      "vocabulary": [
        {
          "term": "Standalone deliverable",
          "definition": "A work product containing the context its recipient needs without relying on the producing conversation."
        },
        {
          "term": "Caveat preservation",
          "definition": "Keeping evidence limitations attached to claims when content changes form."
        },
        {
          "term": "Open check",
          "definition": "A visible unresolved verification task, distinct from a confirmed fact."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Specify a usable deliverable independent of the chat and preserve caveats when converting content into that artifact.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 6. Ask for the Deliverable, Not an Answer; rendered passage lines 523–558."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q50-v1"
      }
    },
    {
      "questionId": "Q51",
      "sourceFingerprint": "sha256:q1:255cd3725aad37105491ea203fe32de6ca8c5d2f282cef7560e092b9ff850542",
      "hints": [
        "Separate what the extension promises from what its inspected contents can do in the proposed session.",
        "Compare the task’s actual needs with the files and consequential actions available before anything runs.",
        "Trace a possible cleanup action through the session’s access boundary; ask what each review would establish before exposure rather than after it."
      ],
      "decisiveCriteria": [
        "Package inspection reveals deletion-capable cleanup despite a formatting-only description; nothing has run.",
        "The author confirms inherited access to several client folders, while the task needs only one draft report.",
        "Assess actual reach and actions against that limited need and require suitable limits or removal of unnecessary behavior before enabling."
      ],
      "reasoningMarkdown": "B reviews the known cleanup behavior and its actual reach before enabling the extension. The scenario establishes that the script inherits the session’s broad file access; a formatting description cannot create a task-only permission boundary. Clarify what cleanup does and require a proportionate, controlled scope or remove the unnecessary action before use. A tests appearance inside the same broadly writable session, exposing files before resolving that issue. C checks publisher identity but treats a summary line as a technical restriction contradicted by the author’s confirmation. D can add security evidence and logs, yet a scan does not decide whether deletion is appropriate for this one-report task; reviewing deletions afterward does not prevent them. The course supports source/reach/fit/action review and warns that internal origin alone is insufficient. The exact inherited access and deletion capability are case facts; no malicious intent or actual deletion is inferred.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Tests whether the produced report matches the desired layout.",
          "failsOrLimitsMarkdown": "Tests within the broad live session before constraining the known cleanup action; layout success does not establish proportionate reach."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Checks known cleanup behavior and inherited session access against the limited job, requiring controls before enabling.",
          "failsOrLimitsMarkdown": "No failure under the case; the actual limits or removal must be established rather than merely described."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Establishes which internal author supplied the extension.",
          "failsOrLimitsMarkdown": "Identity and the formatting description do not narrow the access already confirmed for its script."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Can detect some security issues and retain action logs.",
          "failsOrLimitsMarkdown": "A scan pass is not approval of task fit, and later logs cannot prevent unnecessary deletion across client folders."
        }
      ],
      "closestDistractorIds": [
        "D",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Capability reach",
          "definition": "The data and actions available to a tool in its actual execution context."
        },
        {
          "term": "Proportionate access",
          "definition": "Access limited to what the specific task justifies."
        },
        {
          "term": "Pre-enablement review",
          "definition": "Assessment and required controls established before a capability is activated."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Review inspected behavior, actual reach, task fit and consequential actions before enabling; internal origin and friendly description do not establish suitability.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 3.1 Treat extensions like software, not like prompts; rendered passage lines 379–399."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q51-v1"
      }
    },
    {
      "questionId": "Q52",
      "sourceFingerprint": "sha256:q1:59cf6b84cae3aed06077b7354ef725b813a66f722722537fd2a5577a924e693c",
      "hints": [
        "Treat each row as a separate copy and compare its location with the team’s acceptance requirement.",
        "Distinguish how long a copy survives from whose destination requirement it satisfies; a status from one row need not describe another.",
        "Trace the finished document to the agreed endpoint and specify the observations that would establish completion without assuming loss or arrival."
      ],
      "decisiveCriteria": [
        "The draft is in temporary task workspace, the finished report in permanent assistant-account storage and the firm’s folder has no report copy.",
        "The account copy remains reopenable after the task; content has passed review and an authorized save route is available.",
        "Recognize existing durability while completing the separate firm-destination obligation, then verify presence and identity there."
      ],
      "reasoningMarkdown": "C respects every table row. Draft / Temporary task workspace describes the working copy. Finished report / Permanent assistant-account storage describes a different durable copy that the team can reopen. Firm’s document folder / No report copy shows that the agreed destination is still unmet. Save the existing reviewed report through the authorized route and verify that the intended document is present there. A recognizes durability but treats an account link as satisfaction of a different destination requirement. B incorrectly transfers the draft’s temporary status to the permanent finished copy and invents a need to regenerate content. D changes a label and moves work into temporary space without giving the firm its required copy. The course supplies the distinction among task space, platform storage and the organization’s records; the permanence, reviewed content and approved route are explicit scenario facts. No file loss, transfer success or current platform retention promise is inferred.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Correctly recognizes that the account copy is durable and shareable by link.",
          "failsOrLimitsMarkdown": "Does not place a report in the explicitly required firm folder; durability and destination compliance are separate conditions."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Recognizes that the draft workspace is temporary.",
          "failsOrLimitsMarkdown": "Ignores the separately permanent finished copy that remains accessible after the task; regeneration is unsupported."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Recognizes account durability and the unmet destination, then uses the authorized save route and verifies the intended copy.",
          "failsOrLimitsMarkdown": "No failure under the case; save intent or an assistant’s claim alone is not evidence that the correct report arrived."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Labels the report as finished and produces a completion record.",
          "failsOrLimitsMarkdown": "Neither a label nor a temporary location establishes custody in the firm’s required destination."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Durability",
          "definition": "A copy’s continued availability after the task, distinct from where it is held."
        },
        {
          "term": "System of record",
          "definition": "The designated place an organization uses to retain and find its authoritative work products."
        },
        {
          "term": "Destination verification",
          "definition": "Checking that the intended file actually exists at the required endpoint."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Distinguish temporary task space, durable platform-account storage and an organization-controlled destination.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/general-agents-web-crash-course — 5. The three file tiers: where does the deliverable actually live?; rendered passage lines 437–463."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q52-v1"
      }
    },
    {
      "questionId": "Q53",
      "sourceFingerprint": "sha256:q1:bbbfce0e89e767a7dda1f4ba92258ff54978960ffaeab3ff5caeda46d08c4109",
      "hints": [
        "Classify the consequences of each table step before assigning who should own it.",
        "Compare producing an input for judgment with making a decision that acts on the company, using the stated reversibility and accountability facts.",
        "Trace a proposal through each ownership arrangement and locate when substantive judgment occurs relative to the point a commitment leaves the workflow."
      ],
      "decisiveCriteria": [
        "Draft prepares proposed wording; Approve decides acceptability; Release signs and sends the agreed amendment.",
        "Drafts are reversible, but signed and sent commitments cannot simply be withdrawn; the manager is accountable and can judge every proposal before action.",
        "AI may supply draft wording for that judgment while approval and signed release remain human-owned before sending."
      ],
      "reasoningMarkdown": "D distinguishes all three rows and their consequences. AI prepares wording as a reversible input. The manager judges whether the amendment is acceptable at Approve, and the signed Release remains human-owned before a commitment is sent. The approved data route establishes eligibility to prepare the drafts, not authority to make the approval decision. A keeps accountable judgment but unnecessarily excludes AI from producing the reversible input the manager can inspect. B keeps a human signature but lets similarity to old examples replace the substantive approval judgment; checking identifiers and recipients afterward does not restore that decision gate. C releases commitments before the manager’s review, when the stated irreversible boundary has already been crossed. The course supplies reversibility, stakes and accountability as ownership criteria; the named manager’s availability and the signing consequences come from this fictional workflow, not a general legal rule for every contract process.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Keeps all consequential decisions with a person.",
          "failsOrLimitsMarkdown": "Treats accountability as a ban on delegating even the reversible input that the available manager can judge."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Keeps signing and transmission with the manager and includes document checks.",
          "failsOrLimitsMarkdown": "Delegates the approval call to AI based on old examples; identifier and recipient checks do not judge substantive acceptability."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses source comparison and retains a later managerial review.",
          "failsOrLimitsMarkdown": "Allows signed commitments to leave before the required human judgment; retrospective accountability is not a prior gate."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Uses AI for reversible preparation and retains human judgment and signed release before the commitment is sent.",
          "failsOrLimitsMarkdown": "No failure under this case; a staffed substantive review must actually occur for every proposal."
        }
      ],
      "closestDistractorIds": [
        "B",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Step ownership",
          "definition": "Assignment of who produces, judges or decides at a particular workflow stage."
        },
        {
          "term": "Reversibility",
          "definition": "Whether the consequences of a step can be undone if it is wrong."
        },
        {
          "term": "Substantive approval",
          "definition": "A judgment about whether the proposed commitment is acceptable, beyond clerical identity checks."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Assign step ownership by reversibility, stakes and accountability, distinguishing a judged input from the decision itself.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 5. Three criteria decide every step; rendered passage lines 371–383."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q53-v1"
      }
    },
    {
      "questionId": "Q54",
      "sourceFingerprint": "sha256:q1:b455ea34f875e0a029f4ee67f3b660a50191e55e9271e5df594496895a49d9a0",
      "hints": [
        "Trace where an unchecked source entry could first influence a decision in the proposed workflow.",
        "Compare the required review moment with the permitted evidence, including terms that the proposals do not state.",
        "Walk through a proposal with a missing term: test whether the selected directions jointly control when it can influence analysis and what later claims may rely on."
      ],
      "decisiveCriteria": [
        "The coordinator requires source-entry inspection before extraction affects comparison or recommendation.",
        "All proposals and agreed criteria are supplied; omitted support hours must remain visible and cannot be supplied by outside offers.",
        "The full set must establish an extraction-only stop and constrain later work to checked facts, agreed criteria and visible unresolved gaps."
      ],
      "reasoningMarkdown": "C and E form the complete process. C extracts the same requested facts across all three proposals and stops for the coordinator’s actual source check before comparison. E marks unstated terms as absent and binds later analysis to the checked table and agreed criteria, carrying remaining gaps into any recommendation. C alone supplies the review pause without explicitly settling treatment of omissions and later evidence limits. E alone states those limits without creating the required extraction-first stop. A ranks before the inspection and checks only the favored vendor’s evidence. B performs extraction and scoring together, replacing the required prior human inspection with a final self-check. D imports estimates from outside the permitted proposals; labeling them does not make them contractual terms in these offers. The course supports ordering stages so extraction errors are checked before they propagate. The source restriction and rule that absent terms stay visible are case facts; no support hours or vendor winner is invented.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Creates an evidence table that could support later inspection.",
          "failsOrLimitsMarkdown": "Chooses a ranking first and limits the table to the preferred proposal, bypassing the required review before comparison."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Covers all proposals and adds a self-check and eventual coordinator approval.",
          "failsOrLimitsMarkdown": "Scoring already consumes unchecked extraction; later approval is not the requested inspection before downstream work."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Extracts consistent source fields across all proposals and pauses before comparison for actual human checking.",
          "failsOrLimitsMarkdown": "Needs E’s explicit omission handling and constraint on later claims to complete the process."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Makes estimates visible as estimates instead of disguising them as quotations.",
          "failsOrLimitsMarkdown": "Uses outside offers beyond the permitted evidence and fills terms that must remain visibly absent."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Keeps omissions visible and limits downstream comparisons to checked entries and agreed criteria.",
          "failsOrLimitsMarkdown": "Complements C; evidence limits alone do not establish the extraction-only pause before those entries influence comparison."
        }
      ],
      "closestDistractorIds": [
        "B",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Stage gate",
          "definition": "A required check before one work stage may supply inputs to the next."
        },
        {
          "term": "Error propagation",
          "definition": "An unchecked mistake influencing later comparisons, scores or recommendations."
        },
        {
          "term": "Evidence boundary",
          "definition": "The specified sources and verified entries from which a claim may be made."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Stage extraction, check it before comparison and scoring, and limit later claims to the support established by earlier stages.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 4.2 Process description: define the approach; rendered passage lines 430–455."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q54-v1"
      }
    },
    {
      "questionId": "Q55",
      "sourceFingerprint": "sha256:q1:592a14a4f335890245f362f7d4def99d12e0d5e8b11fb50505e0328727dfce15",
      "hints": [
        "Separate the relationships the map must preserve from the exact labels that must be read.",
        "Compare what each available source actually shows with what a plausible reconstruction would merely assume.",
        "Trace a branch and one unclear label to their proposed evidence; determine which input plan permits checking both and how unresolved uncertainty would be represented."
      ],
      "decisiveCriteria": [
        "The whole-map photo shows boxes and connections clearly but some small labels are blurred; typed box names do not contain connections.",
        "Clear label close-ups are available and image/text inputs are supported; the task requires the actual map, not an invented process.",
        "Combine relationship evidence and readable label evidence with cross-checks, preserving any uncertainty that remains."
      ],
      "reasoningMarkdown": "B uses the whole-map photograph for spatial relationships and arrows, clear source close-ups for the blurred labels and typed names as a cross-check. Keep anything still unreadable uncertain rather than supplying exact-looking invented text. A omits the only supplied relationship evidence and asks reasoning to reconstruct likely links. C retains relationships but accepts guesses where exact labels are still blurred. D creates a new drawing; polish or apparent clarity in generated pixels does not make them a record of the original whiteboard. The course distinguishes strengths in overall image arrangement from weaknesses in fine print, supports combined image inputs and marks unclear transcription. Applying those principles here requires the case’s available close-ups. It does not promise perfect image reading, claim all image transformations are unusable, or invent a particular branch or label. The criterion is fidelity to this map’s original evidence.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Provides known box names and topic context in readable text.",
          "failsOrLimitsMarkdown": "Leaves connections absent and replaces them with likely relationships, contrary to the real-map requirement."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Combines original relationship evidence, clearer label sources and a typed cross-check while preserving unresolved uncertainty.",
          "failsOrLimitsMarkdown": "No failure under the case; the written sequence must still be checked against the original arrows and readable labels."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Supplies the full image with visible large boxes and arrows.",
          "failsOrLimitsMarkdown": "Accepts inferred exact labels despite available clearer source evidence and the requirement to preserve actual text."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "May create a visually clearer presentation.",
          "failsOrLimitsMarkdown": "A generated redraw can introduce labels or links; its appearance is not independent evidence of the original map."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Multimodal input",
          "definition": "Evidence supplied in more than one form, such as images and text."
        },
        {
          "term": "Source fidelity",
          "definition": "Preservation of the actual source’s meaning, relationships and wording."
        },
        {
          "term": "Uncertainty marking",
          "definition": "Explicitly identifying unreadable or unsupported content instead of presenting a guess as established."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use image evidence for overall structure while checking fine labels and retaining uncertainty; multiple source images can complement text.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 8. Multimodal: images, audio, and what's next; rendered passage lines 628–659."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q55-v1"
      }
    },
    {
      "questionId": "Q56",
      "sourceFingerprint": "sha256:q1:5cbcc416255776c9e314116441453c61f1f68d7209e11bee236f48f2bc5bcdb5",
      "hints": [
        "Locate where the correction currently lives and who can use it when a new conversation begins.",
        "Distinguish a general behavior requirement from a particular example and from a pattern learned by one person’s assistant.",
        "Simulate the covering researcher’s next run without the original researcher present: identify what would state the requirement and what evidence would demonstrate that it transfers."
      ],
      "decisiveCriteria": [
        "Repeated personal-chat corrections work for the original researcher, but the covering user’s new Project chat omits the distinction.",
        "No shared instruction states the general rule; the requirement concerns labeling evidence for dates across different letters.",
        "Store an explicit shared Project standing rule and test it in a covering-user run containing both stated dates and staff estimates."
      ],
      "reasoningMarkdown": "D puts the behavioral correction into readable shared Project instructions and checks it in the workflow that exposed the omission. The test letters must include both stated dates and estimates so the run can demonstrate the distinction rather than merely produce a familiar date phrase. A strengthens private learned behavior without providing the covering researcher a shared explicit rule. B saves one successful example, but copying its wording can misrepresent a later letter with different evidence. C repeats manual prompt repair and still depends on the original person noticing and reminding staff. The course supports moving recurring rules into configuration and distinguishes it from per-user best-effort memory. The shared Project and observed omission are case facts; no universal claim that memory never works or that a new instruction guarantees perfect compliance is made. The covering-run check remains necessary.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "May reinforce the original researcher’s personal preference pattern.",
          "failsOrLimitsMarkdown": "Does not state a shared rule for colleagues’ new chats and repeats the dependence that failed in the case."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Provides a concrete example that might illustrate the desired distinction.",
          "failsOrLimitsMarkdown": "Imitating one summary’s date wording is not a general rule and can misstate different source evidence."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Makes the correction explicit when someone remembers to paste it.",
          "failsOrLimitsMarkdown": "Keeps the recurring manual step and dependence on the original researcher rather than preserving it in shared configuration."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Stores the general evidence-labeling rule in the shared Project and tests transfer using both evidence types.",
          "failsOrLimitsMarkdown": "No failure under the scenario; actual output still needs checking rather than assuming configuration guarantees compliance."
        }
      ],
      "closestDistractorIds": [
        "B",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Standing instruction",
          "definition": "A readable requirement intended to apply consistently within the specified work context."
        },
        {
          "term": "Shared configuration",
          "definition": "Explicit reusable rules or materials available to the people doing the same work."
        },
        {
          "term": "Transfer check",
          "definition": "A run in the intended covering-user context that tests whether a preserved requirement actually applies."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Move a recurring behavioral rule into explicit shared configuration rather than rely on private conversations or best-effort per-user memory.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 14. Rule, reference, or procedure; rendered passage lines 632–662."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q56-v1"
      }
    },
    {
      "questionId": "Q57",
      "sourceFingerprint": "sha256:q1:f44bf85295a78e8c5c658f487505cf11492832d0159c026e23ec57c9f300a1b1",
      "hints": [
        "Identify which intervention dimension remains untested after the checks and corrections already described.",
        "Compare local improvements with whole-plan consistency, keeping the original requirements fixed when assessing a proposed test.",
        "Design a comparison that changes the untested factor while preserving the brief, then specify how you would judge the entire resulting programme."
      ],
      "decisiveCriteria": [
        "Complete context, current sources and fresh chats are already established, and repeated restatements have not resolved linked clashes.",
        "No missing fact or calculation error is identified; a stronger reasoning setting is available but untried.",
        "Test that capability on the same full brief and evaluate all linked constraints, without promising that escalation must succeed."
      ],
      "reasoningMarkdown": "C tests the remaining available capability under the original job rather than changing the requirements. Run the full brief at the stronger reasoning setting and check all staffing and room constraints together; a change that fixes one clash while creating another has not solved the programme. A repeats an already unsuccessful restatement/fresh-context approach and judges tone. B removes an actual requirement without authorization; success on that easier job cannot prove the original condition was unnecessary. D explains local fixes persuasively but does not test the unused capability or establish global consistency. The course supports machine-capability escalation when the current level cannot perform the required step and checking the actual result after intervention. The completed prior checks and availability of a stronger setting are scenario facts. This is a bounded experiment, not proof of a capability diagnosis or a claim that stronger models always solve linked constraints.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Keeps the original constraints and offers another response to inspect.",
          "failsOrLimitsMarkdown": "Repeats already unsuccessful prompt/context changes and uses attentive tone as a substitute for whole-plan correctness."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "May make an easier reduced task feasible for the fast setting.",
          "failsOrLimitsMarkdown": "Changes the required job without authorization; reduced-task success cannot invalidate the original constraint."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Changes the untested reasoning capability while holding the full brief fixed and checks the complete resulting plan.",
          "failsOrLimitsMarkdown": "No failure under the case; results determine whether the capability change helped and may still require further intervention."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Can expose how the current setting justifies individual corrections.",
          "failsOrLimitsMarkdown": "Convincing explanations of local fixes do not establish consistency across all linked constraints or test the available capability change."
        }
      ],
      "closestDistractorIds": [
        "D",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Capability test",
          "definition": "A controlled trial of whether an available processing capability improves the required result."
        },
        {
          "term": "Linked constraints",
          "definition": "Requirements that interact, so satisfying one can affect whether another is met."
        },
        {
          "term": "Global consistency",
          "definition": "Simultaneous satisfaction of the complete set of relevant requirements."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Test available stronger reasoning when the current capability cannot perform the step, retaining the job and checking the actual result after intervention.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 9. Intervene When AI Goes Wrong; rendered passage lines 680–710."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q57-v1"
      }
    },
    {
      "questionId": "Q58",
      "sourceFingerprint": "sha256:q1:e1a9125d14c2d6c1521ac0a6d8e90c243f42141a074e8149008ad4fc56b23062",
      "hints": [
        "Separate the observed change in the table from the explanation asserted after it.",
        "Ask which part of the argument has already been checked and what would still be needed for the inference introduced by therefore.",
        "Propose an observation that could distinguish the claimed explanation from another plausible account, and state how the result would affect confidence in the conclusion."
      ],
      "decisiveCriteria": [
        "The checked current counts are 40 before reminders and 50 afterward; their difference is ten.",
        "Course availability and other promotion have not been compared; authentic counts alone do not establish what caused the change.",
        "Assess relevant alternative changes and comparative evidence before attributing the observed increase to reminders."
      ],
      "reasoningMarkdown": "C tests the inferential link the reviewer is asked to evaluate. The table’s Week and Attendees columns give Before reminders = 40 and After reminders = 50. The observed difference is 50 − 40 = 10 attendees. That arithmetic and the authentic current log establish a change between the weeks, not that reminders caused it. Investigate relevant changes such as course availability or other promotion and comparative evidence that could distinguish explanations. A recalculates a correct difference. B adds agreement on the same limited observations without new causal evidence. D can express uncertainty more honestly, but replacing caused with may have contributed is an editorial qualification, not verification of the proposed explanation. The course’s logical-gap category asks whether a conclusion follows from its evidence; this causal application uses the scenario’s specified unexamined alternatives. The guide neither proves nor disproves a reminder effect, invents a comparison group, nor claims that any unexamined change actually occurred.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Reconfirms the observed ten-attendee increase from accurate source counts.",
          "failsOrLimitsMarkdown": "Does not test the causal connection; current authentic numbers can support a change without identifying its cause."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Adds another interpretation of the same before/after counts.",
          "failsOrLimitsMarkdown": "Model agreement supplies no missing comparative or alternative-explanation evidence."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Examines relevant changes and comparative support for the proposed causal connection.",
          "failsOrLimitsMarkdown": "No failure under the case; the inquiry may strengthen, weaken or leave the causal explanation unresolved."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Softens an overstated claim to acknowledge uncertainty.",
          "failsOrLimitsMarkdown": "Honest hedging is useful but is not the requested check of whether the explanation is supported."
        }
      ],
      "closestDistractorIds": [
        "D",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Causal inference",
          "definition": "Reasoning about whether an intervention produced an observed change."
        },
        {
          "term": "Logical gap",
          "definition": "A missing inferential step between evidence and a claimed conclusion."
        },
        {
          "term": "Comparative evidence",
          "definition": "Observations that help distinguish competing explanations rather than merely repeat the same outcome."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Check whether a conclusion follows from the evidence, separately from factual accuracy and confidence wording.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/how-to-think-ai-era — Discipline 3: The Error Taxonomy; rendered passage lines 587–605."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q58-v1"
      }
    },
    {
      "questionId": "Q60",
      "sourceFingerprint": "sha256:q1:70a5cf32d1a10c43269aa6bb85922a9aa588d8826e56ecc9ee5f7bb29d39cec2",
      "hints": [
        "Identify what the volunteers have actually experienced and what decision they still need evidence to make.",
        "Distinguish visual preference from performance on representative work, keeping the shared goals and revision limits in view.",
        "Describe an observation that could reveal friction with the current prototype and a way to check whether a later change addresses it."
      ],
      "decisiveCriteria": [
        "Only the two volunteers will use the tool; a sample-task prototype works, but they have only seen screenshots.",
        "Their disagreement concerns workflow usefulness, and shared Project definitions and limits can support consistent revisions.",
        "Obtain actual representative-use feedback from both users, refine against the goals and test the changed version before adding more scope."
      ],
      "reasoningMarkdown": "A supplies the missing use evidence within the design loop. Both intended users try representative tasks, record friction against the shared goals, then assess a refinement through another test. The disagreement about grouping versus weekly view is a reason to observe work, not evidence that either view has already won. B adds scope before learning what obstructs use. C substitutes a stronger model’s screenshot preference for the volunteers’ experience. D asks the actual users but measures visual preference, which can inform presentation without establishing workflow fit. The course supports a prototype-feedback-refinement loop with stable Project context; applying it to actual representative use follows this case’s explicit evidence goal. A working sample and polished screenshots are not claims that the prototype fails, and the guide invents no observed friction, preferred view or test outcome. Wider rollout or infrastructure ownership is outside this two-user case.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Obtains representative work experience from both intended users, records friction, refines and retests under shared goals.",
          "failsOrLimitsMarkdown": "No failure under the case; the observations must guide the next change rather than treating every requested feature as necessary."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Includes both expressed preferences and further presentation work.",
          "failsOrLimitsMarkdown": "Adds features and postpones actual use evidence before establishing whether the current prototype fits either volunteer’s workflow."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses shared task definitions and another model’s design analysis.",
          "failsOrLimitsMarkdown": "Screenshot-based model preference cannot supply the missing intended-user work experience."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Collects the volunteers’ own visual preferences.",
          "failsOrLimitsMarkdown": "A vote on appearance does not establish whether representative tasks work well or whether a refinement reduces actual friction."
        }
      ],
      "closestDistractorIds": [
        "D",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Representative task",
          "definition": "Work resembling the intended real use closely enough to expose relevant design problems."
        },
        {
          "term": "Design feedback",
          "definition": "Observations about how a prototype serves its goals, used to guide a change."
        },
        {
          "term": "Iteration",
          "definition": "A cycle of trying a design, learning from the result and testing a refinement."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use a prototype, feedback and refinement loop within stable Project context, then repeat to assess the changes.",
          "evidenceLocator": "AI original-course check for Batch 5, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 9. The loop: ideate, prototype, feedback, refine; rendered passage lines 492–523."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q60-v1"
      }
    }
  ]
}
```
