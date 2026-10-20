// Router notifications precede deferred React rendering/effect cleanup. Keep
// cancellation synchronous with each accepted location, including Back/Forward.
let locationKey: string | undefined;
const listeners = new Set<() => void>();

export function observeGuidedLocation(key: string) {
  if (key === locationKey) return;
  locationKey = key;
  listeners.forEach(invalidate => invalidate());
}

export function subscribeGuidedNavigation(invalidate: () => void) {
  listeners.add(invalidate);
  return () => { listeners.delete(invalidate); };
}
