import { useEffect, useRef, useState } from 'react';
import { type Question } from './domain/bank';
import { createDifficultyBankLoader, difficultyLabel, type Difficulty, type DifficultyBankState } from './domain/difficulty';
import {
  answerQuestion, gradeAttempt, listAttempts, recoverAttempt,
  remainingMilliseconds, saveAttempt, selectionStatus, setCurrentQuestion,
  setFlag, startStoredAttempt, submitStoredAttempt, type Attempt, type AttemptStorage, type StartRecovery,
} from './domain/attempt';
import { MarkdownContent } from './ui/MarkdownContent';
import { Button, Card, Container, Dialog } from './ui/primitives';
import { ReviewSubmitDialog } from './ui/ReviewSubmitDialog';
import { practiceResult } from './domain/results';
import { SourceCoursesDrawer } from './ui/SourceCoursesDrawer';
import { ResultsPage } from './ui/ResultsPage';
import { withBrowserStorageLock } from './domain/browserStorage';
import { DifficultySelectionDialog, type ExamPreparation } from './ui/DifficultySelectionDialog';
import { useAccountHistory } from './hooks/useAccountHistory';
import { AccountPanel, ReportBackupActions } from './ui/AccountPanel';
import { AccountHeader } from './ui/AccountHeader';
import { AccountSettingsPage } from './ui/AccountSettingsPage';
import type { CloudReport } from './domain/cloudReports';
import { attachAnalyticsEngagement, setAnalyticsContext, trackEvent } from './services/analytics';

type View = 'start' | 'exam' | 'results' | 'settings';

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
  const [loadBank] = useState(() => createDifficultyBankLoader());
  const [bankStates, setBankStates] = useState<Record<Difficulty, DifficultyBankState>>({ advanced: { status: 'loading' }, intermediate: { status: 'loading' } });
  const hasReadyBank = Object.values(bankStates).some(state => state.status === 'ready');
  const banksLoading = Object.values(bankStates).some(state => state.status === 'loading');
  const bankStatus = hasReadyBank ? 'ready' : banksLoading ? 'loading' : 'error';
  const failedBanks = (['advanced', 'intermediate'] as const).filter(difficulty => bankStates[difficulty].status === 'error');
  const mounted = useRef(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [coursesDifficulty, setCoursesDifficulty] = useState<Difficulty>('advanced');
  const [history, setHistory] = useState<Attempt[]>([]);
  const [accountReport, setAccountReport] = useState<{ userId: string; attempt: Attempt } | null>(null);
  const [historyErrors, setHistoryErrors] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [preparation, setPreparation] = useState<ExamPreparation | null>(null);
  const preparationRef = useRef<ExamPreparation | null>(null);
  const starting = useRef(false);
  const [startPending, setStartPending] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const attemptRef = useRef<Attempt | null>(null);
  const pendingEdits = useRef<{ attemptId: string; edit: (current: Attempt) => Attempt; optimistic: boolean }[]>([]);
  const [view, setView] = useState<View>('start');
  const [reviewStage, setReviewStage] = useState<'review' | 'confirm' | null>(null);
  const [leavingExam, setLeavingExam] = useState(false);
  const [leaveDestination, setLeaveDestination] = useState<'start' | 'settings'>('start');
  const [keepAccountCopy, setKeepAccountCopy] = useState(false);
  const jumpFocus = useRef(false);
  const finalizedIds = useRef(new Set<string>());
  const finalizingIds = useRef(new Set<string>());
  const [now, setNow] = useState(Date.now());
  const [message, setMessage] = useState('');
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const settingsHeading = useRef<HTMLHeadingElement>(null);
  const startHeading = useRef<HTMLHeadingElement>(null);
  const previousView = useRef<View>(view);
  const supportsSaving = Boolean(navigator.locks);
  const account = useAccountHistory(browserStorage, history, refreshHistory);
  const reportAttempt = accountReport?.attempt ?? attempt;
  useEffect(() => attachAnalyticsEngagement(), []);
  useEffect(() => {
    setAnalyticsContext({ view, difficulty: view === 'start' || view === 'settings' ? null : reportAttempt?.difficulty ?? 'original' });
  }, [view, reportAttempt?.difficulty]);
  const previousReview = useRef(false);
  useEffect(() => {
    if (reviewStage && !previousReview.current) trackEvent('review_opened', { difficulty: attempt?.difficulty ?? 'original' });
    previousReview.current = reviewStage !== null;
  }, [reviewStage, attempt?.difficulty]);
  const unfinishedDeadlines = history.filter(saved => saved.status === 'in-progress')
    .map(saved => `${saved.id}:${saved.deadlineAt}`).join('|');

  function updatePreparation(next: ExamPreparation | null) {
    preparationRef.current = next;
    setPreparation(next);
  }

  async function ensureBank(difficulty: Difficulty, retry = false) {
    setBankStates(current => ({ ...current, [difficulty]: { status: 'loading' } }));
    const state = await loadBank(difficulty, retry);
    if (mounted.current) setBankStates(current => ({ ...current, [difficulty]: state }));
  }

  function chooseDifficulty(difficulty: Difficulty) {
    const current = preparationRef.current;
    if (!current || starting.current) return;
    updatePreparation({ difficulty });
    setMessage('');
    void ensureBank(difficulty);
  }

  function openDifficulty() {
    if (!supportsSaving || historyLoading || historyErrors.length || starting.current) return;
    updatePreparation({ difficulty: 'intermediate' });
    setMessage('');
    void ensureBank('intermediate');
  }

  function closePreparation() {
    if (!starting.current) { updatePreparation(null); setMessage(''); }
  }

  function updateAttempt(next: Attempt | null) {
    setAccountReport(null);
    attemptRef.current = next;
    displayAttempt(next);
  }

  function displayAttempt(saved: Attempt | null) {
    let visible = saved;
    if (visible?.status === 'in-progress') {
      for (const pending of pendingEdits.current) {
        if (!pending.optimistic || pending.attemptId !== visible.id) continue;
        try { visible = pending.edit(visible); }
        catch { /* The queued operation reports validation errors when it runs. */ }
      }
    }
    setAttempt(visible);
  }

  async function storageAction<T>(action: () => T): Promise<T | undefined> {
    try { return await withBrowserStorageLock(action); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Browser storage could not be updated. Try again.'); }
  }

  function synchronizeAttempt() {
    refreshHistory();
    const current = attemptRef.current;
    if (!current) return;
    if (!account.canView(current.id)) { updateAttempt(null); setView('start'); return; }
    const recovered = recoverAttempt(browserStorage, current.id);
    if (!recovered.ok) { setMessage(recovered.error); return; }
    if (!recovered.attempt) {
      updateAttempt(null);
      setReviewStage(null);
      setLeavingExam(false);
      updatePreparation(null);
      setView('start');
      setMessage('This attempt is no longer saved. It may have been replaced in another tab.');
      return;
    }
    const latest = recovered.attempt;
    if ((latest.revision ?? 0) !== (current.revision ?? 0) || latest.status !== current.status) updateAttempt(latest);
    if (latest.status === 'submitted' && current.status === 'in-progress') {
      setReviewStage(null);
      setLeavingExam(false);
      updatePreparation(null);
      setCoursesOpen(false);
      setView('results');
      setMessage('This attempt was submitted in another tab. Its saved report is shown here.');
      window.scrollTo(0, 0);
    }
  }

  function refreshHistory() {
    const loaded = listAttempts(browserStorage);
    setHistory(loaded.attempts);
    setHistoryErrors(loaded.errors);
    setHistoryLoading(false);
  }

  useEffect(() => {
    mounted.current = true;
    void ensureBank('advanced');
    void ensureBank('intermediate');
    refreshHistory();
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!unfinishedDeadlines) return;
    const tick = () => {
      const instant = Date.now();
      setNow(instant);
      // Monitor saved unfinished attempts even when Start is showing after a reopen.
      for (const saved of history) {
        if (saved.status === 'in-progress' && instant >= saved.deadlineAt) void finalize(saved.id, instant, 'time expired');
      }
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
  }, [unfinishedDeadlines]);

  useEffect(() => {
    const synchronize = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith('pcao-f:attempt')) void storageAction(synchronizeAttempt);
    };
    window.addEventListener('storage', synchronize);
    return () => window.removeEventListener('storage', synchronize);
  }, []);

  useEffect(() => {
    if (!history.some(saved => saved.status === 'in-progress')) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (!history.some(saved => saved.status === 'in-progress' && remainingMilliseconds(saved.deadlineAt) > 0)) return;
      event.preventDefault();
      // Browsers supply their own warning text; returnValue supports older browsers.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [history]);

  useEffect(() => {
    if (view === 'exam') {
      questionHeading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (view === 'results') resultsHeading.current?.focus({ preventScroll: true });
    if (view === 'settings') {
      settingsHeading.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    if (view === 'start' && previousView.current === 'settings') startHeading.current?.focus({ preventScroll: true });
    previousView.current = view;
  }, [view, attempt?.currentQuestionId, accountReport?.attempt.id]);

  useEffect(() => {
    if (!reviewStage && jumpFocus.current && view === 'exam') {
      jumpFocus.current = false;
      questionHeading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [reviewStage, view]);

  async function editAttempt(edit: (current: Attempt) => Attempt, optimistic = false) {
    const original = attemptRef.current;
    if (!original || !canEdit()) return false;
    const pending = { attemptId: original.id, edit, optimistic };
    pendingEdits.current.push(pending);
    // Controlled answer inputs respond immediately while the cross-tab lock is acquired.
    displayAttempt(original);
    try {
      return await storageAction(() => {
        pendingEdits.current = pendingEdits.current.filter(item => item !== pending);
        const current = attemptRef.current;
        if (!current || current.id !== original.id || !canEdit()) return false;
        const saved = saveAttempt(browserStorage, edit(current), current.revision ?? 0);
        if (!saved.ok) {
          synchronizeAttempt();
          setMessage(saved.error);
          return false;
        }
        updateAttempt(saved.attempt);
        setMessage('');
        refreshHistory();
        return true;
      });
    } finally {
      pendingEdits.current = pendingEdits.current.filter(item => item !== pending);
      displayAttempt(attemptRef.current);
    }
  }

  useEffect(() => {
    if (view !== 'exam') starting.current = false;
  }, [view]);

  async function start(confirmedIds: readonly string[] = []) {
    const currentPreparation = preparationRef.current;
    if (!currentPreparation) return;
    const selectedBank = bankStates[currentPreparation.difficulty];
    if (!supportsSaving || selectedBank.status !== 'ready' || historyLoading || historyErrors.length || starting.current) return;
    starting.current = true;
    setStartPending(true);
    let opened = false;
    try {
      const saved = await storageAction<StartRecovery | null>(() => {
        if (preparationRef.current !== currentPreparation) return null;
        const previousAttempts = listAttempts(browserStorage).attempts;
        const foreign = previousAttempts.some(item => item.status === 'in-progress' && remainingMilliseconds(item.deadlineAt) > 0 && !account.canView(item.id));
        if (foreign) return { ok: false, error: 'An unfinished attempt belongs to another account on this device. Sign in to that account or wait for its deadline.' };
        const result = startStoredAttempt(browserStorage, selectedBank.bank, confirmedIds, Date.now(), currentPreparation.difficulty);
        // Starting can also preserve expired reports; count only transitions made inside this lock.
        for (const previous of previousAttempts) {
          if (previous.status !== 'in-progress') continue;
          const latest = recoverAttempt(browserStorage, previous.id);
          if (latest.ok && latest.attempt?.status === 'submitted') trackCompletion(latest.attempt);
        }
        if (result.ok && result.attempt) {
          try { account.bindNewAttempt(result.attempt); }
          catch { account.setNotice('The exam is saved on this device. Automatic backup could not be enabled for it; choose Back up report after completion.'); }
        }
        return result;
      });
      if (!saved) return;
      if (!saved.ok) {
        if ('unfinishedAttempts' in saved) { updatePreparation({ ...currentPreparation, unfinished: saved.unfinishedAttempts }); setMessage(''); }
        else setMessage(saved.error);
        refreshHistory();
        return;
      }
      if (!saved.attempt) return;
      trackEvent('exam_started', { difficulty: saved.attempt.difficulty ?? 'original', attempt_id: saved.attempt.id });
      opened = true;
      updatePreparation(null);
      updateAttempt(saved.attempt);
      setView('exam');
      setNow(Date.now());
      setMessage('');
      refreshHistory();
      window.scrollTo(0, 0);
    } finally { setStartPending(false); if (!opened) starting.current = false; }
  }

  async function openSaved(saved: Attempt) {
    if (!account.canView(saved.id)) { setMessage('Sign in to the account that owns this device report.'); return; }
    // Read-only reports remain available even if coordinated saving is unavailable.
    const recovered = saved.status === 'submitted' ? recoverAttempt(browserStorage, saved.id)
      : await storageAction(() => {
        const latest = recoverAttempt(browserStorage, saved.id);
        return latest.ok && latest.attempt?.status === 'in-progress' && remainingMilliseconds(latest.attempt.deadlineAt) === 0
          ? submitWithAnalytics(saved.id, Date.now(), 'time expired') : latest;
      });
    if (!recovered) return;
    if (!recovered.ok || !recovered.attempt) {
      setMessage(recovered.ok ? 'Saved attempt was not found. Refresh your attempts and try again.' : recovered.error);
      refreshHistory();
      return;
    }
    updateAttempt(recovered.attempt);
    if (recovered.attempt.status === 'in-progress') trackEvent('exam_resumed', {
      difficulty: recovered.attempt.difficulty ?? 'original', attempt_id: recovered.attempt.id,
    });
    setView(recovered.attempt.status === 'submitted' ? 'results' : 'exam');
    setMessage('');
    setNow(Date.now());
    refreshHistory();
    window.scrollTo(0, 0);
  }

  async function openAccountReport(row: CloudReport, keep: boolean) {
    const payload = await account.download(row, keep);
    if (account.currentOwner() !== row.user_id) return;
    updateAttempt(null);
    setAccountReport({ userId: row.user_id, attempt: payload });
    setView('results'); setMessage('');
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    setKeepAccountCopy(false);
    if (!account.userId && view === 'settings') setView('start');
    if (accountReport && accountReport.userId !== account.userId) { setAccountReport(null); setView('start'); }
    const current = attemptRef.current;
    if (current && !account.canView(current.id)) {
      updateAttempt(null); setReviewStage(null); setLeavingExam(false); updatePreparation(null); setView('start');
    }
  }, [account.userId]);

  function canEdit(): boolean {
    const current = attemptRef.current;
    if (!current || current.status !== 'in-progress' || !account.canView(current.id)) return false;
    if (remainingMilliseconds(current.deadlineAt) === 0) {
      void finalize(current.id, Date.now(), 'time expired');
      return false;
    }
    return true;
  }

  function changeAnswer(question: Question, optionId: string, checked: boolean) {
    void editAttempt(current => {
      const selected = current.answers[question.id] ?? [];
      let next: string[];
      if (question.selectionCount === 1) next = [optionId];
      else if (!checked) next = selected.filter(id => id !== optionId);
      else if (selected.length < question.selectionCount) next = [...selected, optionId];
      else throw new Error(`Select no more than ${question.selectionCount} answers. Clear one first.`);
      return answerQuestion(current, question.id, next);
    }, true);
  }

  function clearAnswer(question: Question) {
    void editAttempt(current => answerQuestion(current, question.id, []), true);
  }

  async function navigate(questionId: string) {
    if (await editAttempt(current => setCurrentQuestion(current, questionId))) {
      jumpFocus.current = reviewStage !== null;
      setReviewStage(null);
    }
  }

  function toggleFlag(questionId: string) {
    void editAttempt(current => setFlag(current, questionId, !current.flags.includes(questionId)));
  }

  function trackCompletion(saved: Attempt) {
    if (!account.canView(saved.id)) return;
    trackEvent('exam_completed', {
      difficulty: saved.difficulty ?? 'original', attempt_id: saved.id,
      submission_reason: saved.submissionReason === 'manual' ? 'manual' : 'timeout',
      elapsed_seconds: Math.max(0, Math.min(saved.submittedAt!, saved.deadlineAt) - saved.startedAt) / 1000,
    });
  }

  function submitWithAnalytics(id: string, instant: number, reason: 'manual' | 'time expired') {
    const previous = recoverAttempt(browserStorage, id);
    const saved = submitStoredAttempt(browserStorage, id, instant, reason);
    if (previous.ok && previous.attempt?.status === 'in-progress' && saved.ok && saved.attempt?.status === 'submitted') trackCompletion(saved.attempt);
    return saved;
  }

  async function finalize(id: string, instant = Date.now(), reason: 'manual' | 'time expired' = 'manual') {
    if (finalizedIds.current.has(id) || finalizingIds.current.has(id)) return;
    const previouslyOpenId = attemptRef.current?.id;
    finalizingIds.current.add(id);
    const saved = await storageAction(() => submitWithAnalytics(id, Math.max(instant, Date.now()), reason));
    finalizingIds.current.delete(id);
    if (!saved) return;
    if (!saved.ok || !saved.attempt) {
      setMessage(saved.ok ? 'Saved attempt was not found.' : saved.error);
      return;
    }
    finalizedIds.current.add(id);
    if (!account.canView(id)) { refreshHistory(); return; }
    // A queued expiry must not take the user out of a newer attempt opened meanwhile.
    if (attemptRef.current && attemptRef.current.id !== id && attemptRef.current.id !== previouslyOpenId) {
      refreshHistory();
      return;
    }
    updateAttempt(saved.attempt);
    setReviewStage(null);
    setLeavingExam(false);
    updatePreparation(null);
    setCoursesOpen(false);
    setView('results');
    setMessage('');
    refreshHistory();
    window.scrollTo(0, 0);
  }

  function showAccountPage(destination: 'start' | 'settings') {
    setReviewStage(null);
    setLeavingExam(false);
    setView(destination === 'settings' && account.userId ? 'settings' : 'start');
    window.scrollTo(0, 0);
  }

  function showHistory() { showAccountPage('start'); }

  function requestAccountPage(destination: 'start' | 'settings') {
    if (view === 'exam' && attempt?.status === 'in-progress') {
      if (canEdit()) { setLeaveDestination(destination); setLeavingExam(true); }
      return;
    }
    showAccountPage(destination);
  }

  function requestHistory() { requestAccountPage('start'); }

  function submit() {
    if (attempt && reviewStage === 'confirm') finalize(attempt.id);
  }

  const visibleHistory = history.filter(saved => account.canView(saved.id));
  const unfinished = visibleHistory.filter(saved => saved.status === 'in-progress');
  const reports = visibleHistory.filter(saved => saved.status === 'submitted');
  const displayedReport = accountReport?.attempt ?? attempt;
  const canStart = supportsSaving && hasReadyBank && !historyLoading && historyErrors.length === 0;
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
          <div className="site-header__actions">
            {view !== 'start' && <Button variant="quiet" onClick={requestHistory}>Attempt history</Button>}
            {account.userId && <Button variant="quiet" aria-current={view === 'settings' ? 'page' : undefined} onClick={() => requestAccountPage('settings')}>Account settings</Button>}
            <AccountHeader account={account} />
          </div>
        </div>
      </Container>
    </header>
    {view === 'exam' && attempt && <div className="exam-bar">
      <Container className="exam-bar__inner">
        <p className="exam-bar__title">{attempt.snapshot.title}<span className="exam-difficulty">{difficultyLabel(attempt.difficulty)}</span></p>
        <div className="exam-bar__metrics">
          <p className="answered-count"><strong>{completed} / {questions.length}</strong><span>answered</span></p>
          <div className={'timer' + (reviewStage || leavingExam ? ' timer--concealed' : '')} role="timer" aria-live="off" aria-label="Time remaining" aria-hidden={Boolean(reviewStage || leavingExam)}>
            <span>Time remaining</span><strong>{clock(remainingMilliseconds(attempt.deadlineAt, now))}</strong>
          </div>
        </div>
      </Container>
    </div>}
    <main className={view === 'exam' ? 'exam-main' : undefined}>
      <Container className="reading-column">
        {message && !preparation && <div className="validation-message app-message" role="alert">{message}</div>}
        {view === 'start' && <>
          <p className="eyebrow">Independent practice</p>
          <h1 ref={startHeading} tabIndex={-1}>Independent PCAO-F Practice</h1>
          <p className="lead">Independently prepared practice questions to help you prepare for PCAO-F. This is not an official certification exam.</p>
          <Button className="source-courses-button" aria-haspopup="dialog" aria-expanded={coursesOpen} onClick={() => { setCoursesDifficulty('advanced'); setCoursesOpen(true); }}>Source courses</Button>
          <SourceCoursesDrawer open={coursesOpen} difficulty={coursesDifficulty} bankState={bankStates[coursesDifficulty]} onClose={() => setCoursesOpen(false)}
            onSelect={difficulty => { setCoursesDifficulty(difficulty); void ensureBank(difficulty); }}
            onRetry={() => { void ensureBank(coursesDifficulty, true); }} />
          <Card className="start-card">
            <div className="status-heading">
              <h2>Before you begin</h2>
              <span className={'status-badge status-badge--' + bankStatus}>{bankStatus === 'ready' ? 'Ready' : bankStatus === 'loading' ? 'Loading' : 'Unavailable'}</span>
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
            {!hasReadyBank && banksLoading && <p role="status">Loading the reviewed question banks…</p>}
            {failedBanks.length > 0 && <div className="validation-message" role="alert">
              <p>{failedBanks.map(difficultyLabel).join(' and ')} question {failedBanks.length === 1 ? 'bank is' : 'banks are'} unavailable or incomplete.</p>
              <p>{hasReadyBank ? 'You can start with the other available difficulty.' : 'You cannot start a new exam until a reviewed bank is available.'} Saved attempts and reports use their original question bank.</p>
              <Button onClick={() => { for (const difficulty of failedBanks) void ensureBank(difficulty, true); }}>Retry loading</Button>
            </div>}
            {(['advanced', 'intermediate'] as const).map(difficulty => {
              const state = bankStates[difficulty];
              return state.status === 'ready' && <p className="footnote" key={difficulty}>{difficultyLabel(difficulty)} · Dataset {state.bank.version} · Question and answer option order is fixed.</p>;
            })}
            {!supportsSaving && <p className="validation-message" role="alert">This browser cannot safely save attempts. Open the app in an up-to-date browser. Saved reports can still be viewed.</p>}
            {unfinished.length > 0 && <p className="resume-note">You have an unfinished attempt. Your timer is still running. Resume with your saved answers, flags, and original deadline.</p>}
            <div className="card-actions">
              {unfinished.length === 1 && <Button variant="primary" onClick={() => openSaved(unfinished[0])}>Resume attempt</Button>}
              <Button variant={unfinished.length ? 'secondary' : 'primary'} disabled={!canStart} aria-haspopup="dialog" onClick={openDifficulty}>{unfinished.length ? 'Start another exam' : 'Start exam'}</Button>
            </div>
          </Card>
          <section className="history-section" aria-labelledby="history-title">
            <h2 id="history-title">Your attempts</h2>
            <p className="muted">{account.available ? 'Device history stays in this browser. Create an account to automatically back up completed reports across devices.' : 'History is saved on this device/browser. It is not synced to other devices.'}</p>
            {historyLoading ? <Card><p role="status">Loading your saved attempts…</p></Card> : <>
              {historyErrors.length > 0 && <div className="validation-message" role="alert"><p>Some saved attempts could not be read. Check that browser storage is available, then try again.</p><p>New exams are paused to protect unfinished attempts.</p><Button onClick={refreshHistory}>Retry saved attempts</Button></div>}
              {visibleHistory.length === 0 && historyErrors.length === 0 && <Card className="history-empty"><p className="muted">No attempts yet. Complete an exam to see your score and report here.</p></Card>}
              <div className="history-list">
                {unfinished.map(saved => <Card key={saved.id} className="history-row">
                  <div className="history-row__text"><strong>Unfinished attempt</strong><span>{difficultyLabel(saved.difficulty)} · Started {dateTime(saved.startedAt)} · Dataset {saved.datasetVersion}</span><span>Deadline {dateTime(saved.deadlineAt)}</span></div>
                  {unfinished.length > 1 && <Button onClick={() => openSaved(saved)}>Resume attempt</Button>}
                </Card>)}
                {reports.map(saved => {
                  const result = gradeAttempt(saved);
                  const practice = practiceResult(result.correct, result.total);
                  return <Card key={saved.id} className="history-row">
                    <div className="history-row__text"><strong>Completed {dateTime(saved.submittedAt!)}</strong><span>{difficultyLabel(saved.difficulty)} · Practice score {practice.practiceScore} / 1000 · {result.correct} / {result.total} correct · Dataset {saved.datasetVersion}</span><span className={'practice-status practice-status--' + (practice.passed ? 'passed' : 'failed')}>{practice.passed ? 'Passed' : 'Failed'}</span></div>
                    <Button onClick={() => openSaved(saved)}>Open report</Button>
                    {account.available && <ReportBackupActions account={account} attempt={saved} />}
                  </Card>;
                })}
              </div>
            </>}
          </section>
          <AccountPanel key={account.userId ?? 'guest'} account={account} history={history} showHistory keepCopy={keepAccountCopy} onKeepCopyChange={setKeepAccountCopy} onOpenReport={openAccountReport} />
          <p className="footnote">Practice score uses equal-weight question scoring; it is not an official certification score.</p>
        </>}

        {view === 'exam' && attempt && question && <>
          <p className="eyebrow">{difficultyLabel(attempt.difficulty)} · Timed attempt · dataset {attempt.datasetVersion}</p>
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
          {leavingExam && <Dialog open title="Leave exam?" onClose={() => setLeavingExam(false)}
            actions={<><Button onClick={() => setLeavingExam(false)}>Stay in exam</Button><Button variant="primary" onClick={() => { if (canEdit()) showAccountPage(leaveDestination); }}>{leaveDestination === 'settings' ? 'Go to account settings' : 'Go to attempt history'}</Button></>}>
            <p>Your timer will keep running while you view {leaveDestination === 'settings' ? 'account settings' : 'attempt history'}. Your answers and flags are saved, and you can resume with the original deadline.</p>
            <p className="review-time" role="timer" aria-live="off" aria-label="Time remaining">Time remaining: <strong>{clock(remainingMilliseconds(attempt.deadlineAt, now))}</strong></p>
          </Dialog>}
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

        {view === 'settings' && account.userId && <AccountSettingsPage key={account.userId}
          account={account} history={history} keepCopy={keepAccountCopy} onKeepCopyChange={setKeepAccountCopy}
          onOpenReport={openAccountReport} onBack={showHistory} headingRef={settingsHeading} />}

        {view === 'results' && displayedReport?.status === 'submitted' && <>
          <ResultsPage key={displayedReport.id} attempt={displayedReport} headingRef={resultsHeading} canStart={canStart} onStart={openDifficulty} onHistory={showHistory} />
          {!accountReport && account.available && <ReportBackupActions account={account} attempt={displayedReport} />}
        </>}
        <DifficultySelectionDialog preparation={preparation} bankState={bankStates[preparation?.difficulty ?? 'intermediate']}
          busy={startPending} canSave={supportsSaving && !historyLoading && historyErrors.length === 0}
          hasUnfinished={unfinished.length > 0} message={message}
          onSelect={chooseDifficulty} onClose={closePreparation}
          onBack={() => { if (!starting.current && preparationRef.current) updatePreparation({ difficulty: preparationRef.current.difficulty }); }}
          onStart={() => { void start(preparationRef.current?.unfinished?.map(saved => saved.id) ?? []); }}
          onRetry={() => { if (preparationRef.current) void ensureBank(preparationRef.current.difficulty, true); }} />
      </Container>
    </main>
  </>;
}
