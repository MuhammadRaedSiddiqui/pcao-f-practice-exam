import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';

const a='00000000-0000-4000-8000-000000000001';
const b='00000000-0000-4000-8000-000000000002';
let db:PGlite;
const row=(id:string,hash='a'.repeat(64))=>({attempt_id:id,payload:{synthetic:true},payload_hash:hash,
  exam_id:'synthetic',dataset_version:'test',difficulty:null,title:'Synthetic report',started_at:1000,submitted_at:2000,
  submission_reason:'manual',correct_count:0,total_count:60,practice_score:0,practice_passed:false});
async function backup(user:string,id:string,hash?:string) {
  const result=await db.query<{result:{status:string;reportId:string}}>('select public.archive_backup($1,$2::jsonb) as result',[user,JSON.stringify(row(id,hash))]);
  return result.rows[0].result;
}
describe('archive SQL migration in PostgreSQL (PGlite)',()=>{
  beforeAll(async()=>{
    db=new PGlite();
    await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
      create schema auth;create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as 'select nullif(current_setting(''request.jwt.claim.sub'',true),'''')::uuid';
      grant usage on schema public,auth to anon,authenticated,service_role;
      grant execute on function auth.uid() to anon,authenticated,service_role;
      insert into auth.users values ('${a}'),('${b}');`);
    await db.exec(await readFile(new URL('../supabase/migrations/202610140001_account_history.sql',import.meta.url),'utf8'));
  },30000);
  afterAll(async()=>{await db.close();});
  it('creates one immutable row for repeated uploads and rejects conflicting content',async()=>{
    const first=await backup(a,'idempotent');
    expect(first.status).toBe('created');
    expect((await backup(a,'idempotent')).reportId).toBe(first.reportId);
    await expect(backup(a,'idempotent','b'.repeat(64))).rejects.toThrow('ARCHIVE_CONFLICT');
    await expect(db.exec(`update public.attempt_reports set title='modified' where attempt_id='idempotent'`)).rejects.toThrow('ARCHIVE_IMMUTABLE');
  });
  it('allows account-owned reads but hides other account data',async()=>{
    await backup(b,'private-b');
    await db.exec(`set role authenticated;set request.jwt.claim.sub='${a}'`);
    const result=await db.query<{user_id:string}>('select user_id from public.attempt_reports');
    expect(result.rows.length).toBe(1);expect(result.rows.every(item=>item.user_id===a)).toBe(true);
    await db.exec('reset role');
  });
  it('denies anonymous reads, browser writes and privileged RPC execution',async()=>{
    await db.exec('set role anon');
    await expect(db.query('select * from public.attempt_reports')).rejects.toThrow();
    await db.exec('reset role;set role authenticated');
    await expect(db.query('delete from public.attempt_reports')).rejects.toThrow();
    await expect(backup(a,'forged-write')).rejects.toThrow();
    await db.exec('reset role');
  });
  it('allows only owner-scoped preferences',async()=>{
    await db.exec(`set role authenticated;set request.jwt.claim.sub='${a}'`);
    await db.query('insert into public.account_preferences(user_id,automatic_backup_enabled) values($1,true)',[a]);
    await expect(db.query('insert into public.account_preferences(user_id) values($1)',[b])).rejects.toThrow();
    await db.exec('reset role');
  });
  it('deletes only the requested owner and prevents resurrection',async()=>{
    await backup(a,'deletion');await backup(b,'deletion');
    await db.query('select public.archive_delete($1,$2)',[a,'deletion']);
    await expect(backup(a,'deletion')).rejects.toThrow('ARCHIVE_DELETED');
    const result=await db.query<{user_id:string;payload:unknown}>('select user_id,payload from public.attempt_reports where attempt_id=$1 and deleted_at is null',['deletion']);
    expect(result.rows).toHaveLength(1);expect(result.rows[0].user_id).toBe(b);
  });
  it('checks quotas atomically while allowing already-stored retries',async()=>{
    await db.exec('update public.archive_limits set max_reports=1');
    await expect(backup(a,'over-quota')).rejects.toThrow('ARCHIVE_QUOTA');
    expect((await backup(a,'idempotent')).status).toBe('already-backed-up');
    await db.exec('update public.archive_limits set max_reports=1000');
  });
  it('cascades preference, report and rate data on account deletion',async()=>{
    await db.query('delete from auth.users where id=$1',[a]);
    for(const table of ['account_preferences','attempt_reports','archive_rates']) {
      const result=await db.query<{count:number}>('select count(*)::integer as count from public.'+table+' where user_id=$1',[a]);
      expect(result.rows[0].count).toBe(0);
    }
    expect((await db.query('select * from public.attempt_reports where user_id=$1',[b])).rows.length).toBeGreaterThan(0);
  });
});
