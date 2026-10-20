import 'fake-indexeddb/auto';
import {beforeAll,afterEach,describe,it,expect,vi} from 'vitest';
import {openDB} from 'idb';
import fs from 'node:fs';
import {prepareCandidate,writeCandidate,hash,unwrap} from './phase7-integration/prepare';
import {validatePublishedRelease,validateFrozenItem,createGuidedLoader} from '../src/domain/guided/loader';
import {guideCatalogSchema,productionCatalog,catalogRelease} from '../src/domain/guided/catalog';
import {guideReleaseSchema,LIMITS} from '../src/domain/guided/schema';
import {resolveEligibility,practiceSets,selectPracticeSet} from '../src/domain/guided/selectors';
import {startSession,applyCommand,validateGuidedSession,isValidTransition,learningSummary} from '../src/domain/guided/session';
import {createGuidedRepository,type GuidedStore} from '../src/domain/guided/storage';
import {createAttempt,submitAttempt} from '../src/domain/attemptModel';
import {reportHash} from '../src/domain/cloudReports';
import {buildResultReport} from '../src/domain/reportExport';
import type {withGuidedProtection} from '../src/domain/guided/browserProtection';

let f:Awaited<ReturnType<typeof prepareCandidate>>,full:Awaited<ReturnType<typeof startSession>>;
const stores:GuidedStore[]=[];
const clear:typeof withGuidedProtection=async action=>({gate:{status:'clear',warnings:[]},value:await action({status:'clear',warnings:[]})});
const now=1800000000000;
beforeAll(async()=>{
 f=await prepareCandidate(process.cwd());writeCandidate(process.cwd(),f);
 const report=submitAttempt(createAttempt(f.bank,now-1000,'phase7-controlled-report'),now);
 full=await startSession({kind:'post-exam',report,filter:'all',access:{kind:'guest-device'},id:crypto.randomUUID(),now},f.release,f.catalog);
},30000);
afterEach(()=>stores.splice(0).forEach(s=>s.close()));
const standalone=(version:'1.0.0'|'1.1.0',size:5|10=5,setIndex=0)=>startSession({kind:'standalone',bank:f.bank,difficulty:'intermediate',selectionSize:size,setIndex,id:crypto.randomUUID(),now},version==='1.0.0'?f.legacy:f.release,f.catalog);
describe('Phase 7 actual sixty-guide candidate',()=>{
 it('V01/V03: exact owner-bound immutable approved content, original distributions and empty production catalog',()=>{
  expect(f.release.questions).toHaveLength(60);expect(f.coverage.items).toHaveLength(60);expect(f.coverage.excluded).toEqual([]);expect(productionCatalog).toEqual([]);
  expect(f.release.questions.map(q=>q.questionId)).toEqual(f.bank.questions.map(q=>q.id));
  expect(f.bank.domains.map(d=>f.coverage.items.filter(i=>i.domain.id===d.id).length)).toEqual([8,13,7,10,7,9,6]);
  expect([1,2,3].map(n=>f.coverage.items.filter(i=>i.question.selectionCount===n).length)).toEqual([48,10,2]);
  expect(Buffer.byteLength(f.assets['intermediate-1.1.0.json'])).toBeLessThan(LIMITS.releaseBytes);
  expect(hash(f.assets['intermediate-1.1.0.json'])).toBe('100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67');
  expect(writeCandidate(process.cwd(),f)).toContain('candidate');
 });
 it.each(['omitted','duplicate','extra','wrong-digest','draft','review-id'] as const)('V02 rejects %s release content',async kind=>{
  const release=structuredClone(f.release) as any;
  if(kind==='omitted')release.questions.pop();
  if(kind==='duplicate')release.questions[59]=release.questions[0];
  if(kind==='extra')release.questions.push({...release.questions[0],questionId:'Q61'});
  if(kind==='wrong-digest')release.questions[0].hints[0]+=' tampered';
  if(kind==='draft')release.questions[0].approval.status='draft';
  if(kind==='review-id')release.questions[0].approval.reviewId+='-tampered';
  expect((await validatePublishedRelease(release,f.catalog)).ok).toBe(false);
 });
 it('V02 rejects stale old digest, duplicate source/version/path and a mismatched revoked digest',async()=>{
  const catalog=structuredClone(f.catalog);catalog[1].approvedEntries.Q4=catalog[0].approvedEntries.Q4;
  expect(await validatePublishedRelease(f.release,catalog)).toEqual({ok:false,code:'digest-mismatch'});
  expect(guideCatalogSchema.safeParse([...f.catalog,f.catalog[1]]).success).toBe(false);
  const bad=structuredClone(f.catalog);bad[1].path=bad[0].path;expect(guideCatalogSchema.safeParse(bad).success).toBe(false);
  catalog[1].revokedDigests.push(f.catalog[1].approvedEntries.Q4);expect((await validatePublishedRelease(f.release,catalog)).ok).toBe(false);
 });
 it.each([5,10] as const)('V04/V05: complete deterministic %i-item partition and all frozen starts',async size=>{
  const sets=unwrap(practiceSets(f.coverage,size));expect(sets).toHaveLength(60/size);const union:string[]=[];
  for(const set of sets){expect(set.repeatedCount).toBe(0);const items=unwrap(selectPracticeSet(f.coverage,size,set.setIndex));expect(items).toHaveLength(size);union.push(...items.map(i=>i.question.id));
   const s=unwrap(await standalone('1.1.0',size,set.setIndex));expect(s.items).toEqual(items);expect(s.guideVersion).toBe('1.1.0');}
  expect(union).toEqual(f.bank.questions.map(q=>q.id));expect(new Set(union).size).toBe(60);expect(selectPracticeSet(f.coverage,size,sets.length).ok).toBe(false);
 });
 it.each(Array.from({length:60},(_,i)=>i))('V06 actual bank index %i: exact complete sets, durable contract and locked feedback',index=>{
  let s=structuredClone(unwrap(full));const q=s.items[index].question;
  if(q.selectionCount>1)expect(applyCommand(s,{kind:'commit',questionId:q.id,commandId:crypto.randomUUID()},s.revision,now).ok).toBe(false);
  expect(applyCommand(s,{kind:'select',questionId:q.id,ids:[q.options[0].id,q.options[0].id]},s.revision,now).ok).toBe(false);
  s=unwrap(applyCommand(s,{kind:'select',questionId:q.id,ids:q.correctOptionIds},s.revision,now)).session;
  s=unwrap(applyCommand(s,{kind:'commit',questionId:q.id,commandId:crypto.randomUUID()},s.revision,now)).session;
  expect(learningSummary(s).correct).toBe(1);expect(applyCommand(s,{kind:'revealNextHint',questionId:q.id},s.revision,now).ok).toBe(false);
  expect(applyCommand(s,{kind:'select',questionId:q.id,ids:[]},s.revision,now).ok).toBe(false);
  let wrong=structuredClone(unwrap(full));const ids=[...q.correctOptionIds];ids[0]=q.options.find(o=>!q.correctOptionIds.includes(o.id))!.id;
  wrong=unwrap(applyCommand(wrong,{kind:'select',questionId:q.id,ids},wrong.revision,now)).session;
  wrong=unwrap(applyCommand(wrong,{kind:'commit',questionId:q.id,commandId:crypto.randomUUID()},wrong.revision,now)).session;expect(learningSummary(wrong).correct).toBe(0);
 });
 it.each([['1.0.0',5],['1.0.0',10],['1.1.0',5],['1.1.0',10]] as const)('V07/V08/V14: %s %i-item exact frozen lifecycle through reopened IDB',async(version,size)=>{
  const initial=unwrap(await standalone(version,size)),dbName='phase7-controlled-'+crypto.randomUUID();
  const repository=()=>createGuidedRepository({catalog:f.catalog,databaseName:dbName,protect:clear,access:{prepare:async()=>({ok:true,value:{fresh:()=>({ok:true,value:null})}})}});
  let store=repository();stores.push(store);let s=unwrap(await store.create(initial));const frozen=JSON.stringify(s.items);
  for(let index=0;index<s.items.length;index++){
   s=unwrap(await store.execute(s.id,s.revision,{kind:'navigate',index}));const q=s.items[index].question;
   for(let hint=0;hint<3;hint++){s=unwrap(await store.execute(s.id,s.revision,{kind:'revealNextHint',questionId:q.id}));expect(unwrap(await store.read(s.id))).toEqual(s);}
   s=unwrap(await store.execute(s.id,s.revision,{kind:'select',questionId:q.id,ids:q.correctOptionIds}));
   s=unwrap(await store.execute(s.id,s.revision,{kind:'commit',questionId:q.id,commandId:crypto.randomUUID()}));
   store.close();store=repository();stores.push(store);expect(unwrap(await store.read(s.id))).toEqual(s);
  }
  s=unwrap(await store.execute(s.id,s.revision,{kind:'finish',commandId:crypto.randomUUID()}));expect(JSON.stringify(s.items)).toBe(frozen);expect(unwrap(await store.read(s.id))).toEqual(s);expect(learningSummary(unwrap(await validateGuidedSession(s,f.catalog))).correct).toBe(size);
  expect(isValidTransition(s,{...s,guideVersion:version==='1.0.0'?'1.1.0':'1.0.0'})).toBe(false);
 });
 it('V09/V10/V19: missing authorization, changed version/q1/prose and compatible rollback are non-mutating',async()=>{
  const s=unwrap(await standalone('1.0.0')),bytes=JSON.stringify(s);
  expect((await validateGuidedSession(s,f.catalog)).ok).toBe(true);
  expect((await validateGuidedSession(s,[f.catalog[1]])).ok).toBe(false);
  const altered=structuredClone(s);altered.guideVersion='1.1.0';expect(await validateGuidedSession(altered,f.catalog)).toEqual({ok:false,code:'digest-mismatch'});
  const item=structuredClone(s.items[0]);item.question.stemMarkdown+=' tamper';expect(await validateFrozenItem(item,s.source,s.guideVersion,f.catalog)).toEqual({ok:false,code:'fingerprint-mismatch'});
  expect((await validateGuidedSession(s,[...f.catalog].reverse())).ok).toBe(true);expect((await validateGuidedSession(unwrap(full),[])).ok).toBe(false);expect(JSON.stringify(s)).toBe(bytes);
  expect(catalogRelease({...s.source,difficulty:'advanced'},'1.0.0',f.catalog).ok).toBe(false);
 });
 it.each([[false,false],[true,false],[false,true],[true,true]])('V11: old revoked=%s/current revoked=%s keeps exact lineage',async(oldRevoked,newRevoked)=>{
  const c=structuredClone(f.catalog);if(oldRevoked)c[0].revokedDigests.push(c[0].approvedEntries.Q4);if(newRevoked)c[1].revokedDigests.push(c[1].approvedEntries.Q4);
  const old=unwrap(await standalone('1.0.0')),current=unwrap(await standalone('1.1.0'));
  expect((await validateGuidedSession(old,c)).ok).toBe(!oldRevoked);expect((await validateGuidedSession(current,c)).ok).toBe(!newRevoked);
  expect((await validatePublishedRelease(f.release,c)).ok).toBe(true);
 });
 it('V12/V13: exclusions, final overlaps, insufficient sizes and unaffected frozen sessions',async()=>{
  const c=structuredClone(f.catalog);c[1].revokedDigests.push(c[1].approvedEntries.Q4);
  const coverage=unwrap(await resolveEligibility({kind:'standalone',bank:f.bank,difficulty:'intermediate'},f.release,c));expect(coverage.items).toHaveLength(59);expect(coverage.excluded).toEqual([{questionId:'Q4',reason:'revoked'}]);
  for(const size of [5,10] as const){const sets=unwrap(practiceSets(coverage,size));expect(sets.at(-1)?.repeatedCount).toBe(1);expect(unwrap(selectPracticeSet(coverage,size,sets.length-1))).toHaveLength(size);}
  const safe=unwrap(await standalone('1.1.0',5,1));expect((await validateGuidedSession(safe,c)).ok).toBe(true);
  for(const count of [4,9]){const many=structuredClone(f.catalog);many[1].revokedDigests=f.release.questions.slice(count).map(q=>many[1].approvedEntries[q.questionId]);const reduced=unwrap(await resolveEligibility({kind:'standalone',bank:f.bank,difficulty:'intermediate'},f.release,many));expect(practiceSets(reduced,10).ok).toBe(false);expect(practiceSets(reduced,5).ok).toBe(count>=5);}
 });
 it('V15: corrupt/unsupported/revoked stored data survives unsuccessful reads',async()=>{
  const s=unwrap(await standalone('1.1.0')),name='phase7-damaged-'+crypto.randomUUID(),store=createGuidedRepository({catalog:[],databaseName:name,protect:clear});stores.push(store);
  const db=await openDB(name,1,{upgrade(db){db.createObjectStore('sessions',{keyPath:'id'});}});await db.put('sessions',s);expect((await store.read(s.id)).ok).toBe(false);expect(await db.get('sessions',s.id)).toEqual(s);db.close();
 });
 it('V16/V17: exact frozen-report cohorts and unchanged report hash/PDF data',async()=>{
  const attempt=createAttempt(f.bank,now-1000,'phase7-frozen-report');attempt.answers.Q1=f.bank.questions[0].correctOptionIds;attempt.flags=['Q4','Q26'];
  const report=submitAttempt(attempt,now),before=JSON.stringify(report),pdf=buildResultReport(report),digest=await reportHash(report);
  for(const [filter,count]of [['all',60],['flagged',2],['incorrect-unanswered',59]] as const){const s=unwrap(await startSession({kind:'post-exam',report,filter,access:{kind:'guest-device'},id:crypto.randomUUID(),now},f.release,f.catalog));expect(s.items).toHaveLength(count);expect(Object.values(s.responses).every(r=>!r.commitment&&r.maxHintRevealed===0&&r.selectedOptionIds.length===0)).toBe(true);}
  expect(JSON.stringify(report)).toBe(before);expect(await reportHash(report)).toBe(digest);expect(buildResultReport(report)).toEqual(pdf);expect(Buffer.byteLength(JSON.stringify(unwrap(full)))).toBeLessThan(LIMITS.sessionBytes);
 });
 it('V21: missing, corrupted, HTML and cancelled content never becomes approved or cached',async()=>{
  for(const response of [new Response('',{status:404}),new Response('<html>no guide</html>'),new Response('{broken')]){const loader=createGuidedLoader(async()=>response,f.catalog,'/');expect((await loader(f.release.source,'1.1.0',f.bank)).status).toBe('error');}
  const controller=new AbortController();controller.abort();const loader=createGuidedLoader(async()=>new Response(f.assets['intermediate-1.1.0.json']),f.catalog,'/');expect(await loader(f.release.source,'1.1.0',f.bank,{signal:controller.signal})).toEqual({status:'error',reason:'cancelled'});
  const draft=structuredClone(f.release) as any;draft.questions[0].approval.status='draft';expect(guideReleaseSchema.safeParse(draft).success).toBe(false);
 });
 it('V18: actual production runtime uses array order for starts and exact-source post-exam selection',async()=>{
  try{for(const reversed of [false,true]){
   const rows=reversed?[...f.catalog].reverse():f.catalog;
   vi.resetModules();vi.doMock('../src/domain/guided/catalog',async original=>({...await original<typeof import('../src/domain/guided/catalog')>(),productionCatalog:rows}));
   vi.stubGlobal('fetch',async(input:string|URL|Request)=>new Response(String(input).includes('easy-question-bank')?JSON.stringify(f.bank):String(input).includes('1.0.0')?f.assets['intermediate-1.0.0.json']:f.assets['intermediate-1.1.0.json']));
   const runtime=await import('../src/domain/guided/runtime'),version=reversed?'1.0.0':'1.1.0';
   const started=unwrap(await runtime.loadPracticeSource(new AbortController().signal));expect(started.release.guideVersion).toBe(version);
   const report=submitAttempt(createAttempt(f.bank,now-1000,'phase7-order-report'),now);
   const reviewed=unwrap(await runtime.loadReviewSource(report,'all',new AbortController().signal));expect(reviewed.release.guideVersion).toBe(version);expect(reviewed.coverage.items).toHaveLength(reversed?10:60);
  }}finally{vi.doUnmock('../src/domain/guided/catalog');vi.unstubAllGlobals();vi.resetModules();}
 });
 it.each(['missing-pilot-approval','missing-expansion-approval','forged-g1','changed-review-id'])('V01 candidate builder refuses %s without writing any artifact',async kind=>{
  const original=fs.readFileSync.bind(fs);
  const spy=vi.spyOn(fs,'readFileSync').mockImplementation(((file:any,...args:any[])=>{
   if(String(file).replaceAll('\\','/').endsWith('/docs/guided-practice/PHASE-7-CONTENT-LEDGER.md')){
    const text=original(file,'utf8'),match=text.match(/^```json\r?\n([\s\S]*?)\r?\n```/m)!,ledger=JSON.parse(match[1]);
    if(kind==='missing-pilot-approval')ledger.pilotVersion110OwnerAuthorization.status='pending';
    else if(kind==='missing-expansion-approval')ledger.records[0].finalOwnerApproval=null;
    else if(kind==='forged-g1')ledger.records[0].finalOwnerApproval.prospectiveG1='sha256:g1:'+'0'.repeat(64);
    else ledger.records[0].finalOwnerApproval.reviewId+='-changed';
    const modified=text.replace(match[1],JSON.stringify(ledger));return args[0]==='utf8'?modified:Buffer.from(modified);
   }
   return (original as any)(file,...args);
  }) as any);
  try{await expect(prepareCandidate(process.cwd())).rejects.toThrow('Phase 7 candidate refused');}finally{spy.mockRestore();}
  expect(writeCandidate(process.cwd(),f)).toContain('candidate');
 });
});
