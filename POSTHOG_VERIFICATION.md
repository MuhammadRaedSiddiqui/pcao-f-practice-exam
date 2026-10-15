# PostHog integration verification — 2026-10-15

The current working-tree integration passes focused local verification. The public Vercel deployment currently serves an older bundle without PostHog tracking. Analytics remains outside authentication commit da4fcfa; no additional commit, push or deployment was performed.

## Current checks

- TypeScript: passed (npm run typecheck).
- Analytics unit tests: 26 passed across tests/analytics.test.ts and tests/analyticsService.test.ts.
- Production build: passed; existing bundle-size warnings remain (main 782.87 kB, lazy PostHog SDK 305.91 kB, PDF 1,834.25 kB).
- Focused Chromium analytics suite: 5 passed and 1 failed initially. The guest-identity case received no initial pageview within its five-second polling window. The unchanged case passed on a focused rerun with failure tracing enabled. All six scenarios therefore pass across two runs; this is not a clean single-run suite result. The first failure screenshot was inspected. The cause of the intermittent initial-event timing is not established.

Covered behavior includes guest identity across reloads; virtual views; saved start/manual-completion/expiry events; signup versus explicit login and restoration; logout/account switching; absence of success events for failed/cancelled auth; engagement increments; backup and PDF events; sensitive-content exclusion; and continued exam/submission operation when analytics requests are blocked. The browser suite uses the installed real SDK with synthetic/intercepted analytics and Auth endpoints. No real Supabase account/report mutations or live PostHog ingestion requests were made during this recheck.

## Configuration and deployment

The local production-mode Vite environment resolves PostHog enabled, a configured public project token, US ingest host https://us.i.posthog.com, and environment=development. The token value was not printed or added to documentation. A production build made with these local values labels events development.

A read-only HTTP inspection of https://pcao-f-practice-exam-one.vercel.app returned HTTP 200 and entry /assets/index-b0EMpgL0.js. That entry contains no PostHog SDK/initialization references, app analytics events, project token or ingest host. The fetched entry is about 520 kB versus the current local 783 kB entry. This establishes that the served bundle does not include the current integration; it does not inspect Vercel's private environment configuration or establish dashboard delivery.

Before production tracking can be verified, configure VITE_POSTHOG_ENABLED=true, VITE_POSTHOG_KEY with the browser project token, VITE_POSTHOG_HOST with the project's ingest host, and VITE_ANALYTICS_ENVIRONMENT=production in Vercel, then rebuild/redeploy the integration. Hosted settings/deployment were not changed. Current PostHog dashboard configuration and live ingest delivery remain unverified in this recheck; previous development-ingest HTTP 200 evidence remains historical.

## Evidence

- test-results/posthog-review-typecheck.txt
- test-results/posthog-review-unit-tests.txt
- test-results/posthog-review-build.txt
- test-results/posthog-review-browser.txt
- test-results/posthog-review-browser-rerun.txt
- test-results/posthog-review-deployment.json
- Downloaded public script: test-results/posthog-review-production/index-b0EMpgL0.js

Static review also confirmed early lazy SDK initialization, identity attribution before queued capture, reset on account changes/logout, manual virtual pageviews with automatic page capture disabled, and allowlisted event properties with URL/auth-content scrubbing. Identity/reset usage was checked against [PostHog's official identity documentation](https://posthog.com/docs/getting-started/identify-users). Broad guest/account regressions and other pending exam fixes were outside this focused verification.
