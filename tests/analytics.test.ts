import { describe, expect, it } from 'vitest';
import { createAnalytics, scrubAnalyticsProperties, type AnalyticsProperties } from '../src/domain/analytics';

function fixture() {
  let now = 0;
  let identity: string | null = null;
  const events: { event: string; properties: AnalyticsProperties; identity: string | null; immediate: boolean }[] = [];
  const identities: (string | null)[] = [];
  const analytics = createAnalytics({
    identify(id) { identity = id; identities.push(id); },
    capture(event, properties, immediate = false) { events.push({ event, properties, identity, immediate }); },
  }, 'synthetic', 'https://app.synthetic.test', () => now);
  return { analytics, events, identities, advance: (ms: number) => { now += ms; },
    tick: (seconds: number) => { for (let i = 0; i < seconds; i++) { now += 1000; analytics.sample(); } } };
}

describe('analytics identity and events', () => {
  it('waits for resolved auth and emits one virtual pageview across rerenders', () => {
    const f = fixture();
    f.analytics.setContext({ view: 'start', difficulty: null });
    expect(f.events).toHaveLength(0);
    f.analytics.setUser(null);
    f.analytics.setUser(null);
    f.analytics.setContext({ view: 'start', difficulty: null });
    expect(f.events.map(item => item.event)).toEqual(['$pageview']);
    expect(f.events[0].properties).toMatchObject({ $current_url: 'https://app.synthetic.test/start', account_state: 'guest', environment: 'synthetic' });
  });
  it('counts restored signed-in activity without inventing a login', () => {
    const f = fixture();
    f.analytics.setUser('synthetic-user-a');
    f.analytics.setUser('synthetic-user-a');
    expect(f.identities).toEqual(['synthetic-user-a']);
    expect(f.events.map(item => item.event)).toEqual(['signed_in_activity']);
  });
  it('separates explicit login, account switching and guest activity', () => {
    const f = fixture();
    f.analytics.setUser('synthetic-user-a');
    f.analytics.track('login_succeeded', { method: 'email_password' });
    f.analytics.setUser(null);
    f.analytics.track('exam_started', { difficulty: 'intermediate' });
    f.analytics.setUser('synthetic-user-b');
    expect(f.events.find(item => item.event === 'login_succeeded')?.identity).toBe('synthetic-user-a');
    expect(f.events.find(item => item.event === 'exam_started')).toMatchObject({ identity: null, properties: { account_state: 'guest' } });
    expect(f.identities).toEqual(['synthetic-user-a', null, 'synthetic-user-b']);
  });
  it('captures transitions rather than changes in difficulty on the same screen', () => {
    const f = fixture(); f.analytics.setUser(null);
    f.analytics.setContext({ view: 'exam', difficulty: 'intermediate' });
    f.analytics.setContext({ view: 'exam', difficulty: 'advanced' });
    f.analytics.setContext({ view: 'results', difficulty: 'advanced' });
    expect(f.events.filter(item => item.event === '$pageview').map(item => item.properties.$pathname)).toEqual(['/exam', '/results']);
  });
  it('allowlists event metadata and rejects raw content and invalid numbers', () => {
    const f = fixture(); f.analytics.setUser(null);
    f.analytics.track('exam_completed', { difficulty: 'advanced', elapsed_seconds: Infinity, email: 'private@example.test', answers: 'A', payload: 'private', attempt_id: 'synthetic-attempt' });
    expect(f.events[0].properties).toEqual({ difficulty: 'advanced', attempt_id: 'synthetic-attempt', app_name: 'pcao-f-practice', environment: 'synthetic', account_state: 'guest' });
  });
  it('does not propagate sink failures into application operations', () => {
    const analytics = createAnalytics({ identify() { throw new Error('offline'); }, capture() { throw new Error('blocked'); } }, 'synthetic', '', () => 0);
    expect(() => { analytics.setUser(null); analytics.setContext({ view: 'start', difficulty: null }); analytics.track('exam_started'); analytics.leave(); }).not.toThrow();
  });
});

describe('active-time estimates', () => {
  function active() {
    const f = fixture(); f.analytics.setUser(null);
    f.analytics.setContext({ view: 'exam', difficulty: 'intermediate' });
    f.analytics.presence(true, true); return f;
  }
  it('counts quiet reading until the five-minute idle limit', () => {
    const f = active(); f.tick(360); f.analytics.flush();
    expect(f.events.find(item => item.event === 'engagement_time')?.properties.active_seconds).toBe(300);
  });
  it('stops in hidden or unfocused tabs and resumes after interaction', () => {
    const f = active(); f.tick(10); f.analytics.presence(false, false); f.tick(100);
    f.analytics.presence(true, true); f.tick(20); f.analytics.presence(true, false); f.tick(100);
    expect(f.events.filter(item => item.event === 'engagement_time').map(item => item.properties.active_seconds)).toEqual([10, 20]);
  });
  it('resumes idle engagement without counting the idle gap', () => {
    const f = active(); f.tick(310); f.analytics.interaction(); f.tick(10); f.analytics.flush();
    expect(f.events.find(item => item.event === 'engagement_time')?.properties.active_seconds).toBe(310);
  });
  it('does not count sleep/suspended execution gaps', () => {
    const f = active(); f.tick(10); f.advance(120_000); f.analytics.sample(); f.tick(5); f.analytics.flush();
    expect(f.events.find(item => item.event === 'engagement_time')?.properties.active_seconds).toBe(15);
  });
  it('flushes under the previous screen and account before changing context', () => {
    const f = active(); f.tick(10); f.analytics.setUser('synthetic-user-a');
    f.tick(20); f.analytics.setContext({ view: 'results', difficulty: 'intermediate' });
    f.tick(5); f.analytics.flush();
    expect(f.events.filter(item => item.event === 'engagement_time').map(item => [item.identity, item.properties.view, item.properties.active_seconds])).toEqual([
      [null, 'exam', 10], ['synthetic-user-a', 'exam', 20], ['synthetic-user-a', 'results', 5],
    ]);
  });
  it('sends increments once and flushes the final pageleave immediately', () => {
    const f = active(); f.tick(10); f.analytics.flush(); f.analytics.flush(); f.tick(5); f.analytics.leave(); f.tick(10); f.analytics.flush();
    expect(f.events.filter(item => item.event === 'engagement_time').map(item => item.properties.active_seconds)).toEqual([10, 5]);
    expect(f.events.at(-1)).toMatchObject({ event: '$pageleave', immediate: true, properties: { $pathname: '/exam' } });
  });
  it('integrates exactly up to an idle boundary between sampling ticks', () => {
    const f = active(); f.tick(299); f.advance(5000); f.analytics.flush();
    expect(f.events.find(item => item.event === 'engagement_time')?.properties.active_seconds).toBe(300);
  });
});

describe('SDK payload scrubbing', () => {
  it('retains only the required SDK project-token field while removing auth tokens', () => {
    expect(scrubAnalyticsProperties({ token: 'phc_synthetic_public', access_token: 'private', refresh_token: 'private',
      $set: { token: 'private', email: 'private@example.test' } }, true))
      .toEqual({ token: 'phc_synthetic_public', $set: {} });
  });
  it('removes auth fragments/query strings and sensitive nested person properties without mutation', () => {
    const input = { $current_url: 'https://app.synthetic.test/results?email=private#access_token=secret',
      $referrer: 'https://source.synthetic.test/path?token=secret', password: 'secret', selected_answers: ['A'],
      $set: { $initial_current_url: 'https://app.synthetic.test/?code=secret', email: 'private@example.test', role: 'learner' },
      $set_once: { refresh_token: 'secret' }, $session_id: 'synthetic-session', difficulty: 'advanced' };
    expect(scrubAnalyticsProperties(input)).toEqual({ $current_url: 'https://app.synthetic.test/results',
      $referrer: 'https://source.synthetic.test/path', $set: { $initial_current_url: 'https://app.synthetic.test/', role: 'learner' },
      $set_once: {}, $session_id: 'synthetic-session', difficulty: 'advanced' });
    expect(input.password).toBe('secret'); expect(input.$set.email).toBe('private@example.test');
  });
  it('drops malformed URL values', () => {
    expect(scrubAnalyticsProperties({ $current_url: 'not-a-url', $referrer: 'null' })).toEqual({});
  });
});
