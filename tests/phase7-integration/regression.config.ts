import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import guided from '../../playwright.guided.config';
export default defineConfig({...guided,testDir:fileURLToPath(new URL('../guided-browser/',import.meta.url)),workers:1,retries:0,webServer:undefined,globalSetup:'./suite-setup.ts',metadata:{phase7Suite:'guided'},outputDir:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/guided-regression-artifacts',import.meta.url)),reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/guided-regression.json',import.meta.url))}]]});
