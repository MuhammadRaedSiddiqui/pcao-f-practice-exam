import { afterEach, describe, it, expect, vi } from 'vitest';
import { scanMockInventory, withGuidedProtection } from '../src/domain/guided/browserProtection';
import { createAttempt, submitAttempt } from '../src/domain/attemptModel';
import { syntheticSession, unwrap } from './fixtures/syntheticGuidance';
import { browserSourceAccess } from '../src/domain/guided/access';
import { startSession } from '../src/domain/guided/session';

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); vi.restoreAllMocks(); });
function inventory(values: Record<string, string>) {
  return { get length() { return Object.keys(values).length; }, key: (i: number) => Object.keys(values)[i] ?? null,
    getItem: (key: string) => values[key] ?? null };
}
describe('Browser protection and non-destructive recovery', () => {
  it('blocks an orphaned private live Mock; verified expiry permits standalone without any write', async () => {
    const f = await syntheticSession(); const now = Date.now(); const attempt = createAttempt(f.bank, now, 'orphan');
    const values = { ['pcao-f:attempt:v1:orphan']: JSON.stringify(attempt), ['pcao-f:attempt-owner:v1:orphan']: '{"private":true}' };
    const before = JSON.stringify(values);
    expect(scanMockInventory(inventory(values)).status).toBe('blocked');
    expect(scanMockInventory(inventory(values), now, attempt.deadlineAt).status).toBe('clear');
    expect(JSON.stringify(values)).toBe(before);
  });
  it('distinguishes malformed/stale index from damaged record, rechecks full inventory after Retry', async () => {
    const values: Record<string, string> = { 'pcao-f:attempt-ids:v1': '{' };
    expect(scanMockInventory(inventory(values))).toEqual({ status: 'clear', warnings: ['malformed-index'] });
    values['pcao-f:attempt:v1:bad'] = '{';
    expect(scanMockInventory(inventory(values))).toEqual({ status: 'recovery-required', reason: 'corrupt-record', retry: true });
    expect(values['pcao-f:attempt:v1:bad']).toBe('{');
    const f = await syntheticSession(); values['pcao-f:attempt:v1:bad'] = JSON.stringify(createAttempt(f.bank, Date.now(), 'bad'));
    expect(scanMockInventory(inventory(values)).status).toBe('blocked');
  });
  it('fails closed on incomplete enumeration and storage denial', () => {
    expect(scanMockInventory({ length: 1, key: () => null, getItem: () => null })).toMatchObject({ status: 'recovery-required', reason: 'incomplete-inventory' });
    expect(scanMockInventory({ get length(): number { throw new Error(); }, key: () => null, getItem: () => null })).toMatchObject({ status: 'recovery-required', reason: 'storage-unavailable' });
  });
  it('rejects an oversized index before enumeration or parsing and stops at the total inventory byte limit', () => {
    const key = vi.fn(() => null);
    expect(scanMockInventory({ length: 1, key, getItem: () => 'x'.repeat(4 * 1024 * 1024 + 1) })).toMatchObject({ status: 'recovery-required', reason: 'resource-limit' });
    expect(key).not.toHaveBeenCalled();
    const values = Object.fromEntries(Array.from({ length: 8 }, (_, i) => ['pcao-f:attempt:v1:' + i, ' '.repeat(4 * 1024 * 1024)]));
    const storage = inventory(values); const read = vi.fn(storage.getItem);
    expect(scanMockInventory({ ...storage, getItem: read })).toMatchObject({ status: 'recovery-required', reason: 'resource-limit' });
    expect(read).toHaveBeenCalledTimes(6); // index plus five records; remaining records are never allocated.
  });
  it('checks elapsed time during enumeration instead of completing a late inventory', () => {
    let now = Date.now(); const startedAt = now;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    const key = vi.fn(() => { now += 5000; return 'unrelated'; });
    expect(scanMockInventory({ length: 2, key, getItem: () => null }, startedAt, startedAt)).toMatchObject({ status: 'recovery-required', reason: 'checking-timeout' });
    expect(key).toHaveBeenCalledOnce();
  });
  it('bounds lock waiting and never runs a queued late reveal after timeout', async () => {
    vi.useFakeTimers(); let action: (() => unknown) | undefined;
    vi.stubGlobal('navigator', { locks: { request: (_name: string, _options: object, callback: () => unknown) => { action = callback; return new Promise(() => {}); } } });
    const reveal = vi.fn(); const result = withGuidedProtection(reveal, () => inventory({}));
    await vi.advanceTimersByTimeAsync(5000);
    expect(await result).toMatchObject({ gate: { status: 'recovery-required', reason: 'checking-timeout' } });
    await action?.(); expect(reveal).not.toHaveBeenCalled();
  });
  it('uses the existing shared lock and fails closed if coordination is unsupported', async () => {
    const request = vi.fn(async (_name: string, _options: object, callback: () => unknown) => callback());
    vi.stubGlobal('navigator', { locks: { request } });
    expect((await withGuidedProtection(() => 'saved', () => inventory({}))).value).toBe('saved');
    expect(request.mock.calls[0][0]).toBe('pcao-f:attempt-storage:v1');
    vi.stubGlobal('navigator', {});
    expect((await withGuidedProtection(() => 'unsafe')).gate.status).toBe('unsupported');
  });
  it('keeps Guided quota failures distinct from Mock inventory failures', async () => {
    vi.stubGlobal('navigator', { locks: { request: async (_name: string, _options: object, callback: () => unknown) => callback() } });
    await expect(withGuidedProtection(() => { throw new DOMException('Synthetic quota', 'QuotaExceededError'); }, () => inventory({})))
      .rejects.toMatchObject({ name: 'QuotaExceededError' });
  });
});

describe('Fresh source authorization', () => {
  it('requires submitted original hash and current owner, then rejects owner loss or deleted source', async () => {
    const f = await syntheticSession(); const ownerId = '33333333-3333-4333-8333-333333333333';
    const report = submitAttempt(createAttempt(f.bank, Date.now(), 'private-report'), Date.now() + 1);
    const s = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'account', ownerId }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    let owner: string | null = ownerId;
    const values = { ['pcao-f:attempt:v1:' + report.id]: JSON.stringify(report), ['pcao-f:attempt-owner:v1:' + report.id]: JSON.stringify({ userId: ownerId, state: 'eligible', createdAt: Date.now() }) };
    const access = browserSourceAccess(() => owner, () => inventory(values));
    const proof = unwrap(await access.prepare(s)); expect(proof.fresh().ok).toBe(true);
    owner = null; expect(proof.fresh()).toEqual({ ok: false, code: 'private-source' });
    owner = ownerId; values['pcao-f:attempt-owner:v1:' + report.id] = JSON.stringify({ userId: ownerId, state: 'deleted', createdAt: Date.now() });
    expect(proof.fresh()).toEqual({ ok: false, code: 'private-source' });
    values['pcao-f:attempt:v1:' + report.id] += ' ';
    expect(proof.fresh()).toEqual({ ok: false, code: 'private-source' });
  });
  it('binds signup claim only to the same report hash without changing original bytes', async () => {
    const f = await syntheticSession(); const report = submitAttempt(createAttempt(f.bank, Date.now(), 'guest-report'), Date.now() + 1);
    const s = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'guest-device' }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    const ownerId = '33333333-3333-4333-8333-333333333333';
    const raw = JSON.stringify(report);
    const values: Record<string, string> = { ['pcao-f:attempt:v1:' + report.id]: raw };
    const access = browserSourceAccess(() => ownerId, () => inventory(values));
    const proof = unwrap(await access.prepare(s)); expect(unwrap(proof.fresh())).toEqual({ kind: 'guest-device' });
    values['pcao-f:attempt-owner:v1:' + report.id] = JSON.stringify({ userId: ownerId, state: 'eligible', createdAt: Date.now() });
    expect(unwrap(proof.fresh())).toEqual({ kind: 'account', ownerId });
    expect(values['pcao-f:attempt:v1:' + report.id]).toBe(raw);
  });
});
