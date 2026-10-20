import { createHash } from 'node:crypto';
import { describe, it, expect, vi } from 'vitest';
import vectors from './fixtures/guidedGoldenVectors.json';
import { questionFingerprint, guidanceDigest } from '../src/domain/guided/fingerprints';
import { sourceIdentitySchema, guideEntrySchema, guidedQuestionSchema, domainSchema } from '../src/domain/guided/schema';
import { validateQuestionBank } from '../src/domain/bankValidation';
import { guidedBank, unwrap } from './fixtures/syntheticGuidance';

const source = sourceIdentitySchema.parse(vectors.source);
const domain = domainSchema.parse(vectors.domain);
const question = guidedQuestionSchema.parse(vectors.question);
const entry = guideEntrySchema.parse(vectors.entry);
const oracle = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');

describe('Independent q1/g1 golden vectors', () => {
  it('matches fixed Python-generated q1 vectors with Web Crypto and Node SHA-256', async () => {
    expect(unwrap(await questionFingerprint(source, domain, question))).toBe(vectors.q1);
    expect('sha256:q1:' + oracle(vectors.q1Canonical)).toBe(vectors.q1);
    expect(unwrap(await questionFingerprint(source, domain, guidedQuestionSchema.parse(vectors.secondQuestion)))).toBe(vectors.secondQ1);
    expect('sha256:q1:' + oracle(vectors.secondQ1Canonical)).toBe(vectors.secondQ1);
  });
  it('matches the fixed independently canonicalized g1 vector', async () => {
    expect(unwrap(await guidanceDigest(source, vectors.guideVersion, entry))).toBe(vectors.g1);
    expect('sha256:g1:' + oracle(vectors.g1Canonical)).toBe(vectors.g1);
  });
  it('is deterministic and independent of all object key insertion order', async () => {
    const reverse = (value: any): any => Array.isArray(value) ? value.map(reverse) : value && typeof value === 'object' ?
      Object.fromEntries(Object.entries(value).reverse().map(([k, v]) => [k, reverse(v)])) : value;
    expect(unwrap(await questionFingerprint(reverse(source), reverse(domain), reverse(question)))).toBe(vectors.q1);
    expect(unwrap(await guidanceDigest(reverse(source), vectors.guideVersion, reverse(entry)))).toBe(vectors.g1);
  });
  const mutations: [string, (x: { source: typeof source; domain: typeof domain; question: typeof question }) => void][] = [
    ['exam ID', x => { x.source.examId += '-new'; }], ['bank version', x => { x.source.bankVersion = '1.2.4'; }],
    ['difficulty', x => { x.source.difficulty = 'advanced'; }], ['domain ID', x => { x.domain.id = x.question.primaryDomain = 'D2'; }],
    ['domain title', x => { x.domain.title += '!'; }], ['domain count', x => { x.domain.expectedQuestionCount++; }],
    ['question ID', x => { x.question.id = 'Q2'; }], ['whole stem', x => { x.question.stemMarkdown += '\nnew'; }],
    ['stem Unicode normalization', x => { x.question.stemMarkdown = x.question.stemMarkdown.normalize('NFC'); }],
    ['stem newline', x => { x.question.stemMarkdown = x.question.stemMarkdown.replace('\n', '\r\n'); }],
    ['option text', x => { x.question.options[1].textMarkdown += '!'; }], ['option order', x => { x.question.options.reverse(); }],
    ['option identifier', x => { x.question.options[1].id = 'X'; x.question.optionExplanations.X = x.question.optionExplanations.B; delete x.question.optionExplanations.B; }],
    ['selection count', x => { x.question.selectionCount = 1; x.question.correctOptionIds = ['A']; }],
    ['correct IDs', x => { x.question.correctOptionIds = ['B', 'C']; }], ['correct order', x => { x.question.correctOptionIds.reverse(); }],
    ['overall explanation', x => { x.question.explanationMarkdown += '!'; }],
    ['option explanation A', x => { x.question.optionExplanations.A += '!'; }],
    ['option explanation B', x => { x.question.optionExplanations.B += '!'; }],
    ['option explanation C', x => { x.question.optionExplanations.C += '!'; }],
    ['course title', x => { x.question.sources[0].courseTitle += '!'; }],
    ['section heading', x => { x.question.sources[0].sectionHeading += '!'; }],
    ['source URL', x => { x.question.sources[0].url += '&z=3'; }],
    ['optional URL absence', x => { delete x.question.sources[0].url; }],
    ['optional URL addition', x => { x.question.sources[1].url = 'https://example.test/b'; }],
    ['source order', x => { x.question.sources.reverse(); }],
  ];
  it.each(mutations)('q1 rejects stale content after changing %s', async (_name, mutate) => {
    const x = structuredClone({ source, domain, question }); mutate(x);
    expect(unwrap(await questionFingerprint(x.source, x.domain, x.question))).not.toBe(vectors.q1);
  });
  it('rejects unsupported schema versions and inconsistent domain references', async () => {
    expect((await questionFingerprint({ ...source, schemaVersion: 2 } as any, domain, question)).ok).toBe(false);
    expect((await questionFingerprint(source, { ...domain, id: 'D7' }, question)).ok).toBe(false);
  });
  it.each([
    ['hint', (e: typeof entry) => { e.hints[2] += '!'; }], ['criteria', (e: typeof entry) => { e.decisiveCriteria.reverse(); }],
    ['reasoning', (e: typeof entry) => { e.reasoningMarkdown += '!'; }], ['comparison', (e: typeof entry) => { e.optionComparisons[0].satisfiesMarkdown += '!'; }],
    ['limitations', (e: typeof entry) => { e.optionComparisons[0].failsOrLimitsMarkdown += '!'; }],
    ['distractors', (e: typeof entry) => { e.closestDistractorIds = ['A']; }],
    ['vocabulary', (e: typeof entry) => { e.vocabulary[0].definition += '!'; }],
    ['source check', (e: typeof entry) => { e.sourceChecks[0].claim += '!'; }],
    ['review identity', (e: typeof entry) => { e.approval.reviewId += '-new'; }],
    ['q1', (e: typeof entry) => { e.sourceFingerprint = vectors.secondQ1; }],
  ] as const)('g1 binds %s', async (_name, change) => {
    const changed = structuredClone(entry); change(changed);
    expect(unwrap(await guidanceDigest(source, vectors.guideVersion, changed))).not.toBe(vectors.g1);
  });
  it('binds g1 to exact source and guide version', async () => {
    expect(unwrap(await guidanceDigest({ ...source, difficulty: 'advanced' }, '1.0.0', entry))).not.toBe(vectors.g1);
    expect(unwrap(await guidanceDigest(source, '1.0.1', entry))).not.toBe(vectors.g1);
  });
  it('q1 uses the validated representation without extra normalization', async () => {
    const bank = guidedBank(); bank.questions[0].stemMarkdown = '  Synthetic trim\n';
    const validated = validateQuestionBank(bank); if (!validated.ok) throw new Error('fixture');
    const s = { ...source, examId: bank.examId, bankVersion: bank.version };
    expect(unwrap(await questionFingerprint(s, bank.domains[0], bank.questions[0]))).not.toBe(
      unwrap(await questionFingerprint(s, validated.bank.domains[0], validated.bank.questions[0])));
  });
  it('fails closed without Web Crypto and never substitutes the report hash', async () => {
    vi.stubGlobal('crypto', undefined);
    try { expect(await questionFingerprint(source, domain, question)).toEqual({ ok: false, code: 'unsupported-crypto' }); }
    finally { vi.unstubAllGlobals(); }
  });
});
