import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { openDB } from 'idb';
import { createGuidedRepository, type GuidedStore } from '../src/domain/guided/storage';
import { observeGuidedLocation, subscribeGuidedNavigation } from '../src/domain/guided/navigationIntent';
import { syntheticSession, unwrap, commandId } from './fixtures/syntheticGuidance';
import type { GuidedCommand } from '../src/domain/guided/schema';

const stores: GuidedStore[] = [], unsubscribers: (() => void)[] = [];
afterEach(() => { stores.splice(0).forEach(s => s.close()); unsubscribers.splice(0).forEach(u => u()); vi.restoreAllMocks(); });
function barrier() {
  let enter!: () => void, release!: () => void;
  return { entered: new Promise<void>(r => { enter = r; }), released: new Promise<void>(r => { release = r; }), enter: () => enter(), release: () => release() };
}

describe('Guided navigation command ordering', () => {
  for (const kind of ['hint', 'commit'] as const) for (const stage of ['preparation', 'protection', 'transaction-read'] as const)
  it(`${kind} invalidated during ${stage} preserves the complete record and sends no commit`, async () => {
    const f = await syntheticSession(), held = barrier(), committed = vi.fn();
    let epoch = 0, armed = false;
    const first = crypto.randomUUID(); observeGuidedLocation(first);
    unsubscribers.push(subscribeGuidedNavigation(() => { epoch++; }));
    const databaseName = 'synthetic-command-order-' + crypto.randomUUID();
    const store = createGuidedRepository({ catalog: f.catalog, databaseName, intent: () => epoch, onCommit: committed,
      access: { prepare: async () => {
        if (armed && stage === 'preparation') { held.enter(); await held.released; }
        return { ok: true, value: { fresh: () => ({ ok: true, value: null }) } };
      } },
      protect: async action => {
        if (armed && stage === 'protection') { held.enter(); await held.released; }
        return { gate: { status: 'clear', warnings: [] }, value: await action({ status: 'clear', warnings: [] }) };
      } });
    stores.push(store); let before = unwrap(await store.create(f.session));
    if (kind === 'commit') before = unwrap(await store.execute(before.id, before.revision, { kind: 'select', questionId: 'T1', ids: ['A', 'C'] }));
    committed.mockClear();
    const command: GuidedCommand = kind === 'hint' ? { kind: 'revealNextHint', questionId: 'T1' } : { kind: 'commit', questionId: 'T1', commandId: commandId(1) };
    const db = await openDB(databaseName, 1);
    if (stage === 'transaction-read') {
      const get = IDBObjectStore.prototype.get;
      vi.spyOn(IDBObjectStore.prototype, 'get').mockImplementation(function (this: IDBObjectStore, query) {
        const request = get.call(this, query);
        if (this.transaction.mode === 'readwrite') request.addEventListener('success', () => {
          observeGuidedLocation(crypto.randomUUID()); held.enter();
        }, { once: true });
        return request;
      });
    }
    armed = true;
    const result = store.execute(before.id, before.revision, command);
    await held.entered;
    if (stage !== 'transaction-read') {
      // An ABA Back/Forward return cannot resurrect the old command.
      observeGuidedLocation(crypto.randomUUID()); observeGuidedLocation(first); held.release();
    }
    expect(await result).toEqual({ ok: false, code: 'cancelled' });
    expect(await db.get('sessions', before.id)).toEqual(before);
    expect(committed).not.toHaveBeenCalled(); db.close();
  });

  it('location-only notifications ignore non-navigation updates and unsubscribe on unmount', () => {
    const initial = crypto.randomUUID(); observeGuidedLocation(initial);
    const listener = vi.fn(), unsubscribe = subscribeGuidedNavigation(listener);
    observeGuidedLocation(initial); expect(listener).not.toHaveBeenCalled();
    observeGuidedLocation(crypto.randomUUID()); observeGuidedLocation(initial);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe(); observeGuidedLocation(crypto.randomUUID()); expect(listener).toHaveBeenCalledTimes(2);
  });
});
