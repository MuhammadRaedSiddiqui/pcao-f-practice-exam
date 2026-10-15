import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()], cacheDir: 'test-results/vite-analytics-cache',
  define: {
    'import.meta.env.VITE_ACCOUNT_HISTORY_ENABLED': JSON.stringify('true'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://supabase.synthetic.test'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('sb_publishable_synthetic_test_key'),
    'import.meta.env.VITE_POSTHOG_ENABLED': JSON.stringify('true'),
    'import.meta.env.VITE_POSTHOG_KEY': JSON.stringify('phc_synthetic_analytics_project_token'),
    'import.meta.env.VITE_POSTHOG_HOST': JSON.stringify('https://analytics.synthetic.test'),
    'import.meta.env.VITE_ANALYTICS_ENVIRONMENT': JSON.stringify('synthetic-browser'),
  },
});
