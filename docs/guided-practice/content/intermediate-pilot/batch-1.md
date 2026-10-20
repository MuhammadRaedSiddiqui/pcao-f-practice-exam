# Intermediate pilot — batch 1 of 2

AI-authored candidates, 2026-10-17. Human review and owner approval are pending for every item. Feedback below contains answers: first solve [questions-only.md](questions-only.md). This fenced JSON is an authoring artifact, not a runtime release. See the [review ledger](CONTENT-REVIEW-LEDGER.md) for required sign-offs and the [source ledger](SOURCE-VERIFICATION-LEDGER.md) for missing evidence.

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
  "plannedGuideVersion": "1.0.0",
  "contentStatus": "draft",
  "questions": [
    {
      "questionId": "Q4",
      "sourceFingerprint": "sha256:q1:9a83ec0a394581b92434e2585ca83c5f31c5e5daa8286834040fb6cfaa0306a1",
      "hints": [
        "Separate what the leaflet must communicate from how the organiser wants to develop it.",
        "Consider which reader facts are missing, then trace the order of work requested by each proposal.",
        "At what point would the organiser first be able to influence the structure, and what would already have been written?"
      ],
      "decisiveCriteria": [
        "The brief must fit beginner working adults, evening classes, practical outcomes and plain language.",
        "Alternative structures must be available for organiser feedback before any full leaflet is written.",
        "The two selected changes must jointly address both content direction and the requested decision process."
      ],
      "reasoningMarkdown": "A supplies the missing audience and course context; D adds brief alternatives followed by an organiser decision before expansion. Together they meet both needs. B provides alternatives but has already written complete leaflets. C lets AI choose and expand before human direction. E controls length and polish without supplying the missing context or staged choice. The strongest competing ideas are B and C: each offers alternatives, but neither preserves the requested stopping point.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Provides reader level, timetable, useful outcomes and accessible wording.",
          "failsOrLimitsMarkdown": "Does not itself establish the pause before full drafting; it works with D rather than replacing that process requirement."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Offers different structures with concrete writing examples.",
          "failsOrLimitsMarkdown": "The complete leaflets arrive before the organiser can give the required structure feedback."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Compares alternatives against aims and explains a choice.",
          "failsOrLimitsMarkdown": "Automatic expansion gives the decision to AI and bypasses the organiser’s required feedback before drafting."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Keeps alternatives brief and pauses for organiser direction before finished text.",
          "failsOrLimitsMarkdown": "Does not supply all missing audience details by itself; A supplies the complementary context."
        },
        {
          "optionId": "E",
          "satisfiesMarkdown": "Adds potentially useful length, grammar and tone controls.",
          "failsOrLimitsMarkdown": "Produces a polished leaflet without filling the audience-context and structure-feedback gaps."
        }
      ],
      "closestDistractorIds": [
        "B",
        "C"
      ],
      "vocabulary": [
        {
          "term": "Task context",
          "definition": "Facts that shape a useful response for this specific reader and situation."
        },
        {
          "term": "Decision point",
          "definition": "A planned stop at which a person chooses the direction of subsequent work."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Develop alternatives, receive human feedback, and only then expand a chosen direction.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 7. The brainstorm-iterate loop"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q4-v1"
      }
    },
    {
      "questionId": "Q5",
      "sourceFingerprint": "sha256:q1:ce4cbf6d597d22c22b9fda28adc28c97562edfda5acdbb9618215b402596693e",
      "hints": [
        "Which condition decides whether a configuration qualifies, and which condition ranks the qualifiers?",
        "Keep results before repair separate from results that a different repair workflow might eventually produce.",
        "Make a shortlist using the qualifying condition, then compare one complete trial on the same cost basis."
      ],
      "decisiveCriteria": [
        "Eight of eight results must be correct before manual repair.",
        "Among qualifying configurations, choose the lowest complete-trial cost.",
        "Identical inputs and approved access support this comparison; future performance still needs review."
      ],
      "reasoningMarkdown": "S, T and U each achieve 8/8 before repair. Their trial costs are $0.90, $2.00 and $1.20 respectively, so S is the lowest-cost qualifier and D is the initial choice. R’s lower price cannot compensate for 6/8 under this rule. U is cheaper than T but not cheaper than every qualifier. T’s extra price is not evidence of better future results. These observations justify a monitored initial choice, not a guarantee.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "T meets the observed 8/8 quality threshold.",
          "failsOrLimitsMarkdown": "Its $2.00 trial costs more than both other qualifiers; speculative future insurance does not satisfy lowest tested cost."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "R has the lowest listed trial cost and acknowledges continued checking.",
          "failsOrLimitsMarkdown": "Its 6/8 before repair fails the threshold. Adding manual repair changes the workflow and has no established full cost here."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "U qualifies and is cheaper than T; future review is sensible.",
          "failsOrLimitsMarkdown": "At $1.20 it still costs more than S at $0.90, so the comparison stops too early."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "S qualifies at the minimum qualifying cost and keeps subsequent review.",
          "failsOrLimitsMarkdown": "The trial supports an initial choice only; it cannot establish reliability on all future reports."
        }
      ],
      "closestDistractorIds": [
        "C"
      ],
      "vocabulary": [
        {
          "term": "Quality threshold",
          "definition": "A minimum result that must be met before other preferences can decide."
        },
        {
          "term": "Matched trial",
          "definition": "A comparison using equivalent tasks and inputs so the observed results address the same job."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Use task-specific comparisons when choosing models; general rankings are insufficient.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/ai-prompting-2026 — 12. Cost, speed, and which model to use when"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q5-v1"
      }
    },
    {
      "questionId": "Q6",
      "sourceFingerprint": "sha256:q1:6bf7156dbe9af2e8cb7a28d191bca1bb77eb754172ee78246e97eadf83a1fa45",
      "hints": [
        "Distinguish information that has changed from the steps and layout that have stayed the same.",
        "Check both where information is available for current drafting and where it is retained for later inspection.",
        "Trace the scope of every proposed copy: which tasks could see it, and how would competing prices be avoided?"
      ],
      "decisiveCriteria": [
        "Version 3 replaces version 2 for new prices; exactly one active price reference is allowed.",
        "Version 2 must remain available for archive checks.",
        "Stable drafting steps remain reusable without embedding another copy of changing prices.",
        "Ticket facts must not become standing instructions for unrelated Projects."
      ],
      "reasoningMarkdown": "B meets the active-reference and archive requirements together while leaving the stable Skill alone. A keeps both price guides active, even with a preference instruction. C leaves old Project knowledge active and inserts changing facts into the procedure. D spreads ticket prices into staff’s global instructions, affecting other work. Workflow section 14 supports references in Project knowledge and procedures in Skills. AI verification is complete; independent human verification is pending.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Preserves both versions and avoids changing the stable Skill.",
          "failsOrLimitsMarkdown": "A preference instruction still leaves two active price references, contrary to the explicit one-reference requirement."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Uses current facts for drafting, retains the superseded guide separately and keeps the reusable procedure unchanged.",
          "failsOrLimitsMarkdown": "Requires the archive to stay outside the active drafting reference; mere retention in the same active set would not meet the stem."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Makes newer prices available alongside the drafting procedure.",
          "failsOrLimitsMarkdown": "Keeps obsolete active Project knowledge and creates a price copy in the Skill, mixing changing facts with stable steps."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Removes the old active guide and preserves the Skill layout.",
          "failsOrLimitsMarkdown": "Global custom instructions apply beyond this Project and are the wrong scope for its changing ticket reference."
        }
      ],
      "closestDistractorIds": [
        "A"
      ],
      "vocabulary": [
        {
          "term": "Active reference",
          "definition": "Material currently supplied as authoritative input for new work."
        },
        {
          "term": "Archive",
          "definition": "Retained historical material separated from the current drafting inputs."
        },
        {
          "term": "Project",
          "definition": "A workspace supplying its own standing context and reference files."
        },
        {
          "term": "Skill",
          "definition": "A reusable procedure loaded for a relevant task."
        },
        {
          "term": "Global custom instructions",
          "definition": "Standing preferences applied beyond one Project, making them unsuitable for this ticket-price reference."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Section 14 places references in Project knowledge, procedures in Skills, and rules in standing instructions.",
          "evidenceLocator": "AI source verification completed, 2026-10-17; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 14. Rule, reference, or procedure (original passage inspected through course-site navigation; rendered lines 632–662)."
        },
        {
          "sourceIndex": 1,
          "claim": "Projects hold standing references; Skills hold reusable procedures; custom instructions have broader scope.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/skills-connectors-crash-course — 4. Skills vs Connectors vs Projects vs Custom Instructions"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q6-v1"
      }
    },
    {
      "questionId": "Q10",
      "sourceFingerprint": "sha256:q1:9409e7944553ad094d080a397daff595a9ddc361d09c138d206cd4c8724663c0",
      "hints": [
        "List what is already established about the notes, the chat and the missing part of the response.",
        "Which possible causes would each proposed check actually distinguish, given those established facts?",
        "Compare the effort of the checks with the uncertainty each one could remove before changing more of the workflow."
      ],
      "decisiveCriteria": [
        "The short fresh chat already contains complete tasks and named owners.",
        "The needed action-and-owner list is absent from the literal prompt and from the response.",
        "No calculation is involved; choose the first useful check before costlier changes."
      ],
      "reasoningMarkdown": "C directly tests whether the missing output requirement explains the omission: make that requirement explicit, then compare the result with the complete notes. A revisits a context concern despite an already fresh short chat. D repeats an input step despite complete notes being present. B may help later if an explicit instruction still fails, but it changes a costlier variable before this available check. Workflow section 12 puts prompt completeness first, before costlier diagnostic steps. AI verification is complete; independent human verification is pending.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "A fresh run can sometimes test context interference.",
          "failsOrLimitsMarkdown": "The current chat is already fresh and short; unchanged wording does not test the specific missing requirement first."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "A stronger model could help if capability were established as the limiting factor.",
          "failsOrLimitsMarkdown": "Capability has not been isolated; the cheaper explicit-output check has not been tried."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Tests the missing instruction directly and checks recovered tasks and owners against the notes.",
          "failsOrLimitsMarkdown": "The revised answer still needs factual checking; explicit wording alone does not guarantee a complete or accurate handover."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Reuploading can be useful when inputs are absent or incomplete.",
          "failsOrLimitsMarkdown": "The stem already establishes complete input; the unchanged prompt leaves the known instruction gap untested."
        }
      ],
      "closestDistractorIds": [
        "B"
      ],
      "vocabulary": [
        {
          "term": "Discriminating check",
          "definition": "A check that helps distinguish plausible causes of the observed failure."
        },
        {
          "term": "Output requirement",
          "definition": "An explicit statement of what the response must contain."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Section 12 checks prompt completeness before session length, model/features, configuration and task fit.",
          "evidenceLocator": "AI source verification completed, 2026-10-17; independent human verification pending. https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course — 12. The sequence runs cheapest first (original passage inspected through course-site navigation; rendered lines 572–600)."
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q10-v1"
      }
    },
    {
      "questionId": "Q12",
      "sourceFingerprint": "sha256:q1:83e2e0474692c99cc4f732bd0c39ebd9439708784d657c4a8d33ec5a125b0e13",
      "hints": [
        "What does the passing sample establish, and what remains contradicted by the full-run counts?",
        "Separate evidence of a missing record from possible explanations for its removal.",
        "Look for a check that connects the observed discrepancy to a particular decision the script made."
      ],
      "decisiveCriteria": [
        "Every registration must appear exactly once, including blank phone fields; duplicate IDs are absent.",
        "The full run loses one of 36 registrations despite reporting zero execution errors.",
        "The missing registration and its removal rule are unknown; sample agreement alone cannot explain the loss."
      ],
      "reasoningMarkdown": "D identifies which input ID is absent from the output, then asks for the removal rule in plain language so it can be compared with the approved rule. A and C only revisit a sample that already passes. B is a potentially useful validation technique, but an unspecified planted error does not diagnose this actual missing valid registration. Blank phone handling is a hypothesis to investigate, not an established cause. After a fix, reconcile the full ID sets and rerun the known-answer checks.",
      "optionComparisons": [
        {
          "optionId": "A",
          "satisfiesMarkdown": "Confirms names and ordering on a hand-checked sample.",
          "failsOrLimitsMarkdown": "Repeating a passing sample does not locate or explain the full-run missing registration."
        },
        {
          "optionId": "B",
          "satisfiesMarkdown": "Tests whether a deliberately faulty example is detected.",
          "failsOrLimitsMarkdown": "The planted error is unspecified and does not connect to the actual lost valid record; this cannot justify accepting the current full output."
        },
        {
          "optionId": "C",
          "satisfiesMarkdown": "Adds another implementation’s sample comparison.",
          "failsOrLimitsMarkdown": "Agreement on limited sample behavior leaves the violated full-run retention rule unresolved."
        },
        {
          "optionId": "D",
          "satisfiesMarkdown": "Locates the lost ID and tests its removal rule against retention requirements.",
          "failsOrLimitsMarkdown": "The explanation must be checked against actual records; neither zero runtime errors nor an assistant’s narrative proves correctness."
        }
      ],
      "closestDistractorIds": [
        "B"
      ],
      "vocabulary": [
        {
          "term": "Invariant",
          "definition": "A rule that must remain true across the whole transformation, such as preserving every registration once."
        },
        {
          "term": "Reconciliation",
          "definition": "Comparing corresponding input and output records to account for every inclusion or omission."
        }
      ],
      "sourceChecks": [
        {
          "sourceIndex": 0,
          "claim": "Check real input/output counts and missing rows, and request a plain-language replay of transformation logic.",
          "evidenceLocator": "AI source check, 2026-10-17; human check pending. https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course — 6. Verifying work you cannot read"
        }
      ],
      "approval": {
        "status": "draft",
        "reviewId": "gp2-intermediate-q12-v1"
      }
    }
  ]
}
```
