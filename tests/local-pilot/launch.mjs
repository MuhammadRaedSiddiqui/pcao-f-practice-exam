import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
if (process.argv.length !== 2) throw new Error('No host, port or build overrides accepted.');
const server = await createServer({ configFile:fileURLToPath(new URL('./vite.config.ts',import.meta.url)),
  configLoader:'runner', mode:'d14-local' });
await server.listen();
console.log('D14 LOCAL ONLY: http://127.0.0.1:4256/guided');
console.log('Identity: http://127.0.0.1:4256/__pilot/manifest — Ctrl+C to stop. No recruitment authorized.');
for (const signal of ['SIGINT','SIGTERM']) process.once(signal, async () => { await server.close(); process.exit(0); });
