import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import type { FullConfig } from '@playwright/test';
export default async function setup(config:FullConfig){
 const enabled=process.env.GUIDED_PREVIEW_ENABLED_BUILD,disabled=process.env.GUIDED_PREVIEW_DISABLED_BUILD;
 if(!enabled||!disabled)throw Error('Explicit clean-checkout build paths required');
 const evidence=String((config.reporter.find(r=>r[0]==='json')?.[1] as {outputFile?:string})?.outputFile);
 if(fs.existsSync(evidence))throw Error('Preserve prior QA evidence');
 const headers=JSON.parse(fs.readFileSync('vercel.json','utf8')).headers as {source:string;headers:{key:string;value:string}[]}[];
 const servers:http.Server[]=[];
 async function serve(root:string,port:number){
  const absolute=path.resolve(root);
  const server=http.createServer((req,res)=>{
   const pathname=new URL(req.url??'/','http://127.0.0.1').pathname;
   const route=/^\/(?:guided\/?|guided\/session\/[^/]+\/?|history\/?|settings\/?)?$/.test(pathname);
   const file=path.resolve(absolute,route?'index.html':'.'+decodeURIComponent(pathname));
   if(!file.startsWith(absolute+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
    res.writeHead(404,{'Cache-Control':'no-store','Content-Type':'text/plain'});res.end('Not found');return;
   }
   const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
   res.setHeader('Content-Type',mime[path.extname(file)]??'application/octet-stream');
   for(const row of headers??[])if(row.source===pathname)for(const h of row.headers)res.setHeader(h.key,h.value);
   res.end(fs.readFileSync(file));
  });
  await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});servers.push(server);
 }
 try{await serve(enabled,4408);await serve(enabled,4409);await serve(disabled,4410);}
 catch(e){for(const server of servers)server.close();throw e;}
 return async()=>{for(const server of servers)await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));};
}
