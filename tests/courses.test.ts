import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { validateQuestionBank } from '../src/domain/bank';
import { sourceCourses } from '../src/domain/courses';
import { syntheticBank } from './fixtures/syntheticBank';

it('deduplicates course title and URL pairs while omitting question-level fields', () => {
  const bank = syntheticBank();
  bank.questions[0].sources = [
    { courseTitle: 'Synthetic course', sectionHeading: 'First', url: 'https://example.test/a' },
    { courseTitle: 'Synthetic course', sectionHeading: 'Second', url: 'https://example.test/a' },
    { courseTitle: 'Synthetic course', sectionHeading: 'Third', url: 'https://example.test/b' },
    { courseTitle: 'Other synthetic title', sectionHeading: 'First', url: 'https://example.test/a' },
  ];
  bank.questions.slice(1).forEach(question => { question.sources = [bank.questions[0].sources[0]]; });
  expect(sourceCourses(bank)).toEqual([
    { courseTitle: 'Synthetic course', url: 'https://example.test/a' },
    { courseTitle: 'Synthetic course', url: 'https://example.test/b' },
    { courseTitle: 'Other synthetic title', url: 'https://example.test/a' },
  ]);
});

it('derives ten linked courses from the validated reviewed bank with 100 references', () => {
  const result = validateQuestionBank(JSON.parse(readFileSync('public/question-bank.json', 'utf8')));
  if (!result.ok) throw new Error(result.errors.join(' '));
  expect(result.bank.questions.flatMap(question => question.sources)).toHaveLength(100);
  const courses = sourceCourses(result.bank);
  expect(courses).toHaveLength(10);
  expect(courses.every(course => course.url?.startsWith('https://'))).toBe(true);
});
