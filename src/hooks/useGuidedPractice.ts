import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { createGuidedRepository, subscribeGuidedChanges, type GuidedSessionListing } from '../domain/guided/storage';
import { checkBrowserMockGate } from '../domain/guided/browserProtection';
import { loadPracticeSource, runtimeCatalog } from '../domain/guided/runtime';
import { startSession, type ValidatedGuidedSession } from '../domain/guided/session';
import type { GuidedCommand } from '../domain/guided/schema';
import type { GuidedErrorCode } from '../domain/guided/errors';
import type { MockGate } from '../domain/guided/protection';
import type { GuidedSourceAccess } from '../domain/guided/access';
import { subscribeGuidedNavigation } from '../domain/guided/navigationIntent';

export function useGuidedPractice(sessionId: string | null, ownerId: string | null, currentOwner: () => string | null,
  onCreated: (id: string) => void, sourceAccess?: GuidedSourceAccess) {
  const ownerRef = useRef(currentOwner); ownerRef.current = currentOwner;
  const epoch = useRef(0);
  const busy = useRef(false);
  const refreshing = useRef<number | null>(null);
  const reconciliationRequired = useRef(false);
  const sessionRef = useRef<ValidatedGuidedSession | null>(null);
  useLayoutEffect(() => {
    // Do not wait for React's passive route effect: the URL and router state
    // may already have changed while a queued storage command can still run.
    const invalidate = () => { epoch.current++; sessionRef.current = null; };
    const unsubscribe = subscribeGuidedNavigation(invalidate);
    return () => { invalidate(); unsubscribe(); };
  }, []);
  const [gate, setGate] = useState<MockGate>({ status: 'checking', startedAt: Date.now(), budgetMs: 5000 });
  const [session, setSession] = useState<ValidatedGuidedSession | null>(null);
  const [list, setList] = useState<GuidedSessionListing[]>([]);
  const [damaged, setDamaged] = useState(false);
  const [source, setSource] = useState<Awaited<ReturnType<typeof loadPracticeSource>> | null>(null);
  const [error, setError] = useState<GuidedErrorCode | null>(null);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [repository] = useState(() => createGuidedRepository({ catalog: runtimeCatalog, access: sourceAccess, currentOwner: () => ownerRef.current(), intent: () => epoch.current,
    onGate: value => { if (value.status !== 'clear') {
      if (value.status === 'recovery-required' || value.status === 'unsupported') reconciliationRequired.current = true;
      epoch.current++; sessionRef.current = null; setSession(null); setGate(value); setReady(false);
    } } }));
  const lifetime = useRef(0);
  useEffect(() => {
    const token = ++lifetime.current;
    return () => { queueMicrotask(() => { if (lifetime.current === token) repository.close(); }); };
  }, [repository]);
  const validEpoch = (value: number, owner: string | null) => value === epoch.current && document.visibilityState === 'visible' && ownerRef.current() === owner;
  const suspend = useCallback(() => {
    if (busy.current) setSavedMessage('An action was interrupted. Review the rechecked saved progress before retrying.');
    epoch.current++; sessionRef.current = null; setSession(null); setReady(false);
    if (!reconciliationRequired.current) setGate({ status: 'checking', startedAt: Date.now(), budgetMs: 5000 });
  }, []);
  const refresh = useCallback(async (explicit = false) => {
    if (document.visibilityState !== 'visible' || busy.current || (!explicit && refreshing.current !== null) || (reconciliationRequired.current && !explicit)) return;
    const version = ++epoch.current; const owner = ownerRef.current();
    refreshing.current = version;
    if (explicit) { reconciliationRequired.current = false; setError(null); setReady(false); }
    try {
      const result = await checkBrowserMockGate();
      if (!validEpoch(version, owner)) return;
      setGate(result);
      if (result.status !== 'clear') {
        if (result.status === 'recovery-required' || result.status === 'unsupported') reconciliationRequired.current = true;
        sessionRef.current = null; setSession(null); setReady(false); return;
      }
      if (sessionId) {
        let read = await repository.read(sessionId);
        // A concurrent save may invalidate a prepared read before it gets the lock.
        // Reprepare reads only; never replay a selection, hint or commitment.
        for (let attempt = 0; !read.ok && read.code === 'conflict' && attempt < 2 && validEpoch(version, owner); attempt++) {
          read = await repository.read(sessionId);
        }
        if (!validEpoch(version, owner)) return;
        if (!read.ok || !read.value) {
          sessionRef.current = null; setSession(null); setReady(false); reconciliationRequired.current = true; setError(read.ok ? 'unavailable' : read.code); return;
        }
        // Validated by repository; no raw object ever enters the instructional view.
        sessionRef.current = read.value as ValidatedGuidedSession; setSession(sessionRef.current);
      } else {
        const listed = await repository.list();
        if (!validEpoch(version, owner)) return;
        if (!listed.ok) { setError(listed.code); setReady(false); return; }
        setList(listed.value.filter((s): s is GuidedSessionListing => Boolean(s && typeof s === 'object' && 'id' in s)));
        setDamaged(listed.value.some(s => Boolean(s && typeof s === 'object' && 'damaged' in s)));
      }
      if (validEpoch(version, owner)) setReady(true);
    } finally { if (refreshing.current === version) refreshing.current = null; }
  }, [repository, sessionId]);
  useEffect(() => {
    suspend(); setSource(null); setList([]); setError(null);
    const controller = new AbortController();
    void refresh(true).then(async () => {
      if (sessionId || controller.signal.aborted) return;
      const owner = ownerRef.current();
      const checked = await checkBrowserMockGate();
      if (checked.status !== 'clear' || controller.signal.aborted || document.visibilityState !== 'visible' || ownerRef.current() !== owner) return;
      const loaded = await loadPracticeSource(controller.signal);
      const fresh = await checkBrowserMockGate();
      if (!controller.signal.aborted && fresh.status === 'clear' && document.visibilityState === 'visible' && ownerRef.current() === owner) setSource(loaded);
    });
    return () => { controller.abort(); epoch.current++; };
  }, [sessionId, ownerId, refresh, suspend]);
  useEffect(() => {
    const invalidate = () => { flushSync(() => suspend()); if (document.visibilityState === 'visible') void refresh(); };
    const storage = () => invalidate();
    window.addEventListener('storage', storage); window.addEventListener('focus', invalidate);
    window.addEventListener('pageshow', invalidate); window.addEventListener('pagehide', suspend);
    document.addEventListener('visibilitychange', invalidate);
    const unsubscribe = subscribeGuidedChanges(invalidate);
    const timer = window.setInterval(() => { void refresh(); }, 1000);
    return () => {
      clearInterval(timer); unsubscribe(); window.removeEventListener('storage', storage); window.removeEventListener('focus', invalidate);
      window.removeEventListener('pageshow', invalidate); window.removeEventListener('pagehide', suspend);
      document.removeEventListener('visibilitychange', invalidate); epoch.current++;
    };
  }, [refresh, suspend]);
  // Keep the store open across StrictMode effect replay; IDB closes on versionchange.
  async function command(input: GuidedCommand) {
    const saved = sessionRef.current;
    if (!saved || busy.current || !ready) return;
    busy.current = true; setPending(true); setError(null);
    const version = ++epoch.current; const owner = ownerRef.current();
    try {
      const result = await repository.execute(saved.id, saved.revision, input);
      if (!validEpoch(version, owner)) return;
      if (result.ok) {
        sessionRef.current = result.value as ValidatedGuidedSession; setSession(sessionRef.current);
        setSavedMessage(input.kind === 'commit' ? 'Answer saved and locked.' : input.kind === 'revealNextHint' ?
          `Hint ${result.value.responses[input.questionId].maxHintRevealed} saved.` : 'Progress saved.');
      } else {
        // Failed/uncertain acknowledgement: hide content until explicit reconciliation.
        reconciliationRequired.current = true; setError(result.code); sessionRef.current = null; setSession(null); setReady(false);
      }
    } finally { busy.current = false; setPending(false); }
  }
  async function create(size: 5 | 10, setIndex: number) {
    if (!source?.ok || busy.current || gate.status !== 'clear') return;
    busy.current = true; setPending(true); setError(null);
    const version = ++epoch.current; const owner = ownerRef.current();
    try {
      const candidate = await startSession({ kind: 'standalone', bank: source.value.bank, difficulty: 'intermediate',
        selectionSize: size, setIndex, now: Date.now(), id: crypto.randomUUID() }, source.value.release, runtimeCatalog);
      if (!validEpoch(version, owner)) return;
      const result = candidate.ok ? await repository.create(candidate.value) : candidate;
      if (!validEpoch(version, owner)) return;
      if (result.ok) onCreated(result.value.id); else { reconciliationRequired.current = true; setError(result.code); setReady(false); }
    } finally { busy.current = false; setPending(false); }
  }
  async function remove(item: GuidedSessionListing) {
    if (busy.current) return;
    busy.current = true; setPending(true);
    const version = ++epoch.current; const owner = ownerRef.current();
    try {
      const result = await repository.remove(item.id, item.revision);
      if (validEpoch(version, owner) && !result.ok) setError(result.code);
    } finally { busy.current = false; setPending(false); void refresh(); }
  }
  async function retry() {
    suspend(); await refresh(true);
    if (!sessionId) {
      const controller = new AbortController(); const version = epoch.current; const owner = ownerRef.current();
      const checked = await checkBrowserMockGate();
      if (checked.status === 'clear' && validEpoch(version, owner)) {
        const loaded = await loadPracticeSource(controller.signal, true);
        if (validEpoch(version, owner)) setSource(loaded);
      }
    }
  }
  return { gate, session, list, damaged, source, error, pending, ready, savedMessage, command, create, remove, retry };
}
