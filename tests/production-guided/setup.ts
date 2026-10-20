import { preview } from 'vite';
import fs from 'node:fs';
export default async function setup() {
  const suffix = process.env.GUIDED_PREFLIGHT_RUN === 'confirmed' ? '-confirmed' : '';
  if (fs.existsSync('test-results/guided-production-preflight-20261019-01/browser' + suffix + '.json')) throw Error('Preserve previous browser results; use a new run path');
  process.env.GUIDED_RELEASE_PROFILE = 'local';
  const servers: Awaited<ReturnType<typeof preview>>[] = [];
  try {
    servers.push(await preview({ configFile: 'vite.guided-production.config.ts', configLoader: 'runner', mode: 'production', preview: { host: '127.0.0.1', port: 4263, strictPort: true } }));
    servers.push(await preview({ configFile: false, build: { outDir: '.localtest/guided-production/disabled' }, preview: { host: '127.0.0.1', port: 4264, strictPort: true } }));
  } catch (e) { for (const s of servers) s.httpServer.close(); throw e; }
  return async () => { for (const s of servers) await new Promise<void>((resolve, reject) => s.httpServer.close(e => e ? reject(e) : resolve())); };
}
