import { gradeAttempt, isExactSet, type Attempt } from './attempt';
import type { Question } from './bank';

export type QuestionOutcome = 'correct' | 'incorrect' | 'unanswered';
export type ResultFilter = 'all' | 'incorrect' | 'unanswered' | 'flagged';

export function questionOutcome(question: Question, selections: readonly string[]): QuestionOutcome {
  if (selections.length === 0) return 'unanswered';
  return isExactSet(question, selections) ? 'correct' : 'incorrect';
}

export function matchesResultFilter(attempt: Attempt, question: Question, filter: ResultFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'flagged') return attempt.flags.includes(question.id);
  return questionOutcome(question, attempt.answers[question.id] ?? []) === filter;
}

export function practiceResult(correctCount: number, totalQuestions: number) {
  return {
    practiceScore: totalQuestions > 0 ? Math.round(correctCount / totalQuestions * 1000) : 0,
    passed: totalQuestions > 0 && correctCount * 1000 >= 720 * totalQuestions,
  };
}

export function summarizeResults(attempt: Attempt) {
  if (attempt.status !== 'submitted' || attempt.submittedAt === undefined) {
    throw new Error('Results require a completed attempt.');
  }
  const score = gradeAttempt(attempt);
  const unanswered = attempt.snapshot.questions.filter(question =>
    questionOutcome(question, attempt.answers[question.id] ?? []) === 'unanswered').length;
  const counts = { correct: score.correct, incorrect: score.total - score.correct - unanswered, unanswered };
  const domains = attempt.snapshot.domains.map(domain => {
    const result = score.byDomain[domain.id];
    return { ...domain, ...result, percentage: Math.round(result.correct / result.total * 1000) / 10 };
  });
  // Rank unrounded fractions; equal scores retain the snapshot's domain order.
  const focusDomains = domains.filter(domain => domain.correct < domain.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total).slice(0, 3);
  const timeUsedMilliseconds = Math.max(0, Math.min(attempt.submittedAt, attempt.deadlineAt) - attempt.startedAt);
  return { score, ...practiceResult(score.correct, score.total), counts, domains, focusDomains, timeUsedMilliseconds };
}
