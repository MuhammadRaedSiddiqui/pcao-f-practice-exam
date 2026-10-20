import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => ({
  plugins: [{ name: 'synthetic-guided-runtime-only', enforce: 'pre',
    transform(_code, id) {
      if (id.replaceAll('\\', '/').endsWith('/src/domain/guided/runtime.ts')) {
        return `export { guidedEnabled, runtimeCatalog, loadPracticeSource, loadReviewSource } from '/tests/fixtures/${mode === 'guided-d12' ? 'guidedD12Runtime' : 'guidedRuntime'}.ts';`;
      }
    },
  }, react()],
  cacheDir: 'test-results/vite-guided-cache',
  define: {
    'import.meta.env.VITE_POSTHOG_ENABLED': JSON.stringify(mode === 'guided-analytics' ? 'true' : 'false'),
    'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify('phc_synthetic_isolated_key'),
    'import.meta.env.VITE_POSTHOG_HOST': JSON.stringify('https://analytics.synthetic.test'),
    'import.meta.env.VITE_ANALYTICS_ENVIRONMENT': JSON.stringify('test'),
    'import.meta.env.VITE_ACCOUNT_HISTORY_ENABLED': JSON.stringify('true'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://supabase.synthetic.test'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('sb_publishable_synthetic_test_key'),
  },
}));
