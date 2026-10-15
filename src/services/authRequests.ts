export const AUTH_REQUEST_TIMEOUT_MS = 30_000;

function aborted(signal: AbortSignal): Error {
  return signal.reason instanceof Error ? signal.reason : new DOMException('Request cancelled.', 'AbortError');
}

export function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) { void promise.catch(() => {}); return Promise.reject(aborted(signal)); }
  return new Promise((resolve, reject) => {
    const cancel = () => reject(aborted(signal));
    signal.addEventListener('abort', cancel, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', cancel));
  });
}

// One manual auth operation owns its transport and session-write fence until
// the SDK settles, even if the dialog is closed before that happens.
export function createAuthRequests(fetcher: typeof fetch = (...args) => fetch(...args)) {
  let current: { controller: AbortController } | null = null;
  return {
    acceptSession: () => !current?.controller.signal.aborted,
    async run<T>(action: () => Promise<T>, signal?: AbortSignal): Promise<T> {
      if (current) throw new Error('The previous account request is closing. Please retry shortly.');
      const request = { controller: new AbortController() };
      current = request;
      const cancel = () => request.controller.abort(signal?.reason);
      signal?.addEventListener('abort', cancel, { once: true });
      if (signal?.aborted) cancel();
      const timer = setTimeout(() => request.controller.abort(new Error('The account request timed out. Please retry. If signup already completed, try signing in.')), AUTH_REQUEST_TIMEOUT_MS);
      const pending = Promise.resolve().then(() => {
        request.controller.signal.throwIfAborted();
        return action();
      });
      const cleanup = () => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', cancel);
        if (current === request) current = null;
      };
      void pending.then(cleanup, cleanup);
      return abortable(pending, request.controller.signal);
    },
    async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const url = new URL(input instanceof Request ? input.url : String(input));
      const manual = /\/auth\/v1\/(signup|recover)$/.test(url.pathname) ||
        url.pathname.endsWith('/auth/v1/token') && url.searchParams.get('grant_type') === 'password' ||
        url.pathname.endsWith('/auth/v1/user') && init?.method === 'PUT';
      const signal = manual ? current?.controller.signal : undefined;
      if (!signal) return fetcher(input, init);
      signal.throwIfAborted();
      const response = await abortable(fetcher(input, { ...init, signal }), signal);
      // Consume the body inside the cancellation boundary before the SDK can
      // save/announce a session. Transports that ignore abort cannot sign in late.
      const body = await abortable(response.arrayBuffer(), signal);
      signal.throwIfAborted();
      return new Response(body.byteLength ? body : null, { status: response.status, statusText: response.statusText, headers: response.headers });
    },
  };
}

export const authRequests = createAuthRequests();
