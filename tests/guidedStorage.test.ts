import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { openDB } from 'idb';
import { createGuidedRepository, type GuidedStore } from '../src/domain/guided/storage';
import { syntheticSession, unwrap, commandId, SESSION_ID } from './fixtures/syntheticGuidance';
import { startSession } from '../src/domain/guided/session';
import { syntheticGuidance } from './fixtures/syntheticGuidance';
import { submitAttempt, createAttempt } from '../src/domain/attemptModel';
import type { withGuidedProtection } from '../src/domain/guided/browserProtection';

const clear: typeof withGuidedProtection = async action => ({ gate: { status: 'clear', warnings: [] }, value: await action({ status: 'clear', warnings: [] }) });
const stores: GuidedStore[] = [];
afterEach(() => { stores.splice(0).forEach(s => s.close()); vi.restoreAllMocks(); });
async function fixture(overrides: Parameters<typeof createGuidedRepository>[0] = {}) {
  const f = await syntheticSession();
  const databaseName = 'synthetic-guided-' + crypto.randomUUID();
  const store = createGuidedRepository({ catalog: f.catalog, databaseName, protect: clear,
    access: { prepare: async () => ({ ok: true, value: { fresh: () => ({ ok: true, value: null }) } }) }, ...overrides });
  stores.push(store);
  return { ...f, store, databaseName };
}

describe('Guided durable repository', () => {
  it('acknowledges creation after IDB commit; uses only its own database and frozen subsets', async () => {
    const committed = vi.fn(); const f = await fixture({ onCommit: committed });
    expect((await f.store.create(f.session)).ok).toBe(true);
    const db = await openDB(f.databaseName, 1);
    expect(await db.get('sessions', SESSION_ID)).toEqual(f.session); db.close();
    expect(committed).toHaveBeenCalledWith(SESSION_ID, 0);
    expect((unwrap(await f.store.read(SESSION_ID)))?.items).toHaveLength(5);
  });
  it('rejects duplicate creation and invalid IDs without changing data', async () => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    expect(await f.store.create(f.session)).toEqual({ ok: false, code: 'conflict' });
    expect(await f.store.read('../foreign')).toEqual({ ok: false, code: 'invalid-command' });
    expect(unwrap(await f.store.read(SESSION_ID))?.revision).toBe(0);
  });
  it('persists every command, exact index/draft/hints/first commitment and completion through reopened connections', async () => {
    const f = await fixture(); let s = unwrap(await f.store.create(f.session));
    const run = async (c: Parameters<GuidedStore['execute']>[2]) => { s = unwrap(await f.store.execute(s.id, s.revision, c)); };
    for (let index = 0; index < s.items.length; index++) {
      await run({ kind: 'navigate', index });
      const question = s.items[index].question;
      await run({ kind: 'select', questionId: question.id, ids: question.correctOptionIds });
      await run({ kind: 'revealNextHint', questionId: question.id });
      expect(unwrap(await f.store.read(s.id))).toEqual(s);
      await run({ kind: 'commit', questionId: question.id, commandId: commandId(index) });
    }
    await run({ kind: 'finish', commandId: commandId(10) });
    f.store.close();
    const reopened = createGuidedRepository({ databaseName: f.databaseName, catalog: f.catalog, protect: clear }); stores.push(reopened);
    expect(unwrap(await reopened.read(s.id))).toEqual(s);
    expect(s.status).toBe('completed');
  });
  it('rejects stale alternate changes; recognizes identical commit/finish acknowledgements', async () => {
    const f = await fixture(); let s = unwrap(await f.store.create(f.session));
    s = unwrap(await f.store.execute(s.id, 0, { kind: 'select', questionId: 'T1', ids: ['A', 'C'] }));
    const commit = { kind: 'commit' as const, questionId: 'T1', commandId: commandId(1) };
    s = unwrap(await f.store.execute(s.id, s.revision, commit));
    expect(unwrap(await f.store.execute(s.id, 0, commit))).toEqual(s);
    expect(await f.store.execute(s.id, 0, { kind: 'navigate', index: 1 })).toEqual({ ok: false, code: 'conflict' });
    expect(await f.store.execute(s.id, s.revision, { kind: 'select', questionId: 'T1', ids: ['B'] })).toEqual({ ok: false, code: 'locked' });
    expect(await f.store.execute(s.id, s.revision, { kind: 'commit', questionId: 'T1', commandId: commandId(2) })).toEqual({ ok: false, code: 'locked' });
  });
  it('accepts zero stale overwrites in concurrent writers and never recreates a removed record', async () => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    const results = await Promise.all([0, 1].map(index => f.store.execute(SESSION_ID, 0, { kind: 'navigate', index: index + 1 })));
    expect(results.filter(r => r.ok)).toHaveLength(1);
    expect(results.filter(r => !r.ok && r.code === 'conflict')).toHaveLength(1);
    const saved = unwrap(await f.store.read(SESSION_ID))!;
    unwrap(await f.store.remove(SESSION_ID, saved.revision));
    expect(await f.store.execute(SESSION_ID, saved.revision, { kind: 'navigate', index: 0 })).toEqual({ ok: false, code: 'unavailable' });
  });
  it('requires current revision for explicit guided-only removal', async () => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    expect(await f.store.remove(SESSION_ID, 1)).toEqual({ ok: false, code: 'conflict' });
    unwrap(await f.store.remove(SESSION_ID, 0));
    expect(unwrap(await f.store.read(SESSION_ID))).toBeNull();
  });
  it.each(['quota', 'aborted'] as const)('preserves a draft and reveals nothing on %s failure', async kind => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    const error = new DOMException('Synthetic fault', kind === 'quota' ? 'QuotaExceededError' : 'AbortError');
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementationOnce(() => { throw error; });
    const result = await f.store.execute(SESSION_ID, 0, { kind: 'revealNextHint', questionId: 'T1' });
    expect(result).toEqual({ ok: false, code: kind === 'quota' ? 'quota' : 'unavailable' });
    expect(unwrap(await f.store.read(SESSION_ID))).toEqual(f.session);
  });
  it('reconciles uncertain acknowledgements by rereading persisted command ID', async () => {
    let lost = false;
    const protect: typeof withGuidedProtection = async action => {
      const value = await action({ status: 'clear', warnings: [] });
      return lost ? { gate: { status: 'recovery-required', reason: 'checking-timeout', retry: true } } : { gate: { status: 'clear', warnings: [] }, value };
    };
    const f = await fixture({ protect }); unwrap(await f.store.create(f.session));
    unwrap(await f.store.execute(SESSION_ID, 0, { kind: 'select', questionId: 'T1', ids: ['A', 'C'] }));
    lost = true;
    const command = { kind: 'commit' as const, questionId: 'T1', commandId: commandId(1) };
    expect(await f.store.execute(SESSION_ID, 1, command)).toEqual({ ok: false, code: 'recovery-required' });
    lost = false;
    const reconciled = unwrap(await f.store.read(SESSION_ID))!;
    expect(reconciled.responses.T1.commitment?.commandId).toBe(commandId(1));
    expect(unwrap(await f.store.execute(SESSION_ID, 1, command)).revision).toBe(2);
  });
  it.each(['invalid-session', 'unsupported-version', 'digest-mismatch'] as const)('preserves %s records and lists unrelated valid sessions', async code => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    const bad = structuredClone(f.session); bad.id = crypto.randomUUID();
    if (code === 'unsupported-version') (bad as { schemaVersion: number }).schemaVersion = 2;
    else if (code === 'invalid-session') bad.currentIndex = 200;
    else bad.items[0].guide.hints[0] += ' edited';
    const db = await openDB(f.databaseName, 1); await db.put('sessions', bad);
    const result = await f.store.read(bad.id);
    expect(result).toEqual({ ok: false, code });
    expect(await db.get('sessions', bad.id)).toEqual(bad);
    const list = unwrap(await f.store.list()); expect(list).toHaveLength(2);
    expect(list[1]).toEqual({ damaged: true }); db.close();
  });
  it('fails closed on a newer database, preserving it', async () => {
    const databaseName = 'synthetic-newer-' + crypto.randomUUID();
    const newer = await openDB(databaseName, 2, { upgrade(db) { db.createObjectStore('sessions', { keyPath: 'id' }); } });
    await newer.put('sessions', { id: SESSION_ID, schemaVersion: 2 }); newer.close();
    const f = await fixture({ databaseName });
    expect(await f.store.read(SESSION_ID)).toEqual({ ok: false, code: 'unsupported-version' });
    const retained = await openDB(databaseName, 2); expect(await retained.get('sessions', SESSION_ID)).toEqual({ id: SESSION_ID, schemaVersion: 2 }); retained.close();
  });
  it('bounds an open request that never acknowledges and offers a retryable failure', async () => {
    const f = await fixture();
    const holding = await openDB(f.databaseName, 1, { upgrade(db) { db.createObjectStore('sessions', { keyPath: 'id' }); } });
    const upgrade = indexedDB.open(f.databaseName, 2);
    const upgraded = new Promise<IDBDatabase>((resolve, reject) => { upgrade.onsuccess = () => resolve(upgrade.result); upgrade.onerror = () => reject(upgrade.error); });
    await new Promise<void>(resolve => { upgrade.onblocked = () => resolve(); });
    // Keep fake-indexeddb's real setImmediate task queue running during the clock test.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    try {
      let settled = false;
      const pending = f.store.read(SESSION_ID);
      void pending.then(() => { settled = true; });
      await vi.advanceTimersByTimeAsync(4999); expect(settled).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(await pending).toEqual({ ok: false, code: 'unavailable' });
    } finally { vi.useRealTimers(); holding.close(); (await upgraded).close(); }
  });
  it('handles a real aborted transaction after the put request without saving or notifying', async () => {
    const onCommit = vi.fn(); const f = await fixture({ onCommit }); unwrap(await f.store.create(f.session)); onCommit.mockClear();
    const original = IDBObjectStore.prototype.put;
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementationOnce(function (this: IDBObjectStore, ...args) {
      const request = original.apply(this, args); this.transaction.abort(); return request;
    });
    expect(await f.store.execute(SESSION_ID, 0, { kind: 'revealNextHint', questionId: 'T1' })).toEqual({ ok: false, code: 'unavailable' });
    expect(onCommit).not.toHaveBeenCalled(); expect(unwrap(await f.store.read(SESSION_ID))).toEqual(f.session);
  });
  it('closes on versionchange and never resets a database upgraded by another app version', async () => {
    const f = await fixture(); unwrap(await f.store.create(f.session));
    const newer = await openDB(f.databaseName, 2); newer.close();
    expect(await f.store.read(SESSION_ID)).toEqual({ ok: false, code: 'unsupported-version' });
  });
  it('supports a bounded 60-item frozen subset and rejects oversize data without truncation', async () => {
    const f = await syntheticGuidance(60);
    const report = submitAttempt(createAttempt(f.bank, Date.now(), crypto.randomUUID()), Date.now() + 1);
    const session = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'guest-device' }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    const store = createGuidedRepository({ databaseName: 'synthetic-sixty-' + crypto.randomUUID(), catalog: f.catalog, protect: clear,
      access: { prepare: async () => ({ ok: true, value: { fresh: () => ({ ok: true, value: { kind: 'guest-device' } }) } }) } }); stores.push(store);
    expect(unwrap(await store.create(session)).items).toHaveLength(60);
    const oversized = structuredClone(session); oversized.items[0].question.stemMarkdown = 'x'.repeat(4 * 1024 * 1024);
    expect(await store.create(oversized)).toEqual({ ok: false, code: 'resource-limit' });
    expect(unwrap(await store.read(session.id))).toEqual(session);
  });
  it('never reports success or sends notifications before the transaction completes', async () => {
    const committed = vi.fn(); const f = await fixture({ onCommit: committed });
    const created = f.store.create(f.session);
    expect(committed).not.toHaveBeenCalled(); await created;
    const db = await openDB(f.databaseName, 1);
    expect(committed).toHaveBeenCalledOnce(); expect(await db.get('sessions', SESSION_ID)).toEqual(f.session); db.close();
  });
  it('keeps all gate-denied writes out of IDB', async () => {
    const f = await fixture({ protect: async () => ({ gate: { status: 'blocked', reason: 'active-mock' } }) });
    expect(await f.store.create(f.session)).toEqual({ ok: false, code: 'blocked-mock' });
    const db = await openDB(f.databaseName, 1); expect(await db.count('sessions')).toBe(0); db.close();
  });
  it('cancels stale route/owner intent under the shared lock before any write', async () => {
    let intent = 0;
    const f = await fixture({ intent: () => intent, protect: async action => {
      intent++;
      return { gate: { status: 'clear', warnings: [] }, value: await action({ status: 'clear', warnings: [] }) };
    } });
    expect(await f.store.create(f.session)).toEqual({ ok: false, code: 'cancelled' });
    const db = await openDB(f.databaseName, 1); expect(await db.count('sessions')).toBe(0); db.close();
  });
  it('keeps private sessions invisible on authorization loss and cleans only derived records', async () => {
    const f = await fixture();
    const report = submitAttempt(createAttempt(f.bank, Date.now(), crypto.randomUUID()), Date.now() + 1);
    const ownerId = '33333333-3333-4333-8333-333333333333';
    const s = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'account', ownerId }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    let allowed = true;
    const privateStore = createGuidedRepository({ catalog: f.catalog, databaseName: f.databaseName, protect: clear, currentOwner: () => allowed ? ownerId : null,
      access: { prepare: async session => session.origin.kind === 'standalone' ? { ok: true, value: { fresh: () => ({ ok: true, value: null }) } } :
        allowed ? { ok: true, value: { fresh: () => allowed ? { ok: true, value: { kind: 'account', ownerId } } : { ok: false, code: 'private-source' } } } : { ok: false, code: 'private-source' } } }); stores.push(privateStore);
    unwrap(await privateStore.create(s)); unwrap(await privateStore.create(f.session));
    allowed = false;
    expect(await privateStore.read(s.id)).toEqual({ ok: false, code: 'private-source' });
    expect(unwrap(await privateStore.list())).toHaveLength(1);
    unwrap(await privateStore.cleanupPrivate(ownerId));
    expect(unwrap(await privateStore.read(s.id))).toBeNull();
    expect(unwrap(await privateStore.read(f.session.id))).toEqual(f.session);
  });
  it('durably binds a signup-claimed guest source before resume, preserving every other field', async () => {
    const f = await fixture(); const ownerId = '33333333-3333-4333-8333-333333333333'; let claimed = false;
    const report = submitAttempt(createAttempt(f.bank, Date.now(), crypto.randomUUID()), Date.now() + 1);
    const session = unwrap(await startSession({ kind: 'post-exam', report, filter: 'all', access: { kind: 'guest-device' }, id: crypto.randomUUID(), now: Date.now() }, f.release, f.catalog));
    const store = createGuidedRepository({ databaseName: f.databaseName, catalog: f.catalog, currentOwner: () => ownerId, protect: clear,
      access: { prepare: async () => ({ ok: true, value: { fresh: () => ({ ok: true, value: claimed ? { kind: 'account', ownerId } : { kind: 'guest-device' } }) } }) } }); stores.push(store);
    unwrap(await store.create(session)); claimed = true;
    const bound = unwrap(await store.read(session.id))!;
    expect(bound.origin).toMatchObject({ kind: 'post-exam', access: { kind: 'account', ownerId } });
    expect(bound.revision).toBe(1); expect(bound.items).toEqual(session.items); expect(bound.responses).toEqual(session.responses);
    expect(unwrap(await store.read(session.id))).toEqual(bound);
  });
});
