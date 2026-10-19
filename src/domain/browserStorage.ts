// One exclusive lock covers records and their shared history index across tabs.
export async function withBrowserStorageLock<T>(action: () => T, signal?: AbortSignal): Promise<Awaited<T>> {
  if (!navigator.locks) throw new Error('This browser cannot safely coordinate saved attempts. Open the app in an up-to-date browser.');
  return navigator.locks.request('pcao-f:attempt-storage:v1', { signal }, action);
}
