import type { Attempt } from '../domain/attempt';
import { difficultyCatalog, type Difficulty, type DifficultyBankState } from '../domain/difficulty';
import { DifficultyToggle } from './DifficultyToggle';
import { Button, Dialog } from './primitives';

export type ExamPreparation = { difficulty: Difficulty; unfinished?: Attempt[] };

type Props = {
  preparation: ExamPreparation | null;
  bankState: DifficultyBankState;
  busy: boolean;
  canSave: boolean;
  hasUnfinished: boolean;
  message: string;
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
  onBack: () => void;
  onStart: () => void;
  onRetry: () => void;
};

export function DifficultySelectionDialog({
  preparation, bankState, busy, canSave, hasUnfinished, message,
  onSelect, onClose, onBack, onStart, onRetry,
}: Props) {
  if (!preparation) return null;
  const difficulty = preparation.difficulty;
  const level = difficultyCatalog[difficulty];
  const unfinished = preparation?.unfinished;
  const canStart = canSave && !busy && bankState.status === 'ready';
  return <Dialog open={preparation !== null} title={unfinished ? 'Start another exam?' : 'Choose exam difficulty'} onClose={onClose} closeDisabled={busy}
    actions={unfinished
      ? <><Button disabled={busy} onClick={onBack}>Keep unfinished attempt</Button><Button variant="primary" disabled={!canStart} onClick={onStart}>{busy ? 'Starting exam…' : `Abandon and start ${level.label} exam`}</Button></>
      : <><Button disabled={busy} onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!canStart} onClick={onStart}>{busy ? 'Starting exam…' : `Start ${level.label} exam`}</Button></>}>
    {message && <div className="validation-message" role="alert">{message}</div>}
    {unfinished ? <>
      <p>Starting an <strong>{level.label}</strong> exam will permanently discard {unfinished.length === 1 ? 'your unfinished attempt' : `your ${unfinished.length} unfinished attempts`}, including saved answers and flags. No report will be created for it.</p>
      <p>Your completed reports will stay saved. The new exam starts at Question 1 with a fresh {bankState.status === 'ready' ? bankState.bank.durationMinutes : 120}-minute deadline.</p>
    </> : <>
      <p className="difficulty-intro">Choose the question bank for your next practice exam.</p>
      <DifficultyToggle value={difficulty} onChange={onSelect} disabled={busy} />
      <section className="difficulty-details" aria-labelledby="difficulty-details-title" aria-live="polite">
        <div className="difficulty-details__heading"><h3 id="difficulty-details-title">{level.label}</h3>
          <span className={'status-badge status-badge--' + (bankState.status === 'unavailable' ? 'loading' : bankState.status)}>{bankState.status === 'ready' ? 'Available' : bankState.status === 'loading' ? 'Loading' : bankState.status === 'unavailable' ? 'Coming soon' : 'Unavailable'}</span>
        </div>
        <p className="difficulty-comparison">{level.comparison}</p>
        <ul className="difficulty-points">{level.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
      </section>
      {bankState.status === 'ready' && <dl className="difficulty-facts" aria-label="Selected exam details">
        <div><dt>Questions</dt><dd>{bankState.bank.questions.length}</dd></div>
        <div><dt>Duration</dt><dd>{bankState.bank.durationMinutes} minutes</dd></div>
      </dl>}
      {bankState.status === 'loading' && <p role="status">Loading the {level.label} question bank…</p>}
      {bankState.status === 'unavailable' && <p className="difficulty-availability" role="status">{level.label} exams will be available after the question bank is added.</p>}
      {bankState.status === 'error' && <div className="validation-message" role="alert"><p>The {level.label} question bank is unavailable or incomplete.</p><Button disabled={busy} onClick={onRetry}>Retry loading</Button></div>}
    </>}
    {hasUnfinished && <p className="difficulty-timer-note">Your unfinished attempt’s timer is still running while you choose.</p>}
  </Dialog>;
}
