import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { mockAccountServer } from '../fixtures/accountServer';
const vectors = JSON.parse(readFileSync(new URL('../fixtures/guidedGoldenVectors.json', import.meta.url), 'utf8'));
test('Chromium Web Crypto agrees with all three independent fixed q1/g1 vectors', async ({ page, context }) => {
  await mockAccountServer().attach(context); await page.goto('/guided');
  const result = await page.evaluate(async vectors => {
    const moduleUrl = '/src/domain/guided/fingerprints.ts'; const module = await import(moduleUrl);
    return { q1: await module.questionFingerprint(vectors.source, vectors.domain, vectors.question),
      g1: await module.guidanceDigest(vectors.source, vectors.guideVersion, vectors.entry),
      secondQ1: await module.questionFingerprint(vectors.source, vectors.domain, vectors.secondQuestion) };
  }, vectors);
  for (const key of ['q1', 'g1', 'secondQ1'] as const) expect(result[key]).toEqual({ ok: true, value: vectors[key] });
});
