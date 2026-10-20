import { createAttempt, submitAttempt, type Attempt } from '../../src/domain/attemptModel';
import { guidedBank } from './syntheticGuidance';
export function postExamReport(kind: 'mixed' | 'correct' | 'zero' | 'legacy' | 'unsupported' | 'stale' = 'mixed'): Attempt {
  const now = Date.now(); const bank = guidedBank();
  if (kind === 'unsupported') bank.examId = 'synthetic-unsupported-history';
  if (kind === 'stale') bank.questions[0].stemMarkdown += ' Historical source difference';
  const draft = createAttempt(bank, now - 2000, 'phase5-synthetic-report', 'intermediate');
  draft.answers = { T1: ['A'], T2: ['A'], T3: ['A', 'B'], T4: ['B'] };
  draft.flags = kind === 'zero' ? ['T60'] : ['T2', 'T4', 'T5', 'T60'];
  if (kind === 'correct') draft.answers = Object.fromEntries(bank.questions.map(q => [q.id, q.correctOptionIds]));
  const report = submitAttempt(draft, now - 1000);
  if (kind === 'legacy') { delete report.difficulty; delete report.revision; delete report.result; }
  return report;
}
