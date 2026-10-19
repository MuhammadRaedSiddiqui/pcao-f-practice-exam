import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {prepareCandidate,writeCandidate} from './prepare';
const root=fileURLToPath(new URL('../../',import.meta.url));
export default defineConfig(async({command,mode,isPreview})=>{
 if(command!=='serve'||isPreview||mode!=='phase7-local'||process.env.VERCEL||process.env.CI||process.env.NETLIFY)throw Error('Phase 7 candidate is unhosted loopback development only');
 const candidate=await prepareCandidate(root);writeCandidate(root,candidate);
 const plugin:Plugin={name:'phase7-excluded-candidate',enforce:'pre',
  configResolved(c){if(c.server.host!=='127.0.0.1'||c.server.port!==4258||!c.server.strictPort||c.server.proxy||c.server.https)throw Error('Exact unproxied loopback required');},
  resolveId(id){if(id==='virtual:phase7-catalog')return '\0'+id;},
  load(id){if(id==='\0virtual:phase7-catalog')return `export const catalog=${JSON.stringify(candidate.catalog)};`;},
  transform(code,id){if(!id.replaceAll('\\','/').endsWith('/src/domain/guided/runtime.ts'))return;
   const changes=[["import { productionCatalog } from './catalog';","import { catalog as productionCatalog } from 'virtual:phase7-catalog';"]];
   for(const [from,to]of changes){if(code.split(from).length!==2)throw Error('Runtime injection seam changed: '+from);code=code.replace(from,to);}return code;
  },
  configureServer(server){server.middlewares.use((req,res,next)=>{
   if(req.headers.host!=='127.0.0.1:4258'){res.statusCode=403;res.end('Local origin required');return;}
   res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"connect-src 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'");
   const url=decodeURIComponent(req.url?.split('?')[0]??'').replaceAll('\\','/');
   const assets:Record<string,string>={'/guided/intermediate-1.1.0.json':candidate.assets['intermediate-1.1.0.json'],'/guided/intermediate-1.0.0.json':candidate.assets['intermediate-1.0.0.json'],'/__phase7/manifest':JSON.stringify(candidate.manifest)};
   if(assets[url]){res.setHeader('Content-Type','application/json; charset=utf-8');res.end(assets[url]);return;}
   if(/^\/(?:docs|test-results|\.env)(?:\/|\.|$)/.test(url)||url.startsWith('/tests/')&&!['/tests/phase7-integration/browser-fixtures.ts','/tests/fixtures/syntheticGuidance.ts','/tests/fixtures/syntheticBank.ts'].includes(url)){res.statusCode=403;res.end('Excluded evidence');return;}
   next();
  });},
  transformIndexHtml(html){return html.replace('<body>','<body><aside aria-label="Local candidate notice" style="padding:12px;background:#fff3c4">Phase 7 — sixty-guide local candidate. Owner review; no production publication, accounts or telemetry.</aside>');}
 };
 return {root,envDir:false as const,plugins:[plugin,react()],cacheDir:'node_modules/.vite-phase7-local',define:Object.fromEntries(Object.entries({VITE_GUIDED_PRACTICE_ENABLED:'true',VITE_ACCOUNT_HISTORY_ENABLED:'false',VITE_PASSWORD_RECOVERY_ENABLED:'false',VITE_SUPABASE_URL:'',VITE_SUPABASE_PUBLISHABLE_KEY:'',VITE_POSTHOG_ENABLED:'false',VITE_POSTHOG_KEY:'',VITE_POSTHOG_HOST:'',VITE_ANALYTICS_ENVIRONMENT:'phase7-local'}).map(([k,v])=>['import.meta.env.'+k,JSON.stringify(v)])),server:{host:'127.0.0.1',port:4258,strictPort:true,hmr:false,cors:false,allowedHosts:['127.0.0.1']}};
});
