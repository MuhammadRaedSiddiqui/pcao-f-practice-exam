import { openDB, type DBSchema } from 'idb';
import { z } from 'zod';
import { listAttempts, recoverAttempt, type AttemptStorage } from './attempt';
import { ArchiveError } from './cloudReports';

const ownerPrefix = 'pcao-f:attempt-owner:v1:';
const ownerSchema = z.object({ userId: z.uuid(), state: z.enum(['eligible', 'paused', 'deleted']), createdAt: z.number().finite() });
export type Ownership = z.infer<typeof ownerSchema>;
export function readOwnership(storage: AttemptStorage, id: string): Ownership | null {
  try {
    const raw = storage.getItem(ownerPrefix + id);
    if (raw === null) return null;
    const parsed = ownerSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new Error();
    return parsed.data;
  } catch { throw new ArchiveError('Account ownership could not be read safely. This device report was kept private.', 'invalid'); }
}
// Callers hold the existing browser-storage lock. Original attempt bytes never change.
export function claimAttempt(storage: AttemptStorage, id: string, userId: string): void {
  const next = ownerSchema.parse({ userId, state: 'eligible', createdAt: Date.now() });
  const current = readOwnership(storage, id);
  if (current && (current.userId !== userId || current.state === 'deleted'))
    throw new ArchiveError('This report is owned by another account or was removed from the account.', 'ownership');
  if (!current || current.state === 'paused') storage.setItem(ownerPrefix + id, JSON.stringify({ ...next, createdAt: current?.createdAt ?? next.createdAt }));
}
// Signup claims completed guest reports under the existing browser-storage lock.
// Ownership makes migration durable even if the page closes before queue creation.
export function claimGuestReports(storage: AttemptStorage, userId: string): { ids: string[]; unreadable: number } {
  const loaded = listAttempts(storage);
  const ids: string[] = [];
  let unreadable = loaded.errors.length;
  for (const attempt of loaded.attempts) {
    if (attempt.status !== 'submitted') continue;
    try {
      if (readOwnership(storage, attempt.id)) continue;
      claimAttempt(storage, attempt.id, userId);
      ids.push(attempt.id);
    } catch { unreadable += 1; }
  }
  return { ids, unreadable };
}
export function pauseAttempt(storage: AttemptStorage, id: string, userId: string): void {
  const current = readOwnership(storage, id);
  if (!current || current.userId !== userId || current.state === 'deleted') throw new ArchiveError('This backup cannot be paused.', 'ownership');
  storage.setItem(ownerPrefix + id, JSON.stringify({ ...current, state: 'paused' }));
}
export function markDeleted(storage: AttemptStorage, id: string, userId: string): void {
  const current = readOwnership(storage, id);
  if (current && current.userId !== userId) throw new ArchiveError('This device copy belongs to another account.', 'ownership');
  storage.setItem(ownerPrefix + id, JSON.stringify({ userId, state: 'deleted', createdAt: current?.createdAt ?? Date.now() }));
}
export function visibleTo(storage: AttemptStorage, id: string, userId: string | null): boolean {
  try { const owner = readOwnership(storage, id); return !owner || owner.userId === userId; }
  catch { return false; }
}
export function removeDeviceReport(storage: AttemptStorage, id: string, userId: string): void {
  const owner = readOwnership(storage, id);
  const recovered = recoverAttempt(storage, id);
  if (!owner || owner.userId !== userId || !recovered.ok || recovered.attempt?.status !== 'submitted')
    throw new ArchiveError('Only your completed, verified report copy can be removed.', 'invalid');
  const key = 'pcao-f:attempt:v1:' + id;
  const indexKey = 'pcao-f:attempt-ids:v1';
  const before = storage.getItem(key);
  const beforeIndex = storage.getItem(indexKey);
  const ids: unknown = JSON.parse(beforeIndex ?? '[]');
  if (!Array.isArray(ids) || ids.some(item => typeof item !== 'string')) throw new ArchiveError('The device history index is damaged.', 'invalid');
  try {
    storage.setItem(indexKey, JSON.stringify(ids.filter(item => item !== id)));
    storage.removeItem(key);
  } catch {
    try { if (before !== null) storage.setItem(key, before); if (beforeIndex !== null) storage.setItem(indexKey, beforeIndex); }
    catch { throw new ArchiveError('Device cleanup and recovery failed. Reload to check saved reports.', 'storage'); }
    throw new ArchiveError('The device copy could not be removed. It was kept.', 'storage');
  }
}

export type ArchiveJob = {
  key: string; userId: string; attemptId: string; hash: string;
  state: 'pending' | 'backed-up' | 'failed' | 'deleted' | 'cancelled';
  failures: number; nextRetryAt: number; error?: string; reportId?: string;
};
interface ArchiveDatabase extends DBSchema {
  jobs: { key: string; value: ArchiveJob; indexes: { owner: string } };
  copies: { key: string; value: { key: string; userId: string; payload: unknown; metadata?: unknown }; indexes: { owner: string } };
}
let database: ReturnType<typeof openDB<ArchiveDatabase>> | undefined;
function archiveDatabase() {
  database ??= openDB<ArchiveDatabase>('pcao-f-account-archive-v1', 1, {
    upgrade(db) {
      db.createObjectStore('jobs', { keyPath: 'key' }).createIndex('owner', 'userId');
      db.createObjectStore('copies', { keyPath: 'key' }).createIndex('owner', 'userId');
    },
    terminated() { database = undefined; },
  }).catch(error => { database = undefined; throw error; });
  return database;
}
export const archiveKey = (userId: string, attemptId: string) => JSON.stringify([userId, attemptId]);
export const archiveStore = {
  async jobs(userId: string) { return (await archiveDatabase()).getAllFromIndex('jobs', 'owner', userId); },
  async put(job: ArchiveJob) { await (await archiveDatabase()).put('jobs', job); },
  async cache(userId: string, attemptId: string, payload: unknown, metadata?: unknown) {
    const key = archiveKey(userId, attemptId);
    await (await archiveDatabase()).put('copies', { key, userId, payload, metadata });
  },
  async copies(userId: string) { return (await archiveDatabase()).getAllFromIndex('copies', 'owner', userId); },
  async copy(userId: string, attemptId: string) { return (await archiveDatabase()).get('copies', archiveKey(userId, attemptId)); },
  async removeCopy(userId: string, attemptId: string) { await (await archiveDatabase()).delete('copies', archiveKey(userId, attemptId)); },
  async clearOwner(userId: string, includeJobs = false) {
    const db = await archiveDatabase();
    const tx = db.transaction(['copies', 'jobs'], 'readwrite');
    for (const key of await tx.objectStore('copies').index('owner').getAllKeys(userId)) await tx.objectStore('copies').delete(key);
    if (includeJobs) for (const key of await tx.objectStore('jobs').index('owner').getAllKeys(userId)) await tx.objectStore('jobs').delete(key);
    await tx.done;
  },
};
