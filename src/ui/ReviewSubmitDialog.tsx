import { selectionStatus, type Attempt } from '../domain/attempt';
import { Button, Dialog } from './primitives';

type Props = {
  attempt: Attempt;
  stage: 'review' | 'confirm' | null;
  remainingTime: string;
  unanswered: number;
  message: string;
  onClose: () => void;
  onBack: () => void;
  onConfirm: () => void;
  onSubmit: () => void;
  onNavigate: (questionId: string) => void;
};

export function ReviewSubmitDialog({
  attempt, stage, remainingTime, unanswered, message,
  onClose, onBack, onConfirm, onSubmit, onNavigate,
}: Props) {
  const confirming = stage === 'confirm';
  return <Dialog open={stage !== null} title={confirming ? 'Submit exam?' : 'Review and submit'} onClose={onClose}
    actions={confirming
      ? <><Button onClick={onClose}>Back to review</Button><Button variant="primary" onClick={onSubmit}>Confirm submission</Button></>
      : <><Button onClick={onBack}>Back to exam</Button><Button variant="primary" onClick={onConfirm}>Submit exam</Button></>}>
    {message && <div className="validation-message" role="alert">{message}</div>}
    <p className="review-time" role="timer" aria-live="off" aria-label="Review time remaining">Time remaining: <strong>{remainingTime}</strong></p>
    {confirming ? <>
      <p>You have <strong>{unanswered} unanswered</strong> questions. This includes questions without the required number of selections. You can submit with these outstanding answers.</p>
      {attempt.flags.length > 0 && <p>You have <strong>{attempt.flags.length} flagged {attempt.flags.length === 1 ? 'question' : 'questions'}</strong> to revisit before submitting.</p>}
      <p>Submit your saved selections now? You cannot change them after submission.</p>
    </> : <>
      <div className="review-summary" aria-label="Answer status counts">
        <div><strong>{unanswered}</strong><span>unanswered</span></div>
        <div><strong>{attempt.snapshot.questions.length - unanswered}</strong><span>answered</span></div>
        <div><strong>{attempt.flags.length}</strong><span>flagged</span></div>
      </div>
      <ul className="review-legend" aria-label="Question status legend">
        <li><span className="status-symbol status-symbol--complete" aria-hidden="true">✓</span>Answered</li>
        <li><span className="status-symbol" aria-hidden="true">○</span>Unanswered</li>
        <li><span className="status-symbol status-symbol--flag" aria-hidden="true">⚑</span>Flagged</li>
        <li><span className="status-symbol status-symbol--current" aria-hidden="true">●</span>Current question</li>
      </ul>
      <p className="sr-only">Answered means the required number of selections. Flags are independent of answer status.</p>
      <p className="instruction">Choose a question to return.</p>
      <div className="question-grid" role="group" aria-label="Jump to question">
        {attempt.snapshot.questions.map((question, index) => {
          const status = selectionStatus(question, attempt.answers[question.id] ?? []);
          const flagged = attempt.flags.includes(question.id);
          const current = attempt.currentQuestionId === question.id;
          const label = status;
          const symbol = status === 'answered' ? '✓' : '○';
          return <button type="button" key={question.id}
            className={'question-number question-number--' + status + (flagged ? ' question-number--flagged' : '') + (current ? ' question-number--current' : '')}
            aria-current={current ? 'step' : undefined}
            aria-label={'Question ' + (index + 1) + ': ' + label + (flagged ? ', flagged' : '') + (current ? ', current question' : '')}
            onClick={() => onNavigate(question.id)}>
            <span className="question-number__value">{index + 1}</span>
            <span className="question-number__markers" aria-hidden="true">{symbol}{flagged && ' ⚑'}{current && ' ●'}</span>
          </button>;
        })}
      </div>
    </>}
  </Dialog>;
}
