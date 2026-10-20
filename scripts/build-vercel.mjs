import { build } from 'vite';
import fs from 'node:fs';

export const previewBranch = 'feature/guided-mode-vercel-preview';
export function selectVercelBuild(env, target) {
  const branch = env.VERCEL_GIT_COMMIT_REF;
  if (env.VERCEL_ENV === 'production' && branch === previewBranch) throw Error('Preview feature branch must never deploy to Production');
  if (env.VERCEL_ENV === 'production') {
    const enabled = env.VITE_GUIDED_PRACTICE_ENABLED;
    if (enabled !== undefined && !['true', 'false'].includes(enabled)) throw Error('Invalid Production Guided policy');
    if (enabled === 'true') {
      if (branch !== 'main' || env.VERCEL !== '1' || env.VERCEL_PROJECT_ID !== target.projectId ||
        env.GUIDED_RELEASE_ORIGIN !== target.productionOrigin) throw Error('Unverified Production release target');
      return 'guided-production';
    }
  }
  if (env.VERCEL_ENV !== 'preview' || branch !== previewBranch) return 'ordinary';
  if (env.VERCEL !== '1' || env.VERCEL_PROJECT_ID !== target.projectId) throw Error('Unverified Preview project');
  if (env.GUIDED_RELEASE_ORIGIN !== undefined && env.GUIDED_RELEASE_ORIGIN !== target.productionOrigin) throw Error('Unverified release origin');
  for (const name of ['VITE_ACCOUNT_HISTORY_ENABLED', 'VITE_PASSWORD_RECOVERY_ENABLED', 'VITE_POSTHOG_ENABLED']) {
    if (env[name] !== undefined && env[name] !== 'false') throw Error('Guest-only Preview rejects enabled/invalid service policy: ' + name);
  }
  for (const name of ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'VITE_POSTHOG_KEY', 'VITE_POSTHOG_HOST']) {
    if (env[name]?.trim()) throw Error('Preview service endpoints/keys must be absent: ' + name);
  }
  if (env.VITE_ANALYTICS_ENVIRONMENT !== undefined && env.VITE_ANALYTICS_ENVIRONMENT !== 'guided-protected-preview') throw Error('Preview attribution scope mismatch');
  return 'guided-preview';
}

// Production opts in explicitly and retains its own service environment.
// Feature Preview uses only its separate approved guest policy.
export async function buildVercel(env = process.env) {
  if (env.NODE_ENV && env.NODE_ENV !== 'production') throw Error('Production compilation required');
  env.NODE_ENV = 'production';
  const target = JSON.parse(fs.readFileSync('release/guided/target.json', 'utf8'));
  const selected = selectVercelBuild(env, target);
  console.log('Vercel build policy: ' + selected);
  if (selected === 'guided-preview') {
    const policy = JSON.parse(fs.readFileSync('release/guided/preview-service-policy.json', 'utf8'));
    if (policy.status !== 'owner-approved' || policy.projectId !== target.projectId || policy.gitBranch !== previewBranch || policy.environment !== 'preview' ||
      policy.variables.GUIDED_RELEASE_ORIGIN !== target.productionOrigin) throw Error('Unapproved Preview service policy');
    // Exact approved non-secret policy is versioned with this build. Reject conflicting
    // remote values above; never copy Production credentials into Preview.
    Object.assign(env, policy.variables, { GUIDED_RELEASE_PROFILE: 'preview' });
  } else if (selected === 'guided-production') {
    env.GUIDED_RELEASE_PROFILE = 'production';
  }
  await build({ configFile: selected === 'ordinary' ? 'vite.config.ts' : 'vite.guided-production.config.ts', configLoader: 'runner', mode: 'production' });
}
if (process.argv[1] && new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').toLowerCase() === process.argv[1].replaceAll('\\', '/').toLowerCase()) await buildVercel();
