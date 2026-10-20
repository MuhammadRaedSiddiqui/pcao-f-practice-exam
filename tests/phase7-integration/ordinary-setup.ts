import {preview} from 'vite';
import {fileURLToPath} from 'node:url';
export default async function setup(){const server=await preview({root:fileURLToPath(new URL('../../',import.meta.url)),configFile:false,build:{outDir:'test-results/guided-practice/phase-7-integration/'+(process.env.PHASE7_EMPTY_BUILD==='true'?'ordinary-empty-build':'ordinary-disabled-build')},preview:{host:'127.0.0.1',port:4259,strictPort:true}});return async()=>{await new Promise<void>((resolve,reject)=>server.httpServer.close(e=>e?reject(e):resolve()));};}
