import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { guidedLocalRelease } from './build/guidedLocalRelease';

export default defineConfig(({ mode }) => {
  const local = mode === 'guided-local' ? guidedLocalRelease(fileURLToPath(new URL('.', import.meta.url))) : undefined;
  return {
    plugins: [...(local ? [local.plugin] : []), react()],
    // Always compile the fallback away; a browser global cannot publish a map.
    define: { __GUIDED_LOCAL_CATALOG__: 'undefined' },
    ...(local ? {
      envDir: false as const,
      define: {
        __GUIDED_LOCAL_CATALOG__: JSON.stringify(local.catalog),
        ...Object.fromEntries(Object.entries({ VITE_GUIDED_PRACTICE_ENABLED: 'true', VITE_ACCOUNT_HISTORY_ENABLED: 'false',
          VITE_PASSWORD_RECOVERY_ENABLED: 'false', VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '',
          VITE_POSTHOG_ENABLED: 'false', VITE_POSTHOG_KEY: '', VITE_POSTHOG_HOST: '' }).map(([key, value]) => ['import.meta.env.' + key, JSON.stringify(value)])),
      },
      build: { outDir: '.localtest/guided-mode/enabled' },
      preview: { host: '127.0.0.1', strictPort: true },
    } : {}),
    cacheDir: 'test-results/vite-cache',
    test: { 
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'] 
    },
    server: {
        ...(local ? { host: '127.0.0.1', strictPort: true } : {}),
        // Keeps Vite from throwing the "Host not allowed" error
        allowedHosts: local ? ['127.0.0.1'] : true,
    } 
  };
});
