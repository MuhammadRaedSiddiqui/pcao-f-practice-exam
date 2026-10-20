import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { guidedProductionRelease, validateReleaseProfile, validateHostedServices, immutableCache } from '../build/guidedProductionRelease';
const target = JSON.parse(readFileSync('release/guided/target.json', 'utf8'));
const hosted = (profile: 'preview' | 'production'): NodeJS.ProcessEnv => ({ GUIDED_RELEASE_PROFILE: profile,
  VERCEL: '1', VERCEL_ENV: profile, VERCEL_PROJECT_ID: target.projectId, GUIDED_RELEASE_ORIGIN: target.productionOrigin,
  VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_POSTHOG_ENABLED: 'false' });

describe('Approved Guided production packaging guards', () => {
  it('requires an explicit release profile', () => expect(() => validateReleaseProfile({}, target)).toThrow('Explicit'));
  it.each(['VERCEL', 'VERCEL_ENV', 'NETLIFY', 'CF_PAGES'])('refuses local verification under %s hosting', key => {
    expect(() => validateReleaseProfile({ GUIDED_RELEASE_PROFILE: 'local', [key]: '1' }, target)).toThrow('cannot run on hosting');
  });
  it.each(['preview', 'production'] as const)('requires the verified project and origin for %s', profile => {
    expect(validateReleaseProfile(hosted(profile), target)).toBe(profile);
    expect(() => validateReleaseProfile({ ...hosted(profile), VERCEL_PROJECT_ID: 'prj_other' }, target)).toThrow('project identity');
    expect(() => validateReleaseProfile({ ...hosted(profile), GUIDED_RELEASE_ORIGIN: 'https://other.example' }, target)).toThrow('origin');
    expect(() => validateReleaseProfile({ ...hosted(profile), VERCEL_ENV: profile === 'preview' ? 'production' : 'preview' }, target)).toThrow('mismatch');
    expect(() => validateReleaseProfile({ ...hosted(profile), VERCEL: undefined }, target)).toThrow('mismatch');
  });
  it('keeps local output outside dist and exact old/current authorization ordering', () => {
    const release = guidedProductionRelease(process.cwd(), { GUIDED_RELEASE_PROFILE: 'local' });
    expect(release.outDir).toBe('.localtest/guided-production/enabled');
    expect(release.catalog.map((r: any) => [r.guideVersion, Object.keys(r.approvedEntries).length])).toEqual([['1.0.0', 10], ['1.1.0', 60]]);
  });
  it('blocks missing hosted service policy without changing intentional values or recovery defaults', () => {
    expect(() => validateHostedServices({})).toThrow('service policy');
    const env = { VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_POSTHOG_ENABLED: 'false' };
    const before = JSON.stringify(env); validateHostedServices(env); expect(JSON.stringify(env)).toBe(before);
    expect(() => validateHostedServices({ ...env, VITE_PASSWORD_RECOVERY_ENABLED: 'maybe' })).toThrow('recovery');
  });
  it('requires valid remote HTTPS/key/attribution only for enabled hosted services', () => {
    const env = { VITE_ACCOUNT_HISTORY_ENABLED: 'true', VITE_POSTHOG_ENABLED: 'false', VITE_SUPABASE_URL: 'https://project.example', VITE_SUPABASE_PUBLISHABLE_KEY: 'public-test-key' };
    validateHostedServices(env);
    expect(() => validateHostedServices({ ...env, VITE_SUPABASE_URL: 'http://localhost:54321' })).toThrow('missing/invalid');
    expect(() => validateHostedServices({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: '' })).toThrow('missing/invalid');
    expect(() => validateHostedServices({ ...env, VITE_POSTHOG_ENABLED: 'true', VITE_POSTHOG_HOST: 'https://analytics.example', VITE_POSTHOG_KEY: 'public-test-key' })).toThrow('attribution');
  });
  it.each(['preview', 'production'] as const)('prepares normal dist output for guarded %s without service overrides', profile => {
    const release = guidedProductionRelease(process.cwd(), hosted(profile));
    expect(release.outDir).toBe('dist');
    // The plugin contains assets/HTTP handling only; configuration must not rewrite service policy.
    expect(release.plugin.config).toBeUndefined();
  });
  it('future hosting config preserves ordinary routes and caches only the two pinned immutable assets', () => {
    const ordinary = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const release = JSON.parse(readFileSync('release/guided/vercel.json', 'utf8'));
    expect(release.rewrites).toEqual(ordinary.rewrites);
    expect(release.outputDirectory).toBe(ordinary.outputDirectory);
    expect(release.installCommand).toBe(ordinary.installCommand);
    expect(ordinary.buildCommand).toBe('npm run build');
    expect(release.headers.map((r: any) => r.source)).toEqual(['/guided/intermediate-1.0.0.json', '/guided/intermediate-1.1.0.json']);
    for (const row of release.headers) expect(row.headers).toEqual([
      { key: 'Content-Type', value: 'application/json; charset=utf-8' }, { key: 'Cache-Control', value: immutableCache }]);
  });
});
