// Synthetic structural fixtures only. Never publish as instructional content.
import { syntheticBank } from './syntheticBank';
import { questionFingerprint, guidanceDigest } from '../../src/domain/guided/fingerprints';
import type { GuideCatalog } from '../../src/domain/guided/catalog';
import type { GuideEntry, GuideRelease, SourceIdentity } from '../../src/domain/guided/schema';
import type { GuidedResult } from '../../src/domain/guided/errors';
import { startSession } from '../../src/domain/guided/session';

export const SESSION_ID = '11111111-1111-4111-8111-111111111111';
export const NOW = 1800000000000;
export const commandId = (index: number) => `22222222-2222-4222-8222-${String(index).padStart(12, '0')}`;
export function unwrap<T>(result: GuidedResult<T>): T {
  if (!result.ok) throw new Error(result.code);
  return result.value;
}
export function guidedBank() {
  const bank = syntheticBank();
  bank.contentStatus = 'reviewed'; bank.version = '1.0.0';
  // Exercise all three cardinalities while retaining the complete Mock bank contract.
  bank.questions[2].selectionCount = 3;
  bank.questions[2].options.push({ id: 'D', textMarkdown: 'Synthetic option D' });
  bank.questions[2].optionExplanations.D = 'Synthetic D';
  bank.questions[2].correctOptionIds = ['A', 'B', 'C'];
  return bank;
}
export async function syntheticGuidance(count = 10) {
  const bank = guidedBank();
  const source: SourceIdentity = { schemaVersion: 1, examId: bank.examId, bankVersion: bank.version, difficulty: 'intermediate' };
  const questions: GuideEntry[] = [];
  for (const question of bank.questions.slice(0, count)) {
    const domain = bank.domains.find(d => d.id === question.primaryDomain)!;
    const sourceFingerprint = unwrap(await questionFingerprint(source, domain, question));
    questions.push({ questionId: question.id, sourceFingerprint,
      hints: ['Synthetic ask prompt', 'Synthetic evidence prompt', 'Synthetic comparison prompt'],
      decisiveCriteria: ['Synthetic criterion one', 'Synthetic criterion two'], reasoningMarkdown: 'Synthetic postcommit reasoning',
      optionComparisons: question.options.map(o => ({ optionId: o.id, satisfiesMarkdown: `Synthetic strength ${o.id}`,
        failsOrLimitsMarkdown: `Synthetic limitation ${o.id}` })),
      closestDistractorIds: question.options.filter(o => !question.correctOptionIds.includes(o.id)).map(o => o.id),
      vocabulary: [{ term: 'Synthetic term', definition: 'Synthetic definition' }],
      sourceChecks: [{ sourceIndex: 0, claim: 'Synthetic claim', evidenceLocator: 'Synthetic locator' }],
      approval: { status: 'approved', reviewId: 'synthetic-review-only' },
    });
  }
  const release: GuideRelease = { schemaVersion: 1, fingerprintVersion: 1, source, guideVersion: '1.0.0', contentStatus: 'reviewed', questions };
  const catalog: GuideCatalog = [{ source, guideVersion: '1.0.0', path: 'guided/synthetic-only-v1.0.0.json',
    approvedEntries: Object.fromEntries(await Promise.all(questions.map(async q => [q.questionId, unwrap(await guidanceDigest(source, '1.0.0', q))]))),
    revokedDigests: [] }];
  return { bank, source, release, catalog };
}
export async function syntheticSession() {
  const fixture = await syntheticGuidance();
  const session = unwrap(await startSession({ kind: 'standalone', bank: fixture.bank, difficulty: 'intermediate',
    selectionSize: 5, setIndex: 0, id: SESSION_ID, now: NOW }, fixture.release, fixture.catalog));
  return { ...fixture, session };
}
