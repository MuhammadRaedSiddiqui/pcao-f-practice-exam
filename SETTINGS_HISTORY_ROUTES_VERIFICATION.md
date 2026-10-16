# Settings and history routes — 2026-10-16

Added `/history` and `/settings` with React Router 8.4.0. Header navigation uses real links; Home retains its history preview. History provides start/resume controls and the existing device/account report lists. Settings preserves its URL during session restoration and sign-in, displays guest guidance until authenticated, and is replaced by History on sign-out.

Back/Forward navigation uses saved-attempt pointers and revalidates snapshot/ownership. Payloads and credentials are not copied into browser history. Missing/private/unavailable reports fall back to History, and submitted exams reopen as Results. In-app navigation out of an active exam uses the existing Leave exam confirmation. Native unload warnings remain separate.

Added Vercel rewrites for both routes and trailing-slash variants, route-heading focus and History analytics context. Removed the forced minimum document width, which clipped narrow content when desktop scrollbars reduced the available layout width.

## Validation

- Final TypeScript and production build pass. The main bundle is approximately 884 kB / 257 kB gzip; size warnings remain. The router adds approximately 95 kB / 30 kB gzip compared with the preceding build.
- Final full unit run passes **208 tests across 21 files**, with two workers and a 120-second database setup allowance. Four new tests cover malformed history state, explicit URL precedence, saved-record pointers and route mapping.
- Scoped whitespace checks pass. Source and built question-bank hashes match the preceding QA run; reviewed content was not changed.

Real in-app Chromium used native accessibility, mouse and keyboard actions. No Playwright runner, DOM locators, evaluation, browser-state injection or request interception was used.

| Browser case | Result |
| --- | --- |
| Direct History, reload, Home links, Back/Forward | Correct URLs and headings retained |
| Start from History, answer Q1=C, flag Q1 and advance to Q2 | Saved normally |
| Back during active exam; cancel, then confirm another Back | Leave dialog shown; cancellation retained Q2; confirmation opened History with a running-timer reminder |
| Forward back to exam | Q2 restored; Q1 answer C and flag retained; remaining time kept decreasing |
| Header History/Home links and Escape | Leave dialog shown; cancellation retained the exam and restored opener focus |
| Submit, then Back through the old exam entry | Results shown, with no editable submitted exam; score remained 17/1000 |
| Reload History, open report, Results History action | Saved grade retained and History URL restored |
| Guest direct Settings | Sign-in guidance, without account controls |
| Sign in at Settings, then reload | Settings URL and authenticated controls restored |
| Active exam → Settings → confirm → Back | Settings opened, then exam restored |
| Sign out at Settings, then revisit Settings | History replaced Settings; subsequent Settings visit showed guest guidance |
| Narrow Settings/History rendering | Wrapping inspected and forced-minimum-width clipping corrected |

Guest checks used the rebuilt app at `http://127.0.0.1:4173`. Signed-in checks used the real SDK against a synthetic local HTTP auth boundary at `http://127.0.0.1:4196`; they do not establish a new hosted-auth/backend-authorization pass. The QA-only middleware is `test-results/routes/vite.config.ts` and is excluded from runtime source/build. One guest report and one local-auth-fixture report were completed through browser controls; no hosted account or cloud report was created.

Evidence is in `test-results/routes/`: browser states/assertions, HTTP path/method logs, final unit output, check summaries and screenshots. Primary images are `history-completed-desktop.png`, `browser-back-leave-confirmation.png`, `settings-mobile-corrected.png` and `history-narrow-verified.png`. Some IAB captures contain resize/compositor artifacts; these are not pixel-level overflow measurements.

No physical-device, other-engine, live recovery callback/email, natural two-hour expiry, cross-account cloud-report restoration or hosted Vercel route rehearsal was performed. Public route behavior needs deployment. QA tabs were closed, viewport overrides reset and temporary servers stopped. No deployment, hosted settings/schema/function changes, email, commit or push occurred.
