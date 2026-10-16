import { describe, expect, it } from 'vitest';
import { flowState, routeView, viewPath } from '../src/domain/navigation';

describe('browser navigation state', () => {
  it('keeps explicit account/history URLs independent of an old exam entry', () => {
    const state = { view: 'exam', attemptId: 'saved-exam' };
    expect(routeView('/history', state)).toBe('history');
    expect(routeView('/settings/', state)).toBe('settings');
    expect(routeView('/', state)).toBe('exam');
    expect(routeView('/', { view: 'results', attemptId: 'report' })).toBe('results');
  });
  it('falls back safely for malformed or unknown history state', () => {
    for (const state of [null, 'exam', {}, { view: 'settings' }, { view: 'exam' }, { view: 'exam', attemptId: 1 }, { view: 'results', attemptId: '' }]) {
      expect(flowState(state)).toBeNull();
      expect(routeView('/', state)).toBe('start');
    }
    expect(routeView('/unknown', { view: 'exam', attemptId: 'saved-exam' })).toBe('start');
  });
  it('uses saved-record pointers rather than trusting embedded report data', () => {
    expect(flowState({ view: 'results', attemptId: 'report', payload: { answers: 'untrusted' } }))
      .toEqual({ view: 'results', attemptId: 'report' });
  });
  it('keeps the two new URLs separate from the existing root exam flow', () => {
    expect(viewPath('history')).toBe('/history');
    expect(viewPath('settings')).toBe('/settings');
    for (const view of ['start', 'exam', 'results'] as const) expect(viewPath(view)).toBe('/');
  });
});
