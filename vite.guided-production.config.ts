import { defineConfig, mergeConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import normalConfig from './vite.config';
import { guidedProductionRelease } from './build/guidedProductionRelease';

// A separate explicit build entry leaves ordinary production and guided-local unchanged.
export default defineConfig(async env => {
  const normal = typeof normalConfig === 'function' ? await normalConfig(env) : normalConfig;
  const release = guidedProductionRelease(fileURLToPath(new URL('.', import.meta.url)));
  return mergeConfig(normal, {
    plugins: [release.plugin],
    ...(release.profile === 'preview' ? { envDir: false as const } : {}),
    define: { __GUIDED_LOCAL_CATALOG__: JSON.stringify(release.catalog),
      'import.meta.env.VITE_GUIDED_PRACTICE_ENABLED': JSON.stringify('true'),
      ...(release.profile === 'preview' ? Object.fromEntries(Object.entries({
        VITE_ACCOUNT_HISTORY_ENABLED: 'false', VITE_PASSWORD_RECOVERY_ENABLED: 'false', VITE_POSTHOG_ENABLED: 'false',
        VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '', VITE_POSTHOG_KEY: '', VITE_POSTHOG_HOST: '',
        VITE_ANALYTICS_ENVIRONMENT: 'guided-protected-preview',
      }).map(([name, value]) => ['import.meta.env.' + name, JSON.stringify(value)])) : {}) },
    build: { outDir: release.outDir },
  });
});
