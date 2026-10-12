import { answerQuestion, createAttempt, setFlag, submitAttempt } from '../../src/domain/attempt';
import { syntheticBank } from './syntheticBank';

// Known synthetic practice results only; never use this bank as runtime content.
export function syntheticResultsAttempt() {
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed'; // Exercises the production validation gate in tests.
  for (const index of [2, 3]) {
    bank.questions[index].selectionCount = 2;
    bank.questions[index].correctOptionIds = ['A', 'C'];
    bank.questions[index].explanationMarkdown = 'Synthetic complete-set explanation: A meets the first requirement and C meets the second. Both are needed; B does not qualify.';
  }
  bank.questions[3].sources = [{ courseTitle: 'Synthetic fixture course', sectionHeading: 'Exact synthetic section heading', url: 'https://example.test/course#section' }];
  bank.questions[7].stemMarkdown = 'Synthetic Markdown table. **Never publish this content.**\n\n| Recorded item | Detailed synthetic evidence |\n| --- | --- |\n| Example | Synthetic content used solely to verify table rendering and keyboard scrolling |';
  const correctCounts = { D1: 2, D2: 3, D3: 0, D4: 5, D5: 7, D6: 2, D7: 1 };
  const started = Date.UTC(2026, 9, 12, 10);
  let attempt = createAttempt(bank, started, 'synthetic-results');
  attempt = answerQuestion(attempt, 'T1', ['C', 'A'], started + 1000);
  attempt = answerQuestion(attempt, 'T2', ['A'], started + 1000);
  attempt = answerQuestion(attempt, 'T3', ['A'], started + 1000);
  attempt = answerQuestion(attempt, 'T4', ['A', 'B'], started + 1000);
  attempt = answerQuestion(attempt, 'T5', ['B'], started + 1000);
  attempt = answerQuestion(attempt, 'T6', [], started + 1000);
  for (const domain of bank.domains.filter(item => item.id !== 'D1')) {
    const questions = bank.questions.filter(item => item.primaryDomain === domain.id);
    const count = correctCounts[domain.id as keyof typeof correctCounts];
    for (const question of questions.slice(0, count)) attempt = answerQuestion(attempt, question.id, ['A'], started + 1000);
    if (count < questions.length) attempt = answerQuestion(attempt, questions[count].id, ['B'], started + 1000);
  }
  for (const id of ['T1', 'T3', 'T6', 'T12']) attempt = setFlag(attempt, id, true, started + 1000);
  return submitAttempt(attempt, started + (37 * 60 + 42) * 1000, 'manual');
}
