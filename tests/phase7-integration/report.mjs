import fs from 'node:fs';
import path from 'node:path';
const base='docs/guided-practice/',out='test-results/guided-practice/phase-7-integration/';
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const manifest=json(out+'candidate/manifest.json'),sizes=json(out+'coverage-and-sizes.json'),isolation=json(out+'build-isolation.json');
const suites=[['Actual sixty-guide candidate','browser.json'],['Existing Guided regression','guided-regression.json'],['D12 regression','d12.json'],['Original Mock/PDF regression','mock-pdf.json'],['Ordinary disabled build','ordinary-disabled.json'],['Enabled-empty build','ordinary-empty.json']].map(([name,file])=>({name,file,stats:json(out+file).stats}));
const unitLog=read(out+'units-final.log'),match=unitLog.match(/Tests\s+(\d+) passed \((\d+)\)/);if(!match)throw Error('Final unit suite did not pass');
const unitCount=Number(match[1]),allBrowserPass=suites.every(s=>s.stats.unexpected===0&&s.stats.flaky===0&&s.stats.skipped===0);
const suiteRows=suites.map(s=>`| ${s.name} | ${s.stats.expected} passed; ${s.stats.unexpected} failed; ${s.stats.skipped} skipped | [JSON](../../${out+s.file}) |`).join('\n');
const report=`# Phase 7 — Sixty-guide integration implementation report

2026-10-18 (Asia/Karachi). **Owner-authorized local/test integration implemented. Full Phase 7 is not owner-accepted; production remains disabled/catalog empty.** ${allBrowserPass?'The final executed engineering suites below pass.':'The executed browser results below include unresolved failures; no clean engineering exit is claimed.'}

The owner's “Phase 7 Sixty-Guide Integration Authorization” permits isolated implementation, immutable approved-only artifacts, local preview and engineering verification. It withholds production publication/catalog population/enablement, deployment, commit/push and Phase 8. The earlier plan's pending-implementation wording is superseded only for this authorized local/test work. All educational acceptances, source banks and accepted Phase 6 application/pilot behavior remain unchanged.

## Exact candidate

Artifact ID: **\`${manifest.artifactId}\`**. The [immutable manifest](../../${out}candidate/manifest.json) includes all sixty exact q1/draft-SHA/review-ID/g1 bindings and approval/source input hashes. Common source remains schema 1 / pcao-f-practice-easy-01 / bankVersion 1.0.0 / Intermediate. All ten pilot bindings match their separate [1.1.0 approval](PHASE-7-PILOT-1.1.0-OWNER-ACCEPTANCE.md); all fifty expansion bindings match [final educational acceptance](PHASE-7-FINAL-EDUCATIONAL-OWNER-ACCEPTANCE.md). The original pilot's 1.0.0 approvals/waiver and identities remain intact. No new human review, source verification, signature, personal owner walkthrough or learner study is claimed.

| Excluded candidate file | Entries / bytes | Whole-file SHA-256 |
| --- | --- | --- |
${manifest.assets.map(a=>`| [${a.file}](../../${out}candidate/${a.file}) | ${a.file==='intermediate-1.1.0.json'?'60':a.file==='intermediate-1.0.0.json'?'10':'two version rows'} / ${a.bytes} | \`${a.sha256}\` |`).join('\n')}

Only excluded \`test-results/\` artifacts were assembled; nothing was written to public/guided or the production catalog. Candidate preparation verifies exact recorded owner tuples against immutable authorization metadata, original pins and current q1/g1, then projects only approval.status from draft to approved. It validates the real strict release/catalog/source contracts and writes assets once; existing differing bytes are rejected. The source drafts and actual documentation approvedG1 fields are unchanged/null. There is no new dependency/backend/authentication requirement.

Coverage is exactly **60 unique IDs**, D1–D7 **8/13/7/10/7/9/6**, responses **48 single / 10 double / 2 triple** (Q26/Q59), **180 hints**, **252 option comparisons**, and **70 recorded reference occurrences**. Original keys, wording and every educational field are unchanged. [Measured partitions and sizes](../../${out}coverage-and-sizes.json) show twelve disjoint five-item sets and six disjoint ten-item sets with zero baseline overlap; the empty sixty-item frozen retry session measures **${sizes.sixtyItemEmptyRetrySessionBytes} bytes**, under 4 MiB. The 1.1.0 release is under 2 MiB. This is actual serialization, not a size forecast.

## Implementation and local preview

New excluded tooling lives under [tests/phase7-integration](../../tests/phase7-integration/prepare.ts). The loopback server validates the immutable candidate on startup and serves it only at **http://127.0.0.1:4258** with accounts/cloud/recovery/telemetry disabled and exact Host/port checks. See [launch/resume instructions](PHASE-7-LOCAL-PREVIEW.md). Preparation and tests exercised real source/digest/approval validation, IndexedDB, shared locks and saved commitments. No owner personal walkthrough is inferred.

Production src/public/configuration and q1/g1/session/storage/ownership algorithms were not changed. The preview uses the unchanged production runtime implementation with three checked, test-only catalog dependency substitutions, following the established runtime seam. No permissive validator or arbitrary digest override is installed. Actual runtime ordering is tested in both directions; only legacy-first/current-last satisfies the selected 1.1.0 current policy. Existing authoring tests were aligned with explicit owner approval/waiver decisions: all original authoring fields remain compared except the two intentionally changed documentation fields, while current exact approval tuples and null human/runtime fields are asserted separately. Pre-change test copies and failed results are retained.

## Executed engineering results

| Check | Result | Evidence |
| --- | --- | --- |
| Final TypeScript | Passed | [log](../../${out}typecheck-engineering.log) |
| Final complete unit suite | **${unitCount}/${unitCount} passed** | [log](../../${out}units-final.log) |
${suiteRows}
| Ordinary build and sanitized isolation builds | Passed; existing size/mixed-import warnings retained | [ordinary log](../../${out}build.log), [isolation log](../../${out}build-isolation.log), [asset hashes](../../${out}build-isolation.json) |

All browser suites use **one worker, zero retries**, sequentially, with no deadline/assertion relaxation or pressure investigation. The actual candidate browser cases verify 5/10-item completion/reload, real cardinalities including triples, progressive hints, shared-lock-held feedback withholding, exact old feedback resume without fetching the old asset, cross-tab hint reconciliation, original Mock protection, sixty-item post-exam All/flagged cohorts, missing/corrupt release handling and Q52 at 1366/390/320px including horizontal table access. Screenshots were inspected by AI, not a native accessibility operator.

The existing Guided suite includes original report/PDF download comparisons, private/account ownership, recovery, cancellation and queued-navigation cases; D12 exercises exclusions/final overlap/withdrawal. Original Mock/PDF regression uses the unchanged application. Sanitized disabled and enabled-empty builds exclude all candidate/pilot/test content and expose no approved guidance; candidate build/preview hosting modes are rejected. The initial ordinary build was not served; browser isolation checks use sanitized builds with external services disabled. Hosted services, production accounts/emails and deployments were not used.

Regression scope is explicit: the current executions are listed above, not a fresh rerun of every normal guest/account/analytics/recovery/SDK browser suite. Those unchanged application areas retain their exact-source [accepted Phase 6 evidence](PHASE-6-FINAL-QA-AND-EXIT.md); their historical counts and failures are not relabeled as new results. Readability evidence covers actual Q52 at three widths, Q21 and the sampled complete-session content plus existing responsive/long-table regressions; it does not claim a personal inspection of every guide on every device. Broader native/device/browser and release readability decisions remain outstanding.

## Failure and setup history retained

- [Initial focused run](../../${out}focused-initial.log): **79/81**, two new fixture failures because finish commands omitted the required commandId. Fixtures were corrected to the existing schema; no application contract changed.
- [First combined content run](../../${out}focused-content.log): **238/242**, four historical pre-approval snapshot comparisons disagreed only with later owner authorization/documentation fields. Tests now preserve every original authoring field and separately verify the exact current approval; no content/identity assertion was removed.
- Initial TypeScript attempts reported the new fixture's missing validated-session brand and unused historical loop indices. The repository result is revalidated through the real session validator before branded use; unused indices were removed. [Initial](../../${out}typecheck-initial.log), [intermediate](../../${out}typecheck-confirmed.log), [earlier pass](../../${out}typecheck-pass.log) and final logs remain. An earlier whole-unit run passed **825/825** before additional actual ordering, size and negative-authority cases were added; [82/82 focused](../../${out}focused-final.log) is also historical, not the final complete count.
- [Regression setup failure](../../${out}guided-regression.log): relocated wrapper inherited a relative working directory, so no application assertions ran. After correcting it, [all 72 assertions passed](../../${out}guided-regression-confirmed.log), but shell-managed Vite teardown hung and the owned run was interrupted. The new wrapper uses the existing in-process createServer/close lifecycle; the [final unchanged suite](../../${out}guided-regression-final.log) records its clean result. Neither assertion changes nor a resource-pressure retry was used to obtain that exit.
- Initial actual-candidate browser checks passed **10/10**; the final confirmation adds held-lock and table-scroll assertions. Both [initial log](../../${out}browser-initial.log) and [final log](../../${out}browser-final.log) remain. Existing Vite chunk/mixed-import warnings and a router POP-blocker warning from synthetic history fixtures are retained; they are not silently recast as fixes.
- The legacy Mock/Results specs wrote 36 screenshots to their historical tracked paths. The earlier full-worktree status showed these files clean. New captures were preserved under this run's evidence, and all originals were restored byte-exact from their Git versions; a transient OneDrive file-open failure during restoration was recovered by an idempotent resumed check. [Restoration hashes/new-capture locations](../../${out}historical-visual-restoration.json) record all 36 files and note that filesystem modification times changed. The guest wrapper now changes only its worker working directory to an excluded evidence folder; a [one-case confirmation](../../${out}guest-redirection.log) passed and produced both screenshots there while originals stayed clean. This avoidable preservation mistake and its correction are retained rather than described as if those files were never written.

Any additional final-run failure appears in the per-suite JSON/logs above and is not erased by an earlier pass. Historical PDF cancellation/recovery intermittency, local Set 1 aggregate-budget timeouts and failed two-worker **40/47** remain separate release risks. Passing sequential tests does not establish equivalent-load production responsiveness.

## Compatibility and preservation

The [compatibility verification report](PHASE-7-VERSION-COMPATIBILITY-VERIFICATION.md) distinguishes exact history preservation, safe frozen authorization, missing asset versus missing map, both revocation lineages and compatible reader rollback. Controlled local 1.0.0 fixtures use their own digests; sessions are never silently migrated, regenerated or rehashed. The 4258 test origin does not transfer data from the original 4256 pilot or any production origin. No personal profile inventory or production session history is invented.

[Preservation/integrity results](../../${out}preservation-after.json) compare the pre-integration baseline, allowing only the five authoring-test expectation updates and six current status/checklist documents. All original banks, src/public, algorithms/contracts, existing pilot tooling/content/approvals, all fifty guide files/approval rows, source ledgers and prior evidence remain byte-exact. [Verification inputs](../../${out}verification-inputs.json) bind the final new implementation/tests/docs and candidate artifacts by SHA-256. No package/dependency/configuration change or public candidate asset was introduced.

## Matrix disposition and remaining owner/release decisions

The [accepted matrix](PHASE-7-INTEGRATION-VERIFICATION-MATRIX.md) remains historical planning; [current case dispositions](../../${out}matrix-results.json) identify actual evidence and limits. V01–V19 and V21/V23 have local/test engineering evidence, bounded by suite results above. V20 verifies the existing full-feature-off behavior; no starts-only redesign was requested or implemented. V22 has automated Chromium/AI visual evidence but **native Windows screen-reader, physical-device and broader-browser work remains outstanding**. V24 actual-host publication/rollback is **not run, explicitly outside authorization**.

Remaining decisions/work:

1. Final owner review/acceptance of the scoped Phase 7 implementation and exact candidate; no automatic phase completion or owner walkthrough is claimed.
2. Identify deployment target origin(s), actual supported same-origin historical sessions, legacy row/asset publication scope and a compatible rollback package. Empty-catalog rollback blocks saved guidance; feature-off preserves data but blocks resume. No starts-only pause exists.
3. Complete or explicitly disposition outstanding native accessibility, device/browser/readability, historical PDF/recovery/timing/resource-pressure and hosting/release obligations with real evidence. Existing educational waivers do not waive these obligations.
4. Separately authorize production publication/catalog population/feature enablement and deployment, then perform actual-host smoke/rollback acceptance. Until then production remains disabled/catalog empty. Phase 8 requires separate authorization.

**Stop for owner review. No production publication, deployment, commit, push or Phase 8 occurred.**
`;
fs.writeFileSync(base+'PHASE-7-INTEGRATION-IMPLEMENTATION-REPORT.md',report);
const result={artifactId:manifest.artifactId,unitTestsPassed:unitCount,suites,productionCatalogEntries:0,productionEnabled:false,phase7OwnerAccepted:false,allBrowserPass};fs.writeFileSync(out+'engineering-results.json',JSON.stringify(result,null,2)+'\n');
const matrix=Array.from({length:24},(_,i)=>{const id='V'+String(i+1).padStart(2,'0');return {id,status:i===23?'not run — deployment/publication prohibited':i===21?'partial — Chromium/AI visual complete; native/device/browser obligations pending':i===19?'existing feature-off behavior checked; starts-only redesign not applicable':allBrowserPass?'local/test engineering checks pass':'see suite failures',evidence:i===23?[]:['tests/guidedPhase7Integration.test.ts','tests/phase7-integration/integration.spec.ts','test-results/guided-practice/phase-7-integration/engineering-results.json']};});
const caseNotes=[
 'Sixty exact owner/source tuples and four missing/forged-authority failures; immutable write-once bytes.',
 'Omission, duplicate, extra ID, wrong digest, draft status, changed review ID, stale old digest and invalid revoked-map combinations rejected.',
 'Exactly sixty eligible, no clean-baseline exclusions; all seven domains and response totals measured.',
 'All twelve five-item sets created and compared in exact bank order; union sixty, no repeats.',
 'All six ten-item sets created and compared in exact bank order; invalid index rejected.',
 'Every actual question exercised with correct/incorrect complete sets, duplicates, commitments and locked feedback; actual browser covers all three cardinalities.',
 'Actual 1.1.0 five/ten-item UI sessions complete, reload and retain feedback; held shared lock withholds feedback.',
 'Actual-content 1.0.0/1.1.0 five/ten-item IDB lifecycles and each saved hint stage; browser controlled legacy feedback fixture remains exact.',
 'Browser old asset 404 receives zero fetches on frozen route; missing catalog authorization is separately rejected without mutation.',
 'Actual altered q1/source, saved version, guide prose/review/digest and wrong difficulty rejected; existing generic source negative cases retained.',
 'All four old/new Q4 withdrawal combinations; approved identity retained even when revoked.',
 'Frozen withdrawal blocks affected session and preserves it; unrelated safe session validates.',
 'Actual 59-eligible final overlaps and 4/9 eligibility limits plus all seven original D12 browser cases.',
 'Actual cross-tab hint and reopened IDB checks; existing Guided revision/ownership/queued-route/account cases pass.',
 'Actual missing-map preserved IDB row plus existing quota/corruption/unsupported/recovery/private-access regressions.',
 'Real-source post-exam All sixty, flagged two, incorrect-unanswered fifty-nine; original report hash/PDF model unchanged, existing download comparison passes.',
 'Current original Mock/PDF subset 24 tests and full units; broader unchanged normal account/analytics/recovery/SDK suites reuse accepted Phase 6 evidence rather than being relabeled current.',
 'Actual production runtime selects intended row and deliberately reversed row for both starts/review; current candidate has one Intermediate source and two versions. Future additional source generations need their own candidate policy check.',
 'Retained-map reader validation and missing-new-map rejection prove local authorization boundary; no actual deployment/code rollback was performed.',
 'Both sanitized ordinary feature-off/empty builds tested; feature-off preserves records but blocks resume. No starts-only pause requested or implemented.',
 'Actual release/session sizes, missing/corrupt/HTML/cancelled content and existing loader/resource cases; historical response/pressure risks remain open.',
 'AI inspected Q52/mobile table left/right; automated three-width/no-page-overflow and Q21 checks plus existing responsive regressions. Native Windows reader, physical devices and broader per-record/device coverage remain unperformed.',
 'Sanitized disabled/enabled-empty builds exclude candidate/pilot markers and preserve bank hashes; local candidate build/preview modes rejected.',
 'Not run: production publication, target-origin deployment and actual-host rollback/smoke are explicitly prohibited in this authorization.'
];matrix.forEach((r,i)=>{r.observedScope=caseNotes[i];});
fs.writeFileSync(out+'matrix-results.json',JSON.stringify({scope:'Local/test engineering; no production or native-human evidence',cases:matrix},null,2)+'\n');
const statusFiles=['AGENTS.md','PROJECT_IMPLEMENTATION_STATUS.md',...['GUIDED-PRACTICE-MASTER-PLAN.md','GUIDED-PRACTICE-ARCHITECTURE.md','GUIDED-PRACTICE-EXECUTION-CHECKLIST.md','GUIDED-PRACTICE-VERIFICATION-MATRIX.md'].map(p=>base+p)];
for(const p of statusFiles){const original=read(p),before=out+'before-docs/'+p;fs.mkdirSync(path.dirname(before),{recursive:true});if(fs.existsSync(before))throw Error('Status already updated');fs.writeFileSync(before,original);
 const link=p.includes('/')?'PHASE-7-INTEGRATION-IMPLEMENTATION-REPORT.md':base+'PHASE-7-INTEGRATION-IMPLEMENTATION-REPORT.md';
 const current=`**CURRENT — Phase 7 sixty-guide local/test integration implemented (2026-10-18):** [Implementation/engineering report](${link}) identifies immutable candidate \`${manifest.artifactId}\`: sixty exact owner-accepted 1.1.0 entries plus the original ten-entry 1.0.0 compatibility companion, all excluded from production. Final units **${unitCount}/${unitCount}**; browser suite results and every failure/setup/teardown limitation are retained in the report. Real approved-only q1/g1/catalog/session/storage contracts run in an isolated 127.0.0.1:4258 preview; src/public, banks, accepted wording, original pilot approvals/1.0.0 history and all educational evidence remain unchanged. The owner authorized this local/test implementation and engineering verification; no new human review, owner walkthrough or learner study is claimed. Production remains disabled/catalog empty. **Full Phase 7 final owner acceptance remains pending**, as do target-origin/legacy production scope, native accessibility/device/browser and historical PDF/recovery/timing/resource-pressure dispositions, hosting/rollback and separate publication/enablement/deployment approval. No commit, push or Phase 8. Prior pending-integration wording is superseded only for this scoped authorized work; all history/failures remain facts. Stop for owner review.\n\n`;
 let updated=original.slice(0,original.indexOf('\n')+1)+'\n'+current+original.slice(original.indexOf('\n')+1);
 if(p.endsWith('GUIDED-PRACTICE-EXECUTION-CHECKLIST.md'))updated=updated.replace('- [ ] Separately authorize version-compatibility/integration implementation and target-origin/legacy-runtime scope; required verification remains unexecuted.','- [x] Owner authorizes isolated sixty-guide integration/engineering verification; immutable approved-only 1.1.0 candidate and local/test 1.0.0 companion prepared with exact authority checks. See [implementation report](PHASE-7-INTEGRATION-IMPLEMENTATION-REPORT.md).\n- [ ] Final Phase 7 owner acceptance; deployment-origin/legacy production support; native/device/reliability/hosting/rollback and publication decisions remain pending.');
 fs.writeFileSync(p,updated);
}
console.log(JSON.stringify({artifactId:manifest.artifactId,unitCount,suites:suites.map(s=>({name:s.name,...s.stats})),isolationBuilds:isolation.outputs.length,statusDocumentsUpdated:6,phase7OwnerAccepted:false}));
