import { useEffect, useRef, useState, type RefObject } from 'react';
import { type Attempt } from '../domain/attempt';
import type { Question } from '../domain/bank';
import { difficultyLabel } from '../domain/difficulty';
import { matchesResultFilter, questionOutcome, resultTitle, summarizeResults, type ResultFilter } from '../domain/results';
import { MarkdownContent } from './MarkdownContent';
import { Button, Card } from './primitives';
import { trackEvent } from '../services/analytics';

type Props = {
  attempt: Attempt;
  headingRef: RefObject<HTMLHeadingElement | null>;
  canStart: boolean;
  onStart: () => void;
  onHistory: () => void;
  onGuidedReview?: () => void;
};

let reportPdfModule: Promise<typeof import('./reportPdf')> | undefined;
function loadReportPdf() {
  reportPdfModule ??= import('./reportPdf').catch(error => {
    reportPdfModule = undefined;
    throw error;
  });
  return reportPdfModule;
}

function dateTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
}

function elapsedTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
}

function QuestionReview({ attempt, question, index }: { attempt: Attempt; question: Question; index: number }) {
  const [open, setOpen] = useState(false);
  const selections = attempt.answers[question.id] ?? [];
  const outcome = questionOutcome(question, selections);
  const flagged = attempt.flags.includes(question.id);
  const domain = attempt.snapshot.domains.find(item => item.id === question.primaryDomain);
  return <details className="review-item" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>
      <span><strong>Question {index + 1} · {question.id}</strong><span className="review-domain">{domain?.title}</span></span>
      <span className="review-summary-labels">
        {flagged && <span className="review-flag"><span aria-hidden="true">⚑ </span>Flagged</span>}
        <span className={'review-outcome review-outcome--' + outcome}>{outcome[0].toUpperCase() + outcome.slice(1)}</span>
      </span>
    </summary>
    {open && <div className="review-content">
      <div className="review-stem"><MarkdownContent>{question.stemMarkdown}</MarkdownContent></div>
      <p className="instruction">{question.selectionCount === 1 ? 'Select ONE' : 'Select exactly ' + question.selectionCount + ' options'}</p>
      <dl className="review-selections">
        <div><dt>Your selections</dt><dd>{selections.length ? selections.join(', ') : 'None — unanswered'}</dd></div>
        <div><dt>Correct selections</dt><dd>{question.correctOptionIds.join(', ')}</dd></div>
      </dl>
      <h3>Explanation</h3>
      {question.selectionCount > 1 && <p className="muted">The complete answer set is {question.correctOptionIds.join(', ')}. All {question.selectionCount} options are required for a point; any other set earns zero.</p>}
      <div className="review-explanation"><MarkdownContent>{question.explanationMarkdown}</MarkdownContent></div>
      <h3>Options and explanations</h3>
      {question.options.map(option => {
        const selected = selections.includes(option.id);
        const correct = question.correctOptionIds.includes(option.id);
        const status = selected ? correct ? 'selected-correct' : 'selected-incorrect' : correct ? 'missed-correct' : 'unselected';
        const label = selected ? correct ? 'Selected · correct' : 'Selected · incorrect' : correct ? 'Missed · correct' : 'Not selected';
        const symbol = selected ? correct ? '✓' : '×' : correct ? '!' : '○';
        return <div className={'review-option review-option--' + status} key={option.id} data-option-id={option.id}>
          <div className="review-option__heading"><strong>Option {option.id}</strong><span><span aria-hidden="true">{symbol} </span>{label}</span></div>
          <div className="review-option__text"><MarkdownContent>{option.textMarkdown}</MarkdownContent></div>
          <div className="review-option__explanation"><p className="review-option__label">Option explanation</p><MarkdownContent>{question.optionExplanations[option.id]}</MarkdownContent></div>
        </div>;
      })}
      <h3>Sources</h3>
      <ul className="sources">{question.sources.map((source, sourceIndex) => <li key={sourceIndex}>
        <strong>{source.courseTitle}</strong> — <span>{source.sectionHeading}</span>
        {source.url && <> · {/^(https?):\/\//i.test(source.url)
          ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.url}</a>
          : <span>{source.url}</span>}</>}
      </li>)}</ul>
    </div>}
  </details>;
}

export function ResultsPage({ attempt, headingRef, canStart, onStart, onHistory, onGuidedReview }: Props) {
  const [filter, setFilter] = useState<ResultFilter>('all');
  const [exportError, setExportError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pdfState, setPdfState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [pdfLoadAttempt, setPdfLoadAttempt] = useState(0);
  const exportOpener = useRef<HTMLElement | null>(null);
  const exportActions = useRef<HTMLDivElement | null>(null);
  const retryActions = useRef<HTMLDivElement | null>(null);
  const retryFocus = useRef(false);
  useEffect(() => {
    let active = true;
    setPdfState('loading');
    // Readiness acknowledges actual import completion, not a timer or networkidle.
    void loadReportPdf().then(() => { if (active) setPdfState('ready'); }, () => { if (active) setPdfState('error'); });
    return () => { active = false; };
  }, [pdfLoadAttempt]);
  useEffect(() => {
    if (pdfState === 'loading' || !retryFocus.current) return;
    retryFocus.current = false;
    if (document.activeElement === document.body) (pdfState === 'ready' ? exportActions.current?.querySelector<HTMLButtonElement>('[data-pdf-export]') : retryActions.current?.querySelector<HTMLButtonElement>('button'))?.focus();
  }, [pdfState]);
  useEffect(() => {
    if (exporting || pdfState !== 'ready') return;
    const opener = exportOpener.current;
    exportOpener.current = null;
    if (opener?.isConnected && document.activeElement === document.body) opener.focus({ preventScroll: true });
  }, [exporting]);
  async function exportReport() {
    if (exporting) return;
    const opener = document.activeElement;
    exportOpener.current = opener instanceof HTMLElement ? opener : null;
    setExportError(false);
    setExporting(true);
    try {
      const { createReportPdf } = await loadReportPdf();
      const report = await createReportPdf(attempt);
      const url = URL.createObjectURL(report.blob);
      const link = document.createElement('a');
      try {
        link.href = url;
        link.download = report.filename;
        link.hidden = true;
        document.body.append(link);
        link.click();
        trackEvent('pdf_export_succeeded', { difficulty: attempt.difficulty ?? 'original', attempt_id: attempt.id });
      } finally {
        link.remove();
        // Let the browser begin reading the download before releasing its URL.
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      setExportError(true);
    } finally {
      setExporting(false);
    }
  }
  const { score, practiceScore, passed, counts, domains, focusDomains, timeUsedMilliseconds } = summarizeResults(attempt);
  const filterCounts = { all: score.total, incorrect: counts.incorrect, unanswered: counts.unanswered, flagged: attempt.flags.length };
  const visible = attempt.snapshot.questions.map((question, index) => ({ question, index }))
    .filter(({ question }) => matchesResultFilter(attempt, question, filter));
  return <>
    <p className="eyebrow">{difficultyLabel(attempt.difficulty)} · Practice report · dataset {attempt.datasetVersion}</p>
    <h1 ref={headingRef} tabIndex={-1}>Your results</h1>
    <p className="lead">{resultTitle(attempt)}</p>
    <div className="result-cards">
      <Card className="practice-score-card"><p className="eyebrow">Practice score</p><strong className="result-number">{practiceScore} / 1000</strong>
        <span className={'practice-status practice-status--' + (passed ? 'passed' : 'failed')}>{passed ? 'Passed' : 'Failed'}</span>
        <p className="passing-score">Passing score: 720 / 1000.</p>
      </Card>
      <Card className="secondary-score-card"><p className="eyebrow">Correct answers</p><strong className="secondary-result-number">{score.correct} / {score.total}</strong><p className="muted">{score.percentage}% correct</p></Card>
    </div>
    <p className="footnote">Practice score uses equal-weight question scoring; it is not an official certification score.</p>
    <dl className="result-counts" aria-label="Question result counts">
      <div><dt>Correct</dt><dd>{counts.correct}</dd></div>
      <div><dt>Incorrect</dt><dd>{counts.incorrect}</dd></div>
      <div><dt>Unanswered</dt><dd>{counts.unanswered}</dd></div>
    </dl>
    <dl className="result-metadata" aria-label="Attempt details">
      <div><dt>Attempt date</dt><dd>{dateTime(attempt.startedAt)}</dd></div>
      <div><dt>Submitted</dt><dd>{dateTime(attempt.submittedAt!)}</dd></div>
      <div><dt>Time used</dt><dd>{elapsedTime(timeUsedMilliseconds)} <span className="muted">of {attempt.snapshot.durationMinutes} minutes</span></dd></div>
      <div><dt>Submission</dt><dd>{attempt.submissionReason === 'time expired' ? 'Time expired — automatically submitted' : 'Manual submission'}</dd></div>
      <div><dt>Dataset version</dt><dd>{attempt.datasetVersion}</dd></div>
      <div><dt>Difficulty</dt><dd>{difficultyLabel(attempt.difficulty)}</dd></div>
    </dl>
    <div className="result-actions" ref={exportActions}><Button onClick={onHistory}>Attempt history</Button><Button data-pdf-export disabled={exporting || pdfState !== 'ready'} aria-busy={exporting || pdfState === 'loading'} onClick={exportReport}>{exporting ? 'Preparing PDF...' : pdfState === 'loading' ? 'Loading PDF export…' : pdfState === 'error' ? 'PDF export unavailable' : 'Export report (PDF)'}</Button><Button variant="primary" disabled={!canStart} onClick={onStart}>Start new attempt</Button></div>
    {pdfState === 'loading' && <p role="status">Loading PDF export dependencies. First-use offline export is available only after this finishes.</p>}
    {pdfState === 'error' && <div ref={retryActions}><p role="alert">PDF export could not be loaded. Connect to the internet and retry PDF loading.</p><Button onClick={event => { retryFocus.current = document.activeElement === event.currentTarget; setPdfLoadAttempt(value => value + 1); }}>Retry PDF loading</Button></div>}
    {attempt.status === 'submitted' && onGuidedReview && <div className="result-actions"><Button onClick={onGuidedReview}>Guided Review</Button></div>}
    {exportError && <p role="alert">The report could not be exported. Please try again.</p>}
    <Card className="domain-card">
      <h2>By domain</h2>
      <div className="domain-list">{domains.map(domain => <div className="domain-row" key={domain.id} data-domain-id={domain.id}>
        <span><strong>{domain.id}</strong> {domain.title}</span>
        <strong>{domain.correct} / {domain.total} <span className="domain-percentage">· {domain.percentage}%</span></strong>
      </div>)}</div>
      <section className="focus-review" aria-labelledby="focus-review-title">
        <h3 id="focus-review-title">Focus your review here</h3>
        {focusDomains.length ? <>
          <p className="muted">These are your lowest domain percentages in this practice attempt. Review their questions and supplied course sections.</p>
          <ul>{focusDomains.map(domain => <li key={domain.id}><strong>{domain.id} · {domain.title}</strong> — {domain.percentage}% ({domain.correct} / {domain.total})</li>)}</ul>
        </> : <p className="muted">You answered every question correctly in this attempt. The question reviews and course sections are still available below.</p>}
      </section>
    </Card>
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="reviews-heading">
        <h2 id="reviews-title">Question reviews</h2>
        <div className="filter-controls" role="group" aria-label="Filter question reviews">
          {(['all', 'incorrect', 'unanswered', 'flagged'] as const).map(value => <Button key={value}
            variant={filter === value ? 'primary' : 'secondary'} aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {value[0].toUpperCase() + value.slice(1)} ({filterCounts[value]})
          </Button>)}
        </div>
      </div>
      <p className="muted" role="status">Showing {visible.length} of {score.total} questions. Expand a question to review its original content and explanations.</p>
      {visible.length === 0 && <Card><p className="muted">No questions match this filter.</p></Card>}
      {visible.map(({ question, index }) => <QuestionReview key={question.id} attempt={attempt} question={question} index={index} />)}
    </section>
  </>;
}
