# Intermediate pilot — batch 2 of 2

AI-authored candidates, 2026-10-17. Human review and owner approval are pending for every item. Feedback below contains answers: first solve [questions-only.md](questions-only.md). This fenced JSON is an authoring artifact, not a runtime release. See the [review ledger](CONTENT-REVIEW-LEDGER.md) for required sign-offs and the [source ledger](SOURCE-VERIFICATION-LEDGER.md) for missing evidence.

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
  "plannedGuideVersion": "1.0.0",
  "contentStatus": "draft",
  "questions": [
    {
      "questionId": "Q18",
      "sourceFingerprint": "sha256:q1:7c8aa2c80923840442570680195933c5f185099ba20071a8980e3d6d28c8fcff",
      "hints": [
        "Identify the stated calculation and which displayed figures depend on it.",
        "Recalculate each period using its own row; keep refunds attached to the period that supplied them.",
        "After correcting a figure, what other reported values might need a consistency check, and how could you verify them independently?"
      ],
      "decisiveCriteria": [
        "For each month, net receipts equal receipts minus that month’s refunds; no other adjustments are allowed.",
        "Correct both any wrong monthly figure and the total that depends on it.",
        "The corrected period sum must equal total receipts minus total refunds."
      ],
      "reasoningMarkdown": "April is 420−20=400, May is 360−40=320 and June is 300−0=300. Therefore the quarter is 400+320+300=1,020. Independently, receipts total 1,080 and refunds total 60; 1,080−60=1,020. B repairs May and D repairs the dependent total. A leaves a wrong month and introduces a wrong total; C moves April’s refunds into May; E invents an adjustment the stem excludes. The original course supports checking analysis, while these amounts come from the question’s source rows.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Recognizes that the quarter total needs attention.",
          "failsOrLimitsMarkdown": "1,000 is not supported, and retaining the displayed months leaves their sum at 1,040."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Correctly recalculates May as 360−40=320.",
          "failsOrLimitsMarkdown": "Does not by itself fix the quarter total; the two-response task also needs D."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Uses refund figures that appear in the source.",
          "failsOrLimitsMarkdown": "Assigning both months’ refunds to May changes their period allocation and yields the wrong May amount."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Corrects the total to 1,020 and supplies an independent source-total cross-check.",
          "failsOrLimitsMarkdown": "Depends on corrected component figures; it complements B rather than excusing the wrong May display."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Attempts to explain why the reported total differs.",
          "failsOrLimitsMarkdown": "The proposed timing adjustment is invented and forbidden by the no-other-adjustments condition."
        }
      ],
      "closestDistractorIds": [
        "A",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Net receipts",
          "definition": "Receipts after subtracting refunds under the rule given here."
        },
        {
          "term": "Cross-check",
          "definition": "A second calculation path used to detect an error in the first."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Check data-analysis inputs and totals rather than trusting a plausible generated result.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 10. Data analysis (the model writes and runs code)"
        },
        {
          "sourceIndex": 1,
          "claim": "Use known-answer arithmetic and reality checks to validate transformations.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 6. Verifying work you cannot read"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q18-v1"
      }
    },
    {
      "questionId": "Q25",
      "sourceFingerprint": "sha256:q1:60acadbaed616dcac911d547fb14ff6f62f84f23ee5c729fa2c908f896aa4e1e",
      "hints": [
        "What has the team checked about the shortlist, and what part of the decision process is still unexamined?",
        "Distinguish evidence that selected people qualify from evidence that every exclusion is justified.",
        "Consider whether a proposed review tests decisions under the existing rules or introduces a different allocation rule."
      ],
      "decisiveCriteria": [
        "Both application routes are permitted and the same availability/experience criteria apply.",
        "Selected applicants qualify, but no excluded applications have been checked.",
        "The route pattern warrants investigation; it is not itself proof of unfair treatment or authorization for quotas."
      ],
      "reasoningMarkdown": "A reviews the decisions that could be hidden by looking only at successful applicants: exclusions from both routes alongside selected cases, all under the same criteria. B can reproduce the same blind spot even if the assistants agree. D can show that selected applicants are suitable while missing qualified excluded applicants. C changes allocation before investigating or obtaining authorization for a different rule. The counts flag a question to investigate; they cannot establish the cause of the pattern.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Checks exclusions and inclusions across both routes against unchanged rules.",
          "failsOrLimitsMarkdown": "Findings still require case evidence; the observed route difference alone cannot establish unfairness."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Provides a second shortlist for comparison.",
          "failsOrLimitsMarkdown": "Shared instructions or assumptions may repeat unsupported exclusions; agreement does not inspect their justification."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Responds to the lack of telephone applicants on the shortlist.",
          "failsOrLimitsMarkdown": "Imposes a proportional allocation before establishing causes or approval for changing criteria."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Rechecks selected suitability and compares experience averages.",
          "failsOrLimitsMarkdown": "Selected-case quality and averages can conceal unsupported exclusions and do not explain the telephone decisions."
        }
      ],
      "closestDistractorIds": [
        "D",
        "B"
      ],
      "vocabulary": [
        {
          "term": "Exclusion review",
          "definition": "Inspection of decisions that removed candidates, including whether each removal follows the agreed rules."
        },
        {
          "term": "Pattern versus cause",
          "definition": "A numerical difference can prompt investigation without proving why it occurred."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Inspect exclusions as well as selected cases when reviewing potentially uneven outcomes.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 4.1 Look at who was excluded"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q25-v1"
      }
    },
    {
      "questionId": "Q26",
      "sourceFingerprint": "sha256:q1:f63805bcb80dfbafac7d4dbf2b52f95ea8c9acfdfd5b0a2a90ec38a650d92298",
      "hints": [
        "Read the coordinator’s action separately for each contribution rather than judging the plan as a whole.",
        "Compare what AI originally supplied with what survives in the coordinator’s final plan.",
        "Does a stated reason describe a change to a proposal, or only explain the decision made about it?"
      ],
      "decisiveCriteria": [
        "The visitor pack changes from twelve pages to two while retaining its purpose.",
        "The luggage desk is an explicitly new idea kept for train arrivals; no change to the desk proposal is stated.",
        "The access check was absent from AI’s plan and was added by the coordinator.",
        "Each label must describe the action actually taken and its stated reason, not approval of the whole plan."
      ],
      "reasoningMarkdown": "A records a modification: twelve pages become two for quick reading. C records a surfaced idea: the coordinator keeps a new luggage desk because train arrivals make it useful. D records a missed requirement: she supplies the absent step-free entrance check. B wrongly calls the changed pack unchanged acceptance. E mistakes a reason for keeping the desk for evidence that the proposal itself changed. The three correct entries cover three distinct contributions; a positive reaction to the whole plan would not record those decisions.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Records the actual reduction in length and the quick-reading reason.",
          "failsOrLimitsMarkdown": "This concerns the pack modification only; it does not describe what happened to the desk or access check."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Retains the pack’s general purpose.",
          "failsOrLimitsMarkdown": "ACCEPT without changes contradicts the stated reduction from twelve pages to two."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Records a new kept idea and the train-arrival reason.",
          "failsOrLimitsMarkdown": "No desk modification is supplied by the stem; the receipt should not invent one."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Records the omitted requirement added by the human and its step-free-access reason.",
          "failsOrLimitsMarkdown": "Describes a missing check, not proof that access has already been confirmed."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Recognizes that the coordinator supplied a reason concerning train arrivals.",
          "failsOrLimitsMarkdown": "A reason for retention is not a change to the desk; MODIFY is unsupported."
        }
      ],
      "closestDistractorIds": [
        "E"
      ],
      "vocabulary": [
        {
          "term": "Reasoning receipt",
          "definition": "A record of a person’s decision about each AI contribution together with the reason."
        },
        {
          "term": "ACCEPT",
          "definition": "Retain a contribution without changing it."
        },
        {
          "term": "REJECT",
          "definition": "Remove a contribution from the final work."
        },
        {
          "term": "MODIFY",
          "definition": "Change a contribution’s content or form; a reason for retention alone is not a modification."
        },
        {
          "term": "SURFACED",
          "definition": "Record a new idea supplied by AI that the person decides to keep."
        },
        {
          "term": "MISSED",
          "definition": "Record a requirement omitted by AI and added by the person."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Record each contribution’s decision and reason, distinguishing changed work, new kept ideas and omissions.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/how-to-think-ai-era — Discipline 2: The Reasoning Receipt"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q26-v1"
      }
    },
    {
      "questionId": "Q33",
      "sourceFingerprint": "sha256:q1:8ecba5c6203302ec120128e096ba85b94798d01d08a1b9335debfd20c7c5e521",
      "hints": [
        "Define the unit being measured: what work must finish before a brief is usable?",
        "For each method, include every staff-time stage inside that measurement boundary.",
        "Compare the completed-work totals, then consider how many observations support a claim that the difference will persist."
      ],
      "decisiveCriteria": [
        "Total staff time includes drafting and checking, including corrections and final-file preparation.",
        "Both finished briefs meet the same quality standard; tool charges are equal and negligible.",
        "There is one parallel trial, so repeatability has not been established."
      ],
      "reasoningMarkdown": "Existing completion takes 18+12=30 minutes. AI-assisted completion takes 4+23=27 minutes, saving three minutes overall. Drafting alone saves fourteen minutes, but checking grows by eleven, leaving three net. A states that observed benefit and calls for more matched-quality cycles. B excludes necessary checking, C judges checking alone, and D compares an old total with only the new drafting stage. Workflow section 16 supports baselines, whole-workflow human costs and repeated parallel comparisons. AI verification is complete; independent human verification is pending.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Compares 30 with 27 minutes and calls for further equal-quality trials.",
          "failsOrLimitsMarkdown": "One cycle cannot establish sustained savings or justify a general performance guarantee."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Correctly identifies fourteen fewer drafting minutes.",
          "failsOrLimitsMarkdown": "Checking is required to obtain a usable brief and cannot be moved outside the stated total-time objective."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Correctly observes eleven more checking minutes.",
          "failsOrLimitsMarkdown": "That stage increase is outweighed by the drafting reduction; the full method is three minutes faster in this trial."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Uses the old thirty-minute total as a starting point.",
          "failsOrLimitsMarkdown": "Subtracts only new drafting time and omits twenty-three necessary checking minutes, overstating the saving."
        }
      ],
      "closestDistractorIds": [
        "B"
      ],
      "vocabulary": [
        {
          "term": "Measurement boundary",
          "definition": "The stages counted when comparing the same completed outcome."
        },
        {
          "term": "Parallel trial",
          "definition": "Comparison of methods on equivalent work while keeping the quality standard consistent."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Section 16 uses baseline measurement, includes human work in costs and compares parallel cycles.",
          "evidenceLocator": "AI source verification completed, 2026-10-17; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 16. Measure the thing you actually care about (original passage inspected through course-site navigation; rendered lines 689–711)."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q33-v1"
      }
    },
    {
      "questionId": "Q59",
      "sourceFingerprint": "sha256:q1:9960556ebecbff7485993dfb158e9bd712cf77eee6ba9f158f0d8513a816c5ca",
      "hints": [
        "List the conditions under which the current workflow was approved.",
        "Write a brief before-and-after description of each proposal. Which facts about the approved workflow have actually changed?",
        "Compare the proposal with the approved baseline, and keep the need for a new review separate from its eventual outcome."
      ],
      "decisiveCriteria": [
        "Approval covers public FAQs, one model family, internal drafts, team-folder storage and supervisor review, with no sending.",
        "Changes to data, capability, model, audience or consequences require a governance re-check before use.",
        "A different date or heading style alone is not a stated trigger when all material conditions remain unchanged.",
        "Re-check means evaluate the proposed change; it does not mean automatically reject it."
      ],
      "reasoningMarkdown": "A crosses the internal-draft boundary by enabling messages to customers. D introduces named employee complaint data beyond the public FAQ inputs. E changes model family. Each changes a stated review-trigger dimension, even if layout stays familiar. B explicitly preserves the approved material conditions; C explicitly changes only heading style while preserving those conditions. The required set is A, D and E. Review may approve or reject a change after evaluation; none is automatically banned by this question.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Describes a concrete new capability and customer audience.",
          "failsOrLimitsMarkdown": "Those changes require review; retaining the answer layout does not carry forward approval for external sending."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Explicitly retains the same inputs, model, permissions, purpose, destination and review.",
          "failsOrLimitsMarkdown": "A new date by itself does not meet a stated change trigger; this assumes the confirmation that nothing material changed is true."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Limits the change to heading style and explicitly preserves material conditions.",
          "failsOrLimitsMarkdown": "No stated trigger changes in this proposal; this conclusion would differ if audience, content or capability also changed."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Identifies a new source with named employee information.",
          "failsOrLimitsMarkdown": "The public-data approval does not cover the new data type and sensitivity; unchanged output format does not remove the review requirement."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Explicitly changes the model family.",
          "failsOrLimitsMarkdown": "That is itself a stated review trigger even with the same sources and output layout."
        }
      ],
      "closestDistractorIds": [
        "C"
      ],
      "vocabulary": [
        {
          "term": "Approval scope",
          "definition": "The conditions and permitted operations covered by a particular approval."
        },
        {
          "term": "Review trigger",
          "definition": "A change that requires reassessment before the revised workflow is used."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Reassess approval when material workflow conditions change, including model, data, audience or action scope.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course — 8.5 Re-check when the workflow changes"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q59-v1"
      }
    }
  ]
}
```
