import { describe, expect, it } from 'vitest';
import { answerQuestion, createAttempt, gradeAttempt, isExactSet, recoverAttempt,
  remainingMilliseconds, saveAttempt, selectionStatus, setCurrentQuestion, setFlag, submitAttempt, submitStoredAttempt, startStoredAttempt, listAttempts } from '../src/domain/attempt';
import { syntheticBank } from './fixtures/syntheticBank';

function reviewedFixture() {
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed';
  return bank;
}
function memoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  };
}

describe('attempt logic', () => {
  it('preserves chosen difficulty and its snapshot through edits, recovery and submission', () => {
    const storage = memoryStorage();
    const bank = reviewedFixture();
    const first = startStoredAttempt(storage, bank, [], 1000, 'advanced');
    if (!first.ok || !first.attempt) throw new Error('Expected an Advanced fixture attempt');
    expect(first.attempt.difficulty).toBe('advanced');
    const edited = setFlag(answerQuestion(first.attempt, 'T1', ['A', 'C'], 2000), 'T1', true, 2000);
    // Each persisted operation advances one revision.
    expect(saveAttempt(storage, answerQuestion(first.attempt, 'T1', ['A', 'C'], 2000)).ok).toBe(true);
    expect(saveAttempt(storage, edited).ok).toBe(true);
    const submitted = submitStoredAttempt(storage, first.attempt.id, 3000);
    expect(submitted.ok && submitted.attempt?.difficulty).toBe('advanced');
    expect(submitted.ok && submitted.attempt?.result?.correct).toBe(1);
    bank.questions[0].stemMarkdown = 'Changed fixture';
    const recovered = recoverAttempt(storage, first.attempt.id);
    expect(recovered).toEqual(submitted);
    expect(recovered.ok && recovered.attempt?.snapshot.questions[0].stemMarkdown).not.toBe('Changed fixture');
  });

  it('rejects invalid saved difficulties and prevents relabelling an existing attempt', () => {
    const storage = memoryStorage();
    const first = createAttempt(reviewedFixture(), 1000, 'difficulty-fixture', 'intermediate');
    saveAttempt(storage, first);
    expect(saveAttempt(storage, { ...setFlag(first, 'T1', true, 2000), difficulty: 'advanced' }, 0).ok).toBe(false);
    expect(recoverAttempt(storage, first.id)).toEqual({ ok: true, attempt: first });
    storage.setItem('pcao-f:attempt:v1:' + first.id, JSON.stringify({ ...first, difficulty: 'unknown' }));
    expect(recoverAttempt(storage, first.id).ok).toBe(false);
  });

  it('keeps legacy attempts without difficulty metadata readable and editable', () => {
    const storage = memoryStorage();
    const legacy = createAttempt(reviewedFixture(), 1000, 'original-exam');
    expect(legacy).not.toHaveProperty('difficulty');
    saveAttempt(storage, legacy);
    const edited = setFlag(legacy, 'T1', true, 2000);
    expect(saveAttempt(storage, edited).ok).toBe(true);
    const submitted = submitStoredAttempt(storage, legacy.id, 3000);
    expect(submitted.ok && submitted.attempt?.difficulty).toBeUndefined();
    expect(recoverAttempt(storage, legacy.id)).toEqual(submitted);
  });

  it('counts insufficient selections as unanswered and exact cardinality as answered', () => {
    const question = syntheticBank().questions[0];
    expect(selectionStatus(question, [])).toBe('unanswered');
    expect(selectionStatus(question, ['A'])).toBe('unanswered');
    expect(selectionStatus(question, ['C', 'A'])).toBe('answered');
    expect(selectionStatus(question, ['B', 'C'])).toBe('answered');
    expect(selectionStatus(question, ['A', 'B', 'C'])).not.toBe('answered');
  });
  it('grades only the exact set regardless of order', () => {
    const bank = reviewedFixture();
    const question = bank.questions[0];
    expect(isExactSet(question, ['C', 'A'])).toBe(true);
    expect(isExactSet(question, ['A'])).toBe(false);
    expect(isExactSet(question, ['A', 'B'])).toBe(false);
    expect(isExactSet(question, ['A', 'C', 'C'])).toBe(false);
    let attempt = createAttempt(bank, 1000, 'attempt-1');
    attempt = answerQuestion(attempt, question.id, ['C', 'A'], 2000);
    attempt = answerQuestion(attempt, bank.questions[1].id, ['B'], 2000);
    const score = gradeAttempt(attempt);
    expect(score).toMatchObject({ correct: 1, total: 60, percentage: 1.7 });
    expect(score.byDomain.D1).toEqual({ correct: 1, total: 8 });
  });
  it('keeps a frozen original bank when published content changes', () => {
    const published = reviewedFixture();
    const attempt = createAttempt(published, 1000, 'attempt-2');
    published.version = 'fixture-2';
    published.questions[0].correctOptionIds = ['B', 'C'];
    expect(attempt.snapshot.version).toBe('fixture-1');
    expect(attempt.snapshot.questions[0].correctOptionIds).toEqual(['A', 'C']);
    expect(Object.isFrozen(attempt.snapshot.questions[0])).toBe(true);
    const storage = memoryStorage();
    expect(saveAttempt(storage, attempt).ok).toBe(true);
    const restored = recoverAttempt(storage, attempt.id);
    expect(restored.ok && restored.attempt?.snapshot.questions[0].correctOptionIds).toEqual(['A', 'C']);
  });
  it('preserves flags and deadline, and submits idempotently', () => {
    const storage = memoryStorage();
    let attempt = createAttempt(reviewedFixture(), 1000, 'attempt-3');
    attempt = setFlag(attempt, attempt.currentQuestionId, true, 2000);
    expect(saveAttempt(storage, attempt).ok).toBe(true);
    expect(remainingMilliseconds(attempt.deadlineAt, attempt.deadlineAt + 1)).toBe(0);
    const first = submitStoredAttempt(storage, attempt.id, attempt.deadlineAt + 1);
    const second = submitStoredAttempt(storage, attempt.id, attempt.deadlineAt + 5000);
    expect(first.ok && first.attempt?.submissionReason).toBe('time expired');
    expect(second).toEqual(first);
    expect(first.ok && first.attempt?.flags).toEqual([attempt.currentQuestionId]);
  });
  it('saves partial answers and navigation, enforces limits, and locks every edit at expiry', () => {
    const storage = memoryStorage();
    let attempt = createAttempt(reviewedFixture(), 1000, 'partial');
    attempt = answerQuestion(attempt, 'T1', ['A'], 2000);
    attempt = setFlag(attempt, 'T1', true, 2000);
    attempt = setCurrentQuestion(attempt, 'T60', 2000);
    expect(saveAttempt(storage, attempt).ok).toBe(true);
    expect(recoverAttempt(storage, attempt.id)).toEqual({ ok: true, attempt });
    expect(() => answerQuestion(attempt, 'T1', ['A', 'B', 'C'], 2000)).toThrow();
    expect(() => answerQuestion(attempt, 'T1', ['A', 'A'], 2000)).toThrow();
    expect(() => setCurrentQuestion(attempt, 'unknown', 2000)).toThrow();
    expect(() => answerQuestion(attempt, 'T1', [], attempt.deadlineAt)).toThrow('Time has expired');
    expect(() => setCurrentQuestion(attempt, 'T1', attempt.deadlineAt)).toThrow('Time has expired');
    expect(() => setFlag(attempt, 'T1', false, attempt.deadlineAt)).toThrow('Time has expired');
    const result = submitStoredAttempt(storage, attempt.id, attempt.deadlineAt);
    if (!result.ok || !result.attempt) throw new Error('Expected finalized attempt');
    expect(result.attempt.answers.T1).toEqual(['A']);
    expect(result.attempt.currentQuestionId).toBe('T60');
    expect(() => answerQuestion(result.attempt!, 'T1', [], 2000)).toThrow('already been submitted');
    expect(submitStoredAttempt(storage, attempt.id, attempt.deadlineAt + 10_000)).toEqual(result);
  });

  it('persists a graded result for blanks and flagged partials and rejects every post-submit edit', () => {
    const storage = memoryStorage();
    let attempt = createAttempt(reviewedFixture(), 1000, 'graded');
    attempt = answerQuestion(attempt, 'T1', ['A'], 2000);
    attempt = setFlag(attempt, 'T1', true, 2000);
    saveAttempt(storage, attempt);
    const first = submitStoredAttempt(storage, attempt.id, 3000);
    if (!first.ok || !first.attempt) throw new Error('Expected submission');
    expect(first.attempt.result).toEqual(gradeAttempt(attempt));
    expect(first.attempt.result).toMatchObject({ correct: 0, total: 60, percentage: 0 });
    expect(first.attempt.answers).toEqual({ T1: ['A'] });
    expect(first.attempt.flags).toEqual(['T1']);
    expect(() => answerQuestion(first.attempt!, 'T1', ['A', 'C'], 4000)).toThrow('already been submitted');
    expect(() => setFlag(first.attempt!, 'T1', false, 4000)).toThrow('already been submitted');
    expect(() => setCurrentQuestion(first.attempt!, 'T2', 4000)).toThrow('already been submitted');
    expect(submitStoredAttempt(storage, attempt.id, attempt.deadlineAt, 'time expired')).toEqual(first);
    expect(listAttempts(storage).attempts).toHaveLength(1);
  });

  it('gives expiry priority over manual submission at the deadline and writes one consistent result', () => {
    const original = memoryStorage();
    let submittedWrites = 0;
    const storage = {
      ...original,
      setItem: (key: string, value: string) => {
        if (key.startsWith('pcao-f:attempt:v1:') && JSON.parse(value).status === 'submitted') submittedWrites++;
        original.setItem(key, value);
      },
    };
    const attempt = answerQuestion(createAttempt(reviewedFixture(), 1000, 'race'), 'T1', ['C', 'A'], 2000);
    saveAttempt(storage, attempt);
    const manual = submitStoredAttempt(storage, attempt.id, attempt.deadlineAt, 'manual');
    const expired = submitStoredAttempt(storage, attempt.id, attempt.deadlineAt + 1000, 'time expired');
    expect(expired).toEqual(manual);
    expect(manual.ok && manual.attempt?.submissionReason).toBe('time expired');
    expect(manual.ok && manual.attempt?.result?.correct).toBe(1);
    expect(submittedWrites).toBe(1);
  });

  it('recovers legacy submitted reports without a stored score and rejects inconsistent saved grades', () => {
    const storage = memoryStorage();
    const attempt = createAttempt(reviewedFixture(), 1000, 'legacy');
    saveAttempt(storage, attempt);
    const submitted = submitStoredAttempt(storage, attempt.id, 2000);
    if (!submitted.ok || !submitted.attempt) throw new Error('Expected submission');
    const key = 'pcao-f:attempt:v1:' + attempt.id;
    const legacy = { ...submitted.attempt };
    delete legacy.result;
    storage.setItem(key, JSON.stringify(legacy));
    expect(recoverAttempt(storage, attempt.id)).toEqual({ ok: true, attempt: legacy });
    storage.setItem(key, JSON.stringify({ ...submitted.attempt, result: { ...submitted.attempt.result!, correct: 60 } }));
    expect(recoverAttempt(storage, attempt.id).ok).toBe(false);
  });

  it('blocks real attempts for synthetic content', () => {
    expect(() => createAttempt(syntheticBank())).toThrow('reviewed question bank is not available');
  });
});

describe('starting stored attempts', () => {
  it('revalidates the loaded bank before writing anything', () => {
    const storage = memoryStorage();
    const bank = reviewedFixture();
    bank.questions[0].correctOptionIds = [];
    expect(startStoredAttempt(storage, bank).ok).toBe(false);
    expect(listAttempts(storage).attempts).toEqual([]);
    expect(startStoredAttempt(storage, syntheticBank()).ok).toBe(false);
  });

  it('blocks repeated starts until the existing attempt is explicitly confirmed', () => {
    const storage = memoryStorage();
    const first = startStoredAttempt(storage, reviewedFixture(), [], 1000);
    expect(first.ok && first.attempt?.currentQuestionId).toBe('T1');
    const again = startStoredAttempt(storage, reviewedFixture(), [], 2000);
    expect(!again.ok && 'unfinishedAttempts' in again && again.unfinishedAttempts[0].id)
      .toBe(first.ok && first.attempt?.id);
    expect(listAttempts(storage).attempts).toHaveLength(1);
    const saved = listAttempts(storage).attempts[0];
    expect(saved.deadlineAt).toBe(1000 + 120 * 60_000);
    expect(Object.isFrozen(saved.snapshot.questions[0].options)).toBe(true);
  });

  it('replaces only confirmed unfinished attempts and keeps completed reports', () => {
    const storage = memoryStorage();
    const report = createAttempt(reviewedFixture(), 1000, 'report');
    saveAttempt(storage, report);
    submitStoredAttempt(storage, report.id, 2000);
    const active = createAttempt(reviewedFixture(), 3000, 'active');
    saveAttempt(storage, active);
    const next = startStoredAttempt(storage, reviewedFixture(), [active.id], 4000);
    expect(next.ok).toBe(true);
    const loaded = listAttempts(storage).attempts;
    expect(loaded.map(item => item.status)).toEqual(['in-progress', 'submitted']);
    expect(recoverAttempt(storage, active.id)).toEqual({ ok: true, attempt: null });
    expect(loaded[1].id).toBe(report.id);
    expect(loaded[0].answers).toEqual({});
    expect(loaded[0].flags).toEqual([]);
  });

  it('requires new confirmation if a different unfinished attempt has appeared', () => {
    const storage = memoryStorage();
    saveAttempt(storage, createAttempt(reviewedFixture(), 1000, 'other'));
    const result = startStoredAttempt(storage, reviewedFixture(), ['stale-id'], 2000);
    expect(!result.ok && 'unfinishedAttempts' in result).toBe(true);
    expect(listAttempts(storage).attempts[0].id).toBe('other');
  });

  it('restores the original attempt if replacement fails after a partial write', () => {
    const original = memoryStorage();
    const active = setFlag(answerQuestion(createAttempt(reviewedFixture(), 1000, 'active'), 'T1', ['A'], 2000), 'T1', true, 2000);
    saveAttempt(original, active);
    let fail = true;
    const storage = {
      ...original,
      setItem: (key: string, value: string) => {
        if (key === 'pcao-f:attempt-ids:v1' && fail) { fail = false; throw new Error('Quota exceeded'); }
        original.setItem(key, value);
      },
    };
    expect(startStoredAttempt(storage, reviewedFixture(), [active.id], 3000).ok).toBe(false);
    expect(listAttempts(original).attempts).toEqual([active]);
    expect(recoverAttempt(original, active.id)).toEqual({ ok: true, attempt: active });
  });

  it('does not write when saved history is damaged or inaccessible', () => {
    const storage = memoryStorage();
    storage.setItem('pcao-f:attempt-ids:v1', '{broken');
    expect(startStoredAttempt(storage, reviewedFixture()).ok).toBe(false);
    expect(storage.getItem('pcao-f:attempt-ids:v1')).toBe('{broken');
    const denied = { ...storage, getItem: () => { throw new Error('Storage disabled'); } };
    expect(startStoredAttempt(denied, reviewedFixture()).ok).toBe(false);
  });
});

describe('storage consistency and recovery', () => {
  it('prevents new attempts and submissions from producing unrenderable dates', () => {
    expect(() => createAttempt(reviewedFixture(), 1e20, 'invalid-start')).toThrow();
    expect(() => createAttempt(reviewedFixture(), 8.64e15, 'invalid-deadline')).toThrow();
    const active = createAttempt(reviewedFixture(), 1000, 'invalid-submission');
    expect(() => submitAttempt(active, 1e20)).toThrow();
    expect(() => submitAttempt(active, 2000, 'time expired')).toThrow('deadline has not elapsed');
  });

  it('keeps submission metadata recoverable if the system clock moves behind the start', () => {
    const storage = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'clock-adjustment');
    saveAttempt(storage, active);
    const submitted = submitStoredAttempt(storage, active.id, 999);
    expect(submitted.ok && submitted.attempt?.submittedAt).toBe(active.startedAt);
    expect(recoverAttempt(storage, active.id)).toEqual(submitted);
  });

  it('keeps submission immutable when a stale tab tries to save an edit', () => {
    const storage = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'two-tabs');
    saveAttempt(storage, active);
    const submitted = submitStoredAttempt(storage, active.id, 2000);
    expect(saveAttempt(storage, answerQuestion(active, 'T1', ['A'], 3000), 0).ok).toBe(false);
    expect(recoverAttempt(storage, active.id)).toEqual(submitted);
  });

  it('rejects an older revision without overwriting another tab’s answers', () => {
    const storage = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'revision-conflict');
    saveAttempt(storage, active);
    const answered = answerQuestion(active, 'T1', ['A', 'C'], 2000);
    expect(saveAttempt(storage, answered, 0).ok).toBe(true);
    expect(saveAttempt(storage, setFlag(active, 'T1', true, 3000), 0).ok).toBe(false);
    expect(recoverAttempt(storage, active.id)).toEqual({ ok: true, attempt: answered });
  });

  it('does not resurrect an attempt that another tab replaced', () => {
    const storage = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'replaced');
    saveAttempt(storage, active);
    expect(startStoredAttempt(storage, reviewedFixture(), [active.id], 2000).ok).toBe(true);
    expect(saveAttempt(storage, setFlag(active, 'T1', true, 3000), 0).ok).toBe(false);
    expect(recoverAttempt(storage, active.id)).toEqual({ ok: true, attempt: null });
  });

  it('removes a newly written record if adding it to history fails', () => {
    const original = memoryStorage();
    const storage = { ...original, setItem: (key: string, value: string) => {
      if (key === 'pcao-f:attempt-ids:v1') throw new Error('Quota exceeded');
      original.setItem(key, value);
    } };
    const active = createAttempt(reviewedFixture(), 1000, 'partial-write');
    expect(saveAttempt(storage, active).ok).toBe(false);
    expect(original.getItem('pcao-f:attempt:v1:' + active.id)).toBeNull();
    expect(original.getItem('pcao-f:attempt-ids:v1')).toBeNull();
  });

  it('edits and submits indexed attempts with a single write each', () => {
    const original = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'single-write');
    saveAttempt(original, active);
    const writes: string[] = [];
    const storage = { ...original, setItem: (key: string, value: string) => {
      writes.push(key);
      if (key === 'pcao-f:attempt-ids:v1') throw new Error('Index writes unavailable');
      original.setItem(key, value);
    } };
    const answered = answerQuestion(active, 'T1', ['A', 'C'], 2000);
    expect(saveAttempt(storage, answered, 0).ok).toBe(true);
    expect(submitStoredAttempt(storage, active.id, 3000).ok).toBe(true);
    expect(writes).toEqual(['pcao-f:attempt:v1:single-write', 'pcao-f:attempt:v1:single-write']);
  });

  it('keeps the original answers when the record write itself fails', () => {
    const original = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'failed-edit');
    saveAttempt(original, active);
    const storage = { ...original, setItem: () => { throw new Error('Storage unavailable'); } };
    expect(saveAttempt(storage, answerQuestion(active, 'T1', ['A'], 2000), 0).ok).toBe(false);
    expect(recoverAttempt(original, active.id)).toEqual({ ok: true, attempt: active });
  });

  it('rejects unrenderable dates and inconsistent submission metadata', () => {
    const storage = memoryStorage();
    const active = createAttempt(reviewedFixture(), 1000, 'damaged-dates');
    const submitted = submitAttempt(active, 2000);
    const invalid = [
      { ...submitted, submittedAt: 1e20 },
      { ...submitted, startedAt: 1e20, deadlineAt: 1e20 + 120 * 60_000 },
      { ...submitted, submittedAt: 999 },
      { ...submitted, submissionReason: 'time expired' },
      { ...submitted, submittedAt: active.deadlineAt, submissionReason: 'manual' },
      { ...active, submittedAt: 2000 },
      { ...active, submissionReason: 'manual' },
    ];
    for (const record of invalid) {
      storage.setItem('pcao-f:attempt:v1:' + active.id, JSON.stringify(record));
      expect(recoverAttempt(storage, active.id).ok).toBe(false);
    }
  });

  it('recovers older records without revisions and versions their next edit', () => {
    const storage = memoryStorage();
    const legacy = createAttempt(reviewedFixture(), 1000, 'legacy-revision');
    delete legacy.revision;
    saveAttempt(storage, legacy);
    const recovered = recoverAttempt(storage, legacy.id);
    if (!recovered.ok || !recovered.attempt) throw new Error('Expected legacy attempt');
    const edited = setFlag(recovered.attempt, 'T1', true, 2000);
    expect(edited.revision).toBe(1);
    expect(saveAttempt(storage, edited, 0).ok).toBe(true);
    expect(recoverAttempt(storage, legacy.id)).toEqual({ ok: true, attempt: edited });
  });

  it('preserves an expired attempt’s report when a new start happens at its deadline', () => {
    const storage = memoryStorage();
    const expired = answerQuestion(createAttempt(reviewedFixture(), 1000, 'expired-start'), 'T1', ['A', 'C'], 2000);
    saveAttempt(storage, expired);
    expect(startStoredAttempt(storage, reviewedFixture(), [expired.id], expired.deadlineAt).ok).toBe(true);
    const loaded = listAttempts(storage).attempts;
    expect(loaded).toHaveLength(2);
    expect(loaded[0].status).toBe('in-progress');
    expect(loaded[1]).toMatchObject({ id: expired.id, status: 'submitted', submissionReason: 'time expired', answers: expired.answers, result: { correct: 1 } });
  });
});
