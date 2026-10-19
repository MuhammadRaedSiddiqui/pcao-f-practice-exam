import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import type { FullConfig } from '@playwright/test';

export default async function setup(config: FullConfig) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const suite = String(config.metadata.suite);
  const output = path.join(root, 'test-results/production-prep-20261019');
  if (fs.existsSync(path.join(output, suite + '-results.json'))) throw Error('Preserve earlier browser evidence');
  const build = process.env.GUIDED_PREP_BUILD;
  if (!build || !path.isAbsolute(build)) throw Error('Explicit absolute compiled build path required');
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1').pathname;
    const route = /^\/(?:guided\/?|guided\/session\/[^/]+\/?|history\/?|settings\/?)?$/.test(url);
    const file = path.resolve(build, route ? 'index.html' : '.' + decodeURIComponent(url));
    if (!file.startsWith(path.resolve(build) + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }); res.end('Not found'); return;
    }
    const mime: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
    res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(Number(config.metadata.port), '127.0.0.1', resolve); });
  const previous = process.cwd();
  const workspace = path.join(output, suite + '-workspace'); fs.mkdirSync(workspace, { recursive: true });
  // Existing screenshot paths now resolve inside this new excluded evidence directory.
  process.chdir(workspace);
  return async () => { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); process.chdir(previous); };
}
