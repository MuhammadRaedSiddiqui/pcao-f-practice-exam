import {createServer} from 'vite';
import {fileURLToPath} from 'node:url';
import {mkdirSync} from 'node:fs';
import type {FullConfig} from '@playwright/test';
export default async function setup(config:FullConfig){
 const suite=config.metadata.phase7Suite as 'guided'|'d12'|'guest',port=suite==='guided'?4240:suite==='d12'?4246:4173;
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const server=await createServer({root,configFile:fileURLToPath(new URL(suite==='guest'?'../../vite.config.ts':'../../vite.guided-test.config.ts',import.meta.url)),configLoader:'runner',mode:suite==='d12'?'guided-d12':'development',server:{host:'127.0.0.1',port,strictPort:true},define:suite==='guest'?{'import.meta.env.VITE_POSTHOG_ENABLED':JSON.stringify('false')}:undefined});
 await server.listen();
 // Legacy guest specs use explicit relative screenshot paths. Keep them off historical files.
 const previousCwd=process.cwd();if(suite==='guest'){const folder=fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/guest-workspace/',import.meta.url));mkdirSync(folder,{recursive:true});process.chdir(folder);}
 return async()=>{await server.close();process.chdir(previousCwd);};
}
