export type AppView = 'start' | 'exam' | 'results' | 'settings' | 'history' | 'guided' | 'guided-session';

const guidedUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function guidedSessionId(pathname: string): string | null {
  const match = /^\/guided\/session\/([^/]+)\/?$/.exec(pathname);
  return match && guidedUuid.test(match[1]) ? match[1] : null;
}
export function guidedSessionPath(id: string): string {
  if (!guidedUuid.test(id)) throw new Error('Invalid practice session ID');
  return '/guided/session/' + id;
}

// Only a pointer to a saved attempt goes into browser history, never report data.
export function flowState(value: unknown): { view: 'exam' | 'results'; attemptId: string | null } | null {
  if (!value || typeof value !== 'object') return null;
  const state = value as Record<string, unknown>;
  if (state.view !== 'exam' && state.view !== 'results') return null;
  if (state.attemptId !== null && (typeof state.attemptId !== 'string' || !state.attemptId)) return null;
  return { view: state.view, attemptId: state.attemptId };
}

export function routeView(pathname: string, state: unknown): AppView {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/settings') return 'settings';
  if (path === '/history') return 'history';
  if (path === '/guided') return 'guided';
  if (path.startsWith('/guided/session/')) return 'guided-session';
  return path === '/' ? flowState(state)?.view ?? 'start' : 'start';
}

export function viewPath(view: AppView) {
  return view === 'settings' ? '/settings' : view === 'history' ? '/history' : view === 'guided' ? '/guided' : '/';
}
