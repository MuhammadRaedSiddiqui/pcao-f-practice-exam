// Local-only build verification. Never calls a deployment or remote service API.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';

const root = process.cwd();
const evidence = path.resolve('test-results/production-prep-20261019');
const runId = process.argv[2] ?? 'local';
if (!/^[a-z0-9-]+$/.test(runId)) throw Error('Invalid evidence run');
const clean = path.resolve('.localtest/production-prep-clean-' + runId);
if (fs.existsSync(clean)) throw Error('Preserve previous clean-source evidence');
fs.mkdirSync(clean, { recursive: true });
fs.mkdirSync(evidence, { recursive: true });
const tree = execFileSync('git', ['write-tree'], { encoding: 'utf8' }).trim();
// Export the reviewed index, including new files, without local envs/caches/evidence.
execFileSync('git', ['checkout-index', '--all', '--prefix=' + clean.replaceAll('\\', '/') + '/']);
const target = JSON.parse(fs.readFileSync('release/guided/target.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const pins = {
  'intermediate-1.0.0.json': 'e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8',
  'intermediate-1.1.0.json': '100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67',
  'catalog.json': 'a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8',
};
for (const [file, sha] of Object.entries(pins)) {
  if (hash(fs.readFileSync(path.join(clean, 'guided-release', file))) !== sha) throw Error('Approved input changed: ' + file);
}
// Synthetic public test values only; actual Production values are neither read nor copied.
// Clean exports reuse the dependency runtime installed from the unchanged lock in the
// isolated parent worktree. No source, env file or generated output is taken from it.
const base = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(VITE_|VERCEL|GUIDED_|NETLIFY|CF_PAGES|NODE_ENV)/.test(key)));
const production = { ...base, NODE_ENV: 'production', VERCEL: '1', VERCEL_ENV: 'production',
  VERCEL_GIT_COMMIT_REF: 'main', VERCEL_PROJECT_ID: target.projectId,
  GUIDED_RELEASE_ORIGIN: target.productionOrigin, VITE_GUIDED_PRACTICE_ENABLED: 'true',
  VITE_ACCOUNT_HISTORY_ENABLED: 'true', VITE_SUPABASE_URL: 'https://supabase.synthetic.test',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic_test_key', VITE_POSTHOG_ENABLED: 'true',
  VITE_POSTHOG_KEY: 'phc_synthetic_analytics_project_token', VITE_POSTHOG_HOST: 'https://analytics.synthetic.test',
  VITE_ANALYTICS_ENVIRONMENT: 'synthetic-browser' };
const preview = { ...base, NODE_ENV: 'production', VERCEL: '1', VERCEL_ENV: 'preview',
  VERCEL_GIT_COMMIT_REF: 'feature/guided-mode-vercel-preview', VERCEL_PROJECT_ID: target.projectId };
const disabled = { ...production, VITE_GUIDED_PRACTICE_ENABLED: 'false' };
const inventories = {};
function files(dir, prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory()
    ? files(path.join(dir, item.name), prefix + item.name + '/') : [prefix + item.name]);
}
function run(cwd, env, name, success = true) {
  const r = spawnSync(process.execPath, ['scripts/build-vercel.mjs'], { cwd, env, encoding: 'utf8' });
  const log = path.join(evidence, runId + '-' + name + '.log');
  if (fs.existsSync(log)) throw Error('Preserve previous build log');
  fs.writeFileSync(log, (r.stdout ?? '') + (r.stderr ?? ''));
  if (r.error || (success ? r.status !== 0 : r.status === 0)) throw Error(name + ' unexpected build outcome: ' + r.status);
  return (r.stdout ?? '') + (r.stderr ?? '');
}
function inspect(cwd, name, enabled, hasServices) {
  const out = path.join(cwd, 'dist');
  const inventory = files(out).map(file => ({ path: file, sha256: hash(fs.readFileSync(path.join(out, file))) }));
  for (const file of inventory) {
    if (!/^(?:index\.html|(?:easy-)?question-bank\.json|assets\/[^/]+\.(?:js|css)|guided\/intermediate-1\.[01]\.0\.json)$/.test(file.path)) throw Error('Unintended output: ' + file.path);
    const text = fs.readFileSync(path.join(out, file.path), 'utf8');
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sb_secret_[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}/.test(text)) throw Error('High-confidence secret in output');
    for (const marker of ['/tests/fixtures/', 'phase7-controlled-report', '127.0.0.1:4258', 'synthetic-guidance']) {
      if (text.includes(marker)) throw Error('Forbidden bundle marker: ' + marker);
    }
  }
  const bundle = inventory.filter(f => f.path.endsWith('.js')).map(f => fs.readFileSync(path.join(out, f.path), 'utf8')).join('\n');
  if (bundle.includes('supabase.synthetic.test') !== hasServices || bundle.includes('analytics.synthetic.test') !== hasServices) throw Error('Service policy did not survive build: ' + name);
  if (hasServices && bundle.includes('guided-protected-preview')) throw Error('Preview service override in Production');
  for (const version of ['1.0.0', '1.1.0']) {
    const row = inventory.find(f => f.path === 'guided/intermediate-' + version + '.json');
    if (enabled ? row?.sha256 !== pins['intermediate-' + version + '.json'] : row !== undefined) throw Error('Output asset policy mismatch');
  }
  for (const file of ['question-bank.json', 'easy-question-bank.json']) {
    if (hash(fs.readFileSync(path.join(out, file))) !== hash(fs.readFileSync(path.join(root, 'public', file)))) throw Error('Bank changed');
  }
  inventories[name] = inventory;
  const saved = path.join(evidence, runId + '-' + name);
  if (fs.existsSync(saved)) throw Error('Preserve earlier build');
  fs.cpSync(out, saved, { recursive: true });
}
run(root, production, 'production-worktree'); inspect(root, 'production-worktree', true, true);
run(clean, production, 'production-clean'); inspect(clean, 'production-clean', true, true);
if (JSON.stringify(inventories['production-worktree']) !== JSON.stringify(inventories['production-clean'])) throw Error('Clean checkout output differs');
run(clean, preview, 'preview-clean'); inspect(clean, 'preview-clean', true, false);
run(clean, disabled, 'disabled-clean'); inspect(clean, 'disabled-clean', false, true);
const negative = [
  ['wrong-project', { ...production, VERCEL_PROJECT_ID: 'prj_wrong' }],
  ['wrong-origin', { ...production, GUIDED_RELEASE_ORIGIN: 'https://wrong.example' }],
  ['missing-service-policy', { ...production, VITE_ACCOUNT_HISTORY_ENABLED: undefined }],
  ['invalid-service-endpoint', { ...production, VITE_SUPABASE_URL: '' }],
  ['preview-as-production', { ...production, VERCEL_GIT_COMMIT_REF: preview.VERCEL_GIT_COMMIT_REF }],
];
for (const [name, env] of negative) run(clean, env, name, false);
for (const file of ['catalog.json', 'intermediate-1.1.0.json']) {
  const filename = path.join(clean, 'guided-release', file), before = fs.readFileSync(filename);
  try { fs.writeFileSync(filename, Buffer.concat([before, Buffer.from(' ')])); run(clean, production, 'corrupt-' + file, false); }
  finally { fs.writeFileSync(filename, before); }
}
fs.writeFileSync(path.join(evidence, runId + '-build-audit.json'), JSON.stringify({ tree, node: process.version,
  dependencyPolicy: 'npm ci --offline --ignore-scripts in isolated worktree; clean index export reuses that locked runtime',
  cleanSource: clean, syntheticServiceVerificationOnly: true, actualRemoteEnvironmentRead: false,
  hashes: pins, reproducibleProductionOutput: true, inventories, rejectedBuilds: [...negative.map(([n]) => n), 'corrupt-catalog.json', 'corrupt-intermediate-1.1.0.json'],
  productionRecovery: 'unset: existing enabled-by-default policy preserved',
  remoteMutations: 0 }, null, 2));
console.log('Production/Preview/disabled builds and clean-source reproduction PASS; seven invalid builds rejected.');
