import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { z } from 'zod';
import type { GuidedRepository } from './contracts';
import { productionCatalog, type GuideCatalog } from './catalog';
import { validateGuidedSession, applyCommand, type ValidatedGuidedSession } from './session';
import { guidedSessionSchema, originSchema, type GuidedSession, type GuidedCommand } from './schema';
import { failure, frozenCopy, type GuidedResult } from './errors';
import { browserSourceAccess, type GuidedSourceAccess } from './access';
import { withGuidedProtection } from './browserProtection';
import type { MockGate } from './protection';
import { readOwnership } from '../archiveStorage';

interface GuidedDatabase extends DBSchema { sessions: { key: string; value: unknown } }
export const GUIDED_DATABASE = 'pcao-f-guided';
export const GUIDED_CHANNEL = 'pcao-f:guided:v1';
let notificationChannel: BroadcastChannel | null = null;
let notificationListeners = 0;
function guidedChannel(): BroadcastChannel | null {
  try { return notificationChannel ??= new BroadcastChannel(GUIDED_CHANNEL); } catch { return null; }
}
export function subscribeGuidedChanges(listener: () => void): () => void {
  const channel = guidedChannel();
  if (!channel) return () => {};
  notificationListeners++;
  channel.addEventListener('message', listener);
  return () => {
    channel.removeEventListener('message', listener);
    if (--notificationListeners === 0) { channel.close(); if (notificationChannel === channel) notificationChannel = null; }
  };
}
const uuid = z.uuid();
const json = (value: unknown) => JSON.stringify(value);
async function readRecord(db: IDBPDatabase<GuidedDatabase>, id: string) {
  const tx = db.transaction('sessions', 'readonly');
  const timer = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
  try { const value = await tx.store.get(id); await tx.done; return value; }
  catch (error) { await tx.done.catch(() => {}); throw error; }
  finally { clearTimeout(timer); }
}
async function recordKeys(db: IDBPDatabase<GuidedDatabase>) {
  const tx = db.transaction('sessions', 'readonly');
  const timer = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
  try { const keys = await tx.store.getAllKeys(); await tx.done; return keys; }
  catch (error) { await tx.done.catch(() => {}); throw error; }
  finally { clearTimeout(timer); }
}
function storageFailure(error: unknown) {
  const name = error instanceof Error || error instanceof DOMException ? error.name : '';
  return failure(name === 'QuotaExceededError' ? 'quota' : name === 'VersionError' ? 'unsupported-version' : 'unavailable');
}

export type GuidedSessionListing = { id: string; revision: number; status: string; count: number; updatedAt: number };
export type GuidedStore = GuidedRepository & {
  close(): void;
  cleanupPrivate(ownerLost?: string): Promise<GuidedResult<null>>;
};
export function createGuidedRepository(options: {
  catalog?: GuideCatalog;
  access?: GuidedSourceAccess;
  currentOwner?: () => string | null;
  protect?: typeof withGuidedProtection;
  onGate?: (gate: MockGate) => void;
  onCommit?: (id: string, revision: number) => void;
  sourceDeleted?: (sourceId: string, ownerId?: string) => boolean;
  intent?: () => unknown;
  databaseName?: string;
} = {}): GuidedStore {
  const catalog = options.catalog ?? productionCatalog;
  const owner = options.currentOwner ?? (() => null);
  const access = options.access ?? browserSourceAccess(owner);
  const protect = options.protect ?? withGuidedProtection;
  let opening: Promise<IDBPDatabase<GuidedDatabase>> | undefined;
  let closed = false;
  function database() {
    if (closed) return Promise.reject(new Error('Closed guided repository'));
    opening ??= new Promise((resolve, reject) => {
      let settled = false;
      const timer = setTimeout(() => { settled = true; opening = undefined; reject(new Error('Guided storage did not open')); }, 5000);
      void openDB<GuidedDatabase>(options.databaseName ?? GUIDED_DATABASE, 1, {
        upgrade(db) { db.createObjectStore('sessions', { keyPath: 'id' }); },
        blocked() { /* Preserve the existing database; finite timeout offers Retry. */ },
        blocking() { void opening?.then(db => db.close()); opening = undefined; },
        terminated() { opening = undefined; },
      }).then(db => {
        if (settled || closed) { db.close(); return; }
        settled = true; clearTimeout(timer); resolve(db);
      }, error => { if (!settled) { settled = true; clearTimeout(timer); opening = undefined; reject(error); } });
    });
    return opening;
  }
  async function guarded<T>(action: (active: () => boolean) => Promise<GuidedResult<T>>, intent: unknown): Promise<GuidedResult<T>> {
    const active = () => !closed && (!options.intent || options.intent() === intent);
    if (!active()) return failure('cancelled');
    const result = await protect(() => active() ? action(active) : failure('cancelled'));
    if (!active()) return failure('cancelled');
    options.onGate?.(result.gate);
    if (result.gate.status !== 'clear') return failure(result.gate.status === 'blocked' ? 'blocked-mock' : 'recovery-required');
    return result.value ?? failure('unavailable');
  }
  function notify(id: string, revision: number) {
    options.onCommit?.(id, revision);
    try {
      const channel = guidedChannel();
      // The same document uses one channel, so its own command acknowledgement
      // does not trigger a destructive unmount/reread of the current question.
      channel?.postMessage({ sessionId: id, revision });
      if (channel && notificationListeners === 0) { channel.close(); notificationChannel = null; }
    } catch { /* Polling remains authoritative. */ }
  }
  async function prepared(id: string) {
    if (!uuid.safeParse(id).success) return failure('invalid-command');
    const db = await database();
    const raw = await readRecord(db, id);
    if (raw === undefined) return { ok: true as const, value: { db, raw, session: null, proof: null } };
    const valid = await validateGuidedSession(raw, catalog);
    if (!valid.ok) return valid;
    const proof = await access.prepare(valid.value);
    if (!proof.ok) return proof;
    return { ok: true as const, value: { db, raw, session: valid.value, proof: proof.value } };
  }
  async function read(id: string): Promise<GuidedResult<ValidatedGuidedSession | null>> {
    const intent = options.intent?.();
    try {
      const preparation = await prepared(id);
      if (!preparation.ok) return preparation;
      const { db, raw, session, proof } = preparation.value;
      let boundRevision: number | null = null;
      const result = await guarded<ValidatedGuidedSession | null>(async active => {
        const allowed = proof?.fresh();
        if (allowed && !allowed.ok) return allowed;
        if (session?.origin.kind === 'post-exam' && allowed?.ok && json(session.origin.access) !== json(allowed.value)) {
          if (session.origin.access.kind !== 'guest-device' || allowed.value?.kind !== 'account') return failure('private-source');
          const bound = frozenCopy({ ...session, origin: { ...session.origin, access: allowed.value },
            revision: session.revision + 1, updatedAt: Math.max(Date.now(), session.updatedAt) }) as ValidatedGuidedSession;
          if (!guidedSessionSchema.safeParse(bound).success) return failure('invalid-session');
          const tx = db.transaction('sessions', 'readwrite', { durability: 'strict' });
          const timer = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
          try {
            if (json(await tx.store.get(id)) !== json(raw)) { await tx.done; return failure('conflict'); }
            if (!active()) { await tx.done; return failure('cancelled'); }
            if (!proof?.fresh().ok) { await tx.done; return failure('private-source'); }
            await tx.store.put(structuredClone(bound)); await tx.done;
            boundRevision = bound.revision;
            return { ok: true, value: bound };
          } catch (error) { await tx.done.catch(() => {}); throw error; }
          finally { clearTimeout(timer); }
        }
        if (json(await readRecord(db, id)) !== json(raw)) return failure('conflict');
        if (!active()) return failure('cancelled');
        const stillAllowed = proof?.fresh();
        if (stillAllowed && !stillAllowed.ok) return stillAllowed;
        return { ok: true, value: session };
      }, intent);
      if (result.ok && boundRevision !== null) notify(id, boundRevision);
      return result;
    } catch (error) { return storageFailure(error); }
  }
  return {
    read,
    async list() {
      try {
        const db = await database();
        const ids = await recordKeys(db);
        const listings: GuidedSessionListing[] = [];
        let damaged = 0;
        for (const id of ids) {
          const value = await read(id);
          if (value.ok && value.value) {
            const s = value.value;
            listings.push({ id: s.id, revision: s.revision, status: s.status, count: s.items.length, updatedAt: s.updatedAt });
          } else if (!value.ok && !['private-source', 'blocked-mock', 'recovery-required'].includes(value.code)) damaged += 1;
          else if (!value.ok && value.code !== 'private-source') return value;
        }
        // No raw payload, owner ID, source ID or question content in a landing listing.
        return { ok: true, value: [...listings.sort((a, b) => b.updatedAt - a.updatedAt), ...(damaged ? [{ damaged: true }] : [])] };
      } catch (error) { return storageFailure(error); }
    },
    async create(input) {
      const intent = options.intent?.();
      try {
        const valid = await validateGuidedSession(input, catalog);
        if (!valid.ok) return valid;
        if (valid.value.revision !== 0) return failure('invalid-session');
        const proof = await access.prepare(valid.value);
        if (!proof.ok) return proof;
        const db = await database();
        const result = await guarded<GuidedSession>(async active => {
          const allowed = proof.value.fresh();
          if (!allowed.ok) return allowed;
          // A claimed source must be explicitly bound before creation.
          if (valid.value.origin.kind === 'post-exam' && json(allowed.value) !== json(valid.value.origin.access)) return failure('private-source');
          const tx = db.transaction('sessions', 'readwrite', { durability: 'strict' });
          const deadline = setTimeout(() => { try { tx.abort(); } catch { /* Already complete. */ } }, 4500);
          try {
            if (await tx.store.get(valid.value.id) !== undefined) { await tx.done; return failure('conflict'); }
            if (!active()) { await tx.done; return failure('cancelled'); }
            if (!proof.value.fresh().ok) { await tx.done; return failure('private-source'); }
            await tx.store.add(structuredClone(valid.value));
            await tx.done;
            return { ok: true, value: valid.value };
          } catch (error) { await tx.done.catch(() => {}); throw error; }
          finally { clearTimeout(deadline); }
        }, intent);
        if (result.ok) notify(result.value.id, result.value.revision);
        return result;
      } catch (error) { return storageFailure(error); }
    },
    async execute(id: string, expectedRevision: number, command: GuidedCommand) {
      const intent = options.intent?.();
      try {
        const preparation = await prepared(id);
        if (!preparation.ok) return preparation;
        const { db, raw, session, proof } = preparation.value;
        if (!session || !proof) return failure('unavailable');
        const result = await guarded<GuidedSession>(async active => {
          const allowed = proof.fresh();
          if (!allowed.ok) return allowed;
          // Claim binding is its own revision; stale user commands must be retried.
          let bound = session;
          const needsBinding = session.origin.kind === 'post-exam' && json(session.origin.access) !== json(allowed.value);
          if (needsBinding) {
            if (session.origin.kind !== 'post-exam' || session.origin.access.kind !== 'guest-device' || allowed.value?.kind !== 'account') return failure('private-source');
            bound = frozenCopy({ ...session, origin: { ...session.origin, access: allowed.value },
              revision: session.revision + 1, updatedAt: Math.max(Date.now(), session.updatedAt) }) as ValidatedGuidedSession;
            if (!guidedSessionSchema.safeParse(bound).success) return failure('invalid-session');
          }
          const proposal = needsBinding ? { ok: true as const, value: { session: bound, changed: true } } :
            applyCommand(session, command, expectedRevision, Date.now());
          if (!proposal.ok) return proposal;
          const tx = db.transaction('sessions', 'readwrite', { durability: 'strict' });
          const deadline = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
          try {
            const latest = await tx.store.get(id);
            if (json(latest) !== json(raw)) { await tx.done; return failure('conflict'); }
            if (!active()) { await tx.done; return failure('cancelled'); }
            if (!proof.fresh().ok) { await tx.done; return failure('private-source'); }
            if (proposal.value.changed) await tx.store.put(structuredClone(proposal.value.session));
            await tx.done;
            return needsBinding ? failure('conflict') : { ok: true as const, value: proposal.value.session };
          } catch (error) { await tx.done.catch(() => {}); throw error; }
          finally { clearTimeout(deadline); }
        }, intent);
        if (result.ok) notify(result.value.id, result.value.revision);
        return result;
      } catch (error) { return storageFailure(error); }
    },
    async remove(id, expectedRevision) {
      const intent = options.intent?.();
      try {
        const preparation = await prepared(id);
        if (!preparation.ok) return preparation;
        const { db, raw, session, proof } = preparation.value;
        if (!session || !proof) return failure('unavailable');
        const result = await guarded<null>(async active => {
          const allowed = proof.fresh();
          if (!allowed.ok) return allowed;
          if (session.revision !== expectedRevision) return failure('conflict');
          const tx = db.transaction('sessions', 'readwrite');
          const timer = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
          try {
            if (json(await tx.store.get(id)) !== json(raw)) { await tx.done; return failure('conflict'); }
            if (!active()) { await tx.done; return failure('cancelled'); }
            if (!proof.fresh().ok) { await tx.done; return failure('private-source'); }
            await tx.store.delete(id); await tx.done;
            return { ok: true, value: null };
          } catch (error) { await tx.done.catch(() => {}); throw error; }
          finally { clearTimeout(timer); }
        }, intent);
        if (result.ok) notify(id, expectedRevision + 1);
        return result;
      } catch (error) { return storageFailure(error); }
    },
    async cleanupPrivate(ownerLost) {
      try {
        const db = await database();
        // Cleanup only derived records with a structurally verified private origin.
        // Unknown schemas/corruption stay preserved and inaccessible.
        const rows = [];
        for (const id of await recordKeys(db)) rows.push(await readRecord(db, id));
        const inaccessible = (row: GuidedSession) => {
          if (row.origin.kind !== 'post-exam') return false;
          if (row.origin.access.kind === 'account' && ownerLost && row.origin.access.ownerId === ownerLost && row.origin.access.ownerId !== owner()) return true;
          try {
            return options.sourceDeleted ? options.sourceDeleted(row.origin.sourceAttemptId, row.origin.access.kind === 'account' ? row.origin.access.ownerId : undefined) :
              readOwnership(localStorage, row.origin.sourceAttemptId)?.state === 'deleted';
          } catch { return false; } // Storage failure is not proof of deletion.
        };
        const candidates = rows.filter((row): row is GuidedSession => {
          if (!row || typeof row !== 'object' || !('schemaVersion' in row) || row.schemaVersion !== 1 || !('origin' in row)) return false;
          const parsed = guidedSessionSchema.safeParse(row);
          return originSchema.safeParse(row.origin).success && parsed.success && inaccessible(parsed.data);
        });
        for (const row of candidates) {
          // Does not require a clear Mock gate: removing inaccessible derived data
          // cannot reveal content or mutate Mock. Serialize with its ownership lock.
          const { withBrowserStorageLock } = await import('../browserStorage');
          const abort = new AbortController();
          const lockTimer = setTimeout(() => abort.abort(), 5000);
          try { await withBrowserStorageLock(async () => {
            // Recheck fresh authorization immediately before the guided-only deletion.
            if (abort.signal.aborted || !inaccessible(row)) return;
            const tx = db.transaction('sessions', 'readwrite');
            const timer = setTimeout(() => { try { tx.abort(); } catch { /* Complete. */ } }, 4500);
            try {
              if (json(await tx.store.get(row.id)) === json(row) && !abort.signal.aborted && inaccessible(row)) await tx.store.delete(row.id);
              await tx.done;
            } catch (error) { await tx.done.catch(() => {}); throw error; }
            finally { clearTimeout(timer); }
          }, abort.signal); } finally { clearTimeout(lockTimer); }
        }
        return { ok: true, value: null };
      } catch (error) { return storageFailure(error); }
    },
    close() { closed = true; void opening?.then(db => db.close(), () => {}); opening = undefined; },
  };
}
