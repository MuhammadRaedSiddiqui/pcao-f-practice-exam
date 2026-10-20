# Guided Mode — content and version integrity

19 October 2026. The accepted candidate is unchanged: `118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba`. `node tests/phase7-integration/build-candidate.mjs` re-verifies owner authorization, source/draft/review/q1/g1 identity and strict release/eligibility checks; `candidate-reverified.log` retains the result. It did not author or rewrite guidance.

| Local staging file | Entries | SHA-256 |
| --- | --- | --- |
| `guided-release/manifest.json` | 60 current bindings and original input pins | `4e3b59ea6214a53b998429cb4e5d6bc76cb20ce75bda2be44725f900324b73e3` |
| `guided-release/catalog.json` | 1.0.0 first, 1.1.0 last | `a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8` |
| `guided-release/intermediate-1.1.0.json` | 60 | `100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67` |
| `guided-release/intermediate-1.0.0.json` | 10 | `e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8` |

All four are byte-identical copies of the original excluded candidate. The build helper rejects even whitespace drift. The [manifest](../../guided-release/manifest.json) enumerates all sixty IDs, q1, draft SHA, review ID, g1, authorizing record and source document. The [catalog](../../guided-release/catalog.json) retains the exact seventy version-specific digest bindings. Runtime schema/digest/source/approval validation remains mandatory after transport. No validator, approved digest, revocation rule or educational waiver was weakened.

Source remains schema 1 / `pcao-f-practice-easy-01` / bankVersion 1.0.0 / Intermediate. Coverage stays 60 unique IDs, domain totals 8/13/7/10/7/9/6, response counts 48 single / 10 double / 2 triple, 180 hints and 252 option comparisons. Q26 and Q59 are the select-three items. All current starts select 1.1.0 through retained catalog order. No silent migration, rehashing or cross-origin copying occurs.

The original 1.0.0 pilot's exact ten identities, approvals/waiver and frozen feedback remain intact. Controlled production-build tests seed exact old sessions and reopen them without fetching the old asset; their retained authorization is still required. Existing domain tests reject missing/revoked maps, altered source/q1/g1/review fields and incompatible versions. Retaining an asset without its exact authorization does not permit resume. Rollback must preserve both safe maps and a compatible reader; the empty default catalog is a suspension, not a compatible enabled rollback.

Historical pilot origin 4256, Phase 7 origin 4258 and new normal-app test origins 4260/4261/4262 have separate browser storage. Controlled fixtures prove no real production history or cross-origin migration. The default `pcao-f-guided` database/version/store and Mock storage contracts are unchanged.

`preservation-final.json` compares this work's captured baseline, including every historical screenshot, original candidate file, original educational document and bank. Pre-existing dirty screenshot bytes are preserved as found; this work does not restore them from Git or relabel earlier incident history. New code is covered by exact current pins, not exclusions of educational checks. All authoring drafts/actual approval fields remain unchanged. No new human review, owner personal walkthrough, source inspection or learner study is claimed.
