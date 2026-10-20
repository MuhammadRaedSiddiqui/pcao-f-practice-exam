import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { preparePilot } from './prepare';

const root = fileURLToPath(new URL('../../', import.meta.url));
export default defineConfig(async ({ command, mode, isPreview }) => {
  if (command !== 'serve' || isPreview || mode !== 'd14-local') throw new Error('D14 pilot is loopback development only; build/preview refused.');
  if (process.env.VERCEL || process.env.CI || process.env.NETLIFY) throw new Error('D14 pilot refuses hosting/CI environments.');
  const pilot = await preparePilot(root);
  mkdirSync(resolve(root,'test-results/guided-practice/local-pilot'), { recursive:true });
  writeFileSync(resolve(root,'test-results/guided-practice/local-pilot/pilot-manifest.json'), JSON.stringify(pilot.manifest,null,2) + '\n');
  const plugin: Plugin = { name:'d14-local-only', enforce:'pre',
    configResolved(config) {
      if (config.server.host !== '127.0.0.1' || config.server.port !== 4256 || !config.server.strictPort || config.server.proxy || config.server.https)
        throw new Error('D14 pilot requires unproxied HTTP 127.0.0.1:4256 with strictPort.');
    },
    resolveId(id) { if (id === 'virtual:d14-local-pilot') return '\0' + id; },
    load(id) { if (id === '\0virtual:d14-local-pilot') return `export default ${JSON.stringify({ catalog:pilot.catalog })};`; },
    transform(_code,id) {
      if (id.replaceAll('\\','/').endsWith('/src/domain/guided/runtime.ts'))
        return `export { guidedEnabled, runtimeCatalog, loadPracticeSource, loadReviewSource } from '/tests/local-pilot/runtime.ts';`;
    },
    configureServer(server) {
      server.middlewares.use((req,res,next) => {
        if (req.headers.host !== '127.0.0.1:4256') { res.statusCode=403; res.end('Local pilot host required'); return; }
        res.setHeader('Cache-Control','no-store');
        res.setHeader('Content-Security-Policy', "connect-src 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
        const path = req.url?.split('?')[0];
        if (path === '/guided/d14-local-only.json' || path === '/__pilot/manifest') {
          res.setHeader('Content-Type','application/json');
          res.end(JSON.stringify(path === '/__pilot/manifest' ? pilot.manifest : pilot.release)); return;
        }
        // Drafts, notes, local evidence and the projection tooling are not browser assets.
        const decoded = decodeURIComponent(path ?? '').replaceAll('\\','/');
        if (/^\/(?:docs|test-results|\.env)(?:\/|\.|$)/.test(decoded) || decoded.startsWith('/tests/') && decoded !== '/tests/local-pilot/runtime.ts') {
          res.statusCode=403; res.end('Not a pilot browser asset'); return;
        }
        next();
      });
    },
    transformIndexHtml(html) {
      return html.replace('<body>', '<body><aside style="padding:12px;background:#fff3c4;color:#241e00" aria-label="Local pilot notice">D14 local pilot — owner review. No accounts, cloud backup or telemetry. Formative use only.</aside>');
    },
  };
  return { root, envDir:false as const, plugins:[plugin,react()], cacheDir:'node_modules/.vite-d14-local',
    define:Object.fromEntries(Object.entries({ VITE_GUIDED_PRACTICE_ENABLED:'true', VITE_ACCOUNT_HISTORY_ENABLED:'false',
      VITE_PASSWORD_RECOVERY_ENABLED:'false', VITE_SUPABASE_URL:'', VITE_SUPABASE_PUBLISHABLE_KEY:'',
      VITE_POSTHOG_ENABLED:'false', VITE_POSTHOG_KEY:'', VITE_POSTHOG_HOST:'', VITE_ANALYTICS_ENVIRONMENT:'local-pilot' })
      .map(([key,value]) => ['import.meta.env.' + key,JSON.stringify(value)])),
    server:{ host:'127.0.0.1', port:4256, strictPort:true, hmr:false, allowedHosts:['127.0.0.1'], cors:false },
  };
});
