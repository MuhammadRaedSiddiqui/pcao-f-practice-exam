import { describe, expect, it } from 'vitest';
import { createAttempt, submitAttempt } from '../src/domain/attempt';
import { buildResultReport } from '../src/domain/reportExport';
import { markdownToPdf } from '../src/ui/reportMarkdown';
import { syntheticResultsAttempt } from './fixtures/syntheticResultsAttempt';

// Synthetic values independently specify the report content, not a runtime bank.
describe('saved PDF result report', () => {
  it('exports known results and metadata without changing the saved attempt', () => {
    const attempt = syntheticResultsAttempt();
    const before = JSON.stringify(attempt);
    const report = buildResultReport(attempt);
    expect(report).toMatchObject({
      filename: 'pcao-f-original-report-2026-10-12-synthetic-results.pdf',
      practiceScore: 333, passed: false,
      counts: { correct: 20, incorrect: 8, unanswered: 32 }, flaggedCount: 4,
      score: { correct: 20, total: 60, percentage: 33.3 },
      difficulty: 'Original exam', datasetVersion: 'fixture-1', elapsed: '00:37:42', durationMinutes: 120,
      startedUtc: '2026-10-12T10:00:00.000Z', submittedUtc: '2026-10-12T10:37:42.000Z',
      submission: 'Manual submission', attemptId: attempt.id, examId: attempt.snapshot.examId,
    });
    expect(report.domains.map(domain => [domain.id, domain.correct, domain.total, domain.percentage])).toEqual([
      ['D1', 2, 8, 25], ['D2', 3, 13, 23.1], ['D3', 0, 7, 0],
      ['D4', 5, 10, 50], ['D5', 7, 7, 100], ['D6', 2, 9, 22.2], ['D7', 1, 6, 16.7],
    ]);
    expect(report.focusDomains.map(domain => domain.id)).toEqual(['D3', 'D7', 'D6']);
    expect(JSON.stringify(attempt)).toBe(before);
  });

  it('preserves every original field, option order, supplied source and recorded selection', () => {
    const attempt = syntheticResultsAttempt();
    const report = buildResultReport(attempt);
    expect(report.questions).toHaveLength(60);
    for (const [index, question] of attempt.snapshot.questions.entries()) {
      expect(report.questions[index]).toMatchObject({ ...question, number: index + 1 });
      expect(report.questions[index].selections).toEqual(attempt.answers[question.id] ?? []);
    }
    expect(report.questions[0]).toMatchObject({ outcome: 'correct', selections: ['C', 'A'], flagged: true });
    expect(report.questions[3]).toMatchObject({ outcome: 'incorrect', selections: ['A', 'B'], correctOptionIds: ['A', 'C'] });
    expect(report.questions[5]).toMatchObject({ outcome: 'unanswered', selections: [], flagged: true });
  });

  it.each(['advanced', 'intermediate'] as const)('exports the saved %s level', difficulty => {
    const report = buildResultReport({ ...syntheticResultsAttempt(), difficulty });
    expect(report.difficulty).toBe(difficulty[0].toUpperCase() + difficulty.slice(1));
    expect(report.filename).toContain(`pcao-f-${difficulty}-report-`);
  });

  it.each([
    ['intermediate', 'Independent PCAO-F Practice — Easy', 'Independent PCAO-F Practice — Intermediate'],
    ['advanced', 'Independent PCAO-F Practice', 'Independent PCAO-F Practice'],
    [undefined, 'Independent PCAO-F Practice — Easy', 'Independent PCAO-F Practice — Easy'],
    ['intermediate', 'Custom saved title', 'Custom saved title'],
  ] as const)('displays the saved %s report title without mutating its snapshot', (difficulty, title, expected) => {
    const fixture = syntheticResultsAttempt();
    const attempt = { ...fixture, difficulty, snapshot: { ...fixture.snapshot, title } };
    const before = JSON.stringify(attempt);
    expect(buildResultReport(attempt).title).toBe(expected);
    expect(JSON.stringify(attempt)).toBe(before);
  });

  it('regrades legacy reports without needing a stored grade', () => {
    const attempt = syntheticResultsAttempt();
    delete attempt.result;
    expect(buildResultReport(attempt).practiceScore).toBe(333);
    expect(attempt.result).toBeUndefined();
  });

  it('refuses unfinished attempts and caps expired elapsed time at the deadline', () => {
    const fixture = syntheticResultsAttempt();
    const active = createAttempt(fixture.snapshot, fixture.startedAt, 'expired-export', 'advanced');
    expect(() => buildResultReport(active)).toThrow('completed attempt');
    const report = buildResultReport(submitAttempt(active, active.deadlineAt + 10_000, 'time expired'));
    expect(report.elapsed).toBe('02:00:00');
    expect(report.submission).toBe('Time expired - automatically submitted');
  });

  it('keeps PDF filenames safe while retaining the original ID inside', () => {
    const attempt = { ...syntheticResultsAttempt(), id: '../folder\\report: "bad"?*' };
    const report = buildResultReport(attempt);
    expect(report.filename).toMatch(/^[a-zA-Z0-9_-]+\.pdf$/);
    expect(report.attemptId).toBe(attempt.id);
  });
});

describe('readable PDF Markdown conversion', () => {
  it('renders emphasis, code, lists and table cells as content instead of Markdown syntax', () => {
    const content = markdownToPdf('**Bold** and *italic* with `code`.\n\n- First\n- Second\n\n| Item | Count |\n| --- | ---: |\n| Test | 12 |');
    const encoded = JSON.stringify(content);
    expect(content[0]).toMatchObject({ text: expect.arrayContaining([
      { text: 'Bold', bold: true }, { text: 'italic', italics: true },
      { text: 'code', background: '#eef2f0' },
    ]) });
    expect(encoded).toContain('"ul"');
    expect(encoded).toContain('"table"');
    expect(encoded).toContain('"text":"Test"');
    expect(encoded).toContain('"alignment":"right"');
    expect(encoded).not.toContain('**Bold**');
    expect(encoded).not.toContain('| --- |');
  });

  it('keeps HTML inert and only includes web URLs as clickable PDF links', () => {
    const content = markdownToPdf('[Unsafe](javascript:alert) [Safe](https://example.test) <script>synthetic</script>');
    const encoded = JSON.stringify(content);
    expect(encoded).toContain('"text":"Unsafe"');
    expect(encoded).not.toContain('"link":"javascript:');
    expect(encoded).toContain('"link":"https://example.test"');
    expect(encoded).toContain('<script>');
  });

  it('renders reference links and preserves code indentation and newlines', () => {
    const encoded = JSON.stringify(markdownToPdf('[Course][source]\n\n[source]: https://example.test/course\n\n```sql\nSELECT id\n  FROM items\n```'));
    expect(encoded).toContain('"link":"https://example.test/course"');
    expect(encoded).toContain('SELECT id\\n  FROM items');
    expect(encoded).toContain('"preserveLeadingSpaces":true');
  });
});
