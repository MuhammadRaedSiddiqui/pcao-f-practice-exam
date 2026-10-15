// Explicitly synthetic Supabase HTTP boundary. Never loaded by runtime source.
import type { BrowserContext, Route } from '@playwright/test';
import { answerQuestion, createAttempt, gradeAttempt, submitAttempt, type Attempt } from '../../src/domain/attempt';
import { reportHash, type CloudReport } from '../../src/domain/cloudReports';
import { syntheticBank } from './syntheticBank';
export const userA='00000000-0000-4000-8000-000000000001';
export const userB='00000000-0000-4000-8000-000000000002';
const user=(id:string,email:string)=>({id,email,aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString(),identities:[]});
export function completedFixture(id='synthetic-account-report') {
  const bank=syntheticBank();bank.contentStatus='reviewed';
  const now=Date.now();return submitAttempt(answerQuestion(createAttempt(bank,now-60000,id,'intermediate'),'T1',['A','C'],now-50000),now-30000);
}
function token(id:string,email:string) {
  return Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({sub:id,email,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+3600,iat:Math.floor(Date.now()/1000)})).toString('base64url')+'.synthetic';
}
export function authFixture(email: string, id = crypto.randomUUID()) {
  return { access_token: token(id, email), refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_in: 3600, user: user(id, email) };
}
export async function cloudRow(owner:string,attempt:Attempt):Promise<CloudReport & {payload:Attempt|null}> {
  const score=gradeAttempt(attempt);
  if(score.total!==60)throw new Error('The synthetic cloud fixture must contain 60 questions.');
  return {report_id:crypto.randomUUID(),user_id:owner,attempt_id:attempt.id,payload_hash:await reportHash(attempt),hash_version:1,payload_schema_version:1,
    uploaded_at:new Date().toISOString(),deleted_at:null,started_at:attempt.startedAt,submitted_at:attempt.submittedAt!,
    difficulty:attempt.difficulty??null,dataset_version:attempt.datasetVersion,title:attempt.snapshot.title,exam_id:attempt.snapshot.examId,
    submission_reason:attempt.submissionReason!,correct_count:score.correct,total_count:score.total,
    practice_score:Math.round(score.correct*1000/score.total),practice_passed:score.correct*1000>=720*score.total,payload:attempt};
}
export function mockAccountServer() {
  const rows:Array<CloudReport & {payload:Attempt|null}>=[];
  const preferences=new Map<string,boolean>();
  const users=new Map<string,ReturnType<typeof user>>([['alice@example.test',user(userA,'alice@example.test')],['bob@example.test',user(userB,'bob@example.test')]]);
  const requests:string[]=[];let failBackups=0;let backupDelay=0;let lostResponses=0;
  const handler=async(route:Route)=>{
    const request=route.request();const url=new URL(request.url());requests.push(url.pathname);
    const headers=request.headers();const authorization=headers.authorization;
    let owner:string|undefined;
    try { owner=JSON.parse(Buffer.from(authorization!.split('.')[1],'base64url').toString()).sub; } catch {}
    const respond=(body:unknown,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    if(url.pathname.endsWith('/signup')||url.pathname.endsWith('/token')) {
      const body=request.postDataJSON();
      if(body.password!=='synthetic-password') return respond({error:'invalid_grant',error_description:'Invalid credentials'},400);
      if(!users.has(body.email)) users.set(body.email,user(crypto.randomUUID(),body.email));
      const selected=users.get(body.email)!;
      return respond({access_token:token(selected.id,selected.email),refresh_token:'synthetic-refresh',token_type:'bearer',expires_in:3600,user:selected});
    }
    if(url.pathname.endsWith('/logout')) return respond({});
    if(url.pathname.endsWith('/recover')) return respond({});
    if(url.pathname.endsWith('/user')) return respond([...users.values()].find(item=>item.id===owner)??{message:'no user'},owner?200:401);
    if(!owner) return respond({message:'Unauthenticated'},401);
    if(url.pathname.includes('account_preferences')) {
      if(request.method()==='POST') { const body=request.postDataJSON();if(body.user_id!==owner)return respond({},403);preferences.set(owner,body.automatic_backup_enabled);return respond({}); }
      return respond([{automatic_backup_enabled:preferences.get(owner)??false}]);
    }
    if(url.pathname.includes('/rest/v1/attempt_reports')) {
      let selected=rows.filter(row=>row.user_id===owner);
      const id=url.searchParams.get('attempt_id')?.slice(3);if(id)selected=selected.filter(row=>row.attempt_id===id);
      const reportId=url.searchParams.get('report_id')?.slice(3);if(reportId)selected=selected.filter(row=>row.report_id===reportId);
      if(url.searchParams.get('deleted_at')==='is.null')selected=selected.filter(row=>!row.deleted_at);
      selected.sort((a,b)=>(b.submitted_at??0)-(a.submitted_at??0)||b.report_id.localeCompare(a.report_id));
      const cursor=url.searchParams.get('or');
      if(cursor) { const match=cursor.match(/submitted_at\.lt\.(\d+),and\(submitted_at\.eq\.\d+,report_id\.lt\.([a-f0-9-]+)/);if(match)selected=selected.filter(row=>row.submitted_at!<Number(match[1])||(row.submitted_at===Number(match[1])&&row.report_id<match[2])); }
      selected=selected.slice(0,Number(url.searchParams.get('limit')??1000));
      if(!url.searchParams.get('select')?.split(',').includes('payload'))selected=selected.map(({payload:_payload,...row})=>row as typeof selected[number]);
      return respond(headers.accept?.includes('vnd.pgrst.object')?selected[0]??null:selected);
    }
    if(url.pathname.endsWith('/backup-report')) {
      if(backupDelay)await new Promise(resolve=>setTimeout(resolve,backupDelay));
      if(failBackups>0) {failBackups-=1;return respond({code:'temporary',message:'Synthetic retryable failure'},503);}
      const attempt=request.postDataJSON().attempt as Attempt;
      const hash=await reportHash(attempt);const existing=rows.find(row=>row.user_id===owner&&row.attempt_id===attempt.id);
      if(existing?.deleted_at)return respond({code:'deleted',message:'Removed'},409);
      if(existing&&existing.payload_hash!==hash)return respond({code:'conflict',message:'Conflict'},409);
      const saved=existing??await cloudRow(owner,attempt);if(!existing)rows.push(saved);
      if(lostResponses>0){lostResponses-=1;return respond({code:'temporary',message:'Synthetic lost acknowledgement'},503);}
      return respond({status:existing?'already-backed-up':'created',reportId:saved.report_id,hash});
    }
    if(url.pathname.endsWith('/delete-report')) {
      const selected=rows.find(row=>row.user_id===owner&&row.attempt_id===request.postDataJSON().attemptId);
      if(selected)Object.assign(selected,{deleted_at:new Date().toISOString(),payload:null,exam_id:null,dataset_version:null,difficulty:null,title:null,started_at:null,submitted_at:null,submission_reason:null,correct_count:null,total_count:null,practice_score:null,practice_passed:null});
      return respond({ok:true});
    }
    if(url.pathname.endsWith('/delete-account')) {
      if(request.postDataJSON().password!=='synthetic-password')return respond({code:'auth',message:'Incorrect current password'},401);
      for(let i=rows.length-1;i>=0;i--)if(rows[i].user_id===owner)rows.splice(i,1);
      return respond({ok:true});
    }
    return respond({message:'Unimplemented synthetic request'},404);
  };
  return {rows,preferences,requests,attach:async(context:BrowserContext)=>context.route('https://supabase.synthetic.test/**',handler),
    failNextBackups:(count:number)=>{failBackups=count;},delayBackups:(ms:number)=>{backupDelay=ms;},loseResponses:(count:number)=>{lostResponses=count;}};
}
