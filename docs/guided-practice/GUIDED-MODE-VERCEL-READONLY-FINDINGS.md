# Guided Mode — read-only Vercel findings

19 October 2026. The owner confirms **https://pcao-f-practice-exam-one.vercel.app** as the official Guided production destination. Authenticated read-only CLI inspection independently verified the corresponding project and deployment. No project was created, linked, relinked, configured or deployed. Phase 7 remains accepted.

| Observed item | Result |
| --- | --- |
| CLI / scope | Vercel CLI 59.17.0, `muhammad-raeds-projects` |
| Verified project | `pcao-f-practice-exam`, **`prj_xORMQWCLTT939SudblG9TjeIGJqL`** |
| Official alias target | **`dpl_5K9V9V8HiRyciEuUyAU7oWYbvFpj`**, production, Ready |
| Deployment URL | `https://pcao-f-practice-exam-p97skq389-muhammad-raeds-projects.vercel.app` |
| Project settings display | Root `.`, Node 24.x, Vite; build command displays `npm run build` or `vite build`; output directory None; install command displays package-manager defaults. These project defaults do not override a deployment's actual checked-in configuration automatically. |
| Repository ordinary deployment | `vercel.json`: `npm ci`, `npm run build`, `dist`, explicit Guided/history/settings SPA rewrites. This file is unchanged by packaging work. Its contents do not prove the existing hosted deployment contains those newer routes. |
| Local project link | No `.vercel/project.json`; checkout remains unlinked. The project was selected explicitly for read-only commands, not inferred from an alias alone. |
| Prior public route observation | Root practice app reachable; `/guided` was Vercel 404 in the preceding assessment. No hosted Guided acceptance or new host smoke is claimed. |

Executed reads: `vercel inspect <official origin>`, `vercel project inspect pcao-f-practice-exam --scope muhammad-raeds-projects`, and `vercel env ls production/preview --project pcao-f-practice-exam --scope muhammad-raeds-projects`. An initial updater-worker timeout/EPIPE and sandbox network EACCES preceded successful authorized network reads; neither indicates a project/deployment defect. Update checks and CLI telemetry were disabled for subsequent inspection processes only. No persistent setting was changed.

Production variable names/targets found:

- `VITE_ACCOUNT_HISTORY_ENABLED`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_POSTHOG_ENABLED`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`
- `VITE_ANALYTICS_ENVIRONMENT`

**Preview has no configured variables** in the inspected project. No `GUIDED_RELEASE_ORIGIN` was listed for either environment. System-variable exposure such as `VERCEL_PROJECT_ID` was not certified by this listing. Those are concrete future-hosted-build blockers: the prepared configuration requires the verified project ID, confirmed origin and explicit valid service policy; it does not silently adopt absent Preview service defaults.

The listing exposes encrypted representations, not verified effective boolean values. **No environment values were pulled/decrypted or saved.** Automatic approval review rejected a proposed `vercel env run` classifier because it would load all production values, including secrets, into its process even if its output were redacted. The rejected action was not executed or worked around. Effective remote service flags and endpoint/key validity remain unverified. Owner-supplied non-secret settings evidence is a safe way to resolve the policy questions; actual service configuration needs separately authorized administration.

Source inspection shows existing accounts require the account flag plus Supabase URL/publishable key; recovery is enabled by default for configured accounts unless explicitly false. Analytics requires its flag/key/host, disables autocapture/session recording and scrubs Guided/content/auth information. This logic is unchanged. Presence of variable names does not prove their enabled values or real email delivery. The new build preserves normal production environment loading and compares local resolved service values internally without printing them. That local equality proof is not equality with uninspected remote values.

Evidence: [sanitized findings](../../test-results/guided-production-preflight-20261019-01/vercel-readonly-findings.json), [prepared target pin](../../release/guided/target.json), and [packaging report](GUIDED-MODE-PRODUCTION-PACKAGING-IMPLEMENTATION-REPORT.md). No private browser/session inventory was performed. No existing deployment, environment variable, account, analytics project or recovery policy was changed.
