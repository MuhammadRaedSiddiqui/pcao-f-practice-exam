# QA Audit Report — Independent PCAO-F Practice

**Application:** https://pcao-f-practice-exam-one.vercel.app
**Audit date:** 2026-10-12
**Auditor:** Muse (autonomous end-to-end exploratory audit, live-browser)
**App under test:** "Independent PCAO-F Practice" — a single-page practice-exam app (React 19 SPA, single route `/`). 60 questions, 120-minute timed attempt, single-answer and multiple-response items, flag-for-review, review palette, submit confirmation, scored report out of 1000 (pass mark 720), attempt history stored in browser localStorage. No accounts, no backend beyond static hosting (all non-root routes return Vercel 404).

---

## Testing Scope

Four live-browser phases plus a targeted verification pass:

- **Phase 1 — Mapping & first-time user evaluation:** full landing-page map, every non-exam control, the "Source courses" drawer and its 10 external links, 8 direct-URL probes (`/exam`, `/results`, `/review`, `/history`, `/login`, `/admin`, `/api`, one nonsense path), visual-consistency review, keyboard walkthrough of the landing page, the question-bank loading state, and the empty attempts-history state.
- **Phase 2 — Full exam flow:** started an exam; answered single-answer and multiple-response questions; changed answers; cleared answers; flagged; rapid Previous/Next; the "Review & submit" palette (all 60 tiles, legend, jump-to-question); the submit confirmation dialog (including cancelling back out safely); submitted with 3 answered / 57 unanswered / 1 flagged; verified the results page end to end (score math, domain breakdown, filters, per-question review with explanations and source links); browser-Back behavior post-submit; history entry persistence across reload; "Open report" fidelity; starting a second exam; keyboard-only operation inside the exam.
- **Phase 3 — Edge cases & persistence:** refresh mid-exam (timer-continuity claim), rapid flag toggling, review-dialog dismissal (Escape), "Attempt history" mid-exam, starting another exam while one is in progress (abandon flow), double-clicking "Confirm submission", browser Back during an exam, multi-response via keyboard only.
- **Verification pass:** settled three open questions — whether question order is truly fixed across attempts, the duplicate timer in the submit dialog, and the exact initial timer value.

Deliberately **not** tested (blocked by environment/time): the 120-minute auto-submit timeout, a real mobile/tablet viewport (tooling is desktop-Chromium-only), the question-bank load-failure state, devtools console output, localStorage schema inspection, and screen-reader operation.

---

## Overall Product Assessment

This is a well-built, focused practice-exam app. The core loop — start, answer, flag, review, submit, get a detailed scored report — works reliably and survived aggressive edge-case testing (refresh, Back, double-submit, rapid navigation, abandon/replace) without data loss, duplicate records, or broken state. Scoring math was verified exact, the timer is deadline-anchored and keeps running across refresh as advertised, and keyboard operability is genuinely good.

The weaknesses are concentrated in **exam-exit safety** and **submit-dialog completeness**, not in core correctness: there is no guard against accidentally leaving a timed exam (refresh/Back exit silently while the clock runs), and the submit confirmation warns about unanswered questions but never mentions flagged ones. Both are fixable, neither corrupts data. No critical or high-severity bugs were found.

---

## Coverage

| Area | Tested | Result | Notes |
|---|---|---|---|
| Landing page & first-time UX | Yes | Pass with findings | Goal/CTA obvious; terminology nits (UX-004–007) |
| "Before you begin" instructions | Yes | Pass | Accurate; matches observed behavior |
| Source-courses drawer + 10 external links | Yes | Pass | All `target=_blank` + sr-only note; link #1 opened (HTTP 200) |
| Exam start | Yes | Pass | No confirmation (UX-001) |
| Single-answer questions | Yes | Pass | Select/change/clear all correct |
| Multiple-response questions | Yes | Pass | Exact-count blocking via disabled options; counter live |
| Clear answer | Yes | Pass | Only path back to unanswered; works |
| Flag for review | Yes | Pass | Visual + accessible state; survives navigation |
| Previous/Next navigation | Yes | Pass | Rapid clicks land exactly; state persists |
| Review & submit palette | Yes | Pass | All 60 tiles, 4-entry legend, jump works |
| Submit confirmation dialog | Yes | **BUG-001** | Omits flagged count |
| Timer (countdown, persistence) | Yes | Pass | Deadline-anchored; verified across refresh |
| Results page & scoring | Yes | Pass | 0/60 → 0/1000 verified; all-or-nothing confirmed |
| Per-question review, explanations, sources | Yes | Pass | Your-vs-correct, per-option labels, course links |
| Attempt history (localStorage) | Yes | Pass | Persists across reload; full-fidelity "Open report" |
| Resume unfinished attempt | Yes | Pass | Restores answers, flags, deadline |
| Abandon + start another exam | Yes | Pass | Clear destructive-confirmation dialog |
| Double submission | Yes | Pass | Single submission, single history entry |
| Browser back/forward | Yes | **BUG-002** | No leave-guard; exits silently, timer runs |
| Refresh mid-exam | Yes | Pass | No prompt (part of BUG-002); resume works |
| Keyboard navigation (landing + exam) | Yes | Pass | Logical order, visible focus, no traps |
| Direct-URL probing (8 paths) | Yes | Pass | Clean Vercel 404s, no broken fallback |
| Responsive layout (live) | No | Blocked | Tooling is desktop-only; CSS reviewed statically |
| Screen reader | No | Not performed | — |
| Console errors | No | Blocked | No devtools-protocol access in this environment |
| Auto-submit at 120-min timeout | No | Blocked | Requires ~2 h wait |
| Question-bank load failure | No | Not triggered | Error-badge style exists in CSS, never exercised |
| localStorage schema/forgeability | No | Blocked | No storage inspection available |

---

# Confirmed Bugs

## BUG-001 — Submit confirmation warns about unanswered questions but never mentions flagged questions

**Severity:** Medium

**Area:** Exam / Submit flow

**URL/Page:** `https://pcao-f-practice-exam-one.vercel.app` — "Submit exam?" confirmation dialog (from "Review & submit" → "Submit exam")

**Environment:** Desktop Chromium, 2026-10-12

**Observed behavior:**

With 58 unanswered questions and 1 flagged question, the confirmation dialog reads (exact text): "You have 58 unanswered questions. This includes questions without the required number of selections. You can submit with these outstanding answers. Submit your saved selections now? You cannot change them after submission." The flagged question is not mentioned anywhere in the dialog. Flag status is visible only on the review-palette tiles ("Question 3: unanswered, flagged"). A question that is flagged but *answered* would produce no warning of any kind.

**Expected behavior:**

A user who flagged questions specifically to revisit them should be reminded of that fact at the irreversible submit step — e.g. "You have 58 unanswered questions and 1 flagged question."

**Reproduction steps:**

1. Start an exam.
2. Answer Q1 and Q2; flag Q3 without answering.
3. Open "Review & submit" → click "Submit exam".
4. Read the confirmation dialog.

**Reproducibility:** Always (reproduced 2 out of 2 attempts)

**User impact:** A user who flagged items intending to revisit them can submit without any reminder, then discover the omission only in the report. The flag feature's whole purpose is undermined at the final step.

**Evidence:** Screenshot of the "Submit exam?" dialog captured during testing (Phase 2, step 8; re-confirmed Phase 3, test 7).

**Possible technical cause:** Hypothesis — the dialog's warning copy is built only from the unanswered count; the flagged count (already computed for the palette) is not passed into the dialog.

**Suggested direction:** Include the flagged count in the warning sentence when it is non-zero.

---

## BUG-002 — No leave-guard: refresh or browser Back during a timed exam exits silently while the timer keeps running

**Severity:** Medium

**Area:** Exam / Navigation / Timer

**URL/Page:** `https://pcao-f-practice-exam-one.vercel.app` — in-exam view

**Environment:** Desktop Chromium, 2026-10-12

**Observed behavior:**

- Reloading the page mid-exam shows **no** `beforeunload` prompt. The app lands on the home page; the exam does not auto-resume (a "You have an unfinished attempt." banner with "Resume attempt" is shown instead).
- Pressing browser Back mid-exam shows **no** prompt either. Because the SPA pushes no history entries, Back exits the site entirely (lands on the browser start page).
- In both cases the 120-minute timer **keeps running** (deadline-anchored; verified ~27 s of wall-clock elapsed across a refresh). Nothing on screen tells the user the clock is still ticking when they leave.

**Expected behavior:**

A timed exam should ask for confirmation before the user navigates away mid-attempt (standard `beforeunload` guard), since leaving has a real cost: the clock keeps running.

**Reproduction steps:**

1. Start an exam (note the timer).
2. Press browser Back, or reload the page.
3. Observe: no prompt; you leave the exam; the timer continues.

**Reproducibility:** Always (refresh 1/1, Back 2/2)

**User impact:** An accidental Back-swipe, reload, or mis-clicked "Attempt history" silently burns exam time. Recovery exists ("Resume attempt" restores everything), so no data is lost — but the user is never warned that time is passing while they are away.

**Evidence:** Screenshots of the post-refresh home banner ("You have an unfinished attempt." / "Resume with your saved answers, flags, and original deadline.") captured during testing (Phase 3, tests 1 and 8).

**Possible technical cause:** Hypothesis — no `beforeunload` listener is registered on the exam view; the SPA uses no history entries, so Back exits the app.

**Suggested direction:** Add a `beforeunload` confirmation while an attempt is unfinished; consider auto-resuming the exam view on reload instead of dropping to home.

---

## BUG-003 — Duplicate timer display inside the submit confirmation dialog

**Severity:** Low

**Area:** Exam / Submit flow

**URL/Page:** `https://pcao-f-practice-exam-one.vercel.app` — "Submit exam?" confirmation dialog

**Environment:** Desktop Chromium, 2026-10-12

**Observed behavior:**

The confirmation dialog renders its own timer line reading exactly "Time remaining: 01:59:38", while the main exam timer ("Time remaining 01:59:38") remains visible behind the dialog. Two clocks show the same value a few pixels apart. (The review dialog likewise shows its own "Review time remaining" line.)

**Expected behavior:** One timer. The dialog should not duplicate the already-visible exam clock.

**Reproduction steps:**

1. Start an exam, answer one question.
2. "Review & submit" → "Submit exam".
3. Observe two "Time remaining" displays.

**Reproducibility:** Always (1/1, confirmed in verification pass)

**User impact:** Minor visual redundancy; could briefly confuse ("are these two different timers?").

**Evidence:** Screenshot of the "Submit exam?" dialog captured during testing (verification pass, check 2).

**Suggested direction:** Remove the in-dialog timer line; the header timer is sufficient.

---

## BUG-004 — "Ready" status badge shown while the question bank is still loading

**Severity:** Low

**Area:** Landing page / Loading state

**URL/Page:** `https://pcao-f-practice-exam-one.vercel.app` — "Before you begin" card

**Environment:** Desktop Chromium, 2026-10-12

**Observed behavior:**

On first paint, the status badge already reads "Ready" while the bank is still loading — the Start button is disabled and "Loading the reviewed question bank…" is visible. Badge and button disagree for ~0.3–2 s (timed across 3 loads; zero layout shift otherwise).

**Expected behavior:** The badge should read "Loading" (or similar) until the bank resolves, then flip to "Ready" together with the button enabling.

**Reproduction steps:**

1. Hard-reload the home page and watch the "Before you begin" card during the first second.

**Reproducibility:** Always (3/3 loads)

**User impact:** Trivial; brief contradictory state on load. No functional consequence (the button stays correctly disabled).

**Evidence:** Screenshot of the loading state captured during testing (Phase 1).

**Suggested direction:** Drive the badge from the same loading flag as the button's disabled state.

---

## BUG-005 — "Time used" on the report exceeds visible-timer elapsed time by ~11 s

**Severity:** Low

**Area:** Results page

**URL/Page:** `https://pcao-f-practice-exam-one.vercel.app` — practice report, "Attempt details"

**Environment:** Desktop Chromium, 2026-10-12

**Observed behavior:**

After submitting with the dialog showing "Time remaining: 01:58:28" (i.e. 1 min 32 s elapsed), the report showed "Time used 00:01:43 of 120 minutes" — about 11 seconds more than the visible timer accounts for.

**Expected behavior:** "Time used" should reconcile with the countdown the user watched (within a second or two).

**Reproduction steps:**

1. Start an exam, note the dialog's "Time remaining" at submit.
2. Submit; compare with "Time used" on the report.

**Reproducibility:** Observed 1/1 (single timed sample — treat as minor)

**User impact:** Negligible for a practice tool, but the number is presented as precise ("00:01:43") and doesn't match the timer the user saw.

**Evidence:** Report values recorded during testing (Phase 2, steps 8–9).

**Possible technical cause:** Hypothesis — the deadline timestamp is created slightly before the UI paints/starts ticking, or submit-to-render latency is included. May be a measurement artifact of the test rather than an app defect.

**Suggested direction:** If "Time used" is deadline-minus-submit-time, consider anchoring the displayed countdown to the same instant so the two agree.

---

# UX Findings

## UX-001 — Starting an exam requires no confirmation

**Severity/Impact:** Improvement (Low)

**Location:** Home page "Start exam" / "Start new attempt"

**Observed experience:** One click immediately starts a 120-minute timed attempt — no "ready?" step. This is inconsistent with the app's own careful "Start another exam?" destructive-confirmation used when discarding an unfinished attempt.

**Why this creates friction:** A mis-click starts the clock; the only remedy is abandoning (which is confirmed, at least). Low risk on a deliberate practice page, but a one-line "Begin your 120-minute attempt?" step would match the care shown elsewhere.

**Likely user expectation:** A brief confirm before a timed, irreversible-start action.

**Suggested improvement:** Add a lightweight start confirmation mirroring the existing abandon dialog's tone.

---

## UX-002 — Refresh drops to the home page instead of resuming the exam

**Severity/Impact:** Improvement (Low)

**Location:** Post-refresh landing

**Observed experience:** After reload, the user lands on home and must notice the "You have an unfinished attempt." banner and click "Resume attempt" — while the timer runs.

**Why this creates friction:** The user asked for nothing; the app could simply restore the exam view directly (state and deadline both survive).

**Suggested improvement:** Auto-restore the exam view on reload when an unfinished attempt exists (keep the banner as a fallback, not the primary path).

---

## UX-003 — Leaving mid-exam never mentions the timer keeps running

**Severity/Impact:** Low

**Location:** "Attempt history" button (in-exam top bar); post-refresh/post-Back home banner

**Observed experience:** Clicking "Attempt history" mid-exam navigates home with no warning; the banner says "Resume with your saved answers, flags, and original deadline" — "original deadline" hints the clock runs, but never says so plainly.

**Why this creates friction:** Users may assume pausing navigation pauses the exam. The landing page does state "The timer keeps running if you leave or refresh," but nothing reinforces it at the moment of leaving.

**Suggested improvement:** Say it explicitly in the banner ("Your 120-minute timer is still running.") and/or guard the navigation (see BUG-002).

---

## UX-004 — "PCAO-F" is never expanded; "Dataset 1.1.0" is unexplained

**Severity/Impact:** Improvement (Low)

**Location:** Landing page header, H1, timer tooltip, report header

**Observed experience:** The acronym's expansion appears nowhere on the page; "Dataset 1.1.0" appears three times (card footnote, exam header, report) with no explanation of what a "dataset" version means to a test-taker.

**Why this creates friction:** A newcomer must already know the acronym; the dataset label reads as internal jargon.

**Suggested improvement:** Expand the acronym once near the H1 (e.g. title attribute at minimum); gloss the dataset line ("Question bank v1.1.0").

---

## UX-005 — Repetitive and duplicated copy on the landing page

**Severity/Impact:** Improvement (Low)

**Location:** Landing page top section and footnotes

**Observed experience:** "independent(ly)" appears 3× in the first four lines (eyebrow, H1, lead); the "not an official certification exam" disclaimer appears twice (lead paragraph and closing footnote).

**Why this creates friction:** Mild noise at the exact moment the page should be crispest; duplicated disclaimers read as hedging.

**Suggested improvement:** Keep one instance of each; drop the closing-footnote duplicate (or fold it into the lead).

---

## UX-006 — Re-clicking a selected radio does not deselect; "Clear answer" is the only path back

**Severity/Impact:** Improvement (Low)

**Location:** Exam question view

**Observed experience:** Clicking the selected option again does nothing; returning to unanswered requires finding the "Clear answer" button (correctly disabled until an answer exists).

**Why this creates friction:** Toggle-off on re-click is a common radio-group convention in exam UIs; some users will click the option repeatedly expecting it to clear and conclude the answer is "stuck."

**Suggested improvement:** Either allow toggle-off on re-click or make "Clear answer" more prominent (it is currently fine but secondary).

---

## UX-007 — "Review & submit" is referenced in instructions before the user can see it

**Severity/Impact:** Improvement (Low)

**Location:** "Before you begin" bullet 1 vs. exam UI

**Observed experience:** The landing instructions say "jump to a question from Review & submit," but that screen only exists inside the exam — a forward reference the first-time user cannot preview.

**Why this creates friction:** Very minor — the user must take it on faith until they start.

**Suggested improvement:** No change strictly needed; a parenthetical "(available during the exam)" would close the loop.

---

# Accessibility Risks

No hard accessibility failures were found on the tested surfaces; the following are observed risks and untested areas:

1. **Contrast not instrumented.** Dark teal `#087d75` on white and muted grays `#526662`/`#62736f` on near-white *appear* to meet AA visually, but no instrumented measurement was performed — verify with a contrast tool, especially the amber flag indicators on white.
2. **Screen-reader pass not performed.** Structure is promising (clean `h1 → h2` order, landmarks, native radios/checkboxes/buttons, dialog `aria-labelledby`, `aria-expanded` on the drawer trigger, sr-only "(opens in a new tab)" on external links), but no screen-reader run confirmed the exam flow end to end.
3. **Focus restoration after dialog close not verified.** Escape closes the review dialog and state is intact, but programmatic focus return could not be observed with the available tooling.
4. **Disabled checkboxes are skipped in Tab order** (verified visually on a multiple-response question). This is standard behavior and the "N of 2 selected. Deselect an option to choose another." message explains the state — noted as acceptable, not a defect.
5. **Loading affordance is thin:** the disabled Start button's only loading signal is adjacent spinner text (opacity .55 on the button itself is exempt from contrast requirements, but a visible progress cue would help).
6. `prefers-reduced-motion` is respected per the served CSS (not behaviorally verified).

Positives: keyboard-only operation works through the entire exam (logical Tab order, clearly visible 3px teal focus ring, native arrow/Space radio and checkbox behavior, no traps); the review palette exposes tile states via accessible names ("Question 2: unanswered, flagged"); the drawer dialog moves focus in and closes on Escape.

---

# Responsive Issues

Live viewport testing was **not possible** — the available browser tooling is desktop-Chromium-only (no 768 px / 390 px emulation). Static evidence from the served CSS shows deliberate responsive design: `viewport` meta with `viewport-fit=cover`, media queries at ≤768/600/480/380 px, exam-fact tiles reflowing 3→2 columns ≤600 px, card buttons full-width ≤480 px, the drawer dialog full-width ≤600 px, fluid type via `clamp()`, `html{min-width:320px}`, and safe-area-inset padding.

**Risk to verify on a real device:** `body{overflow-x:hidden}` can mask horizontal-overflow bugs, so a clean-looking 390 px render would not prove the absence of overflow. Recommend a real-device pass over: exam question view, the review palette grid (60 tiles), the submit dialog, the results domain table, and the drawer — checking for clipped text, overlapping controls, and unreachable buttons.

---

# Error Handling & Recovery Findings

**Strong:**
- Submit confirmation states exact unanswered counts and explains that partial multi-response selections count as unanswered; "Back to review" returns safely with all state intact.
- Abandoning an unfinished attempt requires explicit confirmation with plain-language consequences ("will permanently discard your unfinished attempt… No report will be created for it"), and the abandoned attempt is indeed gone afterwards.
- Double-clicking "Confirm submission" produces exactly one submission and one history entry — no duplicate records or double-counting.
- Refresh and browser-Back mid-exam never lose data: answers, flags, and the original deadline all restore via "Resume attempt."
- All probed non-routes (`/exam`, `/results`, `/review`, `/history`, `/login`, `/admin`, `/api`, nonsense path) return clean Vercel 404s — no broken SPA fallback, no stack traces, no JSON in the UI.

**Weak:**
- No `beforeunload` guard anywhere (BUG-002): refresh/Back during a timed exam exit silently while the clock runs.
- The question-bank load-failure path was never exercised (a `.status-badge--error` style exists in CSS, so a failure UI was designed — it should be tested by blocking the bank asset/offline load).
- No devtools console access in this environment, so client-side errors could only be ruled out indirectly (5+ identical clean renders, no error banners, no broken assets).

---

# Positive Findings

Only behaviors actually exercised and observed:

- **Timer integrity:** deadline-anchored; survives refresh with wall-clock accuracy (~27 s elapsed across a reload matched the resumed timer); ticks at 1 s/s; "keeps running if you leave or refresh" claim verified true.
- **Scoring integrity:** 0/60 correct → "0 / 1000", "0% correct", "Failed" — arithmetic exact; all-or-nothing multi-response scoring confirmed on a partially-correct item (A+B vs. correct A+D earned zero, as documented); domain subtotals (8+13+7+10+7+9+6) sum to 60.
- **"Order is fixed" claim verified true:** Q1–Q3 stems and option orders were identical across two fresh attempts.
- **Review palette:** all 60 questions present, 4-entry legend, answered/unanswered/flagged/current states visually and programmatically distinct, jump-to-question works.
- **Multi-response UX:** live "N of 2 selected" counter, exact-count blocking via disabled options (mouse and keyboard), clear "Deselect an option to choose another." guidance; partial selections correctly not counted as answered.
- **History:** persists across reload; "Open report" reopens the full interactive report (score, domains, filters, per-question explanations, sources) with nothing lost.
- **Keyboard:** full exam operable keyboard-only — logical order, visible focus, native controls, no traps; multi-response checkboxes toggle with Space and the counter updates live.
- **Destructive-action hygiene:** the only destructive action (abandon attempt) is explicitly confirmed and honored; submitting twice is impossible by double-click.
- **Link hygiene:** all 10 external course links use `target=_blank` + `rel=noopener noreferrer` with an sr-only new-tab note; the sampled link returned HTTP 200.

---

# Top Priority Issues

1. **BUG-002 — no leave-guard on a timed exam.** Accidental refresh/Back exits silently while the clock runs. Add a `beforeunload` confirmation while an attempt is unfinished (and consider auto-resuming the exam view on reload).
2. **BUG-001 — submit dialog omits flagged questions.** Remind the user of flagged items at the irreversible submit step; a flagged-but-answered question currently triggers no warning at all.
3. **BUG-003 — duplicate timer in the submit dialog.** Small, quick fix; remove the in-dialog timer line.
4. **Retest blockers to clear:** real mobile viewport pass (the `overflow-x:hidden` masking risk), the 120-minute auto-submit path, and the question-bank load-failure state.

---

# Recommended Retest Plan

After fixes, re-run in this order:

1. **Submit flow:** flag questions (answered and unanswered), open the submit dialog, and confirm the warning now names flagged counts; cancel back to review and confirm state is intact; submit and confirm the report is unchanged.
2. **Leave-guards:** start an exam, then refresh, press browser Back, and click "Attempt history" — confirm a confirmation appears in each case and that confirming/cancelling behaves sanely; confirm the timer still deadline-anchors across all three.
3. **Submit dialog:** confirm a single "Time remaining" display.
4. **Landing load:** throttle the network and confirm the status badge reads "Loading" (not "Ready") until the bank resolves; then block the bank asset entirely and confirm the designed error state appears with actionable copy.
5. **Mobile pass (390 × 844 and 768 × 1024, real or emulated):** exam view, 60-tile review palette, submit dialog, results domain table, source-courses drawer — check overflow, clipping, reachability of all buttons.
6. **Timeout:** start an attempt with a shortened deadline (or wait out 120 min in a staging build) and confirm auto-submit fires exactly once, the report is marked as an auto-submission, and history records it correctly.
7. **Regression sweep:** one full 60-question attempt start-to-report to confirm scoring, history, and resume behavior are unchanged.

---

# Final Statistics

- **Product areas tested:** 24 (of 30 identified; 6 blocked/untestable in this environment)
- **Interactions/workflows attempted:** ~95 (including rapid-click, keyboard-only, refresh/Back, double-submit, and abandon/replace sequences)
- **Confirmed bugs:** 5
  - Critical: 0
  - High: 0
  - Medium: 2 (BUG-001 submit omits flagged count; BUG-002 no leave-guard on timed exam)
  - Low: 3 (BUG-003 duplicate timer; BUG-004 "Ready" badge during load; BUG-005 "Time used" ~11 s discrepancy)
- **UX findings:** 7 (all Low/Improvement)
- **Accessibility findings:** 0 failures; 6 risks/untested areas noted
- **Responsive findings:** 0 confirmed (live testing blocked); 1 risk flagged (`overflow-x:hidden` masking)
- **Blocked/unreachable areas:** 120-min auto-submit; real mobile/tablet viewport; devtools console; localStorage inspection; question-bank load failure; screen reader

---

## Test data left behind

All testing used the automation browser profile's localStorage (no accounts exist). Final state: **2 completed practice reports** (both 0/1000, submitted 8:07 PM and 8:14 PM PKT) and **1 unfinished attempt** (banner: "You have an unfinished attempt") in "Your attempts." No other side effects; nothing was sent anywhere.
