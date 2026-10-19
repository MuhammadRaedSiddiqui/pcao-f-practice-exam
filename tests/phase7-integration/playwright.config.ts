import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
export default defineConfig({testDir:'.',testMatch:'*.spec.ts',globalSetup:'./global-setup.ts',workers:1,retries:0,outputDir:'../../test-results/guided-practice/phase-7-integration/browser-artifacts',reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/browser.json',import.meta.url))}]],use:{baseURL:'http://127.0.0.1:4258',screenshot:'only-on-failure'}});
