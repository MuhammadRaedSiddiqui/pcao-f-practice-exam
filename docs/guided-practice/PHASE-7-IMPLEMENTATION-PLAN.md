# Phase 7 — initialization and five-batch content plan

2026-10-18 (Asia/Karachi). **Authorized scope: inventory, planning, Batch 1 draft authoring, original-source checks and isolated content validation only.** Phase 7 is in progress; the full phase is not complete or accepted.

## Authority and reconciliation before authoring

The owner's attached “PCAO-F Guided Practice — Phase 7 Initialization and First Content Batch” request explicitly authorizes this pass after [Phase 6 local-pilot acceptance](PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md). It supersedes older “Phase 7 not authorized” status for this bounded work. The master plan's Phase 7 D1–D2 permit small batches and per-item author/source/reviewer records; no conflicting batch ordering or size is prescribed. Use original validated bank order excluding the accepted ten. There is no batching conflict.

The master plan also describes eventual publication of a 60-entry v1.1.0 release, catalog promotion and broad compatibility/regression testing. Those are **later full-phase deliverables**, outside this narrower authorization; they are deferred rather than executed or marked passed. The explicit request requires focused checks for unpublished drafts, so the full-application suite/build/browser matrix is not repeated here. No schema, flow, storage or application change is necessary.

The accepted ten remain exactly Q4/Q5/Q6/Q10/Q12/Q18/Q25/Q26/Q33/Q59 at their existing v1.0.0 draft/q1/prospective-g1/review identities. Their owner waiver applies only to those versions. New content requires independent human review and separate owner approval. No extension of the waiver is inferred; no capacity or signature is invented. Independent reviewer assignment/capacity for the new fifty must be confirmed before educational acceptance, but does not prevent authorized draft preparation.

## Inputs inspected

- [Master plan, Phase 7](GUIDED-PRACTICE-MASTER-PLAN.md), [architecture/contracts](GUIDED-PRACTICE-ARCHITECTURE.md), [execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md), [verification matrix](GUIDED-PRACTICE-VERIFICATION-MATRIX.md), root instructions and unified implementation status.
- [Phase 2 review and content conventions](PHASE-2-REVIEW.md), accepted pilot batch files, [source ledger](content/intermediate-pilot/SOURCE-VERIFICATION-LEDGER.md), [final approval matrix](content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md), [content/waiver ledger](content/intermediate-pilot/CONTENT-REVIEW-LEDGER.md).
- Existing bank validation, Guided source/schema/fingerprint/catalog/loader contracts and `guidedPilotContent` tests. q1 uses the validated bank representation; raw bank bytes are separately protected.

## Frozen identity and batches

Bank `public/easy-question-bank.json` SHA-256 is `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`. Source is schema 1 / `pcao-f-practice-easy-01` / bank 1.0.0 / Intermediate. Planned full-release guideVersion is **1.1.0**, preserving the master's contract; no release is created now. Draft review IDs use `gp7-intermediate-q<ID>-v1`; exact draft version is 1, dated 2026-10-18. An edit requires new identities and renewed affected review.

| Batch | Exact IDs in source order | D1/D2/D3/D4/D5/D6/D7 | Select 1/2/3 | Embedded tables |
| --- | --- | --- | --- | --- |
| 1 | Q1, Q2, Q3, Q7, Q8, Q9, Q11, Q13, Q14, Q15 | 1/2/1/2/1/3/0 | 8/2/0 | None |
| 2 | Q16, Q17, Q19, Q20, Q21, Q22, Q23, Q24, Q27, Q28 | 2/1/1/3/1/1/1 | 9/1/0 | Q21 |
| 3 | Q29, Q30, Q31, Q32, Q34, Q35, Q36, Q37, Q38, Q39 | 1/3/2/0/1/1/2 | 8/2/0 | Q30, Q31 |
| 4 | Q40, Q41, Q42, Q43, Q44, Q45, Q46, Q47, Q48, Q49 | 1/2/1/2/2/1/1 | 9/1/0 | Q41 |
| 5 | Q50, Q51, Q52, Q53, Q54, Q55, Q56, Q57, Q58, Q60 | 2/2/1/2/1/1/1 | 8/2/0 | Q52, Q53, Q58 |

The [inventory](PHASE-7-QUESTION-INVENTORY.md) records every original position, domain, selection count, scenario/format, exact answer reference, q1 and available source evidence. The [batch dependency ledger](../../test-results/guided-practice/phase-7-batch-1/batches.json) adds reference counts, quoted/fenced/requested artifacts and gates. Only Batch 1 is authored now. Source availability for a later item is passage-level evidence only; it is not approval or a completed source review of an unwritten guide.

## Per-item authoring and gates

Use fenced JSON in `content/intermediate-expansion/batch-1.md`, following the Phase 2 authoring wrapper and guide fields. Each item gets three progressive hints, 2–4 decisive criteria, specific reasoning, every original option in original order, closest distractors, vocabulary, zero-based source checks and `approval.status: draft`. No answer letters, exact winning wording, final numerical result or complete selected set belongs in hints. Review hints separately and cumulatively; passing surface checks cannot prove semantic safety.

Read the exact original passages before finalizing claims. Distinguish case facts, bank-established key, course-supported general principle and author interpretation in a per-item source ledger. Preserve unsuccessful retrievals. Any necessary unverified claim is source-pending/blocked, never source-complete by inference. Recompute arithmetic and exact multi-select sets from the case, without presenting course examples as case evidence.

Use unchanged q1 and g1 functions. `draftSha256` is SHA-256 of UTF-8 `JSON.stringify(draft)` in stored property order. `prospectiveG1` changes only `approval.status` in memory to exercise the approved-only contract; it does not authorize a release. `approvedG1` and all new human/owner approvals stay null. Include a solve-first exact source copy for reviewers.

Focused Vitest checks cover inventory partitions/totals, bank/source identity, strict schema/item/options/sources, q1/draft SHA/g1, deterministic serialization, changed-content sensitivity, draft rejection, empty-catalog rejection and pilot approval preservation. Reuse existing schema/fingerprint/content/pilot/bank checks. No preview is needed for a content-only pass.

Before educational approval, a human independent of the AI author must record solve-first reasoning, original-source verification, independent and cumulative hint review, all-option/complete-set review, terminology and arithmetic findings, then sign the exact final identities. The owner separately approves those identities. Batch 1 acceptance/continuation is an explicit owner decision. Batches 2–5 await it; no automatic generation follows this handoff.

## Deferred full-phase/release obligations

Full Phase 7 still needs all fifty new items reviewed, 60/60 exact coverage, old pilot digests retained, unchanged frozen sessions, 12×5/6×10 reachability, compatible 60-item post-exam cohorts, applicable full regressions/readability/accessibility evidence and owner acceptance. Original pilot independent reviews remain 0/10 with their narrow waiver; new items retain their independent-review gate. No retroactive human review of the pilot is fabricated.

Native accessibility/physical-device/other-browser decisions and historical PDF cancellation, recovery intermittency, local timing/resource-pressure release dispositions remain outstanding. The 40/47 pressure result and owner's sequential one-worker browser policy remain intact. This content pass does not resolve them or establish production responsiveness or learning effectiveness.

Production remains disabled/catalog empty. No bank/pilot/application/configuration changes, publication, hosted mutation, new dependency, build, deployment, commit/push or Phase 8. Stop after the [Batch 1 review](PHASE-7-BATCH-1-REVIEW.md).
