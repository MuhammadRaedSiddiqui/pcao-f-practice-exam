import { preview } from 'vite';
import { fileURLToPath } from 'node:url';
import type { FullConfig } from '@playwright/test';
export default async function setup(config: FullConfig) {
  const kind = config.metadata.kind as string;
  const server = await preview({ root: fileURLToPath(new URL('../../', import.meta.url)), configFile: false,
    build: { outDir: '.localtest/guided-mode/' + kind }, preview: { host: '127.0.0.1', port: 4262, strictPort: true } });
  return async () => { await new Promise<void>((resolve, reject) => server.httpServer.close(e => e ? reject(e) : resolve())); };
}
