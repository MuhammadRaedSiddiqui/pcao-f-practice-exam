# Signup automatic backup — 2026-10-16

The local fix is verified against the configured Supabase service using the rebuilt production app. Existing completed guest reports already migrated independently of the Settings checkbox; the missing behavior was that future-exam backup defaulted off for new accounts. The owner clarified that new accounts should enable this automatically, including accounts created without guest history.

## Change

- Signup enables and persists automatic backup for future new exams. The initial preference read skips signup initialization so the database's initial false value cannot overwrite it.
- Completed guest-report claiming/queueing remains independent of this setting. A preference-write failure displays a warning and proceeds to guest migration.
- Sign-in retains existing preferences, including an explicit opt-out. Users may still disable automatic backup in Settings.
- Signup explains both existing-report migration and future-exam backup. No database schema, Edge Function, reviewed bank, scoring or attempt-format change was needed.

## Real browser verification

Used real in-app Chromium with native accessibility actions, mouse clicks and keyboard typing. No Playwright runner, DOM locators, page evaluation, browser-state injection or request interception was used. This is a focused flow regression, not a new full-app QA run.

| Case | Result |
| --- | --- |
| Existing guest Intermediate report → create account → automatic backup without visiting Settings | Passed; existing 0/1000 completed report became **Backed up**, with its original date/score still displayed |
| New signed-in exam before visiting Settings | Passed; Q1=C, submission scored 17/1000 and automatically became **Backed up** |
| Reload of unchecked browser-session login | Passed; both reports reappeared and automatic backup remained enabled |
| Empty browser origin → signup | Passed; no device attempts or account reports were displayed, with no placeholder report |
| New exam after empty signup, before visiting Settings | Passed; submitted blank Intermediate report automatically became **Backed up** |
| Inspect new-account default after completing both flows | Passed; automatic-backup checkbox was enabled without manual activation |
| Explicit opt-out → sign out → sign in | Passed; checkbox remained off and reports remained private while signed out |

The existing guest report was created through the real app in the prior UI-fix turn and was present at the start of this run. Two additional reports were completed through browser controls during this run. The two browser origins were `http://127.0.0.1:4173` and `http://localhost:4173`. Browser evidence and screenshots are in `test-results/signup-auto-backup/`.

## Other validation

- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed; existing bundle-size warnings remain.
- `npm.cmd test -- --maxWorkers=2`: 193 passed, 11 skipped because both PGlite setup hooks exceeded 30 seconds.
- Unchanged focused retry: `npm.cmd test -- tests/archiveDatabase.test.ts tests/registrationDatabase.test.ts --maxWorkers=1 --hookTimeout=120000`: all 11 passed. All 204 tests across 20 files passed across these two runs, not in one full run.
- Public and built Advanced/Intermediate bank SHA-256 hashes match the earlier QA evidence: `e1a9f7b3f157320ea738a0a06a48327439b2d89902da64137ca03dddc7d2efea` and `f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4`.
- Repository-wide whitespace check reports pre-existing whitespace in `src/domain/attemptModel.ts`, `src/domain/bankValidation.ts` and `vite.config.ts`; these files were not changed for this fix.

## Scope and cleanup

No frontend deployment, hosted configuration change, migration/function deployment, email, commit or push occurred. The fix needs frontend deployment before the public site gains the new default. Existing accounts are not retroactively opted in.

The preference-write failure warning, stalled requests, offline signup, active-exam signup and other browser engines were not exercised in this focused browser run. Existing unit tests cover guest-record eligibility and byte preservation; this browser run verified the visible original report metadata and did not inspect browser storage bytes.

After final owner confirmation, disposable accounts `qa-auto-guest-1792136111099@example.com` (two QA report backups) and `qa-auto-empty-1792136282557@example.com` (one QA report backup) were deleted through the application. Both returned to the signed-out screen, and both deleted credentials were rejected on subsequent sign-in. Report removal follows the deployed account-deletion cascade; no independent database query was made. No credentials are stored in the evidence. QA tabs were closed, viewport overrides reset and the temporary preview server stopped.
