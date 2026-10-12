import type { QuestionBank } from '../../src/domain/bank';

const counts = { D1: 8, D2: 13, D3: 7, D4: 10, D5: 7, D6: 9, D7: 6 } as const;

export function syntheticBank(): QuestionBank {
  let index = 0;
  const questions = Object.entries(counts).flatMap(([primaryDomain, count]) =>
    Array.from({ length: count }, () => {
      index += 1;
      const id = `T${index}`;
      return {
        id, primaryDomain, selectionCount: index === 1 ? 2 : 1,
        stemMarkdown: `Synthetic test question ${index}. **Never publish this content.**`,
        options: [
          { id: 'A', textMarkdown: 'Synthetic option A' },
          { id: 'B', textMarkdown: 'Synthetic option B' },
          { id: 'C', textMarkdown: 'Synthetic option C' },
        ],
        correctOptionIds: index === 1 ? ['A', 'C'] : ['A'],
        explanationMarkdown: 'Synthetic explanation for testing only.',
        optionExplanations: { A: 'Synthetic A', B: 'Synthetic B', C: 'Synthetic C' },
        sources: [{ courseTitle: 'Synthetic fixture', sectionHeading: 'Synthetic section' }],
      };
    }));
  return {
    schemaVersion: 1, examId: 'synthetic-pcao-f', version: 'fixture-1',
    title: 'Synthetic test fixture', durationMinutes: 120, expectedQuestionCount: 60,
    domains: Object.entries(counts).map(([id, expectedQuestionCount]) =>
      ({ id, title: `Synthetic ${id}`, expectedQuestionCount })),
    contentStatus: 'synthetic', questions,
  };
}
