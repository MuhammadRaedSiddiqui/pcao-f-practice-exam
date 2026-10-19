# Intermediate expansion — Batch 2 of 5

AI-authored 2026-10-18. Ten unpublished draft records; independent educational review and owner approval remain pending. Use [Batch 2 solve-first copy](batch-2-questions-only.md) before opening answer-bearing feedback. Exact version/review/digest identities are in the [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [Batch 2 review](../../PHASE-7-BATCH-2-REVIEW.md). No accepted pilot or Batch 1 content is changed.

```json
{
  "authoringFormatVersion": 1,
  "batch": 2,
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
      "questionId": "Q16",
      "sourceFingerprint": "sha256:q1:78f23fcd06cf65eaa9a8071362f634371d9927befb152fe766108101127c7b42",
      "hints": [
        "Use the timing of the change to form a testable explanation for the disappointing output.",
        "Separate what changed during the work from the brief, tools and reference material that were checked and remained stable.",
        "Compare which proposed test changes the suspected influence while carrying forward only the information needed to preserve current decisions."
      ],
      "decisiveCriteria": [
        "The first six comparisons met the brief; deterioration appeared after a long discussion with discarded drafts.",
        "The brief is complete, staffing evidence exists, and tools and reference files have not changed.",
        "The next step should test accumulated-context influence while preserving checked current decisions."
      ],
      "reasoningMarkdown": "B is the keyed test. A fresh conversation supplied with the current brief, source notes and a checked decision summary removes accumulated discussion while retaining the needed inputs. If the required cost/audience/staffing table holds again, that supports context accumulation as the explanation; it does not prove the cause from timing alone. A intensifies instructions without removing the suspected influence. C changes model capability while keeping the old conversation, confounding the test. D rolls back files despite the stated checks that they are current and contain staffing information. The source supports timing-led hypothesis testing; the curator’s successful early comparisons and stable files are facts of this case.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Restates the required format and permits a before/after comparison of output.",
          "failsOrLimitsMarkdown": "Keeps the accumulated conversation, so it is a weaker test of the leading context hypothesis than changing the session."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Tests a fresh context with the verified brief, sources and agreed decisions preserved.",
          "failsOrLimitsMarkdown": "No failure under the case; the result would support or weaken a hypothesis rather than certify a permanent fix."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Tests a different model capability without losing the conversation history.",
          "failsOrLimitsMarkdown": "Retains the suspected noisy context and changes another variable, making the result less diagnostic."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Would test a reference-version change if there were evidence of one.",
          "failsOrLimitsMarkdown": "The files have not changed and the needed data is present; a rollback is unsupported by this scenario."
        }
      ],
      "closestDistractorIds": [
        "A",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Diagnostic hypothesis",
          "definition": "A proposed cause tested against observations rather than treated as established."
        },
        {
          "term": "Accumulated context",
          "definition": "The conversation history and intermediate material supplied during a session."
        },
        {
          "term": "Confounding change",
          "definition": "An additional change that makes a test’s outcome harder to attribute to one cause."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use symptom timing to choose a hypothesis, then test it; deterioration within a long session can be tested in a fresh context.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 11. Four causes, told apart by when the symptom appeared; rendered passage lines 542–562."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q16-v1"
      }
    },
    {
      "questionId": "Q17",
      "sourceFingerprint": "sha256:q1:dbb46adcd2df47effd4b6477fcc04ef1032358e4da74ce177f1acf0b7d15abf5",
      "hints": [
        "Identify the educator’s intended involvement while the activities are still being developed.",
        "Distinguish decisions made during exploration from approval after a finished recommendation arrives.",
        "Sketch who proposes, challenges and revises an activity in each arrangement; compare that sequence with how she wants to work."
      ],
      "decisiveCriteria": [
        "The educator wants ongoing comparison, challenge and revision using her knowledge of local visitors.",
        "She retains the final activity choice and runs the workshop herself.",
        "The arrangement must preserve participation during exploration, not merely a final approval point."
      ],
      "reasoningMarkdown": "A matches the case: augmentation names the joint exploration the educator describes. She and AI can generate and revise activities while she contributes local knowledge and makes the final choices. B replaces that interaction with a fixed execution recipe and end inspection. C delegates independent selection while she steps away. D allows the model to iterate, but its self-scoring does not supply her involvement during that exploration. The distinction is the actual division of decisions and feedback, not a label for a particular product. Audience and safety constraints remain binding in any arrangement.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Keeps the educator engaged in ideas, feedback, adaptation and choice throughout development.",
          "failsOrLimitsMarkdown": "No failure under the case; collaboration still requires the fixed audience and safety limits."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Gives a clear procedure and retains inspection of the finished plan.",
          "failsOrLimitsMarkdown": "End inspection does not provide the intended exploratory exchange and local judgments during development."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Sets a goal and safety boundaries for independent work.",
          "failsOrLimitsMarkdown": "Transfers activity selection and plan settlement away from the educator’s requested ongoing participation."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Adds iterative self-review and final educator approval.",
          "failsOrLimitsMarkdown": "The model’s internal revisions replace the desired dialogue while the alternatives are being developed."
        }
      ],
      "closestDistractorIds": [
        "D"
      ],
      "vocabulary": [
        {
          "term": "Augmentation",
          "definition": "A working arrangement in which a human and AI jointly develop and assess ideas."
        },
        {
          "term": "Automation",
          "definition": "AI execution of a defined task or procedure."
        },
        {
          "term": "Agency",
          "definition": "Goal-directed AI work with delegated freedom to choose subsequent steps."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Distinguish fixed-task execution, joint exploration and delegated goal pursuit by human participation and decision freedom.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 2. Three ways to work with AI: automation, augmentation, and agency; rendered passage lines 257–320."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q17-v1"
      }
    },
    {
      "questionId": "Q19",
      "sourceFingerprint": "sha256:q1:5f8009b5cab76ea523f03de5d7e76d1c693410b23608a0db5c01bd1a3e8abba4",
      "hints": [
        "List the task’s data needs separately from the conditions governing where it may be processed.",
        "Trace each proposed path to the actual account or service receiving the records, rather than relying on the visible interface.",
        "Check whether each path has authority for this purpose and preserves the information needed to match the resulting summaries."
      ],
      "decisiveCriteria": [
        "Client names are required to associate each summary with its contract.",
        "The administrator has approved this task and data only for the available managed upload route.",
        "Personal accounts and the forwarding service are not approved alternatives."
      ],
      "reasoningMarkdown": "The bank selects C because it uses the route already approved for these named records and this purpose without breaking the matching task. A’s training/deletion settings do not authorize the personal route. B retains a managed interface but forwards the records to a different, unapproved service. D both removes necessary matching information and still uses an unapproved account; trying to infer matches from wording does not meet the stated task. The course supports checking the real data path and its authorization. The guide does not assert that every managed account is approved, nor require fresh approval where this scenario explicitly says it has already been obtained.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Preserves the names needed for matching and adds training/deletion controls.",
          "failsOrLimitsMarkdown": "Those controls do not supply the missing approval for this personal entry point."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Starts from the managed workspace and offers quicker processing.",
          "failsOrLimitsMarkdown": "Its forwarding path sends the data to a separately unapproved processor; the initial interface does not define the whole route."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses the exact available route approved for the data, purpose and required matching information.",
          "failsOrLimitsMarkdown": "No failure under the scenario; processing must stay within the authorized task and existing controls."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Attempts to reduce identifying data and allows later review.",
          "failsOrLimitsMarkdown": "Destroys required matching information and uses a route the policy still does not approve."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Processing route",
          "definition": "The complete path by which information reaches the account, service or processor doing the work."
        },
        {
          "term": "Purpose limitation",
          "definition": "Restricting use of data to the task for which it is authorized."
        },
        {
          "term": "Task-essential identifier",
          "definition": "Identifying information needed to perform the stated job correctly."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Approval depends on the actual route, data and purpose, not the provider’s name alone.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 2.4 The route matters as much as the tool name; rendered passage lines 314–326."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q19-v1"
      }
    },
    {
      "questionId": "Q20",
      "sourceFingerprint": "sha256:q1:9c1df56c067211aaf4d296614e560384e955b28a919faa52858276e50e5efb9e",
      "hints": [
        "Separate improving the language of a statement from establishing the service promise it conveys.",
        "Identify the permitted evidence boundary and compare what each proposal would allow into the next draft.",
        "Imagine a reviewer tracing a newly worded promise back to the brochure; check how each instruction handles a gap in that trace."
      ],
      "decisiveCriteria": [
        "The attached approved brochure is the only permitted source for service claims.",
        "It supplies menus and delivery areas but no allergy guarantee; the added promise has been checked and lacks support.",
        "The rewrite must improve wording without adding promises or concealing missing information."
      ],
      "reasoningMarkdown": "A directly controls the next rewrite: it binds service claims to the brochure, requires support, omits unsupported promises and flags absent details. B imports other companies’ wording outside the permitted source and cannot establish this caterer’s service. C changes how reassurance sounds but explicitly keeps its unsupported meaning. D substitutes agreement about reasonableness for evidence in the authorized brochure. The answer concerns claim provenance, not a conclusion about the actual safety of any menu. The course supports source-bounded responses with inspectable support and visible unknowns; the missing allergy statement is established by this case.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Defines the authorized evidence, requires traceable claim support and makes omissions visible.",
          "failsOrLimitsMarkdown": "No failure under the stated rewrite goal; the resulting claims still need checking against the brochure."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Keeps the brochure central and seeks less absolute wording.",
          "failsOrLimitsMarkdown": "Adds unauthorized outside material and treats other businesses’ language as support for this company’s promise."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Addresses tone and audience suitability.",
          "failsOrLimitsMarkdown": "Retains an unsupported service meaning; softer phrasing does not create supporting evidence."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Invites another assistant to scrutinize the wording.",
          "failsOrLimitsMarkdown": "Agreement that a claim sounds reasonable cannot establish that the permitted source supports it."
        }
      ],
      "closestDistractorIds": [
        "C"
      ],
      "vocabulary": [
        {
          "term": "Source boundary",
          "definition": "The specified material from which factual claims may be drawn."
        },
        {
          "term": "Service claim",
          "definition": "A statement about what an organization offers or promises."
        },
        {
          "term": "Unsupported assurance",
          "definition": "Reassuring wording whose factual meaning is not established by the permitted evidence."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Bind answers to supplied sources, make support inspectable and mark what the source does not establish.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 5. Give AI the Source; rendered passage lines 484–511."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q20-v1"
      }
    },
    {
      "questionId": "Q21",
      "sourceFingerprint": "sha256:q1:ae89ebd3f1009420cc32c2a6bf798581272e264d06689f845e82dfee5d80ad7c",
      "hints": [
        "Distinguish extracting a proposed requirement from establishing an agreed acceptance condition.",
        "Read both columns of the table and compare the basis recorded for each row; do they carry the same authority?",
        "Ask what observable check would show the report arrived in time for its intended use, and whether the current request settles that check."
      ],
      "decisiveCriteria": [
        "The table binds Weekly PDF to the manager’s email, but Delivery by Saturday 9 a.m. to AI’s suggested interpretation.",
        "Recipient, source file and PDF layout are agreed; “soon after Friday’s close” does not establish a delivery deadline.",
        "Saturday staffing depends on delivery, so a usable agreed cutoff must precede schedule design and retain truthful provenance."
      ],
      "reasoningMarkdown": "C resolves the specific missing design input. The table’s Requirement and Recorded basis columns must be read together: Weekly PDF is grounded in the manager’s email; Delivery by Saturday 9 a.m. is explicitly AI’s suggestion. A table entry is not evidence that the warehouse lead agreed to that time. Confirm the usable delivery deadline with that lead, record the resulting agreement distinctly from the original request, then design the schedule. A might test implementation but leaves the acceptance deadline undecided until after a run. B both assumes the suggested time is usable and falsely attributes it to the email. D supplies a readiness notification while leaving staffing dependent on an unsettled arrival time. No alternative deadline is invented, and the already agreed recipient, input and layout remain constraints.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Provides a concrete implementation trial and asks the operational recipient to assess arrival.",
          "failsOrLimitsMarkdown": "Defers agreement of the needed deadline until after building/running the schedule; the source ambiguity remains at design time."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Chooses a definite target and attempts to document its provenance.",
          "failsOrLimitsMarkdown": "The target is not agreed and its proposed attribution is false: the table records it as an AI interpretation, not the manager’s email."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Establishes the usable deadline with the warehouse lead and preserves the separate agreement before choosing a schedule.",
          "failsOrLimitsMarkdown": "No failure under the case; a later implementation still needs to demonstrate it meets that agreed requirement."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Makes report readiness visible to staff.",
          "failsOrLimitsMarkdown": "A notification does not settle the delivery cutoff needed to support Saturday staffing."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Acceptance condition",
          "definition": "An agreed, observable criterion for deciding whether a result meets the need."
        },
        {
          "term": "Requirement provenance",
          "definition": "The source or agreement that establishes a requirement."
        },
        {
          "term": "Design assumption",
          "definition": "A proposed basis for design that has not necessarily been agreed as a requirement."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Requirements need traceable, testable meaning; ambiguous delivery language requires clarification before design.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 2. Extract the requirements, then attack them; rendered passage lines 265–289."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q21-v1"
      }
    },
    {
      "questionId": "Q22",
      "sourceFingerprint": "sha256:q1:161cba57815f0d10224db10423afecc9c1f20c1cc39b92c9936524c713a64a9b",
      "hints": [
        "Separate feedback about writing quality from evidence about the disputed eligibility statement.",
        "Compare what the reviewers evaluated with what the available supplier clause can establish directly.",
        "Trace the disputed statement to its source, then decide which parts of the review feedback remain useful after that check."
      ],
      "decisiveCriteria": [
        "The full clause restricts the rebate to orders of at least fifty units.",
        "The memo claims all orders, including small ones, qualify.",
        "Disagreement should direct a source check; overall scores or model votes cannot override the explicit clause."
      ],
      "reasoningMarkdown": "B uses the disagreement productively: inspect the clause, correct eligibility to its stated minimum of fifty units, and retain useful clarity advice. The source establishes a lower bound rather than eligibility for every order. A seeks wider model support even though the decisive clause is available. C blends overall writing scores rather than checking the disputed fact. D uses an improved self-score as a substitute for source consistency. Different model families can reveal issues, but they are not a voting authority over supplier terms. No specific reviewer is granted factual authority merely because its flag happens to be right in this case.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Recognizes disagreement and seeks another assessment.",
          "failsOrLimitsMarkdown": "Keeps a source-inconsistent claim provisionally while waiting for votes that cannot change the clause."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Uses the flag to verify the exact condition, revises the claim and preserves relevant craft feedback.",
          "failsOrLimitsMarkdown": "No failure under the case; the revised wording must retain the at-least threshold rather than narrow it to exactly fifty."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses a repeatable threshold for general writing evaluation.",
          "failsOrLimitsMarkdown": "An average score can mask a specific factual contradiction; clarity does not establish rebate eligibility."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Feeds critique into revision and may improve the draft’s presentation.",
          "failsOrLimitsMarkdown": "A higher self-assessed score does not demonstrate that the eligibility claim now matches the supplied clause."
        }
      ],
      "closestDistractorIds": [
        "A"
      ],
      "vocabulary": [
        {
          "term": "Eligibility threshold",
          "definition": "A minimum condition that must be met to qualify."
        },
        {
          "term": "Cross-model review",
          "definition": "Assessment of work by another model, which can identify concerns for verification."
        },
        {
          "term": "Craft feedback",
          "definition": "Comments on qualities such as clarity or structure, distinct from factual evidence."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Different-model critique can expose concerns; scores and agreement do not replace factual verification.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 13. Models checking models; rendered passage lines 832–860."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q22-v1"
      }
    },
    {
      "questionId": "Q23",
      "sourceFingerprint": "sha256:q1:65c9fa7d95b368449fa38f204a4cec00196cbac13e16eb892cb6b486c9cffa2e",
      "hints": [
        "Examine which possible conclusions the prompt actually permits, before judging how balanced it sounds.",
        "Compare the starting position and burden of proof assigned to each staffing approach.",
        "Imagine the supplied file does not settle the comparison; check what each replacement instruction would let the assistant report then."
      ],
      "decisiveCriteria": [
        "Neither staffing approach has been chosen; both must be assessed against the same supplied costs, service needs and availability limits.",
        "The prompt must permit either approach to be recommended rather than privilege hiring.",
        "Evidence supporting a conclusion and unanswered questions must be visible, including when the information cannot distinguish the options."
      ],
      "reasoningMarkdown": "The complete keyed set is A and D. A establishes symmetric evaluation: the same cost, coverage and staffing criteria, with a case and limitation for each option before any recommendation. D makes the evidential basis and unanswered questions explicit and permits an unresolved result. A alone does not explicitly handle evidential gaps; D alone could accompany a comparison still tilted toward hiring. Together they remove the predetermined winner and prevent missing information from becoming invented certainty. B retains hiring as the default that objections must defeat. C improves an already selected hiring proposal instead of reopening the choice. E gives equal space while fixing the winner and asserting an unestablished long-term advantage. No actual staffing cost or recommendation is invented by the guide.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Uses common criteria and evaluates both approaches before recommending a result.",
          "failsOrLimitsMarkdown": "Needs D’s explicit handling of evidence and unanswered questions to address the whole stated aim."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Considers counterarguments and allows a change if objections are serious.",
          "failsOrLimitsMarkdown": "Starts from a privileged hiring recommendation, so the two options do not face the same burden of proof."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Adds a challenge and evidence-based revision to a proposal.",
          "failsOrLimitsMarkdown": "The object being improved is still a hiring recommendation, rather than a comparison allowed to select either approach."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Requires a supported conclusion, visible unknowns and an unresolved outcome where evidence cannot distinguish the options.",
          "failsOrLimitsMarkdown": "Complements A’s symmetric comparison; it does not itself replace a biased initial framing."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Gives each approach space and acknowledges a possible rota benefit.",
          "failsOrLimitsMarkdown": "Still commands a hiring conclusion and claims its long-term advantage without evidence that settles the choice."
        }
      ],
      "closestDistractorIds": [
        "B",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Sycophancy",
          "definition": "A tendency for an assistant to agree with the preference implied by a request."
        },
        {
          "term": "Symmetric criteria",
          "definition": "The same decision standards applied to each alternative."
        },
        {
          "term": "Burden of proof",
          "definition": "The evidence an alternative must supply before it can be accepted."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use neutral comparison rather than a predetermined conclusion, and permit uncertainty where evidence is missing.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 6. Sycophancy and how to neutralize it; rendered passage lines 472–492."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q23-v1"
      }
    },
    {
      "questionId": "Q24",
      "sourceFingerprint": "sha256:q1:f36fa80f66ba9d23bf86cc17c34c008cddb3e6c0150f42e084942dbc0037ef6e",
      "hints": [
        "Classify the information need by how quickly the facts can change and the breadth of the requested result.",
        "Compare the evidence each approach can obtain for the current grant round, rather than the amount of effort or confidence it displays.",
        "For a proposed deadline and fee, ask how the group could verify both the source and its relevance to this round."
      ],
      "decisiveCriteria": [
        "This round’s changing deadline and fee require current evidence from the council.",
        "The group needs a short, checkable answer about one grant, not a broad comparison.",
        "The approach must check the round and retain source wording or visible gaps, rather than infer current terms from old data or repetition."
      ],
      "reasoningMarkdown": "D fits the functional need: retrieve the council’s round page, establish that it concerns the current round and report its stated deadline/fee with source support or explicit unknowns. A’s extra reasoning and confidence cannot refresh remembered facts. B’s wider research is unnecessary for the narrow request, and repeated claims across directories are not the council’s current terms. C extrapolates from a previous announcement instead of verifying this round. The concept is matching retrieval and freshness checks to the question; the label of a model or research product does not establish those functions. No live council terms or prices are added.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Can explain remembered information and assess confidence.",
          "failsOrLimitsMarkdown": "Reasoning over recall cannot establish terms that change between rounds."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Looks at multiple sources and aims to condense findings.",
          "failsOrLimitsMarkdown": "Adds unnecessary breadth and treats repetition as authority instead of verifying the relevant council round."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses a genuine earlier council announcement as a reference.",
          "failsOrLimitsMarkdown": "An inferred interval does not establish the current round’s deadline or fee."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Retrieves the relevant official source, checks round freshness and supplies traceable terms or gaps.",
          "failsOrLimitsMarkdown": "No failure under the case; retrieval alone is insufficient without the specified freshness and support checks."
        }
      ],
      "closestDistractorIds": [
        "C",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Freshness check",
          "definition": "Verification that information applies to the relevant current period or version."
        },
        {
          "term": "Retrieval",
          "definition": "Obtaining information from a source available for inspection."
        },
        {
          "term": "Scope of research",
          "definition": "The breadth of investigation needed to answer the actual question."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Match retrieval breadth to the question and check currency and source support even after searching.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 3. The 3 retrieval modes: pretrained, web search, deep research; rendered passage lines 272–289."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q24-v1"
      }
    },
    {
      "questionId": "Q27",
      "sourceFingerprint": "sha256:q1:e1f93b9e16feb68849b5585af910389fc4deaca3ba506dbba936553f07a20291",
      "hints": [
        "Locate the repeated effort: is it in explaining the reporting method or obtaining its inputs?",
        "Consider when the quantities in each proposal were captured relative to the run that will use them.",
        "Trace a later report through each setup: what can reach the app, what values would it receive, and what method would process them?"
      ],
      "decisiveCriteria": [
        "The existing reporting Skill already works correctly with supplied data.",
        "Quantities change during the day, so saved exports do not establish the values for each later run.",
        "An approved read-only Connector can remove manual fetching while preserving the working report method."
      ],
      "reasoningMarkdown": "B provides the missing function: approved read-only app access retrieves quantities for each run and the existing Skill processes them. A enables access once but then reuses a saved snapshot, losing per-run currency. C refreshes only daily, while the case explicitly says quantities change throughout the day. D stores another snapshot and update instructions in a second Skill without creating access to the inventory app. Method instructions are not access permissions, and a connected tool does not itself guarantee that every run reads fresh values; B specifies both retrieval timing and reuse of the proven method. No write capability or toolchain redesign is needed.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Enables the link and preserves the existing reporting method.",
          "failsOrLimitsMarkdown": "Subsequent reports reuse stored quantities rather than retrieve changing app values at each run."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Fetches input through the approved read-only route for each run and retains the method that already works.",
          "failsOrLimitsMarkdown": "No failure under the scenario; freshness depends on the per-run retrieval actually specified, not merely enabling a connection."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Updates the reference more often than keeping yesterday’s export.",
          "failsOrLimitsMarkdown": "A start-of-day snapshot can become stale before later runs as stock changes."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Attempts to document data and an update procedure for reuse.",
          "failsOrLimitsMarkdown": "A second method cannot grant missing app access; embedded values remain a snapshot rather than per-run input."
        }
      ],
      "closestDistractorIds": [
        "A",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Snapshot",
          "definition": "A copy of values captured at a particular time."
        },
        {
          "term": "Data currency",
          "definition": "How well input values represent the state needed at the time of use."
        },
        {
          "term": "Read-only integration",
          "definition": "A connection that can retrieve information without changing its source records."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Separate reusable method from access to app data and choose only the integration functions the workflow needs.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 9. Which problems need a Skill, which need a Connector, which need both?; rendered passage lines 329–341."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q27-v1"
      }
    },
    {
      "questionId": "Q28",
      "sourceFingerprint": "sha256:q1:2a93c368698a1c2111bb746fc4f8ec5e3614865cc73a433599c7edc6929d5702",
      "hints": [
        "Compare the workflow described by the document with the evidence about the work currently being done.",
        "Consider how changed volume and staffing could affect a review step even when staff say it still occurs.",
        "Follow each maintenance proposal beyond the immediate edit: how would a later mismatch be found and who would be answerable for keeping the document accurate?"
      ],
      "decisiveCriteria": [
        "Volume has risen from twenty to sixty cases, the reviewer moved roles and the map still names that reviewer.",
        "Actual recent assignments and review time are undocumented; assurance that checking continues does not establish current capacity.",
        "The map needs accountable ongoing maintenance, evidence of real review now, and future scheduled/change-triggered checks."
      ],
      "reasoningMarkdown": "D meets the continuing maintenance goal: identify an accountable map owner, inspect recent steps and checking capacity now, and arrange a next review with earlier checks when conditions change. The volume/staffing change warrants attention before the existing three-month date. A changes a label and relies on later problem reports without checking silent gate decay. B supplies a one-time updater but treats assurances as evidence and closes the task after an ownership edit. C samples output while postponing the known map mismatch. The increase from twenty to sixty is a capacity warning, not proof that every review failed or that a particular new staffing level is required. The guide distinguishes maintaining the map from personally performing every review.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Updates the named reviewing group and retains a calendar date.",
          "failsOrLimitsMarkdown": "Does not establish one accountable map owner or inspect actual capacity now; reactive reports may miss a silently weakened gate."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Assigns a person to make an immediate documentation update.",
          "failsOrLimitsMarkdown": "Trusts assurances instead of recent review evidence and treats ownership completion as the end of maintenance."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Could provide useful evidence about the quality of sampled follow-ups.",
          "failsOrLimitsMarkdown": "Postpones correction of a known staffing/volume mismatch and does not establish current review operation."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Combines accountable map ownership, immediate evidence/capacity review and continuing scheduled/change-triggered maintenance.",
          "failsOrLimitsMarkdown": "No failure under the case; the map owner is answerable for accuracy without having to perform every operational step."
        }
      ],
      "closestDistractorIds": [
        "B",
        "A"
      ],
      "vocabulary": [
        {
          "term": "Delegation map",
          "definition": "A record of workflow steps, their owners and the reasons for those assignments."
        },
        {
          "term": "Review capacity",
          "definition": "The people and time available to perform the required checks."
        },
        {
          "term": "Control drift",
          "definition": "A gradual mismatch between a documented safeguard and how work actually operates."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Keep the workflow map under a named owner and scheduled review; staffing or volume changes require earlier evidence checks.",
          "evidenceLocator": "AI original-course check for Batch 2, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 8. Who owns the map, and when it is read again; rendered passage lines 462–490."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q28-v1"
      }
    }
  ]
}
```
