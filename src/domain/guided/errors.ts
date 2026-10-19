export const guidedErrorCodes = [
  'invalid-source', 'invalid-release', 'invalid-session', 'resource-limit',
  'unsupported-version', 'unsupported-crypto', 'unsupported-source',
  'not-published', 'version-mismatch', 'fingerprint-mismatch', 'digest-mismatch',
  'unapproved', 'revoked', 'unavailable', 'policy-pending', 'insufficient-coverage',
  'invalid-command', 'conflict', 'locked', 'incomplete', 'not-submitted',
  'network', 'timeout', 'cancelled',
  'quota', 'corrupt', 'blocked-mock', 'recovery-required', 'private-source',
] as const;
export type GuidedErrorCode = typeof guidedErrorCodes[number];

export type GuidedResult<T> = { ok: true; value: T } | {
  ok: false; code: GuidedErrorCode;
};
export const failure = (code: GuidedErrorCode): { ok: false; code: GuidedErrorCode } => ({ ok: false, code });

export function frozenCopy<T>(value: T): T {
  const copy = structuredClone(value);
  const freeze = (item: unknown): void => {
    if (!item || typeof item !== 'object' || Object.isFrozen(item)) return;
    Object.values(item).forEach(freeze);
    Object.freeze(item);
  };
  freeze(copy);
  return copy;
}
