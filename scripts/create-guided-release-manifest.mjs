import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(dir + '/' + e.name) : [dir + '/' + e.name]); }
const tree = dir => files(dir).sort().map(file => ({ path: file.slice(dir.length + 1), bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) }));
const root = '.localtest/guided-production/';
const source = read(root + 'upload-verified-inventory.json');
for (const row of source) if (hash(fs.readFileSync(root + 'upload-verified/' + row.path)) !== row.sha256) throw Error('Prepared source differs from inventory');
const enabled = tree(root + 'enabled'), disabled = tree(root + 'disabled'), rollback = tree(root + 'rollback-confirmed');
if (JSON.stringify(enabled) !== JSON.stringify(rollback)) throw Error('Rollback bytes differ');
const accepted = read('guided-release/manifest.json'), target = read('release/guided/target.json');
const finalUnits = fs.readFileSync('test-results/guided-production-preflight-20261019-01/full-units-final.log', 'utf8');
const unitsMatch = finalUnits.match(/Tests\s+(\d+) passed \((\d+)\)/);
if (!unitsMatch) throw Error('Record the actual full-unit disposition before manifest preparation');
if (hash(fs.readFileSync('guided-release/manifest.json')) !== '4e3b59ea6214a53b998429cb4e5d6bc76cb20ce75bda2be44725f900324b73e3') throw Error('Accepted manifest changed');
for (const asset of accepted.assets) if (hash(fs.readFileSync('guided-release/' + asset.file)) !== asset.sha256) throw Error('Accepted asset changed');
const manifest = {
  format: 1, kind: 'prepared-unpublished-production-release-package', preparedOn: '2026-10-19',
  candidate: accepted.artifactId, educationalAuthorityUnchanged: true, target,
  status: { localPackaging: 'verified', hostedPreview: 'NOT AUTHORIZED / NOT EXECUTED', productionEnablement: 'NOT AUTHORIZED / NOT EXECUTED', nativeManualCoverage: 'NOT EXECUTED', R1_R4: 'OPEN / NOT OWNER ACCEPTED' },
  source: { revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    uncommittedWorktree: true, preparedInputDigest: hash(JSON.stringify(source)), inputs: source,
    dependencyLockSHA256: hash(fs.readFileSync('package-lock.json')), node: process.version,
    tools: Object.fromEntries(['vite','vitest','@playwright/test','typescript'].map(name => [name, read('node_modules/' + name + '/package.json').version])) },
  build: { ordinary: { command: 'npm run build', config: 'vite.config.ts', mode: 'production', output: 'dist', guided: 'disabled / empty catalog' },
    localRelease: { command: 'npm run build:guided:release', config: 'vite.guided-production.config.ts', mode: 'production', output: root + 'enabled' },
    futurePreview: { command: 'npm run build:guided:hosted', environment: 'VERCEL_ENV=preview', output: 'dist' },
    futureProduction: { command: 'npm run build:guided:hosted', environment: 'VERCEL_ENV=production', output: 'dist' },
    environmentPolicy: 'normal Vite production loading; Guided flag/catalog only are overridden; hosting project/origin/service guards required',
    services: read('test-results/guided-production-preflight-20261019-01/build-audit-confirmed.json').services,
    remoteServiceValues: 'unverified; read rejected because env run loads secrets; no env values pulled' },
  authorizationMaps: read('guided-release/catalog.json'),
  compatibility: { source: accepted.source, legacyVersion: '1.0.0', currentVersion: '1.1.0',
    sessionReaderStorageProtection: 'unchanged; exact source/q1/g1/revocation/owner/revision rules apply',
    actualPrivateHistoryInspected: false, migrationOrOriginTransfer: false },
  hosting: { ordinaryConfigSHA256: hash(fs.readFileSync('vercel.json')), proposedConfig: read('release/guided/vercel.json'),
    uploadWorkspace: root + 'upload-verified', defaultUploadAndDeploymentUnchanged: true,
    missingJSON: 'local preview genuine 404; actual host still requires verification' },
  artifacts: { enabled, disabled, rollback },
  rollback: { path: root + 'rollback-confirmed', compatibility: 'identical tested enabled reader, both maps/assets and banks',
    localFrozenVersions: ['1.0.0','1.1.0'], hostedDeploymentId: null,
    procedure: 'publish/rehearse only after separate hosting authorization; retain exact reader/maps/assets and storage on same origin',
    suspension: 'feature-off or empty catalog preserves bytes but blocks saved-session access; not seamless rollback',
    withdrawal: 'explicit digest/revocation decisions across both version lineages; preserve history; no automatic migration/deletion' },
  privacy: { guidedCloudBackup: false, accountRecoveryAnalytics: 'existing policy preserved; remote effective values not certified',
    privateUserStorage: 'not inspected, mutated or transferred; browser automation used fresh disposable contexts only' },
  verification: { fullUnits: { passed: Number(unitsMatch[1]), total: Number(unitsMatch[2]), workers: 1, retries: 0,
      logSHA256: hash(Buffer.from(finalUnits)), historicalR1: 'OPEN; no causal fix or owner acceptance' },
    browser: '12/12 one worker, zero retries; local production HTTP and controlled frozen rollback', nativeDevicesEngines: 'NOT EXECUTED' },
};
const dest = 'release/guided/production-release-manifest.json';
if (fs.existsSync(dest)) throw Error('Manifest already exists; preserve its identity and prepare a new version explicitly');
fs.writeFileSync(dest, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ manifest: dest, sha256: hash(fs.readFileSync(dest)), preparedInputDigest: manifest.source.preparedInputDigest, enabledFiles: enabled.length, rollbackMatches: true }));
