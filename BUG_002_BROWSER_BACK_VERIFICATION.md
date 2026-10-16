# BUG-002 — Browser BACK navigation verification

Date: 2026-10-15. Outcome: **Partially confirmed on current local source; reported hosted behavior not fully verified.** No implementation changes were made.

## Environment and limits

The reported https://wager-geranium-crafter.ngrok-free.dev/ timed out before DOMContentLoaded after 30 seconds; an independent HEAD request received no bytes within 15 seconds. The existing localhost:5173 server also timed out. Therefore no hosted navigation trials completed. See [hosted attempt](test-results/bug-002-hosted-attempt.json).

Verification used a separate Vite development server at http://127.0.0.1:4194/, current workspace source, headless Chromium and a 1366 × 900 viewport. Accounts and analytics were disabled for this server, external-origin requests were blocked and every trial used an isolated guest context. This temporary server was stopped afterward. No hosted accounts/reports were created or deleted. This targeted navigation exercise does not verify the pending BUG-001 fix or replace broader regression checks.

Each tab was given an explicit preceding blank history entry, about:blank#bug-002-predecessor, before opening the app. BACK goes to the preceding browser entry; that entry is not necessarily blank for a real user.

## Observations

| Case | Trials | Observation |
| --- | --- | --- |
| BACK during active Exam; dismiss native warning | 2, including a resumed exam | Chromium emitted beforeunload. Dismissing kept the URL and Q2 open, with unchanged saved state. |
| BACK during active Exam; accept native warning | 2 | Chromium emitted beforeunload again. Accepting reached the preceding blank page. No in-app Leave exam dialog appeared. |
| BACK from completed Results | 2 | Reached the preceding blank page with no native or in-app warning. No active attempt remained in these contexts. |
| FORWARD after leaving | 4 | Returned to Home. Attempt ID, answers, flags, current question, start/deadline and any submission/grade metadata matched the pre-navigation values. |

The first exam was newly started; the second was resumed after the normal in-app leave confirmation. Both saved Q1 answer A and a Q1 flag, then navigated to Q2 before browser navigation. Results trials submitted those isolated local attempts through the UI. Records were read under the browser-storage Web Lock.

The seven-second navigation timeout in each back-dismiss trace is expected: cancelling the native warning deliberately prevents navigation, so goBack never reaches DOMContentLoaded. The recorded beforeunload dialog plus the unchanged URL, visible Q2 and saved values establish successful cancellation. These timeouts do not indicate that the app exited.

## Interpretation

The missing SPA-history behavior is confirmed. App views use React state; no pushState/replaceState/popstate routing exists in src. The CDP navigation history contains only the original app document entry after Home, Exam, Results and the resume flow. Thus BACK cannot traverse app views and FORWARD does not restore the prior view in this tested lifecycle; Home provides resume/report access from saved records.

A complete protection bypass was **not** reproduced in current local Chromium: src/App.tsx:232 registers beforeunload for unfinished, unexpired saved attempts, and both active-exam trials showed this warning. The custom Leave exam dialog is only called by the app's navigation controls at src/App.tsx:480; browser chrome invokes native navigation instead. Browser support/user activation still determine whether the native warning is shown in another environment.

The implementation specification currently requires native leave warnings where supported and the custom dialog for in-app leave navigation. Completed submissions remove the native warning deliberately. Therefore the expected in-app BACK navigation would require a new history-aware view flow; its absence is a navigation UX gap. Medium severity is reasonable for that gap, with no observed loss of saved work. A claim of silently bypassed native protection on the hosted environment remains unverified.

The fixed deadline remained unchanged while the app was away, so elapsed time is consumed rather than paused. Comparisons cover the saved fields listed above, not a separate byte/hash audit of whole snapshots.

## Evidence

- [Targeted script](test-results/bug-002-verify.cjs)
- [Dialog, browser history and saved-state evidence](test-results/bug-002-verification.json)
- [Exam after cancelling native BACK warning](screenshots/bug-002-exam-1-back-dismiss.png), visually inspected
- [Blank predecessor after accepted BACK](screenshots/bug-002-exam-1-back.png)
- [App Home restored by FORWARD](screenshots/bug-002-exam-1-forward.png)

No source fixes, unit suite, typecheck, production build, deployment, commit or push occurred. Four isolated browser sessions completed; the native warning was explicitly dismissed and accepted in each active-exam session.
