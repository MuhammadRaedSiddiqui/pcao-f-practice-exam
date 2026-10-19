// Excluded local/test integration. No production imports or publication side effects.
import fs from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { validateQuestionBank } from '../../src/domain/bankValidation';
import { questionFingerprint, guidanceDigest } from '../../src/domain/guided/fingerprints';
import { guideEntrySchema, guideReleaseSchema, LIMITS, withinJsonLimit, type GuideEntry } from '../../src/domain/guided/schema';
import { guideCatalogSchema, productionCatalog } from '../../src/domain/guided/catalog';
import { validateStandaloneRelease } from '../../src/domain/guided/loader';
import { resolveEligibility, practiceSets } from '../../src/domain/guided/selectors';
import { preparePilot } from '../local-pilot/prepare';
import { frozenCopy, type GuidedResult } from '../../src/domain/guided/errors';

export const hash = (x: string | Buffer) => createHash('sha256').update(x).digest('hex');
export function unwrap<T>(r: GuidedResult<T>): T { if (!r.ok) throw Error(r.code); return r.value; }
const requireMatch = (v: unknown, m: string) => { if (!v) throw Error('Phase 7 candidate refused: '+m); };
export async function prepareCandidate(root: string) {
 const read=(p:string)=>fs.readFileSync(resolve(root,p));
 const json=(p:string)=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
 const block=(p:string)=>{const all=[...read(p).toString('utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];requireMatch(all.length===1,p);return JSON.parse(all[0][1]);};
 const dir='docs/guided-practice/',ledger=block(dir+'PHASE-7-CONTENT-LEDGER.md');
 const pilotApproval=ledger.pilotVersion110OwnerAuthorization;
 requireMatch(pilotApproval?.status==='approved'&&pilotApproval.scopeCount===10&&pilotApproval.records.length===10&&pilotApproval.independentHumanReviewRequirement==='waived for these exact ten version-only bindings','missing ten exact pilot binding approvals');
 requireMatch(ledger.records.length===50&&ledger.newIndependentReviewWaiver===true&&ledger.independentHumanReviewWaiver.bindings.length===50,'missing expansion approvals/waiver');
 const decisionChecks=json('test-results/guided-practice/phase-7-pilot-110-owner-acceptance/checks.json');
 const fiftyChecks=json('test-results/guided-practice/phase-7-owner-educational-acceptance/checks.json');
 for(const pin of [decisionChecks.acceptanceRecord,fiftyChecks.acceptanceRecord])requireMatch(hash(read(pin.path))===pin.sha256,'owner authorization byte identity '+pin.path);
 for(const pin of [decisionChecks.authorizationManifest,fiftyChecks.acceptanceBindings])requireMatch(hash(read(pin.path))===pin.sha256,'owner tuple manifest '+pin.path);
 const authorizedTuples=[...json(decisionChecks.authorizationManifest.path).records,...json(fiftyChecks.acceptanceBindings.path).bindings];
 const old=await preparePilot(root); // Preserves original pins/1.0.0 approval checks and real loader validation.
 const valid=validateQuestionBank(json('public/easy-question-bank.json'));requireMatch(valid.ok,'original bank');
 if(!valid.ok)throw Error('original bank');const bank=valid.bank,source=old.release.source;
 const documents=[...[1,2].map(n=>({path:dir+`content/intermediate-pilot/batch-${n}.md`,data:block(dir+`content/intermediate-pilot/batch-${n}.md`)})),...[1,2,3,4,5].map(n=>({path:dir+`content/intermediate-expansion/batch-${n}.md`,data:block(dir+`content/intermediate-expansion/batch-${n}.md`)}))];
 const entries:GuideEntry[]=[],records=[];
 for(const q of bank.questions){
  const matches=documents.flatMap(d=>d.data.questions.filter((g:{questionId:string})=>g.questionId===q.id).map((draft:GuideEntry)=>({draft,document:d})));
  requireMatch(matches.length===1,'unique guidance '+q.id);const {draft,document}=matches[0];
  requireMatch(JSON.stringify(document.data.source)===JSON.stringify(source),'exact source '+q.id);
  const domain=bank.domains.find(d=>d.id===q.primaryDomain)!;
  const q1=unwrap(await questionFingerprint(source,domain,q)),draftSha256=hash(JSON.stringify(draft));
  const accepted=pilotApproval.records.find((r:{questionId:string})=>r.questionId===q.id)??ledger.records.find((r:{questionId:string})=>r.questionId===q.id)?.finalOwnerApproval;
  requireMatch(accepted?.status==='approved'&&accepted.guideVersion==='1.1.0'&&accepted.draftSha256===draftSha256&&accepted.sourceFingerprint===q1&&accepted.reviewId===draft.approval.reviewId&&JSON.stringify(accepted.source)===JSON.stringify(source),'exact approved educational identity '+q.id);
  const signed=authorizedTuples.find((r:{questionId:string})=>r.questionId===q.id);
  for(const key of ['guideVersion','draftSha256','sourceFingerprint','reviewId','prospectiveG1'])requireMatch(signed?.[key]===accepted[key],'recorded owner tuple '+q.id+' '+key);
  requireMatch(!guideEntrySchema.safeParse(draft).success&&draft.sourceFingerprint===q1,'draft/source boundary '+q.id);
  const guide=guideEntrySchema.parse({...draft,approval:{...draft.approval,status:'approved'}});
  const digest=unwrap(await guidanceDigest(source,'1.1.0',guide));requireMatch(digest===accepted.prospectiveG1,'approved g1 '+q.id);
  const waiver=pilotApproval.records.some((r:{questionId:string})=>r.questionId===q.id)?accepted:ledger.independentHumanReviewWaiver.bindings.find((r:{questionId:string})=>r.questionId===q.id);
  requireMatch(waiver?.prospectiveG1===digest&&waiver.reviewId===guide.approval.reviewId&&waiver.draftSha256===draftSha256,'exact waiver '+q.id);
  entries.push(guide);records.push({questionId:q.id,sourceFingerprint:q1,draftSha256,reviewId:guide.approval.reviewId,g1:digest,authority:accepted.acceptanceRecord??pilotApproval.acceptanceRecord,document:document.path});
 }
 requireMatch(entries.length===60&&new Set(entries.map(g=>g.questionId)).size===60,'60 unique entries');
 const release=guideReleaseSchema.parse({schemaVersion:1,fingerprintVersion:1,source,guideVersion:'1.1.0',contentStatus:'reviewed',questions:entries});
 const catalog=guideCatalogSchema.parse([{...old.catalog[0],path:'guided/intermediate-1.0.0.json'},{source,guideVersion:'1.1.0',path:'guided/intermediate-1.1.0.json',approvedEntries:Object.fromEntries(records.map(r=>[r.questionId,r.g1])),revokedDigests:[]}]);
 unwrap(await validateStandaloneRelease(release,bank,'intermediate',catalog));
 const coverage=unwrap(await resolveEligibility({kind:'standalone',bank,difficulty:'intermediate'},release,catalog));
 requireMatch(coverage.items.length===60&&coverage.excluded.length===0,'full source coverage');
 requireMatch(unwrap(practiceSets(coverage,5)).length===12&&unwrap(practiceSets(coverage,10)).length===6,'exact sets');
 requireMatch(withinJsonLimit(release,LIMITS.releaseBytes)&&productionCatalog.length===0,'limits/production isolation');
 const serialize=(v:unknown)=>JSON.stringify(v,null,2)+'\n';
 const assets={'intermediate-1.1.0.json':serialize(release),'intermediate-1.0.0.json':serialize(old.release),'catalog.json':serialize(catalog)};
 const inputs=[...documents.map(d=>d.path),dir+'PHASE-7-CONTENT-LEDGER.md',decisionChecks.acceptanceRecord.path,fiftyChecks.acceptanceRecord.path,'tests/local-pilot/approved-identities.json','public/easy-question-bank.json','public/question-bank.json','src/domain/guided/fingerprints.ts','src/domain/guided/schema.ts','src/domain/guided/catalog.ts','src/domain/guided/loader.ts'].map(path=>({path,sha256:hash(read(path))}));
 const identity={format:1,kind:'Phase-7-local-test-candidate-not-production',source,guideVersion:'1.1.0',legacyGuideVersion:'1.0.0',assets:Object.entries(assets).map(([file,body])=>({file,sha256:hash(body),bytes:Buffer.byteLength(body)})),records,inputs};
 const manifest={artifactId:hash(serialize(identity)),...identity};
 return frozenCopy({bank,release,legacy:old.release,catalog,coverage,manifest,assets});
}
export function writeCandidate(root:string,candidate:Awaited<ReturnType<typeof prepareCandidate>>) {
 const folder=resolve(root,'test-results/guided-practice/phase-7-integration/candidate');fs.mkdirSync(folder,{recursive:true});
 const files={...candidate.assets,'manifest.json':JSON.stringify(candidate.manifest,null,2)+'\n'};
 for(const [file,body]of Object.entries(files)){const target=resolve(folder,file);if(fs.existsSync(target)){requireMatch(fs.readFileSync(target,'utf8')===body,'immutable candidate drift '+file);}else fs.writeFileSync(target,body,{flag:'wx'});}
 return folder;
}
