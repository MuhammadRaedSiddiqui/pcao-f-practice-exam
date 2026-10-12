import type { QuestionBank } from './bank';

export type SourceCourse = { courseTitle: string; url?: string };

// Only course-level fields leave this helper; question references stay in reports.
export function sourceCourses(bank: QuestionBank): SourceCourse[] {
  const courses = new Map<string, SourceCourse>();
  for (const question of bank.questions) {
    for (const { courseTitle, url } of question.sources) {
      const key = JSON.stringify([courseTitle, url ?? null]);
      if (!courses.has(key)) courses.set(key, { courseTitle, url });
    }
  }
  return [...courses.values()];
}
