import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], cacheDir: 'test-results/vite-cache', test: { include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'] } });
