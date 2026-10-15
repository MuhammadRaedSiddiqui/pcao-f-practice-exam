import { validateQuestionBank, type QuestionBank } from './bankValidation';
export * from './bankValidation';

export type BankLoadState =
  | { status: 'loading' }
  | { status: 'ready'; bank: QuestionBank }
  | { status: 'error'; errors: string[] };

export async function loadQuestionBank(fetcher: typeof fetch = fetch, path = 'question-bank.json'): Promise<BankLoadState> {
  try {
    const response = await fetcher(`${import.meta.env.BASE_URL}${path}`, { cache: 'no-store' });
    if (!response.ok) return { status: 'error', errors: [`Question bank request failed (HTTP ${response.status}).`] };
    const result = validateQuestionBank(await response.json());
    return result.ok ? { status: 'ready', bank: result.bank } : { status: 'error', errors: result.errors };
  } catch {
    return { status: 'error', errors: ['Question bank could not be loaded. Check your connection and the deployed data file.'] };
  }
}
