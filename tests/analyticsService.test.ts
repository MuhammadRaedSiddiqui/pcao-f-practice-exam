import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => {
  let user: string | null = null;
  return {
    init: vi.fn(), capture: vi.fn(),
    identify: vi.fn((id: string) => { user = id; }),
    reset: vi.fn(() => { user = null; }),
    get_property: vi.fn(() => user),
    get_distinct_id: vi.fn(() => user ?? 'synthetic-guest'),
    setUser: (id: string | null) => { user = id; },
  };
});
vi.mock('posthog-js', () => ({ default: sdk }));

beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks(); sdk.setUser(null);
  vi.stubGlobal('window', { location: { origin: 'https://app.synthetic.test' } });
  vi.stubEnv('MODE', 'development');
  vi.stubEnv('VITE_POSTHOG_ENABLED', 'true');
  vi.stubEnv('VITE_POSTHOG_KEY', 'phc_synthetic');
  vi.stubEnv('VITE_POSTHOG_HOST', 'https://analytics.synthetic.test');
  vi.stubEnv('VITE_ANALYTICS_ENVIRONMENT', 'synthetic');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('PostHog runtime adapter', () => {
  it('initializes once and delivers queued guest/account events in identity order', async () => {
    const service = await import('../src/services/analytics');
    service.setAnalyticsUser(null);
    service.setAnalyticsContext({ view: 'start', difficulty: null });
    service.setAnalyticsUser('synthetic-user-a');
    service.trackEvent('login_succeeded', { method: 'email_password' });
    await Promise.all([service.initAnalytics(), service.initAnalytics()]);
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.capture.mock.calls.map(call => call[0])).toEqual(['$pageview', 'signed_in_activity', 'login_succeeded']);
    expect(sdk.capture.mock.calls[0][1].account_state).toBe('guest');
    expect(sdk.identify).toHaveBeenCalledWith('synthetic-user-a');
  });
  it('disables DOM capture, replay and exception capture', async () => {
    const service = await import('../src/services/analytics'); await service.initAnalytics();
    expect(sdk.init.mock.calls[0][1]).toMatchObject({ autocapture: false, capture_pageview: false, capture_pageleave: false,
      disable_session_recording: true, capture_exceptions: false, capture_heatmaps: false, capture_dead_clicks: false });
  });
  it('scrubs top-level person updates and preserves the SDK ingestion token', async () => {
    const service = await import('../src/services/analytics'); await service.initAnalytics();
    const beforeSend = sdk.init.mock.calls[0][1].before_send;
    expect(beforeSend({ event: '$identify', properties: { token: 'phc_synthetic', access_token: 'private' },
      $set: { email: 'private@example.test' }, $set_once: { $initial_current_url: 'https://app.synthetic.test/?code=private#access_token=private' } }))
      .toEqual({ event: '$identify', properties: { token: 'phc_synthetic' }, $set: {}, $set_once: { $initial_current_url: 'https://app.synthetic.test/' } });
  });
  it.each(['disabled', 'missing-key', 'test-mode'])('does not initialize or capture in %s', async mode => {
    if (mode === 'disabled') vi.stubEnv('VITE_POSTHOG_ENABLED', 'false');
    if (mode === 'missing-key') vi.stubEnv('VITE_POSTHOG_KEY', '');
    if (mode === 'test-mode') vi.stubEnv('MODE', 'test');
    const service = await import('../src/services/analytics'); await service.initAnalytics();
    service.setAnalyticsUser(null); service.trackEvent('exam_started');
    expect(sdk.init).not.toHaveBeenCalled(); expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('resets a persisted account when the app resolves to guest', async () => {
    sdk.setUser('synthetic-previous-account');
    const service = await import('../src/services/analytics'); service.setAnalyticsUser(null);
    await service.initAnalytics(); expect(sdk.reset).toHaveBeenCalledTimes(1);
  });
  it('repairs another-tab SDK identity before attributing an event', async () => {
    const service = await import('../src/services/analytics'); await service.initAnalytics();
    service.setAnalyticsUser('synthetic-user-a'); sdk.setUser('synthetic-user-b');
    service.trackEvent('exam_started');
    expect(sdk.reset).toHaveBeenCalledTimes(1);
    expect(sdk.get_distinct_id()).toBe('synthetic-user-a');
  });
  it('swallows SDK initialization failures and drops queued telemetry', async () => {
    sdk.init.mockImplementationOnce(() => { throw new Error('synthetic blocked initialization'); });
    const service = await import('../src/services/analytics'); service.setAnalyticsUser(null); service.trackEvent('exam_started');
    await expect(service.initAnalytics()).resolves.toBeUndefined();
    expect(() => service.trackEvent('exam_started')).not.toThrow(); expect(sdk.capture).not.toHaveBeenCalled();
  });
  it('rejects an insecure remote ingest host', async () => {
    vi.stubEnv('VITE_POSTHOG_HOST', 'http://analytics.synthetic.test');
    const service = await import('../src/services/analytics'); await service.initAnalytics();
    expect(sdk.init).not.toHaveBeenCalled();
  });
});
