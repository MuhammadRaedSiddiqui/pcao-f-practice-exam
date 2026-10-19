import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
if(process.argv.length!==2)throw Error('No origin/port overrides supported');
const server=await createServer({configFile:fileURLToPath(new URL('./vite.config.ts',import.meta.url)),configLoader:'runner',mode:'phase7-local'});
await server.listen();console.log('Phase 7 local candidate: http://127.0.0.1:4258/guided — Ctrl+C to stop');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await server.close();process.exit(0);});
