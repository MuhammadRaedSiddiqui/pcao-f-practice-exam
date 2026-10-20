import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
const kind=process.env.GUIDED_PREVIEW_QA_KIND ?? 'normal';
const run=process.env.GUIDED_PREVIEW_QA_RUN ?? 'local';
if(!/^[a-z0-9-]+$/.test(run))throw Error('Invalid evidence run');
const evidence=fileURLToPath(new URL('../../test-results/guided-vercel-preview/'+run+'/',import.meta.url));
export default defineConfig({testDir:'.',
 testMatch:kind==='normal'?'normal-release.spec.ts':'packaging-release.spec.ts',workers:1,retries:0,
 globalSetup:'./setup.ts',metadata:{kind},outputDir:evidence+'artifacts',
 reporter:[['list'],['json',{outputFile:evidence+'results.json'}]],
 use:{baseURL:kind==='normal'?'http://127.0.0.1:4408':'http://127.0.0.1:4409',screenshot:'only-on-failure'}});
