import { readFileSync, readdirSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { createAttempt, submitAttempt } from '../src/domain/attemptModel';
import { submitStoredAttempt } from '../src/domain/attempt';
import { classifyMockProtection, inventoryAttemptKeys, MOCK_ATTEMPT_PREFIX as PREFIX, CHECKING_BUDGET_MS,
  mockGateSchema, RECOVERY_REQUIREMENTS, recoveryActionAllowed, sourceAccessDecisionSchema, type MockInventory } from '../src/domain/guided/protection';
import { guidedBank, NOW } from './fixtures/syntheticGuidance';

const active = () => createAttempt(guidedBank(), NOW, 'synthetic-private-attempt', 'intermediate');
function inventory(records: ReturnType<typeof active>[] = [], ids = records.map(r => r.id)): MockInventory {
  return { index: { kind: 'read', raw: JSON.stringify(ids) }, enumeration: { complete: true, keys: records.map(r => PREFIX + r.id) },
    records: Object.fromEntries(records.map(r => [PREFIX + r.id, { kind: 'read', raw: JSON.stringify(r) }])), startedAt: NOW,
    checkedAt: NOW + 1, now: NOW + 1 };
}
const gate = (i: MockInventory) => classifyMockProtection({ kind: 'inventory', inventory: i });

describe('D7–D9 read-only Mock protection contract', () => {
  it('unions exact raw keys and indexed IDs, deduplicates and ignores owner/other namespaces', () => {
    expect(inventoryAttemptKeys({ kind: 'read', raw: '["a","a","b"]' }, [PREFIX + 'b', PREFIX + 'orphan', 'pcao-f:attempt-owner:v1:x',
      'prefix-' + PREFIX + 'ignored'])).toEqual({ keys: [PREFIX + 'a', PREFIX + 'b', PREFIX + 'orphan'], malformedIndex: false,
      indexedKeys: [PREFIX + 'a', PREFIX + 'b'] });
  });
  it.each(['indexed', 'orphan', 'duplicate-index', 'absent-index', 'malformed-index'] as const)('blocks a validated live %s attempt', mode => {
    const a = active(); const i = inventory([a]);
    if (mode === 'orphan') i.index = { kind: 'read', raw: '[]' };
    if (mode === 'duplicate-index') i.index = { kind: 'read', raw: JSON.stringify([a.id, a.id]) };
    if (mode === 'absent-index') i.index = { kind: 'read', raw: null };
    if (mode === 'malformed-index') i.index = { kind: 'read', raw: '{' };
    const before = JSON.stringify(i);
    expect(gate(i)).toEqual({ status: 'blocked', reason: 'active-mock' });
    expect(JSON.stringify(i)).toBe(before);
    expect(JSON.stringify(gate(i))).not.toContain(a.id);
    expect(JSON.stringify(gate(i))).not.toContain('deadline');
  });
  it('clears at the exact verified deadline without submission or mutation, regardless of failed App finalization', () => {
    const a = active(); const i = inventory([a], []); const raw = i.records[PREFIX + a.id];
    i.now = a.deadlineAt - 1; expect(gate(i).status).toBe('blocked');
    i.now = a.deadlineAt; expect(gate(i)).toEqual({ status: 'clear', warnings: [] });
    expect(i.records[PREFIX + a.id]).toBe(raw);
    expect(a.status).toBe('in-progress');
  });
  it('classifies preserved expired bytes after an actual synthetic App save failure', () => {
    const a = active(); const raw = JSON.stringify(a); const i = inventory([a], []);
    const originalBytes = new Map([[PREFIX + a.id, raw], ['pcao-f:attempt-ids:v1', '[]']]);
    const storage = { getItem: (key: string) => originalBytes.get(key) ?? null,
      setItem: () => { throw new Error('synthetic quota failure'); }, removeItem: () => { throw new Error('no deletion'); } };
    expect(submitStoredAttempt(storage, a.id, a.deadlineAt, 'time expired').ok).toBe(false);
    expect(originalBytes.get(PREFIX + a.id)).toBe(raw);
    i.now = a.deadlineAt;
    expect(gate(i).status).toBe('clear');
    expect(JSON.parse(originalBytes.get(PREFIX + a.id)!).status).toBe('in-progress');
  });
  it('another live Mock still blocks alongside an expired record', () => {
    const expired = active(); const live = createAttempt(guidedBank(), NOW + 10000, 'other');
    const i = inventory([expired, live]); i.now = expired.deadlineAt;
    expect(gate(i).status).toBe('blocked');
  });
  it('clears submitted-only and empty inventory, with harmless index diagnostics preserved', () => {
    expect(gate(inventory())).toEqual({ status: 'clear', warnings: [] });
    const i = inventory([submitAttempt(active(), NOW + 1000)]);
    expect(gate(i).status).toBe('clear');
    i.index = { kind: 'read', raw: 'malformed' };
    expect(gate(i)).toEqual({ status: 'clear', warnings: ['malformed-index'] });
    i.index = { kind: 'read', raw: '["missing"]' }; i.records[PREFIX + 'missing'] = { kind: 'read', raw: null };
    expect(gate(i)).toEqual({ status: 'clear', warnings: ['stale-index'] });
  });
  it('distinguishes malformed index with complete valid raw inventory from incomplete or corrupt records', () => {
    const a = active(); const i = inventory([a]); i.now = a.deadlineAt; i.index = { kind: 'read', raw: '{' };
    expect(gate(i)).toEqual({ status: 'clear', warnings: ['malformed-index'] });
    i.enumeration.complete = false;
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'incomplete-inventory' });
    i.enumeration.complete = true; i.records[PREFIX + a.id] = { kind: 'read', raw: '{' };
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'corrupt-record' });
  });
  it.each([
    ['unreadable-record', (i: MockInventory) => { i.records[PREFIX + 'synthetic-private-attempt'] = { kind: 'unreadable' }; }],
    ['corrupt-record', (i: MockInventory) => { i.records[PREFIX + 'synthetic-private-attempt'] = { kind: 'read', raw: '{"deadlineAt":0}' }; }],
    ['unsupported-record', (i: MockInventory) => { i.records[PREFIX + 'synthetic-private-attempt'] = { kind: 'read', raw: '{"schemaVersion":2}' }; }],
    ['incomplete-inventory', (i: MockInventory) => { delete i.records[PREFIX + 'synthetic-private-attempt']; }],
    ['incomplete-inventory', (i: MockInventory) => { i.records[PREFIX + 'synthetic-private-attempt'] = { kind: 'read', raw: null }; }],
    ['storage-unavailable', (i: MockInventory) => { i.index = { kind: 'unreadable' }; }],
  ] as const)('fails closed with typed %s', (reason, change) => {
    const i = inventory([active()]); change(i);
    expect(gate(i)).toEqual({ status: 'recovery-required', reason, retry: true });
  });
  it('validates the entire record, never trusts a plausible expired deadline on corrupt data', () => {
    const i = inventory([active()]); const a = active(); a.deadlineAt = NOW - 1;
    i.records[PREFIX + a.id] = { kind: 'read', raw: JSON.stringify(a) };
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'corrupt-record' });
    i.records[PREFIX + a.id] = { kind: 'read', raw: JSON.stringify({ ...active(), id: 'wrong-key' }) };
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'corrupt-record' });
  });
  it('prioritizes unknown inventory over a valid live record', () => {
    const i = inventory([active()]); i.enumeration.keys.push(PREFIX + 'corrupt');
    i.records[PREFIX + 'corrupt'] = { kind: 'read', raw: '{}' };
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'corrupt-record' });
  });
  it('has a finite checking budget and fresh explicit Retry, no indefinite spinner', () => {
    expect(classifyMockProtection({ kind: 'checking', startedAt: NOW, now: NOW + CHECKING_BUDGET_MS - 1 }).status).toBe('checking');
    expect(classifyMockProtection({ kind: 'checking', startedAt: NOW, now: NOW + CHECKING_BUDGET_MS })).toMatchObject({ status: 'recovery-required', reason: 'checking-timeout' });
    const i = inventory(); i.checkedAt = NOW + CHECKING_BUDGET_MS;
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'checking-timeout' });
    expect(gate(inventory()).status).toBe('clear');
    expect(RECOVERY_REQUIREMENTS.preservation).toContain('no automatic repair');
  });
  it('restricts ordinary Mock recovery to source-authorized users without blocking a safe Retry or History exit', () => {
    expect(recoveryActionAllowed('resume-owned-mock', { allowed: true })).toBe(true);
    expect(recoveryActionAllowed('resume-owned-mock', { allowed: false, reason: 'private' })).toBe(false);
    expect(recoveryActionAllowed('retry', { allowed: false, reason: 'private' })).toBe(true);
    expect(recoveryActionAllowed('return-history', { allowed: false, reason: 'missing' })).toBe(true);
    expect(sourceAccessDecisionSchema.safeParse({ allowed: true, ownerEmail: 'secret' }).success).toBe(false);
  });
  it('does not accept an inventory claiming completeness while omitting a known raw record', () => {
    const i = inventory(); i.records[PREFIX + 'orphan'] = { kind: 'read', raw: JSON.stringify(active()) };
    expect(gate(i)).toMatchObject({ status: 'recovery-required', reason: 'incomplete-inventory' });
  });
  it('fails closed for unsupported coordination/storage, storage denial and invalid observations', () => {
    expect(classifyMockProtection({ kind: 'unsupported', reason: 'coordination-unavailable' })).toEqual({ status: 'unsupported', reason: 'coordination-unavailable' });
    expect(classifyMockProtection({ kind: 'storage-failure' })).toMatchObject({ status: 'recovery-required', reason: 'storage-unavailable' });
    const i = inventory(); i.checkedAt = NOW - 1;
    expect(gate(i).status).toBe('recovery-required');
    expect(mockGateSchema.safeParse({ status: 'clear', warnings: [], rawRecord: 'private' }).success).toBe(false);
  });
  it('imports no Mock writers; pure Phase 1 modules retain no persistence; Results delegates Guided launch without writers', () => {
    const dir = new URL('../src/domain/guided/', import.meta.url);
    for (const file of readdirSync(dir).filter(p => p.endsWith('.ts'))) {
      const text = readFileSync(new URL(file, dir), 'utf8');
      expect(text).not.toMatch(/\b(saveAttempt|submitStoredAttempt|startStoredAttempt|answerQuestion|setFlag|setCurrentQuestion)\b/);
      if (!['storage.ts', 'access.ts', 'browserProtection.ts', 'runtime.ts'].includes(file)) {
        expect(text).not.toMatch(/\b(localStorage|sessionStorage|indexedDB)\b|\.setItem\(|\.removeItem\(/);
      }
    }
    for (const file of ['ui/ResultsPage.tsx']) {
      expect(readFileSync(new URL('../src/' + file, import.meta.url), 'utf8')).not.toMatch(/\b(saveAttempt|submitStoredAttempt|startStoredAttempt|answerQuestion|setFlag)\b/);
    }
  });
});
