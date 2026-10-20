// Local content-authoring evidence only; never imported by application code.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const out = 'test-results/guided-practice/phase-7-batch-1';
fs.mkdirSync(out, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name).replaceAll('\\', '/')]) : [];
const files = [...new Set([
  ...walk('src'), ...walk('public'), ...walk('dist'), ...walk('docs/guided-practice/content/intermediate-pilot'),
  ...walk('tests/local-pilot'), ...walk('tests/fixtures'),
  ...fs.readdirSync('.').filter(n => /^(?:vite|playwright).*\.[cm]?[jt]s$/.test(n)),
  ...fs.readdirSync('tests').filter(n => /\.test\.tsx?$/.test(n)).map(n => 'tests/' + n),
  'package.json', 'package-lock.json', '.env.example', '.vercelignore', 'vercel.json',
  'docs/guided-practice/PHASE-6-OWNER-ACCEPTANCE-AND-COMPLETION.md',
])].filter(p => fs.statSync(p).isFile()).sort();
const baselinePath = out + '/preservation-before.json';
if (process.argv.includes('--check')) {
  const before = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const changed = before.files.filter(f => !fs.existsSync(f.path) || sha(fs.readFileSync(f.path)) !== f.sha256);
  const result = { checkedAt: new Date().toISOString(), baselineSha256: sha(fs.readFileSync(baselinePath)),
    protectedFiles: before.files.length, changed, ok: changed.length === 0 };
  fs.writeFileSync(out + '/preservation-after.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
  if (!result.ok) process.exitCode = 1;
} else {
  if (fs.existsSync(baselinePath)) throw new Error('Refusing to overwrite original baseline');
  fs.writeFileSync(baselinePath, JSON.stringify({ capturedAt: new Date().toISOString(),
    files: files.map(p => ({ path: p, sha256: sha(fs.readFileSync(p)) })) }, null, 2) + '\n');
  console.log('Captured ' + files.length + ' protected file identities');
}
