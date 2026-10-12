# Question-bank correction and validation

The question bank now contains complete grading metadata reconstructed from the supplied ten course files and the explicit facts in each question. These are newly audited practice keys, not recovered Mock Builder records or official exam keys.

## Corrections

- Numeric `schemaVersion: 1`.
- Bank-level `expectedQuestionCount: 60` retained; each domain now uses `expectedQuestionCount` instead of `expectedCount`.
- Removed draft `readiness`, `provenance` and domain `publishedWeightPercent` fields from the runtime file.
- Dataset version is `1.1.0`.
- Added 60 correct answer sets, 60 overall explanations, 254 individual option explanations and 100 references to exact sections of the supplied course files.
- Question wording, option order, Markdown tables, quotations, code blocks, selection counts and primary domains are unchanged.

## Validation completed

- Reopened the written JSON and validated all required content fields, unique IDs, option IDs, key cardinality, domain membership and totals.
- Compared every stem and option against both the original JSON and approved 60-question Markdown; all match exactly.
- Compared all 60 Markdown question blocks with the accepted batch files, using corrected Batch 3 and original Batch 5; all match. Corrected Q23/Q24 and unchanged Q45 are preserved.
- Confirmed 48 single-answer, 10 select-two and 2 select-three items, containing 254 options.
- Confirmed domain totals D1=8, D2=13, D3=7, D4=10, D5=7, D6=9, D7=6.
- Checked every reference title, exact section heading and URL against the supplied local course text. References support principles; hypothetical scenario details and calculations come from the question itself. No live-site revalidation was performed.
- Reviewed each key and alternative against the stem's decisive constraints, including exclusion coverage, source authority, chronology, authorization boundaries and quantitative conditions. No unresolved key ambiguity was identified in this review.
- Recomputed the numerical conditions in Q1, Q5, Q8, Q23, Q26, Q49, Q52, Q57 and Q58.
- Exercised exact-set scoring over every possible option subset and every permutation of correct sets: 1,296 cases passed. Full-correct and all-blank attempts score 60 and 0 respectively. This exercises a standalone reference scorer, not the app's grader.
- Rejected 11 deliberately invalid fixtures covering missing grading fields, invalid keys, duplicate IDs, wrong counts, old field names and extra draft metadata.

## App handoff: still required

The app's actual schema, validator and repository were not supplied. The local checker enforces the documented format and reported fixes, so this is not evidence that the app's strict validator has passed. Domain `title` and the `optionExplanations` mapping retain the draft's documented shape; if the actual schema differs, adapt those metadata shapes without changing question content or weakening required grading validation.

1. Replace `public/question-bank.json` with the delivered bank; a root upload is not the runtime asset.
2. Run the app's real validator, tests, type checking and production build.
3. Check the runtime fetch and grading of single, multiple, partial and blank responses.
4. Verify old attempts retain their frozen snapshots and new attempts use version `1.1.0`.
5. Enable attempts only after the actual validator and app checks pass.

Existing approved wording has been preserved, including Q45's previously accepted easier alternatives. This correction is not a difficulty redesign or calibration against the live exam.

## Checksums

- Corrected JSON SHA-256: `de3c2c3f88208666dfed5265f907846e8a89b94520fe12eba85bd16a31ada58b`
- Approved source Markdown SHA-256: `7cf994a46f4dbb36951a2ae943f43e288025676e2937703007c8a3930e89c729`
