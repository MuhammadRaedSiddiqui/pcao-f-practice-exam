import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Content, ContentText, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Attempt } from '../domain/attempt';
import { buildResultReport, type ResultReport } from '../domain/reportExport';
import { markdownToPdf } from './reportMarkdown';

pdfMake.addVirtualFileSystem(pdfFonts);

const accent = '#087d75';
function heading(text: string): ContentText {
  return { text, style: 'section', headlineLevel: 1 };
}
function dateTime(iso: string): string {
  return iso.replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function isText(node: Content): node is ContentText {
  return typeof node === 'object' && !Array.isArray(node) && node !== null && node.text !== undefined;
}

function keepHeadingsWithText(nodes: Content[]): Content[] {
  const result: Content[] = [];
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!isText(node) || !node.headlineLevel) {
      result.push(node);
      continue;
    }
    const group: Content[] = [node];
    let nextIndex = index + 1;
    while (nextIndex < nodes.length) {
      const next = nodes[nextIndex];
      // Keep short opening paragraphs with their headings; larger blocks paginate normally.
      if (!isText(next) || next.pageBreak || JSON.stringify(next.text).length > 2000) break;
      group.push(next);
      nextIndex += 1;
      if (!next.headlineLevel) break;
    }
    result.push(group.length > 1 ? { stack: group, unbreakable: true } : node);
    index = nextIndex - 1;
  }
  return result;
}

export function reportDocument(report: ResultReport): TDocumentDefinitions {
  const content: Content[] = [
    { text: 'PCAO-F PRACTICE', style: 'eyebrow' },
    { text: 'Practice result report', style: 'title' },
    { text: report.title, color: '#526662', margin: [0, 0, 0, 16] },
    { columns: [
      { width: '*', stack: [
        { text: 'Practice score', style: 'eyebrow' },
        { text: `${report.practiceScore} / 1000`, fontSize: 32, bold: true, color: accent },
        { text: report.passed ? 'Passed' : 'Failed', bold: true, color: report.passed ? accent : '#9a5037', margin: [0, 2, 0, 4] },
        { text: 'Passing score: 720 / 1000', fontSize: 9 },
      ] },
      { width: 190, table: { widths: ['*', 65], body: [
        ['Correct answers', `${report.score.correct} / ${report.score.total}`],
        ['Overall percentage', `${report.score.percentage}%`],
        ['Incorrect', String(report.counts.incorrect)],
        ['Unanswered', String(report.counts.unanswered)],
        ['Flagged', String(report.flaggedCount)],
      ] }, layout: 'lightHorizontalLines' },
    ], columnGap: 24, margin: [0, 0, 0, 12] },
    { text: 'Practice score uses equal-weight question scoring; it is not an official certification score.',
      fontSize: 9, color: '#526662', margin: [0, 0, 0, 6] },
    heading('Attempt details'),
    { table: { widths: [110, '*'], body: [
      ['Difficulty', report.difficulty], ['Dataset version', report.datasetVersion],
      ['Started (UTC)', dateTime(report.startedUtc)], ['Submitted (UTC)', dateTime(report.submittedUtc)],
      ['Time used', `${report.elapsed} of ${report.durationMinutes} minutes`],
      ['Submission', report.submission], ['Attempt ID', report.attemptId], ['Exam ID', report.examId],
    ] }, layout: 'noBorders', fontSize: 9 },
    heading('By domain'),
    { table: { headerRows: 1, widths: [28, '*', 55, 55], dontBreakRows: true,
      body: [
        ['ID', 'Domain', 'Correct', 'Percent'].map(text => ({ text, bold: true, fillColor: '#e8f3ef' })),
        ...report.domains.map(domain => [domain.id, domain.title, `${domain.correct} / ${domain.total}`, `${domain.percentage}%`]),
      ],
    }, layout: 'lightHorizontalLines', fontSize: 9 },
    heading('Focus your review here'),
    ...(report.focusDomains.length ? [
      { text: 'Your lowest domain percentages in this practice attempt. Review their questions and supplied course sections.', fontSize: 9, margin: [0, 0, 0, 6] } as Content,
      { ul: report.focusDomains.map(domain => `${domain.id} - ${domain.title}: ${domain.percentage}% (${domain.correct} / ${domain.total})`), fontSize: 9 } as Content,
    ] : [{ text: 'You answered every question correctly in this attempt. The question reviews and course sections are still available below.', fontSize: 9 } as Content]),
  ];
  for (const question of report.questions) {
    const outcome = question.outcome[0].toUpperCase() + question.outcome.slice(1);
    content.push(
      { text: `Question ${question.number} - ${question.id}`, style: 'question', pageBreak: 'before',
        outline: true },
      { text: `${question.primaryDomain} - ${question.domainTitle}`, color: '#526662', fontSize: 9, margin: [0, 0, 0, 6] },
      { text: `Outcome: ${outcome}     Flagged: ${question.flagged ? 'Yes' : 'No'}`, bold: true,
        color: question.outcome === 'correct' ? accent : '#9a5037', margin: [0, 0, 0, 14] },
      ...markdownToPdf(question.stemMarkdown),
      { text: question.selectionCount === 1 ? 'Select ONE' : `Select exactly ${question.selectionCount} options`, bold: true, margin: [0, 4, 0, 8] },
      { text: `Your selections: ${question.selections.length ? question.selections.join(', ') : 'None - unanswered'}`, margin: [0, 0, 0, 4] },
      { text: `Correct selections: ${question.correctOptionIds.join(', ')}`, margin: [0, 0, 0, 8] },
      heading('Explanation'),
    );
    if (question.selectionCount > 1) content.push({
      text: `The complete answer set is ${question.correctOptionIds.join(', ')}. All ${question.selectionCount} options are required for a point; any other set earns zero.`,
      fontSize: 9, color: '#526662', margin: [0, 0, 0, 8],
    });
    content.push(...markdownToPdf(question.explanationMarkdown), heading('Options and explanations'));
    for (const option of question.options) {
      const selected = question.selections.includes(option.id);
      const correct = question.correctOptionIds.includes(option.id);
      const label = selected ? correct ? 'Selected - correct' : 'Selected - incorrect' : correct ? 'Missed - correct' : 'Not selected';
      content.push(
        { text: `Option ${option.id} | ${label}`, bold: true, color: correct ? accent : '#253b35',
          margin: [0, 10, 0, 6], headlineLevel: 2 },
        ...markdownToPdf(option.textMarkdown),
        { text: 'Option explanation', fontSize: 9, bold: true, color: '#526662', margin: [0, 2, 0, 4], headlineLevel: 2 },
        ...markdownToPdf(question.optionExplanations[option.id]),
      );
    }
    content.push(heading('Sources'));
    for (const source of question.sources) {
      content.push({ text: [{ text: source.courseTitle, bold: true }, ` - ${source.sectionHeading}`], margin: [0, 0, 0, 4] });
      if (source.url) content.push({ text: source.url, fontSize: 9, color: accent,
        ...(/^(https?):\/\//i.test(source.url) ? { link: source.url } : {}), margin: [0, 0, 0, 8] });
    }
  }
  return {
    pageSize: 'A4', pageMargins: [44, 52, 44, 48],
    info: { title: `${report.difficulty} practice result report`, subject: `Saved attempt ${report.attemptId}` },
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.2, color: '#253b35' },
    styles: {
      eyebrow: { fontSize: 9, bold: true, color: accent, margin: [0, 0, 0, 6] },
      title: { fontSize: 25, bold: true, margin: [0, 0, 0, 8] },
      section: { fontSize: 13, bold: true, color: accent, margin: [0, 14, 0, 8] },
      question: { fontSize: 20, bold: true, color: accent, margin: [0, 0, 0, 8] },
    },
    header: { text: `${report.difficulty} | Practice result report | Dataset ${report.datasetVersion}`,
      fontSize: 8, color: '#526662', margin: [44, 24, 44, 0] },
    footer: (page, total) => ({ columns: [
      { text: 'Independent practice results', alignment: 'left' },
      { text: `Page ${page} of ${total}`, alignment: 'right' },
    ], fontSize: 8, color: '#526662', margin: [44, 16, 44, 0] }),
    content: keepHeadingsWithText(content),
  };
}

export async function createReportPdf(attempt: Attempt): Promise<{ filename: string; blob: Blob }> {
  const report = buildResultReport(attempt);
  const blob = await pdfMake.createPdf(reportDocument(report)).getBlob();
  return { filename: report.filename, blob };
}
