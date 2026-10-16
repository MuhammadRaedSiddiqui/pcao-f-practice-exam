export type AppView = 'start' | 'exam' | 'results' | 'settings' | 'history';

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
  return path === '/' ? flowState(state)?.view ?? 'start' : 'start';
}

export function viewPath(view: AppView) {
  return view === 'settings' ? '/settings' : view === 'history' ? '/history' : '/';
}
