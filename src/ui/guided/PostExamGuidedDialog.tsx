import { useEffect, useRef, useState } from 'react';
import type { Attempt } from '../../domain/attemptModel';
import { reportHash } from '../../domain/cloudReports';
import { loadReviewSource, runtimeCatalog } from '../../domain/guided/runtime';
import type { GuidedSourceAccess } from '../../domain/guided/access';
import { withGuidedProtection } from '../../domain/guided/browserProtection';
import { createGuidedRepository } from '../../domain/guided/storage';
import { startSession } from '../../domain/guided/session';
import { DEFAULT_REVIEW_FILTER, type GuidedOrigin, type GuidedReviewFilter } from '../../domain/guided/schema';
import type { GuidedErrorCode } from '../../domain/guided/errors';
import { Button, Dialog } from '../primitives';
import { guidedErrorMessage } from './GuidedPractice';
import { questionOutcome } from '../../domain/results';

type Access = Extract<GuidedOrigin, { kind: 'post-exam' }>['access'];
type Props = { report: Attempt; access: Access; sourceAccess: GuidedSourceAccess; currentOwner(): string | null;
  onClose(): void; onCreated(id: string): void };
export function PostExamGuidedDialog({ report, access, sourceAccess, currentOwner, onClose, onCreated }: Props) {
  const [filter, setFilter] = useState<GuidedReviewFilter>(DEFAULT_REVIEW_FILTER);
  const [loaded, setLoaded] = useState<Awaited<ReturnType<typeof loadReviewSource>> | null>(null);
  const [error, setError] = useState<GuidedErrorCode | null>(null);
  const [pending, setPending] = useState(false);
  const [retry, setRetry] = useState(0);
  const epoch = useRef(0); const creating = useRef(false);
  const ownerRef = useRef(currentOwner); ownerRef.current = currentOwner;
  useEffect(() => {
    const token = ++epoch.current; const owner = ownerRef.current();
    const controller = new AbortController();
    const valid = () => token === epoch.current && !controller.signal.aborted &&
      document.visibilityState === 'visible' && ownerRef.current() === owner;
    setLoaded(null); setError(null);
    let proof: Awaited<ReturnType<GuidedSourceAccess['prepare']>> | null = null;
    async function check() {
      let guarded;
      try { guarded = await withGuidedProtection(() => valid() && proof?.ok ? proof.value.fresh() : null); }
      catch { if (valid()) { setLoaded(null); setError('private-source'); } return false; }
      if (!valid()) return false;
      if (guarded.gate.status !== 'clear' || !guarded.value?.ok) {
        setLoaded(null); setError(guarded.gate.status === 'clear' ? 'private-source' :
          guarded.gate.status === 'blocked' ? 'blocked-mock' : 'recovery-required'); return false;
      }
      return true;
    }
    void (async () => {
      try {
        const origin: GuidedOrigin = { kind: 'post-exam', sourceAttemptId: report.id,
          sourceReportHash: await reportHash(report), filter, access };
        proof = await sourceAccess.prepare({ origin });
        if (!await check()) return;
        const result = await loadReviewSource(report, filter, controller.signal);
        if (await check() && valid()) setLoaded(result);
      } catch { if (valid()) setError('private-source'); }
    })();
    const invalidate = () => { epoch.current++; setLoaded(null); setError('private-source'); };
    const timer = window.setInterval(() => { if (proof && !creating.current) void check(); }, 1000);
    window.addEventListener('storage', invalidate); window.addEventListener('pagehide', invalidate);
    document.addEventListener('visibilitychange', invalidate);
    return () => { epoch.current++; controller.abort(); clearInterval(timer);
      window.removeEventListener('storage', invalidate); window.removeEventListener('pagehide', invalidate);
      document.removeEventListener('visibilitychange', invalidate); };
  }, [report, access, sourceAccess, filter, retry]);
  async function create() {
    if (!loaded?.ok || !loaded.value.coverage.items.length || creating.current || error) return;
    creating.current = true; setPending(true);
    const token = epoch.current; const owner = ownerRef.current();
    const active = () => epoch.current === token && ownerRef.current() === owner && document.visibilityState === 'visible';
    const repository = createGuidedRepository({ catalog: runtimeCatalog, access: sourceAccess,
      currentOwner: () => ownerRef.current(), intent: () => epoch.current });
    try {
      // Resolve again from the same frozen report. The store rechecks fresh source
      // bytes/ownership and all active Mock records under the shared lock.
      const candidate = await startSession({ kind: 'post-exam', report, filter, access,
        id: crypto.randomUUID(), now: Date.now() }, loaded.value.release, runtimeCatalog);
      if (!active()) return;
      const result = candidate.ok ? await repository.create(candidate.value) : candidate;
      if (!active()) return;
      if (result.ok) onCreated(result.value.id); else { setLoaded(null); setError(result.code); }
    } catch { if (active()) { setLoaded(null); setError('unavailable'); } }
    finally { repository.close(); creating.current = false; setPending(false); }
  }
  const coverage = loaded?.ok ? loaded.value.coverage : null;
  const unmatchedCount = report.snapshot.questions.filter(q => filter === 'all' || (filter === 'flagged' ? report.flags.includes(q.id) :
    questionOutcome(q, report.answers[q.id] ?? []) !== 'correct')).length;
  const code = error ?? (loaded && !loaded.ok ? loaded.code : null);
  const message = code === 'blocked-mock' ? 'An unfinished Mock Exam is active on this browser. Submit it or wait for its saved deadline before Guided Review.' :
    code === 'recovery-required' ? 'Browser protection could not verify all saved Mock records. Original records are preserved. Use attempt history or Retry.' :
    code === 'unsupported-source' || code === 'version-mismatch' ? 'This report has no compatible approved guidance for its exact source version and difficulty. Ordinary question reviews and PDF export remain available.' :
    code ? guidedErrorMessage(code) : null;
  return <div className="guided-post-exam"><Dialog open title="Guided Review" onClose={onClose}
    actions={<><Button onClick={onClose}>Return to ordinary review</Button>
      <Button variant="primary" disabled={pending || Boolean(code) || !coverage?.items.length} onClick={() => { void create(); }}>
        {pending ? 'Saving guided retry…' : 'Start guided retry'}</Button></>}>
    <p>Retry questions from this frozen submitted report. Answers may already have been seen. Your original Mock score and report stay unchanged.</p>
    <label htmlFor="guided-review-cohort">Questions to retry</label>
    <select id="guided-review-cohort" disabled={pending} value={filter} onChange={e => setFilter(e.target.value as GuidedReviewFilter)}>
      <option value="incorrect-unanswered">Incorrect &amp; Unanswered</option><option value="flagged">Flagged</option><option value="all">All Questions</option>
    </select>
    {coverage && <><p role="status">{coverage.items.length} eligible · {coverage.matchedIds.length} matched · {coverage.excluded.length} unavailable</p>
      {coverage.excluded.length > 0 && <p>Only questions with exact compatible approved guidance can be retried. Unavailable: {Object.entries(coverage.excludedCounts).map(([reason, count]) => `${count} ${reason}`).join(', ')}.</p>}
      {!coverage.items.length && <p>{coverage.matchedIds.length ? 'No questions in this cohort have compatible approved guidance.' : 'No questions match this cohort.'} Choose another cohort or return to ordinary review.</p>}</>}
    {loaded && !loaded.ok && !error && <p role="status">0 eligible · {unmatchedCount} matched · {unmatchedCount} unavailable</p>}
    {!loaded && !code && <p role="status">Checking source access and compatible guidance…</p>}
    {message && <><p role="alert">{message}</p><Button disabled={pending} onClick={() => setRetry(v => v + 1)}>Retry Guided Review</Button></>}
  </Dialog></div>;
}
