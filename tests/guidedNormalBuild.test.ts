import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { acceptedCandidate, readAcceptedRelease, guidedLocalRelease } from '../build/guidedLocalRelease';
describe('Normal application local release packaging', () => {
  it('pins both exact version histories, the approval map and accepted manifest', () => {
    const loaded = readAcceptedRelease(process.cwd());
    expect(JSON.parse(loaded.files['manifest.json'].toString()).artifactId).toBe(acceptedCandidate);
    expect(loaded.catalog.map((r: { guideVersion: string }) => r.guideVersion)).toEqual(['1.0.0', '1.1.0']);
    expect(Object.keys(loaded.catalog[1].approvedEntries)).toHaveLength(60);
  });
  it.each(['manifest.json', 'catalog.json', 'intermediate-1.0.0.json', 'intermediate-1.1.0.json'])('rejects changed %s before bundling', file => {
    const original = fs.readFileSync.bind(fs);
    const spy = vi.spyOn(fs, 'readFileSync').mockImplementation(((name: any, ...args: any[]) => {
      const bytes = (original as any)(name, ...args);
      return String(name).endsWith('guided-release\\' + file) || String(name).endsWith('guided-release/' + file) ? Buffer.concat([bytes, Buffer.from(' ')]) : bytes;
    }) as any);
    try { expect(() => readAcceptedRelease(process.cwd())).toThrow('hash mismatch'); } finally { spy.mockRestore(); }
  });
  it('rejects local release mode on a hosting build', () => {
    vi.stubEnv('VERCEL', '1');
    try { expect(() => guidedLocalRelease(process.cwd())).toThrow('cannot run on hosting'); } finally { vi.unstubAllEnvs(); }
  });
});
