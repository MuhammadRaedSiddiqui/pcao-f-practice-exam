import { z } from 'zod';
import { sourceIdentitySchema, versionSchema, stableIdSchema, guideDigestSchema, type SourceIdentity } from './schema';
import { frozenCopy, failure, type GuidedResult } from './errors';

const catalogEntrySchema = z.strictObject({ source: sourceIdentitySchema, guideVersion: versionSchema,
  path: z.string().max(300).regex(/^guided\/[A-Za-z0-9._-]+\.json$/),
  approvedEntries: z.record(stableIdSchema, guideDigestSchema), revokedDigests: z.array(guideDigestSchema).max(60),
}).superRefine((r, ctx) => {
  if (!Object.keys(r.approvedEntries).length || Object.keys(r.approvedEntries).length > 60 ||
      new Set(r.revokedDigests).size !== r.revokedDigests.length) ctx.addIssue({ code: 'custom', message: 'Invalid catalog entries' });
});
export const guideCatalogSchema = z.array(catalogEntrySchema).max(100).superRefine((rows, ctx) => {
  const keys = rows.map(r => sourceKey(r.source) + ':' + r.guideVersion);
  if (new Set(keys).size !== keys.length || new Set(rows.map(r => r.path)).size !== rows.length) {
    ctx.addIssue({ code: 'custom', message: 'Catalog source/version/path must be unique' });
  }
});
export type GuideCatalog = z.infer<typeof guideCatalogSchema>;
export type CatalogEntry = GuideCatalog[number];

// No production content, synthetic switches, or runtime publication overrides.
export const productionCatalog: GuideCatalog = frozenCopy([]);
export const recognizedSources: readonly SourceIdentity[] = frozenCopy([
  { schemaVersion: 1, examId: 'pcao-f-practice-easy-01', bankVersion: '1.0.0', difficulty: 'intermediate' },
  { schemaVersion: 1, examId: 'pcao-f-practice-01', bankVersion: '1.1.0', difficulty: 'advanced' },
]);
export function sourceKey(source: SourceIdentity): string {
  return JSON.stringify([source.schemaVersion, source.examId, source.bankVersion, source.difficulty]);
}
export function sameSource(a: SourceIdentity, b: SourceIdentity): boolean { return sourceKey(a) === sourceKey(b); }

export function catalogRelease(source: SourceIdentity, guideVersion: string, catalog: GuideCatalog = productionCatalog): GuidedResult<CatalogEntry> {
  const parsed = guideCatalogSchema.safeParse(catalog);
  if (!parsed.success) return failure('invalid-release');
  const row = parsed.data.find(r => sameSource(r.source, source) && r.guideVersion === guideVersion);
  if (row) return { ok: true, value: frozenCopy(row) };
  return failure(parsed.data.some(r => r.source.examId === source.examId) ? 'version-mismatch' : 'not-published');
}
export function entryApproval(row: CatalogEntry, questionId: string, digest: string): GuidedResult<null> {
  if (row.revokedDigests.includes(digest)) return failure('revoked');
  return row.approvedEntries[questionId] === digest ? { ok: true, value: null } : failure('unapproved');
}
