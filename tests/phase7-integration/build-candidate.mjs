import {createServer} from 'vite';
const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
try{const {prepareCandidate,writeCandidate}=await server.ssrLoadModule('/tests/phase7-integration/prepare.ts');const c=await prepareCandidate(process.cwd());console.log(JSON.stringify({folder:writeCandidate(process.cwd(),c),artifactId:c.manifest.artifactId,assets:c.manifest.assets,entries:c.release.questions.length,legacyEntries:c.legacy.questions.length}));}finally{await server.close();}
