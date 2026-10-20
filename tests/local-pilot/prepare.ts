// Owner-authorized D14 local tooling only. Never imported by src/ or public/.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { validateQuestionBank } from '../../src/domain/bankValidation';
import { questionFingerprint, guidanceDigest } from '../../src/domain/guided/fingerprints';
import { guideEntrySchema, guideReleaseSchema, sourceIdentitySchema, versionSchema } from '../../src/domain/guided/schema';
import { guideCatalogSchema, productionCatalog } from '../../src/domain/guided/catalog';
import { validateStandaloneRelease } from '../../src/domain/guided/loader';
import { resolveEligibility, practiceSets, selectPracticeSet } from '../../src/domain/guided/selectors';
import { frozenCopy, type GuidedResult } from '../../src/domain/guided/errors';

export const pilotSets = [['Q4','Q5','Q6','Q10','Q12'], ['Q18','Q25','Q26','Q33','Q59']];
export const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
function requireMatch(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Local pilot refused: ${message}`);
}
const unwrap = <T>(result: GuidedResult<T>): T => {
  if (!result.ok) throw new Error(`Local pilot refused: ${result.code}`);
  return result.value;
};
const draftSchema = z.strictObject({ ...guideEntrySchema.shape,
  approval: z.strictObject({ status: z.literal('draft'), reviewId: z.string() }) });
const batchSchema = z.strictObject({ authoringFormatVersion: z.literal(1), batch: z.union([z.literal(1),z.literal(2)]),
  source: sourceIdentitySchema, plannedGuideVersion: versionSchema, contentStatus: z.literal('draft'),
  questions: z.array(draftSchema).length(5) });

export async function preparePilot(root: string) {
  const read = (path: string) => readFileSync(resolve(root, path));
  const folder = 'docs/guided-practice/content/intermediate-pilot/';
  const jsonBlock = (name: string) => {
    const blocks = [...read(folder + name).toString('utf8').matchAll(/^```json\r?\n([\s\S]*?)\r?\n```/gm)];
    requireMatch(blocks.length === 1, `one authoritative JSON block required: ${name}`);
    return JSON.parse(blocks[0][1]);
  };
  const pins = JSON.parse(read('tests/local-pilot/approved-identities.json').toString('utf8').replace(/^\uFEFF/, ''));
  requireMatch(sha256(read(folder + 'CONTENT-REVIEW-LEDGER.md')) === pins.ledgerSha256, 'owner waiver ledger changed');
  requireMatch(sha256(read(folder + 'FINAL-APPROVAL-MATRIX.md')) === pins.matrixSha256, 'owner identity matrix changed');
  requireMatch(sha256(read('public/easy-question-bank.json')) === pins.bankSha256, 'Intermediate bank changed');
  requireMatch(sha256(read('public/question-bank.json')) === pins.advancedBankSha256, 'Advanced bank changed');
  requireMatch(JSON.stringify(pins.records.map((r: { questionId: string }) => r.questionId)) === JSON.stringify(pilotSets.flat()), 'unexpected guide allowlist');
  requireMatch(productionCatalog.length === 0, 'production catalog must remain empty');
  const bankResult = validateQuestionBank(JSON.parse(read('public/easy-question-bank.json').toString('utf8')));
  requireMatch(bankResult.ok, 'bank validation failed');
  const bank = bankResult.bank;
  const ledger = jsonBlock('CONTENT-REVIEW-LEDGER.md');
  const batches = [1,2].map(n => batchSchema.parse(jsonBlock(`batch-${n}.md`)));
  const questions = [];
  for (const [index, batch] of batches.entries()) {
    requireMatch(batch.batch === index + 1 && JSON.stringify(batch.source) === JSON.stringify(pins.source) && batch.plannedGuideVersion === pins.guideVersion, 'batch source/version changed');
    requireMatch(JSON.stringify(batch.questions.map(q => q.questionId)) === JSON.stringify(pilotSets[index]), 'batch membership changed');
    for (const draft of batch.questions) {
      const pin = pins.records.find((r: { questionId: string }) => r.questionId === draft.questionId);
      const row = ledger.records.find((r: { questionId: string }) => r.questionId === draft.questionId);
      requireMatch(pin && row && sha256(JSON.stringify(draft)) === pin.draftSha256 && row.draftSha256 === pin.draftSha256, 'draft hash changed');
      requireMatch(draft.approval.reviewId === pin.reviewId && row.reviewId === pin.reviewId && row.approvedG1 === null, 'review identity or production approval changed');
      requireMatch(row.finalOwnerApproval.status === 'approved' && row.finalOwnerApproval.approvedDraftSha256 === pin.draftSha256 && row.finalOwnerApproval.approvedG1 === pin.g1, 'owner binding missing');
      const question = bank.questions.find(q => q.id === draft.questionId)!;
      const domain = bank.domains.find(d => d.id === question.primaryDomain)!;
      requireMatch(unwrap(await questionFingerprint(batch.source, domain, question)) === pin.q1 && draft.sourceFingerprint === pin.q1 && row.sourceFingerprint === pin.q1, 'q1 mismatch');
      // The only projected field. Existing educational acceptance/waiver authorizes
      // this excluded pilot; it does not supply an independent human signature.
      const guide = guideEntrySchema.parse({ ...draft, approval: { ...draft.approval, status: 'approved' } });
      requireMatch(unwrap(await guidanceDigest(batch.source, batch.plannedGuideVersion, guide)) === pin.g1 && row.prospectiveG1 === pin.g1, 'g1 mismatch');
      questions.push(guide);
    }
  }
  const release = guideReleaseSchema.parse({ schemaVersion:1, fingerprintVersion:1, source:pins.source,
    guideVersion:pins.guideVersion, contentStatus:'reviewed', questions });
  const catalog = guideCatalogSchema.parse([{ source:release.source, guideVersion:release.guideVersion,
    path:'guided/d14-local-only.json', approvedEntries:Object.fromEntries(pins.records.map((r: {questionId:string;g1:string}) => [r.questionId,r.g1])), revokedDigests:[] }]);
  unwrap(await validateStandaloneRelease(release, bank, 'intermediate', catalog));
  const coverage = unwrap(await resolveEligibility({ kind:'standalone', bank, difficulty:'intermediate' }, release, catalog));
  requireMatch(unwrap(practiceSets(coverage, 5)).length === 2, 'exactly two ordinary sets required');
  for (const [index, ids] of pilotSets.entries()) requireMatch(JSON.stringify(unwrap(selectPracticeSet(coverage, 5, index)).map(i => i.question.id)) === JSON.stringify(ids), 'set membership mismatch');
  const inputs: {path:string;sha256:string}[] = [];
  const add = (path:string) => inputs.push({ path:path.replaceAll('\\','/'), sha256:sha256(read(path)) });
  const walk = (path:string) => {
    for (const file of readdirSync(resolve(root,path), { withFileTypes:true })) {
      const next = relative(root, resolve(root,path,file.name));
      if (file.isDirectory()) walk(next); else add(next);
    }
  };
  for (const dir of ['src','public','tests/local-pilot',folder]) walk(dir);
  for (const path of ['index.html','package.json','package-lock.json','vite.config.ts','.vercelignore','.env.example','vercel.json']) add(path);
  inputs.sort((a,b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  const identity = { format:1, kind:'D14-loopback-development-only', inputs, source:release.source,
    guideVersion:release.guideVersion, records:pins.records, sets:pilotSets,
    servicePolicy:'accounts/cloud/telemetry/recovery disabled; external connections denied',
    projection:'approval.status only: draft → approved; owner waiver 2026-10-18; independent human reviews 0/10' };
  return frozenCopy({ bank, release, catalog, manifest:{ artifactId:sha256(JSON.stringify(identity)), ...identity } });
}
