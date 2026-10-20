import type { GuidedResult } from './errors';
import type { GuidedSession, GuidedCommand } from './schema';

// Phase 1 port only. No database, browser adapter, in-memory repository or Mock writes.
// A future controller validates/access-checks/gates all reads before presenting content.
// A writer prepares DB/hashes outside the shared lock, then freshly checks access/Mock
// inventory and revision inside it, acknowledges only the short completed transaction.
export interface GuidedRepository {
  read(id: string): Promise<GuidedResult<GuidedSession | null>>;
  list(): Promise<GuidedResult<unknown[]>>;
  create(session: GuidedSession): Promise<GuidedResult<GuidedSession>>;
  execute(id: string, expectedRevision: number, command: GuidedCommand): Promise<GuidedResult<GuidedSession>>;
  remove(id: string, expectedRevision: number): Promise<GuidedResult<null>>;
}
