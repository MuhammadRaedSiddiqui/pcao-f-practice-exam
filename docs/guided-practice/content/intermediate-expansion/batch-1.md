# Intermediate expansion — Batch 1 of 5

AI-authored on 2026-10-18. Exactly ten new draft records; no human review or owner approval is claimed. Use [questions-only.md](questions-only.md) before viewing this answer-bearing feedback. Version/review identities and gates: [Phase 7 content ledger](../../PHASE-7-CONTENT-LEDGER.md). Same Phase 2 fenced-JSON authoring format; never a runtime release.

```json
{
  "authoringFormatVersion": 1,
  "batch": 1,
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
      "questionId": "Q1",
      "sourceFingerprint": "sha256:q1:f25b1ec381d805bcfc5b56297c79591ddac893028272c10c56f766474a4ec266",
      "hints": [
        "Compare the evidence needed for a personal experiment with the evidence needed when colleagues depend on its results.",
        "List the live-service requirements and separate successful examples from the failure conditions that have not been exercised.",
        "For each proposed plan, trace when those requirements would be tested and who would handle an operational problem after adoption."
      ],
      "decisiveCriteria": [
        "The tool is becoming a shared service handling real customer records and payments.",
        "Customer separation, saved-booking persistence and payment-failure recovery are explicitly untested.",
        "The adoption plan must establish those requirements and continuing support before the agency depends on it."
      ],
      "reasoningMarkdown": "The bank selects C. The proposed use exposes twelve agents and real customers to behavior the sample bookings did not test. Defining and testing the stated live-service requirements, with an ongoing support owner before adoption, addresses that evidence gap. A adds a developer but still checks only successful samples. B begins operational dependence before the required behavior is established. D supplies backups and a checklist, but neither proves customer separation nor tests failed-payment handling. The guide applies the course’s escalation principle to these explicit case requirements; it does not claim that a particular architecture or test suite has already been approved.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Includes a developer review before wider use.",
          "failsOrLimitsMarkdown": "The review is limited to successful bookings, leaving isolation, persistence and failure recovery untested."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Provides staff monitoring and a route for later improvements.",
          "failsOrLimitsMarkdown": "Customer and payment operations begin before the service requirements are established; discovering problems later does not satisfy this timing requirement."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Defines and tests the actual service requirements and assigns continuing support before the agency relies on the tool.",
          "failsOrLimitsMarkdown": "No failure under the stated criteria; a plan to test is not itself evidence that implementation has passed."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Adds backup and recovery preparation to the existing tool.",
          "failsOrLimitsMarkdown": "These measures cover only part of the stated risks and do not establish all required service behavior or ongoing support."
        }
      ],
      "closestDistractorIds": [
        "A",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Prototype",
          "definition": "An early working version used to explore a proposed solution."
        },
        {
          "term": "Operational dependency",
          "definition": "A situation in which other people’s work relies on a tool continuing to function."
        },
        {
          "term": "Access isolation",
          "definition": "Keeping one customer’s records separate from another’s access."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Shared operational dependence calls for engineering expertise and support.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 10. When it has outgrown prompt-and-iterate; rendered passage lines 524–540."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q1-v1"
      }
    },
    {
      "questionId": "Q2",
      "sourceFingerprint": "sha256:q1:c6d266decaca343dd2f9adb3c02da7ebdc66ea8a667dbb4a37dabbf528eace3f",
      "hints": [
        "Break the draft into separate promises and ask what evidence supports each one.",
        "Treat the policy’s notice condition and space condition separately; a check of one does not automatically settle the other.",
        "Annotate each promise as supported, unsupported or conditional, then compare how the revisions handle those different evidence states."
      ],
      "decisiveCriteria": [
        "The verified notice is 72 hours, exceeding the policy’s 48-hour fee threshold.",
        "No Saturday space has been confirmed; the policy makes a move depend on availability.",
        "The revision should preserve supported fee eligibility without promising an unverified move."
      ],
      "reasoningMarkdown": "B is the bank’s answer. Since 72 ≥ 48, the notice qualifies for the fee waiver; this does not establish Saturday capacity. B keeps the supported fee statement and conditions the move on a space check. A incorrectly links the notice test to availability. C treats lead time as evidence of capacity, even though the capacity check has not occurred. D obtains another interpretation rather than the missing availability evidence. The arithmetic and separation of policy conditions come from the frozen scenario. Course support concerns checking claims against requirements and sources, including the limits of agreement between models.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Recognizes that the Saturday guarantee lacks a space check.",
          "failsOrLimitsMarkdown": "Also removes supported fee eligibility by introducing an availability dependency absent from the policy’s notice rule."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Preserves the verified fee condition and leaves the move dependent on the unverified space condition.",
          "failsOrLimitsMarkdown": "No failure under the case; availability still needs staff confirmation before a guarantee."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Retains the supported fee waiver and acknowledges some uncertainty with provisional wording.",
          "failsOrLimitsMarkdown": "Provisional confirmation still asserts a move the unchecked capacity does not support; adequate notice is not available space."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Invites a second assessment of the text.",
          "failsOrLimitsMarkdown": "Agreement about the policy cannot verify an actual Saturday space or remove its explicit availability condition."
        }
      ],
      "closestDistractorIds": [
        "C"
      ],
      "vocabulary": [
        {
          "term": "Conditional claim",
          "definition": "A statement that holds only if a specified requirement is met."
        },
        {
          "term": "Fee waiver",
          "definition": "An exemption from a charge under the stated policy."
        },
        {
          "term": "Evidence boundary",
          "definition": "The limit of what the available observations support."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Validate output against requirements and sources, including omissions and supporting assumptions.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 5.1 Product discernment: is the result good?; rendered passage lines 511–526."
        },
        {
          "sourceIndex": 1,
          "claim": "Cross-model review can expose problems; model agreement or grades do not establish factual truth.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 13. Models checking models; rendered passage lines 832–860."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q2-v1"
      }
    },
    {
      "questionId": "Q3",
      "sourceFingerprint": "sha256:q1:b10df04f45227c9088b3aa9651e85abb0ffcf3d844e5a7755e6a97e558d3bb18",
      "hints": [
        "Distinguish the information being examined from the authority to change an operational record.",
        "Compare trust in a publisher, authenticity of a message and the approval needed for a particular action.",
        "Trace each proposal from reading the message to changing order status, noting where the required decision would occur."
      ],
      "decisiveCriteria": [
        "The assistant may compare delivery information, but the manager must authorize each order closure.",
        "No closure authorization has been given for this order.",
        "Closing the order changes the daily follow-up list; supplier wording does not replace the manager’s decision."
      ],
      "reasoningMarkdown": "A is correct under the frozen key: comparison can continue without changing status, while closure waits for this order’s manager authorization. B makes the operational change first and seeks review afterward. C substitutes approval of a general comparison method for the specified approval of each closure. D verifies the sender and publisher but never obtains the manager’s action authority. The scenario does not prove the supplier is malicious; the problem is that a message being processed cannot supply the missing authorization. This applies the course distinction between tool provenance and content trust to the case’s explicit approval gate.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Completes the permitted comparison without editing and requests the required authorization for this order before closure.",
          "failsOrLimitsMarkdown": "No failure under the case; later closure still depends on receiving the manager’s decision."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Continues the comparison and provides for a later manager review.",
          "failsOrLimitsMarkdown": "Even provisional closure removes the order from follow-up before the required approval."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Recognizes the embedded instruction and seeks approval of a method.",
          "failsOrLimitsMarkdown": "Method approval does not authorize each order closure; automated matching still crosses the stated gate."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Checks message authenticity and records a reason.",
          "failsOrLimitsMarkdown": "Neither a known supplier nor a verified plugin publisher holds the manager’s stated closure authority."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Action authorization",
          "definition": "Permission from the designated decision-maker to perform a specific change."
        },
        {
          "term": "Read-only",
          "definition": "Access that permits inspection without changing the underlying records."
        },
        {
          "term": "Prompt injection",
          "definition": "Instructions in processed content that try to redirect an assistant’s behavior."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Tool provenance and content trust are separate; content instructions require scrutiny before consequential action.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 3.3 Trusted tool, untrusted content; rendered passage lines 416–434."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q3-v1"
      }
    },
    {
      "questionId": "Q7",
      "sourceFingerprint": "sha256:q1:8dc0fe7c3cea50aaf2a7901f0c5083a4d1faa3a851bd09f1cf62550c6d71f39d",
      "hints": [
        "Separate evidence about the entries on a list from evidence about the list’s coverage.",
        "Write down which tickets were actually checked and which claims extend to tickets that were not checked.",
        "Consider what source comparison could test the assertion that nothing qualifying was left out, and distinguish uncertainty from a demonstrated mistake."
      ],
      "decisiveCriteria": [
        "All eight returned tickets were verified against the urgency rule.",
        "The other twenty-two tickets have not been examined.",
        "Correct inclusions alone neither establish completeness nor prove that an omission occurred."
      ],
      "reasoningMarkdown": "A preserves both known and unknown information. The eight inclusions are supported; a completeness claim also concerns the 30 − 8 = 22 unexamined tickets. Those need comparison with the same urgency rule. B extends evidence about the returned tickets to the unreviewed remainder. C goes too far in the opposite direction: lack of a check does not establish that an urgent ticket was missed. D supplies agreement between assistants rather than the missing source-grounded coverage check. This is a deduction about the case’s evidence, supported by the course’s general output-validation approach and its warning that model agreement is not a truth guarantee.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Keeps the verified inclusions and correctly identifies the unverified completeness claim and remaining source check.",
          "failsOrLimitsMarkdown": "No failure under the present evidence; a later review may confirm completeness or find an omission."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Acknowledges that every returned ticket qualifies.",
          "failsOrLimitsMarkdown": "Does not establish that the unexamined tickets were correctly excluded; it conflates inclusion accuracy with coverage."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Recognizes that the remaining tickets were not checked.",
          "failsOrLimitsMarkdown": "Asserts an actual omission without evidence of any qualifying ticket outside the list."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Uses a second assistant to compare selections.",
          "failsOrLimitsMarkdown": "Matching selections can share an omission and do not replace checking the remainder against the source rule."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Completeness",
          "definition": "Whether every qualifying item has been included."
        },
        {
          "term": "Inclusion accuracy",
          "definition": "Whether the items selected actually meet the selection rule."
        },
        {
          "term": "Unverified",
          "definition": "Not yet established by the required evidence; it does not necessarily mean false."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Validate output against requirements and sources, including omissions and supporting assumptions.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-fluency-crash-course — 5.1 Product discernment: is the result good?; rendered passage lines 511–526."
        },
        {
          "sourceIndex": 1,
          "claim": "Cross-model review can expose problems; model agreement or grades do not establish factual truth.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 13. Models checking models; rendered passage lines 832–860."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q7-v1"
      }
    },
    {
      "questionId": "Q8",
      "sourceFingerprint": "sha256:q1:09525cdaac97d5e71e1aa7b491c798813e82c7fb622c367abdd5be40d7dea0a2",
      "hints": [
        "Identify who contributed the judgments, the drafting and the final checks before evaluating how the work is presented.",
        "The rules have already been checked. Consider the recipient’s stated understanding as well as factual accuracy of the description.",
        "Compare the proposed notes against the actual division of work: what would each reader learn, miss or wrongly attribute?"
      ],
      "decisiveCriteria": [
        "The consultant made all judgments; AI substantially drafted paragraphs from her notes.",
        "No checked rule settles disclosure, but knowing about the drafting would change this client’s understanding.",
        "Presentation must describe the contribution truthfully while retaining the consultant’s responsibility."
      ],
      "reasoningMarkdown": "The bank chooses D because it accurately reports substantive drafting assistance and keeps judgments, verification and responsibility with the consultant. A describes real review but omits the contribution relevant to this client’s stated expectation. B acknowledges AI but invents a role in judgment that the scenario expressly assigns to the consultant. C’s generic office-software description leaves the material contribution unclear. The course provides the rule-first, recipient-understanding approach; this scenario has already supplied both the rule-check outcome and the client’s expectation. The guide makes no general claim about legal disclosure duties.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Truthfully says the consultant reviewed the judgments and claims.",
          "failsOrLimitsMarkdown": "Review is a different contribution from drafting; this note leaves the material drafting assistance undisclosed."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Mentions AI involvement and final fact-checking.",
          "failsOrLimitsMarkdown": "Misattributes some judgments to AI even though the consultant supplied them herself."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Acknowledges some tool use and emphasizes the checked final work.",
          "failsOrLimitsMarkdown": "The broad software label does not explain the substantive drafting contribution that matters to this client."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Describes AI’s drafting contribution accurately and preserves the consultant’s judgments, checks and ownership.",
          "failsOrLimitsMarkdown": "No failure under the stated facts; disclosure does not transfer responsibility away from the signer."
        }
      ],
      "closestDistractorIds": [
        "A",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Disclosure",
          "definition": "A truthful explanation of a contribution relevant to a recipient’s understanding."
        },
        {
          "term": "Accountability",
          "definition": "Responsibility for the work and its consequences."
        },
        {
          "term": "Attribution",
          "definition": "Identifying who performed a particular part of the work."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Check disclosure rules first; then consider recipient understanding while retaining authorship responsibility.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 4.2 Disclosure: use rules first, judgment second; rendered passage lines 498–509."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q8-v1"
      }
    },
    {
      "questionId": "Q9",
      "sourceFingerprint": "sha256:q1:80457c87e52e057448f6ee664a7a06261896b682c0e8168c716cbc1da5567bff",
      "hints": [
        "Identify the repeated handling, variation in results and decisions the workflow must preserve.",
        "Use the trial evidence to distinguish removable transitions from the manager’s required decision; then classify the material reused across runs.",
        "Sketch the proposed sequence and check whether it saves effort on work that still needs to exist, with the final approval in the required place."
      ],
      "decisiveCriteria": [
        "The trial permits the three drafting stages to run together without intermediate decisions.",
        "Every finished brief still requires the staffed manager fact-check and approval before circulation.",
        "The solution must reduce handoffs and repeated context while making the remaining method consistent and reusable."
      ],
      "reasoningMarkdown": "The complete keyed set is A and C. A combines the tested drafting stages while retaining the final manager gate. C then places shared background in the Project reference and the surviving drafting/formatting procedure in one Skill. A alone does not establish those reusable homes; C explicitly follows consolidation, so the pair addresses both process and configuration. B standardizes separate stages while preserving unnecessary handoffs. D changes waiting time without resolving repeated handling or layout variation. E both keeps the handoffs and replaces per-brief approval with automation and sampling. The trial and staffing are case facts; the course supports consolidating before configuring the remaining reference/procedure.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Removes the unnecessary drafting handoffs and preserves approval of each finished brief.",
          "failsOrLimitsMarkdown": "Needs C’s shared context and reusable procedure to address the remaining repeated setup and layout variation."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Could make individual stages more consistent.",
          "failsOrLimitsMarkdown": "Preserves all three handoffs and packages stages before the tested consolidation removes their separate existence."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "After consolidation, stores common background and the remaining method in their appropriate reusable homes.",
          "failsOrLimitsMarkdown": "Works with A’s consolidation and retained final gate; it is not permission to remove approval."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "May reduce model response waiting time.",
          "failsOrLimitsMarkdown": "Leaves repeated pasting, transfers and inconsistent methods unchanged."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Adds automated checking and a periodic layout review.",
          "failsOrLimitsMarkdown": "Keeps the handoffs and removes the required manager check before each brief is circulated."
        }
      ],
      "closestDistractorIds": [
        "B"
      ],
      "vocabulary": [
        {
          "term": "Handoff",
          "definition": "A transfer of work or output between stages or people."
        },
        {
          "term": "Consolidation",
          "definition": "Combining stages that do not need separate decision points."
        },
        {
          "term": "Reusable procedure",
          "definition": "A saved method that can be applied consistently to later runs."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Consolidate unnecessary stages before configuring the remaining repeated work.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 15. Find the friction before you optimize; rendered passage lines 663–688."
        },
        {
          "sourceIndex": 1,
          "claim": "References and reusable procedures belong in different shared configuration homes.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 14. Rule, reference, or procedure; rendered passage lines 632–662."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q9-v1"
      }
    },
    {
      "questionId": "Q11",
      "sourceFingerprint": "sha256:q1:6fc4f459722ac74d355a6311e16e5c1942609f3871730d2d533877acbb81a112",
      "hints": [
        "Separate the required result from the coordinator’s suggested way of finding it.",
        "Check each proposal against both the practical room constraints and the limits on what the assistant may do.",
        "Trace a shortlisted room from its supporting information to the coordinator’s later decision, marking anything the available information cannot settle."
      ],
      "decisiveCriteria": [
        "The shortlist must address capacity for twenty, accessibility, the chosen evening and a maximum $80 hire cost.",
        "The two favourite venues are suggestions, so they must not impose an unnecessary search boundary.",
        "AI can inspect public pages but cannot contact or reserve; unsupported terms or availability must remain visible."
      ],
      "reasoningMarkdown": "B and E form the full keyed set. B defines the constrained shortlist while allowing suitable public sources beyond the two suggestions. E makes the reported terms traceable and preserves missing availability for the coordinator to confirm. Together they supply a useful outcome and a way to check its evidence without expanding action authority. A still confines the search to nonmandatory favourites. C allows reservations despite the explicit prohibition. D specifies page operations instead of defining the result and its support. The course supports defining outcomes and keeping claims within inspectable sources; room requirements, authority and the need for later confirmation are established by this case.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Ranks rooms against the practical requirements.",
          "failsOrLimitsMarkdown": "Still excludes other public venues without a mandatory-source reason, retaining the arbitrary restriction."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Defines the actual room requirements and lets the assistant select relevant public pages.",
          "failsOrLimitsMarkdown": "Needs E’s traceability and visible unknowns; a requested shortlist does not by itself verify every reported term."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Seeks a ranked result and retains final coordinator review.",
          "failsOrLimitsMarkdown": "Tentative reservations are still bookings and exceed the assistant’s explicit authority."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Makes a search procedure repeatable.",
          "failsOrLimitsMarkdown": "Fixes arbitrary page actions without supplying the required outcome/evidence improvements."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Requires support for reported claims and flags information the pages do not establish for human follow-up.",
          "failsOrLimitsMarkdown": "Complements B’s outcome definition; a link alone does not establish a room meets all constraints."
        }
      ],
      "closestDistractorIds": [
        "A",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Outcome specification",
          "definition": "A description of what must exist when the job is finished."
        },
        {
          "term": "Constraint",
          "definition": "A requirement or boundary a proposed result must satisfy."
        },
        {
          "term": "Traceability",
          "definition": "The ability to connect a reported claim to its supporting evidence."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Define the desired outcome and genuine constraints instead of arbitrary search steps.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 2. Give AI the Outcome, Not the Clicks; rendered passage lines 280–300."
        },
        {
          "sourceIndex": 1,
          "claim": "Ground reported claims in inspectable source material and mark unsupported information.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course — 5. Give AI the Source; rendered passage lines 473–511."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q11-v1"
      }
    },
    {
      "questionId": "Q13",
      "sourceFingerprint": "sha256:q1:904e653664fe9c3c0ee9411238cd9d2916fbdd7770cd4bf169ceef6575ec07ad",
      "hints": [
        "Start with the resources the task must change and the conditions under which it will run.",
        "Compare where each proposal executes and processes the data with the shop’s explicit custody requirement.",
        "Trace access to both resources for each surface, including any copying, manual work or migration the proposal introduces."
      ],
      "decisiveCriteria": [
        "Both the approved job folder and installed spreadsheet exist only on the local computer.",
        "Job data and execution must remain there; staff can supervise with the computer on.",
        "An approved agent already reaches both resources; the task is surface selection, not storage or toolchain redesign."
      ],
      "reasoningMarkdown": "C is keyed because the approved local desktop agent can perform the requested changes where both resources reside, within the stated access limits and supervision. A uploads data and moves execution outside the required computer. B can provide advice but leaves the requested renaming and spreadsheet operations to staff. D introduces a repository and coding workflow that the task does not need. The course supports routing by resources, execution dependencies and custody; the agent’s approval and local execution are stipulated here. The label desktop alone is not proof that any real product processes data locally.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Gives an agent copies of both resources and a way to return output.",
          "failsOrLimitsMarkdown": "Uploading and cloud execution violate the case’s local custody and execution constraint."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Can offer instructions without needing direct local access.",
          "failsOrLimitsMarkdown": "Does not execute the requested task; staff must manually perform every change."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses the approved surface with access to both local resources and supervision on the required computer.",
          "failsOrLimitsMarkdown": "No failure under the case assumptions; this does not certify that every desktop-branded agent has local processing."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Could support scripted changes and software tests.",
          "failsOrLimitsMarkdown": "Adds a repository/toolchain migration to a task whose system of work is local files and an installed application."
        }
      ],
      "closestDistractorIds": [
        "B",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Execution surface",
          "definition": "The environment in which an agent actually performs its work."
        },
        {
          "term": "Data custody",
          "definition": "Where data may be held and processed under the task’s rules."
        },
        {
          "term": "Local dependency",
          "definition": "A resource or capability that requires access to a particular computer."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Choose execution by resources, device dependency and processing custody, not interface labels alone.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/general-agents-web-crash-course — 10. Web, desktop, or terminal: pick by what the work touches; rendered passage lines 716–746."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q13-v1"
      }
    },
    {
      "questionId": "Q14",
      "sourceFingerprint": "sha256:q1:dc1d57fbdd92b900ad7cc02cc38cde24312fa4637aca748f1e537f36d7d2883d",
      "hints": [
        "Consider what the analysis needs to retain and what could still identify a respondent.",
        "Evaluate combinations of the remaining fields, including what somebody could link from outside the survey.",
        "For each preparation, ask how it would demonstrate the required anonymity while preserving enough information for the stated analysis."
      ],
      "decisiveCriteria": [
        "Exact shifts, sites and rare titles can be linked to public schedules despite removal of direct identifiers.",
        "The analysis needs broad travel patterns, not individual identities.",
        "The external route requires the resulting data to meet the company’s anonymity standard before upload."
      ],
      "reasoningMarkdown": "A is correct: broaden the role, site and time information as far as the pattern analysis permits, then assess the actual result against the company’s standard. It does not declare that grouping automatically makes data anonymous. B changes labels while leaving the linkable combinations intact. C and D each remove one clue and assume the remaining combination is safe without assessment. The case supplies the external-route gate and public linkage; the course supports checking residual identification risk while preserving task utility. This guide specifies no universal anonymity threshold and does not authorize a real upload.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Reduces unnecessary identifying detail while preserving broad patterns and requires assessment of the result.",
          "failsOrLimitsMarkdown": "No failure under the case; upload still depends on the assessment finding that the standard is met."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Removes a direct lookup key and retains detailed analytical data.",
          "failsOrLimitsMarkdown": "Random labels do not stop identification through the retained shifts, sites and rare roles."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Reduces time precision.",
          "failsOrLimitsMarkdown": "Site and rare-role combinations may remain identifying; removing one field is not evidence of compliance with the standard."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Removes rare titles.",
          "failsOrLimitsMarkdown": "Exact shifts and sites can remain linkable through public schedules, even though neither field is a name."
        }
      ],
      "closestDistractorIds": [
        "C",
        "D"
      ],
      "vocabulary": [
        {
          "term": "Indirect identifier",
          "definition": "A detail that can identify someone when combined with other information."
        },
        {
          "term": "Aggregation",
          "definition": "Combining detailed observations into broader groups."
        },
        {
          "term": "Anonymity assessment",
          "definition": "Checking whether the resulting information satisfies the applicable standard for not identifying individuals."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Residual combinations can identify people; preserve utility and assess anonymity under the organization’s standard.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 2.3 Redaction is useful, but it is not magic; rendered passage lines 307–313."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q14-v1"
      }
    },
    {
      "questionId": "Q15",
      "sourceFingerprint": "sha256:q1:1f4a5ca7ddef71c4084e23a90add58f7d4bd3a29df3eef65182729d0e13335e2",
      "hints": [
        "Classify what is being saved: an ongoing rule, reference information or a repeatable method.",
        "Identify who must receive the restriction automatically and which unrelated work must remain outside its scope.",
        "Imagine a covering writer beginning a fresh conversation: compare which proposed home would supply the rule at the intended scope."
      ],
      "decisiveCriteria": [
        "British spelling and the price restriction are standing rules for this client only.",
        "All assigned and covering writers use the same client Project.",
        "The rules must be shared and automatic without altering the cross-client writing procedure."
      ],
      "reasoningMarkdown": "D is the keyed answer: client Project instructions provide the shared, client-scoped home while references and the reusable cross-client method retain their existing roles. A applies the restrictions globally for each writer and therefore affects unrelated clients. B embeds client-specific restrictions in a method used across clients. C leaves them in one writer’s conversation rather than the shared automatic context. The course distinguishes Project context, global instructions and reusable Skills; applying that distinction here depends on the case’s explicit shared Project and client-only scope. Saving rules does not guarantee that future outputs need no checking.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Makes instructions available automatically to an individual writer.",
          "failsOrLimitsMarkdown": "Applies beyond this client and requires per-writer configuration rather than the shared client home."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Makes restrictions available when the reusable writing method runs.",
          "failsOrLimitsMarkdown": "Spreads this client’s rules into a method used for other clients, contrary to the required scope."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Retains a written note in the original conversation.",
          "failsOrLimitsMarkdown": "Does not establish a shared automatic instruction for covering staff in new conversations."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Places the client-only standing rules in the shared context already used by every assigned writer.",
          "failsOrLimitsMarkdown": "No failure under the case; configuration improves availability of the rules but does not eliminate output review."
        }
      ],
      "closestDistractorIds": [
        "B",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Standing rule",
          "definition": "An instruction intended to apply across repeated work within its stated scope."
        },
        {
          "term": "Scope",
          "definition": "The people, tasks or workspace to which a rule applies."
        },
        {
          "term": "Shared configuration",
          "definition": "Readable saved settings available to the people who need the same behavior."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Project context, global preferences and reusable procedures have distinct scopes.",
          "evidenceLocator": "AI original-course check, 2026-10-18; independent human verification pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 4. Skills vs Connectors vs Projects vs Custom Instructions; rendered passage lines 233–245."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp7-intermediate-q15-v1"
      }
    }
  ]
}
```
