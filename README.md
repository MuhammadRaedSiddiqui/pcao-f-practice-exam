# PCAO-F practice

New exams begin with a difficulty-selection dialog. Advanced (default) uses `public/question-bank.json` version 1.1.0; Intermediate uses the reviewed `public/easy-question-bank.json` version 1.0.0. Both are available. New attempts save their difficulty and bank snapshot; older records display "Original exam" and remain readable. Source courses are shown for the selected level. See [INTERMEDIATE_INTEGRATION_VERIFICATION.md](INTERMEDIATE_INTEGRATION_VERIFICATION.md).

A frontend-only, browser-saved PCAO-F practice exam. Each difficulty loads its own reviewed 60-question, 120-minute dataset at runtime. Existing attempts keep their original frozen bank snapshots for answering, grading, and review. Results and history show an equal-weight practice score out of 1000 and practice Passed/Failed at an unrounded 720 threshold. These are not official certification scores. Incomplete selections count as Unanswered before submission and Incorrect afterward. The home Source courses drawer lists ten courses without question-specific references.

Saved attempts synchronize across tabs, reject stale changes, and finalize on the Start page when their deadline passes. Saving requires a browser with Web Locks; read-only reports remain available without coordinated saving. Older records keep their original snapshots and grades.

Run `npm ci` and `npm run dev` to work locally. Run `npm run typecheck`, `npm test`, and `npm run build` before handoff. `npm run test:browser` checks the start, exam, review, and results views in Chromium at mobile, tablet, desktop, landscape, and enlarged text sizes. Install Playwright Chromium first if needed.

The runtime file becomes public only after deployment. See [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md) for the bank schema, attempt rules, and responsive requirements.

See [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for the unified implementation, project status, test results, and verification evidence.

Deploy to Vercel from the project root with `vercel --prod`; choose `pcao-f-practice-exam` as the project name when prompted. `vercel.json` sets Vite, `npm ci`, `npm run build`, and output `dist/`. `.vercelignore` excludes local helpers, screenshots, test evidence, and root draft banks while keeping the runtime bank in `public/`. The current sandbox deployment attempt was blocked by outbound HTTPS permissions; no deployment URL has been confirmed.
