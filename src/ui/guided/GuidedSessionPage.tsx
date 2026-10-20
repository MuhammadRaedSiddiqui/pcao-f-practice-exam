import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button, Card } from '../primitives';
import { MarkdownContent } from '../MarkdownContent';
import { questionPresentation, learningSummary, type ValidatedGuidedSession, type PrecommitViewModel } from '../../domain/guided/session';
import type { GuidedCommand, GuidedItem } from '../../domain/guided/schema';

export function GuidedHintPanel({ hints, locked, pending, onReveal }: {
  hints: string[]; locked: boolean; pending: boolean; onReveal: () => void;
}) {
  const panelId = useId();
  const [expanded, setExpanded] = useState<number[]>([]);
  const savedHintCount = useRef(hints.length);
  const restoreFocus = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (hints.length > savedHintCount.current) {
      setExpanded(current => [...new Set([...current, hints.length - 1])]);
    }
    savedHintCount.current = hints.length;
  }, [hints.length]);
  useEffect(() => {
    if (!pending && restoreFocus.current) {
      const button = restoreFocus.current;
      restoreFocus.current = null;
      if (document.activeElement === document.body) button.focus();
    }
  }, [pending, hints.length]);
  return <section className="guided-hints" aria-label="Optional hints">
      {[0, 1, 2].map(index => {
        const revealed = index < hints.length;
        const open = revealed && expanded.includes(index);
        const unavailable = !revealed && (locked || pending || index !== hints.length);
        const contentId = `${panelId}-hint-${index + 1}`;
        const note = !revealed && locked ? 'Not requested before checking your answer.' :
          !revealed && index > hints.length ? `Open Hint ${index} first.` : null;
        return <div className="guided-hint-row" key={index}>
          <button type="button" className="guided-hint-toggle" aria-label={`Hint ${index + 1}`}
            aria-expanded={open} aria-controls={contentId} aria-describedby={note ? contentId + '-note' : undefined}
            disabled={unavailable} onClick={event => {
              if (revealed) setExpanded(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
              else {
                restoreFocus.current = document.activeElement === event.currentTarget ? event.currentTarget : null;
                onReveal();
              }
            }}>
            <span>Hint {index + 1}</span><span className="guided-hint-chevron" aria-hidden="true">›</span>
          </button>
          {note && <span id={contentId + '-note'} className="sr-only">{note}</span>}
          <div id={contentId} className="guided-hint-content" hidden={!open}>
            {open && <MarkdownContent children={hints[index]} />}
          </div>
        </div>;
      })}
  </section>;
}

// This component receives no answer keys, explanations, sources or unrevealed hints.
export function GuidedAnswering({ model, pending, onCommand }: { model: PrecommitViewModel; pending: boolean; onCommand: (command: GuidedCommand) => void }) {
  const [draft, setDraft] = useState<string[] | null>(null);
  const selectionInFlight = useRef(false);
  const selected = draft ?? model.selectedOptionIds;
  const waiting = pending || draft !== null;
  const restoreFocus = useRef<HTMLElement | null>(null);
  const choices = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (draft !== null && !pending && JSON.stringify(draft) === JSON.stringify(model.selectedOptionIds)) {
      selectionInFlight.current = false; setDraft(null);
    }
  }, [model.selectedOptionIds, pending, draft]);
  useEffect(() => {
    if (!waiting && restoreFocus.current) {
      const control = restoreFocus.current; restoreFocus.current = null;
      if (control.isConnected && document.activeElement === document.body) {
        const target = control instanceof HTMLButtonElement && control.disabled ? choices.current?.querySelector<HTMLInputElement>('input:not(:disabled)') : control;
        target?.focus();
      }
    }
  }, [waiting, model.selectedOptionIds]);
  const select = (ids: string[]) => {
    if (selectionInFlight.current || pending) return;
    selectionInFlight.current = true; setDraft(ids);
    onCommand({ kind: 'select', questionId: model.questionId, ids });
  };
  return <>
    <MarkdownContent children={model.stemMarkdown} />
    <GuidedHintPanel hints={model.revealedHints} locked={false} pending={waiting} onReveal={() => onCommand({ kind: 'revealNextHint', questionId: model.questionId })} />
    <fieldset className="guided-options" ref={choices} disabled={waiting}>
      <legend>Select exactly {model.selectionCount} {model.selectionCount === 1 ? 'answer' : 'answers'}</legend>
      {model.options.map(option => <label className="guided-option" key={option.id}>
        <input name={'guided-' + model.questionId} type={model.selectionCount === 1 ? 'radio' : 'checkbox'}
          checked={selected.includes(option.id)}
          disabled={waiting || (model.selectionCount > 1 && selected.length === model.selectionCount && !selected.includes(option.id))}
          onChange={event => {
            restoreFocus.current = event.currentTarget;
            select(model.selectionCount === 1 ? [option.id] : selected.includes(option.id) ? selected.filter(id => id !== option.id) : [...selected, option.id]);
          }} />
        <span><strong>{option.id}.</strong> <MarkdownContent children={option.textMarkdown} /></span>
      </label>)}
    </fieldset>
    <p>{selected.length} of {model.selectionCount} selected. Your first checked answer will be permanently locked in this session.</p>
    <div className="guided-actions">
      <Button disabled={waiting || selected.length === 0} onClick={event => { restoreFocus.current = event.currentTarget; select([]); }}>Clear selection</Button>
      <Button variant="primary" disabled={waiting || selected.length !== model.selectionCount}
        onClick={() => onCommand({ kind: 'commit', questionId: model.questionId, commandId: crypto.randomUUID() })}>Check answer</Button>
    </div>
  </>;
}

export function GuidedFeedback({ item, selected, correct, navigation, focusOnMount = true }: { item: GuidedItem; selected: string[]; correct: boolean; navigation?: ReactNode; focusOnMount?: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (focusOnMount) heading.current?.focus(); }, [item.question.id, focusOnMount]);
  return <section className="guided-feedback" aria-labelledby="guided-feedback-title">
    <h3 id="guided-feedback-title" ref={heading} tabIndex={-1}>{correct ? 'Correct' : 'Not quite'} — answer saved and locked</h3>
    <p>Your answer: {selected.join(', ')}. Correct answer: {item.question.correctOptionIds.join(', ')}.</p>
    {navigation}
    <h4>Decisive criteria</h4>
    <ul>{item.guide.decisiveCriteria.map((text, i) => <li key={i}><MarkdownContent children={text} /></li>)}</ul>
    <MarkdownContent children={item.guide.reasoningMarkdown} />
    <h4>Compare every option</h4>
    {item.guide.optionComparisons.map(comparison => <section className="guided-comparison" key={comparison.optionId}>
      <h5>Option {comparison.optionId}</h5>
      <MarkdownContent children={item.question.options.find(o => o.id === comparison.optionId)!.textMarkdown} />
      <p><strong>What it satisfies</strong></p><MarkdownContent children={comparison.satisfiesMarkdown} />
      <p><strong>Limits and constraints</strong></p><MarkdownContent children={comparison.failsOrLimitsMarkdown} />
    </section>)}
    <h4>Sources</h4>
    <ul>{item.question.sources.map((source, i) => <li key={i}><strong>{source.courseTitle}</strong> — {source.sectionHeading}
      {source.url && <MarkdownContent children={`[Open source](${source.url})`} />}</li>)}</ul>
    {item.guide.sourceChecks.map((source, i) => <section key={i}><MarkdownContent children={source.claim} /><MarkdownContent children={source.evidenceLocator} /></section>)}
  </section>;
}

export function GuidedSummary({ session, pending, onReview }: { session: ValidatedGuidedSession; pending: boolean; onReview: (index: number) => void }) {
  const summary = learningSummary(session);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <Card className="guided-summary"><h2 ref={heading} tabIndex={-1}>Practice completed</h2>
    <p>{summary.correct} correct of {summary.committed} committed answers; {summary.total} questions in this session.</p>
    <p>{summary.correctWithoutHints} correct without hints of {summary.committed} committed answers.</p>
    <p>{summary.hintsRequested} hints requested.</p>
    <p>Items to revisit:{summary.revisitQuestionIds.length === 0 && ' None in this session.'}</p>
    {summary.revisitQuestionIds.length > 0 && <div className="guided-actions" role="group" aria-label="Questions to revisit">
      {session.items.map((item, index) => summary.revisitQuestionIds.includes(item.question.id) &&
        <Button key={item.question.id} disabled={pending} onClick={() => onReview(index)}>Review question {index + 1}</Button>)}
    </div>}
    <p>{summary.exposureNotice}.</p><p>Completed answers are read-only. Start a new session to practise again.</p>
  </Card>;
}

export function GuidedSessionPage({ session, pending, message, onCommand }: { session: ValidatedGuidedSession; pending: boolean; message: string; onCommand: (command: GuidedCommand) => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const progressId = useId();
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const index = session.status === 'completed' ? (reviewIndex ?? session.currentIndex) : session.currentIndex;
  const questionId = session.items[index].question.id;
  const presentation = questionPresentation(session, questionId);
  const viewedQuestion = useRef(questionId);
  useEffect(() => {
    const changed = viewedQuestion.current !== questionId;
    viewedQuestion.current = questionId;
    if (session.status === 'completed') {
      if (!changed) {
        const summary = document.querySelector<HTMLElement>('.guided-summary h2');
        summary?.scrollIntoView({ block: 'start' });
        summary?.focus({ preventScroll: true });
        return;
      }
      heading.current?.scrollIntoView({ block: 'start' });
    } else window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [questionId, session.status]);
  if (!presentation.ok) return <p role="alert">This question is unavailable. Return to Guided Practice and retry.</p>;
  const model = presentation.value;
  const unanswered = session.items.map((item, itemIndex) => session.responses[item.question.id].commitment ? -1 : itemIndex).filter(itemIndex => itemIndex >= 0);
  const nextUnanswered = unanswered.find(itemIndex => itemIndex > index) ?? unanswered[0];
  const navigateTo = (target: number) => {
    if (pending) return;
    if (target === index) { heading.current?.scrollIntoView({ block: 'start' }); heading.current?.focus({ preventScroll: true }); }
    else if (session.status === 'completed') setReviewIndex(target);
    else onCommand({ kind: 'navigate', index: target });
  };
  const navigation = <nav aria-label="Practice questions" className="guided-navigation">
    {session.status !== 'completed' && <p id={progressId}>
      {session.items.length - unanswered.length} of {session.items.length} answers checked.{' '}
      {unanswered.length > 0 ? `${unanswered.length} ${unanswered.length === 1 ? 'question still needs' : 'questions still need'} checking before you can finish.` : 'Ready to finish practice.'}
    </p>}
    <div className="guided-actions">
      <Button disabled={pending || index === 0} onClick={() => navigateTo(index - 1)}>Previous</Button>
      <Button disabled={pending || index === session.items.length - 1} onClick={() => navigateTo(index + 1)}>Next</Button>
      {session.status !== 'completed' && <>
        {unanswered.length > 0 && <Button disabled={pending} onClick={() => navigateTo(nextUnanswered)}>Go to next unanswered question</Button>}
        <Button variant="primary" disabled={pending || unanswered.length > 0} aria-describedby={progressId}
          onClick={() => onCommand({ kind: 'finish', commandId: crypto.randomUUID() })}>Finish practice</Button>
      </>}
    </div>
  </nav>;
  return <div className="guided-session">
    <h1>Guided Practice</h1><p>Untimed · learn the reasoning · saved only in this browser</p>
    {session.origin.kind === 'post-exam' && <p>Answers may already have been seen. This guided retry does not change your original Mock results.</p>}
    {session.status === 'completed' && <GuidedSummary session={session} pending={pending} onReview={navigateTo} />}
    <Card>
      <h2 ref={heading} tabIndex={-1}>Question {index + 1} of {session.items.length}</h2>
      <p role="status" aria-live="polite">{pending ? 'Saving progress…' : message || 'Saved progress loaded.'}</p>
      {model.phase === 'answering' ? <GuidedAnswering key={questionId} model={model} pending={pending} onCommand={onCommand} /> : <>
        <MarkdownContent children={model.item.question.stemMarkdown} />
        <GuidedHintPanel key={questionId} hints={model.revealedHints} locked pending={pending} onReveal={() => {}} />
        <GuidedFeedback item={model.item} selected={model.selectedOptionIds} correct={model.isCorrect} navigation={navigation} focusOnMount={session.status !== 'completed'} />
      </>}
      {model.phase === 'answering' && navigation}
    </Card>
  </div>;
}
