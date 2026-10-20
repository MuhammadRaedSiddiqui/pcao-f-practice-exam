import { domainSchema, guidedQuestionSchema, guideEntrySchema, sourceIdentitySchema, versionSchema,
  type SourceIdentity, type GuideEntry, type GuidedQuestion } from './schema';
import { failure, type GuidedResult } from './errors';

export type Fingerprint = `sha256:q1:${string}`;
export type GuideDigest = `sha256:g1:${string}`;
type Domain = { id: string; title: string; expectedQuestionCount: number };

// Canonical JSON for g1 only: code-unit sorted own object keys, unchanged arrays/text.
// Refuse non-JSON values, sparse arrays and cycles rather than silently dropping data.
function canonical(value: unknown, parents = new Set<object>()): string {
  if (value === null || typeof value === 'string' || typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))) return JSON.stringify(value);
  if (!value || typeof value !== 'object' || parents.has(value)) throw new Error('Invalid JSON');
  parents.add(value);
  let result: string;
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length) throw new Error('Invalid array');
    result = '[' + Array.from(value, item => canonical(item, parents)).join(',') + ']';
  } else {
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new Error('Invalid object');
    result = '{' + Object.keys(value).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
      .map(key => JSON.stringify(key) + ':' + canonical((value as Record<string, unknown>)[key], parents)).join(',') + '}';
  }
  parents.delete(value);
  return result;
}

async function digest(input: string): Promise<GuidedResult<string>> {
  if (!globalThis.crypto?.subtle) return failure('unsupported-crypto');
  try {
    const bytes = new TextEncoder().encode(input);
    return { ok: true, value: [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
      .map(byte => byte.toString(16).padStart(2, '0')).join('') };
  } catch { return failure('unsupported-crypto'); }
}

export async function questionFingerprint(source: SourceIdentity, domain: Domain, question: GuidedQuestion): Promise<GuidedResult<Fingerprint>> {
  if (!sourceIdentitySchema.safeParse(source).success || !domainSchema.safeParse(domain).success ||
      !guidedQuestionSchema.safeParse(question).success || question.primaryDomain !== domain.id) return failure('invalid-source');
  const result = await digest(JSON.stringify([
    'pcao-f-guided-question', 1, source.schemaVersion, source.examId, source.bankVersion, source.difficulty,
    [domain.id, domain.title, domain.expectedQuestionCount], question.id, question.primaryDomain, question.selectionCount,
    question.stemMarkdown, question.options.map(o => [o.id, o.textMarkdown]), question.correctOptionIds,
    question.explanationMarkdown, question.options.map(o => [o.id, question.optionExplanations[o.id]]),
    question.sources.map(s => [s.courseTitle, s.sectionHeading, s.url ?? null]),
  ]));
  return result.ok ? { ok: true, value: `sha256:q1:${result.value}` } : result;
}

export async function guidanceDigest(source: SourceIdentity, guideVersion: string, entry: GuideEntry): Promise<GuidedResult<GuideDigest>> {
  if (!sourceIdentitySchema.safeParse(source).success || !versionSchema.safeParse(guideVersion).success ||
      !guideEntrySchema.safeParse(entry).success) return failure('invalid-release');
  try {
    const result = await digest(canonical(['pcao-f-guided-entry', 1, source, guideVersion, entry]));
    return result.ok ? { ok: true, value: `sha256:g1:${result.value}` } : result;
  } catch { return failure('invalid-release'); }
}
