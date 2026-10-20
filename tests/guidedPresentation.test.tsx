import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { syntheticSession, unwrap, commandId } from './fixtures/syntheticGuidance';
import { applyCommand, questionPresentation } from '../src/domain/guided/session';
import { GuidedAnswering, GuidedSessionPage } from '../src/ui/guided/GuidedSessionPage';
import { GuidedRecovery } from '../src/ui/guided/GuidedPractice';
import { guidedSessionId, guidedSessionPath, routeView } from '../src/domain/navigation';
import { createAnalytics, scrubAnalyticsProperties } from '../src/domain/analytics';

describe('Guided presentation boundaries', () => {
  it.each([0, 1, 2, 3])('excludes keys, reasoning, vocabulary and source detail with %i saved hints', async count => {
    const f = await syntheticSession(); let s = f.session;
    for (let i = 0; i < count; i++) s = unwrap(applyCommand(s, { kind: 'revealNextHint', questionId: 'T1' }, s.revision, s.updatedAt)).session;
    const model = unwrap(questionPresentation(s, 'T1'));
    expect(model.phase).toBe('answering'); if (model.phase !== 'answering') return;
    const html = renderToStaticMarkup(<GuidedAnswering model={model} pending={false} onCommand={() => {}} />);
    expect(html).not.toMatch(/postcommit|Synthetic criterion|Synthetic definition|Synthetic claim|Synthetic locator|Correct answer|Not quite|Synthetic explanation/);
    expect(html.indexOf('guided-hints')).toBeLessThan(html.indexOf('guided-options'));
    expect(html.match(/class="guided-hint-toggle"/g)).toHaveLength(3);
    for (const text of f.session.items[0].guide.hints) expect(html).not.toContain(text);
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(3);
  });
  it('renders only committed feedback and all option comparisons', async () => {
    const f = await syntheticSession(); let s = unwrap(applyCommand(f.session, { kind: 'select', questionId: 'T1', ids: ['A', 'B'] }, 0, f.session.updatedAt)).session;
    s = unwrap(applyCommand(s, { kind: 'commit', questionId: 'T1', commandId: commandId(1) }, 1, s.updatedAt)).session;
    const html = renderToStaticMarkup(<GuidedSessionPage session={s} pending={false} message="" onCommand={() => {}} />);
    expect(html).toContain('Not quite'); expect(html).toContain('Synthetic postcommit reasoning');
    for (const option of s.items[0].question.options) expect(html).toContain('Synthetic limitation ' + option.id);
    expect(html).not.toMatch(/Original explanation|Vocabulary|Synthetic definition|Synthetic explanation/);
    expect(html).toContain('Synthetic fixture');
    expect(html).not.toContain('Check answer');
  });
  it.each(['blocked', 'recovery-required', 'unsupported', 'checking'] as const)('has no instructional subtree while %s', status => {
    const gate = status === 'blocked' ? { status, reason: 'active-mock' as const } : status === 'recovery-required' ?
      { status, reason: 'corrupt-record' as const, retry: true as const } : status === 'unsupported' ?
        { status, reason: 'coordination-unavailable' as const } : { status, startedAt: Date.now(), budgetMs: 5000 as const };
    const html = renderToStaticMarkup(<MemoryRouter><GuidedRecovery gate={gate} onRetry={() => {}} /></MemoryRouter>);
    expect(html).not.toMatch(/Synthetic|type="radio"|type="checkbox"|Check answer|Reveal hint/);
    expect(html).toContain('Open attempt history');
  });
  it('validates UUID-only session routes and preserves existing root state', () => {
    const id = '11111111-1111-4111-8111-111111111111';
    expect(guidedSessionId(guidedSessionPath(id))).toBe(id);
    expect(routeView('/guided', { view: 'exam', attemptId: 'old' })).toBe('guided');
    expect(routeView('/', { view: 'exam', attemptId: 'old' })).toBe('exam');
    for (const value of ['../private', 'unknown', '?owner=1', id + '/tail']) {
      expect(guidedSessionId('/guided/session/' + value)).toBeNull();
      expect(() => guidedSessionPath(value)).toThrow();
    }
  });
  it('flushes prior telemetry once, suspends Guided page/engagement and restores actual destination', () => {
    let now = 0; const events: { event: string; properties: object }[] = [];
    const analytics = createAnalytics({ identify() {}, capture(event, properties) { events.push({ event, properties }); } }, 'test', 'http://localhost', () => now);
    analytics.setUser(null); analytics.setContext({ view: 'start', difficulty: null }); analytics.presence(true, true);
    now = 2000; analytics.setContext({ view: 'guided', difficulty: null });
    const afterEntry = events.length;
    for (let i = 0; i < 10; i++) { now += 1000; analytics.interaction(); analytics.sample(); }
    analytics.setContext({ view: 'guided-session', difficulty: null }); analytics.flush(); analytics.leave();
    expect(events).toHaveLength(afterEntry);
    expect(events.filter(e => e.event === 'engagement_time')).toHaveLength(1);
    analytics.setContext({ view: 'history', difficulty: null });
    expect(events.at(-1)).toMatchObject({ event: '$pageview', properties: { view: 'history' } });
    expect(JSON.stringify(events)).not.toContain('guided');
  });
  it('removes SDK-derived Guided URLs/titles and cross-visit page metrics, including person properties', () => {
    expect(scrubAnalyticsProperties({ view: 'start', active_seconds: 3,
      $current_url: 'https://example.test/app/guided/session/private-id?x=1', $pathname: '/app/guided/session/private-id',
      title: 'Guided Practice — PCAO-F practice', $prev_pageview_duration: 17, $prev_pageview_max_scroll: 1900,
      $set_once: { $initial_current_url: 'https://example.test/guided', $initial_pathname: '/guided' },
    })).toEqual({ view: 'start', active_seconds: 3, $set_once: {} });
  });
  it('preserves explicit Mock analytics metadata and normal sanitized URLs', () => {
    expect(scrubAnalyticsProperties({ view: 'exam', difficulty: 'intermediate', attempt_id: 'mock-id',
      $current_url: 'https://example.test/exam?private=1', $pathname: '/exam', $title: 'PCAO-F Practice — exam', active_seconds: 4,
    })).toEqual({ view: 'exam', difficulty: 'intermediate', attempt_id: 'mock-id',
      $current_url: 'https://example.test/exam', $pathname: '/exam', $title: 'PCAO-F Practice — exam', active_seconds: 4 });
  });
});
