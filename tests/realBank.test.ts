import { describe, expect, it } from 'vitest';
import source from '../public/question-bank.json';
import { validateQuestionBank } from '../src/domain/bank';
import { answerQuestion, createAttempt, gradeAttempt, submitAttempt } from '../src/domain/attempt';

describe('published PCAO-F bank', () => {
  it('validates as the reviewed 60-question version 1.1.0 bank', () => {
    const result = validateQuestionBank(source);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.bank.version).toBe('1.1.0');
    expect(result.bank.questions).toHaveLength(60);
  });

  it('grades real single and multiple-response questions from its frozen snapshot', () => {
    const result = validateQuestionBank(source);
    if (!result.ok) throw new Error(result.errors.join(' '));
    const single = result.bank.questions.find(q => q.selectionCount === 1);
    const multi = result.bank.questions.find(q => q.selectionCount > 1);
    if (!single || !multi) throw new Error('Representative questions missing');
    let attempt = createAttempt(result.bank, 1000, 'real-bank-test');
    attempt = answerQuestion(attempt, single.id, single.correctOptionIds, 2000);
    attempt = answerQuestion(attempt, multi.id, [...multi.correctOptionIds].reverse(), 2000);
    expect(gradeAttempt(attempt)).toMatchObject({ correct: 2, total: 60, percentage: 3.3 });
    expect(Object.isFrozen(attempt.snapshot.questions[0])).toBe(true);
    const submitted = submitAttempt(attempt, 3000);
    expect(submitAttempt(submitted, 4000)).toBe(submitted);
  });
});
