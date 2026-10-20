import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { readAcceptedRelease } from './guidedLocalRelease';

export const immutableCache = 'public, max-age=31536000, immutable';
export type ReleaseProfile = 'local' | 'preview' | 'production';
type Target = { productionOrigin: string; projectId: string };

export function validateHostedServices(env: NodeJS.ProcessEnv) {
  for (const name of ['VITE_ACCOUNT_HISTORY_ENABLED', 'VITE_POSTHOG_ENABLED']) {
    if (!['true', 'false'].includes(env[name] ?? '')) throw Error('Explicit existing service policy required: ' + name);
  }
  if (env.VITE_PASSWORD_RECOVERY_ENABLED !== undefined && !['true', 'false'].includes(env.VITE_PASSWORD_RECOVERY_ENABLED)) throw Error('Invalid recovery policy');
  for (const [flag, endpoint, key] of [
    ['VITE_ACCOUNT_HISTORY_ENABLED', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'],
    ['VITE_POSTHOG_ENABLED', 'VITE_POSTHOG_HOST', 'VITE_POSTHOG_KEY'],
  ]) if (env[flag] === 'true') {
    let valid = false;
    try { const url = new URL(env[endpoint] ?? ''); valid = url.protocol === 'https:' && !['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname); } catch { /* Fail closed below. */ }
    if (!valid || !env[key]?.trim()) throw Error('Enabled service configuration missing/invalid: ' + flag);
  }
  if (env.VITE_POSTHOG_ENABLED === 'true' && !env.VITE_ANALYTICS_ENVIRONMENT?.trim()) throw Error('Explicit existing analytics attribution policy required');
}

// Build guards are not deployment authorization. Hosted execution is a later owner decision.
export function validateReleaseProfile(env: NodeJS.ProcessEnv, target: Target): ReleaseProfile {
  const profile = env.GUIDED_RELEASE_PROFILE;
  if (profile !== 'local' && profile !== 'preview' && profile !== 'production') throw Error('Explicit Guided release profile required');
  if (profile === 'local') {
    if (env.VERCEL || env.NETLIFY || env.CF_PAGES || env.VERCEL_ENV) throw Error('Local release verification cannot run on hosting');
  } else {
    if (env.VERCEL !== '1' || env.VERCEL_ENV !== profile) throw Error('Hosted release profile/environment mismatch');
    if (env.VERCEL_PROJECT_ID !== target.projectId) throw Error('Unverified Vercel project identity');
    if (env.GUIDED_RELEASE_ORIGIN !== target.productionOrigin) throw Error('Confirmed production origin required');
    validateHostedServices(env);
  }
  return profile;
}

export function guidedProductionRelease(root: string, env: NodeJS.ProcessEnv = process.env) {
  const target: Target = JSON.parse(fs.readFileSync(path.join(root, 'release/guided/target.json'), 'utf8'));
  const profile = validateReleaseProfile(env, target);
  const release = readAcceptedRelease(root);
  const assets = Object.entries(release.files).filter(([name]) => name.startsWith('intermediate-'));
  const outDir = profile === 'local' ? '.localtest/guided-production/enabled' : 'dist';
  const plugin: Plugin = {
    name: 'approved-guided-production-release',
    configResolved(config) {
      if (config.mode !== 'production') throw Error('Release build must use normal production environment policy');
      if (config.build.outDir !== outDir) throw Error('Unexpected Guided release output directory');
    },
    generateBundle() {
      for (const [name, bytes] of assets) this.emitFile({ type: 'asset', fileName: 'guided/' + name, source: bytes });
    },
    configurePreviewServer(server) {
      // Mirror the proposed hosting contract. Unknown JSON assets must not receive SPA HTML.
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (!url?.startsWith('/guided/') || !url.endsWith('.json')) return next();
        const asset = assets.find(([name]) => url === '/guided/' + name);
        if (!asset) { res.statusCode = 404; res.setHeader('Cache-Control', 'no-store'); res.end('Not found'); return; }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', immutableCache);
        // Serve emitted bytes so local HTTP verification checks the actual build artifact.
        const file = path.resolve(root, outDir, 'guided', asset[0]);
        res.end(fs.readFileSync(file));
      });
    },
  };
  return { plugin, catalog: release.catalog, profile, outDir, target };
}
