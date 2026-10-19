import { describe, expect, it } from 'vitest';
// @ts-expect-error Plain JavaScript build entry.
import { selectVercelBuild, previewBranch } from '../scripts/build-vercel.mjs';
import { validateReleaseProfile } from '../build/guidedProductionRelease';
import target from '../release/guided/target.json';

const production = (): NodeJS.ProcessEnv => ({
  VERCEL: '1', VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main',
  VERCEL_PROJECT_ID: target.projectId, GUIDED_RELEASE_ORIGIN: target.productionOrigin,
  VITE_GUIDED_PRACTICE_ENABLED: 'true', VITE_ACCOUNT_HISTORY_ENABLED: 'true',
  VITE_SUPABASE_URL: 'https://supabase.synthetic.test', VITE_SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
  VITE_POSTHOG_ENABLED: 'true', VITE_POSTHOG_HOST: 'https://analytics.synthetic.test',
  VITE_POSTHOG_KEY: 'public-test-key', VITE_ANALYTICS_ENVIRONMENT: 'production-test',
});

describe('Explicit Production Guided build selection', () => {
  it('selects the production packager without mutating existing services or recovery defaults', () => {
    const env = production(), before = JSON.stringify(env);
    expect(selectVercelBuild(env, target)).toBe('guided-production');
    expect(validateReleaseProfile({ ...env, GUIDED_RELEASE_PROFILE: 'production' }, target)).toBe('production');
    expect(JSON.stringify(env)).toBe(before);
    expect(env.VITE_PASSWORD_RECOVERY_ENABLED).toBeUndefined();
  });
  it.each([undefined, 'false'])('retains the disabled safety build for %s', flag => {
    expect(selectVercelBuild({ ...production(), VITE_GUIDED_PRACTICE_ENABLED: flag }, target)).toBe('ordinary');
  });
  it.each(['VERCEL', 'VERCEL_PROJECT_ID', 'GUIDED_RELEASE_ORIGIN', 'VERCEL_GIT_COMMIT_REF'])('rejects an unverified %s', key => {
    for (const value of [undefined, 'wrong']) expect(() => selectVercelBuild({ ...production(), [key]: value }, target)).toThrow('target');
  });
  it('rejects invalid feature flags and retains the feature-branch Production prohibition', () => {
    expect(() => selectVercelBuild({ ...production(), VITE_GUIDED_PRACTICE_ENABLED: 'yes' }, target)).toThrow('policy');
    expect(() => selectVercelBuild({ ...production(), VERCEL_GIT_COMMIT_REF: previewBranch }, target)).toThrow('never deploy');
  });
  it('does not apply the guest-only Preview policy to other branches', () => {
    expect(selectVercelBuild({ ...production(), VERCEL_ENV: 'preview' }, target)).toBe('ordinary');
    expect(() => selectVercelBuild({ ...production(), VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: previewBranch }, target)).toThrow('service policy');
  });
  it('still requires explicit service policy and valid enabled endpoints in Production', () => {
    expect(() => validateReleaseProfile({ ...production(), GUIDED_RELEASE_PROFILE: 'production', VITE_ACCOUNT_HISTORY_ENABLED: undefined }, target)).toThrow('service policy');
    expect(() => validateReleaseProfile({ ...production(), GUIDED_RELEASE_PROFILE: 'production', VITE_SUPABASE_URL: '' }, target)).toThrow('missing/invalid');
  });
});
