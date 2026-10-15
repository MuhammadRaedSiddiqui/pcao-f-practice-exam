import { validateQuestionBank, type QuestionBank } from './bankValidation';
import type { Difficulty } from './difficulty';
import { createAttempt, parseAttempt, remainingMilliseconds, submitAttempt, type Attempt, type SubmissionReason } from './attemptModel';
export * from './attemptModel';

export type AttemptStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type Recovery = { ok: true; attempt: Attempt | null } | { ok: false; error: string };
const prefix = 'pcao-f:attempt:v1:';
const indexKey = 'pcao-f:attempt-ids:v1';

export function recoverAttempt(storage: AttemptStorage, id: string): Recovery {
  try {
    const raw = storage.getItem(prefix + id);
    if (raw === null) return { ok: true, attempt: null };
    const attempt = parseAttempt(JSON.parse(raw));
    return attempt && attempt.id === id
      ? { ok: true, attempt }
      : { ok: false, error: 'Saved attempt is incomplete or damaged. It was not loaded.' };
  } catch {
    return { ok: false, error: 'Saved attempt could not be read from this browser.' };
  }
}

// The browser caller holds the shared storage lock throughout these synchronous writes.
export function saveAttempt(storage: AttemptStorage, attempt: Attempt, expectedRevision?: number): Recovery {
  const originals = new Map<string, string | null>();
  try {
    const index = storage.getItem(indexKey);
    const ids = JSON.parse(index ?? '[]') as unknown;
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Invalid history index');
    const key = prefix + attempt.id;
    const previous = storage.getItem(key);
    if (previous !== null) {
      const recovered = recoverAttempt(storage, attempt.id);
      if (!recovered.ok || !recovered.attempt) return recovered;
      const latest = recovered.attempt;
      if (JSON.stringify(latest) === JSON.stringify(attempt)) return { ok: true, attempt: latest };
      if (latest.status === 'submitted') return { ok: false, error: 'This attempt was already submitted in another tab. Its report was kept.' };
      if (attempt.difficulty !== latest.difficulty) return { ok: false, error: 'An existing attempt cannot change difficulty. Start another exam to choose a different level.' };
      if ((expectedRevision !== undefined && expectedRevision !== (latest.revision ?? 0)) ||
          (attempt.revision ?? 0) !== (latest.revision ?? 0) + 1) {
        return { ok: false, error: 'This attempt changed in another tab. The latest saved answers were loaded. Try your change again.' };
      }
    } else if (expectedRevision !== undefined) {
      return { ok: false, error: 'This attempt is no longer saved. It may have been replaced in another tab.' };
    }
    storage.setItem(key, JSON.stringify(attempt));
    originals.set(key, previous);
    // Existing edits only need one write; keep the history index stable.
    if (!ids.includes(attempt.id)) {
      storage.setItem(indexKey, JSON.stringify([...new Set([attempt.id, ...ids])]));
      originals.set(indexKey, index);
    }
    return { ok: true, attempt };
  } catch {
    let restored = true;
    for (const [key, value] of originals) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); }
      catch { restored = false; }
    }
    return { ok: false, error: restored
      ? 'Attempt could not be saved in this browser. Check available storage.'
      : 'Browser storage failed during saving and recovery. Reload to check your saved answers before editing again.' };
  }
}

export function listAttempts(storage: AttemptStorage): { attempts: Attempt[]; errors: string[] } {
  try {
    const ids = JSON.parse(storage.getItem(indexKey) ?? '[]') as unknown;
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Invalid history index');
    const attempts: Attempt[] = [];
    const errors: string[] = [];
    for (const id of ids as string[]) {
      const recovered = recoverAttempt(storage, id);
      if (recovered.ok) { if (recovered.attempt) attempts.push(recovered.attempt); }
      else errors.push(`${id}: ${recovered.error}`);
    }
    return { attempts, errors };
  } catch {
    return { attempts: [], errors: ['Attempt history could not be read from this browser.'] };
  }
}

export function submitStoredAttempt(storage: AttemptStorage, id: string, now = Date.now(), reason: SubmissionReason = 'manual'): Recovery {
  const recovered = recoverAttempt(storage, id);
  if (!recovered.ok || !recovered.attempt) return recovered;
  if (recovered.attempt.status === 'submitted') return recovered;
  return saveAttempt(storage, submitAttempt(recovered.attempt, now, reason), recovered.attempt.revision ?? 0);
}

export type StartRecovery = Recovery | { ok: false; error: string; unfinishedAttempts: Attempt[] };

// Replace only confirmed unfinished attempts; restore prior records if a write fails.
export function startStoredAttempt(
  storage: AttemptStorage, bank: QuestionBank, confirmedIds: readonly string[] = [], now = Date.now(), difficulty?: Difficulty,
): StartRecovery {
  const validation = validateQuestionBank(bank);
  if (!validation.ok) return { ok: false, error: 'The reviewed question bank is unavailable. A new exam cannot start.' };
  const loaded = listAttempts(storage);
  if (loaded.errors.length) return { ok: false, error: 'Your saved attempts could not be read safely. A new exam cannot start. Try again after checking browser storage.' };
  // An expired attempt earns a report before a new start can replace anything.
  for (const item of loaded.attempts) {
    if (item.status === 'in-progress' && remainingMilliseconds(item.deadlineAt, now) === 0) {
      const submitted = submitStoredAttempt(storage, item.id, now, 'time expired');
      if (!submitted.ok) return submitted;
    }
  }
  const unfinished = loaded.attempts.filter(item => item.status === 'in-progress' && remainingMilliseconds(item.deadlineAt, now) > 0);
  if (unfinished.some(item => !confirmedIds.includes(item.id))) {
    return { ok: false, error: 'Confirm before abandoning your unfinished attempt.', unfinishedAttempts: unfinished };
  }
  const originals = new Map<string, string | null>();
  try {
    const next = createAttempt(validation.bank, now, undefined, difficulty);
    const ids = JSON.parse(storage.getItem(indexKey) ?? '[]') as string[];
    const unfinishedIds = new Set(unfinished.map(item => item.id));
    const keys = [indexKey, prefix + next.id, ...unfinished.map(item => prefix + item.id)];
    for (const key of keys) originals.set(key, storage.getItem(key));
    storage.setItem(prefix + next.id, JSON.stringify(next));
    for (const item of unfinished) storage.removeItem(prefix + item.id);
    storage.setItem(indexKey, JSON.stringify([next.id, ...ids.filter(id => !unfinishedIds.has(id))]));
    return { ok: true, attempt: next };
  } catch {
    let restored = true;
    for (const [key, value] of originals) {
      try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); }
      catch { restored = false; }
    }
    return { ok: false, error: restored
      ? 'The exam could not be saved. Your existing attempts were kept. Check available browser storage and try again.'
      : 'Browser storage failed while saving the exam. Reload to check your saved attempts before trying again.' };
  }
}
