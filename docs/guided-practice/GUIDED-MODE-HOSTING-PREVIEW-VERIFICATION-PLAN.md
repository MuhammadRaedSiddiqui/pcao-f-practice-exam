# Guided Mode — exact proposed hosting-preview stage

19 October 2026. **NOT AUTHORIZED / NOT EXECUTED.** This is the next proposed stage after [local packaging](GUIDED-MODE-PRODUCTION-PACKAGING-IMPLEMENTATION-REPORT.md). Approval for a Vercel Preview is independent of the later final production release decision. No command below was used to deploy or link a workspace.

## Preconditions and target

Target only existing project **`prj_xORMQWCLTT939SudblG9TjeIGJqL`**, scope **`muhammad-raeds-projects`**, confirmed production origin **https://pcao-f-practice-exam-one.vercel.app**. Reinspect its identity and official alias immediately before an authorized stage; fail on any discrepancy rather than creating/relinking another project.

Use the locally prepared allowlisted source workspace **`.localtest/guided-production/upload-verified/`**, its exact inventory and [release manifest](../../release/guided/production-release-manifest.json). It contains source/public banks, exact approved staging inputs, locked dependencies, build helpers and the future hosting configuration as root `vercel.json`. It contains no `.env`, local project link, tests, draft authoring documents, screenshots or unrelated evidence. The root checkout's ordinary `vercel.json`/`.vercelignore` stay unchanged. Earlier `upload` and `upload-final` preparations are retained evidence, not the selected package.

Before any hosted action, obtain owner approval covering **this exact package, staged-workspace linking to the verified existing project, required Preview environment administration, and one controlled Preview deployment**. Do not grant production enablement implicitly. Read-only inspection found no Preview service variables; owner must explicitly approve their intended configuration. Do not copy secret values or private browser storage into this plan. Supply non-secret flag policy evidence and use an authorized administrator for necessary service settings.

The hosted wrapper selects profile from `VERCEL_ENV`; build mode and `NODE_ENV` must be production. It requires `VERCEL=1`, matching `VERCEL_ENV`, matching project ID, and `GUIDED_RELEASE_ORIGIN=https://pcao-f-practice-exam-one.vercel.app`. It also requires explicit account/analytics booleans, valid remote HTTPS endpoint/key configuration when enabled, and explicit analytics attribution when analytics is enabled. An absent recovery flag retains the existing default. It does not overwrite any service values. Confirm Vercel system project-ID availability and the required origin variable before building.

After that separate authorization, the operator may link **only the staged workspace** to the existing verified project, using the actual reviewed CLI syntax, then deploy it to **Preview** without `--prod`. Proposed commands to review at that time:

```powershell
vercel link --cwd .localtest/guided-production/upload-verified --project pcao-f-practice-exam --scope muhammad-raeds-projects --yes
vercel --cwd .localtest/guided-production/upload-verified --scope muhammad-raeds-projects
```

The staged root configuration calls `npm run build:guided:hosted`, installs with `npm ci`, and outputs `dist`. No host deployment/build has been executed to validate these commands or settings. No production alias is to be assigned during Preview. Preserve existing aliases and production deployment ID.

## Verification against the actual resulting preview URL

Record actual project/deployment IDs, preview origin, source/input digest, dependency lock, environment target/policy, build log and all emitted file hashes. A clean hosted install/build is still unverified; local verification used the existing installed locked toolchain. Hosting may legitimately emit different app bundles when its approved service values differ; exact educational bytes and approval maps must remain the same. Bind smoke evidence to the actual hosted artifact, not merely to a local screenshot.

| Check | Required evidence |
| --- | --- |
| Immutable assets | GET both exact `/guided/intermediate-1.0.0.json` and `1.1.0.json`: 200, exact SHA-256/length, JSON MIME, intended `public, max-age=31536000, immutable` cache policy. A nonexistent guide JSON must return a genuine error rather than SPA HTML. Never replace versioned bytes. |
| Routing | Root, `/guided`, `/guided/`, valid `/guided/session/:id` and slash variant survive direct load and reload. History/settings still work. Missing/incompatible sessions show safe recovery. Test asset paths are not rewritten by page routes. |
| Exclusions | Drafts, catalog staging file/manifest review metadata, tests/fixtures, local endpoints, synthetic accounts and evidence are not public endpoints or bundled data. Only the two approved guidance payloads are emitted. |
| Current content/version | New sessions use the last applicable row, 1.1.0: 60 current guides, twelve five-item/six ten-item sets; no semantic-version sorting assumption. Exact source, approval, q1/g1 and revocation enforcement remain intact. |
| Frozen compatibility | In fresh disposable controlled profiles **on this Preview origin**, create/seed authorized synthetic session fixtures using approved real content for both versions. Verify hints, locks, read-only saved feedback and reload even if its remote guidance asset is deliberately unavailable. These fixtures are not real historical production sessions. |
| Protection and sources | Live/corrupt Mock blocks guidance without mutation; source/owner loss blocks private retries; Results derives the exact frozen cohort, empty responses/hints and leaves original grades/report/PDF unchanged. Do not use or inspect private user records. |
| Service/privacy policy | Check approved account/recovery behavior with authorized disposable test accounts; no real user data. Test actual recovery redirect/email only with explicit arrangements. With approved intercepted/test analytics, verify normal attribution and absence of Guided/question/auth payloads. Do not infer real services from missing Preview settings or local synthetic regression history. |
| Native coverage | Execute the proposed minimum matrix in the [decision register](GUIDED-MODE-PRODUCTION-PREFLIGHT-RISKS-AND-DECISIONS.md); record exact OS/browser/assistive technology versions, operator and findings. These checks remain NOT RUN. |
| PDF/reliability | Actual supported-browser downloads/content, cancel/retry/offline/import readiness and recovery lifecycle; keep R1–R4 history. Sequential one-worker results do not establish equivalent-load stability. No forced two-worker pressure run is implied. |
| Compatible rollback | Rehearse a separately approved Preview rollback retaining both safe maps/assets/reader and the same disposable Preview-origin records; no cross-origin transfer. Verify old/current frozen sessions and correct new-start policy. Record actual compatible host deployment ID and rollback outcome. |

Use sequential one-worker, zero-retry browser QA with unchanged applicable assertions/deadlines and a new excluded evidence directory per run. Keep setup/failure/teardown outcomes, screenshots and actual exit codes. Never route output to historic screenshot paths. Stop on approved identity drift, weakened protection/privacy/session contracts or material redesign.

Return Preview findings, unresolved risks and the exact proposed production artifact to the owner. **A successful Preview is not a final production release decision.** Production publication, public flag/catalog enablement, deployment, commit/push and Phase 8 remain separately unauthorized.
