import {createServer} from 'vite';
import fs from 'node:fs';
const server=await createServer({configFile:false,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true},appType:'custom'});
try{
 const {prepareCandidate,unwrap,writeCandidate}=await server.ssrLoadModule('/tests/phase7-integration/prepare.ts');
 const {practiceSets,selectPracticeSet}=await server.ssrLoadModule('/src/domain/guided/selectors.ts');
 const {createAttempt,submitAttempt}=await server.ssrLoadModule('/src/domain/attemptModel.ts');
 const {startSession}=await server.ssrLoadModule('/src/domain/guided/session.ts');
 const f=await prepareCandidate(process.cwd());writeCandidate(process.cwd(),f);
 const now=1800000000000,report=submitAttempt(createAttempt(f.bank,now-1000,'phase7-measurement-report'),now);
 const session=unwrap(await startSession({kind:'post-exam',report,filter:'all',access:{kind:'guest-device'},id:'11111111-1111-4111-8111-111111111111',now},f.release,f.catalog));
 const data={artifactId:f.manifest.artifactId,releaseBytes:Buffer.byteLength(f.assets['intermediate-1.1.0.json']),legacyReleaseBytes:Buffer.byteLength(f.assets['intermediate-1.0.0.json']),sixtyItemEmptyRetrySessionBytes:Buffer.byteLength(JSON.stringify(session)),source:f.release.source,domainDistribution:f.bank.domains.map(d=>({id:d.id,count:f.coverage.items.filter(i=>i.domain.id===d.id).length})),responseDistribution:[1,2,3].map(n=>({selectionCount:n,count:f.coverage.items.filter(i=>i.question.selectionCount===n).length})),hints:f.release.questions.reduce((n,g)=>n+g.hints.length,0),optionExplanations:f.release.questions.reduce((n,g)=>n+g.optionComparisons.length,0),sourceReferenceOccurrences:f.release.questions.reduce((n,g)=>n+g.sourceChecks.length,0),sets:[5,10].map(size=>({size,sets:unwrap(practiceSets(f.coverage,size)).map(s=>({...s,questionIds:unwrap(selectPracticeSet(f.coverage,size,s.setIndex)).map(i=>i.question.id)}))})),personalSessionDataRead:false,productionCatalogPopulated:false};
 fs.writeFileSync('test-results/guided-practice/phase-7-integration/coverage-and-sizes.json',JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify({...data,sets:data.sets.map(s=>({size:s.size,count:s.sets.length})),domainDistribution:undefined,responseDistribution:undefined}));
}finally{await server.close();}
