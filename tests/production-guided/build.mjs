import { build, resolveConfig } from 'vite';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const out = 'test-results/guided-production-preflight-20261019-01/';
const confirmed = process.argv[2] === 'confirmed';
const auditName = confirmed ? 'build-audit-confirmed.json' : 'build-audit.json';
if (fs.existsSync(out + auditName)) throw Error('Preserve earlier build evidence');
// resolveConfig defaults NODE_ENV to development independently of mode; set it before inspection.
process.env.NODE_ENV = 'production';
process.env.GUIDED_RELEASE_PROFILE = 'local';
const base = { configLoader: 'runner', mode: 'production' };
const ordinary = await resolveConfig({ ...base, configFile: 'vite.config.ts' }, 'build');
const enabled = await resolveConfig({ ...base, configFile: 'vite.guided-production.config.ts' }, 'build');
if (!ordinary.isProduction || !enabled.isProduction) throw Error('Expected actual production compilation');
const serviceNames = ['VITE_ACCOUNT_HISTORY_ENABLED','VITE_PASSWORD_RECOVERY_ENABLED','VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY','VITE_POSTHOG_ENABLED','VITE_POSTHOG_KEY','VITE_POSTHOG_HOST','VITE_ANALYTICS_ENVIRONMENT'];
const hash = b => createHash('sha256').update(b).digest('hex');
const policies = serviceNames.map(name => ({ name, present: Boolean(ordinary.env[name]),
  equal: ordinary.env[name] === enabled.env[name], hash: hash(ordinary.env[name] ?? '<unset>'),
  overriddenByRelease: Object.hasOwn(enabled.define, 'import.meta.env.' + name) }));
if (policies.some(p => !p.equal || p.overriddenByRelease) || ordinary.env.MODE !== enabled.env.MODE) throw Error('Production service policy changed');
await build({ ...base, configFile: 'vite.config.ts', build: { outDir: '.localtest/guided-production/disabled' } });
await build({ ...base, configFile: 'vite.guided-production.config.ts' });
const assetHashes = {};
for (const version of ['1.0.0','1.1.0']) {
  const file = 'guided/intermediate-' + version + '.json';
  const bytes = fs.readFileSync('.localtest/guided-production/enabled/' + file);
  if (hash(bytes) !== hash(fs.readFileSync('guided-release/intermediate-' + version + '.json'))) throw Error('Asset mismatch');
  assetHashes[file] = hash(bytes);
}
if (fs.existsSync('.localtest/guided-production/disabled/guided')) throw Error('Guidance emitted in ordinary build');
const forbidden = ['phase7-controlled-report','/tests/fixtures/','/tests/phase7-integration/','synthetic-guidance','127.0.0.1:4258','127.0.0.1:4256'];
for (const kind of ['enabled','disabled']) for (const file of fs.readdirSync('.localtest/guided-production/' + kind + '/assets')) {
  const text = fs.readFileSync('.localtest/guided-production/' + kind + '/assets/' + file, 'utf8');
  for (const marker of forbidden) if (text.includes(marker)) throw Error('Unexpected bundled marker: ' + marker);
}
const rollback = '.localtest/guided-production/' + (confirmed ? 'rollback-confirmed' : 'rollback');
if (fs.existsSync(rollback)) throw Error('Preserve existing rollback package');
fs.cpSync('.localtest/guided-production/enabled', rollback, { recursive: true });
const upload = JSON.parse(fs.readFileSync('.localtest/guided-production/upload-inventory.json'));
if (upload.some(r => /^(tests|test-results|docs|screenshots|\.env|\.vercel\/)/.test(r.path))) throw Error('Unrelated source in upload');
for (const r of upload) if (hash(fs.readFileSync('.localtest/guided-production/upload/' + r.path)) !== r.sha256) throw Error('Upload inventory mismatch');
fs.writeFileSync(out + auditName, JSON.stringify({ mode: enabled.mode, nodeEnv: process.env.NODE_ENV, isProduction: enabled.isProduction, services: policies,
  sameProductionEnvironment: true, releaseDefineKeys: Object.keys(enabled.define).filter(k => !Object.hasOwn(ordinary.define, k) || ordinary.define[k] !== enabled.define[k]),
  assetHashes, forbiddenMarkersAbsent: forbidden, ordinaryHasGuidanceAssets: false,
  rollback: 'exact copy of enabled artifact; frozen-session browser verification follows', uploadFiles: upload.length }, null, 2));
console.log('AUDIT_OK production services preserved; immutable assets exact; ordinary disabled; rollback and allowlisted upload prepared');
