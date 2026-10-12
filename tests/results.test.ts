import { describe, expect, it } from 'vitest';
import { createAttempt, gradeAttempt, submitAttempt } from '../src/domain/attempt';
import { matchesResultFilter, practiceResult, questionOutcome, summarizeResults } from '../src/domain/results';
import { syntheticResultsAttempt } from './fixtures/syntheticResultsAttempt';
import { syntheticBank } from './fixtures/syntheticBank';

describe('completed attempt results', () => {
  it('independently verifies overall and seven domain totals for known synthetic answers', () => {
    const attempt = syntheticResultsAttempt();
    const report = summarizeResults(attempt);
    expect(report.counts).toEqual({ correct: 20, incorrect: 8, unanswered: 32 });
    expect(Object.values(report.counts).reduce((sum, count) => sum + count, 0)).toBe(60);
    expect(report.score).toMatchObject({ correct: 20, total: 60, percentage: 33.3 });
    const expected = [
      ['D1', 2, 8, 25], ['D2', 3, 13, 23.1], ['D3', 0, 7, 0],
      ['D4', 5, 10, 50], ['D5', 7, 7, 100], ['D6', 2, 9, 22.2], ['D7', 1, 6, 16.7],
    ];
    expect(report.domains.map(domain => [domain.id, domain.correct, domain.total, domain.percentage])).toEqual(expected);
    expect(report.domains.reduce((sum, domain) => sum + domain.correct, 0)).toBe(20);
    expect(report.domains.reduce((sum, domain) => sum + domain.total, 0)).toBe(60);
    expect(report.focusDomains.map(domain => domain.id)).toEqual(['D3', 'D7', 'D6']);
    expect(report.timeUsedMilliseconds).toBe((37 * 60 + 42) * 1000);
    expect(report.score).toEqual(gradeAttempt(attempt));
  });

  it('distinguishes reordered exact sets, single answers, partials, blanks and incorrect sets', () => {
    const attempt = syntheticResultsAttempt();
    const outcome = (id: string) => {
      const question = attempt.snapshot.questions.find(item => item.id === id)!;
      return questionOutcome(question, attempt.answers[id] ?? []);
    };
    expect(outcome('T1')).toBe('correct');
    expect(outcome('T2')).toBe('correct');
    expect(outcome('T3')).toBe('incorrect');
    expect(outcome('T4')).toBe('incorrect');
    expect(outcome('T5')).toBe('incorrect');
    expect(outcome('T6')).toBe('unanswered');
    expect(outcome('T7')).toBe('unanswered');
    const matching = (filter: 'all' | 'incorrect' | 'unanswered' | 'flagged') =>
      attempt.snapshot.questions.filter(question => matchesResultFilter(attempt, question, filter));
    expect(matching('all')).toHaveLength(60);
    expect(matching('incorrect')).toHaveLength(8);
    expect(matching('unanswered')).toHaveLength(32);
    expect(matching('flagged').map(question => question.id)).toEqual(['T1', 'T3', 'T6', 'T12']);
  });

  it('uses frozen data, caps elapsed time at the deadline, and refuses unfinished reports', () => {
    const fixture = syntheticBank();
    fixture.contentStatus = 'reviewed';
    const active = createAttempt(fixture, 1000, 'snapshot-results');
    fixture.questions[0].correctOptionIds = ['B', 'C'];
    fixture.domains[0].title = 'Later domain title';
    fixture.version = 'later';
    expect(() => summarizeResults(active)).toThrow('completed attempt');
    const submitted = submitAttempt(active, active.deadlineAt + 10000, 'manual');
    const report = summarizeResults(submitted);
    expect(submitted.submissionReason).toBe('time expired');
    expect(report.timeUsedMilliseconds).toBe(120 * 60_000);
    expect(report.counts).toEqual({ correct: 0, incorrect: 0, unanswered: 60 });
    expect(report.domains[0].title).toBe('Synthetic D1');
    expect(report.focusDomains.map(domain => domain.id)).toEqual(['D1', 'D2', 'D3']);
    expect(submitted.snapshot.version).toBe('fixture-1');
  });

  it('shows no weakest-domain recommendation for a fully correct attempt', () => {
    const attempt = syntheticResultsAttempt();
    const answers = Object.fromEntries(attempt.snapshot.questions.map(question => [question.id, [...question.correctOptionIds].reverse()]));
    const report = summarizeResults({ ...attempt, answers });
    expect(report.counts).toEqual({ correct: 60, incorrect: 0, unanswered: 0 });
    expect(report.score.percentage).toBe(100);
    expect(report.focusDomains).toEqual([]);
  });
});


describe('practice score and threshold', () => {
  it.each([[0, 0, false], [43, 717, false], [44, 733, true], [60, 1000, true]])(
    '%i correct out of 60 displays %i and passed=%s', (correct, score, passed) => {
      expect(practiceResult(correct as number, 60)).toEqual({ practiceScore: score, passed });
    });
  it('includes the exact synthetic 720 boundary and uses the unrounded value', () => {
    expect(practiceResult(18, 25)).toEqual({ practiceScore: 720, passed: true });
    expect(practiceResult(1439, 2000)).toEqual({ practiceScore: 720, passed: false });
  });
});
