import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Local allowlist assembly only. No Vercel command, link, credentials or deployment.
const name = process.argv[2] ?? 'upload';
if (!/^upload(?:-[a-z0-9-]+)?$/.test(name)) throw Error('Expected an upload run name');
const root = process.cwd(), out = path.resolve(root, '.localtest/guided-production', name);
if (fs.existsSync(out)) throw Error('Upload workspace already exists; preserve it and choose a reviewed new preparation run');
const files = ['package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'vite.guided-production.config.ts',
  'index.html', 'scripts/build-guided-production.mjs', 'release/guided/target.json',
  'build/guidedLocalRelease.ts', 'build/guidedProductionRelease.ts'];
function walk(dir) { for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
  const file = dir + '/' + e.name; if (e.isDirectory()) walk(file); else if (e.isFile()) files.push(file); else throw Error('Unsupported upload entry');
} }
['src', 'public', 'guided-release'].forEach(walk);
fs.mkdirSync(out, { recursive: true });
for (const file of files) { const dest = path.join(out, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(file, dest); }
fs.copyFileSync('release/guided/vercel.json', path.join(out, 'vercel.json'));
fs.writeFileSync(path.join(out, '.vercelignore'), 'node_modules/\ndist/\n.localtest/\n.env*\n.vercel/\n');
const hashes = [...files, 'vercel.json', '.vercelignore'].map(file => ({ path: file,
  sha256: createHash('sha256').update(fs.readFileSync(path.join(out, file))).digest('hex') }));
fs.writeFileSync('.localtest/guided-production/' + name + '-inventory.json', JSON.stringify(hashes, null, 2));
console.log(`Prepared ${hashes.length} allowlisted local source files. NOT deployed or linked.`);
