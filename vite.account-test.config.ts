import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()], cacheDir: 'test-results/vite-account-cache',
  define: {
    'import.meta.env.VITE_POSTHOG_ENABLED': JSON.stringify('false'),
    'import.meta.env.VITE_ACCOUNT_HISTORY_ENABLED': JSON.stringify('true'),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://supabase.synthetic.test'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('sb_publishable_synthetic_test_key'),
  },
});
