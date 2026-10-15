import { createAnalytics, scrubAnalyticsProperties, type AnalyticsContext, type AnalyticsEvent, type AnalyticsProperties } from '../domain/analytics';
import type { PostHog } from 'posthog-js';

let client: PostHog | undefined;
let loading: Promise<void> | undefined;
let failed = false;
let targetUserId: string | null = null;
const queued: ((sdk: PostHog) => void)[] = [];
const key = import.meta.env.VITE_POSTHOG_KEY?.trim();
const host = import.meta.env.VITE_POSTHOG_HOST?.trim();
const enabled = import.meta.env.VITE_POSTHOG_ENABLED === 'true' && Boolean(key && host) && import.meta.env.MODE !== 'test';

function send(action: (sdk: PostHog) => void) {
  if (!enabled || failed) return;
  try {
    if (client) action(client);
    else if (queued.length < 128) queued.push(action);
  } catch { /* Analytics failures cannot affect authentication or attempts. */ }
}

function identify(sdk: PostHog, userId: string | null) {
  if (sdk.get_property('$user_id') && sdk.get_distinct_id() !== userId) sdk.reset();
  if (userId && sdk.get_distinct_id() !== userId) sdk.identify(userId);
}

const analytics = createAnalytics({
  identify(userId) {
    targetUserId = userId;
    send(sdk => identify(sdk, userId));
  },
  capture(event, properties, immediate) {
    const userId = targetUserId;
    send(sdk => {
      // Keep event attribution stable across lazy loading and other-tab identity writes.
      identify(sdk, userId);
      sdk.capture(event, properties, immediate ? { send_instantly: true, transport: 'sendBeacon' } : undefined);
    });
  },
}, import.meta.env.VITE_ANALYTICS_ENVIRONMENT?.trim() || import.meta.env.MODE,
typeof window === 'undefined' ? '' : window.location.origin, () => performance.now());

export function initAnalytics(): Promise<void> {
  if (!enabled) return Promise.resolve();
  loading ??= import('posthog-js').then(({ default: sdk }) => {
    const configuredHost = new URL(host!);
    if (configuredHost.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(configuredHost.hostname)) throw new Error('Invalid analytics host');
    sdk.init(key!, {
      api_host: host!, defaults: '2026-05-30',
      autocapture: false, capture_pageview: false, capture_pageleave: false,
      disable_session_recording: true, person_profiles: 'identified_only',
      capture_performance: false, capture_exceptions: false, capture_heatmaps: false, capture_dead_clicks: false,
      enable_recording_console_log: false,
      before_send: event => event ? {
        ...event,
        properties: scrubAnalyticsProperties(event.properties, true),
        ...(event.$set ? { $set: scrubAnalyticsProperties(event.$set) } : {}),
        ...(event.$set_once ? { $set_once: scrubAnalyticsProperties(event.$set_once) } : {}),
      } : null,
    });
    client = sdk;
    for (const action of queued.splice(0)) {
      try { action(sdk); } catch { /* A single failed event cannot block later events. */ }
    }
  }).catch(() => { failed = true; queued.length = 0; });
  return loading;
}

export function setAnalyticsUser(userId: string | null) { if (enabled) analytics.setUser(userId); }
export function setAnalyticsContext(context: AnalyticsContext) { if (enabled) analytics.setContext(context); }
export function trackEvent(event: AnalyticsEvent, properties: AnalyticsProperties = {}) { if (enabled) analytics.track(event, properties); }

export function attachAnalyticsEngagement(): () => void {
  if (!enabled) return () => {};
  const presence = () => analytics.presence(document.visibilityState === 'visible', document.hasFocus());
  const interaction = () => analytics.interaction();
  const leave = () => analytics.leave();
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
  for (const event of events) window.addEventListener(event, interaction, { passive: true });
  document.addEventListener('visibilitychange', presence);
  window.addEventListener('focus', presence);
  window.addEventListener('blur', presence);
  window.addEventListener('pagehide', leave);
  window.addEventListener('pageshow', presence);
  const sampleTimer = window.setInterval(analytics.sample, 5000);
  const flushTimer = window.setInterval(() => analytics.flush(), 60_000);
  presence();
  return () => {
    analytics.presence(false, false);
    window.clearInterval(sampleTimer); window.clearInterval(flushTimer);
    for (const event of events) window.removeEventListener(event, interaction);
    document.removeEventListener('visibilitychange', presence);
    window.removeEventListener('focus', presence); window.removeEventListener('blur', presence);
    window.removeEventListener('pagehide', leave); window.removeEventListener('pageshow', presence);
  };
}
