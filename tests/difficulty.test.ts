import { describe, expect, it, vi } from 'vitest';
import { createDifficultyBankLoader, difficultyCatalog, difficultyLabel } from '../src/domain/difficulty';
import { syntheticBank } from './fixtures/syntheticBank';

function reviewedBank(version: string) {
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed';
  bank.version = version;
  return bank;
}

describe('difficulty bank loading', () => {
  it('does not request an unavailable bank or substitute Advanced content', async () => {
    const fetcher = vi.fn<typeof fetch>();
    const catalog = { ...difficultyCatalog, intermediate: { ...difficultyCatalog.intermediate, available: false } };
    const load = createDifficultyBankLoader(fetcher, catalog);
    expect(await load('intermediate')).toEqual({ status: 'unavailable' });
    expect(fetcher).not.toHaveBeenCalled();
    expect(difficultyLabel()).toBe('Original exam');
  });

  it('deduplicates simultaneous requests and caches validated banks', async () => {
    let respond!: (response: Response) => void;
    const fetcher = vi.fn<typeof fetch>(() => new Promise(resolve => { respond = resolve; }));
    const load = createDifficultyBankLoader(fetcher);
    const first = load('advanced');
    const second = load('advanced');
    expect(first).toBe(second);
    respond(Response.json(reviewedBank('advanced-fixture')));
    expect(await first).toMatchObject({ status: 'ready', bank: { version: 'advanced-fixture' } });
    expect(await load('advanced')).toEqual(await first);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(fetcher.mock.calls[0][0])).toMatch(/question-bank\.json$/);
  });

  it('keeps independent banks when Intermediate completes before Advanced', async () => {
    const responses = new Map<string, (response: Response) => void>();
    const fetcher = vi.fn<typeof fetch>(url => new Promise(resolve => { responses.set(String(url), resolve); }));
    const catalog = { ...difficultyCatalog, intermediate: { ...difficultyCatalog.intermediate, available: true } };
    const load = createDifficultyBankLoader(fetcher, catalog);
    const advanced = load('advanced');
    const intermediate = load('intermediate');
    responses.get('/easy-question-bank.json')!(Response.json(reviewedBank('intermediate-fixture')));
    expect(await intermediate).toMatchObject({ status: 'ready', bank: { version: 'intermediate-fixture' } });
    responses.get('/question-bank.json')!(Response.json(reviewedBank('advanced-fixture')));
    expect(await advanced).toMatchObject({ status: 'ready', bank: { version: 'advanced-fixture' } });
    expect(await load('intermediate')).toEqual(await intermediate);
  });

  it('isolates invalid-bank failures and permits an explicit retry', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ invalid: true }))
      .mockResolvedValueOnce(Response.json(reviewedBank('advanced-fixture')))
      .mockResolvedValueOnce(Response.json(reviewedBank('intermediate-fixture')));
    const catalog = { ...difficultyCatalog, intermediate: { ...difficultyCatalog.intermediate, available: true } };
    const load = createDifficultyBankLoader(fetcher, catalog);
    expect(await load('intermediate')).toMatchObject({ status: 'error' });
    expect(await load('advanced')).toMatchObject({ status: 'ready', bank: { version: 'advanced-fixture' } });
    expect(await load('intermediate', true)).toMatchObject({ status: 'ready', bank: { version: 'intermediate-fixture' } });
  });
});
