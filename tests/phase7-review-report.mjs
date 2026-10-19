import fs from 'node:fs';
const root = 'docs/guided-practice/';
const evidence = 'test-results/guided-practice/phase-7-batch-1/';
const rows = JSON.parse(fs.readFileSync(evidence+'draft-identities.json','utf8'));
const identities = '| ID / review ID | Draft SHA-256 | q1 | Prospective g1 |\n| --- | --- | --- | --- |\n' +
  rows.map(r=>`| ${r.questionId} / \`${r.reviewId}\` | \`${r.draftSha256}\` | \`${r.sourceFingerprint}\` | \`${r.prospectiveG1}\` |`).join('\n');
const report = `# Phase 7 — Batch 1 review and bounded handoff

2026-10-18 (Asia/Karachi). **Initialization and Batch 1 preparation complete; owner review pending. Full Phase 7 remains in progress.**

The remaining fifty-question inventory and deterministic five-batch plan are complete. Exactly ten new guides were authored: **Q1, Q2, Q3, Q7, Q8, Q9, Q11, Q13, Q14, Q15**. Final focused verification passes **143/143 checks in seven files**. These are unpublished drafts: **0/10 independent human reviews, 0/10 owner approvals, 0 new approved digests**. The original accepted ten guides and all their approval records remain unchanged.

## Deliverables and batching

- [Implementation plan and authority reconciliation](PHASE-7-IMPLEMENTATION-PLAN.md).
- [Exact fifty-row inventory](PHASE-7-QUESTION-INVENTORY.md), including positions/domains/types, scenarios/artifacts, answer references, q1 and source availability.
- [Fifty-row content/review ledger](PHASE-7-CONTENT-LEDGER.md), linked to the unchanged accepted-pilot matrix for eventual sixty-item coverage.
- [Ten fenced-JSON draft records](content/intermediate-expansion/batch-1.md), [solve-first source copy](content/intermediate-expansion/questions-only.md), [original-course evidence](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md).

${fs.readFileSync(evidence+'batch-distribution.md','utf8')}

Each batch contains ten unique IDs in original bank order; none overlaps the pilot or another batch. Remaining response totals are 42 single / 8 double / 0 triple. Both triple-response items are already accepted pilot records. Adding pilot and remaining inventory preserves full-bank 48/10/2 and D1–D7 totals 8/13/7/10/7/9/6. Batch 1 has eight single and two double responses, six domains and no embedded tables; its quoted policies/messages/output and requested-table scenario are retained in the exact source copy. Later batches contain the seven remaining embedded-table items and Q47’s fenced packaging artifact. Source counts in the table are reference occurrences: later inspected shared passages do not finalize any later guide. Batches 2–5 have no authored guides or draft hashes.

## Source grounding

**14/14 Batch 1 reference occurrences checked by the AI author, across 12 distinct passages on seven original pages. No source-pending blocker remains for the ten authored records.** Independent human source review is still required. The source ledger retains the exact original title, heading, URL and zero-based index for every reference; guide locators bind claims to the inspected headings and passage ranges.

| Item | Original course section(s) | AI source result / limits |
| --- | --- | --- |
| Q1 | Workflow §10 | Operational dependence → engineering/support; named booking requirements come from the case. |
| Q2 | AI Fluency §5.1; Prompting §13 | Requirement/source checks and limits of model agreement; notice/capacity deductions use the quoted policy. |
| Q3 | Governance §3.3 | Tool/content trust distinction; per-order approval comes from the case. No malicious intent is inferred. |
| Q7 | AI Fluency §5.1; Prompting §13 | Omission/source checks and model-review limits; the maintenance-ticket complement is a case deduction. |
| Q8 | Governance §4.2 | Rule-first disclosure and recipient understanding; no general legal obligation is invented. |
| Q9 | Workflow §§15/14 | Consolidation before configuration, reference/procedure separation; final staffed gate and trial result come from the case. |
| Q11 | Just Delegate It §§2/5 | Outcome over arbitrary recipe, claims tied to sources; room constraints and action limits are case facts. |
| Q13 | General Agents §10 | Resource/dependency/custody routing, including bridge qualification; local approval/execution are case assumptions. |
| Q14 | Governance §2.3 | Residual identification and task utility; assessment uses the fictional company’s standard, with no universal anonymity threshold. |
| Q15 | Skills & Connectors §4 | Shared Project context versus global preferences and reusable method; the client-only scope is explicit in the case. |

Retrieval history is preserved: direct opening of the workflow URL initially returned tool Internal Error; following its sidebar link from AI Fluency retrieved the same canonical original page. Exact sections 10/14/15 were then read. The initial failure establishes no HTTP status or removal. The other six pages opened directly. No secondary account or prior AI assessment replaced passage inspection. Source summaries are short paraphrases; case numbers and keyed conclusions are not attributed to course examples.

## Hint and option review by the AI author

Every item has three distinct hints. Thirty distinct hints contain no standalone option letters, numerical results, copied complete winning text or complete multi-answer set. Every sequence was read individually and cumulatively by the AI author. **These findings are preliminary editorial evidence; automated surface checks and AI self-review cannot establish independent semantic non-leakage.**

| Item | Hint 1 → Hint 2 → Hint 3 | Cumulative assessment / human focus |
| --- | --- | --- |
| Q1 | Dependency/evidence standard → untested requirements → timing/support trace | Scaffolds a requirement checklist; does not name the winning role or eliminate each alternative. Review whether the final timing prompt over-directs. |
| Q2 | Separate promises → separate policy conditions → classify support states | Does not supply the threshold arithmetic or state which promise survives. Human review should judge the combined strength of the policy-condition cue. |
| Q3 | Information/authority → distinguish trust checks → trace action/approval order | No selected action is prescribed; learner must apply the case’s gate to each plan. Avoid treating authentic content as malicious by definition. |
| Q7 | Inclusion/coverage → checked/unchecked claims → test completeness versus demonstrated error | No omitted-ticket result is asserted. Human focus: the coverage distinction is the key concept, so judge whether its staged wording retains enough reasoning. |
| Q8 | Divide contributions → recipient understanding → test attribution | Does not prescribe a disclosure sentence or imply AI supplied judgment. Review subtle wording around substantial drafting. |
| Q9 | Find friction/decisions → trial and reusable material → sequence remaining work | Does not give A/C or list both winning actions. Human focus: ensure cumulative prompts do not over-specify the consolidation/configuration pair. |
| Q11 | Outcome/method → constraints/authority → trace evidence and unknowns | No B/E or list of winning replacements. Human focus: keep method freedom separate from missing-source uncertainty. |
| Q13 | Resources/run conditions → execution/custody → access and extra work | Does not name the surface. Human focus: source routing cue must not become a memorized product-label rule. |
| Q14 | Needed detail/identification → residual combinations → demonstrate anonymity/usefulness | Does not claim that aggregation alone is sufficient or enumerate losing choices. Assessment remains necessary. |
| Q15 | Classify saved material → scope/users → covering-writer test | Does not name Project instructions. Human focus: classification plus scope narrows the choice strongly, so review cumulative helpfulness versus disclosure. |

**42/42 original options have ordered, nonblank satisfaction and failure/limit comparisons** (eight × four plus two × five). Correct-option limits describe remaining scope, companion actions or later checks and do not contradict the key. Reasoning is item-specific across all ten; no generic explanation is copied between records. Closest distractors exist, belong to the source and exclude keyed IDs. Vocabulary is present in every draft, following the authoring schema; the accepted UI’s current feedback visibility is unchanged.

Key audit: Q1 C; Q2 B; Q3 A; Q7 A; Q8 D; Q9 **A+C**; Q11 **B+E**; Q13 C; Q14 A; Q15 D. Q9 explains why consolidation/retained approval and reusable configuration jointly cover the goal; all B/D/E exclusions are analyzed. Q11 explains why outcome freedom and traceable evidence complement each other; A/C/D fail the search or authority requirements. Single-response items retain exactly one keyed choice. No bank ambiguity or key contradiction was identified by this AI review; that is not independent validation.

Arithmetic recheck: Q2 **72 ≥ 48**, so the notice condition qualifies without establishing a Saturday space. Q7 **30 − 8 = 22** unexamined tickets; unchecked does not imply any actual omission. Q11 retains the twenty-person/$80 constraints without manufacturing a computed result. No other Batch 1 item requires a numerical calculation.

## Exact candidate identities

Draft version **1**, authored 2026-10-18, source schema 1 / exam pcao-f-practice-easy-01 / bank 1.0.0 / Intermediate. Planned guideVersion **1.1.0** follows the master's full Intermediate release contract. Review IDs are prospective references only; they are not signatures.

${identities}

Draft SHA-256 hashes UTF-8 JSON.stringify(draft) in stored property order. q1 uses the unchanged validated-source tuple. Prospective g1 changes only draft status to approved **in memory** to test the approved-only schema and deterministic canonical serialization. No projection is persisted as a reviewed release or allowlisted. All actual approved-g1/new human/owner fields remain null. Any subsequent edit changes the relevant identities and requires fresh affected review.

## Verification and preservation

| Execution | Result |
| --- | --- |
| [Initial focused log](../../${evidence}focused-initial.log) | **142 passed / 1 failed**. New surface-check regex incorrectly used case-insensitive option-letter matching and rejected ordinary “a”. Content was unchanged. npm also consumed the requested worker option and warned; the final invocation passes it directly to Vitest. |
| [Final focused log](../../${evidence}focused-final.log) | **143/143 in seven files**, zero skips/retries. Direct local Vitest invocation with --maxWorkers 2; existing content/fingerprint/schema/pilot/real-bank/approved-content tests plus 19 new Phase 7 checks. |
| [Before manifest](../../${evidence}preservation-before.json) / [after check](../../${evidence}preservation-after.json) | **145/145 protected file byte hashes unchanged**, including both banks, accepted pilot content/approval files, source/UI/contracts, fixtures/local-pilot inputs, configuration/dependencies and available build artifacts. |
| Inventory and structural checks | Fifty exact q1/position/domain/type/source bindings; five disjoint tens; ten new schema/item/draft-SHA/g1 bindings; all 42 options/14 references; deterministic serialization and digest change on content/version/source edits; exact solve-first copy; no later-batch draft. |
| Publication-negative checks | Raw drafts rejected as invalid-release; approved-status in-memory projections still rejected as not-published by the unchanged empty production catalog. |
| Full regression / TypeScript / build / UI preview / browser / native accessibility | **Not run** in this unpublished content-only pass, as requested. Prior results retain their original scope. |

Final command: node node_modules/vitest/vitest.mjs run --configLoader runner tests/guidedPhase7Content.test.ts tests/guidedPilotContent.test.ts tests/guidedContent.test.ts tests/guidedFingerprints.test.ts tests/guidedSchema.test.ts tests/realBank.test.ts tests/approvedContent.test.ts --maxWorkers 2.

The first inventory generation used Vite’s default dependency discovery, which emitted optimization messages; it did not start a listener or change protected files. The authoring loader disables dependency discovery. No source/configuration change was required. An attempted read of nonexistent vitest.config.ts returned a missing-file error; the existing Vite-based test command was used. The first report-generator invocation failed on unescaped Markdown backticks in a JavaScript template; removing that formatting fixed generation without changing content identities. [Tooling attempts](../../${evidence}tooling-attempts.json) retain these observations and their resolutions; they are not application failures.

## Remaining decisions and next step

No unresolved AI-identified factual/source/option defect remains in the ten drafts. **Independent educational assessment remains pending**, particularly semantic/cumulative hint strength in Q2/Q7/Q9/Q15 and product-label assumptions in Q13. Reviewer identity/capacity for the new content must be confirmed; the previous pilot waiver is expressly not reused. Human solve-first/source/hint/all-option/set/terminology/arithmetic review and separate exact-digest owner approval are required. No signatures, review performance, learner-usability or learning-effectiveness results are invented.

Next: review [questions-only.md](content/intermediate-expansion/questions-only.md) first, inspect [the ten drafts](content/intermediate-expansion/batch-1.md) and original-course evidence, record findings against the identities above, then explicitly accept/request revisions to Batch 1 and decide whether to authorize Batches 2–5. **Stop here for owner review; no later batch is generated.** Batch 1 preparation is not full Phase 7 acceptance.

Production remains disabled/catalog empty. No original bank, accepted guide/approval, Mock behavior, persistence, commitment, ownership/protection, analytics, backend or account change occurred. No publication, hosted mutation, deployment, commit/push or Phase 8. Native accessibility/device coverage and historical PDF cancellation, recovery intermittency, timing/resource-pressure release dispositions remain outstanding and unchanged. Full-phase release/compatibility/regression and eventual sixty-item publication require later authorization and evidence.
`;
fs.writeFileSync(root+'PHASE-7-BATCH-1-REVIEW.md',report);
console.log('Wrote bounded Batch 1 review with ten exact identity rows');
