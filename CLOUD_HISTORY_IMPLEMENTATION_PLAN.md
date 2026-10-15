# Supabase account history implementation plan

Date: 2026-10-14
Final provider/authentication decision: Supabase with email and password signup/sign-in only, without mandatory email verification. Aiven is retained solely as a historical comparison.
Status: Implemented and verified locally on 2026-10-14. The hosted migration/functions and HTTP/SDK integration checks are complete; production frontend rollout, SMTP/browser verification and backup/restore rehearsal remain pending. See [CLOUD_HISTORY_VERIFICATION.md](CLOUD_HISTORY_VERIFICATION.md) and [SUPABASE_SETUP.md](SUPABASE_SETUP.md). The original design/sequence below is retained for reference.

## 1. Outcome and release boundary

Add optional Supabase accounts and durable cloud storage for completed practice reports while preserving the browser attempt engine. A user can complete an exam offline, back up its full report when connectivity returns, and open the same report on another device after signing in.

Release 1 includes password signup/sign-in without mandatory email verification, account-owned completed reports, automatic migration of completed guest history on signup, explicit import of additional local history, automatic backup of eligible new completed exams, recovery on another device, retry/status UI, account isolation, JSON export, report deletion, removal of backed-up device copies, and account deletion.

Active exams remain browser-local, including answers, flags, position, revision coordination and fixed deadlines. Cross-device active-exam resume, collaborative editing, leaderboards, payments, new question content, and server-authoritative exam timing are future work. Cloud storage archives self-reported practice attempts; it does not establish independently verified certification results.

Planning defaults, rather than additional user-confirmed preferences:
- User-confirmed authentication requirement: email and password signup/sign-in only, with no mandatory email verification.
- A first-sign-in introduction explicitly offers automatic backup of new completed exams, initially disabled until accepted.
- User-confirmed signup behavior: automatically migrate completed guest browser reports into the new account. Empty browser history creates an account with no report rows. Keep original device copies; exclude unfinished and other-account-owned records. Existing-account sign-in and additional guest reports retain explicit import/backup.
- Cloud reports have no routine automatic expiry. Users can delete them.
- Cloud downloads stay in memory by default; users may choose to keep report copies on a trusted device.
- The app keeps the current React/TypeScript/Vite frontend and Vercel hosting configuration.

## 2. Existing implementation and invariants

Inspection of the repository confirms:
- src/domain/attempt.ts defines Attempt, exact-set grading, local recovery, frozen snapshots, revision checks, submission and replacement.
- validRecoveredAttempt currently is private and handles snapshot validation, answer membership, timestamp consistency, legacy optional revision/difficulty/result, and grade consistency.
- src/domain/browserStorage.ts wraps mutations in the shared pcao-f:attempt-storage:v1 Web Lock.
- src/App.tsx finalizes through submitStoredAttempt, monitors expiry on Start and Exam, and currently loads all history from browser storage.
- src/ui/ResultsPage.tsx accepts an Attempt and already renders snapshot-based reviews and PDF export.
- src/domain/bank.ts combines pure validation with a Vite-specific fetch loader; server reuse requires separating these concerns.
- Runtime bank file sizes measured during planning are 216,403 bytes for Advanced and 170,822 bytes for Intermediate. These are file sizes, not database or compressed transfer estimates.

Preserve both reviewed-bank hashes, approved Markdown, option order, existing scoring and pass threshold, Intermediate default, Original exam legacy labels, report-title presentation, PDF behavior, current browser keys, and frozen attempt snapshots. Do not rewrite historical records merely to add authentication. Browser submission success must never depend on Supabase availability.

## 3. User experience

| Situation | Planned behavior |
| --- | --- |
| Guest | Existing exam/local history; Sign in and Create account at the right side of the header |
| New account signup | Automatically claim/queue completed guest reports; no import prompt; empty history stays empty |
| First sign-in | Show the account email, backup explanation, automatic-backup choice and separate import action |
| Signed-in new exam with backup enabled | Persist its owner sidecar at successful local creation; upload after successful local submission |
| Guest-started exam completed after signing in | Offer explicit backup to the displayed account; do not silently claim it |
| Offline completion | Show local Results immediately and a pending-backup status for eligible reports |
| Browser data cleared | After sign-in, retrieve all reports whose backups previously succeeded |
| New device | Load paginated account history, then fetch a complete snapshot when a report is opened |
| Cloud unavailable | Keep local reports and exam controls working; show a separate account-history error and Retry |
| Sign-out or account switch | Clear displayed account data and caches, pause old-account jobs, ignore stale responses and show only eligible local history |
| Storage quota failure | Keep the existing submission/storage recovery behavior; never label an unsaved attempt as locally saved or backed up |
| Invalid cloud report | Reject that report with a retryable/recoverable message; valid history remains accessible |

Authentication controls appear on the right side of the shared header on Start, Exam and Results. Signup during an exam migrates earlier completed guest reports, while the active exam, answers and deadline remain browser-local. Account report management stays on Start/Results. Auth errors must not replace exam-saving or expiry messages.

Use these report states: Saved on this device, Backup pending, Backing up…, Backed up, Backup failed — Retry, and Account report. A cloud badge means the server has acknowledged matching report content, not simply that a request was sent. Local-copy availability is a separate property.

History preserves completion date, difficulty, practice score, outcome and Open report. Show one row for the same local/cloud report only after confirming matching identity and content. List cloud history in pages of 20 metadata rows, ordered by submission time and report ID; do not download every question snapshot to build the list.

## 4. Architecture

The existing local engine remains responsible for writable attempts. A new account/archive layer handles completed reports independently.

- Supabase Auth: password-authenticated account identity and sessions; email ownership is not verified.
- Supabase PostgreSQL: report snapshots, indexed history metadata and backup settings.
- Supabase Data API with Row Level Security: account-owned reads.
- A small report-backup Edge Function: authenticate the caller, validate a completed Attempt using shared rules, derive metadata/hash, and call a restricted database transaction.
- Report-deletion and account-deletion functions: authenticated, explicit operations with server-only privileges.
- Browser ownership sidecars stored alongside original localStorage records, plus an IndexedDB archive store for lightweight durable upload jobs, receipts and optional downloaded-report copies. Existing exam record bytes remain unchanged. Keeping ownership beside the original protects against independent IndexedDB cache eviction.

Database and function credentials with privileged access stay only in server secrets. The frontend receives the Supabase URL and publishable key. RLS and database grants protect exposed tables; server functions using privileged access must independently verify identity and scope every operation to that identity. Supabase documents this separation in its [data security guide](https://supabase.com/docs/guides/database/secure-data).

Do not hold the exam Web Lock during network I/O. Capture committed data and write ownership sidecars under the existing lock, release it, then queue/upload asynchronously. Sidecars use separate pcao-f:attempt-owner:v1:<attempt-id> keys and are never fields added to old attempt payloads. Archive-store transactions and a separate archive synchronization lock coordinate jobs across tabs; duplicate requests are still safe at the database.

## 5. Database model

Use versioned SQL migrations under supabase/migrations.

No username profile or identifier-mapping table is needed for the selected email-only authentication flow.

Table: account_preferences
- user_id: UUID primary key referencing auth.users, cascade on account deletion.
- automatic_backup_enabled: boolean, default false.
- created_at and updated_at: server timestamps.
- Device-specific session/cache choices remain on the device.

Table: attempt_reports
- report_id: server UUID primary key.
- user_id: authenticated owner UUID, foreign key to auth.users with cascade deletion.
- attempt_id: text, preserving existing and legacy IDs rather than requiring all old IDs to be UUIDs.
- payload_schema_version and hash_version.
- payload: JSONB containing the full submitted Attempt and its frozen bank.
- payload_hash: server-derived hash of a versioned canonical completed-report representation.
- exam_id, dataset_version, optional difficulty, title, started_at, submitted_at, submission_reason.
- correct_count, total_count, practice_score and practice_passed: derived from validated data.
- uploaded_at: server timestamp, separate from user-device exam times.
- deleted_at: nullable tombstone timestamp.

Constraints and indexes:
- Unique (user_id, attempt_id).
- Index (user_id, submitted_at DESC, report_id DESC) for active history.
- Constraints on required submitted fields, supported versions, valid count ranges and payload size.
- Live rows contain report data; tombstones remove payload and descriptive metadata while retaining minimal account/attempt identity and hash for retry suppression.
- No edits to live report content. The only lifecycle mutation is explicit deletion through the restricted server operation.
- No anonymous access. Authenticated users read only their own preferences/reports; preference updates are owner-scoped.
- Report INSERT, UPDATE and DELETE grants are denied to browser roles. Only the validated server functions can perform those writes. Test grants as well as RLS policies.

Start with one full snapshot per report for straightforward recovery. Do not normalize against the current public bank: old reports must survive bank updates. Measure actual database usage before considering immutable snapshot deduplication.

Initial maximum upload request: 1 MiB, checked while reading the request as well as after parsing. Verify both real banks and representative completed payloads fit. Configure server-side request frequency and per-account storage/count limits from the agreed operating budget; retries of an already stored identical report must succeed even when the account has reached its limit. Show explicit quota errors and never silently delete history.

## 6. Shared validation and upload contract

Extract a public pure parse/validateAttempt(input) helper from the existing recovery path. Storage recovery calls the same helper, preserving current return/error behavior. Separate pure bank validation from the Vite fetch loader so the Edge runtime can import the rules without import.meta.env or browser globals. Prove Node/Vite and Edge compatibility before wiring the full UI.

backup-report accepts only a supported versioned envelope and completed Attempt. It does not trust a client-supplied owner, score, summary or hash:
1. Verify the bearer session with Supabase and obtain the user ID.
2. Bound the request body and validate the transport envelope.
3. Validate the original frozen snapshot, selections, flags, dates, submission reason, optional difficulty and any stored grade.
4. Reject in-progress attempts, malformed records and inconsistent grades.
5. Compute metadata and practice outcome from the saved answers and snapshot.
6. Compute a deterministic, versioned content hash. Canonicalization normalizes object-key ordering, missing legacy grade and revision defaults as documented; preserve all question/option ordering and original displayed content. Transport bookkeeping is excluded.
7. Perform an atomic insert-or-compare transaction keyed by owner and attempt ID. Never use an overwrite upsert.
8. Return created or already-backed-up with report ID, hash/version and uploaded_at; return a conflict for differing content and a deleted response for a tombstone.

The transaction is executable only by the server role and uses the verified owner supplied by the function. It handles parallel tabs, concurrent imports, lost responses and quota accounting atomically. Return bounded error messages without echoing snapshots, emails, answers or secrets into logs.

Validate downloaded records with the same parser before Results, PDF or a persistent cache accepts them. Validate metadata responses separately and cross-check full reports against their server metadata/hash. Support legacy reports without difficulty or a stored grade; derive display values without modifying the user's old local record.

Structural validation and matching a grade to its supplied snapshot do not prove that a client has not modified that snapshot. Release 1 stores private practice archives, not a trusted public scoring system.

## 7. Authentication and session lifecycle

Final user clarification on 2026-10-14 supersedes the earlier OTP and username proposals: keep Supabase and use email and password signup/sign-in only, without mandatory email verification. No code, email link or email-confirmation step is required to create or use an account.

Supabase baseline:
- Enable email/password authentication and disable Confirm Email in the hosted project's email-provider settings.
- Use signUp and signInWithPassword; issue/use the session immediately after successful signup.
- Email ownership is not verified. The application's account ID is authoritative; never grant permissions or merge accounts merely because an email string matches another identity.
- Provide signup, sign-in, show/hide password, password-manager/autofill support, clear form feedback and an optional Keep me signed in on this device choice.
- Passwords are handled by the authentication provider, never stored in browser history, report snapshots or logs.
- Allow password reset by email when the user explicitly requests recovery. This does not add an email-verification gate to ordinary signup/sign-in. Configure SMTP for recovery delivery; the normal password login flow does not require a mail service.
- Require current-password reauthentication, rather than an email code, before account deletion or other sensitive account changes.
See [Supabase password authentication](https://supabase.com/docs/guides/auth/passwords) and [Confirm Email configuration](https://supabase.com/docs/guides/auth/general-configuration).

Selected authentication scope: signup collects email and password; sign-in accepts email and password. There is no username field, username alias lookup, username login endpoint, or username uniqueness workflow. Email recovery remains available only when requested.

Keep session persistence optional, initially off, and test both in-memory and persistent modes. Refresh sessions as appropriate and respond to auth events across tabs without remounting the exam or disturbing timer/focus. Configure server-side signup/login throttling; do not depend on frontend controls to enforce it.

Each auth transition increments an account/session generation. Requests and jobs capture their owner and generation. Discard late list/download/upload UI responses after sign-out, switch, deletion or unmount. Workers never replace a queued owner with the newly signed-in owner.

A started attempt binds to the account only when backup is enabled at creation. If durable ownership bookkeeping fails, do not auto-upload; keep the exam usable with the normal local engine and offer explicit backup later. Signed-out owner-bound work remains pending for its original account.

This is browser-local practice persistence, not encrypted shared-device storage. Clear account downloads and rendered account data on sign-out; hide owner-bound originals/jobs from other accounts and guests. Explain retained pending device data and provide explicit deletion of device copies. Never promise that UI filtering prevents someone with access to the browser profile from inspecting local storage.

Supabase remains the selected provider. Section 16 preserves the earlier Aiven comparison for reference and does not add work to this release.

## 8. Durable queue and import

Queue entries contain owner, attempt ID, expected content hash/version, eligibility source, retry state and timestamps, rather than another complete copy of every existing localStorage snapshot. Completed local data remains the source until the upload succeeds or the user explicitly removes it.

Successful local submission shows Results first. Then enqueue an eligible report. Submission on Start expiry, replacement-time expiry, resume expiry and another tab must receive the same backup treatment. On startup/reconnect/sign-in, reconcile eligible submitted local reports and queue state so closing the tab between submission and enqueue does not lose the backup opportunity.

The worker:
- Operates only for its signed-in owner and processes a bounded number of jobs.
- Revalidates the committed submitted report before uploading.
- Retries connectivity and transient server errors with bounded exponential backoff and jitter.
- Pauses for expired/revoked authentication until that owner signs in again.
- Stops automatic retry for damaged data, content conflicts, deletion or quota failures; shows a useful action.
- Updates Backed up only after acknowledgement of matching hash/version.
- Persists acknowledgements even if a later optional cache write fails; verify again when local receipt persistence fails.

Signup automatically migrates valid unowned completed browser history. Capture durable owner sidecars under the existing Web Lock; queue bounded uploads afterward and retain device originals. An empty browser creates no placeholder report. Exclude active, owned, paused/deleted and unreadable records, and continue readable reports after individual storage failures. Existing receipts and retry/owner-generation safeguards also apply to signup migration.

Import additional browser history after signing in is a deliberate action:
- Show the signed-in account email and valid unowned completed reports with dates/difficulty.
- Allow individual selection and Select all; exclude active or other-account-owned attempts.
- Under the existing Web Lock, persist an immutable owner sidecar before creating the account-bound IndexedDB job. These two stores do not share a transaction: failed job creation is recoverable from the sidecar and report; failed ownership persistence must prevent upload. Never rewrite the original exam payload.
- Report uploaded, already stored, skipped, failed and conflicted counts independently.
- Allow retry of failed items and cancellation of work not yet sent.
- Leave local source data intact unless the user later removes device copies.
- On repeated import, stable IDs and server comparison prevent duplicates.
- Check existing receipts/tombstones so a deleted report is not resurrected.

No periodic background uploading while the browser is closed is promised. Pending work resumes when the app is opened with its account and a working connection.

## 9. History recovery and integration

Introduce a typed history model with local, cloud and both sources. Active attempts stay in the existing writable collection. Cloud-only completed reports are never inserted into the current local attempt index automatically.

Fetch only cloud summaries for Start. Fetch/validate a full report on Open report, then pass its Attempt to existing ResultsPage and reportPdf. Keep report source/owner separate from the writable attempt reference so storage events do not incorrectly treat a cloud-only report as a missing local attempt.

Deduplicate only matched IDs and content; preserve both sources visibly if a mismatch is detected and prevent automatic overwrite. Cloud listing/download failures must not set the local history error that disables starting an otherwise valid exam. Missing runtime bank files must not prevent cloud report review.

Optional downloaded copies use owner-scoped IndexedDB keys. Default to memory-only downloads. For persistent copies, manage quota explicitly and allow removing them without deleting cloud data. Evicting downloaded cache is allowed; evicting original unsynced local reports is not.

## 10. Export, deletion and retention

Keep current individual PDF export for local and cloud reports. Add Export account history (JSON): paginated full validated records plus envelope/hash versions, exported in bounded batches with progress, cancellation and explicit partial-failure reporting. It does not mutate storage or present a partial download as a complete export.

Remove device copy is separate from Delete account report. Remove original local completed records only after the user confirms and the matching cloud backup is verified; update the existing local history index under the current Web Lock with rollback/recovery safeguards. Do not remove active or pending original attempts.

Delete account report calls an authenticated function that atomically removes its payload and writes a tombstone. Suppress queued retries in all tabs and remove matching account caches. A retained original device report becomes Local only — removed from account and is not re-imported automatically. Restoring a deleted backup is deferred to a separately designed explicit action.

Delete account requires fresh password reauthentication, clear consequence text and explicit confirmation. The server derives the account from the verified session, deletes that auth user through a server-only admin operation, and relies on tested foreign-key cascades to remove preferences, live reports and tombstones. Purge that account's local archive bindings, queues and caches; explicitly handle device originals without affecting unrelated guest/other-account attempts. Handle partial local cleanup failures and the fact that previously downloaded exports cannot be revoked.

No automatic expiry for live account reports. Operational backups have their own documented retention and can temporarily contain deleted data until they expire. A restored database must reconcile deletions since the recovery point before public service resumes.

## 11. Proposed implementation files

Names are proposed; keep final responsibilities aligned with repository conventions.

| Area | Add/change |
| --- | --- |
| Pure bank validation | Extract to src/domain/bankValidation.ts; preserve bank.ts exports/loader compatibility |
| Attempt parsing | Export shared pure parsing in src/domain/attempt.ts or a focused attemptValidation.ts |
| Supabase SDK boundary | src/services/supabaseClient.ts and src/services/accountRepository.ts |
| Backup/merge domain rules | src/domain/cloudReports.ts and src/domain/history.ts |
| Local archive bookkeeping | src/domain/archiveStorage.ts, separate from browserStorage.ts |
| Auth/sync orchestration | src/hooks/useAccount.ts and src/hooks/useReportBackup.ts |
| UI | AccountDialog.tsx, AccountMenu.tsx, ImportHistoryDialog.tsx, BackupStatus.tsx and account-history controls |
| App/report coordination | App.tsx, ResultsPage.tsx and styles.css |
| Database/backend | supabase/config.toml, migrations, restricted RPCs and functions for backup/delete-report/delete-account |
| Configuration | .env.example, .gitignore secret exclusions, package.json and lockfile |
| Verification | Synthetic fixtures, domain tests, SQL/RLS tests, Edge integration tests and Playwright account-history suite |
| Documentation | IMPLEMENTATION_SPEC.md, PROJECT_IMPLEMENTATION_STATUS.md, AGENTS.md, README.md and feature verification record |

Frontend variables: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY and VITE_ACCOUNT_HISTORY_ENABLED. Missing/disabled configuration leaves the guest app usable. Privileged keys must never use a VITE_ prefix or enter the frontend bundle. Pin the Supabase client through the lockfile.

## 12. Implementation sequence and exit criteria

| Phase | Work | Exit criterion |
| --- | --- | --- |
| 1. Foundation | Shared parsers, repository interfaces, source-aware history model, feature flag and config | Existing typecheck/unit/build pass; legacy and reviewed-content invariants preserved |
| 2. Supabase persistence | Migrations, grants/RLS, immutable backup transaction, tombstones and functions | Two-account ownership tests, direct-write denial, duplicates/conflicts/deletion races and server validation pass |
| 3. Authentication | Email/password signup/login, confirmation disabled, account preferences and session guards | Immediate signup access, email/password login, recovery, sign-out, account switching and stale responses behave correctly |
| 4. Backup/import | Ownership sidecars, queue, every submission path, retry/receipts and bulk import | Offline completion/reopen/reconnect works without duplicates or cross-account uploads |
| 5. Recovery/history | Paginated summaries, report downloads, deduplication, Results/PDF and optional cache | A second clean browser context recovers the same full report and PDF |
| 6. Data controls | JSON export, device-copy removal, report/account deletion and retention handling | Deleted reports cannot be recreated by old jobs; cleanup affects only the intended owner |
| 7. Verification/release | Full regression, responsive QA, backup restore rehearsal, staging smoke, production rollout | All acceptance checks pass with retained logs/screenshots and documented restore procedure |

Do not report phases complete without their checks. Keep the feature disabled until the database, password authentication and staging workflow are ready. Implementation can proceed with local Supabase/test doubles while production project provisioning is pending.

## 13. Verification plan

Run npm run typecheck, npm test, npm run build and the full Chromium browser suite. Record new totals rather than carrying forward the historical 69-unit and 101-browser counts.

Meaningful unit coverage:
- Legacy/current parsers, damaged data, grade mismatch, immutable snapshot and title/scoring preservation.
- Canonicalization stability, differing content and supported version transitions.
- Merge ordering/deduplication, ownership binding, queue reconciliation and retry classification.
- Local deletion rollback, ownership-sidecar failure, independent IndexedDB eviction, archive-store migration/errors and sign-out/account-switch response guards.

Real database/Edge integration coverage:
- Anonymous denial; A cannot list/read/delete B's data or forge B as owner.
- Direct browser writes and privileged function/RPC access are denied as intended.
- Parallel same-content upload creates one row; different content cannot overwrite.
- Authentication rejection, malformed/oversized payloads and inconsistent grades.
- Quota checks under concurrent requests; idempotent retries still succeed.
- Deletion-versus-upload races, tombstone suppression, account cascade and fresh-session deletion.
- Pagination boundaries, equal submission times and full-report integrity.
Use a disposable local/staging Supabase environment, not production records.

Browser coverage:
- Guest baseline and account feature disabled/misconfigured.
- Email/password signup with no email-confirmation gate, email/password login, duplicate-email handling, wrong-password handling, optional recovery, password reauthentication, both session modes and sign-out.
- Automatic signup migration, empty history, legacy reports, owner/active/damaged exclusions, retry after reopening, plus explicit additional import, partial failure, repeated import and cancellation.
- Manual and all expiry paths, offline completion, refresh before enqueue, lost upload response and reconnect.
- Two tabs and two accounts; late requests after logout/switch; browser storage events while viewing cloud-only Results; independent archive-cache eviction must not make an owned original report available to another account.
- Fresh device recovery after clearing local data; original snapshot retained after public bank changes.
- Cloud errors independent from local exam usability; local quota and optional-cache failures.
- Cloud/local PDF equivalence and full JSON export completeness.
- Report deletion, device-only removal, account deletion and stale queue behavior.

Verify UI at 320, 390, 768 and 1366 pixels, mobile landscape and enlarged text. Inspect mobile/desktop screenshots. Check keyboard focus/trapping/restoration, Escape, touch targets, screen-reader labels/status announcements and page-wide overflow. Add a focused Firefox/WebKit account-flow smoke check if the environment supports them, and state any unverified browser limits.

## 14. Operations and rollout

Infrastructure inputs needed before production:
- Supabase organization/project access, separate staging/production projects, selected region and budget.
- Recovery-email sender credentials and domain for optional password reset; signup and normal sign-in do not depend on email delivery.
- Actual deployment URL(s), environment variables and Supabase Auth site/allowed redirect configuration.
- Responsible operator, retention wording, backup destination and restoration access.

Use a paid production Supabase plan with managed backups, plus an off-site backup process appropriate to the retention target. Free projects are useful for development but may pause and need independently maintained exports. See [database backups](https://supabase.com/docs/guides/platform/backups) and [free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

Planning targets: daily off-site backups, 30-day encrypted off-site retention, recovery point within 24 hours and recovery within one working day. These are proposed operational targets, not Supabase guarantees; confirm storage/cost and prove the restore procedure in staging. Cover schema, data and required auth/configuration recovery; keep secrets separately protected and test post-recovery account access.

Measure report counts/bytes, backup failures/retry age, function errors, password-login failures, recovery-email delivery and storage/egress usage. Log identifiers/error categories, not report contents or credentials. Add budget/usage alerts and bounded server operations.

Rollout order:
1. Provision staging and verify email/password signup/login, recovery delivery, schema, permissions and functions.
2. Deploy a preview with account history enabled and complete the fresh-device smoke test.
3. Apply additive production migrations and deploy functions before enabling the frontend.
4. Enable for a small initial cohort or controlled release, then expand after reviewing error/usage evidence.
5. Verify production guest start, both levels, sign-in, backup, second-device report/PDF, sign-out and deletion.
6. Record the live URL and smoke results; do not reuse earlier unconfirmed deployment claims.

Rollback disables the account feature in a rebuilt frontend while keeping the local exam app functional and existing cloud data intact. Revert faulty functions with compatible versions; do not drop tables or replace archived snapshots during rollback.

## 15. Acceptance criteria

The release is complete when:
- Guests retain the verified browser-based exam experience.
- Signup automatically backs up completed guest history, empty history remains empty, and authentication is accessible from the shared header. Users can opt into future-exam backups and import additional reports.
- An acknowledged backup survives deletion of browser data and opens on another device with identical snapshot-based scores, reviews and PDF content.
- Offline submission and cloud failures do not block local Results or change the deadline.
- Duplicate requests create one backup; differing content cannot overwrite it.
- Account switching cannot display or upload another owner's report, including late responses and old jobs.
- Active exams, reviewed banks and legacy local reports preserve their current rules and data.
- Export and deletion are explicit, scoped and tested; deleted backups are not silently recreated.
- Browser storage capacity does not force bulk downloading or silent deletion of originals.
- Database backups have a recorded successful restore rehearsal.
- Current verification evidence and documentation distinguish planned, locally implemented, staging-verified and production-verified work.

## 16. Historical Aiven comparison — outside the selected release

Final provider decision: the user chose to keep Supabase and restrict signup/sign-in to email and password, without mandatory email verification. The following earlier Aiven comparison is historical reference only; it is not an implementation task or a pending provider decision.

Aiven for PostgreSQL is a managed PostgreSQL service and supports the JSONB snapshot schema. It does not replace the planned application's signup/password/session system. Aiven platform users, service credentials and infrastructure authentication are not this app's end-user accounts.

Recommended Aiven architecture if selected:
React/Vite frontend -> same-origin Node/TypeScript API with established authentication middleware -> Aiven PostgreSQL.
The existing local attempt engine runs independently in the browser, as in the Supabase baseline.

An evaluated authentication option is Better Auth: it provides email/password authentication with optional verification and a username plugin. Its documented username signup still requires an email, so username-only accounts with no email would need a different/custom-supported auth configuration. Do not silently invent email values. See [email/password](https://better-auth.com/docs/authentication/email-password) and [username plugin](https://better-auth.com/docs/plugins/username).

| Concern | Supabase baseline | Aiven alternative |
| --- | --- | --- |
| Database | Supabase PostgreSQL | Aiven PostgreSQL; retain JSONB snapshots, unique owner/attempt key and SQL migrations |
| Auth | Supabase Auth with email confirmation disabled; email/password only | Auth library on our API, with user/credential/session tables and username support |
| Account foreign key | auth.users | Auth library's user table; use its real ID type, not an assumed UUID |
| History reads | Supabase Data API with account RLS | API queries scoped to the server-authenticated user |
| Validation/uploads | Supabase Edge Functions and restricted transaction | Node API routes and the same atomic database transaction |
| User isolation | Supabase JWT-integrated RLS plus function scoping | Authenticated API ownership checks; optional additional PostgreSQL RLS configured explicitly |
| Session handling | Supabase SDK sessions | Auth library sessions, preferably same-origin Secure/HttpOnly cookies |
| Account deletion | Auth admin deletion plus cascades | Auth library deletion/session revocation plus application cascades |
| Operations | Supabase database/functions/auth | Aiven database plus API/auth hosting, TLS, connection management and recovery delivery |

Do not send Aiven database connection strings or service passwords to the React client. The API establishes verified TLS connections and uses parameterized queries with a least-privilege runtime database role. If RLS is used, test it with that runtime role; a privileged database owner may bypass policies.

Aiven currently also has a PostgREST-based Data API in Early availability. It uses JWTs from a separate identity provider, requires a JWKS URL, and runs in a separately billed Aiven Runtime application; free-tier runtime plans are not available for Data API. It does not remove the need for app signup/password/session management or validated upload/deletion operations. For this feature, the Node API is the simpler proposed integration boundary. See [Data API overview](https://aiven.io/docs/products/postgresql/howto/data-api) and [setup requirements](https://aiven.io/docs/products/postgresql/howto/data-api/get-started).

Hosting options:
- Vercel Node Functions alongside the current frontend, with verified auth-library routing/cookie integration.
- A separately hosted Node service when a bounded long-running connection pool is preferable.
Keep frontend/API access same-origin where possible; configure trusted origins, secure cookies and CSRF protections through the auth library. For serverless hosting, bound concurrent database connections across instances rather than merely defining a per-instance pool.

Aiven's documented free PostgreSQL plan includes 1 GB disk, backups and at most 20 connections, and has no built-in connection pooling. Services may be powered off for inactivity. It can support development or a small initial deployment, but capacity, backup retention/restoration and production availability must be checked for the chosen plan. See [free-tier documentation](https://aiven.io/docs/products/postgresql/concepts/pg-free-tier) and [backups](https://aiven.io/docs/products/postgresql/concepts/pg-backups).

Implementation impact:
- Retain report payloads, offline queue rules, explicit import, account isolation, history/PDF rendering, tombstones and most domain/UI tests.
- Replace provider SDK calls, auth/session hooks, Supabase-specific policies, Edge deployment and auth.users cascades.
- Add API routes, auth-library tables/migrations, session/password lifecycle tests, backend runtime configuration, TLS and connection-budget testing.
- Back up authentication tables and report tables together, and preserve auth configuration/secrets needed to keep restored accounts usable.
- Extend rollback and staging smoke checks to the API and auth service. No active-exam cloud editing is introduced.
