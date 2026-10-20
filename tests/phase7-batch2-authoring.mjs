// Item-specific draft authoring, confined to Markdown and local test evidence.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
const dir='docs/guided-practice/', folder=dir+'content/intermediate-expansion/';
const evidence='test-results/guided-practice/phase-7-batch-2/';
const sha=x=>createHash('sha256').update(x).digest('hex');
const block=p=>JSON.parse([...fs.readFileSync(p,'utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)][0][1]);
const expectedIds=['Q16','Q17','Q19','Q20','Q21','Q22','Q23','Q24','Q27','Q28'];
const g=(questionId,hints,decisiveCriteria,reasoningMarkdown,options,closestDistractorIds,terms)=>({questionId,hints,decisiveCriteria,reasoningMarkdown,
  optionComparisons:options.map(([optionId,satisfiesMarkdown,failsOrLimitsMarkdown])=>({optionId,satisfiesMarkdown,failsOrLimitsMarkdown})),closestDistractorIds,
  vocabulary:terms.map(([term,definition])=>({term,definition}))});
const authored=[
g('Q16',[
  'Use the timing of the change to form a testable explanation for the disappointing output.',
  'Separate what changed during the work from the brief, tools and reference material that were checked and remained stable.',
  'Compare which proposed test changes the suspected influence while carrying forward only the information needed to preserve current decisions.'
],[
  'The first six comparisons met the brief; deterioration appeared after a long discussion with discarded drafts.',
  'The brief is complete, staffing evidence exists, and tools and reference files have not changed.',
  'The next step should test accumulated-context influence while preserving checked current decisions.'
],'B is the keyed test. A fresh conversation supplied with the current brief, source notes and a checked decision summary removes accumulated discussion while retaining the needed inputs. If the required cost/audience/staffing table holds again, that supports context accumulation as the explanation; it does not prove the cause from timing alone. A intensifies instructions without removing the suspected influence. C changes model capability while keeping the old conversation, confounding the test. D rolls back files despite the stated checks that they are current and contain staffing information. The source supports timing-led hypothesis testing; the curator’s successful early comparisons and stable files are facts of this case.',[
  ['A','Restates the required format and permits a before/after comparison of output.','Keeps the accumulated conversation, so it is a weaker test of the leading context hypothesis than changing the session.'],
  ['B','Tests a fresh context with the verified brief, sources and agreed decisions preserved.','No failure under the case; the result would support or weaken a hypothesis rather than certify a permanent fix.'],
  ['C','Tests a different model capability without losing the conversation history.','Retains the suspected noisy context and changes another variable, making the result less diagnostic.'],
  ['D','Would test a reference-version change if there were evidence of one.','The files have not changed and the needed data is present; a rollback is unsupported by this scenario.']
],['A','C'],[['Diagnostic hypothesis','A proposed cause tested against observations rather than treated as established.'],['Accumulated context','The conversation history and intermediate material supplied during a session.'],['Confounding change','An additional change that makes a test’s outcome harder to attribute to one cause.']]),
g('Q17',[
  'Identify the educator’s intended involvement while the activities are still being developed.',
  'Distinguish decisions made during exploration from approval after a finished recommendation arrives.',
  'Sketch who proposes, challenges and revises an activity in each arrangement; compare that sequence with how she wants to work.'
],[
  'The educator wants ongoing comparison, challenge and revision using her knowledge of local visitors.',
  'She retains the final activity choice and runs the workshop herself.',
  'The arrangement must preserve participation during exploration, not merely a final approval point.'
],'A matches the case: augmentation names the joint exploration the educator describes. She and AI can generate and revise activities while she contributes local knowledge and makes the final choices. B replaces that interaction with a fixed execution recipe and end inspection. C delegates independent selection while she steps away. D allows the model to iterate, but its self-scoring does not supply her involvement during that exploration. The distinction is the actual division of decisions and feedback, not a label for a particular product. Audience and safety constraints remain binding in any arrangement.',[
  ['A','Keeps the educator engaged in ideas, feedback, adaptation and choice throughout development.','No failure under the case; collaboration still requires the fixed audience and safety limits.'],
  ['B','Gives a clear procedure and retains inspection of the finished plan.','End inspection does not provide the intended exploratory exchange and local judgments during development.'],
  ['C','Sets a goal and safety boundaries for independent work.','Transfers activity selection and plan settlement away from the educator’s requested ongoing participation.'],
  ['D','Adds iterative self-review and final educator approval.','The model’s internal revisions replace the desired dialogue while the alternatives are being developed.']
],['D'],[['Augmentation','A working arrangement in which a human and AI jointly develop and assess ideas.'],['Automation','AI execution of a defined task or procedure.'],['Agency','Goal-directed AI work with delegated freedom to choose subsequent steps.']]),
g('Q19',[
  'List the task’s data needs separately from the conditions governing where it may be processed.',
  'Trace each proposed path to the actual account or service receiving the records, rather than relying on the visible interface.',
  'Check whether each path has authority for this purpose and preserves the information needed to match the resulting summaries.'
],[
  'Client names are required to associate each summary with its contract.',
  'The administrator has approved this task and data only for the available managed upload route.',
  'Personal accounts and the forwarding service are not approved alternatives.'
],'The bank selects C because it uses the route already approved for these named records and this purpose without breaking the matching task. A’s training/deletion settings do not authorize the personal route. B retains a managed interface but forwards the records to a different, unapproved service. D both removes necessary matching information and still uses an unapproved account; trying to infer matches from wording does not meet the stated task. The course supports checking the real data path and its authorization. The guide does not assert that every managed account is approved, nor require fresh approval where this scenario explicitly says it has already been obtained.',[
  ['A','Preserves the names needed for matching and adds training/deletion controls.','Those controls do not supply the missing approval for this personal entry point.'],
  ['B','Starts from the managed workspace and offers quicker processing.','Its forwarding path sends the data to a separately unapproved processor; the initial interface does not define the whole route.'],
  ['C','Uses the exact available route approved for the data, purpose and required matching information.','No failure under the scenario; processing must stay within the authorized task and existing controls.'],
  ['D','Attempts to reduce identifying data and allows later review.','Destroys required matching information and uses a route the policy still does not approve.']
],['A','B'],[['Processing route','The complete path by which information reaches the account, service or processor doing the work.'],['Purpose limitation','Restricting use of data to the task for which it is authorized.'],['Task-essential identifier','Identifying information needed to perform the stated job correctly.']]),
g('Q20',[
  'Separate improving the language of a statement from establishing the service promise it conveys.',
  'Identify the permitted evidence boundary and compare what each proposal would allow into the next draft.',
  'Imagine a reviewer tracing a newly worded promise back to the brochure; check how each instruction handles a gap in that trace.'
],[
  'The attached approved brochure is the only permitted source for service claims.',
  'It supplies menus and delivery areas but no allergy guarantee; the added promise has been checked and lacks support.',
  'The rewrite must improve wording without adding promises or concealing missing information.'
],'A directly controls the next rewrite: it binds service claims to the brochure, requires support, omits unsupported promises and flags absent details. B imports other companies’ wording outside the permitted source and cannot establish this caterer’s service. C changes how reassurance sounds but explicitly keeps its unsupported meaning. D substitutes agreement about reasonableness for evidence in the authorized brochure. The answer concerns claim provenance, not a conclusion about the actual safety of any menu. The course supports source-bounded responses with inspectable support and visible unknowns; the missing allergy statement is established by this case.',[
  ['A','Defines the authorized evidence, requires traceable claim support and makes omissions visible.','No failure under the stated rewrite goal; the resulting claims still need checking against the brochure.'],
  ['B','Keeps the brochure central and seeks less absolute wording.','Adds unauthorized outside material and treats other businesses’ language as support for this company’s promise.'],
  ['C','Addresses tone and audience suitability.','Retains an unsupported service meaning; softer phrasing does not create supporting evidence.'],
  ['D','Invites another assistant to scrutinize the wording.','Agreement that a claim sounds reasonable cannot establish that the permitted source supports it.']
],['C'],[['Source boundary','The specified material from which factual claims may be drawn.'],['Service claim','A statement about what an organization offers or promises.'],['Unsupported assurance','Reassuring wording whose factual meaning is not established by the permitted evidence.']]),
g('Q21',[
  'Distinguish extracting a proposed requirement from establishing an agreed acceptance condition.',
  'Read both columns of the table and compare the basis recorded for each row; do they carry the same authority?',
  'Ask what observable check would show the report arrived in time for its intended use, and whether the current request settles that check.'
],[
  'The table binds Weekly PDF to the manager’s email, but Delivery by Saturday 9 a.m. to AI’s suggested interpretation.',
  'Recipient, source file and PDF layout are agreed; “soon after Friday’s close” does not establish a delivery deadline.',
  'Saturday staffing depends on delivery, so a usable agreed cutoff must precede schedule design and retain truthful provenance.'
],'C resolves the specific missing design input. The table’s Requirement and Recorded basis columns must be read together: Weekly PDF is grounded in the manager’s email; Delivery by Saturday 9 a.m. is explicitly AI’s suggestion. A table entry is not evidence that the warehouse lead agreed to that time. Confirm the usable delivery deadline with that lead, record the resulting agreement distinctly from the original request, then design the schedule. A might test implementation but leaves the acceptance deadline undecided until after a run. B both assumes the suggested time is usable and falsely attributes it to the email. D supplies a readiness notification while leaving staffing dependent on an unsettled arrival time. No alternative deadline is invented, and the already agreed recipient, input and layout remain constraints.',[
  ['A','Provides a concrete implementation trial and asks the operational recipient to assess arrival.','Defers agreement of the needed deadline until after building/running the schedule; the source ambiguity remains at design time.'],
  ['B','Chooses a definite target and attempts to document its provenance.','The target is not agreed and its proposed attribution is false: the table records it as an AI interpretation, not the manager’s email.'],
  ['C','Establishes the usable deadline with the warehouse lead and preserves the separate agreement before choosing a schedule.','No failure under the case; a later implementation still needs to demonstrate it meets that agreed requirement.'],
  ['D','Makes report readiness visible to staff.','A notification does not settle the delivery cutoff needed to support Saturday staffing.']
],['A','B'],[['Acceptance condition','An agreed, observable criterion for deciding whether a result meets the need.'],['Requirement provenance','The source or agreement that establishes a requirement.'],['Design assumption','A proposed basis for design that has not necessarily been agreed as a requirement.']]),
g('Q22',[
  'Separate feedback about writing quality from evidence about the disputed eligibility statement.',
  'Compare what the reviewers evaluated with what the available supplier clause can establish directly.',
  'Trace the disputed statement to its source, then decide which parts of the review feedback remain useful after that check.'
],[
  'The full clause restricts the rebate to orders of at least fifty units.',
  'The memo claims all orders, including small ones, qualify.',
  'Disagreement should direct a source check; overall scores or model votes cannot override the explicit clause.'
],'B uses the disagreement productively: inspect the clause, correct eligibility to its stated minimum of fifty units, and retain useful clarity advice. The source establishes a lower bound rather than eligibility for every order. A seeks wider model support even though the decisive clause is available. C blends overall writing scores rather than checking the disputed fact. D uses an improved self-score as a substitute for source consistency. Different model families can reveal issues, but they are not a voting authority over supplier terms. No specific reviewer is granted factual authority merely because its flag happens to be right in this case.',[
  ['A','Recognizes disagreement and seeks another assessment.','Keeps a source-inconsistent claim provisionally while waiting for votes that cannot change the clause.'],
  ['B','Uses the flag to verify the exact condition, revises the claim and preserves relevant craft feedback.','No failure under the case; the revised wording must retain the at-least threshold rather than narrow it to exactly fifty.'],
  ['C','Uses a repeatable threshold for general writing evaluation.','An average score can mask a specific factual contradiction; clarity does not establish rebate eligibility.'],
  ['D','Feeds critique into revision and may improve the draft’s presentation.','A higher self-assessed score does not demonstrate that the eligibility claim now matches the supplied clause.']
],['A'],[['Eligibility threshold','A minimum condition that must be met to qualify.'],['Cross-model review','Assessment of work by another model, which can identify concerns for verification.'],['Craft feedback','Comments on qualities such as clarity or structure, distinct from factual evidence.']]),
g('Q23',[
  'Examine which possible conclusions the prompt actually permits, before judging how balanced it sounds.',
  'Compare the starting position and burden of proof assigned to each staffing approach.',
  'Imagine the supplied file does not settle the comparison; check what each replacement instruction would let the assistant report then.'
],[
  'Neither staffing approach has been chosen; both must be assessed against the same supplied costs, service needs and availability limits.',
  'The prompt must permit either approach to be recommended rather than privilege hiring.',
  'Evidence supporting a conclusion and unanswered questions must be visible, including when the information cannot distinguish the options.'
],'The complete keyed set is A and D. A establishes symmetric evaluation: the same cost, coverage and staffing criteria, with a case and limitation for each option before any recommendation. D makes the evidential basis and unanswered questions explicit and permits an unresolved result. A alone does not explicitly handle evidential gaps; D alone could accompany a comparison still tilted toward hiring. Together they remove the predetermined winner and prevent missing information from becoming invented certainty. B retains hiring as the default that objections must defeat. C improves an already selected hiring proposal instead of reopening the choice. E gives equal space while fixing the winner and asserting an unestablished long-term advantage. No actual staffing cost or recommendation is invented by the guide.',[
  ['A','Uses common criteria and evaluates both approaches before recommending a result.','Needs D’s explicit handling of evidence and unanswered questions to address the whole stated aim.'],
  ['B','Considers counterarguments and allows a change if objections are serious.','Starts from a privileged hiring recommendation, so the two options do not face the same burden of proof.'],
  ['C','Adds a challenge and evidence-based revision to a proposal.','The object being improved is still a hiring recommendation, rather than a comparison allowed to select either approach.'],
  ['D','Requires a supported conclusion, visible unknowns and an unresolved outcome where evidence cannot distinguish the options.','Complements A’s symmetric comparison; it does not itself replace a biased initial framing.'],
  ['E','Gives each approach space and acknowledges a possible rota benefit.','Still commands a hiring conclusion and claims its long-term advantage without evidence that settles the choice.']
],['B','C'],[['Sycophancy','A tendency for an assistant to agree with the preference implied by a request.'],['Symmetric criteria','The same decision standards applied to each alternative.'],['Burden of proof','The evidence an alternative must supply before it can be accepted.']]),
g('Q24',[
  'Classify the information need by how quickly the facts can change and the breadth of the requested result.',
  'Compare the evidence each approach can obtain for the current grant round, rather than the amount of effort or confidence it displays.',
  'For a proposed deadline and fee, ask how the group could verify both the source and its relevance to this round.'
],[
  'This round’s changing deadline and fee require current evidence from the council.',
  'The group needs a short, checkable answer about one grant, not a broad comparison.',
  'The approach must check the round and retain source wording or visible gaps, rather than infer current terms from old data or repetition.'
],'D fits the functional need: retrieve the council’s round page, establish that it concerns the current round and report its stated deadline/fee with source support or explicit unknowns. A’s extra reasoning and confidence cannot refresh remembered facts. B’s wider research is unnecessary for the narrow request, and repeated claims across directories are not the council’s current terms. C extrapolates from a previous announcement instead of verifying this round. The concept is matching retrieval and freshness checks to the question; the label of a model or research product does not establish those functions. No live council terms or prices are added.',[
  ['A','Can explain remembered information and assess confidence.','Reasoning over recall cannot establish terms that change between rounds.'],
  ['B','Looks at multiple sources and aims to condense findings.','Adds unnecessary breadth and treats repetition as authority instead of verifying the relevant council round.'],
  ['C','Uses a genuine earlier council announcement as a reference.','An inferred interval does not establish the current round’s deadline or fee.'],
  ['D','Retrieves the relevant official source, checks round freshness and supplies traceable terms or gaps.','No failure under the case; retrieval alone is insufficient without the specified freshness and support checks.']
],['C','B'],[['Freshness check','Verification that information applies to the relevant current period or version.'],['Retrieval','Obtaining information from a source available for inspection.'],['Scope of research','The breadth of investigation needed to answer the actual question.']]),
g('Q27',[
  'Locate the repeated effort: is it in explaining the reporting method or obtaining its inputs?',
  'Consider when the quantities in each proposal were captured relative to the run that will use them.',
  'Trace a later report through each setup: what can reach the app, what values would it receive, and what method would process them?'
],[
  'The existing reporting Skill already works correctly with supplied data.',
  'Quantities change during the day, so saved exports do not establish the values for each later run.',
  'An approved read-only Connector can remove manual fetching while preserving the working report method.'
],'B provides the missing function: approved read-only app access retrieves quantities for each run and the existing Skill processes them. A enables access once but then reuses a saved snapshot, losing per-run currency. C refreshes only daily, while the case explicitly says quantities change throughout the day. D stores another snapshot and update instructions in a second Skill without creating access to the inventory app. Method instructions are not access permissions, and a connected tool does not itself guarantee that every run reads fresh values; B specifies both retrieval timing and reuse of the proven method. No write capability or toolchain redesign is needed.',[
  ['A','Enables the link and preserves the existing reporting method.','Subsequent reports reuse stored quantities rather than retrieve changing app values at each run.'],
  ['B','Fetches input through the approved read-only route for each run and retains the method that already works.','No failure under the scenario; freshness depends on the per-run retrieval actually specified, not merely enabling a connection.'],
  ['C','Updates the reference more often than keeping yesterday’s export.','A start-of-day snapshot can become stale before later runs as stock changes.'],
  ['D','Attempts to document data and an update procedure for reuse.','A second method cannot grant missing app access; embedded values remain a snapshot rather than per-run input.']
],['A','C'],[['Snapshot','A copy of values captured at a particular time.'],['Data currency','How well input values represent the state needed at the time of use.'],['Read-only integration','A connection that can retrieve information without changing its source records.']]),
g('Q28',[
  'Compare the workflow described by the document with the evidence about the work currently being done.',
  'Consider how changed volume and staffing could affect a review step even when staff say it still occurs.',
  'Follow each maintenance proposal beyond the immediate edit: how would a later mismatch be found and who would be answerable for keeping the document accurate?'
],[
  'Volume has risen from twenty to sixty cases, the reviewer moved roles and the map still names that reviewer.',
  'Actual recent assignments and review time are undocumented; assurance that checking continues does not establish current capacity.',
  'The map needs accountable ongoing maintenance, evidence of real review now, and future scheduled/change-triggered checks.'
],'D meets the continuing maintenance goal: identify an accountable map owner, inspect recent steps and checking capacity now, and arrange a next review with earlier checks when conditions change. The volume/staffing change warrants attention before the existing three-month date. A changes a label and relies on later problem reports without checking silent gate decay. B supplies a one-time updater but treats assurances as evidence and closes the task after an ownership edit. C samples output while postponing the known map mismatch. The increase from twenty to sixty is a capacity warning, not proof that every review failed or that a particular new staffing level is required. The guide distinguishes maintaining the map from personally performing every review.',[
  ['A','Updates the named reviewing group and retains a calendar date.','Does not establish one accountable map owner or inspect actual capacity now; reactive reports may miss a silently weakened gate.'],
  ['B','Assigns a person to make an immediate documentation update.','Trusts assurances instead of recent review evidence and treats ownership completion as the end of maintenance.'],
  ['C','Could provide useful evidence about the quality of sampled follow-ups.','Postpones correction of a known staffing/volume mismatch and does not establish current review operation.'],
  ['D','Combines accountable map ownership, immediate evidence/capacity review and continuing scheduled/change-triggered maintenance.','No failure under the case; the map owner is answerable for accuracy without having to perform every operational step.']
],['B','A'],[['Delegation map','A record of workflow steps, their owners and the reasons for those assignments.'],['Review capacity','The people and time available to perform the required checks.'],['Control drift','A gradual mismatch between a documented safeguard and how work actually operates.']]),
];
const passages={
  Q16:[542,562,'Use symptom timing to choose a hypothesis, then test it; deterioration within a long session can be tested in a fresh context.','Timing and diagnostic table; hypothesis is not proof.'],
  Q17:[257,320,'Distinguish fixed-task execution, joint exploration and delegated goal pursuit by human participation and decision freedom.','Descriptions of the three working arrangements, including interactive augmentation.'],
  Q19:[314,326,'Approval depends on the actual route, data and purpose, not the provider’s name alone.','Entry-point definition and route-specific approval test.'],
  Q20:[484,511,'Bind answers to supplied sources, make support inspectable and mark what the source does not establish.','Source-limited response example and verification instructions.'],
  Q21:[265,289,'Requirements need traceable, testable meaning; ambiguous delivery language requires clarification before design.','Requirements/source-column discussion and ambiguous delivery example.'],
  Q22:[832,860,'Different-model critique can expose concerns; scores and agreement do not replace factual verification.','Cross-model recipe and explicit limit on treating model grades as truth.'],
  Q23:[472,492,'Use neutral comparison rather than a predetermined conclusion, and permit uncertainty where evidence is missing.','Neutral framing and permission to leave uncertain claims unverified.'],
  Q24:[272,289,'Match retrieval breadth to the question and check currency and source support even after searching.','Retrieval modes, stale-page example and source-support checks.'],
  Q27:[329,341,'Separate reusable method from access to app data and choose only the integration functions the workflow needs.','Skill/Connector diagnostic questions and functional comparison table.'],
  Q28:[462,490,'Keep the workflow map under a named owner and scheduled review; staffing or volume changes require earlier evidence checks.','Map ownership, review timing and actual recent review/capacity questions.'],
};
const excerpts={
  Q16:'Timing tells you where to look first.', Q17:'you and AI work together',
  Q19:'this route approved for this data', Q20:'not in the source',
  Q21:'specific, traceable, testable', Q22:'not a truth signal',
  Q23:'not knowing is an acceptable answer', Q24:'Web search does not check',
  Q27:'Do I keep fetching data', Q28:'one named person, not a team',
};
const vite=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
try {
  const {validateQuestionBank}=await vite.ssrLoadModule('/src/domain/bankValidation.ts');
  const {questionFingerprint,guidanceDigest}=await vite.ssrLoadModule('/src/domain/guided/fingerprints.ts');
  const {guideEntrySchema,guidedItemSchema}=await vite.ssrLoadModule('/src/domain/guided/schema.ts');
  const raw=fs.readFileSync('public/easy-question-bank.json');
  if(sha(raw)!=='f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4') throw new Error('Bank drift');
  const valid=validateQuestionBank(JSON.parse(raw)); if(!valid.ok) throw new Error(valid.errors.join('; '));
  const bank=valid.bank, inventory=block(dir+'PHASE-7-QUESTION-INVENTORY.md'), source=inventory.source;
  const planned=inventory.records.filter(r=>r.plannedBatch===2);
  const qs=bank.questions.filter(q=>expectedIds.includes(q.id));
  if(JSON.stringify(planned.map(r=>r.questionId))!==JSON.stringify(expectedIds)||JSON.stringify(qs.map(q=>q.id))!==JSON.stringify(expectedIds)) throw new Error('Order mismatch');
  if(JSON.stringify(bank.domains.map(d=>qs.filter(q=>q.primaryDomain===d.id).length))!=='[2,1,1,3,1,1,1]'||qs.filter(q=>q.selectionCount===1).length!==9||qs.filter(q=>q.selectionCount===2).length!==1) throw new Error('Coverage mismatch');
  const refs=[], records=[], drafts=[];
  for(const a of authored){
    const q=qs.find(q=>q.id===a.questionId), domain=bank.domains.find(d=>d.id===q.primaryDomain), p=passages[q.id];
    const fp=await questionFingerprint(source,domain,q);if(!fp.ok) throw new Error(fp.code);
    if(fp.value!==planned.find(r=>r.questionId===q.id).sourceFingerprint) throw new Error('q1 drift');
    const sourceChecks=q.sources.map((s,sourceIndex)=>{
      refs.push({questionId:q.id,sourceIndex,...s,batch:2,checkedBy:'Codex (AI author; not independent review)',checkedOn:'2026-10-18',status:'ai-source-checked',originalPassageLines:[p[0],p[1]],claim:p[2],supportingPassageSummary:p[3],supportingExcerpt:excerpts[q.id],
        retrieval:'Original canonical course page opened and exact passage inspected in this Batch 2 pass; workflow reached through the original AI Fluency sidebar.',
        scopeLimit:'Scenario facts/key from frozen bank; guide interpretation is AI-authored and awaits independent human review.',humanVerifiedBy:null,humanVerifiedAt:null});
      return{sourceIndex,claim:p[2],evidenceLocator:`AI original-course check for Batch 2, 2026-10-18; independent human verification pending. ${s.url} — ${s.sectionHeading}; rendered passage lines ${p[0]}–${p[1]}.`};
    });
    const draft={questionId:q.id,sourceFingerprint:fp.value,hints:a.hints,decisiveCriteria:a.decisiveCriteria,reasoningMarkdown:a.reasoningMarkdown,optionComparisons:a.optionComparisons,closestDistractorIds:a.closestDistractorIds,vocabulary:a.vocabulary,sourceChecks,approval:{status:'draft',reviewId:`gp7-intermediate-${q.id.toLowerCase()}-v1`}};
    const projected=guideEntrySchema.parse({...draft,approval:{...draft.approval,status:'approved'}});
    const digest=await guidanceDigest(source,'1.1.0',projected);if(!digest.ok) throw new Error(digest.code);
    guidedItemSchema.parse({question:q,domain,guide:projected,guideDigest:digest.value});
    drafts.push(draft);
    records.push({questionId:q.id,batch:2,draftVersion:1,authoredOn:'2026-10-18',author:'Codex (AI)',reviewId:draft.approval.reviewId,guideVersion:'1.1.0',sourceFingerprint:fp.value,draftSha256:sha(JSON.stringify(draft)),prospectiveG1:digest.value,approvedG1:null,originalCorrectOptionIds:q.correctOptionIds,selectionCount:q.selectionCount,draftStatus:'draft; AI source-checked; human review pending',sourceChecks:sourceChecks.length,
      claimProvenance:{scenarioFacts:'Frozen bank stem and artifacts, including both Q21 table columns and rows',answerAndOptionRequirements:'Frozen bank correctOptionIds and optionExplanations',generalPrinciples:'Batch 2 independently inspected original passages in SOURCE-VERIFICATION-LEDGER.md',authorInterpretation:'Application to the frozen case; independent human review pending'},independentHumanReview:null,independentSourceReview:null,semanticHintReview:null,finalOwnerApproval:null});
  }
  if(drafts.length!==10) throw new Error('Wrong record count');
  fs.writeFileSync(folder+'batch-2.md','# Intermediate expansion — Batch 2 of 5\n\nAI-authored 2026-10-18. Ten unpublished draft records; independent educational review and owner approval remain pending. Use [Batch 2 solve-first copy](batch-2-questions-only.md) before opening answer-bearing feedback. Exact version/review/digest identities are in the [content ledger](../../PHASE-7-CONTENT-LEDGER.md) and [Batch 2 review](../../PHASE-7-BATCH-2-REVIEW.md). No accepted pilot or Batch 1 content is changed.\n\n```json\n'+JSON.stringify({authoringFormatVersion:1,batch:2,source,plannedGuideVersion:'1.1.0',contentStatus:'draft',questions:drafts},null,2)+'\n```\n');
  fs.writeFileSync(folder+'batch-2-questions-only.md','# Intermediate expansion — Batch 2 solve-first copy\n\nExact validated bank stems/options/sources; answer keys and feedback are omitted. Record choices and reasoning before viewing the drafts or answer-bearing ledger. Q21 retains both original columns, every row and all surrounding constraints.\n\n'+qs.map(q=>`## ${q.id}\n\n`+q.stemMarkdown+'\n\n'+q.options.map(o=>`**${o.id}**\n\n${o.textMarkdown}\n`).join('\n')+'\nSources:\n\n'+q.sources.map(s=>`- ${s.courseTitle} — ${s.sectionHeading} — ${s.url}\n`).join('')).join('\n'));
  const beforeSources=block(evidence+'source-ledger-before.md');
  const combinedSources={...beforeSources,references:[...beforeSources.references,...refs],batch2:{checkedAt:'2026-10-18',referenceCount:10,distinctPassages:10,originalPages:6,humanSourceReview:'pending',method:'All ten exact original passages inspected for Batch 2; preliminary inventory counts were not reused as verification.'}};
  const oldSourceText=fs.readFileSync(evidence+'source-ledger-before.md','utf8');
  const previousNarrative=oldSourceText.slice(0,oldSourceText.indexOf('```json'));
  fs.writeFileSync(folder+'SOURCE-VERIFICATION-LEDGER.md','# Phase 7 expansion — original-course verification\n\n**Current Batch 2, 2026-10-18: 10/10 new reference occurrences independently inspected by the AI author in this pass, across ten distinct passages on six original pages.** Total authored coverage is 24/24 references across twenty draft records; human source reviews remain 0/20. Source accessibility is not treated as verification. Batch 1’s fourteen reference records below are unchanged. No human sign-off or waiver extension is inferred.\n\nAll six pages were retrieved successfully in this pass. The workflow page was opened through its original AI Fluency sidebar link, with no failed Batch 2 retrieval or source substitution. Exact sections 11/2/8 were read for Q16/Q21/Q28. Other current-pass passages: AI Fluency §2, Governance §2.4, Just Delegate It §5, Prompting §§13/6/3 and Skills & Connectors §9. Each new record below retains exact original source metadata/index, an inspected passage range, a short supporting summary, claim and scope limitation. There is no unsupported necessary teaching claim marked complete; no Batch 2 source blocker was found. Original passages may change after inspection; headings/URLs supplement the rendered line locators.\n\nThe scenario supplies key facts and options. Courses supply general principles. The guide’s application of them is author interpretation, not a new observed result. In particular: Q16’s diagnosis remains a hypothesis, Q19’s authorization is specific to the stated route, Q21’s proposed cutoff is not an agreed deadline, Q22 preserves “at least” eligibility, Q23 supplies no final staffing decision, and Q24 supplies no real grant deadline/fee.\n\n## Preserved Batch 1 source history\n\n'+previousNarrative+'\n## Combined reference records\n\n```json\n'+JSON.stringify(combinedSources,null,2)+'\n```\n');
  const oldLedger=block(evidence+'content-ledger-before.md');
  const nextLedger={...oldLedger,records:oldLedger.records.map(r=>records.find(n=>n.questionId===r.questionId)??r)};
  const oldLedgerText=fs.readFileSync(evidence+'content-ledger-before.md','utf8');
  const previousLedgerNarrative=oldLedgerText.slice(0,oldLedgerText.indexOf('```json'));
  fs.writeFileSync(dir+'PHASE-7-CONTENT-LEDGER.md','# Phase 7 — Intermediate content and batch ledger\n\n**Current, 2026-10-18: twenty new draft records (Batches 1–2); 0/20 independent human educational reviews; 0/20 final owner educational approvals; all new approved digests null.** Owner accepts initialization and Batch 1 as technically complete for continued drafting only. That decision is not educational approval, source sign-off or a waiver. Batch 2 alone is authorized now; Batches 3–5 remain unauthored and unauthorized.\n\n[Batch 2 drafts](content/intermediate-expansion/batch-2.md), [solve-first copy](content/intermediate-expansion/batch-2-questions-only.md), [review/identities](PHASE-7-BATCH-2-REVIEW.md) and [updated original-source evidence](content/intermediate-expansion/SOURCE-VERIFICATION-LEDGER.md). Batch 2 matches the accepted inventory: Q16/Q17/Q19/Q20/Q21/Q22/Q23/Q24/Q27/Q28; select-one/two = 9/1; D1–D7 = 2/1/1/3/1/1/1; Q21 table preserved. All ten passages were inspected anew for this batch; the inventory’s earlier 2/10 availability count remains historical. All Batch 1 JSON review rows below remain identical, as do its draft, solve-first file and review report. The ten accepted pilot guides and approval history remain unchanged.\n\nHuman review of all new items still requires independent solve-first reasoning, original sources, individual/cumulative hints, all options and full sets, terminology and calculations, followed by separate exact-digest owner educational approval. No reviewer activity, signature or extension of the original ten-pilot waiver is invented. Exact Batch 2 version 1 / planned guideVersion 1.1.0; same draft SHA/q1/prospective-g1 contracts.\n\n## Initialization history and established gates (superseded only as to current draft count/continuation)\n\n'+previousLedgerNarrative+'\n## Current fifty-row ledger\n\n```json\n'+JSON.stringify(nextLedger,null,2)+'\n```\n');
  fs.writeFileSync(evidence+'draft-identities.json',JSON.stringify(records,null,2)+'\n');
  fs.writeFileSync(evidence+'source-checks.json',JSON.stringify(refs,null,2)+'\n');
  fs.writeFileSync(evidence+'inventory-check.json',JSON.stringify({bankSha256:sha(raw),ids:qs.map(q=>q.id),positions:qs.map(q=>bank.questions.indexOf(q)+1),domains:Object.fromEntries(bank.domains.map(d=>[d.id,qs.filter(q=>q.primaryDomain===d.id).length])),selectionCounts:[1,2,3].map(n=>qs.filter(q=>q.selectionCount===n).length),embeddedTables:qs.filter(q=>/\|\s*:?-{3}/.test(q.stemMarkdown)).map(q=>q.id),options:qs.reduce((n,q)=>n+q.options.length,0),sourceReferences:refs.length},null,2)+'\n');
  console.log(JSON.stringify({drafts:drafts.length,ids:expectedIds,options:qs.reduce((n,q)=>n+q.options.length,0),sourceReferences:refs.length,sourcePages:new Set(refs.map(r=>r.url)).size}));
} finally {await vite.close();}
