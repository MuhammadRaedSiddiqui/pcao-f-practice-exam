# Phase 7 — remaining Intermediate question inventory

2026-10-18 (Asia/Karachi). Generated from the validated real bank, preserving its positions and ordering. SHA-256 verified: `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`.

Exactly 50 unique remaining IDs; no overlap with the ten accepted pilot records. Full-bank domain totals remain 8/13/7/10/7/9/6; selection totals 48/10/2. Remaining totals are 7/10/6/9/6/7/5 by D1–D7 and 42/8/0 by selections 1/2/3. Both triple-response items are already in the pilot.

| Batch | Exact IDs in bank order | D1/D2/D3/D4/D5/D6/D7 | Select 1/2/3 | Embedded tables | Inspected/reference count |
| --- | --- | --- | --- | --- | --- |
| 1 | Q1, Q2, Q3, Q7, Q8, Q9, Q11, Q13, Q14, Q15 | 1/2/1/2/1/3/0 | 8/2/0 | None | 14/14 |
| 2 | Q16, Q17, Q19, Q20, Q21, Q22, Q23, Q24, Q27, Q28 | 2/1/1/3/1/1/1 | 9/1/0 | Q21 | 2/10 |
| 3 | Q29, Q30, Q31, Q32, Q34, Q35, Q36, Q37, Q38, Q39 | 1/3/2/0/1/1/2 | 8/2/0 | Q30, Q31 | 0/12 |
| 4 | Q40, Q41, Q42, Q43, Q44, Q45, Q46, Q47, Q48, Q49 | 1/2/1/2/2/1/1 | 9/1/0 | Q41 | 1/12 |
| 5 | Q50, Q51, Q52, Q53, Q54, Q55, Q56, Q57, Q58, Q60 | 2/2/1/2/1/1/1 | 8/2/0 | Q52, Q53, Q58 | 1/10 |

The JSON is the authoritative 50-row inventory, including exact keys (answer-bearing), source indices, q1, original positions, scenarios and formats. `source-pending` is not verified merely because its page was accessible. An inspected shared passage does not approve a later question’s teaching claims. Draft status here records initialization; current authoring/review status is in [content ledger](PHASE-7-CONTENT-LEDGER.md). No new guides are generated for Batches 2–5.

```json
{
  "authoringFormatVersion": 1,
  "date": "2026-10-18",
  "bankSha256": "f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4",
  "source": {
    "schemaVersion": 1,
    "examId": "pcao-f-practice-easy-01",
    "bankVersion": "1.0.0",
    "difficulty": "intermediate"
  },
  "pilotIds": [
    "Q4",
    "Q5",
    "Q6",
    "Q10",
    "Q12",
    "Q18",
    "Q25",
    "Q26",
    "Q33",
    "Q59"
  ],
  "totals": {
    "bank": 60,
    "acceptedPilot": 10,
    "remaining": 50,
    "domainCounts": {
      "D1": 7,
      "D2": 10,
      "D3": 6,
      "D4": 9,
      "D5": 6,
      "D6": 7,
      "D7": 5
    },
    "selectionCounts": {
      "1": 42,
      "2": 8,
      "3": 0
    }
  },
  "records": [
    {
      "questionId": "Q1",
      "bankPosition": 1,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A travel agent built an AI-assisted booking tool for her own draft itineraries.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/0/correctOptionIds",
      "sourceFingerprint": "sha256:q1:f25b1ec381d805bcfc5b56297c79591ddac893028272c10c56f766474a4ec266",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "10. When it has outgrown prompt-and-iterate",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q2",
      "bankPosition": 2,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A recreation centre asks AI to draft a reply about moving a booking.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/1/correctOptionIds",
      "sourceFingerprint": "sha256:q1:c6d266decaca343dd2f9adb3c02da7ebdc66ea8a667dbb4a37dabbf528eace3f",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "5.1 Product discernment: is the result good?",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        },
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "13. Models checking models",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 1,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q3",
      "bankPosition": 3,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "An operations assistant uses an approved plugin from a verified publisher to compare supplier messages with open orders.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/2/correctOptionIds",
      "sourceFingerprint": "sha256:q1:b10df04f45227c9088b3aa9651e85abb0ffcf3d844e5a7755e6a97e558d3bb18",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "3.3 Trusted tool, untrusted content",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q7",
      "bankPosition": 7,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A facilities coordinator asks AI to list every urgent request from thirty maintenance tickets.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/6/correctOptionIds",
      "sourceFingerprint": "sha256:q1:8dc0fe7c3cea50aaf2a7901f0c5083a4d1faa3a851bd09f1cf62550c6d71f39d",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "5.1 Product discernment: is the result good?",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        },
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "13. Models checking models",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 1,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q8",
      "bankPosition": 8,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "A consultant prepares a personal assessment for a long-standing client.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/7/correctOptionIds",
      "sourceFingerprint": "sha256:q1:09525cdaac97d5e71e1aa7b491c798813e82c7fb622c367abdd5be40d7dea0a2",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "4.2 Disclosure: use rules first, judgment second",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q9",
      "bankPosition": 9,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 2,
      "scenario": "A team prepares a daily operations brief through three AI prompts: organise the updates, shorten them, then format the brief.",
      "format": "multiple-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A",
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/8/correctOptionIds",
      "sourceFingerprint": "sha256:q1:80457c87e52e057448f6ee664a7a06261896b682c0e8168c716cbc1da5567bff",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "15. Find the friction before you optimize",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        },
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "14. Rule, reference, or procedure",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q11",
      "bankPosition": 11,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 2,
      "scenario": "A community association wants a shortlist of accessible meeting rooms for twenty people.",
      "format": "multiple-response",
      "artifacts": [
        "quoted policy/prompt/output",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "B",
        "E"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/10/correctOptionIds",
      "sourceFingerprint": "sha256:q1:6fc4f459722ac74d355a6311e16e5c1942609f3871730d2d533877acbb81a112",
      "sources": [
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "2. Give AI the Outcome, Not the Clicks",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        },
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "5. Give AI the Source",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q13",
      "bankPosition": 13,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 1,
      "scenario": "A print shop needs AI to rename job files in one approved local folder and update its installed desktop spreadsheet.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/12/correctOptionIds",
      "sourceFingerprint": "sha256:q1:904e653664fe9c3c0ee9411238cd9d2916fbdd7770cd4bf169ceef6575ec07ad",
      "sources": [
        {
          "courseTitle": "General Agents on the Web: A Crash Course",
          "sectionHeading": "10. Web, desktop, or terminal: pick by what the work touches",
          "url": "https://agentfactory.panaversity.org/docs/general-agents-web-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q14",
      "bankPosition": 14,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "A company wants AI to summarise patterns in a staff transport survey.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/13/correctOptionIds",
      "sourceFingerprint": "sha256:q1:dc1d57fbdd92b900ad7cc02cc38cde24312fa4637aca748f1e537f36d7d2883d",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "2.3 Redaction is useful, but it is not magic",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q15",
      "bankPosition": 15,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "An agency drafts website copy for several clients.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/14/correctOptionIds",
      "sourceFingerprint": "sha256:q1:1f4a5ca7ddef71c4084e23a90add58f7d4bd3a29df3eef65182729d0e13335e2",
      "sources": [
        {
          "courseTitle": "Skills & Connectors: Teach AI Once, Connect It to Your Apps",
          "sectionHeading": "4. Skills vs Connectors vs Projects vs Custom Instructions",
          "url": "https://agentfactory.panaversity.org/docs/skills-connectors-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 1,
      "draftStatus": "planned-for-this-pass",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q16",
      "bankPosition": 16,
      "domain": "D7",
      "domainTitle": "Troubleshooting and Optimization",
      "selectionCount": 1,
      "scenario": "A curator uses AI to compare proposed exhibition themes.",
      "format": "single-response",
      "artifacts": [
        "prose scenario",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/15/correctOptionIds",
      "sourceFingerprint": "sha256:q1:78f23fcd06cf65eaa9a8071362f634371d9927befb152fe766108101127c7b42",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "11. Four causes, told apart by when the symptom appeared",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q17",
      "bankPosition": 17,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A museum educator is planning a workshop for families.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/16/correctOptionIds",
      "sourceFingerprint": "sha256:q1:dbb46adcd2df47effd4b6477fcc04ef1032358e4da74ce177f1acf0b7d15abf5",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "2. Three ways to work with AI: automation, augmentation, and agency",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q19",
      "bankPosition": 19,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "A company wants AI to summarise named client contract records.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/18/correctOptionIds",
      "sourceFingerprint": "sha256:q1:5f8009b5cab76ea523f03de5d7e76d1c693410b23608a0db5c01bd1a3e8abba4",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "2.4 The route matters as much as the tool name",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q20",
      "bankPosition": 20,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 1,
      "scenario": "A catering company asks AI to rewrite its brochure for office events.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/19/correctOptionIds",
      "sourceFingerprint": "sha256:q1:9c1df56c067211aaf4d296614e560384e955b28a919faa52858276e50e5efb9e",
      "sources": [
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "5. Give AI the Source",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q21",
      "bankPosition": 21,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A wholesaler asks for a weekly dispatch report.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/20/correctOptionIds",
      "sourceFingerprint": "sha256:q1:ae89ebd3f1009420cc32c2a6bf798581272e264d06689f845e82dfee5d80ad7c",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "2. Extract the requirements, then attack them",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q22",
      "bankPosition": 22,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A purchasing team uses two assistants from different model families to review a supplier rebate memo.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/21/correctOptionIds",
      "sourceFingerprint": "sha256:q1:161cba57815f0d10224db10423afecc9c1f20c1cc39b92c9936524c713a64a9b",
      "sources": [
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "13. Models checking models",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q23",
      "bankPosition": 23,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 2,
      "scenario": "A library manager is comparing two ways to cover Saturday demand: rotating existing staff or hiring a part-time assistant.",
      "format": "multiple-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "A",
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/22/correctOptionIds",
      "sourceFingerprint": "sha256:q1:65c9fa7d95b368449fa38f204a4cec00196cbac13e16eb892cb6b486c9cffa2e",
      "sources": [
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "6. Sycophancy and how to neutralize it",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q24",
      "bankPosition": 24,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 1,
      "scenario": "A community arts group needs this month’s deadline and fee for one council grant.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/23/correctOptionIds",
      "sourceFingerprint": "sha256:q1:f36fa80f66ba9d23bf86cc17c34c008cddb3e6c0150f42e084942dbc0037ef6e",
      "sources": [
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "3. The 3 retrieval modes: pretrained, web search, deep research",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q27",
      "bankPosition": 27,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "A shop’s existing Skill creates the required stock report correctly from data it receives.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/26/correctOptionIds",
      "sourceFingerprint": "sha256:q1:e1f93b9e16feb68849b5585af910389fc4deaca3ba506dbba936553f07a20291",
      "sources": [
        {
          "courseTitle": "Skills & Connectors: Teach AI Once, Connect It to Your Apps",
          "sectionHeading": "9. Which problems need a Skill, which need a Connector, which need both?",
          "url": "https://agentfactory.panaversity.org/docs/skills-connectors-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q28",
      "bankPosition": 28,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A service company documented an AI-assisted follow-up workflow when it handled twenty cases weekly.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/27/correctOptionIds",
      "sourceFingerprint": "sha256:q1:2a93c368698a1c2111bb746fc4f8ec5e3614865cc73a433599c7edc6929d5702",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "8. Who owns the map, and when it is read again",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 2,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q29",
      "bankPosition": 29,
      "domain": "D7",
      "domainTitle": "Troubleshooting and Optimization",
      "selectionCount": 1,
      "scenario": "A warehouse analyst asks AI to calculate average delivery times from a file.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/28/correctOptionIds",
      "sourceFingerprint": "sha256:q1:d6cec55f246519ed4377b7bca0a66b2d2c2a22f2d7e05fe0b97ac05da36a9cf9",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "12. The sequence runs cheapest first",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        },
        {
          "courseTitle": "Code You Never Write",
          "sectionHeading": "6. Verifying work you cannot read",
          "url": "https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q30",
      "bankPosition": 30,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A home-appliance company runs an AI support assistant without staff watching each conversation.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/29/correctOptionIds",
      "sourceFingerprint": "sha256:q1:5cc0a822d9123a1eda988a82aeb77715ae6ab7f33df41c364e82b4c12dfc4428",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "5.3 Performance discernment: is the AI serving people well when you are not watching?",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q31",
      "bankPosition": 31,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 2,
      "scenario": "A tour operator tests two AI configurations on ten brochure summaries and ten booking-detail extractions.",
      "format": "multiple-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "B",
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/30/correctOptionIds",
      "sourceFingerprint": "sha256:q1:8e9ca9883a6985336ee32f04612eef4a0ce0a6360ab99d63697aba19059909f2",
      "sources": [
        {
          "courseTitle": "What AI Actually Is: A Crash Course",
          "sectionHeading": "7. It is brilliant and useless on two tasks in a row (the jagged frontier)",
          "url": "https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q32",
      "bankPosition": 32,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "A property maintenance firm lets AI prepare customer notices from approved work orders.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/31/correctOptionIds",
      "sourceFingerprint": "sha256:q1:5151a2da310f91e1db3c334a7512d57c62e18ae117baa4b1823e2560e98cf879",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "1.3 A human in the loop is not a gate",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q34",
      "bankPosition": 34,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A consultant asks AI to create a downloadable supplier comparison for a client.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/33/correctOptionIds",
      "sourceFingerprint": "sha256:q1:a86f03cb4f526d79b5468087a38af9f24b3a7f2762a6886ce36443072904aae0",
      "sources": [
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "10. Verify Before You Accept",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q35",
      "bankPosition": 35,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "A team has an installed board-paper Skill whose method passes when invoked directly.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/34/correctOptionIds",
      "sourceFingerprint": "sha256:q1:c4984b103ccef221a19fcda105dd94cd89baf281c0579500edfebb4869668d6a",
      "sources": [
        {
          "courseTitle": "Skills & Connectors: Teach AI Once, Connect It to Your Apps",
          "sectionHeading": "12. The description field is the whole game",
          "url": "https://agentfactory.panaversity.org/docs/skills-connectors-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q36",
      "bankPosition": 36,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 1,
      "scenario": "A community workshop wants code to total equipment checkouts by item.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/35/correctOptionIds",
      "sourceFingerprint": "sha256:q1:4f6f8d469e195db81d11db3a61bd3b59133d1822635b3aba90cffdb90fb75592",
      "sources": [
        {
          "courseTitle": "Code You Never Write",
          "sectionHeading": "5. Brief the problem, not the program",
          "url": "https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q37",
      "bankPosition": 37,
      "domain": "D7",
      "domainTitle": "Troubleshooting and Optimization",
      "selectionCount": 1,
      "scenario": "A distributor’s AI sales brief used to match its offered product range.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/36/correctOptionIds",
      "sourceFingerprint": "sha256:q1:deb163b6dbd6da54583aedf25593eb8cd9165e103a61dbe1f135b82e5c9d958a",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "11. Four causes, told apart by when the symptom appeared",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q38",
      "bankPosition": 38,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 2,
      "scenario": "A manager asks AI to compare two warehouse layouts.",
      "format": "multiple-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A",
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/37/correctOptionIds",
      "sourceFingerprint": "sha256:q1:df4762227b47abf53dd617264496c85b199ee378aaf59c9c0011998f439c7b91",
      "sources": [
        {
          "courseTitle": "What AI Actually Is: A Crash Course",
          "sectionHeading": "9. \"Thinking\" is just more prediction before the answer",
          "url": "https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        },
        {
          "courseTitle": "What AI Actually Is: A Crash Course",
          "sectionHeading": "5. The context window is the only thing it can see",
          "url": "https://agentfactory.panaversity.org/docs/what-ai-actually-is-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q39",
      "bankPosition": 39,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A retailer schedules a daily competitor-price report.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/38/correctOptionIds",
      "sourceFingerprint": "sha256:q1:089422428373d94a5034057940dfab085fa3cfab3f8f9d6b81a3127a8d5fac91",
      "sources": [
        {
          "courseTitle": "General Agents on the Web: A Crash Course",
          "sectionHeading": "Ran is not the same as worked",
          "url": "https://agentfactory.panaversity.org/docs/general-agents-web-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 3,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q40",
      "bankPosition": 40,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "An agency used AI to write a script that combines monthly campaign exports.",
      "format": "single-response",
      "artifacts": [
        "prose scenario",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/39/correctOptionIds",
      "sourceFingerprint": "sha256:q1:4883aba83426f77beea33c3863850a547bba4128b43c32e0210207d95a0efec1",
      "sources": [
        {
          "courseTitle": "Code You Never Write",
          "sectionHeading": "8. Keep the script: a solved problem becomes a button",
          "url": "https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q41",
      "bankPosition": 41,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "A club has built a Skill for monthly activity summaries.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/40/correctOptionIds",
      "sourceFingerprint": "sha256:q1:90780f24e466070be5f1d0a3ffe99df5655138f5d62e8649bdf4c276db675772",
      "sources": [
        {
          "courseTitle": "Skills & Connectors: Teach AI Once, Connect It to Your Apps",
          "sectionHeading": "13. Test, then iterate",
          "url": "https://agentfactory.panaversity.org/docs/skills-connectors-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q42",
      "bankPosition": 42,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 2,
      "scenario": "A library uses AI to draft a reading-club announcement.",
      "format": "multiple-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B",
        "E"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/41/correctOptionIds",
      "sourceFingerprint": "sha256:q1:ebefaa57b6dd7ca07ab3b7bb9f472b020172472224d72e51d49e44024c7d8f5f",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "13. Turn a reaction into an instruction",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q43",
      "bankPosition": 43,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "An administrator asks AI to compare two ventilation units.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/42/correctOptionIds",
      "sourceFingerprint": "sha256:q1:cfdf2e4b3839ded15ffeb837d58324b923791729cf891161cb39c769df9f21a2",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "5.1 Product discernment: is the result good?",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        },
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "3. Feel what it is like to be a non-expert",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q44",
      "bankPosition": 44,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "An employee preparing a summary accidentally uploads a named customer list through a personal account rather than the required managed route.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/43/correctOptionIds",
      "sourceFingerprint": "sha256:q1:85fe11536f8a8266f451304f24260f14cac5b3065d2092d9c083a8e5ba369b91",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "The first-hour procedure",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q45",
      "bankPosition": 45,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 1,
      "scenario": "A retailer has two jobs.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/44/correctOptionIds",
      "sourceFingerprint": "sha256:q1:e2f3a49c93ecf6b0598c064bbc3a845ba5bf64de1d700b328c8bb5094da38b42",
      "sources": [
        {
          "courseTitle": "Code You Never Write",
          "sectionHeading": "3. The dividing line: which problems are code problems",
          "url": "https://agentfactory.panaversity.org/docs/code-you-never-write-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q46",
      "bankPosition": 46,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A team wants a weekly AI news brief while the coordinator’s laptop is off.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/45/correctOptionIds",
      "sourceFingerprint": "sha256:q1:d902c4744306955276f43600170dd6fe353489bd4fac0bf316d4fc38c44cae6b",
      "sources": [
        {
          "courseTitle": "General Agents on the Web: A Crash Course",
          "sectionHeading": "The four answers before you schedule",
          "url": "https://agentfactory.panaversity.org/docs/general-agents-web-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        },
        {
          "courseTitle": "General Agents on the Web: A Crash Course",
          "sectionHeading": "Walk it before you schedule it",
          "url": "https://agentfactory.panaversity.org/docs/general-agents-web-crash-course",
          "sourceIndex": 1,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q47",
      "bankPosition": 47,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "An analyst has a reusable stock-summary method that works when pasted into chat.",
      "format": "single-response",
      "artifacts": [
        "fenced artifact"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/46/correctOptionIds",
      "sourceFingerprint": "sha256:q1:0936e23c11886f0ed9b2674108be37bf5a3fb10b5f3d2895c79dedf03f45ba1b",
      "sources": [
        {
          "courseTitle": "Skills & Connectors: Teach AI Once, Connect It to Your Apps",
          "sectionHeading": "11. Anatomy of a SKILL.md",
          "url": "https://agentfactory.panaversity.org/docs/skills-connectors-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q48",
      "bankPosition": 48,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "Before asking AI, an organiser records:\n\n> Choose the forty-seat room.",
      "format": "single-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/47/correctOptionIds",
      "sourceFingerprint": "sha256:q1:ef14ca1915dae6d9f47d273164da19972b4ac6cddd959369a8dc52199a14fd91",
      "sources": [
        {
          "courseTitle": "How to Think in the AI Era: Crash Course",
          "sectionHeading": "Discipline 1: The Prediction Lock",
          "url": "https://agentfactory.panaversity.org/docs/how-to-think-ai-era",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q49",
      "bankPosition": 49,
      "domain": "D7",
      "domainTitle": "Troubleshooting and Optimization",
      "selectionCount": 1,
      "scenario": "A charity wants AI to guarantee the exact total of donations it will receive next month.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/48/correctOptionIds",
      "sourceFingerprint": "sha256:q1:6de5c5648967a64017891b3e88c8f018ef0bf45e091ea39f69bb01db4afc2e90",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "12. The sequence runs cheapest first",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 4,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q50",
      "bankPosition": 50,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 2,
      "scenario": "A community group reviewed an AI event summary.",
      "format": "multiple-response",
      "artifacts": [
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "A",
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/49/correctOptionIds",
      "sourceFingerprint": "sha256:q1:4255f9ab941f9642dc24cbde8b3790b3f73678fab898174c8a2bcde3758eb939",
      "sources": [
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "6. Ask for the Deliverable, Not an Answer",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q51",
      "bankPosition": 51,
      "domain": "D6",
      "domainTitle": "Governance, Risk, and Responsible Use",
      "selectionCount": 1,
      "scenario": "An analyst receives a report-formatting extension from another team in her company.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/50/correctOptionIds",
      "sourceFingerprint": "sha256:q1:255cd3725aad37105491ea203fe32de6ca8c5d2f282cef7560e092b9ff850542",
      "sources": [
        {
          "courseTitle": "Governance, Risk & Responsible Use: A Crash Course",
          "sectionHeading": "3.1 Treat extensions like software, not like prompts",
          "url": "https://agentfactory.panaversity.org/docs/governance-risk-responsible-use-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q52",
      "bankPosition": 52,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A consulting team requires finished research files in its own approved document folder.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/51/correctOptionIds",
      "sourceFingerprint": "sha256:q1:59cf6b84cae3aed06077b7354ef725b813a66f722722537fd2a5577a924e693c",
      "sources": [
        {
          "courseTitle": "General Agents on the Web: A Crash Course",
          "sectionHeading": "5. The three file tiers: where does the deliverable actually live?",
          "url": "https://agentfactory.panaversity.org/docs/general-agents-web-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q53",
      "bankPosition": 53,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "A service company wants AI support for routine contract amendments.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/52/correctOptionIds",
      "sourceFingerprint": "sha256:q1:bbbfce0e89e767a7dda1f4ba92258ff54978960ffaeab3ff5caeda46d08c4109",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "5. Three criteria decide every step",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q54",
      "bankPosition": 54,
      "domain": "D1",
      "domainTitle": "Prompting and Task Execution",
      "selectionCount": 2,
      "scenario": "A coordinator has three proposals and agreed comparison criteria.",
      "format": "multiple-response",
      "artifacts": [
        "quoted policy/prompt/output",
        "table mentioned/requested, not embedded"
      ],
      "originalCorrectOptionIds": [
        "C",
        "E"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/53/correctOptionIds",
      "sourceFingerprint": "sha256:q1:b455ea34f875e0a029f4ee67f3b660a50191e55e9271e5df594496895a49d9a0",
      "sources": [
        {
          "courseTitle": "AI Fluency: A Crash Course",
          "sectionHeading": "4.2 Process description: define the approach",
          "url": "https://agentfactory.panaversity.org/docs/ai-fluency-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q55",
      "bankPosition": 55,
      "domain": "D3",
      "domainTitle": "Product and Model Selection",
      "selectionCount": 1,
      "scenario": "A facilitator wants AI to turn a whiteboard process map into a written sequence with its decision branches.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "B"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/54/correctOptionIds",
      "sourceFingerprint": "sha256:q1:592a14a4f335890245f362f7d4def99d12e0d5e8b11fb50505e0328727dfce15",
      "sources": [
        {
          "courseTitle": "AI Prompting in 2026: A Crash Course",
          "sectionHeading": "8. Multimodal: images, audio, and what's next",
          "url": "https://agentfactory.panaversity.org/docs/ai-prompting-2026",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q56",
      "bankPosition": 56,
      "domain": "D5",
      "domainTitle": "Configuration and Knowledge Management",
      "selectionCount": 1,
      "scenario": "An archive team uses one shared Project to summarise donated letters.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "D"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/55/correctOptionIds",
      "sourceFingerprint": "sha256:q1:5cbcc416255776c9e314116441453c61f1f68d7209e11bee236f48f2bc5bcdb5",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "14. Rule, reference, or procedure",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Original passage inspected by AI on 2026-10-18; per-item interpretation still requires review"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q57",
      "bankPosition": 57,
      "domain": "D7",
      "domainTitle": "Troubleshooting and Optimization",
      "selectionCount": 1,
      "scenario": "An organiser asks a fast AI setting to plan a programme with several linked staffing and room constraints.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/56/correctOptionIds",
      "sourceFingerprint": "sha256:q1:f44bf85295a78e8c5c658f487505cf11492832d0159c026e23ec57c9f300a1b1",
      "sources": [
        {
          "courseTitle": "Just Delegate It: A Crash Course",
          "sectionHeading": "9. Intervene When AI Goes Wrong",
          "url": "https://agentfactory.panaversity.org/docs/just-delegate-it-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q58",
      "bankPosition": 58,
      "domain": "D2",
      "domainTitle": "Output Evaluation and Validation",
      "selectionCount": 1,
      "scenario": "A training centre asks AI to evaluate attendance after it started sending reminder messages.",
      "format": "single-response",
      "artifacts": [
        "embedded Markdown table",
        "quoted policy/prompt/output"
      ],
      "originalCorrectOptionIds": [
        "C"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/57/correctOptionIds",
      "sourceFingerprint": "sha256:q1:e1a9125d14c2d6c1521ac0a6d8e90c243f42141a074e8149008ad4fc56b23062",
      "sources": [
        {
          "courseTitle": "How to Think in the AI Era: Crash Course",
          "sectionHeading": "Discipline 3: The Error Taxonomy",
          "url": "https://agentfactory.panaversity.org/docs/how-to-think-ai-era",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    },
    {
      "questionId": "Q60",
      "bankPosition": 60,
      "domain": "D4",
      "domainTitle": "Workflow Integration and Solution Design",
      "selectionCount": 1,
      "scenario": "Two volunteers want a tool to organise event tasks.",
      "format": "single-response",
      "artifacts": [
        "prose scenario"
      ],
      "originalCorrectOptionIds": [
        "A"
      ],
      "originalAnswerReference": "public/easy-question-bank.json#/questions/59/correctOptionIds",
      "sourceFingerprint": "sha256:q1:70a5cf32d1a10c43269aa6bb85922a9aa588d8826e56ecc9ee5f7bb29d39cec2",
      "sources": [
        {
          "courseTitle": "Workflow Design & Diagnosis",
          "sectionHeading": "9. The loop: ideate, prototype, feedback, refine",
          "url": "https://agentfactory.panaversity.org/docs/workflow-design-diagnosis-crash-course",
          "sourceIndex": 0,
          "availableEvidence": "Exact bank reference available; passage not inspected in this Phase 7 pass; source-pending"
        }
      ],
      "plannedBatch": 5,
      "draftStatus": "not-authored; owner Batch 1 approval required before continuation",
      "independentHumanReview": "pending",
      "ownerApproval": "pending"
    }
  ]
}
```
