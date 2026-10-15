import { describe, expect, it, vi } from 'vitest';
import { createArchiveHandler, type Backend } from '../supabase/functions/_shared/handlers';
import { ArchiveError } from '../src/domain/cloudReports';
import { createAttempt, submitAttempt } from '../src/domain/attempt';
import { syntheticBank } from './fixtures/syntheticBank';

const owner='00000000-0000-4000-8000-000000000001';
function fixture() { const bank=syntheticBank();bank.contentStatus='reviewed';return submitAttempt(createAttempt(bank,1000,'handler-fixture'),2000); }
function backend() {
  return {authenticate:vi.fn(async()=>({id:owner,email:'synthetic@example.test'})),
    backup:vi.fn(async()=>({ok:true})),deleteReport:vi.fn(async()=>{}),deleteAccount:vi.fn(async()=>{})} satisfies Backend;
}
function request(body:unknown,token='test-token',origin='https://practice.example.test') {
  return new Request('https://backend.example.test',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'Origin':origin},body:JSON.stringify(body)});
}
describe('authenticated archive handlers',()=>{
  it('derives identity and scores from the validated report',async()=>{
    const mock=backend(); const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    expect((await handler(request({schemaVersion:1,attempt:fixture()}))).status).toBe(200);
    expect(mock.backup).toHaveBeenCalledWith(owner,expect.objectContaining({correct_count:0,total_count:60,practice_score:0,practice_passed:false,payload_hash:expect.stringMatching(/^[a-f0-9]{64}$/)}));
  });
  it('rejects forged owners in envelopes',async()=>{
    const mock=backend();const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    expect((await handler(request({schemaVersion:1,attempt:fixture(),userId:'forged-owner'}))).status).toBe(400);
    expect(mock.backup).not.toHaveBeenCalled();
  });
  it('rejects missing authentication, denied origins and invalid methods',async()=>{
    const mock=backend();const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    expect((await handler(new Request('https://backend.example.test',{method:'POST'}))).status).toBe(401);
    expect((await handler(request({},'test','https://hostile.example.test'))).status).toBe(403);
    expect((await handler(new Request('https://backend.example.test'))).status).toBe(405);
    expect(mock.backup).not.toHaveBeenCalled();
  });
  it('rejects active reports and inconsistent saved grades',async()=>{
    const mock=backend();const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    const damaged={...fixture(),result:{...fixture().result,correct:60}};
    expect((await handler(request({schemaVersion:1,attempt:damaged}))).status).toBe(400);
    expect((await handler(request({schemaVersion:1,attempt:{...fixture(),status:'in-progress'}}))).status).toBe(400);
    expect(mock.backup).not.toHaveBeenCalled();
  });
  it('bounds streamed request size without trusting content-length',async()=>{
    const mock=backend();const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    expect((await handler(request({padding:'x'.repeat(1024*1024)}))).status).toBe(400);
    expect(mock.backup).not.toHaveBeenCalled();
  });
  it('scopes deletion to the authenticated owner and requires a password for account deletion',async()=>{
    const mock=backend();
    const remove=createArchiveHandler('delete-report',mock,['https://practice.example.test']);
    expect((await remove(request({attemptId:'handler-fixture'}))).status).toBe(200);
    expect(mock.deleteReport).toHaveBeenCalledWith(owner,'handler-fixture');
    const account=createArchiveHandler('delete-account',mock,['https://practice.example.test']);
    expect((await account(request({}))).status).toBe(400);
    expect((await account(request({password:'synthetic-password'}))).status).toBe(200);
    expect(mock.deleteAccount).toHaveBeenCalledWith(owner,'synthetic@example.test','synthetic-password');
  });
  it('returns bounded conflict/error messages without exposing backend errors',async()=>{
    const mock=backend();mock.backup.mockRejectedValueOnce(new ArchiveError('Already removed.','deleted')).mockRejectedValueOnce(Error('secret raw DB string'));
    const handler=createArchiveHandler('backup',mock,['https://practice.example.test']);
    expect((await handler(request({schemaVersion:1,attempt:fixture()}))).status).toBe(409);
    const failure=await handler(request({schemaVersion:1,attempt:fixture()}));
    expect(failure.status).toBe(503);expect(await failure.text()).not.toContain('secret');
  });
});
