import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import d12 from '../../playwright.guidedD12.config';
export default defineConfig({...d12,testDir:fileURLToPath(new URL('../guided-d12-browser/',import.meta.url)),workers:1,retries:0,webServer:undefined,globalSetup:'./suite-setup.ts',metadata:{phase7Suite:'d12'},outputDir:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/d12-artifacts',import.meta.url)),reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/d12.json',import.meta.url))}]]});
