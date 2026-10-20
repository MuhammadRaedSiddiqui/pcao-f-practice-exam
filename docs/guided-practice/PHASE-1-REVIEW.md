# Guided Practice — Phase 1 review

16–17 October 2026, Asia/Karachi. **Phase 1 domain implementation complete; owner acceptance pending. Guest PDF regressions remain unresolved. Phase 2 is not authorized.**

The owner's [attached Phase 1 request](../../test-results/guided-practice/phase-1/owner-request.txt) explicitly authorizes this phase and the accepted isolated verification method. It supersedes the historical Phase 0 reports' then-pending Phase 1 authorization. [Phase 0 acceptance](PHASE-0-FINAL-ACCEPTANCE.md) and reconciled D1–D11 remain authoritative. No approved architecture was redesigned.

## 1. Implementation summary

Added an independent domain foundation for strict guided overlays/frozen subsets/sessions, exact source identity, q1/g1 integrity, explicit catalog approval/revocation, source compatibility and eligibility, deterministic sets, completed-report cohorts, pure answer/hint/commit/finish operations and D7–D9 protection/recovery contracts. The production catalog is empty. Nothing imports Guided into the app, UI, routes, account services or analytics.

This is a technical foundation with synthetic fixtures. It provides no instructional content approval, learner UI, durable repository, browser storage scanner, recovery interface or public release. Pure transition results propose new state; they do not acknowledge a durable save. Future controllers must check current authorization, approval and Mock protection before presenting or changing instructional state.

## 2. Files created and modified

Created under `src/domain/guided/`:

| File | Responsibility |
| --- | --- |
| `schema.ts` | Strict nested Zod contracts, source/subset/type parity, editorial status, release/session/response/command refinements and resource limits |
| `errors.ts` | Closed error codes/results and deep-clone/freeze helper |
| `fingerprints.ts` | Exact q1 tuple, private canonical JSON serializer and g1 SHA-256 |
| `catalog.ts` | Empty production catalog, source/version/path/digest allowlist, revocations and recognized legacy source identities |
| `source.ts` | Full validated parent bank or submitted frozen report, recognized identity/difficulty and compatibility contracts |
| `loader.ts` | Publication/frozen-item/full-source validation and bounded injectable BASE_URL-aware release loader |
| `selectors.ts` | Validated coverage partition/counts, report filters and deterministic 5/10 selection |
| `session.ts` | Creation/recovery validation, pure transitions, immutable commitments, restricted presentation and learning counts |
| `protection.ts` | Strict inventory/gate/access contracts, raw/index union, pure classification, finite checking and safe recovery requirements |
| `contracts.ts` | Repository interface only; no implementation |

Created `tests/guided{Schema,Fingerprints,Session,Selectors,Protection,Content}.test.ts`, `tests/fixtures/syntheticGuidance.ts` and `tests/fixtures/guidedGoldenVectors.json`. “Content” tests use only synthetic overlays and injected catalogs.

Created this review. Updated the Phase 1 section/authorization record in [execution checklist](GUIDED-PRACTICE-EXECUTION-CHECKLIST.md), plus the current-status entries in root AGENTS and PROJECT_IMPLEMENTATION_STATUS. Every pre-existing application, unit/browser test, bank, fixture, package/configuration and private-environment file is protected by the before/after manifest. Earlier dirty changes remain intact. Local ignored evidence/harnesses are in `test-results/guided-practice/phase-1/`.

## 3. Final domain architecture

Validated complete source → exact published catalog entry → q1-compatible question/guide pair → deterministic subset or report cohort → frozen session → pure command → restricted or committed presentation.

Schema/fingerprint/catalog/source/selector/session code has no browser storage adapter. Loader networking is injectable and bounded. Protection accepts observations only and never reads real browser storage. Existing read-only `parseAttempt`, `isExactSet`, `questionOutcome` and completed-report `reportHash` are reused. No Mock writer is imported by Guided. The original report hash binds post-exam provenance only; it does not identify questions.

Future repository orchestration must initialize DB/fetch/hash outside the shared lock, freshly check source access and complete Mock inventory inside it, then perform a short revision-checked transaction and wait for its completion. No persistence implementation or speculative migration engine is added.

## 4. TypeScript/Zod contracts

All object schemas are strict, including nested options/sources/comparisons/approval/responses/commands, catalog records, eligibility results and protection outcomes. Source identity is schema 1 + stable exam ID + exact bank semver + Intermediate/Advanced. Versions reject malformed semver. Stable IDs use the existing character rule with a 200-code-unit resource cap. Accepted guidance text is checked for nonblank content without changing it.

Question subset fields match the exported Mock `Question` type exactly, checked in both assignability directions and by type equality. Subsets independently validate unique option IDs, exact valid key cardinality, complete explanation membership and domain consistency; they never go through the full 60-question bank validator. Full parent banks still pass the existing reviewed validator before selection.

Release limits: 1–60 unique guides, three hints of 1–1500 code units, 2–4 decisive criteria, reasoning/comparison fields up to 12000 code units, at most 10 unique vocabulary terms and 20 valid source checks. Comparisons cover every option once in source order; distractors are distinct valid incorrect options. Release JSON is at most 2 MiB UTF-8. Runtime approval is exactly approved + opaque review ID, independently checked against catalog g1; draft metadata cannot publish itself. Editorial date metadata, when present, is ISO datetime validated.

Source subset safeguards additionally cap source prose at 200000 code units, options/sources at 100, URLs at 10000 and domain expected count at 60. Sessions contain 1–60 items and at most 4 MiB UTF-8 JSON. Resource errors reject, never truncate. Sessions require UUID session/commit/finish IDs, safe revisions, finite integer valid-date timestamps, coherent start/update/commit/completion times, exact response/item coverage, unique IDs and valid positions. Persisted correctness/score fields are rejected; correctness is derived from committed sets. Unknown session versions stay unavailable without mutation.

## 5. Fingerprint and digest specification

q1 uses the approved fixed tuple, JavaScript `JSON.stringify`, UTF-8 and Web Crypto SHA-256, with `sha256:q1:` + 64 lowercase hex digits. The tuple is exactly:

```text
['pcao-f-guided-question', 1,
 source.schemaVersion, source.examId, source.bankVersion, source.difficulty,
 [domain.id, domain.title, domain.expectedQuestionCount],
 question.id, question.primaryDomain, question.selectionCount, question.stemMarkdown,
 options.map([id,textMarkdown]), correctOptionIds, explanationMarkdown,
 options.map([id,optionExplanations[id]]), sources.map([courseTitle,sectionHeading,url ?? null])]
```

No further trim, Unicode/newline normalization, rendering or array sorting occurs. Parent bank validation already trims raw bank text; q1 binds that accepted representation. Object insertion order is irrelevant; option/key/source array order is deliberately significant. Missing Web Crypto is unsupported, with no fallback hash.

g1 hashes canonical `['pcao-f-guided-entry', 1, source, guideVersion, entry]`, including every entry field and approval reference. Objects sort keys using JS code-unit comparison; arrays retain order; primitives use JSON serialization. The private canonicalizer refuses non-JSON/nonfinite/undefined/cyclic values. Format is `sha256:g1:` + 64 lowercase hex digits. There is no r1 release hash, signing service or generalized publisher.

Independent fixed vectors are checked into the synthetic JSON fixture. An evidence-only Python `hashlib`/`json` oracle constructed the bytes without importing TypeScript; Node SHA-256 and Web Crypto compare against those fixed values rather than regenerating expected values from production functions.

| Vector | Expected SHA-256 (without prefix) |
| --- | --- |
| q1, Unicode/multiselect/two sources | `0a7aaf96f46276d63dcdc74787481a0e1def245b4145df84c7e8e879da592d66` |
| q1, reversed key order/absent URL | `b51b2afb7892b5749f46473416a62dd0872be6169b188531e29f4933adbadd8b` |
| g1, complete approved synthetic entry | `5db6f6761bb2b6c0fe673850cc19faef7311524ecf138b9340a1ea1eda3495a9` |

Catalog approval binds exact source + guideVersion + question ID + g1. Different versions cannot relabel an old approved digest. Normal promotion can retain old approved versions; explicit revocation prevents frozen-item validation and selection of the affected entry. A validated release envelope may retain revoked entries for coverage diagnostics; it is not permission to present those entries. Publication validates the complete declared release against its catalog, and standalone use additionally validates all published entries against the complete source bank. Malformed entries fail the release as a unit. Release fetching has a 15-second abort/race bound, pre-parse streaming byte limits, explicit retry, validated success caching and late-cancellation protection. Callers must perform the future Mock gate before requesting it.

## 6. Guided-session transition rules

Creation validates/recomputes the selected source set and freezes only its question/domain/guide subsets. Draft choices start empty even for post-exam sessions. Select replaces the chosen ID array (radio replacement, checkbox toggle intent or clear); invalid/duplicate IDs and exceeding selectionCount fail. Navigation retains drafts and hint maxima. Hints advance exactly 0→1→2→3 independently of selection and cannot advance after commitment.

Commit requires exactly the known distinct option count, locks the first selection/time/command and derives correctness with existing exact-set semantics. Wrong exact sets are allowed commitments. Blank/partial/extra/duplicate responses cannot commit. Identical command replay returns the same committed session without increasing revision, even when expectedRevision is stale. Different subsequent commitments/edits/hint requests fail. Cross-question reuse of a commitment command ID fails.

Every effective transition increments revision once and normalizes bookkeeping time to max(now, updatedAt). Invalid/no-op commands do not change input. Cross-record validation preserves ID/origin/source/items/guide version/start and rejects hint regression or altered commitments. The last commitment leaves feedback in place; Finish requires all commitments and records completion once. Completed sessions are read-only; repeated Finish is an idempotent no-op. There is no timer or Mock score.

Precommit presentation is an explicit allowlist of question ID/stem/options/count, draft selections and already-revealed hints. It contains no key, explanations, comparisons, glossary, source detail or correctness. Full feedback is returned only when a commitment exists. Client resources remain inspectable; this is an ordinary experience boundary, not a secrecy/security claim.

Learning counts use committed responses only: correct/committed/total, correct-without-hints/committed and total hints. Revisit includes unfinished, incorrect or hint-assisted items. All post-exam sessions carry “Answers may already have been seen”; standalone repeat language also avoids mastery claims.

## 7. Selection and compatibility behavior

Recognition requires exact validated schema/exam/version/difficulty; legacy absent difficulty may be inferred only from an exact recognized source and still requires q1. Conflicting explicit difficulty and newer/custom identities do not fall back. Catalog injection is an explicit test dependency, not a synthetic production switch.

Eligibility iterates frozen source order, returning matched IDs, eligible pairs, excluded IDs/reasons and exact reason counts. Approved ten-item coverage of a 60-item source is legitimate partial publication. Standalone selection partitions approved items deterministically into disjoint 5/10 sets. The set index must be valid and complete; unions of the offered sets reach all approved items in the ordinary ten/full-sixty case. No random rotation or duplicate questions.

D12 remains pending: affected revoked/mismatched published content or an incomplete trailing partition returns policy-pending; insufficient requested cardinality returns insufficient-coverage. This temporary refusal is not an owner-approved final revoked/partial-set product policy. Nothing silently shortens a set or advertises unreachable content.

Post-exam filters are Incorrect & Unanswered (default), Flagged and All Questions. Only submitted reports qualify; all eligible matched questions are included up to 60, independently of standalone size. The existing outcome helper classifies a nonblank partial answer as incorrect, so it belongs in the default union. Filter denominators are matched Y, with eligible X and typed exclusions; zero is valid coverage but cannot start an empty session. Original answers/flags/score are not copied into retry controls or written back to the source.

## 8. D7–D9 Mock protection contracts

D7 inventory is the deduplicated union of indexed IDs and every exact `pcao-f:attempt:v1:` raw key. Owner keys and lookalike namespaces do not count. Orphans are included; dangling indexed IDs warn only after an explicit missing-record read. A raw key disappearing during the scan, an omitted read or a contradictory claimed-complete inventory fails closed. No index repair occurs.

D8 fully validates every present record using the existing parser, including bank, dates, saved grades, answers and key/ID binding. A live unfinished Mock blocks regardless of owner. At its verified deadline, an expired unfinished record no longer blocks standalone, even when App finalization failed. It remains ineligible as a post-exam source. Another live or unknown record still blocks. Guided performs no finalization, submission or guessed-deadline inference.

D9 gate states are checking, clear, blocked, recovery-required and unsupported. Malformed-index + complete valid raw inventory yields clear with a nonsensitive warning; corrupt, unreadable or unsupported records, incomplete enumeration, storage failure and checking timeout yield typed recovery-required + explicit Retry. Unknown failures take precedence over valid live records. Unsupported coordination fails closed. Output exposes no record IDs, owner, selections or deadlines.

Checking budget is **5000 ms**, including future lock wait, scan and validation; late clear results must be discarded. Input safeguards cap enumeration at 65536 keys, union/read records at 4096 attempts, each record/index at 4 MiB and total record bytes at 16 MiB. Limits fail closed with resource/inventory errors. The browser adapter must actually enforce the elapsed-time policy in Phase 4; this phase supplies the pure injected-time contract only.

Non-destructive recovery requires preserving original bytes, explicit fresh complete Retry, generic privacy-safe copy, current source access before ordinary Mock resume and separate authorization for any action changing Mock data. Safe actions are Retry, existing History and authorized owned-Mock resume. There is no deletion/quarantine/export/overwrite/bypass. Recovery UI, cross-tab freshness, shared-lock integration and proof of privacy/suspension remain Phase 4/public-release requirements.

## 9. Test execution results

Evidence root: [phase-1 evidence](../../test-results/guided-practice/phase-1/). Commands run in its isolated working-tree copy, with existing dependencies, no private environment copied, guest/build account/telemetry flags off, Node external networking denied, Chromium deny proxy, fresh nonpersistent contexts, intercepted synthetic accounts/telemetry, owned servers, two-worker full units and sequential browser suites. Existing test deadlines/assertions/retries are unchanged.

| Check | Actual result | Evidence |
| --- | --- | --- |
| Initial typechecks | Three development failures retained: synthetic-fixture syntax; selector union typing; test mock tuple typing | `typecheck-initial`, `typecheck-repair-1`, `typecheck-tests-initial` logs/results |
| First focused Guided run | 141 passed, 1 failed: changed option order returned invalid-source before fingerprint mismatch | [initial log](../../test-results/guided-practice/phase-1/guided-initial.log) |
| Focused run after validation-order correction | 142/142, six files | [focused log](../../test-results/guided-practice/phase-1/guided-after-validation-fix.log) |
| Initial full units | 356/356, 29 files, two workers | [initial full log](../../test-results/guided-practice/phase-1/unit-initial.log) |
| Final-source typecheck | PASS, exit 0 | [candidate log](../../test-results/guided-practice/phase-1/typecheck-candidate.log) |
| Final-source complete units | PASS 363/363, 29 files, two workers; 149 new synthetic Guided cases and all 214 existing cases | [candidate full log](../../test-results/guided-practice/phase-1/unit-candidate.log) |
| Final-source production build | PASS, 518 modules; existing >500 kB warning, main 665.01 kB/PDF 1834.25 kB | [candidate build log](../../test-results/guided-practice/phase-1/build-candidate.log) |
| Guest initial full browser suite | FAIL 134/135, zero skips/retries; landscape legacy PDF timed out waiting for download, and screenshot shows the app export error | [initial JSON](../../test-results/guided-practice/phase-1/guest-initial.json) |
| Guest bounded unchanged full rerun | FAIL 133/135, zero skips/retries; 768-pixel repeated PDF canceled and 1366-pixel first PDF download wait timed out, both at the original 30-second limit | [rerun JSON](../../test-results/guided-practice/phase-1/guest-unchanged-rerun.json), [log](../../test-results/guided-practice/phase-1/guest-unchanged-rerun.log) |
| Account regression | PASS 32/32, zero skips/retries | [JSON](../../test-results/guided-practice/phase-1/account-initial.json) |
| Analytics regression | PASS 6/6, zero skips/retries | [JSON](../../test-results/guided-practice/phase-1/analytics-initial.json) |
| Recovery regression | PASS 8/8, zero skips/retries | [JSON](../../test-results/guided-practice/phase-1/recovery-initial.json) |
| Chromium fixed SHA vectors, final candidate | PASS 3/3; Chromium 156.0.8078.4 | [candidate vectors](../../test-results/guided-practice/phase-1/golden-browser-candidate.json) |

Each command's adjacent `*-command.json`/`*-result.json` records actual argv/cwd, UTC start/end, duration and exit. Earlier pass/failure logs are never merged into a new total. Browser regressions ran the unchanged application/test tree; subsequent additions were confined to unimported Guided modules/new tests. The final unit/build/vector checks use the final Guided source, with equality to the root candidate checked in the integrity manifest. All new guidance fixtures are synthetic; unchanged existing regression suites also exercise the reviewed bank files.

PDF failure investigation: the inspected initial landscape screenshot shows “The report could not be exported. Please try again.” The case deliberately switches offline after networkidle and expects the lazy PDF path to be ready. The existing Results catch suppresses the underlying export error, so these artifacts cannot distinguish a late lazy dependency from another generation failure. The unchanged rerun passes that landscape case but fails at 768 (second download canceled at timeout) and 1366 (first download event never arrives). These are separate failed full runs, not a combined pass. They occurred with sequential suites and two internal workers; this risk cannot be described as occurring only during overlapping suites. No PDF/Results/app/test change or timeout relaxation was made. No further retry-until-green or unrelated PDF implementation was performed. Source/built-asset identity establishes that Guided is not in this executed application, but does not resolve the intermittent failure.

The initial harness's `taskkill /T` cleanup returned OS access-denied errors; its first cleanup record correctly shows listeners remaining. Exact owned listener/launcher Node PIDs were then verified and stopped with native PowerShell Stop-Process. The final harness uses direct owned server PIDs and native cleanup. [Final cleanup](../../test-results/guided-practice/phase-1/service-cleanup-final.json) confirms no listeners on the five owned ports 4173/4232/4234/4236/4299; [lifecycle](../../test-results/guided-practice/phase-1/final-service-lifecycle.json) retains exact start/stop PIDs. The initial cleanup failure is preserved separately.

No new Guided UI/browser flow exists in this phase. Existing Mock/account/analytics/recovery suites are regressions. The supplementary isolated Chromium probe checks only the three fixed q1/g1 Web Crypto vectors. No educational, native screen-reader, physical device, live service, natural two-hour expiry or deployment acceptance is established.

## 10. Negative-path evidence

The new synthetic suites cover strict nested fields, versions/dates/UUIDs, blank/oversized guidance, array bounds, duplicate IDs/options/terms, explanation and source-index membership, corrupt sessions, premature completion, cardinality 1/2/3, shuffled exact sets, immutable first commitments, stale revisions and lost acknowledgements, sequential hint maxima, precommit output allowlists, incorrect/blank/partial/flagged cohorts, zero/partial/full coverage, source/difficulty/version/option-order mismatches, forged approval/digest edits/revocation, retained old versions and bounded network/cancellation/late responses.

Protection cases include indexed/orphan/private/duplicate references, missing/malformed index, dangling references, exact expiry, another live record, an actual synthetic failed App finalization preserving expired bytes, corrupt/unreadable/unsupported records, incomplete scans, storage failure/checking timeout, authorized recovery decisions and generic output. Static import checks prohibit Guided Mock writers/browser persistence and prove App/router/Results have no Guided integration. These tests prove technical boundaries; human hint leakage/source accuracy remains Phase 2 work.

## 11. Question-bank integrity and preservation

| Protected file | Required SHA-256 |
| --- | --- |
| `public/easy-question-bank.json` | `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4` |
| `public/question-bank.json` | `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` |
| `tests/fixtures/approved-question-content.md` | `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729` |

PASS: source and built banks match the values above, and the approved Markdown reference is unchanged. [Integrity record](../../test-results/guided-practice/phase-1/integrity.json) and [tested-source manifest](../../test-results/guided-practice/phase-1/tested-source-manifest.json) compare all 100 current source/test/public files against the tested copy. All 373 protected pre-existing nonignored files are unchanged; the only pre-existing edits from this task are the three documentation files listed in §2. Nineteen new nonignored files are exactly the ten domain modules, six tests, two synthetic fixtures and this review. Private environment hashes, Git index and HEAD remain unchanged. Existing ignored baseline evidence was read only; all new execution output is confined to the new Phase 1 evidence directory.

All three generated CSS/JavaScript assets are byte-identical to the accepted Phase 0-B guest build, including the main and PDF modules; none includes Guided code or synthetic guidance. No public guidance assets were created. Verification uses fresh synthetic browser contexts and isolated outputs, never the learner's real browser profile or saved attempts. Existing report formats/timer/scoring/answer visibility/navigation/account code and all prior tests remain byte-identical to the pre-task working tree. No new timing/grading/answer-visibility regression was observed; the PDF export failures remain explicitly unresolved.

## 12. Remaining risks and decisions

No real guidance is published or educationally approved. D12 final revoked/partial-set behavior remains an owner decision before pilot publication. D13 actual source access plus named author, independent reviewer and approver is required before Phase 2 content acceptance. D14 learner protocol remains due before Phase 6. The approved Phase 0 PGlite contention/PDF uncertainty/router POP warning and unrelated account-deletion timeout remain recorded; the current PDF recurrence and its broader sequential-suite condition are explicitly retained in §9. No unrelated fix or blanket production guarantee is claimed.

Storage durability, source-owner enforcement/cleanup, command-save/reveal acknowledgement, active-Mock freshness/lock/cross-tab integration and a safe recovery interface remain later authorized implementation work. The pure domain cannot infer browser authorization from a report object: post-exam access scope is an input that future ownership adapters must verify. A validated session must be rechecked against current catalog/access/gate before display; an old in-memory validation is not ongoing authorization.

## 13. Objective Phase 1 acceptance checklist

| Criterion | Status |
| --- | --- |
| Strict independent source/overlay/subset/session/command/eligibility/protection contracts with resource limits | PASS |
| Exact Question type parity; full-bank validator unchanged and never used on subsets | PASS |
| Independent q1/g1 vectors; object order, every q1-bound field and source/version negatives | PASS; Python-fixed vectors, Node + Web Crypto + Chromium |
| Empty production catalog; injected synthetic catalogs; draft/forged/edited/revoked rejection | PASS |
| Pure exact-count 1/2/3 commands, monotonic hints, locked/idempotent first answer, explicit Finish | PASS |
| Restricted precommit presentation and committed-only derived correctness | PASS |
| Deterministic complete 5/10 sets and correct post-exam partial/blank/flagged semantics | PASS; D12 final partial/revoked-set policy still pending |
| D7 raw/index union; D8 verified expiry; D9 bounded typed fail-closed recovery/access contracts | PASS as pure contracts; browser adapter/workflow deliberately not implemented |
| All introduced negatives and unchanged existing domain tests, complete unit/type/build checks | PASS; 363/363 including 149 new and 214 existing |
| Applicable existing isolated browser regressions | PARTIAL: account/analytics/recovery pass; both complete guest runs fail PDF cases |
| Bank/reference bytes, all existing application/test files, stored-data boundaries and production exposure | PASS within isolated execution; no real learner data accessed or modified |
| No Guided UI/routes/durable DB/cloud/AI/deployment/commit/push or Phase 2 work | PASS |
| Technical/educational distinction and Phase 2 prerequisites documented | PASS; no educational approval claimed |
| Owner accepts Phase 1 exit | PENDING; never self-approved |

The domain foundation is ready for owner review. **Unqualified clean-regression acceptance is not established:** the current guest PDF failures need an explicit owner disposition or a separately scoped investigation/fix and verification. They do not authorize an unrelated Mock/PDF change in this Phase 1 task. D12–D14 retain their later deadlines rather than becoming invented Phase 1 editorial approvals.

## 14. Phase 2 prerequisites and stop

Owner review/acceptance of this Phase 1 artifact, disposition of its remaining guest PDF verification failures and separate explicit Phase 2 authorization are required. Establish D13 source access and actual author/independent reviewer/editorial approver, then approve the exact ten-item scope and source evidence during Phase 2. Settle D12 before pilot publication. Synthetic schema/hash tests are not editorial approval and cannot authorize writing real guides.

Stop after Phase 1. No Phase 2 content, Guided UI/routes/IndexedDB, cloud changes, runtime AI, deployment, commit or push is included.
