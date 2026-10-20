import { readOwnership } from '../archiveStorage';
import { parseAttempt } from '../attemptModel';
import { reportHash } from '../cloudReports';
import type { GuidedSession, GuidedOrigin } from './schema';
import { failure, type GuidedResult } from './errors';
import type { Attempt } from '../attemptModel';

type Access = Extract<GuidedOrigin, { kind: 'post-exam' }>['access'];
export type AccessProof = { fresh(): GuidedResult<Access | null> };
export interface GuidedSourceAccess {
  // Hash/download work occurs outside the shared lock. fresh() is synchronous.
  prepare(session: Pick<GuidedSession, 'origin'>): Promise<GuidedResult<AccessProof>>;
}
export type DownloadedSource = { attempt: Attempt; fresh(): boolean };
export type ResolveDownloadedSource = (id: string) => Promise<DownloadedSource | null>;

// Prefer the exact local original. Private missing originals may use the existing
// verified account download/trusted-copy port; no runtime bank is a source fallback.
export function browserSourceAccess(currentOwner: () => string | null,
  storage: () => Pick<Storage, 'getItem'> = () => localStorage,
  downloaded?: ResolveDownloadedSource): GuidedSourceAccess {
  return { async prepare(session) {
    if (session.origin.kind === 'standalone') return { ok: true, value: { fresh: () => ({ ok: true, value: null }) } };
    const origin = session.origin;
    try {
      const store = storage();
      const ownerAtStart = currentOwner();
      const raw = store.getItem('pcao-f:attempt:v1:' + origin.sourceAttemptId);
      // A present local record is authoritative: never bypass a changed/damaged original.
      const remote = raw === null && origin.access.kind === 'account' && origin.access.ownerId === ownerAtStart
        ? await downloaded?.(origin.sourceAttemptId) : null;
      const report = raw === null ? remote?.attempt : parseAttempt(JSON.parse(raw));
      if (!report || report.status !== 'submitted' || await reportHash(report) !== origin.sourceReportHash) return failure('private-source');
      return { ok: true, value: { fresh() {
        try {
          if (currentOwner() !== ownerAtStart || store.getItem('pcao-f:attempt:v1:' + origin.sourceAttemptId) !== raw) return failure('private-source');
          const owner = readOwnership({ getItem: key => store.getItem(key), setItem: () => { throw new Error(); }, removeItem: () => { throw new Error(); } }, origin.sourceAttemptId);
          if (owner?.state === 'deleted' || (owner && owner.userId !== currentOwner())) return failure('private-source');
          if (remote && !remote.fresh()) return failure('private-source');
          if (origin.access.kind === 'account' && (origin.access.ownerId !== currentOwner() ||
            (!remote && owner?.userId !== origin.access.ownerId))) return failure('private-source');
          // Sole origin change allowed: guest source claimed by this same current owner.
          return { ok: true, value: owner ? { kind: 'account', ownerId: owner.userId } : origin.access };
        } catch { return failure('private-source'); }
      } } };
    } catch { return failure('private-source'); }
  } };
}
