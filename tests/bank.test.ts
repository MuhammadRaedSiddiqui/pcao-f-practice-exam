import { describe, expect, it } from 'vitest';
import { validateQuestionBank } from '../src/domain/bank';
import { syntheticBank } from './fixtures/syntheticBank';

const invalid = (bank: unknown) => {
  const result = validateQuestionBank(bank, false);
  expect(result.ok).toBe(false);
  return result.ok ? [] : result.errors;
};

describe('question bank validation', () => {
  it('accepts the complete synthetic fixture only in fixture mode', () => {
    expect(validateQuestionBank(syntheticBank(), false).ok).toBe(true);
    const blocked = validateQuestionBank(syntheticBank());
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.errors.join(' ')).toContain('reviewed question bank is not available');
  });
  it('rejects missing questions and incorrect domain totals', () => {
    const bank = syntheticBank();
    bank.questions.pop();
    const errors = invalid(bank);
    expect(errors.join(' ')).toContain('exactly 60');
    expect(errors.join(' ')).toContain('D7 must contain 6');
  });
  it('rejects duplicate IDs, unknown domains, and repeated option IDs', () => {
    const bank = syntheticBank();
    bank.questions[1].id = bank.questions[0].id;
    bank.questions[1].primaryDomain = 'D9';
    bank.questions[1].options[1].id = 'A';
    const errors = invalid(bank).join(' ');
    expect(errors).toContain('Duplicate question ID');
    expect(errors).toContain('undefined domain D9');
    expect(errors).toContain('duplicate option ID A');
  });
  it('checks answer cardinality, selection limits, and option explanations', () => {
    const bank = syntheticBank();
    bank.questions[0].selectionCount = 4;
    bank.questions[0].correctOptionIds = ['A', 'A'];
    delete bank.questions[0].optionExplanations.B;
    const errors = invalid(bank).join(' ');
    expect(errors).toContain('selects more options');
    expect(errors).toContain('needs exactly 4');
    expect(errors).toContain('repeats a correct option ID');
    expect(errors).toContain('needs an explanation for option B');
  });
  it('reports required text fields', () => {
    const bank = syntheticBank();
    bank.questions[0].stemMarkdown = '';
    expect(invalid(bank).join(' ')).toContain('questions.0.stemMarkdown');
  });
});
