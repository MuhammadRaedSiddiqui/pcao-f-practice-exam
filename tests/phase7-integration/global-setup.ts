import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
export default async function setup(){const s=await createServer({configFile:fileURLToPath(new URL('./vite.config.ts',import.meta.url)),configLoader:'runner',mode:'phase7-local'});await s.listen();return async()=>{await s.close();};}
