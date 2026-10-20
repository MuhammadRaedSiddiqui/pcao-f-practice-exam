import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
const enabled=process.env.PHASE7_EMPTY_BUILD==='true',name=enabled?'ordinary-empty':'ordinary-disabled';
export default defineConfig({testDir:fileURLToPath(new URL('../guided-release-browser/',import.meta.url)),globalSetup:'./ordinary-setup.ts',workers:1,retries:0,outputDir:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/'+name+'-artifacts',import.meta.url)),reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/'+name+'.json',import.meta.url))}]],use:{baseURL:'http://127.0.0.1:4259',screenshot:'only-on-failure'},metadata:{guidedEnabled:enabled}});
