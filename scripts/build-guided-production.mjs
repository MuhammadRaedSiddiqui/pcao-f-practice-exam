import { build } from 'vite';
const requested = process.argv[2];
if (!['local', 'hosted'].includes(requested)) throw Error('Choose local or hosted release packaging');
if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') throw Error('Guided release requires NODE_ENV=production');
process.env.NODE_ENV = 'production';
const profile = requested === 'local' ? 'local' : process.env.VERCEL_ENV;
if (!['local', 'preview', 'production'].includes(profile)) throw Error('Verified Vercel Preview/Production environment required');
process.env.GUIDED_RELEASE_PROFILE = profile;
await build({ configFile: 'vite.guided-production.config.ts', configLoader: 'runner', mode: 'production' });
