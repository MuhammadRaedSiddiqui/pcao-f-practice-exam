import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';

export const acceptedCandidate = '118e9257c881023ff52d2e358dfd83b708c304f992e327a935b5f966535bfeba';
const pins: Record<string, string> = {
  'manifest.json': '4e3b59ea6214a53b998429cb4e5d6bc76cb20ce75bda2be44725f900324b73e3',
  'catalog.json': 'a209f06aab1e38ba924c556e6002859d398034961d76ae8167ad7d2f2ddc09a8',
  'intermediate-1.0.0.json': 'e9119d864aa8688a727188fa595b1cbca3faca4e93a9fed856a34bb8878a37b8',
  'intermediate-1.1.0.json': '100af4167f959664fdaae66b27e9b002a506ab262ef2ddabaff17aa856948a67',
};

// Build-time opt-in only. Never read authoring drafts or accept arbitrary paths/maps.
export function readAcceptedRelease(root: string) {
  const files = Object.fromEntries(Object.entries(pins).map(([file, pin]) => {
    const bytes = fs.readFileSync(path.resolve(root, 'guided-release', file));
    if (createHash('sha256').update(bytes).digest('hex') !== pin) throw Error('Accepted Guided asset hash mismatch: ' + file);
    return [file, bytes];
  }));
  const manifest = JSON.parse(files['manifest.json'].toString('utf8'));
  if (manifest.artifactId !== acceptedCandidate) throw Error('Unaccepted Guided candidate');
  return { files, catalog: JSON.parse(files['catalog.json'].toString('utf8')) };
}

export function guidedLocalRelease(root: string): { plugin: Plugin; catalog: unknown } {
  if (process.env.VERCEL || process.env.NETLIFY || process.env.CF_PAGES) throw Error('Guided local build cannot run on hosting');
  const release = readAcceptedRelease(root);
  const assets = Object.entries(release.files).filter(([file]) => file.startsWith('intermediate-'));
  return { catalog: release.catalog, plugin: {
    name: 'accepted-guided-local-release',
    configResolved(config) {
      if (config.server.host !== '127.0.0.1' || config.preview.host !== '127.0.0.1') throw Error('Guided local mode requires loopback');
      if (config.build.outDir !== '.localtest/guided-mode/enabled') throw Error('Guided local build must remain outside deployment output');
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const asset = assets.find(([file]) => url === '/guided/' + file);
        if (!asset) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(asset[1]);
      });
    },
    generateBundle() {
      for (const [file, bytes] of assets) this.emitFile({ type: 'asset', fileName: 'guided/' + file, source: bytes });
    },
  } };
}
