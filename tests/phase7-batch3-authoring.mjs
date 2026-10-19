// Unpublished, item-specific Phase 7 Batch 3 authoring and identity evidence.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const dir='docs/guided-practice/',folder=dir+'content/intermediate-expansion/',out='test-results/guided-practice/phase-7-batch-3/';
const sha=x=>createHash('sha256').update(x).digest('hex');
const block=p=>JSON.parse([...fs.readFileSync(p,'utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)][0][1]);
const ids=['Q29','Q30','Q31','Q32','Q34','Q35','Q36','Q37','Q38','Q39'];
const g=(questionId,hints,decisiveCriteria,reasoningMarkdown,options,closestDistractorIds,terms)=>({questionId,hints,decisiveCriteria,reasoningMarkdown,
  optionComparisons:options.map(([optionId,satisfiesMarkdown,failsOrLimitsMarkdown])=>({optionId,satisfiesMarkdown,failsOrLimitsMarkdown})),closestDistractorIds,
  vocabulary:terms.map(([term,definition])=>({term,definition}))});
const authored=[
g('Q29',[
  'Locate the remaining evidence gap after the brief, current inputs and fresh conversations have already been checked.',
  'Distinguish an explanation of a numerical result from evidence that the specified calculation actually occurred.',
  'Use the independently checked subset to plan a discriminating test, then consider what still needs checking before trusting the rest.'
],[
  'The inclusion, units and blank rules are complete; fresh chats still disagree with an independent calculation.',
  'No execution evidence is present even though code execution is available.',
  'A calculation test must use known rows first and then inspect the full result and method.'
],'C is the keyed next test. Running the specified calculation and comparing its five-row result with the analyst’s independently known result directly tests the missing execution feature. The full output and calculation method still require review: executed code can apply the wrong inclusion or blank rule. A adds explanatory fluency without proving computation. B changes reasoning capacity but still compares written averages, which is less direct than the available calculation test. D repeats checks already performed and treats agreement as correctness. The course supports diagnostic sequencing and known-answer checks; this case supplies the completed prior checks, current file and known subset. No actual delivery average can be calculated from the information given.',[
  ['A','Could expose assumptions in a written explanation.','More detail or confidence does not establish that the calculation ran or that its result is correct.'],
  ['B','Tests whether additional reasoning capability changes the result.','Leaves actual execution untested and compares written answers rather than using the available known-answer computation test.'],
  ['C','Runs the calculation, checks it against independently known rows and retains full-result and method verification.','No failure under the case; a subset pass alone is not proof that all rows and rules were processed correctly.'],
  ['D','Restates explicit data-handling rules and provides another response to compare.','Fresh context and complete rules were already checked; a majority can reproduce the same numerical error.']
],['B'],[['Known-answer test','A comparison between a computed result and a result independently established for the same input.'],['Execution evidence','An observable record that the requested operation actually ran.'],['Method verification','Checking that the calculation implements the intended rules, not merely that it finishes.']]),
g('Q30',[
  'Separate a measure of individual replies from a measure of whether the service achieves its purpose.',
  'Read each table row with its measure label, then distinguish the manual checks already performed from the reported customer experience.',
  'List plausible reasons a customer might still be stuck, and identify the observation that would distinguish those explanations.'
],[
  'The audit reports 98% correct answers checked and 24% of customers resolving their problem; these are distinct measures.',
  'Manuals support the instructions, while many unresolved customers report repeated accurate steps without help when a step fails.',
  'Evaluation must investigate behavior across interactions and subsequent user actions without assigning one cause to every unresolved case.'
],'A targets the unanswered service-performance question. The Measure/Result table reports 98% for checked answer correctness and 24% for customer problem resolution. Accuracy is already supported by manual checks, but does not establish that the interaction helps a customer recover when a step fails. Inspecting unresolved conversation sequences and later actions can test the reported repetition/adaptation problem. B only extends the existing individual-answer accuracy audit. C falsely equates every unresolved outcome with a factual error, though the causes may differ. D proposes a rewrite and reviewer ratings without investigating the actual service behavior. The table supplies no shared denominators or case linkage from which to compute the overlap of accurate answers and unresolved customers. It supports investigation, not a claim that every unresolved case has the same cause.',[
  ['A','Examines unresolved interactions, adaptation after failed steps and what customers do next under the service’s resolution goal.','No failure under the case; findings must distinguish causes instead of assuming all unresolved customers had identical experiences.'],
  ['B','Could provide more evidence about the accuracy of individual responses.','Does not investigate the remaining interaction/outcome problem after those instructions have been checked against manuals.'],
  ['C','Recognizes that accuracy and resolution differ in the audit.','Misclassifies unresolved cases as factual mistakes without evidence and changes references already supporting the instructions.'],
  ['D','May improve readability and uses external review of proposed wording.','Ratings of replacements do not establish why the actual unattended interactions fail to help users.']
],['D','B'],[['Performance discernment','Evaluating whether independent AI behavior serves the people interacting with it.'],['Resolution measure','Evidence about whether a user’s problem was actually resolved.'],['Causal attribution','Assigning a result to a cause; this requires evidence beyond observing two different measures.']]),
g('Q31',[
  'Treat the decision as separate qualification checks for distinct tasks rather than a single overall ranking.',
  'Keep each table value attached to its task column and compare it with the rule for performance before repair.',
  'Build a qualification grid before considering assignments, leaving untested combinations marked separately.'
],[
  'Each task requires at least nine passes before repairs, using equal-cost trials with the same inputs and briefs.',
  'Separate assignments are allowed; performance in a neighboring task does not qualify a task-specific result.',
  'A combined-model workflow has no tested result, and future outputs still need staff checking.'
],'The complete keyed set is B and D. In the Configuration/Summaries passing/Extractions passing table, R records 9 of 10 summaries and 7 of 10 extractions; T records 8 of 10 summaries and 10 of 10 extractions. Comparing each cell with the nine-pass requirement gives R summaries 9 ≥ 9 and T extractions 10 ≥ 9; R extractions 7 < 9 and T summaries 8 < 9 do not qualify. B assigns the qualifying summary configuration and D the qualifying extraction configuration, jointly covering both tasks. A and C transfer success across columns instead of using same-task evidence; later repairs cannot satisfy a before-repair threshold. E invents qualifying performance for an untested combined workflow. Equal costs remove cost as a differentiator, and staff checks remain required after this initial assignment; the trial does not guarantee future results.',[
  ['A','Retains checking of extraction results and recognizes R’s summary performance.','R has only seven extraction passes, so confidence from summaries does not meet the extraction threshold.'],
  ['B','Assigns R to summaries on its nine passing summaries and keeps subsequent checks.','Needs D’s qualifying extraction assignment to cover both tasks; one passing task does not qualify the other.'],
  ['C','Recognizes T’s perfect extraction trial and proposes later feedback on summaries.','T has eight passing summaries, below the required threshold before repairs; extraction success and future repair do not change that observation.'],
  ['D','Assigns T to extraction on its ten passing extraction results and uses same-task evidence.','Complements B for summaries; this trial still provides only an initial basis, not an assurance about all future outputs.'],
  ['E','Proposes comparison between configurations as a possible workflow.','That joint workflow has no measured trial score, and agreement cannot manufacture the required pass count.']
],['C','E'],[['Task-specific evaluation','Judging performance using evidence from the particular job to be assigned.'],['Qualification threshold','A minimum observed result required before an option is eligible.'],['Jagged capability','Uneven AI performance across tasks, even when the tasks appear related.']]),
g('Q32',[
  'Define what must be established before a notice becomes a customer commitment.',
  'Compare the checks already performed with the facts and authority that the company’s policy makes relevant.',
  'Follow a notice through each proposed review, noting what evidence would authorize its release at that point.'
],[
  'Sending a notice commits the company to a date and charge; the account manager holds approval authority.',
  'Spelling and layout are checked, but dates and charges still need verification against approved work orders.',
  'The available responsible manager must verify and approve each notice before sending, not a later sample.'
],'C combines the required role, evidence and timing. The account manager checks each appointment date and quoted charge against the approved work order and approves the notice before transmission. The managed route is already approved; that does not supply the missing commitment gate. A adds useful clerk fact-checking but substitutes later manager sampling for the required approval of each commitment. B uses the right person before sending but reviews wording rather than the decisive facts. D uses the right role and facts after the commitment has already been made. The course supports a specified gate; the company policy, manager availability and particular commitment facts come from the scenario.',[
  ['A','Adds source-based date/charge checking by the clerk.','The account manager approves only a later sample, rather than each customer commitment before release.'],
  ['B','Places the responsible manager before the sending step.','A wording review and layout check do not verify dates and charges against the approved records.'],
  ['C','Uses the available authorized manager, checks the commitment facts against approved work orders and requires approval before each send.','No failure under the case; the existing clerical check remains useful supporting work.'],
  ['D','Compares notices with work orders through the responsible manager.','The review happens after sending, when the customer commitment already exists.']
],['B','A'],[['Approval gate','A defined check and decision that must precede the controlled action.'],['Commitment fact','A detail, such as a date or charge, on which an external promise depends.'],['Accountable role','The role that holds responsibility for approving the particular action.']]),
g('Q34',[
  'Identify the work product being accepted and where a change could occur between preparation and delivery.',
  'Separate checks of the preview, claims about the saved file and observations of the file itself.',
  'Choose a material term and follow it through the representations to the client-facing artifact and its supporting proposal.'
],[
  'The decision concerns the exported supplier comparison, not the preview that was previously checked.',
  'Past exports changed wrapping and shortened notes; the export has not been inspected.',
  'Acceptance must examine the actual file’s table and cancellation notes and trace consequential terms to the proposals.'
],'D checks the artifact the client would receive and the support for its material terms before a sending decision. The verified preview is useful prior evidence but cannot establish that export preserved table readability, references and cancellation notes. A rechecks the preview rather than that transformation. B asks the assistant for another assertion about contents. C establishes access to the file but relies on the preview for content despite known export risks. The course supplies a claim-focused trace/challenge/decision method and human review of final client deliverables; applying it to export differences follows the case’s explicit history. No actual export defect is presumed before inspection.',[
  ['A','Reconfirms terms against the original proposals in the preview.','Leaves the actual exported representation and possible loss of notes or readability unchecked.'],
  ['B','Compares a reported contents list with the requested structure.','The tool’s self-report does not demonstrate what the saved table and notes actually contain.'],
  ['C','Opens the artifact and tests download/access.','Access alone does not verify the consequential table/notes survived export intact.'],
  ['D','Inspects the actual exported table and cancellation notes and traces the terms to the proposals before sending.','No failure under the scenario; the inspection may accept the file or identify a correction rather than assume export must have failed.']
],['C'],[['Deliverable acceptance','A decision that the actual work product meets its intended use and evidence requirements.'],['Representation change','A transformation, such as export, that may alter how information is retained or displayed.'],['Material term','A condition important enough that its alteration could affect the recipient’s decision.']]),
g('Q35',[
  'Distinguish failure to start the saved method from failure while carrying it out.',
  'Compare the intended request boundary with the current eligibility text, including requests that should remain outside it.',
  'Simulate monthly, annual and short-message requests against that text; identify the mismatch that a targeted change and retest would need to address.'
],[
  'The installed procedure passes direct invocation; the observed failure is that an annual request does not load it.',
  'The current description explicitly excludes annual reports, contrary to the intended monthly-and-annual board-paper scope.',
  'Correct the relevance boundary while retaining the short-status exclusion and testing intended included/excluded requests.'
],'B targets the installed Skill’s description, which states when its already-working method is selected. It adds annual board-paper coverage and likely request wording while keeping quick status messages outside the boundary. A changes unloaded procedure content without correcting the explicit exclusion. C removes every exclusion and admits work that should remain out of scope. D duplicates a working method in a separate copy instead of fixing the installed Skill’s requested activation boundary. The teaching point is whether a change controls selection or execution; a feature label alone does not diagnose the problem. Retesting must check both intended inclusions and the retained exclusion.',[
  ['A','Could improve an example used once the procedure is running.','Annual requests are still excluded by the description, so this does not address the observed failure to load.'],
  ['B','Changes the installed relevance boundary to include monthly and annual board papers, preserves the status-message exclusion and retests.','No failure under the case; the revised wording must be checked using ordinary intended and excluded requests.'],
  ['C','Makes annual requests more likely to trigger the method.','Also admits short status messages and unrelated reporting, violating the required exclusion.'],
  ['D','Could provide a separate annual procedure with the same layout.','Leaves the installed boundary wrong and creates another copy of a method that already works.']
],['D','A'],[['Activation boundary','The range of requests for which a saved method should be selected.'],['Negative trigger','A stated condition that excludes a request from activating a capability.'],['Regression check','A check that an intended change preserves behavior that should still work or remain excluded.']]),
g('Q36',[
  'Separate the mechanics of reading a quantity from the business meaning of counting a record.',
  'Look for input cases whose contribution to a total is not determined by the current brief.',
  'Write down how competing interpretations would change the totals, and identify which interpretation the brief actually authorizes.'
],[
  'The input includes unit-bearing quantities, repeated rows and blank quantities; the required output is totals plus exceptions.',
  'Repeated rows may be duplicate records or separate checkouts, and blanks have no agreed meaning.',
  'Input formats and coordinator-approved counting/blank rules must be established in the brief before computation.'
],'C prepares a calculation whose business meaning can be checked. Inspect the actual formats, then settle how repeated entries and blanks affect counts with the coordinator and record those rules before running. A chooses implementation details while leaving substantive defaults to the assistant. B can produce matching totals from scripts sharing the same unstated wrong rule. D lists uncertain rows but still lets cleanup decide their effect on totals. The guide does not decide whether repeats are duplicates, whether blanks mean zero, or how many checkouts occurred: those answers are absent. The course supports complete outcome/rule/edge-case briefs; any example rule in that course is not automatically this workshop’s rule.',[
  ['A','Specifies technical parsing and conversion choices.','A language or function cannot establish what repeated rows and blank quantities mean for this organization.'],
  ['B','Adds comparison between independently generated implementations.','Agreement can reflect the same missing-rule assumption, leaving the intended total undefined.'],
  ['C','Inspects the input and records coordinator-approved rules for ambiguity before calculation.','No failure under the case; implementation and computed results still need validation after the rules are settled.'],
  ['D','Makes repeated and blank rows visible as exceptions.','Visibility does not authorize the cleanup defaults that still determine the totals.']
],['D','B'],[['Business rule','A locally agreed meaning or constraint that determines how records should be treated.'],['Edge case','An input condition that needs explicit handling beyond the ordinary case.'],['Parsing','Interpreting a stored value’s format, distinct from deciding its business meaning.']]),
g('Q37',[
  'Use the timing of the drift and the checks already performed to choose where to investigate first.',
  'Distinguish a source being published elsewhere from the version actually supplied to this workflow.',
  'Trace a retired product in a failed brief back through the loaded references and instructions, then plan how to test any evidence-based correction.'
],[
  'The brief worked before a catalogue migration, but fresh chats now include retired products while preserving layout.',
  'The current-range requirement is explicit and the model is unchanged; Project source documents do not refresh automatically.',
  'Inspect actual loaded catalogue/instruction versions, repair confirmed stale configuration and rerun an exposing case.'
],'D investigates the leading stale-configuration hypothesis. A published replacement catalogue does not establish that the Project loads it; comparing loaded reference/instruction versions with the replacement can reveal the mismatch. Update what is confirmed stale, then rerun a case that included retired products to test the correction. A strengthens a rule already present without inspecting the input. B cannot replace company-specific authoritative configuration with broader model knowledge. C repeats a fresh-context approach that already fails and does not identify the loaded version. Timing guides investigation rather than proving that a particular file or instruction is stale in advance.',[
  ['A','Reinforces the current-range requirement and preserves the existing workflow.','Leaves the suspected stale references or instructions unexamined even though the rule is already explicit.'],
  ['B','Tests another model’s capability.','Greater capability does not establish which company catalogue is authoritative or repair outdated supplied context.'],
  ['C','Reduces conversation length and asks for a shorter output.','Fresh chats already fail, and neither action checks which catalogue or instruction version the Project loads.'],
  ['D','Checks the actual supplied versions, repairs confirmed staleness and tests the correction against the observed failure.','No failure under the case; the version audit must establish the mismatch rather than treating timing alone as proof.']
],['A','C'],[['Stale configuration','Saved instructions or reference material that no longer match the intended current workflow.'],['Loaded source','The actual reference supplied to a run, which may differ from a document published elsewhere.'],['Failure-case replay','Repeating an input that exposed a problem to check whether an evidence-based correction addresses it.']]),
g('Q38',[
  'Separate the analysis supported by the attachments from the decision that depends on an unavailable measurement.',
  'Distinguish an observation from an assumption, and consider what extra reasoning or reading capacity actually adds to the available evidence.',
  'For a trial recommendation, label each premise as observed, assumed or unavailable, then identify which premises would need a new source.'
],[
  'Plans and costs are supplied, but current daily order volume is necessary for the actual layout choice and unavailable to the tools.',
  'The manager can supply a checked operations figure; more reasoning or context capacity cannot recover a fact never provided.',
  'Useful conditional analysis now must keep assumptions visible and be updated with the checked measurement before an actual-demand recommendation.'
],'A and C are the complete keyed set. A uses the available plans/costs to analyze conditional trade-offs, keeping assumed demand separate from observed volume. C obtains the manager’s checked operations figure and updates the comparison before recommending on actual demand. A alone leaves the decisive measurement unresolved; C supplies that fact but does not replace the useful conditional work requested meanwhile. B presents an inference from plan size as a measured current figure. D uses agreement between guesses as confirmation. E increases room for the same attachments, not access to absent information. The course supports the limits of reasoning and context; the measurement’s necessity, tool unavailability and manager access are case facts. No demand figure or winning layout is invented.',[
  ['A','Allows useful analysis of supplied evidence and explicitly labelled assumptions without claiming those assumptions are measurements.','Needs C’s checked input before making the actual-volume decision; a conditional preference is not the final grounded recommendation.'],
  ['B','Attempts to use available plans and stronger reasoning to estimate demand.','Mislabelling an inferred quantity as the current operations measurement does not supply the required fact.'],
  ['C','Obtains the checkable private measurement and incorporates it before a recommendation based on actual demand.','Complements A’s interim analysis; obtaining the fact is not itself the requested comparison of visible trade-offs.'],
  ['D','Compares another model’s inference from the same available evidence.','Agreement cannot establish the unavailable private measurement and may repeat the same unsupported assumption.'],
  ['E','Provides more capacity for reading the supplied attachments.','Extra capacity cannot reveal a measurement that is absent from those attachments and inaccessible to the tools.']
],['D','B'],[['Conditional analysis','An analysis that states how conclusions depend on explicitly identified assumptions.'],['Observed measurement','A value established from the relevant record or observation rather than inferred as if it were known.'],['Information boundary','The limit of the facts supplied or retrievable for the task.']]),
g('Q39',[
  'Separate evidence that a mechanism ran from evidence that its intended outcome exists.',
  'Compare today’s observations with the agreed result, paying attention to which observations concern another day or merely an execution status.',
  'List what each current observation proves and what remains unknown, then choose a check that could resolve those unknowns without guessing a cause.'
],[
  'Success requires today’s dated product comparison in the team folder, or an explicit statement that no prices could be checked.',
  'Run completed is execution evidence; today’s output, coverage and delivery have not been verified, and yesterday’s file is insufficient.',
  'Locate and inspect actual outcome evidence before assuming no changes, no data or an inadequate prompt; staff review still precedes pricing use.'
],'B treats the dashboard message within its evidential limits and checks the actual result at the agreed destination. Today’s dated file must cover the listed products or explicitly state that no prices could be checked; a completed run alone establishes none of those conditions. A substitutes yesterday’s file without verifying today’s obligation. C interprets missing output as no price change and manufactures a record from that assumption; no-change and unable-to-check are also different outcomes. D diagnoses a prompt failure before examining the run or its delivery. The course supports observable success signals and investigation before redesign. Even a successfully located report still requires the stipulated staff review before pricing decisions.',[
  ['A','Offers continuity using an available earlier report.','Does not establish today’s date, required coverage or delivery and treats execution status as outcome success.'],
  ['B','Checks today’s actual dated, covered or explicitly no-data output at the destination before accepting success.','No failure under the case; staff must still review the report before using it for pricing.'],
  ['C','Attempts to keep a continuous record of reporting results.','A file not yet located proves neither no price change nor no available data; the proposed record would be unsupported.'],
  ['D','Proposes a correction if instructions are the problem.','Assumes that cause without first determining what the current run produced or where it delivered it.']
],['A','D'],[['Execution status','A report about whether a process started, ran or finished.'],['Outcome evidence','Observations establishing that the required result was produced and delivered.'],['Explicit no-data result','A reported inability to check the required data, which differs from finding no change.']]),
];
// All twelve exact passages below were inspected for this batch, including shared pages.
const checks={
  Q29:[[572,586,'After prompt and context checks, test the feature appropriate to the remaining error.','Diagnostic sequence and calculation-feature check.','Check the feature and the model.'],[434,450,'Test computed work against independently known input/output and inspect the method as well as results.','Known-answer test, reality questions and plain-English method replay.','known-answer test']],
  Q30:[[551,558,'Evaluate independent AI behavior through user outcomes across interactions, not individual response accuracy alone.','Performance discernment and what users do next.','what users do next']],
  Q31:[[387,392,'Capability can differ sharply between neighboring tasks; evaluate the task being assigned.','Jagged-capability explanation rather than a cross-task guarantee.','AI ability is not smooth.']],
  Q32:[[228,245,'A useful review gate specifies responsible role, risk-relevant checks and timing before consequential release.','Defined gate: who, what and when.','who reviews']],
  Q34:[[735,755,'Verify material claims against sources and have a person review final client work before acceptance.','Identify, trace, challenge and decide; final client deliverables.','follow each one to its source']],
  Q35:[[404,414,'Relevance descriptions and negative triggers control the intended activation boundary.','Description-driven relevance and retained exclusions.','The description decides']],
  Q36:[[360,383,'A computation brief needs input, outcome, local rules and advance handling of imperfect data.','Rules and edge cases distinguish business meaning from implementation.','Rules and Edge cases']],
  Q37:[[542,571,'Use timing as a diagnostic hypothesis and inspect actual configuration dates/versions when behavior drifts.','Stale-configuration hypothesis and source inspection.','Stale configuration means']],
  Q38:[[420,426,'Extra reasoning can help analyze supplied premises but does not create an independent truth guarantee.','Reasoning remains fallible and requires factual checking.','More thinking narrows the gap.'],[352,358,'A larger context capacity does not supply task facts absent from the available context.','Available context versus room to hold more material.','Anything outside it']],
  Q39:[[686,691,'Completed execution does not establish a correct, complete and delivered result; inspect observable outcome evidence.','Success signals, delivery destination and unclear missing output.','correct, complete, or delivered']],
};
const vite=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
try{
  const {validateQuestionBank}=await vite.ssrLoadModule('/src/domain/bankValidation.ts');
  const {questionFingerprint,guidanceDigest}=await vite.ssrLoadModule('/src/domain/guided/fingerprints.ts');
  const {guideEntrySchema,guidedItemSchema}=await vite.ssrLoadModule('/src/domain/guided/schema.ts');
  const raw=fs.readFileSync('public/easy-question-bank.json');
  if(sha(raw)!=='f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4')throw new Error('Bank drift');
  const parsed=validateQuestionBank(JSON.parse(raw));if(!parsed.ok)throw new Error(parsed.errors.join('; '));
  const bank=parsed.bank,inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md'),source=inventory.source;
  const qs=bank.questions.filter(q=>ids.includes(q.id)),planned=inventory.records.filter(q=>q.plannedBatch===3);
  if(JSON.stringify(qs.map(q=>q.id))!==JSON.stringify(ids)||JSON.stringify(planned.map(q=>q.questionId))!==JSON.stringify(ids))throw new Error('IDs/order mismatch');
  if(JSON.stringify(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length))!=='[1,3,2,0,1,1,2]'||qs.filter(q=>q.selectionCount===1).length!==8||qs.filter(q=>q.selectionCount===2).length!==2)throw new Error('Coverage mismatch');
  const drafts=[],refs=[],records=[];
  for(const a of authored){
    const q=qs.find(q=>q.id===a.questionId),domain=bank.domains.find(d=>d.id===q.primaryDomain);
    const fp=await questionFingerprint(source,domain,q);if(!fp.ok)throw new Error(fp.code);
    if(fp.value!==planned.find(r=>r.questionId===q.id).sourceFingerprint)throw new Error('Fingerprint drift');
    const sourceChecks=q.sources.map((s,sourceIndex)=>{
      const p=checks[q.id][sourceIndex];if(!p)throw new Error('Missing inspected passage');
      refs.push({questionId:q.id,sourceIndex,...s,batch:3,checkedBy:'Codex (AI author; not independent review)',checkedOn:'2026-10-18',status:'ai-source-checked',originalPassageLines:[p[0],p[1]],claim:p[2],supportingPassageSummary:p[3],supportingExcerpt:p[4],
        retrieval:'Original canonical course and exact passage inspected anew for Batch 3. Workflow page reached through original AI Fluency sidebar; other seven pages opened directly.',
        scopeLimit:'Course supplies the general principle; scenario constraints/table values and keyed answers come from the frozen bank. Guide application is AI interpretation, awaiting independent human review.',humanVerifiedBy:null,humanVerifiedAt:null});
      return{sourceIndex,claim:p[2],evidenceLocator:`AI original-course check for Batch 3, 2026-10-18; independent human verification pending. ${s.url} — ${s.sectionHeading}; rendered passage lines ${p[0]}–${p[1]}.`};
    });
    const draft={questionId:q.id,sourceFingerprint:fp.value,hints:a.hints,decisiveCriteria:a.decisiveCriteria,reasoningMarkdown:a.reasoningMarkdown,optionComparisons:a.optionComparisons,closestDistractorIds:a.closestDistractorIds,vocabulary:a.vocabulary,sourceChecks,approval:{status:'draft',reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`}};
    const projection=guideEntrySchema.parse({...draft,approval:{...draft.approval,status:'approved'}});
    const digest=await guidanceDigest(source,'1.1.0',projection);if(!digest.ok)throw new Error(digest.code);
    guidedItemSchema.parse({question:q,domain,guide:projection,guideDigest:digest.value});drafts.push(draft);
    records.push({questionId:q.id,batch:3,draftVersion:1,authoredOn:'2026-10-18',author:'Codex (AI)',reviewId:draft.approval.reviewId,guideVersion:'1.1.0',sourceFingerprint:fp.value,draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest.value,approvedG1:null,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,draftStatus:'draft; AI source-checked; human review pending',sourceChecks:sourceChecks.length,
      claimProvenance:{scenarioFacts:'Frozen bank stem, quoted artifacts and exact tables; no new observations inferred',answerAndOptionRequirements:'Unchanged bank correctOptionIds and optionExplanations',generalPrinciples:'Batch 3 newly inspected original passages in SOURCE-VERIFICATION-LEDGER.md',authorInterpretation:'Case-specific application; independent review pending'},independentHumanReview:null,independentSourceReview:null,semanticHintReview:null,finalOwnerApproval:null});
  }
  if(drafts.length!==10)throw new Error('Wrong draft count');
  fs.writeFileSync(folder+'batch-3.md','# Intermediate expansion — Batch 3 of 5\n\nAI-authored 2026-10-18. Exactly ten unpublished drafts; no human review, educational approval or waiver extension is claimed. Use [the solve-first copy](batch-3-questions-only.md) before this answer-bearing feedback. [Review and identities](../../PHASE-7-BATCH-3-REVIEW.md), [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [original-source ledger](SOURCE-VERIFICATION-LEDGER.md) retain the verification and pending gates. Existing pilot and Batch 1–2 guides are unchanged.\n\n```json\n'+JSON.stringify({authoringFormatVersion:1,batch:3,source,plannedGuideVersion:'1.1.0',contentStatus:'draft',questions:drafts},null,2)+'\n```\n');
  fs.writeFileSync(folder+'batch-3-questions-only.md','# Intermediate expansion — Batch 3 solve-first copy\n\nExact validated bank stems, option order and sources; no keys or feedback. Record your choices and reasoning before opening the draft or answer-bearing ledger. Q30/Q31 retain every original table column, row, value and unit plus all surrounding constraints.\n\n'+qs.map(q=>`## ${q.id}\n\n`+q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('')).join('\n'));
  const oldSources=block(out+'source-ledger-before.md'),oldSourceText=fs.readFileSync(out+'source-ledger-before.md','utf8');
  const nextSources={...oldSources,references:[...oldSources.references,...refs],batch3:{checkedAt:'2026-10-18',referenceCount:12,distinctPassages:12,originalPages:8,humanSourceReview:'pending',method:'All twelve exact passages inspected in this Batch 3 pass; earlier-batch verification is not treated as automatic evidence.'}};
  const sourceIntro='# Phase 7 expansion — Batch 3 source-verification update\n\n**Current, 2026-10-18: Batch 3 has 12/12 AI-inspected reference occurrences, twelve distinct passages on eight original pages; all necessary sources retrieved.** Combined authored coverage is 36/36 references for thirty new draft guides, with 0/30 independent human source reviews. All twenty-four prior reference records and earlier metadata remain unchanged. All eight pages were available in this pass; Workflow was opened through the original AI Fluency sidebar and its exact sections 12/11 read. The other seven courses opened directly. No failed retrieval or secondary-source substitution occurred for Batch 3. Prior retrieval failures remain preserved in the historical narrative below. Each new record has exact bank metadata/index, inspected passage lines, a short supporting excerpt/summary, claim and explicit limitation. Line locators may drift; headings and URLs remain alongside them.\n\nQ30’s percentages measure distinct outcomes without provided denominator linkage; no overlap or common cause is inferred. Q31’s per-task threshold uses only the table’s observed pre-repair scores. Q29 has no supplied delivery-time dataset to compute a numerical answer. Q36’s duplicate/blank meanings are unsettled, and Q38’s private demand measurement remains absent. These are case evidence boundaries, not source facts invented by the author. All new teaching applications still require independent human review.\n\n## Earlier source-verification history (unchanged records; earlier totals are historical)\n\n';
  fs.writeFileSync(folder+'SOURCE-VERIFICATION-LEDGER.md',sourceIntro+oldSourceText.slice(0,oldSourceText.indexOf('```json'))+'\n## Current combined reference records\n\n```json\n'+JSON.stringify(nextSources,null,2)+'\n```\n');
  const oldLedger=block(out+'content-ledger-before.md'),oldLedgerText=fs.readFileSync(out+'content-ledger-before.md','utf8');
  const nextLedger={...oldLedger,records:oldLedger.records.map(r=>records.find(n=>n.questionId===r.questionId)??r)};
  const intro='# Phase 7 — Batch 3 content-ledger update\n\n**Current, 2026-10-18: thirty new draft guides (Batches 1–3), 0/30 independent human educational reviews, 0/30 final owner educational approvals, all new approved digests null.** Owner accepts Batch 2 as technically complete for continued drafting only. This supplies no final educational approval of Batch 1 or 2 and no waiver extension. Only Batch 3 is authorized now; Batches 4–5 remain unauthored.\n\n[Batch 3 drafts](content/intermediate-expansion/batch-3.md), [solve-first copy](content/intermediate-expansion/batch-3-questions-only.md), [review/identities](PHASE-7-BATCH-3-REVIEW.md) and [new original-source checks](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md). IDs Q29/Q30/Q31/Q32/Q34/Q35/Q36/Q37/Q38/Q39; responses 8 single/2 double; D1–D7 1/3/2/0/1/1/2; tables Q30/Q31. All twelve reference passages inspected anew; inventory’s earlier 0/12 count remains historical. All prior twenty ledger rows remain exactly unchanged, as do all pilot and Batch 1–2 guide files/approval histories. Twenty later rows remain unchanged and unauthored. Final Batch 3 draft version 1 / planned guideVersion 1.1.0 uses the established exact q1/draft-SHA/prospective-g1 conventions.\n\nIndependent solve-first/source/hint/all-option/set/vocabulary/arithmetic review and separate exact-digest owner educational approval are still required for every new item. No human activities/signatures or final approval are invented. The original accepted pilot’s waiver applies only to its exact ten versions.\n\n## Prior ledger history (retained; earlier counts and continuation are superseded above)\n\n';
  fs.writeFileSync(dir+'PHASE-7-CONTENT-LEDGER.md',intro+oldLedgerText.slice(0,oldLedgerText.indexOf('```json'))+'\n## Current fifty-row ledger\n\n```json\n'+JSON.stringify(nextLedger,null,2)+'\n```\n');
  fs.writeFileSync(out+'draft-identities.json',JSON.stringify(records,null,2)+'\n');fs.writeFileSync(out+'source-checks.json',JSON.stringify(refs,null,2)+'\n');
  fs.writeFileSync(out+'inventory-check.json',JSON.stringify({bankSha256:sha(raw),source,ids:qs.map(q=>q.id),positions:qs.map(q=>bank.questions.indexOf(q)+1),domains:Object.fromEntries(bank.domains.map(d=>[d.id,qs.filter(q=>q.primaryDomain===d.id).length])),selectionCounts:[1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length),embeddedTables:qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id),optionCount:qs.reduce((n,q)=>n+q.options.length,0),sourceReferences:refs.length},null,2)+'\n');
  console.log(JSON.stringify({drafts:drafts.length,options:qs.reduce((n,q)=>n+q.options.length,0),references:refs.length,distinctPassages:new Set(refs.map(r=>r.url+'|'+r.sectionHeading)).size,pages:new Set(refs.map(r=>r.url)).size}));
}finally{await vite.close();}
