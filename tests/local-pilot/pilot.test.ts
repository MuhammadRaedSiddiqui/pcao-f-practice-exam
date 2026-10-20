import { beforeAll, describe, expect, it } from 'vitest';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { preparePilot, pilotSets, sha256 } from './prepare';
import { productionCatalog } from '../../src/domain/guided/catalog';
import { validatePublishedRelease } from '../../src/domain/guided/loader';
import { selectPracticeSet, resolveEligibility } from '../../src/domain/guided/selectors';
import { guidanceDigest } from '../../src/domain/guided/fingerprints';

const root = process.cwd();
let pilot: Awaited<ReturnType<typeof preparePilot>>;
beforeAll(async () => { pilot = await preparePilot(root); });
describe('Exact owner-authorized local D14 pilot', () => {
  it('has only the ten accepted guides and exactly two ordered five-item sets', async () => {
    expect(pilot.release.questions.map(q => q.questionId)).toEqual(pilotSets.flat());
    const coverage = await resolveEligibility({ kind:'standalone', bank:pilot.bank, difficulty:'intermediate' }, pilot.release, pilot.catalog);
    expect(coverage.ok).toBe(true);
    if (!coverage.ok) throw new Error(coverage.code);
    for (const [index, ids] of pilotSets.entries()) {
      const set = selectPracticeSet(coverage.value, 5, index);
      expect(set.ok && set.value.map(i => i.question.id)).toEqual(ids);
    }
    expect(selectPracticeSet(coverage.value,5,2).ok).toBe(false);
  });
  it('does not publish the projection through the production catalog', async () => {
    expect(productionCatalog).toEqual([]);
    expect(await validatePublishedRelease(pilot.release)).toEqual({ ok:false, code:'not-published' });
  });
  it('retains catalog/digest and revoked-content rejection with the real guides', async () => {
    const changed = structuredClone(pilot.release); changed.questions[0].hints[0] += ' changed';
    expect(await validatePublishedRelease(changed,pilot.catalog)).toEqual({ ok:false, code:'digest-mismatch' });
    const catalog = structuredClone(pilot.catalog);
    catalog[0].revokedDigests.push(catalog[0].approvedEntries.Q4);
    const coverage = await resolveEligibility({ kind:'standalone', bank:pilot.bank, difficulty:'intermediate' },pilot.release,catalog);
    expect(coverage.ok && coverage.value.items.map(i=>i.question.id)).not.toContain('Q4');
    expect(await guidanceDigest(pilot.release.source,'1.0.1',pilot.release.questions[0])).not.toEqual({ok:true,value:pilot.catalog[0].approvedEntries.Q4});
  });
  it('creates a reproducible artifact identity over source, guides, tooling and policy', async () => {
    const again = await preparePilot(root);
    expect(again.manifest).toEqual(pilot.manifest);
    const { artifactId, ...identity } = pilot.manifest;
    expect(artifactId).toBe(sha256(JSON.stringify(identity)));
  });
  it('refuses drift in the owner-approved content and protects source-bank bytes', async () => {
    const parent = resolve(root,'test-results/guided-practice/local-pilot'); mkdirSync(parent,{recursive:true});
    const copy = mkdtempSync(resolve(parent,'negative-'));
    for (const directory of ['public','docs/guided-practice/content/intermediate-pilot','tests/local-pilot']) cpSync(resolve(root,directory),resolve(copy,directory),{recursive:true});
    const path = resolve(copy,'docs/guided-practice/content/intermediate-pilot/batch-1.md');
    const text = readFileSync(path,'utf8');
    const hint = pilot.release.questions[0].hints[0];
    writeFileSync(path,text.replace(hint,hint+' changed'));
    await expect(preparePilot(copy)).rejects.toThrow('draft hash changed');
    writeFileSync(path,text);
    writeFileSync(resolve(copy,'public/easy-question-bank.json'),'{}');
    await expect(preparePilot(copy)).rejects.toThrow('Intermediate bank changed');
  });
});
