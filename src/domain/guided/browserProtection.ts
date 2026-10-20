import { withBrowserStorageLock } from '../browserStorage';
import { classifyMockProtection, inventoryAttemptKeys, CHECKING_BUDGET_MS, MAX_INVENTORY_KEYS, MAX_INVENTORY_BYTES,
  MAX_INVENTORY_ATTEMPTS, type InventoryRead, type MockGate } from './protection';

export type InventoryStorage = Pick<Storage, 'length' | 'key' | 'getItem'>;

// Caller holds the shared lock. Read-only, including orphaned and inaccessible records.
export function scanMockInventory(storage: InventoryStorage, startedAt = Date.now(), now = Date.now()): MockGate {
  try {
    const index: InventoryRead = { kind: 'read', raw: storage.getItem('pcao-f:attempt-ids:v1') };
    const encoder = new TextEncoder();
    const resourceFailure: MockGate = { status: 'recovery-required', reason: 'resource-limit', retry: true };
    const timeoutFailure: MockGate = { status: 'recovery-required', reason: 'checking-timeout', retry: true };
    const recordLimit = 4 * 1024 * 1024;
    if (index.raw !== null && (index.raw.length > recordLimit || encoder.encode(index.raw).length > recordLimit)) return resourceFailure;
    const keys: string[] = [];
    const length = storage.length;
    if (length > MAX_INVENTORY_KEYS) return { status: 'recovery-required', reason: 'resource-limit', retry: true };
    for (let i = 0; i < length; i++) {
      if (Date.now() - startedAt >= CHECKING_BUDGET_MS) return timeoutFailure;
      const key = storage.key(i);
      if (key === null) return { status: 'recovery-required', reason: 'incomplete-inventory', retry: true };
      keys.push(key);
    }
    const union = inventoryAttemptKeys(index, keys);
    if (union.keys.length > MAX_INVENTORY_ATTEMPTS) return { status: 'recovery-required', reason: 'resource-limit', retry: true };
    const records: Record<string, InventoryRead> = {};
    let bytes = 0;
    for (const key of union.keys) {
      if (Date.now() - startedAt >= CHECKING_BUDGET_MS) return timeoutFailure;
      try {
        const raw = storage.getItem(key);
        if (raw !== null && raw.length > recordLimit) return resourceFailure;
        const size = raw === null ? 0 : encoder.encode(raw).length;
        bytes += size;
        if (size > recordLimit || bytes > MAX_INVENTORY_BYTES) return resourceFailure;
        records[key] = { kind: 'read', raw };
      }
      catch { records[key] = { kind: 'unreadable' }; }
    }
    return classifyMockProtection({ kind: 'inventory', inventory: { index, records,
      enumeration: { complete: storage.length === length, keys }, startedAt, checkedAt: Date.now(), now } });
  } catch { return classifyMockProtection({ kind: 'storage-failure' }); }
}

// Includes lock waiting. Abort cancels queued locks; late callbacks cannot grant access.
export async function withGuidedProtection<T>(action: (gate: Extract<MockGate, { status: 'clear' }>) => Promise<T> | T,
  storage: () => InventoryStorage = () => localStorage): Promise<{ gate: MockGate; value?: T }> {
  if (!navigator.locks) return { gate: { status: 'unsupported', reason: 'coordination-unavailable' } };
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeoutGate: MockGate = { status: 'recovery-required', reason: 'checking-timeout', retry: true };
  let timer: ReturnType<typeof setTimeout> | undefined;
  let enteredAction = false;
  const timeout = new Promise<{ gate: MockGate }>(resolve => {
    timer = setTimeout(() => { controller.abort(); resolve({ gate: timeoutGate }); }, CHECKING_BUDGET_MS);
  });
  try {
    return await Promise.race([withBrowserStorageLock(async () => {
      if (controller.signal.aborted || Date.now() - startedAt >= CHECKING_BUDGET_MS) return { gate: timeoutGate };
      let gate: MockGate;
      try { gate = scanMockInventory(storage(), startedAt); }
      catch { gate = classifyMockProtection({ kind: 'storage-failure' }); }
      if (gate.status !== 'clear') return { gate };
      enteredAction = true;
      const value = await action(gate);
      return controller.signal.aborted ? { gate: timeoutGate } : { gate, value };
    }, controller.signal), timeout]);
  } catch (error) {
    // Guided IDB/source failures belong to their own recovery path; they do not
    // establish that the read-only Mock inventory failed.
    if (enteredAction && !controller.signal.aborted) throw error;
    return { gate: controller.signal.aborted ? timeoutGate : classifyMockProtection({ kind: 'storage-failure' }) };
  } finally { clearTimeout(timer); }
}

export const checkBrowserMockGate = async () => (await withGuidedProtection(() => null)).gate;
