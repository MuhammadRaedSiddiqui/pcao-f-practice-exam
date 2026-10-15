import { describe, expect, it } from 'vitest';
import { createAttempt, parseAttempt, submitAttempt } from '../src/domain/attempt';
import { completedReport, parseCloudMetadata, reportHash, validateCloudPayload } from '../src/domain/cloudReports';
import { claimAttempt, pauseAttempt, markDeleted, readOwnership, removeDeviceReport, visibleTo } from '../src/domain/archiveStorage';
import { saveAttempt, recoverAttempt } from '../src/domain/attempt';
import { syntheticBank } from './fixtures/syntheticBank';

const userA = '00000000-0000-4000-8000-000000000001';
const userB = '00000000-0000-4000-8000-000000000002';
function report() { const bank = syntheticBank(); bank.contentStatus = 'reviewed'; return submitAttempt(createAttempt(bank,1000,'cloud-fixture','intermediate'),2000); }
function storage() { const entries = new Map<string,string>(); return { entries, getItem:(key:string)=>entries.get(key)??null,setItem:(key:string,value:string)=>{entries.set(key,value);},removeItem:(key:string)=>{entries.delete(key);} }; }
async function metadata() {
  const attempt=report();
  return { report_id:'00000000-0000-4000-8000-000000000003',user_id:userA,attempt_id:attempt.id,payload_hash:await reportHash(attempt),
    hash_version:1,payload_schema_version:1,uploaded_at:new Date(3000).toISOString(),deleted_at:null,
    submitted_at:2000,started_at:1000,difficulty:'intermediate',dataset_version:attempt.datasetVersion,title:attempt.snapshot.title,
    exam_id:attempt.snapshot.examId,submission_reason:'manual',correct_count:0,total_count:60,practice_score:0,practice_passed:false };
}
describe('cloud report contracts and device ownership',()=>{
  it('uses the recovery validator without accepting damaged or active reports',()=>{
    const attempt=report(); expect(parseAttempt(attempt)?.id).toBe(attempt.id);
    expect(()=>completedReport({...attempt,status:'in-progress'})).toThrow();
    expect(()=>completedReport({...attempt,result:{...attempt.result,correct:60}})).toThrow();
    expect(()=>completedReport({...attempt,deadlineAt:0})).toThrow();
  });
  it('normalizes legacy grades and local bookkeeping without changing snapshot ordering',async()=>{
    const attempt=report(); const {result:_grade,revision:_revision,...legacy}=attempt;
    expect(await reportHash(legacy)).toBe(await reportHash(attempt));
    expect(await reportHash({...attempt,revision:999,currentQuestionId:attempt.snapshot.questions[1].id})).toBe(await reportHash(attempt));
    const changed=structuredClone(attempt); changed.snapshot.questions[0].options.reverse();
    expect(await reportHash(changed)).not.toBe(await reportHash(attempt));
  });
  it('detects changed selections or reviewed content',async()=>{
    const attempt=report();
    const edited=structuredClone(attempt); edited.snapshot.questions[0].stemMarkdown='Different synthetic content';
    expect(await reportHash(edited)).not.toBe(await reportHash(attempt));
  });
  it('checks payload ownership, hash and metadata before opening a report',async()=>{
    const row=parseCloudMetadata(await metadata());
    expect((await validateCloudPayload(row,report(),userA)).id).toBe(report().id);
    await expect(validateCloudPayload(row,report(),userB)).rejects.toThrow();
    await expect(validateCloudPayload({...row,payload_hash:'a'.repeat(64)},report(),userA)).rejects.toThrow();
    await expect(validateCloudPayload({...row,difficulty:'advanced'},report(),userA)).rejects.toThrow();
    expect(()=>parseCloudMetadata({...row,practice_score:1000})).toThrow();
    expect(()=>parseCloudMetadata({...row,started_at:1e30,submitted_at:1e30})).toThrow();
    expect(()=>parseCloudMetadata({...row,total_count:25})).toThrow();
  });
  it('claims once, keeps original payload bytes and filters other accounts and guests',()=>{
    const store=storage(); const attempt=report(); saveAttempt(store,attempt);
    const bytes=store.getItem('pcao-f:attempt:v1:'+attempt.id);
    claimAttempt(store,attempt.id,userA); claimAttempt(store,attempt.id,userA);
    expect(store.getItem('pcao-f:attempt:v1:'+attempt.id)).toBe(bytes);
    expect(visibleTo(store,attempt.id,userA)).toBe(true);
    expect(visibleTo(store,attempt.id,userB)).toBe(false);
    expect(visibleTo(store,attempt.id,null)).toBe(false);
    expect(()=>claimAttempt(store,attempt.id,userB)).toThrow();
  });
  it('fails closed for damaged ownership and never recreates a deleted binding',()=>{
    const store=storage(); claimAttempt(store,'report',userA); markDeleted(store,'report',userA);
    expect(()=>claimAttempt(store,'report',userA)).toThrow();
    store.setItem('pcao-f:attempt-owner:v1:report','broken');
    expect(visibleTo(store,'report',userA)).toBe(false); expect(()=>readOwnership(store,'report')).toThrow();
  });
  it('persists pause independently of the archive cache and resumes only through an explicit claim',()=>{
    const store=storage(); claimAttempt(store,'paused',userA); pauseAttempt(store,'paused',userA);
    expect(readOwnership(store,'paused')?.state).toBe('paused');
    expect(()=>claimAttempt(store,'paused',userB)).toThrow();
    claimAttempt(store,'paused',userA); expect(readOwnership(store,'paused')?.state).toBe('eligible');
  });
  it('removes only an owned submitted device record and preserves other history',()=>{
    const store=storage(); const attempt=report(); saveAttempt(store,attempt); claimAttempt(store,attempt.id,userA);
    expect(()=>removeDeviceReport(store,attempt.id,userB)).toThrow();
    removeDeviceReport(store,attempt.id,userA);
    expect(recoverAttempt(store,attempt.id)).toEqual({ok:true,attempt:null});
    expect(store.getItem('pcao-f:attempt-ids:v1')).toBe('[]');
    expect(readOwnership(store,attempt.id)?.userId).toBe(userA);
  });
  it('restores device history if deletion fails after index writing',()=>{
    const store=storage(); const attempt=report(); saveAttempt(store,attempt); claimAttempt(store,attempt.id,userA);
    const original=store.getItem('pcao-f:attempt-ids:v1');
    expect(()=>removeDeviceReport({...store,removeItem:()=>{throw Error('Synthetic storage failure');}},attempt.id,userA)).toThrow();
    expect(store.getItem('pcao-f:attempt-ids:v1')).toBe(original);
    expect(recoverAttempt(store,attempt.id).ok).toBe(true);
  });
});
