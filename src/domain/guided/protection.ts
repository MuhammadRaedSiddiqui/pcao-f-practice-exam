import { z } from 'zod';
import { parseAttempt } from '../attemptModel';
import { timestampSchema, withinJsonLimit } from './schema';

export const MOCK_ATTEMPT_PREFIX = 'pcao-f:attempt:v1:';
export const MOCK_INDEX_KEY = 'pcao-f:attempt-ids:v1';
export const CHECKING_BUDGET_MS = 5000;
export const MAX_INVENTORY_KEYS = 65536;
export const MAX_INVENTORY_ATTEMPTS = 4096;
export const MAX_INVENTORY_BYTES = 16 * 1024 * 1024;
const MAX_ATTEMPT_BYTES = 4 * 1024 * 1024;
const readSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('read'), raw: z.string().nullable() }),
  z.strictObject({ kind: z.literal('unreadable') }),
]);
export const mockInventorySchema = z.strictObject({
  index: readSchema,
  enumeration: z.strictObject({ complete: z.boolean(), keys: z.array(z.string().max(1000)).max(MAX_INVENTORY_KEYS) }),
  records: z.record(z.string(), readSchema),
  startedAt: timestampSchema, checkedAt: timestampSchema, now: timestampSchema,
});
export type MockInventory = z.infer<typeof mockInventorySchema>;
export type InventoryRead = z.infer<typeof readSchema>;
export const recoveryReasonSchema = z.enum(['corrupt-record', 'unreadable-record', 'unsupported-record',
  'incomplete-inventory', 'storage-unavailable', 'checking-timeout', 'resource-limit']);
export const mockGateSchema = z.discriminatedUnion('status', [
  z.strictObject({ status: z.literal('checking'), startedAt: timestampSchema, budgetMs: z.literal(CHECKING_BUDGET_MS) }),
  z.strictObject({ status: z.literal('clear'), warnings: z.array(z.enum(['malformed-index', 'stale-index'])) }),
  z.strictObject({ status: z.literal('blocked'), reason: z.literal('active-mock') }),
  z.strictObject({ status: z.literal('recovery-required'), reason: recoveryReasonSchema, retry: z.literal(true) }),
  z.strictObject({ status: z.literal('unsupported'), reason: z.enum(['coordination-unavailable', 'storage-format']) }),
]);
export type MockGate = z.infer<typeof mockGateSchema>;
type RecoveryReason = z.infer<typeof recoveryReasonSchema>;
const recovery = (reason: RecoveryReason): MockGate => ({ status: 'recovery-required', reason, retry: true });

// This is an observation contract, not a browser adapter. Phase 4 must acquire the shared
// lock, enumerate complete keys, union/deduplicate, and read each key afresh in one scan.
// There are deliberately no setters, finalizers, owner IDs, or raw data in the gate output.
export type ProtectionObservation = { kind: 'checking'; startedAt: number; now: number } |
  { kind: 'inventory'; inventory: MockInventory } |
  { kind: 'storage-failure' } | { kind: 'unsupported'; reason: 'coordination-unavailable' | 'storage-format' };

export function inventoryAttemptKeys(index: InventoryRead, rawKeys: readonly string[]): {
  keys: string[]; malformedIndex: boolean; indexedKeys: string[];
} {
  let ids: string[] = []; let malformedIndex = false;
  if (index.kind === 'read') {
    try {
      const parsed: unknown = JSON.parse(index.raw ?? '[]');
      if (!Array.isArray(parsed) || parsed.some(id => typeof id !== 'string' || !id || id.length > 200)) malformedIndex = true;
      else ids = parsed;
    } catch { malformedIndex = true; }
  }
  const indexedKeys = [...new Set(ids.map(id => MOCK_ATTEMPT_PREFIX + id))];
  return { keys: [...new Set([...indexedKeys, ...rawKeys.filter(key => key.startsWith(MOCK_ATTEMPT_PREFIX))])],
    malformedIndex, indexedKeys };
}

export function classifyMockProtection(observation: ProtectionObservation): MockGate {
  if (observation.kind === 'unsupported') return { status: 'unsupported', reason: observation.reason };
  if (observation.kind === 'storage-failure') return recovery('storage-unavailable');
  if (observation.kind === 'checking') {
    if (!timestampSchema.safeParse(observation.startedAt).success || !timestampSchema.safeParse(observation.now).success ||
        observation.now < observation.startedAt) return recovery('incomplete-inventory');
    return observation.now - observation.startedAt >= CHECKING_BUDGET_MS ? recovery('checking-timeout') :
      { status: 'checking', startedAt: observation.startedAt, budgetMs: CHECKING_BUDGET_MS };
  }
  const parsed = mockInventorySchema.safeParse(observation.inventory);
  if (!parsed.success) return recovery('incomplete-inventory');
  const scan = parsed.data;
  if (scan.checkedAt < scan.startedAt) return recovery('incomplete-inventory');
  if (scan.checkedAt - scan.startedAt >= CHECKING_BUDGET_MS) return recovery('checking-timeout');
  if (scan.index.kind === 'unreadable') return recovery('storage-unavailable');
  if (!scan.enumeration.complete) return recovery('incomplete-inventory');
  if (scan.index.raw !== null && new TextEncoder().encode(scan.index.raw).length > MAX_ATTEMPT_BYTES) return recovery('resource-limit');
  const totalBytes = Object.values(scan.records).reduce((total, r) => total +
    (r.kind === 'read' && r.raw !== null ? new TextEncoder().encode(r.raw).length : 0), 0);
  if (totalBytes > MAX_INVENTORY_BYTES) return recovery('resource-limit');
  const union = inventoryAttemptKeys(scan.index, scan.enumeration.keys);
  if (union.keys.length > MAX_INVENTORY_ATTEMPTS || Object.keys(scan.records).length > MAX_INVENTORY_ATTEMPTS) return recovery('resource-limit');
  if (Object.keys(scan.records).some(key => key.startsWith(MOCK_ATTEMPT_PREFIX) && !union.keys.includes(key))) return recovery('incomplete-inventory');
  let active = false; let stale = false;
  const reasons = new Set<RecoveryReason>();
  for (const key of union.keys) {
    const record = Object.hasOwn(scan.records, key) ? scan.records[key] : undefined;
    if (!record) { reasons.add('incomplete-inventory'); continue; }
    if (record.kind === 'unreadable') { reasons.add('unreadable-record'); continue; }
    if (record.raw === null) {
      if (scan.enumeration.keys.includes(key)) reasons.add('incomplete-inventory');
      else stale = true;
      continue;
    }
    if (new TextEncoder().encode(record.raw).length > MAX_ATTEMPT_BYTES) { reasons.add('resource-limit'); continue; }
    let value: unknown;
    try { value = JSON.parse(record.raw); } catch { reasons.add('corrupt-record'); continue; }
    if (value && typeof value === 'object' && 'schemaVersion' in value && value.schemaVersion !== 1) {
      reasons.add('unsupported-record'); continue;
    }
    if (!withinJsonLimit(value, MAX_ATTEMPT_BYTES)) { reasons.add('resource-limit'); continue; }
    const attempt = parseAttempt(value);
    if (!attempt || key !== MOCK_ATTEMPT_PREFIX + attempt.id) { reasons.add('corrupt-record'); continue; }
    if (attempt.status === 'in-progress' && scan.now < attempt.deadlineAt) active = true;
  }
  // Unknown records take precedence even if another record proves a live Mock exists.
  for (const reason of ['incomplete-inventory', 'unreadable-record', 'unsupported-record', 'corrupt-record', 'resource-limit'] as const) {
    if (reasons.has(reason)) return recovery(reason);
  }
  if (active) return { status: 'blocked', reason: 'active-mock' };
  const warnings: ('malformed-index' | 'stale-index')[] = [];
  if (union.malformedIndex) warnings.push('malformed-index');
  if (stale) warnings.push('stale-index');
  return { status: 'clear', warnings };
}

export const sourceAccessDecisionSchema = z.discriminatedUnion('allowed', [
  z.strictObject({ allowed: z.literal(true) }),
  z.strictObject({ allowed: z.literal(false), reason: z.enum(['missing', 'private', 'deleted', 'unavailable']) }),
]);
export type SourceAccessDecision = z.infer<typeof sourceAccessDecisionSchema>;
export const recoveryActionSchema = z.enum(['retry', 'return-history', 'resume-owned-mock']);
export type RecoveryAction = z.infer<typeof recoveryActionSchema>;
// Contract only. The future UI owns navigation; this function never reads or repairs storage.
export function recoveryActionAllowed(action: RecoveryAction, access: SourceAccessDecision): boolean {
  return recoveryActionSchema.safeParse(action).success && sourceAccessDecisionSchema.safeParse(access).success &&
    (action !== 'resume-owned-mock' || access.allowed);
}
export const RECOVERY_REQUIREMENTS = Object.freeze({
  budget: 'The entire scan, validation and lock wait must finish within 5000 ms; discard late clear results',
  retry: 'Explicit Retry performs a complete new under-lock inventory before any instructional access',
  preservation: 'Keep original Mock/index/owner bytes; no automatic repair, quarantine, deletion, export or finalization',
  privacy: 'Generic reason only; source recovery requires current ownership/access, never disclose foreign records',
  deadline: 'Only a fully validated saved deadline may establish expiry; never infer one from damaged data',
  authorization: 'Any user-controlled recovery that changes Mock data needs separate explicit authorization',
  releaseGate: 'Implement and verify the non-destructive ownership-safe recovery workflow in Phase 4 before public release',
});
