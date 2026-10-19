import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';
import guest from '../../playwright.config';
export default defineConfig({...guest,testDir:fileURLToPath(new URL('../browser/',import.meta.url)),testMatch:['exam.spec.ts','results.spec.ts','pdf-readiness.spec.ts'],workers:1,retries:0,webServer:undefined,globalSetup:'./suite-setup.ts',metadata:{phase7Suite:'guest'},outputDir:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/mock-pdf-artifacts',import.meta.url)),reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('../../test-results/guided-practice/phase-7-integration/mock-pdf.json',import.meta.url))}]]});
