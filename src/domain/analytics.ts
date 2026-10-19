export type AnalyticsView = 'start' | 'exam' | 'results' | 'settings' | 'history' | 'guided' | 'guided-session';
export type AnalyticsContext = { view: AnalyticsView; difficulty: 'intermediate' | 'advanced' | 'original' | null };
export type AnalyticsProperties = Record<string, string | number | boolean | null>;
export type AnalyticsEvent = 'signup_succeeded' | 'login_succeeded' | 'logout_succeeded' | 'signed_in_activity' |
  'exam_started' | 'exam_resumed' | 'exam_completed' | 'review_opened' | 'pdf_export_succeeded' | 'report_backup_succeeded';
export interface AnalyticsSink {
  identify(userId: string | null): void;
  capture(event: string, properties: AnalyticsProperties, immediate?: boolean): void;
}

// Keep raw URLs, auth recovery fragments and question/report contents out of analytics.
export function scrubAnalyticsProperties(properties: Record<string, unknown>, preserveProjectToken = false): Record<string, unknown> {
  const cleaned = { ...properties };
  const guidedPath = (value: string) => /(?:^|\/)guided(?:\/|$)/.test(value);
  for (const key of Object.keys(cleaned)) {
    // PostHog requires its public project token on each event. Auth tokens remain excluded.
    if (key === 'token' && preserveProjectToken) continue;
    if (key.startsWith('$prev_pageview_')) {
      // SDK page-duration/scroll inference spans a suspended Guided visit. The
      // app's explicit engagement clock is the only active-time authority.
      delete cleaned[key];
    } else if (/pathname/i.test(key) && typeof cleaned[key] === 'string' && guidedPath(cleaned[key] as string)) {
      delete cleaned[key];
    } else if (/title/i.test(key) && typeof cleaned[key] === 'string' && /^Guided Practice(?:\s|$)/.test(cleaned[key] as string)) {
      delete cleaned[key];
    } else if (/email|password|token|authorization|answer|question|explanation|payload/i.test(key)) {
      delete cleaned[key];
    } else if (key === '$set' || key === '$set_once') {
      const value = cleaned[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) cleaned[key] = scrubAnalyticsProperties(value as Record<string, unknown>);
    } else if (/url|referrer/i.test(key) && typeof cleaned[key] === 'string') {
      try {
        const url = new URL(cleaned[key] as string);
        if (guidedPath(url.pathname)) delete cleaned[key];
        else cleaned[key] = url.origin + url.pathname;
      } catch { delete cleaned[key]; }
    }
  }
  return cleaned;
}

const eventKeys = new Set(['difficulty', 'attempt_id', 'submission_reason', 'elapsed_seconds', 'method']);
const idleMs = 5 * 60_000;
const maxSampleGap = 15_000;

// A monotonic clock and injected sink make identity/engagement behavior independently testable.
export function createAnalytics(sink: AnalyticsSink, environment: string, origin: string, clock: () => number) {
  let userId: string | null | undefined;
  let context: AnalyticsContext | undefined;
  let lastPage: AnalyticsView | undefined;
  let visible = false;
  let focused = false;
  let lastSample = clock();
  let lastInteraction = lastSample;
  let activeMilliseconds = 0;

  function capture(event: string, properties: AnalyticsProperties = {}, immediate = false) {
    if (userId === undefined) return;
    try { sink.capture(event, {
      ...properties, app_name: 'pcao-f-practice', environment,
      account_state: userId ? 'authenticated' : 'guest',
    }, immediate); } catch { /* Telemetry never gates an app operation. */ }
  }

  function sample() {
    const now = clock();
    const elapsed = now - lastSample;
    if (context && userId !== undefined && visible && focused && elapsed > 0 && elapsed <= maxSampleGap) {
      activeMilliseconds += Math.max(0, Math.min(now, lastInteraction + idleMs) - lastSample);
    }
    lastSample = now;
  }

  function flush(immediate = false) {
    sample();
    const seconds = activeMilliseconds / 1000;
    activeMilliseconds = 0;
    if (seconds >= 1 && context) capture('engagement_time', { ...context, active_seconds: seconds }, immediate);
  }

  function page() {
    if (!context || userId === undefined || lastPage === context.view) return;
    lastPage = context.view;
    capture('$pageview', { ...context, $pathname: '/' + context.view, $current_url: origin + '/' + context.view,
      $title: 'PCAO-F Practice — ' + context.view });
  }

  return {
    setUser(next: string | null) {
      if (userId === next) return;
      flush();
      try { sink.identify(next); } catch { /* The app keeps working without analytics. */ }
      userId = next;
      lastSample = clock();
      lastInteraction = lastSample;
      if (next) capture('signed_in_activity');
      page();
    },
    setContext(next: AnalyticsContext) {
      if (next.view === 'guided' || next.view === 'guided-session') {
        if (context) flush();
        context = undefined;
        lastPage = undefined;
        lastSample = clock();
        return;
      }
      if (context?.view === next.view && context.difficulty === next.difficulty) return;
      flush();
      context = next;
      lastSample = clock();
      page();
    },
    presence(nextVisible: boolean, nextFocused: boolean) {
      sample();
      if ((!visible && nextVisible) || (!focused && nextFocused)) lastInteraction = clock();
      visible = nextVisible;
      focused = nextFocused;
      if (!visible || !focused) flush(true);
    },
    interaction() { sample(); lastInteraction = clock(); },
    sample, flush,
    track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
      const safe = Object.fromEntries(Object.entries(properties).filter(([key, value]) => eventKeys.has(key) &&
        (typeof value !== 'number' || Number.isFinite(value)))) as AnalyticsProperties;
      capture(event, safe);
    },
    leave() {
      flush(true);
      if (context) capture('$pageleave', { ...context, $pathname: '/' + context.view,
        $current_url: origin + '/' + context.view }, true);
      visible = false;
      focused = false;
    },
  };
}
