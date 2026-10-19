# PCAO-F Guided Practice — Implementation Plan

**CURRENT — Phase 6 COMPLETE, OWNER ACCEPTED (2026-10-18):** The owner's explicit instruction to mark Phase 6 complete records final acceptance of the current ten-question Intermediate local pilot, including the reviewed UI fixes, on artifact `72dc45bef4b5c344fd093dcbb847925041cdc2db8c239c73f3e66d9a2cea16bc`. [Owner acceptance and completion](guided-practice/PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md) is the authoritative current status and separately records final amended-D14 pilot acceptance. Older Phase 6/D14 acceptance-pending wording below is superseded history. Native accessibility/device verification and historical PDF/recovery/timing risk dispositions remain unperformed/outstanding release obligations; no results or walkthrough signatures are invented. Production stays disabled/catalog empty; Phase 7 is not authorized or started. Documentation-only completion; no application suites, publication, deployment, commit or push.


**Status:** Implementation-ready specification (proposed; not implemented)  
**Prepared:** October 14, 2026  
**Target repository:** https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam  
**Primary objective:** Help students solve lengthy professional scenarios and discriminate between closely competing answers while preserving the realistic 60-question, 120-minute mock exam experience.

## 1. Baseline and non-negotiable constraints

Based on the current public repository, the app is frontend-only (React, TypeScript, Vite) with runtime JSON banks, Zod validation, Markdown rendering, browser-local attempts and snapshot-based grading. The app's `src/App.tsx` currently controls `start | exam | results`; `src/ui/ResultsPage.tsx` offers post-submission filters (`all`, `incorrect`, `unanswered`, `flagged`); `src/domain/bank.ts` validates immutable bank content; `src/domain/difficulty.ts` loads Intermediate and Advanced independently. Existing attempt persistence uses origin-scoped Web Locks and cross-tab protection. The root `IMPLEMENTATION_SPEC.md`, `PROJECT_IMPLEMENTATION_STATUS.md` and `AGENTS.md` are mandatory change references.

**Absolutely preserve:**

- **Mock Exam**: 60 questions, 120-minute fixed deadline, correct/incorrect and answer explanations **only after final submission**, exact-set grading, score /1,000, 720 passing cutoff, flags, answer controls, review/submission dialogs and current PDFs.
- Existing Advanced and Intermediate question-bank JSON content, IDs, option order, answer keys, schema, reviewed status, domain counts, sources and published hashes. Do not modify banks to add guidance.
- Existing saved attempts and frozen snapshots. No migration, regrading, mutation or silent overwrite; older attempts remain readable.
- Intermediate default in the current mock-exam difficulty selector. Source courses drawer and its existing independent selection are not changed.
- Browser-local, frontend-only architecture. No account, backend, runtime LLM, telemetry or paid API for this scope.
- No release is called live until the deployed site is inspected. The public repository's current status says the latest local changes had not yet been deployed.

**Privacy and learning boundaries:** Guidance is original instructional content, not claimed as official exam material; scores from Guided Practice are not certification scores. Show a short disclaimer where relevant.

## 2. Goals, exclusions and success criteria

### Goals
1. Teach a repeatable decision process: identify the ask, detect decisive evidence/constraints, compare closest distractors, and understand the principle.
2. Let students try an answer independently, optionally reveal up to three progressive hints, then commit and receive immediate feedback.
3. Allow short standalone Guided Practice sessions and post-exam guided review based on saved completed mock reports.
4. Support single and multiple-response questions with the existing exact-selection semantics.
5. Track hint dependence and later unassisted practice *separately* from mock scores, with clear caveats for repeated/exposed questions.

### Not in initial scope
- New AI-generated runtime questions, chatbot, adaptive generation, cloud sync, login, changes to timed mock behavior, official pass predictions, mastery claims based only on previously exposed questions, or live analytics.
- Advanced guided content until the Intermediate content is reviewed and fully delivered.

### Definition of success for initial pilot
- Ten reviewed Intermediate questions have accurate, non-revealing hints and a source-grounded closest-option comparison.
- Students can finish 5- or 10-question untimed guided sessions, recover after refresh, and see detailed feedback after each submitted question.
- Mock Exam answers/keys remain hidden mid-exam; all existing tests still pass.
- Completed Intermediate reports can launch guided review when eligible questions exist, without modifying any mock record.
- No broken calls to action when a selected report contains questions without guided content.

## 3. Product IA, routes and entry points

### Homepage
Present two distinct cards under the existing brand:

**Mock Exam — Simulate the exam:** unchanged start/difficulty flow, unchanged timer and delayed results.  
**Guided Practice — Learn the reasoning:** a new, separate pathway, with `Intermediate` displayed as the only supported difficulty in the pilot and full Intermediate release. Advanced is explicitly labeled `Coming later` rather than appearing active or silently falling back.

Guided Practice may be presented as a same-app view, e.g. extend view state in `App.tsx` or extract a view coordinator. Browser URL routing is optional; preserve deep-link and refresh behavior if routing is introduced. **Do not clone the whole exam implementation**.

### Standalone session
- Choose 5 or 10 questions (pilot), or select a supported domain if coverage allows. Default is 5 questions; deterministic selection avoids duplicates within one session, can rotate questions later. Do not pretend the pilot can supply all domains equally.
- Start without a timer; no pass/fail or 1,000-point score.
- Display progress, number of hints used, and a return-to-home action; autosave locally.
- Before submission, reveal at most one additional hint per click; give a clearly labeled reveal action and allow hiding the panel without losing hint-use history.
- Require exactly `selectionCount` choices before **Check answer** is enabled. Options remain editable until that click.
- After clicking **Check answer**, lock the first answer, show correctness, the original explanation and option explanations, side-by-side comparison, vocabulary, and course references; provide **Next question**.
- Offer a final learning summary with first-try accuracy, correct-without-hints, total hints requested, and questions to revisit. Do not calculate mock score /1,000.

### Guided review launched from a completed Mock Exam
- Add **Review with Guided Practice** in `ResultsPage.tsx` and optionally beside a question review when guidance is supported.
- Filter choices: **Incorrect & Unanswered** (default), **Flagged**, **All Questions**. These are independent selection filters; a flagged item can also be incorrect.
- The *combined* incorrect/unanswered filter is new and should be derived from saved `questionOutcome`; **do not change the existing Results filters**.
- Show **X questions eligible for guided review** out of Y matched, along with explanations when some are unavailable. With the 10-question pilot, guide only available questions. If X=0, show a non-error empty state and a **Return to normal question review** action; do not silently substitute questions from a different filter, bank or difficulty.
- Post-exam review uses the completed attempt's **frozen snapshot** for questions, answers and scoring context, not the latest bank.
- Guidance is available only when the overlay matches the exact source question/answer version; older or Advanced attempts may not be eligible during the Intermediate pilot. Unmatched questions keep the original Results review available.
- Starting guided review never creates a new mock attempt, never changes past answers or grades, and never modifies the exported PDF.
- A student may already have seen answers on Results. Show a small `Previously reviewed question` indicator if applicable; never label a retry on exposed content as proof of independent mastery.

### Active mock attempt policy
To prevent accidental answer leakage and time confusion, **block Guided Practice access while any unfinished, unexpired mock attempt exists in this browser origin**. Offer **Resume Mock Exam** or **Return to history**. Detect changes on refresh, tab focus and storage events; check again immediately before displaying hints or feedback. Once the attempt expires or is submitted, Guided Practice can become available. This is an experience-integrity guard, not an anti-cheating security guarantee.

## 4. Guided question interaction specification

A guided question follows these states:

`unseen -> answering -> (hint level 1 -> 2 -> 3 as requested) -> answer committed -> feedback -> completed`.

- **Hint 1: Understand the ask.** Restate the decision objective, not the answer.
- **Hint 2: Identify decisive information.** Highlight mandatory requirements, missing evidence, or relevant limitation, without exposing correct option IDs.
- **Hint 3: Compare the closest competitors.** Ask the student to check a specific differentiator, avoiding an explicit correct answer, option ID or full answer set. Human review must reject inadvertently answer-revealing hints.
- **Post-answer explanation:** show correct answer set and original explanations from the exact question snapshot, then educational breakdown and a structured comparison. A closest distractor may satisfy several constraints but fail one decisive criterion. For multi-select, compare the candidate answer set and explain coverage and exclusions; do not assume one incorrect option is the only distractor.
- **Business vocabulary:** a concise glossary for scenario-specific terms (e.g., scope, escalation, representative testing), initially post-submission or in a neutral non-answer-revealing drawer.
- **Source references:** use existing `sources` associated with the question and any additional reviewed section reference only when justified.
- **Accessibility:** hint buttons and reveal/feedback changes are clearly labeled for screen readers; live regions do not read full explanations unexpectedly; keyboard focus moves to feedback heading on submission; long Markdown tables remain independently horizontally scrollable.

## 5. Versioned guided-content design

**Do not modify `public/easy-question-bank.json` or `public/question-bank.json`.** Add a separately validated overlay, e.g. `public/guided/intermediate-guides-v1.json`.

Example *illustrative* contract (not actual reviewed content):

```json
{
  "schemaVersion": 1,
  "guideVersion": "1.0.0",
  "difficulty": "intermediate",
  "sourceExamId": "pcao-f-practice-easy-01",
  "sourceBankVersion": "1.0.0",
  "contentStatus": "reviewed",
  "questions": [
    {
      "questionId": "Q01",
      "sourceFingerprint": "sha256:<exact-question-fingerprint>",
      "hints": {
        "goal": "Identify the decision the scenario requires.",
        "constraints": "Look for mandatory controls and what evidence is still missing.",
        "comparison": "Compare the strongest choices against the timing of validation."
      },
      "decisiveCriteria": ["Mandatory constraint", "Evidence requirement"],
      "closestDistractorIds": ["A"],
      "comparisonMarkdown": "Reviewed comparison of the best answer and the nearest alternative.",
      "vocabulary": [{ "term": "representative testing", "definition": "Testing cases that reflect likely real use." }],
      "reviewStatus": "approved"
    }
  ]
}
```

This example is illustrative only: true question IDs/option IDs and fingerprints must be generated from actual bank records. Do not populate actual hint wording without reviewing the correct content.

### Contract and validator rules
- Implement a strict, versioned Zod schema under `src/domain/guided/` with unknown fields rejected.
- The guide's exam ID, bank version and difficulty must match its intended source bank. `questionId` must exist and be unique.
- Compute a reproducible SHA-256 `sourceFingerprint` from a defined canonical representation of question ID, stem, ordered options, selection count, correct IDs, explanations and sources; verify on loading. Do **not** rely on bank version alone or unstable object iteration order.
- Validate closest distractor IDs against known option IDs and against the correct set where appropriate; do not apply a single-option distractor assumption to multi-select questions.
- Require three nonblank hints, nonblank comparison, and review approval. Enforce that content only renders for matching fingerprints; unsupported or mismatched items show as unavailable, never guess or silently use an alternate question.
- Write test fixtures demonstrating stale guide/bank versions, tampered answer keys, mismatched fingerprints, duplicate IDs, unsupported difficulty, missing hints and incomplete coverage.
- Use the existing Markdown sanitization and GFM table rendering; don't render HTML from author content or introduce unsafe link behavior.
- A new hint/reasoning edit increments `guideVersion`, even when source question has not changed; previously started guided sessions retain a frozen reviewed overlay snapshot or show a deliberate compatible migration, never silently swap in-place.

### Content authoring and human review process
For each Intermediate question, prepare a reviewer record with: exact question ID and source version; the correct option set; decisive question ask; 2–4 critical constraints; strongest distractor(s) and specific failure(s); 3 progressive hints that do not reveal keys; short glossary where needed; one supporting course-section reference; human reviewer approval. Independently cross-check original question's option explanations and correct set. If an ambiguity or key problem is discovered, **do not silently change the bank**; log it for a separately approved, versioned bank correction. Validate 10/10 records before pilot and 60/60 before Intermediate-wide launch.

## 6. State, persistence and compatibility

Proposed separate browser storage namespace, e.g. `pcao-f:guided:v1:*` (distinct from mock attempt keys). Guided session record:

```ts
type GuidedSession = {
  id: string;
  origin: 'standalone' | 'post-exam';
  difficulty: 'intermediate' | 'advanced';
  sourceAttemptId?: string; // only if launched from a completed mock
  sourceBankVersion: string;
  guideVersion: string;
  status: 'in-progress' | 'completed';
  startedAt: number;
  completedAt?: number;
  currentIndex: number;
  questionIds: string[];
  // Freeze the exact eligible question and its reviewed guide content, or
  // store immutable versioned references with provable availability.
  snapshot: GuidedQuestionSnapshot[];
  responses: Record<string, {
    selectedOptionIds: string[];
    maxHintRevealed: 0 | 1 | 2 | 3;
    committedAt?: number;
    isCorrect?: boolean;
    viewedFeedback?: boolean;
  }>;
  revision: number;
};
```

**Behavior:** save after each committed hint reveal and answer; reload resumes exact position, revealed-hint count and feedback state. Multiple tabs must not cause stale overwrites. Reuse compatible revision+Web Lock patterns if appropriate; review corrupted-record handling and localStorage quota errors. Guided storage failures should show explicit recovery options without deleting mock histories.

**Compatibility:** never change the `Attempt` schema or values merely to support Guided Mode. Existing Results reads remain read-only and backed by frozen snapshots. If a guide's question fingerprint mismatches a saved snapshot, skip that question with a transparent reason. If a saved guided record's overlay is missing or invalid, show a read-only recovered summary where possible rather than generating new guidance.

## 7. Architecture and suggested code organization

Proposed layout (adjust to project conventions when implementing):

```text
public/
  guided/intermediate-guides-v1.json
src/
  domain/guided/
    schema.ts          # guide and session validation
    fingerprints.ts    # canonicalization + source binding
    loader.ts          # difficulty/version-aware fetching
    session.ts         # transitions and grading of first guided attempts
    storage.ts         # isolated persistence, recovery and concurrency
    selectors.ts       # guided eligibility and post-exam filters
  ui/guided/
    GuidedLanding.tsx
    GuidedSessionPage.tsx
    GuidedHintPanel.tsx
    GuidedFeedback.tsx
    GuidedComparison.tsx
    GuidedSummary.tsx
    PostExamGuidedDialog.tsx
  styles.css           # extend established responsive design
  App.tsx              # only minimal view integration
  ui/ResultsPage.tsx   # only completed-report entry point

tests/
  guided-*.test.ts(x)
  browser/guided-*.spec.ts
```

**Reuse existing components:** `MarkdownContent`, Card, Button, Dialog, selection guidance, `questionOutcome`, and exact-set comparison semantics. Share pure helpers if needed, but **do not refactor timed exam persistence unnecessarily**. Keep guided responses and correctness checks in distinct domain functions to avoid introducing reveal-state bugs into timed attempts.

## 8. Implementation phases and hard gates

### Phase 0 — Baseline freeze and design audit
**Tasks:** inspect `AGENTS.md`, `IMPLEMENTATION_SPEC.md`, status report, existing tests, snapshot schema and all relevant UI components. Record current commit SHA, hashes of both reviewed banks, screenshot baselines and tests (`npm run typecheck`, `npm test`, `npm run build`, `npm run test:browser` where available). Identify safe composition boundaries and confirm guidance cannot affect mock attempt serialization.

**Deliverables:** short baseline report, risk register, approved UI wireflow, baseline test results.  
**Gate:** no unresolved baseline failures without being recorded; both bank checksums documented; no code changes to either bank.

### Phase 1 — Guided domain foundation (no student-facing UI)
**Tasks:** introduce strict guide schema, fingerprint function, loader, eligibility resolver and pure guided-session state machine; create synthetic fixtures and unit tests. Load only reviewed, source-matched guidance. Implement unsupported and stale-content errors. Ensure exact cardinality on multi-select.

**Deliverables:** types, validators, loader, selectors, pure session transitions and negative-path tests.  
**Gate:** mismatched guide content is rejected safely; mock bank validation and grading tests unchanged; typecheck, unit tests and build pass.

### Phase 2 — Content pilot: 10 Intermediate questions
**Tasks:** choose a deliberate mixture: long narrative, closely competing options, compact tables, evaluation/validation cases and multi-select items. Draft goal/constraint/comparison hints and option comparisons outside the runtime exam bank. Human-review each key against question sources and confirm hints do not reveal answer letters or sets. Publish *only* approved overlay items; test their fingerprints.

**Deliverables:** `intermediate-guides-v1.json`, 10-row review ledger, authoring checklist, content-validation report.  
**Gate:** 10/10 valid and approved; 0 source mismatches, 0 unanswered content-review defects.

### Phase 3 — Standalone Guided Practice UI
**Tasks:** add homepage Guided Practice card, 5/10-question selector, accessible question view, optional progressive hint panel, lock-on-submit answer action, feedback and comparison panel, completion summary, responsive CSS. No guidance is visible until explicitly requested or after submission. Before submission there are no correctness markers. Pilot only offers Intermediate.

**Deliverables:** full standalone pilot path, mobile/desktop screenshots and interaction notes.  
**Gate:** single + multi-select, table, long narrative, keyboard, touch, refresh, and narrow viewports all pass; mocks still hide keys until submitted.

### Phase 4 — Guided persistence and safe navigation
**Tasks:** add separate schema-versioned guided localStorage records, resume, idempotent submissions, stale-write protection, crash/recovery messaging, cross-tab handling and isolation from mock storage. Prevent guided entry while a live unfinished mock exists. Ensure guided sessions never start a mock timer or alter an active attempt.

**Deliverables:** recovery tests, cross-tab and storage-failure evidence.  
**Gate:** refresh/resume retains exact hint use and answer lock; stale writes fail safely; active mocks remain unchanged.

### Phase 5 — Post-exam Guided Review
**Tasks:** add `Review with Guided Practice` after final submission and in saved report views; implement Incorrect & Unanswered (default), Flagged and All question selectors using the frozen attempt snapshot. Compute compatible available guides and matched/eligible counts. Start with only compatible pilot items; use good empty/unsupported states and let users return to native Results. Never mutate source attempts or regenerate PDF content.

**Deliverables:** report-launch dialog, frozen-snapshot linkage, behavior tests for mixed/empty cohorts and older records.  
**Gate:** correct filter membership, snapshot stability, 0 writes to original attempts, no guidance access before submission, no Advanced fallback to Intermediate, valid backward compatibility.

### Phase 6 — Full QA, rollout and release verification
**Tasks:** run all existing suites plus guided unit and Playwright suites; run Playwright at 320px, 390px, 768px and 1366px, mobile landscape, enlarged text, touch and keyboard. Visually inspect question content, hint progression, feedback and wide tables. Check WCAG-oriented focus handling, aria states, no page-wide overflow and no app-key leakage. Test mixed same-browser tabs, interrupted session, storage denial/quota, previous bank snapshots and expired mocks. Update README, specification, status record and changelog. Deploy separately, then smoke-test the actual deployed hostname.

**Deliverables:** consolidated QA report, before/after screenshots, release checklist and deployment proof.  
**Gate:** no critical/high defects, no failed regression tests, no answer leakage, and public build confirmed to match approved source revision. Otherwise do not claim completion.

### Phase 7 — Intermediate-wide content expansion
**Tasks:** expand approved guide overlay from 10 to all 60 Intermediate questions; validate all fingerprints and content records, then enable 60/60 guided post-exam eligibility. Optionally support targeted domain practice where there is sufficient content. Keep the guided mode separate from the mock score.

**Gate:** 60/60 reviewed, no stale overlays, full automated and human content audit pass.

### Phase 8 — Advanced Guided Practice (subsequent release)
**Tasks:** repeat the content authoring/approval process on the Advanced frozen bank without reusing Intermediate explanations. Design deeper constraint graphs and larger competing-option comparison content; keep learner controls consistent. Add Advanced selection only after its approved overlay is complete enough for a coherent release. Never route missing Advanced guidance to Intermediate questions.

**Gate:** accepted content coverage target met; separate Advanced fingerprint and UI regression suite passes.

## 9. Acceptance test matrix (minimum)

| Area | Required assertions |
|---|---|
| Mock confidentiality | During 120-minute attempts no hints, domain-specific keys, grades, option explanations or guided overlays are displayed, including via dialogs/results navigation. |
| Existing mock behavior | Timers, flags, navigation, exact-set grading, intermediate default, post-submit report, history and PDF behave as before. |
| Guided hint order | Hints reveal only by action, in order; state persists; hints don't expose keys; closing and reopening preserves max level. |
| Single-answer flow | Can select/clear; answer locks after Check answer; correct set displayed only afterward. |
| Multi-response flow | Exactly 2/3 options required; cannot select beyond count; unsubmitted partial selection never gets feedback. |
| Answer comparison | Shows verified decisive criteria and accurate nearest-distractor explanation after answer only. |
| Post-exam filtering | Wrong+unanswered union, flagged, all; total and eligible counts correct even with overlaps. |
| Snapshots | Guided questions use source attempt snapshot; unmatched version/fingerprint never resolves to a newer bank question. |
| Backward compatibility | Legacy/Advanced reports still work, even if Guided Mode is unavailable for that record. |
| Persistence | Refresh/resume, cross-tab, invalid storage and error recovery don't overwrite mocks. |
| Active mock guard | Starting/resuming a live mock blocks guided entry and hides any existing guided panels when another tab creates a live attempt. |
| Accessibility/responsive | Focus, headings, keyboard, screen reader status, 44px targets, scrolling tables, 320px/mobile/enlarged text. |
| Release | All tests/build pass; screenshots reviewed; actual production deployment matches accepted commit. |

## 10. Suggested learning metrics (no surveillance)

Track locally per supported question/session:
- `firstAttemptCorrect` and `maxHintRevealed` (0–3).
- `correctWithoutHints` share and average hints requested.
- Revisited question IDs and improvement on later attempts, clearly labeled `previously exposed` if the question/answer has already been seen.
- Optional later **fresh scenario transfer test** to distinguish real learning from memorization; do not call repeated exposed items a validated mastery measure.

Avoid making the application claim an official certification success probability. Do not add telemetry without a separate privacy decision.

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Hint accidentally gives away correct answer | Progressive reveal rubric + independent human review; explicit validation checklist; avoid option letters pre-submit. |
| Guidance mismatches a revised answer key | Reproducible question fingerprint + fail closed; versioned overlay; snapshot binding. |
| Results link has no matching guidance in 10-question pilot | Show matched/eligible counts and clear `not available yet` states, never fall back silently. |
| Mock behavior regressions | Separate state/storage; mock-specific test snapshots; no modification to grading; hard regression gate. |
| Students memorize repeated questions | Label exposed repeats and later add fresh equivalent transfer questions. |
| Browser data loss or storage errors | Local-only disclosure, error recovery and optional future export/import of guided history as a separate enhancement. |
| Content production grows unwieldy | Author-and-review ledger; start with 10, ship only approved content, then scale to 60. |
| Production differs from local workspace | Deploy with explicit release checklist and smoke tests against actual Vercel URL. |

## 12. Release checklist and handoff format

The implementation agent should stop after each phase and report:
1. What was implemented, exact modified/new paths, and any deviations from this plan.
2. The evidence (`typecheck`, unit, build, Playwright; counts and pass/fail, not invented claims).
3. Verified invariants: bank file checksums, unchanged mock answer gating, unchanged scores/attempts, guided content coverage.
4. Screenshots/viewport matrix and accessibility findings.
5. Current blockers, risks and whether the phase acceptance gate passed.

**Do not automatically proceed through all phases in one uncontrolled code change.** Phase review protects the existing exam. For Phase 2 and Phase 7, do not publish AI-drafted hints without source-grounded editorial approval.

## 13. References inspected

- Repository: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam
- Current design: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/IMPLEMENTATION_SPEC.md
- Current project status: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/PROJECT_IMPLEMENTATION_STATUS.md
- Repository coding requirements: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/AGENTS.md
- Core app: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/src/App.tsx
- Results UI: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/src/ui/ResultsPage.tsx
- Bank validation: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/src/domain/bank.ts
- Difficulty loading: https://github.com/MuhammadRaedSiddiqui/pcao-f-practice-exam/blob/main/src/domain/difficulty.ts

**Bottom line:** This is a separate, reviewed, version-matched learning layer on top of existing question snapshots. It preserves the authentic timed mock while offering both standalone tutoring-like practice and targeted post-exam review. The first release is a 10-question Intermediate pilot; expand only after passing the content and regression gates.
