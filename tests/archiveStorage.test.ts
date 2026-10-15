import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { archiveKey, archiveStore, claimAttempt, claimGuestReports, pauseAttempt, markDeleted, readOwnership } from '../src/domain/archiveStorage';
import { createAttempt, submitAttempt, type AttemptStorage } from '../src/domain/attempt';
import { syntheticBank } from './fixtures/syntheticBank';

describe('account archive store',()=>{
  it('keeps account queues isolated and clears caches without losing pending originals',async()=>{
    const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
    await archiveStore.put({key:archiveKey(a,'same'),userId:a,attemptId:'same',hash:'a',state:'pending',failures:0,nextRetryAt:0});
    await archiveStore.put({key:archiveKey(b,'same'),userId:b,attemptId:'same',hash:'b',state:'pending',failures:0,nextRetryAt:0});
    await archiveStore.cache(a,'same',{synthetic:'A'});await archiveStore.cache(b,'same',{synthetic:'B'});
    expect((await archiveStore.jobs(a))[0].hash).toBe('a');
    await archiveStore.clearOwner(a);
    expect(await archiveStore.copy(a,'same')).toBeUndefined();
    expect((await archiveStore.jobs(a))).toHaveLength(1);
    expect((await archiveStore.copy(b,'same'))?.payload).toEqual({synthetic:'B'});
    await archiveStore.clearOwner(a,true);
    expect((await archiveStore.jobs(a))).toHaveLength(0);
    expect((await archiveStore.jobs(b))).toHaveLength(1);
  });
});

const signupOwner = '00000000-0000-4000-8000-000000000010';
function migrationStorage(ids: string[]) {
  const values = new Map<string, string>();
  const bank = syntheticBank(); bank.contentStatus = 'reviewed';
  for (const id of ids) values.set('pcao-f:attempt:v1:' + id, JSON.stringify(submitAttempt(createAttempt(bank, 1000, id), 2000)));
  values.set('pcao-f:attempt-ids:v1', JSON.stringify(ids));
  const storage: AttemptStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); }, removeItem: key => { values.delete(key); } };
  return { values, storage, bank };
}
describe('signup history migration', () => {
  it('claims completed guest reports while preserving original bytes and excluding active or owned reports', () => {
    const { storage, values, bank } = migrationStorage(['guest', 'owned', 'paused', 'deleted', 'active']);
    values.set('pcao-f:attempt:v1:active', JSON.stringify(createAttempt(bank, 1000, 'active')));
    const other = '00000000-0000-4000-8000-000000000011';
    claimAttempt(storage, 'owned', other);
    claimAttempt(storage, 'paused', signupOwner); pauseAttempt(storage, 'paused', signupOwner);
    markDeleted(storage, 'deleted', signupOwner);
    const original = new Map(values);
    expect(claimGuestReports(storage, signupOwner)).toEqual({ ids: ['guest'], unreadable: 0 });
    expect(readOwnership(storage, 'guest')?.userId).toBe(signupOwner);
    expect(readOwnership(storage, 'active')).toBeNull();
    for (const [key, value] of original) expect(values.get(key)).toBe(value);
    expect(claimGuestReports(storage, signupOwner)).toEqual({ ids: [], unreadable: 0 });
  });
  it('leaves a browser without history empty without writing placeholder records', () => {
    const { storage, values } = migrationStorage([]); const original = new Map(values);
    expect(claimGuestReports(storage, signupOwner)).toEqual({ ids: [], unreadable: 0 });
    expect(values).toEqual(original);
  });
  it('continues with readable reports when a report or its ownership is damaged', () => {
    const { storage, values } = migrationStorage(['valid', 'damaged-report', 'damaged-owner']);
    values.set('pcao-f:attempt:v1:damaged-report', '{broken');
    values.set('pcao-f:attempt-owner:v1:damaged-owner', '{broken');
    expect(claimGuestReports(storage, signupOwner)).toEqual({ ids: ['valid'], unreadable: 2 });
    expect(values.get('pcao-f:attempt-owner:v1:damaged-owner')).toBe('{broken');
  });
  it('preserves reports after an ownership write fails and continues other reports', () => {
    const { storage, values } = migrationStorage(['blocked', 'valid']);
    const original = values.get('pcao-f:attempt:v1:blocked');
    const failing: AttemptStorage = { ...storage, setItem: (key, value) => { if (key.endsWith(':blocked')) throw Error('quota'); storage.setItem(key, value); } };
    expect(claimGuestReports(failing, signupOwner)).toEqual({ ids: ['valid'], unreadable: 1 });
    expect(readOwnership(storage, 'blocked')).toBeNull();
    expect(values.get('pcao-f:attempt:v1:blocked')).toBe(original);
  });
});
