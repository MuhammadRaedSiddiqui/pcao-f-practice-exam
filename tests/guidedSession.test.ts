import { beforeAll, describe, it, expect } from 'vitest';
import { applyCommand, questionPresentation, learningSummary, isValidTransition, validateGuidedSession, startSession,
  type ValidatedGuidedSession } from '../src/domain/guided/session';
import type { GuidedCommand } from '../src/domain/guided/schema';
import { syntheticSession, NOW, SESSION_ID, commandId, unwrap } from './fixtures/syntheticGuidance';

describe('Pure Guided sessions', () => {
  let f: Awaited<ReturnType<typeof syntheticSession>>;
  beforeAll(async () => { f = await syntheticSession(); });
  const act = (s: ValidatedGuidedSession, c: GuidedCommand, now = NOW) => unwrap(applyCommand(s, c, s.revision, now)).session;
  const select = (s: ValidatedGuidedSession, questionId: string, ids: string[]) => act(s, { kind: 'select', questionId, ids });
  it('creates an empty deeply frozen subset independent of Mock data', () => {
    expect(f.session.items).toHaveLength(5); expect(f.session.revision).toBe(0);
    expect(f.session.responses.T1).toEqual({ selectedOptionIds: [], maxHintRevealed: 0, commitment: null });
    expect(Object.isFrozen(f.session.items[0].question.options[0])).toBe(true);
    expect(Object.keys(f.session).sort()).not.toContain('deadlineAt');
  });
  it('revalidates full source and selected set on creation', async () => {
    const request = { kind: 'standalone' as const, bank: f.bank, difficulty: 'intermediate' as const, selectionSize: 5 as const,
      setIndex: 0, id: SESSION_ID, now: NOW };
    expect(await startSession({ ...request, bank: { ...f.bank, questions: f.bank.questions.slice(0, 5) } }, f.release, f.catalog))
      .toEqual({ ok: false, code: 'invalid-source' });
    const set2 = unwrap(await startSession({ ...request, setIndex: 1 }, f.release, f.catalog));
    expect(set2.items.map(i => i.question.id)).toEqual(['T6', 'T7', 'T8', 'T9', 'T10']);
  });
  it('replaces radio choices, clears drafts, caps checkboxes and rejects duplicates/unknown options', () => {
    let s = select(f.session, 'T2', ['A']); s = select(s, 'T2', ['B']); s = select(s, 'T2', []);
    expect(s.responses.T2.selectedOptionIds).toEqual([]);
    for (const ids of [['A', 'B'], ['A', 'A'], ['Z']]) {
      expect(applyCommand(s, { kind: 'select', questionId: 'T2', ids }, s.revision, NOW)).toEqual({ ok: false, code: 'invalid-command' });
    }
    expect(select(s, 'T1', ['B', 'C']).responses.T1.selectedOptionIds).toEqual(['B', 'C']);
    expect(f.session.responses.T2.selectedOptionIds).toEqual([]);
  });
  it('reveals three sequential hints independently of selections, clear and navigation', () => {
    let s = f.session;
    for (let n = 1; n <= 3; n++) {
      s = act(s, { kind: 'revealNextHint', questionId: 'T1' });
      s = select(s, 'T1', n === 2 ? [] : ['B']);
      s = act(s, { kind: 'navigate', index: 1 }); s = act(s, { kind: 'navigate', index: 0 });
      expect(s.responses.T1.maxHintRevealed).toBe(n);
      expect(unwrap(questionPresentation(s, 'T1')).revealedHints).toHaveLength(n);
    }
    expect(applyCommand(s, { kind: 'revealNextHint', questionId: 'T1' }, s.revision, NOW)).toEqual({ ok: false, code: 'invalid-command' });
    const changed = structuredClone(s); changed.responses.T1.maxHintRevealed = 0; changed.revision++;
    expect(isValidTransition(s, changed)).toBe(false);
  });
  it.each([
    ['T2', ['A'], true], ['T2', ['B'], false], ['T1', ['C', 'A'], true],
    ['T1', ['A', 'B'], false], ['T3', ['C', 'A', 'B'], true], ['T3', ['A', 'B', 'D'], false],
  ] as const)('locks exact-cardinality %s %j and derives correctness %s only after commit', (id, ids, expected) => {
    const draft = select(f.session, id, [...ids]);
    expect(unwrap(questionPresentation(draft, id)).phase).toBe('answering');
    const committed = act(draft, { kind: 'commit', questionId: id, commandId: commandId(1) });
    const feedback = unwrap(questionPresentation(committed, id));
    expect(feedback.phase === 'committed' && feedback.isCorrect).toBe(expected);
    expect(committed.responses[id].selectedOptionIds).toEqual(ids);
    for (const command of [{ kind: 'select', questionId: id, ids: [] }, { kind: 'revealNextHint', questionId: id },
      { kind: 'commit', questionId: id, commandId: commandId(2) }] as GuidedCommand[]) {
      expect(applyCommand(committed, command, committed.revision, NOW)).toEqual({ ok: false, code: 'locked' });
    }
  });
  it('requires exact cardinality for Check answer without scoring partial selections', () => {
    for (const ids of [[], ['A']]) {
      const s = select(f.session, 'T1', ids);
      expect(applyCommand(s, { kind: 'commit', questionId: 'T1', commandId: commandId(1) }, s.revision, NOW)).toEqual({ ok: false, code: 'incomplete' });
      expect(learningSummary(s).correct).toBe(0);
    }
  });
  it('returns identical saved commitment on lost acknowledgement before stale-revision rejection', () => {
    const draft = select(f.session, 'T1', ['A', 'C']);
    const command = { kind: 'commit' as const, questionId: 'T1', commandId: commandId(1) };
    const s = act(draft, command);
    expect(unwrap(applyCommand(s, command, 0, NOW)).session).toBe(s);
    expect(unwrap(applyCommand(s, command, 0, NOW)).changed).toBe(false);
    expect(applyCommand(draft, command, 0, NOW)).toEqual({ ok: false, code: 'conflict' });
    expect(applyCommand(s, { kind: 'select', questionId: 'T2', ids: ['A'] }, 0, NOW)).toEqual({ ok: false, code: 'conflict' });
  });
  it('precommit presentation has an exact allowlist and no feedback for 0–3 hints', () => {
    let s = select(f.session, 'T1', ['A', 'C']);
    const allowed = ['phase', 'questionId', 'stemMarkdown', 'options', 'selectionCount', 'selectedOptionIds', 'revealedHints', 'maxHintRevealed'].sort();
    for (let n = 0; n <= 3; n++) {
      const model = unwrap(questionPresentation(s, 'T1'));
      expect(Object.keys(model).sort()).toEqual(allowed);
      const raw = JSON.stringify(model);
      for (const secret of ['Synthetic postcommit reasoning', 'Synthetic claim', 'Synthetic definition', 'Synthetic strength', 'Synthetic explanation', 'correctOptionIds', 'isCorrect']) expect(raw).not.toContain(secret);
      if (n < 3) s = act(s, { kind: 'revealNextHint', questionId: 'T1' });
    }
  });
  it('requires all commitments, keeps last feedback open and completes once without a timer', () => {
    let s = f.session;
    expect(applyCommand(s, { kind: 'finish', commandId: commandId(9) }, s.revision, NOW)).toEqual({ ok: false, code: 'incomplete' });
    for (let i = 0; i < s.items.length; i++) {
      const item = s.items[i];
      if (i === 0) s = act(s, { kind: 'revealNextHint', questionId: item.question.id });
      s = select(s, item.question.id, item.question.correctOptionIds);
      s = act(s, { kind: 'commit', questionId: item.question.id, commandId: commandId(i + 1) });
    }
    expect(s.status).toBe('in-progress'); expect(s.currentIndex).toBe(0);
    expect(learningSummary(s)).toMatchObject({ total: 5, committed: 5, correct: 5, correctWithoutHints: 4, hintsRequested: 1, revisitQuestionIds: ['T1'] });
    s = act(s, { kind: 'finish', commandId: commandId(9) }, NOW - 1000);
    expect(s.completedAt).toBe(NOW);
    expect(unwrap(applyCommand(s, { kind: 'finish', commandId: commandId(9) }, 0, NOW)).session).toBe(s);
    expect(applyCommand(s, { kind: 'navigate', index: 1 }, s.revision, NOW)).toEqual({ ok: false, code: 'locked' });
  });
  it('rejects altered immutable fields, changed commitments, new fields and invalid commands', async () => {
    const s = act(select(f.session, 'T1', ['A', 'C']), { kind: 'commit', questionId: 'T1', commandId: commandId(1) });
    for (const change of [
      (n: typeof s) => { n.items[0].guide.reasoningMarkdown += 'changed'; },
      (n: typeof s) => { n.responses.T1.selectedOptionIds = ['A', 'B']; },
      (n: typeof s) => { n.responses.T1.commitment = null; },
      (n: typeof s) => { n.startedAt -= 1; },
    ]) { const next = structuredClone(s); next.revision++; change(next); expect(isValidTransition(s, next)).toBe(false); }
    expect(applyCommand(s, { kind: 'navigate', index: 60 }, s.revision, NOW)).toEqual({ ok: false, code: 'invalid-command' });
    expect(applyCommand(s, { kind: 'navigate', index: 1, extra: true } as GuidedCommand, s.revision, NOW)).toEqual({ ok: false, code: 'invalid-command' });
    const revoked = structuredClone(f.catalog); revoked[0].revokedDigests.push(f.session.items[0].guideDigest);
    expect(await validateGuidedSession(s, revoked)).toEqual({ ok: false, code: 'revoked' });
  });
});
