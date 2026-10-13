import { describe, expect, it } from 'vitest';
import source from '../public/question-bank.json';
import intermediateSource from '../public/easy-question-bank.json';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { difficultyCatalog } from '../src/domain/difficulty';
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

describe('uploaded Intermediate bank', () => {
  it('validates the uploaded reviewed bank and maps it to Intermediate without changing its bytes', () => {
    const result = validateQuestionBank(intermediateSource);
    if (!result.ok) throw new Error(result.errors.join(' '));
    expect(result.bank).toMatchObject({ examId: 'pcao-f-practice-easy-01', version: '1.0.0', contentStatus: 'reviewed', durationMinutes: 120 });
    expect(result.bank.questions).toHaveLength(60);
    expect(difficultyCatalog.intermediate).toMatchObject({ bankPath: 'easy-question-bank.json', available: true });
    expect(difficultyCatalog.advanced).toMatchObject({ bankPath: 'question-bank.json', available: true });
    const bytes = readFileSync(new URL('../public/easy-question-bank.json', import.meta.url));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe('f2a4f36183f2a30f79b83fc928389178e13151ea77a955819c890caf32992be4');
  });

  it('grades Intermediate selections against its own frozen bank and preserves its difficulty', () => {
    const result = validateQuestionBank(intermediateSource);
    if (!result.ok) throw new Error(result.errors.join(' '));
    const single = result.bank.questions.find(question => question.selectionCount === 1)!;
    const multi = result.bank.questions.find(question => question.selectionCount > 1)!;
    let attempt = createAttempt(result.bank, 1000, 'intermediate-bank-test', 'intermediate');
    attempt = answerQuestion(attempt, single.id, single.correctOptionIds, 2000);
    attempt = answerQuestion(attempt, multi.id, [...multi.correctOptionIds].reverse(), 2000);
    expect(gradeAttempt(attempt)).toMatchObject({ correct: 2, total: 60, percentage: 3.3 });
    result.bank.questions[0].stemMarkdown = 'Edited local test copy only';
    expect(attempt.snapshot.questions[0].stemMarkdown).not.toBe('Edited local test copy only');
    const submitted = submitAttempt(attempt, 3000);
    expect(submitted).toMatchObject({ difficulty: 'intermediate', datasetVersion: '1.0.0', result: { correct: 2 } });
    expect(submitted.snapshot.examId).toBe('pcao-f-practice-easy-01');
    expect(submitAttempt(submitted, 4000)).toBe(submitted);
  });
});
