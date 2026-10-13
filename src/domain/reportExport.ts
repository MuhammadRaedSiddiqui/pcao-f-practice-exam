import type { Attempt } from './attempt';
import { difficultyLabel } from './difficulty';
import { questionOutcome, summarizeResults } from './results';

/** Build the complete saved report independently of the visible review filter. */
export function buildResultReport(attempt: Attempt) {
  const summary = summarizeResults(attempt);
  const submitted = new Date(attempt.submittedAt!).toISOString();
  const seconds = Math.floor(summary.timeUsedMilliseconds / 1000);
  const elapsed = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
  const safeId = attempt.id.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 80) || 'attempt';
  return {
    ...summary,
    filename: `pcao-f-${attempt.difficulty ?? 'original'}-report-${submitted.slice(0, 10)}-${safeId}.pdf`,
    title: attempt.snapshot.title,
    attemptId: attempt.id,
    examId: attempt.snapshot.examId,
    difficulty: difficultyLabel(attempt.difficulty),
    datasetVersion: attempt.datasetVersion,
    startedUtc: new Date(attempt.startedAt).toISOString(),
    submittedUtc: submitted,
    elapsed,
    durationMinutes: attempt.snapshot.durationMinutes,
    submission: attempt.submissionReason === 'time expired' ? 'Time expired - automatically submitted' : 'Manual submission',
    flaggedCount: attempt.flags.length,
    questions: attempt.snapshot.questions.map((question, index) => ({
      ...question,
      number: index + 1,
      selections: [...(attempt.answers[question.id] ?? [])],
      outcome: questionOutcome(question, attempt.answers[question.id] ?? []),
      flagged: attempt.flags.includes(question.id),
      domainTitle: attempt.snapshot.domains.find(domain => domain.id === question.primaryDomain)!.title,
    })),
  };
}

export type ResultReport = ReturnType<typeof buildResultReport>;
