// AI-authored, item-specific Phase 7 prose. Evidence-only authoring; no runtime imports.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
const folder = 'docs/guided-practice/content/intermediate-expansion/';
const evidence = 'test-results/guided-practice/phase-7-batch-1/';
const root = 'docs/guided-practice/';
const sha = value => createHash('sha256').update(value).digest('hex');
const readJson = p => JSON.parse([...fs.readFileSync(p, 'utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)][0][1]);
const inventory = readJson(root + 'PHASE-7-QUESTION-INVENTORY.md');
const g = (questionId, hints, decisiveCriteria, reasoningMarkdown, comparisons, closestDistractorIds, terms) => ({
  questionId, hints, decisiveCriteria, reasoningMarkdown,
  optionComparisons: comparisons.map(([optionId,satisfiesMarkdown,failsOrLimitsMarkdown]) => ({optionId,satisfiesMarkdown,failsOrLimitsMarkdown})),
  closestDistractorIds, vocabulary: terms.map(([term,definition]) => ({term,definition})),
});
const authored = [
g('Q1', [
  'Compare the evidence needed for a personal experiment with the evidence needed when colleagues depend on its results.',
  'List the live-service requirements and separate successful examples from the failure conditions that have not been exercised.',
  'For each proposed plan, trace when those requirements would be tested and who would handle an operational problem after adoption.'
], [
  'The tool is becoming a shared service handling real customer records and payments.',
  'Customer separation, saved-booking persistence and payment-failure recovery are explicitly untested.',
  'The adoption plan must establish those requirements and continuing support before the agency depends on it.'
], 'The bank selects C. The proposed use exposes twelve agents and real customers to behavior the sample bookings did not test. Defining and testing the stated live-service requirements, with an ongoing support owner before adoption, addresses that evidence gap. A adds a developer but still checks only successful samples. B begins operational dependence before the required behavior is established. D supplies backups and a checklist, but neither proves customer separation nor tests failed-payment handling. The guide applies the course’s escalation principle to these explicit case requirements; it does not claim that a particular architecture or test suite has already been approved.', [
  ['A','Includes a developer review before wider use.','The review is limited to successful bookings, leaving isolation, persistence and failure recovery untested.'],
  ['B','Provides staff monitoring and a route for later improvements.','Customer and payment operations begin before the service requirements are established; discovering problems later does not satisfy this timing requirement.'],
  ['C','Defines and tests the actual service requirements and assigns continuing support before the agency relies on the tool.','No failure under the stated criteria; a plan to test is not itself evidence that implementation has passed.'],
  ['D','Adds backup and recovery preparation to the existing tool.','These measures cover only part of the stated risks and do not establish all required service behavior or ongoing support.']
], ['A','D'], [['Prototype','An early working version used to explore a proposed solution.'],['Operational dependency','A situation in which other people’s work relies on a tool continuing to function.'],['Access isolation','Keeping one customer’s records separate from another’s access.']]),
g('Q2', [
  'Break the draft into separate promises and ask what evidence supports each one.',
  'Treat the policy’s notice condition and space condition separately; a check of one does not automatically settle the other.',
  'Annotate each promise as supported, unsupported or conditional, then compare how the revisions handle those different evidence states.'
], [
  'The verified notice is 72 hours, exceeding the policy’s 48-hour fee threshold.',
  'No Saturday space has been confirmed; the policy makes a move depend on availability.',
  'The revision should preserve supported fee eligibility without promising an unverified move.'
], 'B is the bank’s answer. Since 72 ≥ 48, the notice qualifies for the fee waiver; this does not establish Saturday capacity. B keeps the supported fee statement and conditions the move on a space check. A incorrectly links the notice test to availability. C treats lead time as evidence of capacity, even though the capacity check has not occurred. D obtains another interpretation rather than the missing availability evidence. The arithmetic and separation of policy conditions come from the frozen scenario. Course support concerns checking claims against requirements and sources, including the limits of agreement between models.', [
  ['A','Recognizes that the Saturday guarantee lacks a space check.','Also removes supported fee eligibility by introducing an availability dependency absent from the policy’s notice rule.'],
  ['B','Preserves the verified fee condition and leaves the move dependent on the unverified space condition.','No failure under the case; availability still needs staff confirmation before a guarantee.'],
  ['C','Retains the supported fee waiver and acknowledges some uncertainty with provisional wording.','Provisional confirmation still asserts a move the unchecked capacity does not support; adequate notice is not available space.'],
  ['D','Invites a second assessment of the text.','Agreement about the policy cannot verify an actual Saturday space or remove its explicit availability condition.']
], ['C'], [['Conditional claim','A statement that holds only if a specified requirement is met.'],['Fee waiver','An exemption from a charge under the stated policy.'],['Evidence boundary','The limit of what the available observations support.']]),
g('Q3', [
  'Distinguish the information being examined from the authority to change an operational record.',
  'Compare trust in a publisher, authenticity of a message and the approval needed for a particular action.',
  'Trace each proposal from reading the message to changing order status, noting where the required decision would occur.'
], [
  'The assistant may compare delivery information, but the manager must authorize each order closure.',
  'No closure authorization has been given for this order.',
  'Closing the order changes the daily follow-up list; supplier wording does not replace the manager’s decision.'
], 'A is correct under the frozen key: comparison can continue without changing status, while closure waits for this order’s manager authorization. B makes the operational change first and seeks review afterward. C substitutes approval of a general comparison method for the specified approval of each closure. D verifies the sender and publisher but never obtains the manager’s action authority. The scenario does not prove the supplier is malicious; the problem is that a message being processed cannot supply the missing authorization. This applies the course distinction between tool provenance and content trust to the case’s explicit approval gate.', [
  ['A','Completes the permitted comparison without editing and requests the required authorization for this order before closure.','No failure under the case; later closure still depends on receiving the manager’s decision.'],
  ['B','Continues the comparison and provides for a later manager review.','Even provisional closure removes the order from follow-up before the required approval.'],
  ['C','Recognizes the embedded instruction and seeks approval of a method.','Method approval does not authorize each order closure; automated matching still crosses the stated gate.'],
  ['D','Checks message authenticity and records a reason.','Neither a known supplier nor a verified plugin publisher holds the manager’s stated closure authority.']
], ['C','D'], [['Action authorization','Permission from the designated decision-maker to perform a specific change.'],['Read-only','Access that permits inspection without changing the underlying records.'],['Prompt injection','Instructions in processed content that try to redirect an assistant’s behavior.']]),
g('Q7', [
  'Separate evidence about the entries on a list from evidence about the list’s coverage.',
  'Write down which tickets were actually checked and which claims extend to tickets that were not checked.',
  'Consider what source comparison could test the assertion that nothing qualifying was left out, and distinguish uncertainty from a demonstrated mistake.'
], [
  'All eight returned tickets were verified against the urgency rule.',
  'The other twenty-two tickets have not been examined.',
  'Correct inclusions alone neither establish completeness nor prove that an omission occurred.'
], 'A preserves both known and unknown information. The eight inclusions are supported; a completeness claim also concerns the 30 − 8 = 22 unexamined tickets. Those need comparison with the same urgency rule. B extends evidence about the returned tickets to the unreviewed remainder. C goes too far in the opposite direction: lack of a check does not establish that an urgent ticket was missed. D supplies agreement between assistants rather than the missing source-grounded coverage check. This is a deduction about the case’s evidence, supported by the course’s general output-validation approach and its warning that model agreement is not a truth guarantee.', [
  ['A','Keeps the verified inclusions and correctly identifies the unverified completeness claim and remaining source check.','No failure under the present evidence; a later review may confirm completeness or find an omission.'],
  ['B','Acknowledges that every returned ticket qualifies.','Does not establish that the unexamined tickets were correctly excluded; it conflates inclusion accuracy with coverage.'],
  ['C','Recognizes that the remaining tickets were not checked.','Asserts an actual omission without evidence of any qualifying ticket outside the list.'],
  ['D','Uses a second assistant to compare selections.','Matching selections can share an omission and do not replace checking the remainder against the source rule.']
], ['C','D'], [['Completeness','Whether every qualifying item has been included.'],['Inclusion accuracy','Whether the items selected actually meet the selection rule.'],['Unverified','Not yet established by the required evidence; it does not necessarily mean false.']]),
g('Q8', [
  'Identify who contributed the judgments, the drafting and the final checks before evaluating how the work is presented.',
  'The rules have already been checked. Consider the recipient’s stated understanding as well as factual accuracy of the description.',
  'Compare the proposed notes against the actual division of work: what would each reader learn, miss or wrongly attribute?'
], [
  'The consultant made all judgments; AI substantially drafted paragraphs from her notes.',
  'No checked rule settles disclosure, but knowing about the drafting would change this client’s understanding.',
  'Presentation must describe the contribution truthfully while retaining the consultant’s responsibility.'
], 'The bank chooses D because it accurately reports substantive drafting assistance and keeps judgments, verification and responsibility with the consultant. A describes real review but omits the contribution relevant to this client’s stated expectation. B acknowledges AI but invents a role in judgment that the scenario expressly assigns to the consultant. C’s generic office-software description leaves the material contribution unclear. The course provides the rule-first, recipient-understanding approach; this scenario has already supplied both the rule-check outcome and the client’s expectation. The guide makes no general claim about legal disclosure duties.', [
  ['A','Truthfully says the consultant reviewed the judgments and claims.','Review is a different contribution from drafting; this note leaves the material drafting assistance undisclosed.'],
  ['B','Mentions AI involvement and final fact-checking.','Misattributes some judgments to AI even though the consultant supplied them herself.'],
  ['C','Acknowledges some tool use and emphasizes the checked final work.','The broad software label does not explain the substantive drafting contribution that matters to this client.'],
  ['D','Describes AI’s drafting contribution accurately and preserves the consultant’s judgments, checks and ownership.','No failure under the stated facts; disclosure does not transfer responsibility away from the signer.']
], ['A','B'], [['Disclosure','A truthful explanation of a contribution relevant to a recipient’s understanding.'],['Accountability','Responsibility for the work and its consequences.'],['Attribution','Identifying who performed a particular part of the work.']]),
g('Q9', [
  'Identify the repeated handling, variation in results and decisions the workflow must preserve.',
  'Use the trial evidence to distinguish removable transitions from the manager’s required decision; then classify the material reused across runs.',
  'Sketch the proposed sequence and check whether it saves effort on work that still needs to exist, with the final approval in the required place.'
], [
  'The trial permits the three drafting stages to run together without intermediate decisions.',
  'Every finished brief still requires the staffed manager fact-check and approval before circulation.',
  'The solution must reduce handoffs and repeated context while making the remaining method consistent and reusable.'
], 'The complete keyed set is A and C. A combines the tested drafting stages while retaining the final manager gate. C then places shared background in the Project reference and the surviving drafting/formatting procedure in one Skill. A alone does not establish those reusable homes; C explicitly follows consolidation, so the pair addresses both process and configuration. B standardizes separate stages while preserving unnecessary handoffs. D changes waiting time without resolving repeated handling or layout variation. E both keeps the handoffs and replaces per-brief approval with automation and sampling. The trial and staffing are case facts; the course supports consolidating before configuring the remaining reference/procedure.', [
  ['A','Removes the unnecessary drafting handoffs and preserves approval of each finished brief.','Needs C’s shared context and reusable procedure to address the remaining repeated setup and layout variation.'],
  ['B','Could make individual stages more consistent.','Preserves all three handoffs and packages stages before the tested consolidation removes their separate existence.'],
  ['C','After consolidation, stores common background and the remaining method in their appropriate reusable homes.','Works with A’s consolidation and retained final gate; it is not permission to remove approval.'],
  ['D','May reduce model response waiting time.','Leaves repeated pasting, transfers and inconsistent methods unchanged.'],
  ['E','Adds automated checking and a periodic layout review.','Keeps the handoffs and removes the required manager check before each brief is circulated.']
], ['B'], [['Handoff','A transfer of work or output between stages or people.'],['Consolidation','Combining stages that do not need separate decision points.'],['Reusable procedure','A saved method that can be applied consistently to later runs.']]),
g('Q11', [
  'Separate the required result from the coordinator’s suggested way of finding it.',
  'Check each proposal against both the practical room constraints and the limits on what the assistant may do.',
  'Trace a shortlisted room from its supporting information to the coordinator’s later decision, marking anything the available information cannot settle.'
], [
  'The shortlist must address capacity for twenty, accessibility, the chosen evening and a maximum $80 hire cost.',
  'The two favourite venues are suggestions, so they must not impose an unnecessary search boundary.',
  'AI can inspect public pages but cannot contact or reserve; unsupported terms or availability must remain visible.'
], 'B and E form the full keyed set. B defines the constrained shortlist while allowing suitable public sources beyond the two suggestions. E makes the reported terms traceable and preserves missing availability for the coordinator to confirm. Together they supply a useful outcome and a way to check its evidence without expanding action authority. A still confines the search to nonmandatory favourites. C allows reservations despite the explicit prohibition. D specifies page operations instead of defining the result and its support. The course supports defining outcomes and keeping claims within inspectable sources; room requirements, authority and the need for later confirmation are established by this case.', [
  ['A','Ranks rooms against the practical requirements.','Still excludes other public venues without a mandatory-source reason, retaining the arbitrary restriction.'],
  ['B','Defines the actual room requirements and lets the assistant select relevant public pages.','Needs E’s traceability and visible unknowns; a requested shortlist does not by itself verify every reported term.'],
  ['C','Seeks a ranked result and retains final coordinator review.','Tentative reservations are still bookings and exceed the assistant’s explicit authority.'],
  ['D','Makes a search procedure repeatable.','Fixes arbitrary page actions without supplying the required outcome/evidence improvements.'],
  ['E','Requires support for reported claims and flags information the pages do not establish for human follow-up.','Complements B’s outcome definition; a link alone does not establish a room meets all constraints.']
], ['A','C'], [['Outcome specification','A description of what must exist when the job is finished.'],['Constraint','A requirement or boundary a proposed result must satisfy.'],['Traceability','The ability to connect a reported claim to its supporting evidence.']]),
g('Q13', [
  'Start with the resources the task must change and the conditions under which it will run.',
  'Compare where each proposal executes and processes the data with the shop’s explicit custody requirement.',
  'Trace access to both resources for each surface, including any copying, manual work or migration the proposal introduces.'
], [
  'Both the approved job folder and installed spreadsheet exist only on the local computer.',
  'Job data and execution must remain there; staff can supervise with the computer on.',
  'An approved agent already reaches both resources; the task is surface selection, not storage or toolchain redesign.'
], 'C is keyed because the approved local desktop agent can perform the requested changes where both resources reside, within the stated access limits and supervision. A uploads data and moves execution outside the required computer. B can provide advice but leaves the requested renaming and spreadsheet operations to staff. D introduces a repository and coding workflow that the task does not need. The course supports routing by resources, execution dependencies and custody; the agent’s approval and local execution are stipulated here. The label desktop alone is not proof that any real product processes data locally.', [
  ['A','Gives an agent copies of both resources and a way to return output.','Uploading and cloud execution violate the case’s local custody and execution constraint.'],
  ['B','Can offer instructions without needing direct local access.','Does not execute the requested task; staff must manually perform every change.'],
  ['C','Uses the approved surface with access to both local resources and supervision on the required computer.','No failure under the case assumptions; this does not certify that every desktop-branded agent has local processing.'],
  ['D','Could support scripted changes and software tests.','Adds a repository/toolchain migration to a task whose system of work is local files and an installed application.']
], ['B','D'], [['Execution surface','The environment in which an agent actually performs its work.'],['Data custody','Where data may be held and processed under the task’s rules.'],['Local dependency','A resource or capability that requires access to a particular computer.']]),
g('Q14', [
  'Consider what the analysis needs to retain and what could still identify a respondent.',
  'Evaluate combinations of the remaining fields, including what somebody could link from outside the survey.',
  'For each preparation, ask how it would demonstrate the required anonymity while preserving enough information for the stated analysis.'
], [
  'Exact shifts, sites and rare titles can be linked to public schedules despite removal of direct identifiers.',
  'The analysis needs broad travel patterns, not individual identities.',
  'The external route requires the resulting data to meet the company’s anonymity standard before upload.'
], 'A is correct: broaden the role, site and time information as far as the pattern analysis permits, then assess the actual result against the company’s standard. It does not declare that grouping automatically makes data anonymous. B changes labels while leaving the linkable combinations intact. C and D each remove one clue and assume the remaining combination is safe without assessment. The case supplies the external-route gate and public linkage; the course supports checking residual identification risk while preserving task utility. This guide specifies no universal anonymity threshold and does not authorize a real upload.', [
  ['A','Reduces unnecessary identifying detail while preserving broad patterns and requires assessment of the result.','No failure under the case; upload still depends on the assessment finding that the standard is met.'],
  ['B','Removes a direct lookup key and retains detailed analytical data.','Random labels do not stop identification through the retained shifts, sites and rare roles.'],
  ['C','Reduces time precision.','Site and rare-role combinations may remain identifying; removing one field is not evidence of compliance with the standard.'],
  ['D','Removes rare titles.','Exact shifts and sites can remain linkable through public schedules, even though neither field is a name.']
], ['C','D'], [['Indirect identifier','A detail that can identify someone when combined with other information.'],['Aggregation','Combining detailed observations into broader groups.'],['Anonymity assessment','Checking whether the resulting information satisfies the applicable standard for not identifying individuals.']]),
g('Q15', [
  'Classify what is being saved: an ongoing rule, reference information or a repeatable method.',
  'Identify who must receive the restriction automatically and which unrelated work must remain outside its scope.',
  'Imagine a covering writer beginning a fresh conversation: compare which proposed home would supply the rule at the intended scope.'
], [
  'British spelling and the price restriction are standing rules for this client only.',
  'All assigned and covering writers use the same client Project.',
  'The rules must be shared and automatic without altering the cross-client writing procedure.'
], 'D is the keyed answer: client Project instructions provide the shared, client-scoped home while references and the reusable cross-client method retain their existing roles. A applies the restrictions globally for each writer and therefore affects unrelated clients. B embeds client-specific restrictions in a method used across clients. C leaves them in one writer’s conversation rather than the shared automatic context. The course distinguishes Project context, global instructions and reusable Skills; applying that distinction here depends on the case’s explicit shared Project and client-only scope. Saving rules does not guarantee that future outputs need no checking.', [
  ['A','Makes instructions available automatically to an individual writer.','Applies beyond this client and requires per-writer configuration rather than the shared client home.'],
  ['B','Makes restrictions available when the reusable writing method runs.','Spreads this client’s rules into a method used for other clients, contrary to the required scope.'],
  ['C','Retains a written note in the original conversation.','Does not establish a shared automatic instruction for covering staff in new conversations.'],
  ['D','Places the client-only standing rules in the shared context already used by every assigned writer.','No failure under the case; configuration improves availability of the rules but does not eliminate output review.']
], ['B','C'], [['Standing rule','An instruction intended to apply across repeated work within its stated scope.'],['Scope','The people, tasks or workspace to which a rule applies.'],['Shared configuration','Readable saved settings available to the people who need the same behavior.']]),
];

// Short paraphrases only; all case facts/keys are separately attributed to the bank.
const passages = {
  '10. When it has outgrown prompt-and-iterate': [524,540,'Shared operational dependence calls for engineering expertise and support.', 'Original workflow section inspected after direct retrieval failed and sidebar navigation succeeded.'],
  '5.1 Product discernment: is the result good?': [511,526,'Validate output against requirements and sources, including omissions and supporting assumptions.','Original AI Fluency section inspected.'],
  '13. Models checking models': [832,860,'Cross-model review can expose problems; model agreement or grades do not establish factual truth.','Original prompting section inspected, including its limits on cross-model checking.'],
  '3.3 Trusted tool, untrusted content': [416,434,'Tool provenance and content trust are separate; content instructions require scrutiny before consequential action.','Original governance section inspected.'],
  '4.2 Disclosure: use rules first, judgment second': [498,509,'Check disclosure rules first; then consider recipient understanding while retaining authorship responsibility.','Original governance section inspected.'],
  '15. Find the friction before you optimize': [663,688,'Consolidate unnecessary stages before configuring the remaining repeated work.','Original workflow section and consolidation/promotion order inspected.'],
  '14. Rule, reference, or procedure': [632,662,'References and reusable procedures belong in different shared configuration homes.','Original workflow section inspected.'],
  '2. Give AI the Outcome, Not the Clicks': [280,300,'Define the desired outcome and genuine constraints instead of arbitrary search steps.','Original delegation section inspected.'],
  '5. Give AI the Source': [473,511,'Ground reported claims in inspectable source material and mark unsupported information.','Original delegation section inspected.'],
  '10. Web, desktop, or terminal: pick by what the work touches': [716,746,'Choose execution by resources, device dependency and processing custody, not interface labels alone.','Original routing table and bridge/custody qualification inspected.'],
  '2.3 Redaction is useful, but it is not magic': [307,313,'Residual combinations can identify people; preserve utility and assess anonymity under the organization’s standard.','Original governance section inspected.'],
  '4. Skills vs Connectors vs Projects vs Custom Instructions': [233,245,'Project context, global preferences and reusable procedures have distinct scopes.','Original feature comparison inspected.'],
};
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { validateQuestionBank } = await vite.ssrLoadModule('/src/domain/bankValidation.ts');
  const { questionFingerprint, guidanceDigest } = await vite.ssrLoadModule('/src/domain/guided/fingerprints.ts');
  const { guideEntrySchema, guidedItemSchema } = await vite.ssrLoadModule('/src/domain/guided/schema.ts');
  const validated = validateQuestionBank(JSON.parse(fs.readFileSync('public/easy-question-bank.json', 'utf8')));
  if (!validated.ok) throw new Error(validated.errors.join('; '));
  const bank = validated.bank, source = inventory.source;
  const refs = [], rows = [], drafts = [];
  for (const a of authored) {
    const q = bank.questions.find(q => q.id === a.questionId);
    const domain = bank.domains.find(d => d.id === q.primaryDomain);
    const q1 = await questionFingerprint(source, domain, q);
    if (!q1.ok) throw new Error(q1.code);
    const sourceChecks = q.sources.map((s, sourceIndex) => {
      const p = passages[s.sectionHeading];
      if (!p) throw new Error('Source missing: ' + s.sectionHeading);
      refs.push({ questionId: q.id, sourceIndex, ...s, checkedBy: 'Codex (AI author; not independent review)',
        checkedOn: '2026-10-18', status: 'ai-source-checked', originalPassageLines: [p[0],p[1]],
        claim: p[2], method: p[3], humanVerifiedBy: null, humanVerifiedAt: null });
      return { sourceIndex, claim: p[2], evidenceLocator: `AI original-course check, 2026-10-18; independent human verification pending. ${s.url} — ${s.sectionHeading}; rendered passage lines ${p[0]}–${p[1]}.` };
    });
    const draft = { questionId: q.id, sourceFingerprint: q1.value, hints: a.hints, decisiveCriteria: a.decisiveCriteria,
      reasoningMarkdown: a.reasoningMarkdown, optionComparisons: a.optionComparisons, closestDistractorIds: a.closestDistractorIds,
      vocabulary: a.vocabulary, sourceChecks, approval: { status: 'draft', reviewId: `gp7-intermediate-${q.id.toLowerCase()}-v1` } };
    const projection = guideEntrySchema.parse({ ...draft, approval: { ...draft.approval, status: 'approved' } });
    const g1 = await guidanceDigest(source, '1.1.0', projection);
    if (!g1.ok) throw new Error(g1.code);
    guidedItemSchema.parse({ question: q, domain, guide: projection, guideDigest: g1.value });
    drafts.push(draft);
    rows.push({ questionId: q.id, batch: 1, draftVersion: 1, authoredOn: '2026-10-18', author: 'Codex (AI)',
      reviewId: draft.approval.reviewId, guideVersion: '1.1.0', sourceFingerprint: q1.value,
      draftSha256: sha(JSON.stringify(draft)), prospectiveG1: g1.value, approvedG1: null,
      originalCorrectOptionIds: q.correctOptionIds, selectionCount: q.selectionCount,
      draftStatus: 'draft; AI source-checked; human review pending',
      sourceChecks: sourceChecks.length, claimProvenance: { scenarioFacts: 'Frozen bank stem; no new real-world evidence implied',
        answerAndOptionRequirements: 'Frozen bank correctOptionIds and optionExplanations',
        generalPrinciples: 'Original-course passages in SOURCE-VERIFICATION-LEDGER.md',
        authorInterpretation: 'Application of those principles to the case; independent human review pending' },
      independentHumanReview: null, independentSourceReview: null, semanticHintReview: null, finalOwnerApproval: null,
      aiHintReview: 'Reviewed each hint and the cumulative sequence; no answer letters, copied winner, final numerical answer or complete set found. Human semantic review required.',
      aiOptionReview: 'All original options evaluated in order; correct-option limitations do not negate the key; complete set explained where applicable.' });
  }
  if (drafts.length !== 10 || drafts.map(d => d.questionId).join() !== inventory.records.slice(0,10).map(d => d.questionId).join()) throw new Error('Wrong batch');
  fs.mkdirSync(folder, { recursive: true });
  const batch = { authoringFormatVersion: 1, batch: 1, source, plannedGuideVersion: '1.1.0', contentStatus: 'draft', questions: drafts };
  fs.writeFileSync(folder + 'batch-1.md', '# Intermediate expansion — Batch 1 of 5\n\nAI-authored on 2026-10-18. Exactly ten new draft records; no human review or owner approval is claimed. Use [questions-only.md](questions-only.md) before viewing this answer-bearing feedback. Version/review identities and gates: [Phase 7 content ledger](../../PHASE-7-CONTENT-LEDGER.md). Same Phase 2 fenced-JSON authoring format; never a runtime release.\n\n```json\n' + JSON.stringify(batch,null,2) + '\n```\n');
  fs.writeFileSync(folder + 'questions-only.md', '# Intermediate expansion — Batch 1 solve-first copy\n\nExact validated source text/options/sources, with no answer key or feedback. Record your choices and reasoning before opening batch-1.md or the answer-bearing ledgers.\n\n' + drafts.map(d => {
    const q = bank.questions.find(q => q.id === d.questionId);
    return `## ${q.id}\n\n` + q.stemMarkdown + '\n\n' + q.options.map(o => `**${o.id}**\n\n${o.textMarkdown}\n`).join('\n') +
      '\nSources:\n\n' + q.sources.map(s => `- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('');
  }).join('\n'));
  fs.writeFileSync(folder + 'SOURCE-VERIFICATION-LEDGER.md', '# Phase 7 Batch 1 — original-course verification\n\n2026-10-18 (Asia/Karachi). **14/14 reference occurrences checked by the AI author, across 12 distinct passages on seven original course pages.** Human source reviews remain 0/10. This is original-passage inspection, not independent human sign-off. The bank’s original titles/headings/URLs/indices are retained exactly. Scenario facts and keyed answers are supplied by the frozen bank; the short claims below concern general teaching principles. Per-item interpretation is identified separately in the content ledger.\n\nWorkflow retrieval history: exact-URL open initially returned tool Internal Error (no page/status evidence). Following the Workflow Design & Diagnosis link from the original AI Fluency sidebar then retrieved the same canonical URL. Sections 10, 14 and 15 were inspected directly. The failed attempt remains a failed retrieval, not a 404 or proof of an unavailable site. All other six original pages opened directly. Rendered line locators identify this inspection and may drift as the site changes; exact headings and URLs are also retained. No raw source bulk copy is republished.\n\nThe prompting passage’s caveat that agreement does not establish factual truth was inspected, rather than inferring that model review supplies missing case facts. For Q7, checking exclusions follows the case’s completeness assertion, not a claim that the course contains these maintenance-ticket numbers. For Q13, the local-execution approval is a scenario assumption, not a current product certification. Q8 and Q14 describe the fictional case’s stated rule/standard; no legal or universal anonymity determination is introduced.\n\n```json\n' + JSON.stringify({authoringFormatVersion:1,checkedAt:'2026-10-18',checkedBy:'Codex (AI author)',humanSourceReview:'pending',references:refs},null,2) + '\n```\n');
  const records = inventory.records.map(r => rows.find(d => d.questionId === r.questionId) ?? {
    questionId:r.questionId,batch:r.plannedBatch,draftStatus:'not-authored',sourceFingerprint:r.sourceFingerprint,
    draftSha256:null,prospectiveG1:null,approvedG1:null,independentHumanReview:null,finalOwnerApproval:null });
  fs.writeFileSync(root + 'PHASE-7-CONTENT-LEDGER.md', '# Phase 7 — Intermediate content and batch ledger\n\n2026-10-18 (Asia/Karachi). **10 new drafts; 0/10 independent human reviews; 0/10 owner approvals; no approved new digests.** Batches 2–5 are not authored. The original ten accepted pilot records and all their approval history remain unchanged in the [pilot matrix](content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md); their waiver is not extended here. This ledger covers all fifty remaining IDs, with exact new draft identities where authored. The linked pilot matrix supplies the other ten rows of eventual 60-item coverage without inventing reviews or copying approvals.\n\n' + fs.readFileSync(evidence+'batch-distribution.md','utf8') + '\n\nDependencies and approval gates are recorded per batch in [batches.json](../../test-results/guided-practice/phase-7-batch-1/batches.json); per-question artifact and source availability in the [inventory](PHASE-7-QUESTION-INVENTORY.md). Drafts are [Batch 1](content/intermediate-expansion/batch-1.md), with [solve-first copy](content/intermediate-expansion/questions-only.md) and [source evidence](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md).\n\nDraft version 1 / planned guideVersion 1.1.0. `draftSha256` hashes UTF-8 `JSON.stringify(draft)` in stored order. `prospectiveG1` is calculated by the unchanged g1 function on an in-memory projection changing only status to approved; it is not an approved digest. Changing wording, provenance, review ID, version or source requires recalculation and renewed review. All `approvedG1` fields remain null.\n\nEach new item requires a human independent of the AI author to record solve-first choices/reasoning, inspect the original passages, review hints individually and cumulatively, evaluate every option and the complete set, check terminology/arithmetic, and sign the exact draft SHA/q1/g1. The owner separately signs the exact content. Reviewer assignment/capacity and Batch 1 acceptance/continuation require owner decisions. No waiver or signatures are inferred from this authorization.\n\n```json\n' + JSON.stringify({authoringFormatVersion:1,date:'2026-10-18',source,plannedGuideVersion:'1.1.0',pilotApprovalReference:'content/intermediate-pilot/FINAL-APPROVAL-MATRIX.md',newIndependentReviewWaiver:false,records},null,2) + '\n```\n');
  fs.writeFileSync(evidence + 'draft-identities.json',JSON.stringify(rows,null,2)+'\n');
  console.log(JSON.stringify({drafts:drafts.length,references:refs.length,distinctPassages:new Set(refs.map(r=>r.url+'|'+r.sectionHeading)).size,pages:new Set(refs.map(r=>r.url)).size,ids:drafts.map(d=>d.questionId)}));
} finally { await vite.close(); }
