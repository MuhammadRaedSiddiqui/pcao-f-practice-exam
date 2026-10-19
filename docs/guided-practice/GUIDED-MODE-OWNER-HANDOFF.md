# Guided Mode — owner handoff

**Protected Preview update — 19 October 2026:** [Open the authenticated Preview](https://pcao-f-practice-exam-git-feature-e3fbe4-muhammad-raeds-projects.vercel.app/guided). Commit `2acad5c5346d82a1cc2562331cf9fed653cf6093` automatically deployed as Preview `dpl_PMTayBa6hfU8Mkqy4KEWDFtBYTGt`. Core hosted Guided/Mock/Results flows and both exact hosted assets were verified; [the deployment report](GUIDED-MODE-VERCEL-PREVIEW-DEPLOYMENT-REPORT.md) identifies the mandatory hosted gaps, including completed PDF download and controlled legacy replay. Local final checks pass 864 units and 251 sequential browser cases. Accounts/recovery/analytics are disabled by the separately approved Preview policy. Production is unchanged and remains a separate owner decision after the remaining release gates. The prior local handoff below is preserved history.

19 October 2026. Phase 7 remains closed; this handoff concerns the subsequent normal-app local integration. Start with the [completion report](GUIDED-MODE-COMPLETION-REPORT.md) and [exact verification results](GUIDED-MODE-INTEGRATION-VERIFICATION.md).

## Launch the normal app locally

From PowerShell in `C:\Users\HP\OneDrive\Desktop\PCAO-F`:

```powershell
npm run dev:guided
```

Open `http://127.0.0.1:4260/`. For a locally served normal **production build**:

```powershell
npm run build:guided
npm run preview:guided
```

Open `http://127.0.0.1:4261/`. These are loopback-only configurations; do not tunnel or publish their output. The build lands outside deployment `dist/`, under `.localtest/guided-mode/enabled/`. Ordinary `npm run build` retains the default configuration and emits no guidance assets. The accepted package is pinned under `guided-release/`; mismatch is a hard failure, not a reason to bypass validation.

The verified preview on port 4261 is left available for local review. If it is already running, open that address rather than launching a second listener. To stop a server you launch, use Ctrl+C in its terminal. Service state at handoff is recorded in `test-results/guided-mode-20261019-01/local-services.json`.

Use **Open Guided Practice**, keep five questions or choose ten, then select a fixed set. Twelve five-question sets or six ten-question sets reach all sixty current guides. Hints reveal progressively and save before display; they can be independently collapsed. Select exactly the requested number, then **Check answer**. That first saved answer is locked; feedback and every-option reasoning follow persistence. Complete all answers and use **Finish practice**. Completed sessions are read-only; deliberate review remains available.

Return to Guided Practice to resume or view saved sessions. Use the same origin/profile to preserve browser-local progress. Clearing browser data or eviction can lose it; there is no Guided cloud backup. Different ports are different origins; these commands do not move retained pilot/production data. Active or unverifiable Mock records pause guidance. Use the explicit Retry/recovery messages; never delete Mock records to bypass protection.

After a completed Mock, **Guided Review** offers Incorrect & Unanswered, Flagged and All Questions against that report's exact frozen source. The retry starts with empty responses/hints and does not change the report, grades, timestamps or PDF. Private source access remains required. Accounts are intentionally disabled in the local accepted-content configuration; synthetic account regression evidence is separate from hosted account operations.

## Repeat verification without overwriting historical evidence

TypeScript: `npm run typecheck`. Units: `node node_modules/vitest/vitest.mjs run --configLoader runner --maxWorkers 1`. Do not rely on npm forwarding an unknown `--maxWorkers` option. Keep strict test deadlines and record failures.

`node tests/normal-guided/build.mjs` produces enabled/disabled/enabled-empty local builds through the normal Vite configuration. Browser runs use `tests/normal-guided/playwright.config.ts` and `tests/normal-guided/regression.config.ts`, each with one worker and zero retries. For a new run choose a fresh excluded evidence root/configuration; the one-off `run-regressions.mjs` deliberately refuses existing log files. Never rerun it against old paths or execute historical screenshot-writing suites directly in the repository root.

The six deliverables link actual logs, failed attempts and screenshots. Native accessibility, physical devices, other engines, target-origin/real legacy scope, historical reliability dispositions and actual-host smoke/rollback remain separate [release obligations](GUIDED-MODE-RELEASE-READINESS.md). A future public release needs explicit authorization; no deployment, public enablement, commit, push or Phase 8 is part of this handoff.
