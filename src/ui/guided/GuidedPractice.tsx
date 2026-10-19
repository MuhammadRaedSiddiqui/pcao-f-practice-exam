import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useGuidedPractice } from '../../hooks/useGuidedPractice';
import { guidedSessionPath } from '../../domain/navigation';
import { guidedEnabled } from '../../domain/guided/runtime';
import { practiceSets, selectPracticeSet, type PracticeSet } from '../../domain/guided/selectors';
import type { GuidedErrorCode } from '../../domain/guided/errors';
import type { MockGate } from '../../domain/guided/protection';
import type { GuidedSessionListing } from '../../domain/guided/storage';
import { Button, Card, Dialog } from '../primitives';
import { GuidedSessionPage } from './GuidedSessionPage';
import type { GuidedSourceAccess } from '../../domain/guided/access';

type PracticeProps = { sessionId: string | null; ownerId: string | null; currentOwner: () => string | null;
  sourceAccess?: GuidedSourceAccess; onReturnReport?: (id: string, hash: string) => Promise<boolean> };

export function guidedErrorMessage(code: GuidedErrorCode): string {
  if (code === 'conflict') return 'Progress changed in another tab. Retry to load the saved state, then choose your action again.';
  if (code === 'quota') return 'Browser storage is full. Your saved progress was kept. Free space outside this session, then Retry; no exam data will be removed here.';
  if (code === 'private-source') return 'The source report is unavailable to this account. Sign in to its owner account or return to attempt history.';
  if (code === 'policy-pending' || code === 'revoked') return 'This saved practice contains unavailable guidance. Its records are preserved; withdrawn content cannot be shown.';
  if (code === 'not-published') return 'No approved Guided Practice release is published. Educational review and publication approval are still required.';
  if (code === 'unsupported-version') return 'This saved record uses an unsupported version. It has been preserved. Use a compatible app version, then Retry.';
  if (['invalid-session', 'invalid-source', 'fingerprint-mismatch', 'digest-mismatch', 'corrupt', 'unapproved'].includes(code)) return 'Saved content could not be verified. The original record has been preserved. Retry or return to Guided Practice; damaged content will not be shown.';
  return 'Guided Practice could not complete this action. Check that browser storage is available and close other app versions, then Retry to reconcile saved progress. No unsaved hint or feedback is shown.';
}

export function GuidedRecovery({ gate, onRetry }: { gate: MockGate; onRetry: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (gate.status !== 'checking') heading.current?.focus(); }, [gate.status]);
  return <Card className="guided-recovery"><h1 ref={heading} tabIndex={-1}>Guided Practice paused</h1>
    {gate.status === 'checking' ? <p role="status">Checking browser protection…</p> : <>
      <p role="alert">{gate.status === 'blocked' ? 'An unfinished Mock Exam is active on this browser. Guided Practice will be available after its saved deadline or submission.' :
        gate.status === 'unsupported' ? 'This browser cannot safely coordinate practice with Mock Exams. Use a browser with Web Locks and IndexedDB.' :
        'Browser protection could not verify all saved Mock records. Guidance stays paused to protect your exam.'}</p>
      {gate.status === 'recovery-required' && <><p>Recovery reason: {gate.reason}. Original records are preserved.</p>
        <p>Check browser storage permissions and close other app versions. Use attempt history for records you can access. Retry performs a complete new check. Damaged Mock data requires separately authorized repair; there is no expiry bypass or automatic deletion.</p></>}
      <Button onClick={onRetry}>Retry protection check</Button>
    </>}
    <p><Link to="/history">Open attempt history</Link> · <Link to="/">Return home</Link></p>
  </Card>;
}

function GuidedErrorState({ code, pending, onRetry }: { code: GuidedErrorCode | null; pending: boolean; onRetry: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (code) heading.current?.focus(); }, [code]);
  return <Card className="guided-recovery"><h1 ref={heading} tabIndex={-1}>Guided Practice</h1>
    {code ? <p role="alert">{guidedErrorMessage(code)}</p> : <p role="status">Loading saved practice…</p>}
    <Button disabled={pending} onClick={onRetry}>Retry saved practice</Button><p><Link to="/guided">Return to Guided Practice</Link> · <Link to="/history">Open attempt history</Link></p>
  </Card>;
}

function EnabledGuidedPractice({ sessionId, ownerId, currentOwner, sourceAccess, onReturnReport }: PracticeProps) {
  const navigate = useNavigate();
  const state = useGuidedPractice(sessionId, ownerId, currentOwner, id => { void navigate(guidedSessionPath(id)); }, sourceAccess);
  const [returnFailed, setReturnFailed] = useState(false);
  const [size, setSize] = useState<5 | 10>(5);
  const [setIndex, setSetIndex] = useState(0);
  const [removing, setRemoving] = useState<GuidedSessionListing | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (!sessionId && state.ready) heading.current?.focus(); }, [sessionId, state.ready]);
  if (state.gate.status !== 'clear') return <GuidedRecovery gate={state.gate} onRetry={() => { void state.retry(); }} />;
  if (state.error || !state.ready) return <GuidedErrorState code={state.error} pending={state.pending} onRetry={() => { void state.retry(); }} />;
  if (sessionId && state.session) return <><Link className="button button--quiet" to="/guided">Back to Guided Practice</Link>
    {state.session.origin.kind === 'post-exam' && onReturnReport && <Button onClick={() => {
      const origin = state.session!.origin;
      if (origin.kind === 'post-exam') void onReturnReport(origin.sourceAttemptId, origin.sourceReportHash).then(ok => setReturnFailed(!ok));
    }}>Return to original results</Button>}
    {returnFailed && <p role="alert">The original report is unavailable to this account. Open attempt history to check source access.</p>}
    <GuidedSessionPage session={state.session} pending={state.pending} message={state.savedMessage} onCommand={command => { void state.command(command); }} /></>;
  const source = state.source;
  const count = source?.ok ? source.value.coverage.items.length : 0;
  const selectedSet = source?.ok ? selectPracticeSet(source.value.coverage, size, setIndex) : null;
  const sets = source?.ok ? practiceSets(source.value.coverage, size) : null;
  const availableSets = sets?.ok ? sets.value : [];
  const staleSet = availableSets.length > 0 && !availableSets.some(set => set.setIndex === setIndex);
  const selectedDescription = availableSets.find(set => set.setIndex === setIndex);
  const setLabel = (set: PracticeSet) => `Set ${set.setIndex + 1} of ${availableSets.length} · eligible questions ${set.startIndex + 1}–${set.endIndex} · ${set.repeatedCount} repeated ${set.repeatedCount === 1 ? 'question' : 'questions'}`;
  return <div className="guided-landing">
    <h1 tabIndex={-1} ref={heading}>Guided Practice</h1><p>Untimed · learn the reasoning</p>
    {state.gate.warnings.length > 0 && <p role="status">The Mock history index has an inconsistency. A complete record scan passed; no records or index were changed.</p>}
    <Card><h2>Start a practice session</h2><p>Intermediate · {count} questions with compatible approved guidance</p><p>Advanced — Coming later</p>
      <p>Choose a fixed set. Questions may have been seen before; these sessions do not measure unseen mastery.</p>
      <div className="guided-field"><label htmlFor="guided-session-length">Session length</label><select id="guided-session-length" value={size} disabled={state.pending} onChange={e => { setSize(Number(e.target.value) as 5 | 10); setSetIndex(0); }}>
        <option value={5} disabled={count < 5}>5 questions{count < 5 ? ` — ${count} available; 5 required` : ''}</option><option value={10} disabled={count < 10}>10 questions{count < 10 ? ` — ${count} available; 10 required` : ''}</option></select></div>
      <div className="guided-field"><label htmlFor="guided-practice-set">Practice set</label><select id="guided-practice-set" aria-describedby="guided-set-description" value={setIndex} disabled={state.pending || !availableSets.length} onChange={e => setSetIndex(Number(e.target.value))}>
        {!availableSets.length && <option value={setIndex}>No complete sets available</option>}
        {staleSet && <option value={setIndex} disabled>Selected set no longer available — choose a set</option>}
        {availableSets.map(set => <option key={set.setIndex} value={set.setIndex}>{setLabel(set)}</option>)}
      </select></div>
      <p id="guided-set-description">{selectedDescription ? `Selected set: ${setLabel(selectedDescription)}. Repeated questions come from earlier sets; none repeat within this set.` : 'Choose an available complete set. No set is selected for starting.'}</p>
      {!source && <p role="status">Checking published guidance…</p>}
      {source && !source.ok && <p role="status">{guidedErrorMessage(source.code)}</p>}
      {source?.ok && source.value.coverage.affectedPublishedEntries && <p role="status">Withdrawn or mismatched guidance is excluded. Sets contain only compatible approved questions.</p>}
      {staleSet && <p role="status">Coverage changed. Choose an available set before starting; no replacement set was selected.</p>}
      {availableSets.some(set => set.repeatedCount > 0) && <p>To cover every eligible question with complete sets, the last set repeats questions from earlier sets. No question repeats within a set. Ranges refer to eligible questions in source order.</p>}
      {source?.ok && count < size && <p>{count} available; a complete {size}-question session is required.</p>}
      <Button variant="primary" disabled={state.pending || !selectedSet?.ok} onClick={() => { void state.create(size, setIndex); }}>Start practice</Button>
      {source && !source.ok && <Button onClick={() => { void state.retry(); }}>Retry guidance</Button>}
    </Card>
    <Card><h2>Saved practice sessions</h2><p>Progress stays in this browser. Clearing browser data or storage eviction can remove it. Guided Practice has no cloud backup.</p>
      {state.list.length === 0 && <p>No accessible saved sessions.</p>}
      {state.list.map(item => <div className="guided-saved-row" key={item.id}>
        <div><strong>{item.count}-question practice · {item.status === 'completed' ? 'Completed' : 'In progress'}</strong><p>Saved {new Date(item.updatedAt).toLocaleString()}</p></div>
        <Link className="button button--secondary" to={guidedSessionPath(item.id)}>{item.status === 'completed' ? 'View practice' : 'Resume practice'}</Link>
        <Button disabled={state.pending} onClick={() => setRemoving(item)}>Remove practice session</Button>
      </div>)}
      {state.damaged && <p role="alert">Some saved practice could not be verified. Those records are preserved. Close other app versions and use Retry; unrelated valid sessions remain available.</p>}
      <Button onClick={() => { void state.retry(); }}>Retry saved sessions</Button>
    </Card>
    <Dialog open={Boolean(removing)} title="Remove this practice session?" onClose={() => setRemoving(null)}
      actions={<><Button onClick={() => setRemoving(null)}>Keep session</Button><Button variant="primary" onClick={() => { if (removing) { void state.remove(removing); setRemoving(null); } }}>Remove this practice session</Button></>}>
      <p>This removes only this browser’s selected Guided Practice session. Its saved practice progress cannot be restored.</p>
    </Dialog>
  </div>;
}

export default function GuidedPractice(props: PracticeProps) {
  return guidedEnabled ? <EnabledGuidedPractice key={props.ownerId ?? 'guest'} {...props} /> : <Card className="guided-recovery"><h1>Guided Practice unavailable</h1>
    <p>Guided Practice is disabled in this build. Saved practice is preserved.</p><Link to="/">Return home</Link></Card>;
}
