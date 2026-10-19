# Guided Mode — production preflight risks and owner decisions

19 October 2026. This dated successor updates the [assessment register](GUIDED-MODE-OPEN-RISKS-AND-DECISIONS.md) without rewriting its historical evidence. **Local packaging is verified; production readiness is not declared.** Phase 7 remains COMPLETE / OWNER ACCEPTED. Public enablement, hosted Preview/Production deployment, commit/push and Phase 8 remain unauthorized.

## Decisions now resolved within this authorization

- Owner confirms **https://pcao-f-practice-exam-one.vercel.app** as the production origin. Read-only Vercel inspection verifies project **`prj_xORMQWCLTT939SudblG9TjeIGJqL`**, name `pcao-f-practice-exam`, scope `muhammad-raeds-projects`. The checkout remains unlinked and hosting settings unchanged.
- Owner authorizes **preparation and local verification** of both exact approved catalog rows/assets, legacy first/current last. The package retains ten 1.0.0 and sixty 1.1.0 authorizations. This does not authorize public publication or imply actual historical production sessions exist.
- Local packaging, production compilation, asset integrity/HTTP policy and safe frozen-reader compatibility were exercised. Final units **851/851** and corrected production browser checks **12/12** passed. These are actual current results, not risk acceptance or hosted/native results.

## R1–R4 remain open and unaccepted

| Risk | Updated disposition | Exact remaining decision |
| --- | --- | --- |
| R1 — aggregate five-second unit timing | Current unchanged-deadline full runs passed 849/849 before two new packaging guard cases, then **851/851** including those cases. Original **837/838**, assessment **834/838** and ordered probe **87/88** remain failed evidence. No original lifecycle/assertion/deadline was changed and no causal timing fix was implemented. Passing runs demonstrate variability, not resolution. | Accept the documented residual timing/performance uncertainty for a specific release, or authorize separately scoped investigation/remediation and appropriate verification. No owner acceptance is inferred from packaging authorization. |
| R2 — historical PDF cancellation | Original cancellation/timeouts retained. Prior normal-app sequential guest **139/139**, including PDF readiness/export checks, remain historical limited evidence. This packaging task did not execute actual new PDF downloads or resolve cancellation cause. | Require supported-browser/device/actual-host PDF verification; accept residual cancellation risk explicitly or authorize further diagnosis. |
| R3 — historical password recovery intermittency | Historical missing-dialog and separate cold-start aggregate timeout remain distinct unresolved causes. Prior synthetic **8/8** is preserved. Current packaging preserves account/recovery code and normal environment policy but does not prove real email, redirects or remote enabled flags. | Confirm effective remote policy through approved non-secret evidence, plan authorized disposable-account recovery checks, and disposition residual intermittency. |
| R4 — resource pressure / Set 1 timing | Two-worker **40/47**, six 30 s failures, 3055 ms response against 2500 ms, CPU/memory observations and Set 1 aggregate failures remain intact. No new forced-pressure or equivalent-load test was run. Current sequential checks do not establish load stability. | Explicitly accept uncertainty or authorize bounded resource work. Keep one-worker QA policy; no silent response-budget relaxation. |

Earlier setup/teardown and 36-image overwrite/restoration incidents remain preserved under R5/R6 in the preceding register. Current sequential browser setup/teardown exits cleanly and old screenshots remain byte-identical; these limited findings do not erase incident history or demonstrate host rollback.

## New preflight findings and blockers

| Finding | State and release impact |
| --- | --- |
| Audit production-mode mistake | Initial verification helper called Vite `resolveConfig` before build, which set `NODE_ENV=development` despite production mode. Initial 12/12 browser evidence therefore used development React compilation and is **not production-compilation acceptance**. Standalone release builds were production compiled. Diagnostic reproduced `isProduction:false`; audit now sets/asserts production, wrapper rejects conflicting NODE_ENV, corrected builds/browser 12/12 and matching fallback are retained separately. No runtime/content fix or historical test relaxation occurred. |
| TypeScript catches | Initial unsupported `ResolvedConfig.isPreview` use and later implicit server-list types were corrected in new packaging/QA code; failed logs retained, final TypeScript passes. No known remaining release-blocking functional/accessibility defect was confirmed within tested local scope. This is sampled coverage only. |
| Preview environment empty | Verified no Preview variables. Hosted profile now rejects absent explicit account/analytics policy and invalid required enabled-service configuration. Preview needs separately authorized environment administration and confirmed service/attribution policy; no silent defaults/disabled services are approved. |
| Effective production values blocked | Variable names verified; values not fetched. Automatic approval review rejected `vercel env run` because it would load production values including secrets. No workaround was executed. Non-secret owner-provided flags/policy evidence or separately approved administration is required. |
| Hosted identity/configuration | Project/production alias verified read-only. Required `GUIDED_RELEASE_ORIGIN` is not configured, and automatic `VERCEL_PROJECT_ID` exposure still needs verification. The proposed staged configuration is not active on Vercel. |
| Clean host build / cache / routing | Local production compilation/HTTP verification passed. No clean hosted npm install, Vercel Preview build, actual-host headers/assets/routes or rollback rehearsal occurred. Local preview middleware is not a Vercel header test. |
| History / rollback | No private user history inspected or transferred. Both versions retained conservatively. Local frozen fixtures and fallback work in disposable same-origin contexts; no actual safe hosted rollback deployment ID exists yet. Feature-off/empty-catalog suspension blocks saved access. |

## Minimum manual matrix — proposed, NOT RUN

The following exact **product combinations** are proposed for the minimum release execution scope, subject to owner support-policy approval. They do not declare these combinations tested or set a final version support range. Pin actual OS/build, browser/engine and assistive-technology versions before execution; those version pins are currently missing, so native support acceptance remains a release decision.

| ID | Proposed combination | Required execution |
| --- | --- | --- |
| M1 | Windows 11 + Microsoft Edge + Windows Narrator | Landmark/heading traversal; single/two/three response labels and counts; Q26/Q52 table headers/scroll; Q47 tree; hint expanded/save states; locked feedback, completion/review, retry and focus announcements. Keyboard-only Enter/Space/arrows/Tab/Shift+Tab, visible focus, no traps; 200%/400% zoom and Windows contrast mode. |
| M2 | Windows 11 + Google Chrome + NVDA | Repeat the critical native announcement/focus journey independently; check progressive hints, required count/disabled state, source/owner/recovery alerts and persisted feedback after reload. |
| M3 | Windows 11 + Mozilla Firefox (Gecko) | Keyboard/session lifecycle, IndexedDB/locks, two-tab protection, table/preformatted content, reload/recovery, current and frozen old guide versions; authorized actual PDF export. |
| M4 | macOS + Safari (WebKit) + VoiceOver | Native headings/forms/table/focus journey plus save/resume, protection, reload and authorized PDF/download behavior. Record exact supported macOS/Safari versions; they are not selected by a Chromium pass. |
| M5 | Physical Android device + Chrome | Touch target accuracy, table/code scrolling, portrait/landscape, text scaling, background/restore, durable hints/commit; no accidental double action; actual PDF. Record Android/device/browser versions. |
| M6 | Physical iPhone/iPad + iOS/iPadOS Safari | Same physical-touch/background/storage/layout journey on WebKit; pinch/text zoom, safe scrolling and actual download/share behavior. Record device and exact OS/browser versions. |

For **every row**, record operator, date/time, candidate and app/bundle manifest hashes, origin/project/deployment, device/OS build, browser/engine version, assistive technology version, viewport/zoom/input mode, steps and expected result, actual result, evidence links, defect severity, disposition and approver. All outcomes are **NOT RUN**. Do not fill a passing result by inference. If a combination is excluded, owner must explicitly approve that support limitation and affected users. No personal walkthrough, native accessibility audit, physical-device result or learner-effectiveness evidence is invented.

## Remaining owner decisions, in order

1. Approve or revise the proposed support matrix/version ranges and assign actual native/device/engine execution. Complete it or explicitly accept named limitations before final release.
2. Provide approved **non-secret** effective production flag/attribution policy evidence. Approve exact Preview service behavior and authorized configuration, including origin/project-ID exposure. No secret environment pull is required by this package.
3. Decide R1–R4 individually: further work or explicit residual-risk acceptance bound to the eventual exact release. Current passing runs do not make that decision.
4. Separately authorize the [specific hosted-preview stage](GUIDED-MODE-HOSTING-PREVIEW-VERIFICATION-PLAN.md), including only the staged-workspace link, agreed Preview environment administration, controlled Preview deployment and verification/rollback rehearsal on the verified existing project.
5. After Preview/manual results and a concrete compatible hosted rollback ID, make an **independent final production publication/enablement/deployment decision** under the [procedure](GUIDED-MODE-PRODUCTION-ENABLEMENT-AND-ROLLBACK.md). Commit/push and Phase 8 are not included automatically.

This work stops at prepared local preflight. Existing production and browser-private data remain untouched.
