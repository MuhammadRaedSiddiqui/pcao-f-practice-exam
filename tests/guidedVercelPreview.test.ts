import { describe, it, expect } from 'vitest';
// @ts-expect-error Plain build entry executes only when invoked as the CLI entry.
import { selectVercelBuild, previewBranch } from '../scripts/build-vercel.mjs';
import target from '../release/guided/target.json';
const preview = () => ({ VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: previewBranch,
  VERCEL_PROJECT_ID: target.projectId, GUIDED_RELEASE_ORIGIN: target.productionOrigin,
  VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_PASSWORD_RECOVERY_ENABLED: 'false', VITE_POSTHOG_ENABLED: 'false',
  VITE_ANALYTICS_ENVIRONMENT: 'guided-protected-preview' });
describe('Protected feature-branch build policy', () => {
  it('selects guidance only for exact verified Preview and preserves environment input', () => {
    const env = preview(), before = JSON.stringify(env);
    expect(selectVercelBuild(env, target)).toBe('guided-preview'); expect(JSON.stringify(env)).toBe(before);
    expect(selectVercelBuild({}, target)).toBe('ordinary');
    expect(selectVercelBuild({ ...env, VERCEL_GIT_COMMIT_REF: 'other' }, target)).toBe('ordinary');
    expect(selectVercelBuild({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main', VITE_ACCOUNT_HISTORY_ENABLED: 'true' }, target)).toBe('ordinary');
  });
  it('rejects the feature branch classified as Production', () => expect(() => selectVercelBuild({ ...preview(), VERCEL_ENV: 'production' }, target)).toThrow('never deploy'));
  it.each(['VITE_ACCOUNT_HISTORY_ENABLED','VITE_PASSWORD_RECOVERY_ENABLED','VITE_POSTHOG_ENABLED'])('rejects enabled %s; absent values use the approved versioned policy', name => {
    expect(selectVercelBuild({ ...preview(), [name]: undefined }, target)).toBe('guided-preview');
    expect(() => selectVercelBuild({ ...preview(), [name]: 'true' }, target)).toThrow('service policy');
  });
  it.each(['VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY','VITE_POSTHOG_KEY','VITE_POSTHOG_HOST'])('rejects service configuration %s', name => {
    expect(() => selectVercelBuild({ ...preview(), [name]: 'unexpected-test-value' }, target)).toThrow('must be absent');
  });
  it.each(['VERCEL','VERCEL_PROJECT_ID','GUIDED_RELEASE_ORIGIN','VITE_ANALYTICS_ENVIRONMENT'])('rejects unverified %s', name => {
    expect(() => selectVercelBuild({ ...preview(), [name]: 'wrong-test-value' }, target)).toThrow();
  });
});
