# PostHog analytics

The React app uses the PostHog browser SDK for visits, signed-in activity, exam actions and estimated active time. Supabase remains the source of truth for registered accounts. Analytics does not change question banks, attempt snapshots, answers, grading or account backup rules.

## Configuration

The following variables belong in `.env.local` for development and in the deployment provider's environment settings for production:

```dotenv
VITE_POSTHOG_ENABLED=true
VITE_POSTHOG_KEY=<browser-project-token>
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_ANALYTICS_ENVIRONMENT=development
```

Use the exact API host from the PostHog project; EU projects normally use `https://eu.i.posthog.com`. Use a browser project token, never a personal API key or Supabase service-role key. All `VITE_` values are public in the built frontend. Never commit `.env.local`.

For production, set `VITE_ANALYTICS_ENVIRONMENT=production`, then rebuild/redeploy. Vite embeds configuration during the build. Restart Vite after changing local variables. Keep previews under `preview`, or disable collection there. Setting `VITE_POSTHOG_ENABLED=false` disables SDK initialization, events and engagement listeners. Missing token/host also disables collection. Unit tests and the standard account/guest browser test servers disable live collection; the dedicated analytics suite uses synthetic credentials and intercepts requests.

The SDK loads in a separate lazy chunk. Initial events are buffered in order (maximum 128 operations); import/initialization failure drops the buffer and never blocks authentication, saving, submission or PDF export. Browser blocking, offline operation, closing a page and quota limits can cause missing events. Analytics is not a transactional report ledger.

## Events and identity

| Event | Meaning |
| --- | --- |
| `$pageview` | Start, Exam, Results or Account settings becomes the current view |
| `$pageleave` | The page is being left; browser delivery is best effort |
| `signed_in_activity` | A signed-in identity is restored or adopted; not a new login |
| `signup_succeeded` | An explicit signup succeeds with an accepted account session |
| `login_succeeded` | An explicit email/password sign-in succeeds |
| `logout_succeeded` | Device sign-out starts and the app drops its signed-in identity |
| `exam_started` | A new attempt has been saved successfully |
| `exam_resumed` | An unfinished saved attempt is reopened |
| `review_opened` | Review opens; switching between review/confirmation does not count again |
| `exam_completed` | A local unfinished attempt transitions to a saved submitted report, manually or on expiry |
| `pdf_export_succeeded` | PDF generation succeeds and a browser download is initiated |
| `report_backup_succeeded` | A completed report's matching cloud backup is confirmed and device bookkeeping succeeds |
| `engagement_time` | An increment of estimated active time, in `active_seconds` |

Custom events include `app_name`, `environment` and the event-time `account_state` (`guest` or `authenticated`). Relevant events add `difficulty`, `attempt_id`, `submission_reason`, `elapsed_seconds` or `method`. The virtual screen is stored as `view` with paths `/start`, `/exam`, `/results` and `/settings`. `original` means legacy difficulty metadata is absent; it does not relabel a saved attempt.

Anonymous browser identity is retained between visits where browser storage permits it. Successful account sessions use the Supabase user UUID; no email is passed to `identify`. Logout/account switching resets the previous identified SDK state. Session restoration and token refresh do not emit a new login. Identity linking may associate earlier guest activity with an account, so use the event's `account_state` to distinguish guest versus signed-in activity at the time it happened.

Opening an existing completed report does not emit `exam_completed`. Simultaneous tabs check the existing saved status under the app's shared Web Lock before recording a new completion. The same lock protects automatic-expiry transitions during a new start. Event delivery itself is best effort, so use distinct `attempt_id` counts when analyzing attempt totals.

## Active time

Active time means the tab is visible and focused, with an input interaction within the last five minutes. Keyboard, pointer, touch and scrolling refresh the idle cutoff; restoring visibility/focus starts a new active interval. Quiet reading counts until the cutoff. Hidden/unfocused time and execution gaps over 15 seconds are excluded to avoid counting browser suspension or computer sleep.

The app samples every five seconds and emits increments every minute, plus on view, identity, visibility and page-leave transitions. Time is flushed under the previous view/account before changing context. Sampling and lifecycle delivery are estimates, especially on mobile. Very short intervals under one second are discarded. This metric is different from elapsed exam time and PostHog's built-in session duration. The idle threshold is a product definition, not proof that somebody is paying attention.

## Dashboard setup

In PostHog, create a private dashboard called **PCAO-F Usage**. Set the reporting timezone (for example `Asia/Karachi`) and apply `environment = production` to app-event insights. For local verification use `development` instead. PostHog's automatic SDK identity events may not have the custom environment property; build app-usage cards from the events above.

| Card | Configuration |
| --- | --- |
| Unique visitors | `$pageview`, Unique users, total over the selected period |
| Visits | Web Analytics sessions, filtered to the intended hostname/environment where supported |
| Average session duration | Web Analytics built-in duration; affected by its session definition and collected engagement events |
| Signed-in active users | Combine `signed_in_activity`, `$pageview`, `engagement_time` and exam actions in one series; filter `account_state = authenticated`; Unique users |
| New accounts tracked | `signup_succeeded`, Unique users |
| Login actions | `login_succeeded`, Total count |
| Exams started/completed | Corresponding event, unique `attempt_id` aggregation |
| Difficulty usage | `exam_started`, breakdown by `difficulty` |
| Active time | `engagement_time`, sum of `active_seconds`; divide by 60 for minutes |
| Active time by screen | Same sum, breakdown by `view` |
| Visitor-to-signup conversion | Funnel `$pageview` → `signup_succeeded` |
| Exam completion conversion | Funnel `exam_started` → `exam_completed`; match `attempt_id` so different attempts are not mixed |

Do not add daily unique-user counts to obtain a monthly unique-user count; select the complete period. Returning guest visitors are browser identities, not guaranteed unique people. Separate devices/storage clearing/blockers can change those counts.

### Average active minutes per signed-in user

Create a SQL insight and paste:

```sql
WITH per_user AS (
  SELECT distinct_id,
    sum(toFloat(properties.active_seconds)) AS active_seconds
  FROM events
  WHERE event = 'engagement_time'
    AND properties.environment = 'production'
    AND properties.account_state = 'authenticated'
    AND timestamp >= now() - INTERVAL 30 DAY
  GROUP BY distinct_id
)
SELECT round(avg(active_seconds) / 60, 2) AS average_active_minutes
FROM per_user
```

This is total active minutes per engaged signed-in user over the last 30 days. It excludes accounts with no recorded engagement. The date range here is fixed in the SQL; edit it when changing the reporting window. Averaging individual heartbeat values would measure increment size, not time per user.

### Average active minutes per engaged session

```sql
WITH per_session AS (
  SELECT properties.$session_id AS session_id,
    sum(toFloat(properties.active_seconds)) AS active_seconds
  FROM events
  WHERE event = 'engagement_time'
    AND properties.environment = 'production'
    AND timestamp >= now() - INTERVAL 30 DAY
    AND properties.$session_id IS NOT NULL
  GROUP BY session_id
)
SELECT round(avg(active_seconds) / 60, 2) AS average_active_minutes
FROM per_session
```

This excludes sessions without an engagement increment; it is not an average over every visit. Anonymous identity merges can complicate per-person historical comparisons; signed-in UUIDs are more useful for account-level reports.

### Registered accounts

Use **Supabase → Authentication → Users**, or run this only in the trusted Supabase SQL Editor:

```sql
SELECT count(*) AS registered_accounts
FROM auth.users
WHERE is_anonymous = false;
```

This counts currently existing registered accounts, including accounts created before analytics. Deleted accounts disappear from this total. Client-side signup events are not an authoritative account count. Do not expose an Auth admin key or an unrestricted user-list endpoint to the browser.

## Data boundaries

Automatic DOM/click capture, session recording, heatmaps, performance collection, console recording and automatic exception capture are disabled. Event metadata is allowlisted. SDK payload scrubbing removes sensitive properties and strips query strings/fragments from URL/referrer properties, including nested initial person properties. No answers, question text, explanations, report payloads or passwords are intentionally transmitted. UUIDs, browser identifiers and normal browser/device metadata still constitute tracking data; this is not an assertion of anonymity.

If the product uses analytics consent, gate SDK initialization behind the chosen consent flow before release. Keep the dashboard private and describe collection in the site's privacy information. Supabase account deletion does not automatically delete PostHog data; analytics deletion/retention needs a separate administrator process. No PostHog personal API key is needed for browser ingestion.

## Verification

Latest recheck: see [POSTHOG_VERIFICATION.md](POSTHOG_VERIFICATION.md). TypeScript, 26 focused analytics unit tests and build pass; all six browser scenarios pass across the initial run and an unchanged guest-case rerun after an initial five-second event timeout. The current public Vercel bundle has no PostHog tracking. Production configuration/deployment and live dashboard delivery remain pending. The evidence below records the earlier complete run.

Verified on 2026-10-15: TypeScript, 162 unit tests across 18 files, production build and all six focused Chromium analytics cases pass. The real configured US PostHog project accepted development pageview and engagement requests with HTTP 200. No Supabase accounts/reports were changed by that hosted check. Both reviewed source/build bank hashes and the approved Markdown hash match their recorded values. Evidence is `test-results/posthog-{typecheck,unit-tests,build,browser}.txt`, `test-results/posthog-hosted-browser.json` and `test-results/posthog-content-integrity.json`. This does not establish dashboard configuration, a production frontend deployment or a new full guest/account browser regression run.

```powershell
npm run typecheck
node node_modules/vitest/vitest.mjs run --configLoader runner --maxWorkers=2
npm run build
node node_modules/@playwright/test/cli.js test --config playwright.analytics.config.ts --workers=1
```

The analytics browser suite uses the real installed SDK against intercepted synthetic endpoints, including mocked config scripts and Auth HTTP responses. It models a human browser because PostHog intentionally excludes webdriver/headless traffic. This override exists only in the test harness, not in app code.

For a real smoke check, open the local app in a normal browser, then use PostHog's activity feed with `environment = development`. Expect `$pageview` and, after focused activity, `engagement_time`. A successful ingest HTTP response confirms request acceptance, not that dashboard cards have been configured. Production reporting begins only after production environment variables are set and the frontend is deployed. Past visits/time cannot be reconstructed if no prior tracking existed.

Official references: [browser installation](https://posthog.com/docs/getting-started/install), [identity](https://posthog.com/docs/data/anonymous-vs-identified-events), [sessions](https://posthog.com/docs/data/sessions), [Trends](https://posthog.com/docs/product-analytics/trends/overview), [Web Analytics](https://posthog.com/docs/web-analytics/dashboard), [Vite environment variables](https://vite.dev/guide/env-and-mode).
