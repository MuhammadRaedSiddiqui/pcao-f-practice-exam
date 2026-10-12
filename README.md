# PCAO-F practice

A frontend-only, browser-saved PCAO-F practice exam. The reviewed 60-question dataset is loaded at runtime from `public/question-bank.json`; new attempts use version 1.1.0. Existing attempts keep their original frozen bank snapshots for answering, grading, and review. Results and history show an equal-weight practice score out of 1000 and practice Passed/Failed at an unrounded 720 threshold. These are not official certification scores. Incomplete selections count as Unanswered before submission and Incorrect afterward. The home Source courses drawer lists ten courses without question-specific references.

Run `npm ci` and `npm run dev` to work locally. Run `npm run typecheck`, `npm test`, and `npm run build` before handoff. `npm run test:browser` checks the start, exam, review, and results views in Chromium at mobile, tablet, desktop, landscape, and enlarged text sizes. Install Playwright Chromium first if needed.

The runtime file becomes public only after deployment. See [IMPLEMENTATION_SPEC.md](IMPLEMENTATION_SPEC.md) for the bank schema, attempt rules, and responsive requirements.

See [PROJECT_IMPLEMENTATION_STATUS.md](PROJECT_IMPLEMENTATION_STATUS.md) for the unified implementation, project status, test results, and verification evidence.
