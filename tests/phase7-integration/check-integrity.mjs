import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),out='test-results/guided-practice/phase-7-integration/',base='docs/guided-practice/';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),assert=(v,m)=>{if(!v)throw Error(m);},read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const baseline=json(out+'preservation-before.json'),manifest=json(out+'candidate/manifest.json'),results=json(out+'engineering-results.json');
const statusFiles=['AGENTS.md','PROJECT_IMPLEMENTATION_STATUS.md',...['GUIDED-PRACTICE-MASTER-PLAN.md','GUIDED-PRACTICE-ARCHITECTURE.md','GUIDED-PRACTICE-EXECUTION-CHECKLIST.md','GUIDED-PRACTICE-VERIFICATION-MATRIX.md'].map(p=>base+p)];
const testFiles=['guidedPhase7Content.test.ts','guidedPhase7Batch2Content.test.ts','guidedPhase7Batch3Content.test.ts','guidedPhase7Batch4Content.test.ts','guidedPhase7Batch5Content.test.ts'].map(p=>'tests/'+p);
const allowed=[...statusFiles,...testFiles];
const preserved=baseline.files.map(f=>({...f,currentSha256:sha(f.path),permittedDocumentationOrTestUpdate:allowed.includes(f.path),unchanged:sha(f.path)===f.sha256}));
assert(preserved.length===419&&preserved.filter(f=>!f.permittedDocumentationOrTestUpdate).length===408,'Baseline scope');
assert(preserved.every(f=>f.unchanged||f.permittedDocumentationOrTestUpdate),'Protected source/history changed');
const recovered=json(out+'historical-visual-restoration.json');assert(recovered.originalTrackedFilesRestored===36&&recovered.allRestoredByteExact,'Historical visual restoration scope');
for(const r of recovered.records){assert(sha(r.path)===r.restoredSha256,'Restored historical visual '+r.path);assert(sha(r.generatedCapture)===r.generatedSha256,'Retained new visual '+r.path);}
assert(fs.existsSync(out+'guest-workspace/screenshots/exam-narrative-1366.png')&&fs.existsSync(out+'guest-workspace/screenshots/exam-table-1366.png'),'Future guest screenshot redirection verified');
for(const f of preserved.filter(f=>f.permittedDocumentationOrTestUpdate)){
 const copy=testFiles.includes(f.path)?out+'before-tests/'+path.basename(f.path):out+'before-docs/'+f.path;assert(sha(copy)===f.sha256,'Original copy integrity '+f.path);
}
assert(!fs.existsSync('public/guided'),'No public release catalog/assets');
assert(read('src/domain/guided/catalog.ts').includes('productionCatalog: GuideCatalog = frozenCopy([])'),'Production catalog empty');
for(const p of ['.env','.env.local','.env.development','.env.production','.env.example'].filter(p=>fs.existsSync(p))){const matches=[...read(p).matchAll(/^\s*VITE_GUIDED_PRACTICE_ENABLED\s*=\s*([^\r\n#]*)/gm)];assert(matches.every(m=>!/^['"]?true['"]?$/.test(m[1].trim())),'No production flag enablement');}
for(const a of manifest.assets)assert(sha(out+'candidate/'+a.file)===a.sha256,'Immutable candidate '+a.file);
assert(manifest.records.length===60&&new Set(manifest.records.map(r=>r.questionId)).size===60,'Exact sixty map');
const catalog=json(out+'candidate/catalog.json');assert(catalog.length===2&&catalog[0].guideVersion==='1.0.0'&&catalog[1].guideVersion==='1.1.0','Exact local ordering');
assert(Object.keys(catalog[0].approvedEntries).length===10&&Object.keys(catalog[1].approvedEntries).length===60,'Version maps');
for(const r of manifest.records)assert(catalog[1].approvedEntries[r.questionId]===r.g1,'Exact current digest map '+r.questionId);
assert(results.allBrowserPass===true,'Unresolved current browser failure; report preserved');
assert(results.unitTestsPassed>825&&read(out+'typecheck-engineering.log').trim()==='','Final engineering checks');
assert(json(out+'build-isolation.json').outputs.length===2,'Both sanitized builds');
const reportFiles=['PHASE-7-INTEGRATION-IMPLEMENTATION-REPORT.md','PHASE-7-VERSION-COMPATIBILITY-VERIFICATION.md','PHASE-7-LOCAL-PREVIEW.md'].map(p=>base+p);
let linkCount=0;
for(const p of reportFiles){const text=read(p);for(const m of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){if(/^https?:/.test(m[1]))continue;const target=path.resolve(path.dirname(p),m[1].split('#')[0]);assert(fs.existsSync(target)||[out+'preservation-after.json',out+'verification-inputs.json'].some(t=>target===path.resolve(t)),'Missing local report link '+p+' '+m[1]);linkCount++;}}
for(const p of statusFiles){const text=read(p);assert(text.includes('CURRENT — Phase 7 sixty-guide local/test integration implemented')&&text.includes('Full Phase 7 final owner acceptance remains pending'),'Status/acceptance scope '+p);}
const checklist=read(base+'GUIDED-PRACTICE-EXECUTION-CHECKLIST.md');assert(checklist.includes('- [x] Complete local/test engineering checks: TypeScript, 832/832 units')&&checklist.includes('- [ ] Final Phase 7 owner acceptance')&&checklist.includes('- [ ] Separately approve production asset publication'),'Current checklist gates');
assert(json(out+'local-service-cleanup.json').ports.every(p=>p.state==='not-listening'),'Owned test services stopped');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const inputs=[...new Set([...walk('src'),...walk('public'),...walk('tests/phase7-integration'),...testFiles,'tests/guidedPhase7Integration.test.ts','tests/fixtures/phase7ApprovalComparison.ts',...reportFiles,...statusFiles,...['manifest.json',...manifest.assets.map(a=>a.file)].map(p=>out+'candidate/'+p),'package.json','package-lock.json','vite.config.ts','vercel.json','.vercelignore'])].sort().map(path=>({path,sha256:sha(path)}));
fs.writeFileSync(out+'verification-inputs.json',JSON.stringify({artifactId:manifest.artifactId,scope:'Final implementation/test/source/docs/configuration and immutable candidate inputs; no personal session data',files:inputs},null,2)+'\n');
const evidenceFiles=fs.readdirSync(out).filter(p=>/\.(log|json)$/.test(p)&&!['preservation-after.json','verification-inputs.json','run-evidence.json'].includes(p));
fs.writeFileSync(out+'run-evidence.json',JSON.stringify({scope:'Current runs, including retained failed/interrupted attempts',files:evidenceFiles.map(p=>({path:out+p,sha256:sha(out+p)}))},null,2)+'\n');
const result={date:'2026-10-18',result:'pass',artifactId:manifest.artifactId,baselineFiles:419,protectedExistingFiles:408,protectedFilesUnchanged:408,authorizedTestExpectationUpdates:5,authorizedStatusUpdates:6,srcPublicBanksEducationalGuidanceAndApprovalsUnchanged:true,originalPilotIdentityHistoryPreserved:true,algorithmsSessionStorageAndOwnershipUnchanged:true,productionCatalogEntries:0,productionEnabled:false,publicGuideFiles:0,newDependencies:0,phase7OwnerAccepted:false,nativeAccessibilityPerformed:false,physicalDeviceVerificationPerformed:false,liveHostOrProductionHistoryInvented:false,reportLocalLinksChecked:linkCount,finalInputFiles:inputs.length,files:preserved};
result.historicalVisualsRestoredByteExact=36;result.newVisualCapturesRetained=36;result.screenshotRedirectionConfirmed=true;
fs.writeFileSync(out+'preservation-after.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,files:undefined}));
