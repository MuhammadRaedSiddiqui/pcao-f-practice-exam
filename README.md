# PCAO-F practice

New exams begin with a difficulty-selection dialog. Intermediate is selected by default on every opening, including after cancelling an Advanced choice. The primary button reads **Start Exam** for either level. The three comparison bullets describe reading load, interacting constraints, and structured evidence, using the approved wording based on both reviewed banks.

Intermediate uses `public/easy-question-bank.json` version 1.0.0; Advanced uses `public/question-bank.json` version 1.1.0. Both reviewed banks are available and load independently. New attempts save their difficulty and bank snapshot; older records display "Original exam" and remain readable. The Source courses drawer opens on Advanced and can show either level's courses. See [INTERMEDIATE_INTEGRATION_VERIFICATION.md](INTERMEDIATE_INTEGRATION_VERIFICATION.md) for the original integration evidence and [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for subsequent changes.

A frontend-only, browser-saved PCAO-F practice exam. Each difficulty loads its own reviewed 60-question, 120-minute dataset at runtime. Existing attempts keep their original frozen bank snapshots for answering, grading, and review. Results and history show an equal-weight practice score out of 1000 and practice Passed/Failed at an unrounded 720 threshold. These are not official certification scores. Incomplete selections count as Unanswered before submission and Incorrect afterward. The home Source courses drawer lists ten courses without question-specific references.

Saved attempts synchronize across tabs, reject stale changes, and finalize on the Start page when their deadline passes. Saving requires a browser with Web Locks; read-only reports remain available without coordinated saving. Older records keep their original snapshots and grades.

Results includes **Export report (PDF)**, which downloads scores, attempt metadata, domain results, review priorities, and all saved question reviews regardless of the active filter. Export works offline once its module has loaded and does not change browser storage. Intermediate Results and PDF reports display "Independent PCAO-F Practice — Intermediate" while preserving the reviewed bank title and frozen snapshots.

Run `npm ci` and `npm run dev` to work locally. Run `npm run typecheck`, `npm test`, and `npm run build` before handoff. `npm run test:browser` checks the start, exam, review, and results views in Chromium at mobile, tablet, desktop, landscape, and enlarged text sizes. Install Playwright Chromium first if needed.

Changes to the app and either runtime bank become public only after deployment. See [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md) for the bank schema, attempt rules, and responsive requirements.

See [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for the unified implementation, project status, test results, and verification evidence.

Deploy to Vercel from the project root with `vercel --prod`; choose `pcao-f-practice-exam` as the project name when prompted. `vercel.json` sets Vite, `npm ci`, `npm run build`, and output `dist/`. `.vercelignore` excludes local helpers, screenshots, test evidence, and root draft banks while keeping both runtime banks in `public/`. The current sandbox deployment attempt was blocked by outbound HTTPS permissions; no deployment URL has been confirmed.
