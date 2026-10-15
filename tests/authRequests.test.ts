import { afterEach, describe, expect, it, vi } from 'vitest';
import { AUTH_REQUEST_TIMEOUT_MS, createAuthRequests } from '../src/services/authRequests';
afterEach(() => { vi.useRealTimers(); });
describe('manual authentication transport', () => {
  it('aborts a pending request and rejects a late response even when the transport ignores abort', async () => {
    let finish!: (response: Response) => void; let signal: AbortSignal | undefined;
    const requests = createAuthRequests(vi.fn((_, init) => { signal = init?.signal as AbortSignal; return new Promise<Response>(resolve => { finish = resolve; }); }));
    const controller = new AbortController(); let saved = false;
    const operation = requests.run(async () => { await requests.fetch('https://example.test/auth/v1/signup', { method: 'POST' }); saved = true; }, controller.signal);
    const rejection = expect(operation).rejects.toMatchObject({ name: 'AbortError' });
    await Promise.resolve(); controller.abort(); await rejection;
    expect(signal?.aborted).toBe(true);
    finish(new Response('{}')); await Promise.resolve(); await Promise.resolve();
    expect(saved).toBe(false);
  });
  it('times out, releases the SDK request boundary and allows a retry', async () => {
    vi.useFakeTimers(); let calls = 0;
    const requests = createAuthRequests(vi.fn(() => { calls++; return calls === 1 ? new Promise<Response>(() => {}) : Promise.resolve(new Response('{}')); }));
    const pending = requests.run(() => requests.fetch('https://example.test/auth/v1/signup', { method: 'POST' }));
    const rejection = expect(pending).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(AUTH_REQUEST_TIMEOUT_MS); await rejection;
    await expect(requests.run(() => requests.fetch('https://example.test/auth/v1/signup', { method: 'POST' }))).resolves.toBeInstanceOf(Response);
  });
  it('bounds body reads and keeps session writes fenced until the action settles', async () => {
    vi.useFakeTimers();
    const response = new Response(new ReadableStream({ start() {} }));
    const requests = createAuthRequests(vi.fn(async () => response));
    let observed = true;
    const pending = requests.run(async () => {
      try { await requests.fetch('https://example.test/auth/v1/signup', { method: 'POST' }); }
      catch (error) { observed = requests.acceptSession(); throw error; }
    });
    const rejection = expect(pending).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(AUTH_REQUEST_TIMEOUT_MS); await rejection;
    expect(observed).toBe(false);
  });
  it('leaves report uploads and background session refresh outside manual cancellation', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response('{}')); const requests = createAuthRequests(fetcher);
    const controller = new AbortController();
    await requests.run(async () => {
      await requests.fetch('https://example.test/functions/v1/backup-report', { method: 'POST' });
      await requests.fetch('https://example.test/auth/v1/token?grant_type=refresh_token', { method: 'POST' });
    }, controller.signal);
    expect(fetcher.mock.calls.every(([, init]) => !init?.signal)).toBe(true);
  });
});
