import { loadQuestionBank, type BankLoadState } from './bank';

export type Difficulty = 'intermediate' | 'advanced';
export type DifficultyBankState = BankLoadState | { status: 'unavailable' };
export type DifficultyCatalog = Record<Difficulty, {
  label: string;
  bankPath: string;
  available: boolean;
  comparison: string;
  details: readonly string[];
}>;

export const difficultyCatalog: DifficultyCatalog = {
  intermediate: {
    label: 'Intermediate', bankPath: 'easy-question-bank.json', available: true,
    comparison: 'Compared with Advanced',
    details: [
      'More direct application of individual concepts.',
      'More focused scenarios with fewer competing constraints.',
      'Emphasis on identifying a suitable approach.',
    ],
  },
  advanced: {
    label: 'Advanced', bankPath: 'question-bank.json', available: true,
    comparison: 'Compared with Intermediate',
    details: [
      'More complex scenarios combining multiple concepts.',
      'More competing constraints and tradeoffs to evaluate.',
      'Emphasis on evaluating which approach best fits the scenario.',
    ],
  },
};

export function difficultyLabel(difficulty?: Difficulty): string {
  return difficulty ? difficultyCatalog[difficulty].label : 'Original exam';
}

// Each level owns its cache and request; switching the UI cannot mix bank responses.
export function createDifficultyBankLoader(fetcher: typeof fetch = fetch, catalog = difficultyCatalog) {
  const cache = new Map<Difficulty, DifficultyBankState>();
  const pending = new Map<Difficulty, Promise<DifficultyBankState>>();
  return (difficulty: Difficulty, retry = false): Promise<DifficultyBankState> => {
    if (!catalog[difficulty].available) return Promise.resolve({ status: 'unavailable' });
    const request = pending.get(difficulty);
    if (request) return request;
    const saved = cache.get(difficulty);
    if (!retry && saved) return Promise.resolve(saved);
    const next = loadQuestionBank(fetcher, catalog[difficulty].bankPath).then(state => {
      cache.set(difficulty, state);
      pending.delete(difficulty);
      return state;
    });
    pending.set(difficulty, next);
    return next;
  };
}
