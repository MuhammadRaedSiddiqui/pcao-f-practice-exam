import { useEffect, useRef, useState } from 'react';
import { type BankLoadState, loadQuestionBank, type Question } from './domain/bank';
import {
  answerQuestion, gradeAttempt, listAttempts, recoverAttempt,
  remainingMilliseconds, saveAttempt, selectionStatus, setCurrentQuestion,
  setFlag, startStoredAttempt, submitStoredAttempt, type Attempt, type AttemptStorage,
} from './domain/attempt';
import { MarkdownContent } from './ui/MarkdownContent';
import { Button, Card, Container, Dialog } from './ui/primitives';
import { ReviewSubmitDialog } from './ui/ReviewSubmitDialog';
import { practiceResult } from './domain/results';
import { SourceCoursesDrawer } from './ui/SourceCoursesDrawer';
import { ResultsPage } from './ui/ResultsPage';

type View = 'start' | 'exam' | 'results';

// Storage access itself can throw; domain helpers catch these failures.
const browserStorage: AttemptStorage = {
  getItem: key => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value),
  removeItem: key => window.localStorage.removeItem(key),
};

function clock(milliseconds: number): string {
  const seconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function dateTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
}

function selectionLabel(question: Question): string {
  return question.selectionCount === 1 ? 'Select ONE' : `Select exactly ${question.selectionCount === 2 ? 'TWO' : 'THREE'}`;
}

export function App() {
  const [bankState, setBankState] = useState<BankLoadState>({ status: 'loading' });
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [historyErrors, setHistoryErrors] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [confirmation, setConfirmation] = useState<Attempt[] | null>(null);
  const starting = useRef(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [view, setView] = useState<View>('start');
  const [reviewStage, setReviewStage] = useState<'review' | 'confirm' | null>(null);
  const jumpFocus = useRef(false);
  const finalizedIds = useRef(new Set<string>());
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState('');
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  function refreshHistory() {
    const loaded = listAttempts(browserStorage);
    setHistory(loaded.attempts);
    setHistoryErrors(loaded.errors);
    setHistoryLoading(false);
  }

  useEffect(() => {
    let active = true;
    void loadQuestionBank().then(state => { if (active) setBankState(state); });
    const loaded = listAttempts(browserStorage);
    // Reopening after the deadline finalizes saved answers, even before Resume.
    for (const saved of loaded.attempts) {
      if (saved.status === 'in-progress' && remainingMilliseconds(saved.deadlineAt) === 0) {
        finalize(saved.id, Date.now(), 'time expired');
      }
    }
    refreshHistory();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!attempt || attempt.status !== 'in-progress') return;
    const tick = () => {
      const instant = Date.now();
      setNow(instant);
      if (instant >= attempt.deadlineAt) finalize(attempt.id, instant, 'time expired');
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('focus', tick);
    window.addEventListener('pageshow', tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('focus', tick);
      window.removeEventListener('pageshow', tick);
    };
  }, [attempt?.id, attempt?.deadlineAt, attempt?.status]);

  useEffect(() => {
    if (view === 'exam') {
      questionHeading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (view === 'results') resultsHeading.current?.focus({ preventScroll: true });
  }, [view, attempt?.currentQuestionId]);

  useEffect(() => {
    if (!reviewStage && jumpFocus.current && view === 'exam') {
      jumpFocus.current = false;
      questionHeading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [reviewStage, view]);

  function persist(next: Attempt) {
    const saved = saveAttempt(browserStorage, next);
    if (!saved.ok) { setMessage(saved.error); return false; }
    setAttempt(next);
    setMessage('');
    refreshHistory();
    return true;
  }

  useEffect(() => {
    if (view !== 'exam') starting.current = false;
  }, [view]);

  function start(confirmedIds: readonly string[] = []) {
    if (bankState.status !== 'ready' || historyLoading || starting.current) return;
    starting.current = true;
    let opened = false;
    try {
      const saved = startStoredAttempt(browserStorage, bankState.bank, confirmedIds);
      if (!saved.ok) {
        if ('unfinishedAttempts' in saved) { setConfirmation(saved.unfinishedAttempts); setMessage(''); }
        else { setConfirmation(null); setMessage(saved.error); }
        refreshHistory();
        return;
      }
      if (!saved.attempt) return;
      opened = true;
      setConfirmation(null);
      setAttempt(saved.attempt);
      setView('exam');
      setNow(Date.now());
      setMessage('');
      refreshHistory();
      window.scrollTo(0, 0);
    } finally { if (!opened) starting.current = false; }
  }

  function openSaved(saved: Attempt) {
    const recovered = recoverAttempt(browserStorage, saved.id);
    if (!recovered.ok || !recovered.attempt) {
      setMessage(recovered.ok ? 'Saved attempt was not found. Refresh your attempts and try again.' : recovered.error);
      refreshHistory();
      return;
    }
    const latest = recovered.attempt;
    const current = latest.status === 'in-progress' && remainingMilliseconds(latest.deadlineAt) === 0
      ? submitStoredAttempt(browserStorage, latest.id, Date.now(), 'time expired')
      : { ok: true as const, attempt: latest };
    if (!current.ok || !current.attempt) {
      setMessage(current.ok ? 'Saved attempt was not found.' : current.error);
      return;
    }
    setAttempt(current.attempt);
    setView(current.attempt.status === 'submitted' ? 'results' : 'exam');
    setMessage('');
    setNow(Date.now());
    refreshHistory();
    window.scrollTo(0, 0);
  }

  function canEdit(): boolean {
    if (!attempt || attempt.status !== 'in-progress') return false;
    if (remainingMilliseconds(attempt.deadlineAt) === 0) {
      finalize(attempt.id, Date.now(), 'time expired');
      return false;
    }
    return true;
  }

  function changeAnswer(question: Question, optionId: string, checked: boolean) {
    if (!attempt || !canEdit()) return;
    const selected = attempt.answers[question.id] ?? [];
    let next: string[];
    if (question.selectionCount === 1) next = [optionId];
    else if (!checked) next = selected.filter(id => id !== optionId);
    else if (selected.length < question.selectionCount) next = [...selected, optionId];
    else { setMessage(`Select no more than ${question.selectionCount} answers. Clear one first.`); return; }
    try { persist(answerQuestion(attempt, question.id, next)); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Answer could not be saved.'); }
  }

  function clearAnswer(question: Question) {
    if (!attempt || !canEdit()) return;
    try { persist(answerQuestion(attempt, question.id, [])); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Answer could not be cleared.'); }
  }

  function navigate(questionId: string) {
    if (!attempt || !canEdit()) return;
    try {
      if (persist(setCurrentQuestion(attempt, questionId))) {
        jumpFocus.current = reviewStage !== null;
        setReviewStage(null);
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not open question.'); }
  }

  function toggleFlag(questionId: string) {
    if (!attempt || !canEdit()) return;
    try { persist(setFlag(attempt, questionId, !attempt.flags.includes(questionId))); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Flag could not be saved.'); }
  }

  function finalize(id: string, instant = Date.now(), reason: 'manual' | 'time expired' = 'manual') {
    if (finalizedIds.current.has(id)) return;
    const saved = submitStoredAttempt(browserStorage, id, instant, reason);
    if (!saved.ok || !saved.attempt) {
      setMessage(saved.ok ? 'Saved attempt was not found.' : saved.error);
      return;
    }
    finalizedIds.current.add(id);
    setAttempt(saved.attempt);
    setReviewStage(null);
    setView('results');
    setMessage('');
    refreshHistory();
    window.scrollTo(0, 0);
  }

  function submit() {
    if (attempt && reviewStage === 'confirm') finalize(attempt.id);
  }

  const unfinished = history.filter(saved => saved.status === 'in-progress');
  const reports = history.filter(saved => saved.status === 'submitted');
  const canStart = bankState.status === 'ready' && !historyLoading && historyErrors.length === 0;
  const questions = attempt?.snapshot.questions ?? [];
  const questionIndex = attempt ? Math.max(0, questions.findIndex(q => q.id === attempt.currentQuestionId)) : 0;
  const question = questions[questionIndex];
  const selected = question && attempt ? attempt.answers[question.id] ?? [] : [];
  const completed = attempt ? questions.filter(q => selectionStatus(q, attempt.answers[q.id] ?? []) === 'answered').length : 0;
  const unanswered = questions.length - completed;

  return <>
    <header className="site-header">
      <Container>
        <div className="site-header__inner">
          <div className="brand"><span className="brand__mark" aria-hidden="true">P</span><span>PCAO-F <span className="brand__suffix">practice</span></span></div>
          {view !== 'start' && <Button variant="quiet" onClick={() => { setReviewStage(null); setView('start'); window.scrollTo(0, 0); }}>Attempt history</Button>}
        </div>
      </Container>
    </header>
    {view === 'exam' && attempt && <div className="exam-bar">
      <Container className="exam-bar__inner">
        <p className="exam-bar__title">{attempt.snapshot.title}</p>
        <div className="exam-bar__metrics">
          <p className="answered-count"><strong>{completed} / {questions.length}</strong><span>answered</span></p>
          <div className="timer" role="timer" aria-live="off" aria-label="Time remaining">
            <span>Time remaining</span><strong>{clock(remainingMilliseconds(attempt.deadlineAt, now))}</strong>
          </div>
        </div>
      </Container>
    </div>}
    <main className={view === 'exam' ? 'exam-main' : undefined}>
      <Container className="reading-column">
        {message && <div className="validation-message app-message" role="alert">{message}</div>}
        {view === 'start' && <>
          <p className="eyebrow">Independent practice</p>
          <h1>Independent PCAO-F Practice</h1>
          <p className="lead">Independently prepared practice questions to help you prepare for PCAO-F. This is not an official certification exam.</p>
          <Button className="source-courses-button" aria-haspopup="dialog" aria-expanded={coursesOpen} onClick={() => setCoursesOpen(true)}>Source courses</Button>
          <SourceCoursesDrawer open={coursesOpen} bankState={bankState} onClose={() => setCoursesOpen(false)}
            onRetry={() => { setBankState({ status: 'loading' }); void loadQuestionBank().then(setBankState); }} />
          <Card className="start-card">
            <div className="status-heading">
              <h2>Before you begin</h2>
              <span className={'status-badge status-badge--' + bankState.status}>{bankState.status === 'ready' ? 'Ready' : bankState.status === 'loading' ? 'Loading' : 'Unavailable'}</span>
            </div>
            <div className="exam-facts" aria-label="Exam details">
              <div><strong>60</strong><span>questions</span></div>
              <div><strong>120</strong><span>minutes</span></div>
              <div className="exam-facts__types"><strong>Item types</strong><span>Single-answer and multiple-response</span></div>
            </div>
            <ul className="start-instructions">
              <li>Use Previous and Next to navigate, or jump to a question from Review &amp; submit.</li>
              <li>Flag questions to revisit before submitting.</li>
              <li>Select exactly the number of answers stated for each item. Only the exact correct set earns a point.</li>
              <li>Practice score out of 1000 and Passed/Failed status appear after submission. Passing score: 720 / 1000.</li>
              <li>Correct answers, explanations, and individual question references appear after submission.</li>
              <li>The timer keeps running if you leave or refresh. Your attempt submits automatically when time expires.</li>
            </ul>
            {bankState.status === 'loading' && <p role="status">Loading the reviewed question bank…</p>}
            {bankState.status === 'error' && <div className="validation-message" role="alert"><p>The reviewed question bank is unavailable or incomplete. You cannot start a new exam yet.</p><p>Try loading it again. Saved attempts and reports use their original question bank.</p><Button onClick={() => { setBankState({ status: 'loading' }); void loadQuestionBank().then(setBankState); }}>Retry loading</Button></div>}
            {bankState.status === 'ready' && <p className="footnote">Dataset {bankState.bank.version} · Question and answer option order is fixed.</p>}
            {unfinished.length > 0 && <p className="resume-note">You have an unfinished attempt. Resume with your saved answers, flags, and original deadline.</p>}
            <div className="card-actions">
              {unfinished.length === 1 && <Button variant="primary" onClick={() => openSaved(unfinished[0])}>Resume attempt</Button>}
              <Button variant={unfinished.length ? 'secondary' : 'primary'} disabled={!canStart} onClick={() => start()}>{unfinished.length ? 'Start another exam' : 'Start exam'}</Button>
            </div>
          </Card>
          <section className="history-section" aria-labelledby="history-title">
            <h2 id="history-title">Your attempts</h2>
            <p className="muted">History is saved on this device/browser. It is not synced to other devices.</p>
            {historyLoading ? <Card><p role="status">Loading your saved attempts…</p></Card> : <>
              {historyErrors.length > 0 && <div className="validation-message" role="alert"><p>Some saved attempts could not be read. Check that browser storage is available, then try again.</p><p>New exams are paused to protect unfinished attempts.</p><Button onClick={refreshHistory}>Retry saved attempts</Button></div>}
              {history.length === 0 && historyErrors.length === 0 && <Card className="history-empty"><p className="muted">No attempts yet. Complete an exam to see your score and report here.</p></Card>}
              <div className="history-list">
                {unfinished.map(saved => <Card key={saved.id} className="history-row">
                  <div className="history-row__text"><strong>Unfinished attempt</strong><span>Started {dateTime(saved.startedAt)} · Dataset {saved.datasetVersion}</span><span>Deadline {dateTime(saved.deadlineAt)}</span></div>
                  {unfinished.length > 1 && <Button onClick={() => openSaved(saved)}>Resume attempt</Button>}
                </Card>)}
                {reports.map(saved => {
                  const result = gradeAttempt(saved);
                  const practice = practiceResult(result.correct, result.total);
                  return <Card key={saved.id} className="history-row">
                    <div className="history-row__text"><strong>Completed {dateTime(saved.submittedAt!)}</strong><span>Practice score {practice.practiceScore} / 1000 · {result.correct} / {result.total} correct · Dataset {saved.datasetVersion}</span><span className={'practice-status practice-status--' + (practice.passed ? 'passed' : 'failed')}>{practice.passed ? 'Passed' : 'Failed'}</span></div>
                    <Button onClick={() => openSaved(saved)}>Open report</Button>
                  </Card>;
                })}
              </div>
            </>}
          </section>
          <p className="footnote">Practice score uses equal-weight question scoring; it is not an official certification score.</p>
        </>}

        {view === 'exam' && attempt && question && <>
          <p className="eyebrow">Timed attempt · dataset {attempt.datasetVersion}</p>
          <div className="question-heading">
            <h1 className="question-position" ref={questionHeading} tabIndex={-1}>Question {questionIndex + 1}<span> of {questions.length}</span></h1>
            <Button className="flag-toggle" onClick={() => toggleFlag(question.id)} aria-pressed={attempt.flags.includes(question.id)}>
              <span aria-hidden="true">⚑</span> {attempt.flags.includes(question.id) ? 'Flagged' : 'Flag for review'}
            </Button>
          </div>
          <Card className="question-card">
            <div className="question-stem"><MarkdownContent>{question.stemMarkdown}</MarkdownContent></div>
            <p className="instruction" id="selection-instruction">{selectionLabel(question)}</p>
            {question.selectionCount > 1 && <p className="selection-counter" id="selection-counter" role="status">
              {selected.length} of {question.selectionCount} selected. {selected.length === question.selectionCount ? 'Deselect an option to choose another.' : ''}
            </p>}
            <fieldset key={question.id} className="options" aria-describedby={question.selectionCount > 1 ? 'selection-instruction selection-counter' : 'selection-instruction'}>
              <legend className="sr-only">Answers for question {questionIndex + 1}</legend>
              {question.options.map(option => {
                const checked = selected.includes(option.id);
                return <label className={`option-card ${checked ? 'option-card--selected' : ''}`} key={option.id}>
                  <input type={question.selectionCount === 1 ? 'radio' : 'checkbox'} name={`answer-${question.id}`} value={option.id} checked={checked}
                    disabled={question.selectionCount > 1 && !checked && selected.length === question.selectionCount}
                    onChange={event => changeAnswer(question, option.id, event.target.checked)} />
                  <span className="option-label">{option.id}</span>
                  <span className="option-text"><MarkdownContent>{option.textMarkdown}</MarkdownContent></span>
                </label>;
              })}
            </fieldset>
            <div className="question-tools">
              <Button variant="quiet" onClick={() => clearAnswer(question)} disabled={selected.length === 0}>Clear answer</Button>
            </div>
          </Card>
          <nav className="exam-nav" aria-label="Question navigation">
            <Button disabled={questionIndex === 0} onClick={() => navigate(questions[questionIndex - 1]?.id)}>Previous</Button>
            <Button disabled={questionIndex === questions.length - 1} onClick={() => navigate(questions[questionIndex + 1]?.id)}>Next</Button>
            <Button variant="primary" onClick={() => { if (canEdit()) setReviewStage('review'); }}>Review &amp; submit</Button>
          </nav>
          <ReviewSubmitDialog attempt={attempt} stage={reviewStage}
            remainingTime={clock(remainingMilliseconds(attempt.deadlineAt, now))}
            unanswered={unanswered} message={message}
            onClose={() => {
              if (canEdit()) setReviewStage(reviewStage === 'confirm' ? 'review' : null);
            }}
            onBack={() => { if (canEdit()) setReviewStage(null); }}
            onConfirm={() => { if (canEdit()) setReviewStage('confirm'); }}
            onSubmit={submit} onNavigate={navigate} />
        </>}

        {view === 'results' && attempt?.status === 'submitted' && <ResultsPage key={attempt.id}
          attempt={attempt} headingRef={resultsHeading} canStart={canStart} onStart={() => start()}
          onHistory={() => { setView('start'); window.scrollTo(0, 0); }} />}
        {confirmation && <Dialog open title="Start another exam?" onClose={() => setConfirmation(null)}
          actions={<><Button onClick={() => setConfirmation(null)}>Keep unfinished attempt</Button><Button variant="primary" disabled={!canStart} onClick={() => start(confirmation.map(saved => saved.id))}>Abandon and start exam</Button></>}>
          <p>Starting another exam will permanently discard {confirmation.length === 1 ? 'your unfinished attempt' : 'your ' + confirmation.length + ' unfinished attempts'}, including saved answers and flags. No report will be created for it.</p>
          <p>Your completed reports will stay saved. The new exam starts at Question 1 with a fresh 120-minute deadline.</p>
        </Dialog>}
      </Container>
    </main>
  </>;
}
