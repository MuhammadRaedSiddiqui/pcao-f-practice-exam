# D14 local pilot setup

**Current D14 policy — owner-authorized amendment, 2026-10-18:** [Owner-led evaluation and explicit final pilot acceptance](../D14-OWNER-ACCEPTANCE-AMENDMENT.md) replace the mandatory three-external-student requirement for the current ten-question Intermediate pilot only. No recruitment, participant consent, interviews, participant observation records or three-student evaluation are required. Policy authorization does not evidence a personal walkthrough; final owner pilot acceptance remains pending. No independent learner-usability or measurable learning-effectiveness evidence has been obtained. Native accessibility/device coverage, historical PDF/recovery release-risk decisions and full Phase 6 acceptance remain separate outstanding requirements. Participant arrangements, tasks and templates below are superseded planning history; technical setup and native accessibility instructions retain their separate scope. Production remains disabled/catalog empty; no source/content/configuration change, application-suite rerun, publication, deployment, commit, push or Phase 7.

Prepared 18 October 2026 (Asia/Karachi). Authorized for local preparation and technical smoke checks. Recruitment and observation require the owner's separate approval of the arrangements below. D14 and full Phase 6 remain incomplete; no Phase 7/8 or publication authority is supplied.

From PowerShell on the owner's computer:

```powershell
Set-Location 'C:\Users\HP\OneDrive\Desktop\PCAO-F'
node tests/local-pilot/launch.mjs
```

Use the installed Node.js and existing repository dependencies; preparation was checked with Node 24.18.0. No dependency installation or internet service is required when those dependencies are present. Open [local Guided Practice](http://127.0.0.1:4256/guided) in a current Chromium browser supporting Web Locks, IndexedDB and Web Crypto. Use a dedicated browser profile containing no real accounts, Mock attempts or personal reports. Use exactly this origin and port for resume. Do not use a tunnel, LAN address, hosting provider or an existing personal app profile. If the port is occupied, stop the owned pilot process or identify the conflict; the launcher will not choose another origin.

Stop with **Ctrl+C in the launching terminal**. Check the page no longer loads from the server. Stopping leaves saved sessions intact. Restart with the same command and browser profile to resume. A running development server is required to reload the app; this is not an offline shell installer. Do not edit source, drafts, pins or tooling during a session; restart and record a new identity after any authorized change.

## Selection and storage

Leave Session length at **5 questions**. There are exactly two ordinary five-question sets:

| Set | Frozen source-order membership | Planned participant |
| --- | --- | --- |
| 1 | Q4, Q5, Q6, Q10, Q12 | P01 |
| 2 | Q18, Q25, Q26, Q33, Q59 | P02 |

P03's set must be fixed before observations, with familiarity rationale recorded in the facilitator plan. The existing optional ten-question session contains these same ten guides; do not use it for the five-question D14 assignment. Advanced has no guides. No synthetic educational records appear. Initial screen positions are eligible-set ordinals, not original question numbers; use this membership table to label notes.

Progress uses the existing **browser-local IndexedDB** database `pcao-f-guided`, store `sessions`; it is not the browser's `sessionStorage` API. Reload and closing/reopening a normal profile retain it subject to browser storage policy. No account, cloud backup, migration, telemetry or hosted mutation occurs. Hints and feedback follow existing durable-save/locked-answer contracts. Browser data clearing, profile deletion, private-mode closure or storage eviction can remove progress. Repeated questions are exposed practice, not evidence of unseen mastery.

For each real participant, create a separate dedicated local browser profile or an owner-approved equivalent that prevents access to another participant's sessions. Do not enter participant names in the app. Keep facilitator notes and consent references outside the repository, under the approved storage/retention plan. Remove only the selected Guided session through its existing confirmation, or delete the dedicated profile after approved retention/withdrawal processing. Never clear a personal profile or repair/delete Mock records to bypass protection. An active or unverifiable Mock pauses Guided as designed.

## Artifact and isolation

At startup the excluded [preparation module](../../../tests/local-pilot/prepare.ts) verifies pinned owner-led acceptance/waiver, unchanged banks, draft SHA-256, q1, prospective g1, guideVersion 1.0.0 and opaque review IDs. Only `approval.status` is projected from draft to approved in memory. Strict existing release, catalog, digest, fingerprint, selector, storage, ownership and active-Mock rules remain in force. Original drafts, ledger approvals/null approvedG1, source banks and production catalog are unchanged.

Record the `artifactId` from [local manifest](http://127.0.0.1:4256/__pilot/manifest) before each session, plus the session URL UUID. Startup also writes `test-results/guided-practice/local-pilot/pilot-manifest.json`; copy that machine-readable manifest to the approved evidence location. Its SHA-256 identity binds all app/public files, content authoring files, pilot tooling, package lock, ordinary build/hosting configuration and sanitized service policy. The checked candidate and all ten identities are in [readiness](PILOT-READINESS-REPORT.md).

The configuration under `tests/local-pilot/` is excluded from hosting by the existing `tests/` rule. Guide JSON is served only from loopback memory, with no public guide files or disk publication. The plugin replaces the same Guided runtime boundary used by synthetic tests; it does not create another app. It disables `.env` loading and overrides account/recovery/PostHog settings. The pilot configuration refuses build, preview, hosting/CI and non-loopback/alternate-port/proxy overrides. Ordinary builds use the unchanged production runtime/catalog and remain disabled with zero guides. The pilot is development tooling; never distribute its development files/server as a hosted artifact.

Source references are readable after commitment without opening external sites. Do not follow external course links during local observation; external source review is outside this pilot session. Do not enter credentials or use real certification reports.

## Focused verification commands

Run sequentially; browser QA uses one worker and fresh contexts:

```powershell
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run tests/local-pilot/pilot.test.ts tests/guidedPilotContent.test.ts --configLoader runner --maxWorkers 2
node node_modules/@playwright/test/cli.js test --config tests/local-pilot/playwright.config.ts
```

Stop a manually launched pilot before the browser command, which owns its server and rejects reuse. These tooling checks are separate from consented learner observations and native accessibility acceptance. Existing engineering regression evidence is reused; no full historical suite rerun is required for this unchanged app.
