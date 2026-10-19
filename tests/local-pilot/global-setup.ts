import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
export default async function setup() {
  const server=await createServer({ configFile:fileURLToPath(new URL('./vite.config.ts',import.meta.url)),
    configLoader:'runner', mode:'d14-local' });
  await server.listen();
  return async () => { await server.close(); };
}
