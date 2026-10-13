# Uploaded Intermediate bank validation

Date: 2026-10-13. The user approved the difficulty UI and uploaded `public/easy-question-bank.json` for validation before integration.

The uploaded file **passes the app's actual `validateQuestionBank(input)` function** from `src/domain/bank.ts`, using the default `requireReviewed=true`. The validator and uploaded JSON were not modified. Intermediate has not yet been enabled or connected to this file.

| Property | Validated value |
| --- | --- |
| Schema version | 1 |
| Exam ID | `pcao-f-practice-easy-01` |
| Dataset version | 1.0.0 |
| Supplied title | Independent PCAO-F Practice — Easy |
| Content status | reviewed |
| Questions | 60 |
| Duration | 120 minutes |
| Domains | D1=8, D2=13, D3=7, D4=10, D5=7, D6=9, D7=6 |
| Item types | 48 single-answer, 10 select-two, 2 select-three |
| Options | 252 |
| Source entries | 70 |
| SHA-256 | `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4` |

No schema or internal-consistency errors were returned. This includes unique IDs, required fields, option/key membership and cardinality, complete option explanations, defined domains, and the prescribed question/domain totals. This is app-contract validation, not an independent review of the answer keys.

Raw output: [test-results/easy-bank-validation.json](test-results/easy-bank-validation.json). Reproduce with `node .localtest/bank-validation/validate-easy-bank.mjs`.

The existing Advanced bank and the application's difficulty catalog were left unchanged. UI approval and bank validation are complete; connecting the uploaded file to Intermediate is the next implementation step. Earlier 53-unit/95-Chromium evidence remains the latest full-app run; this validation does not imply another full test suite or build.
