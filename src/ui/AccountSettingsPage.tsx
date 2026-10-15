import type { RefObject } from 'react';
import type { Attempt } from '../domain/attempt';
import type { CloudReport } from '../domain/cloudReports';
import type { AccountHistory } from '../hooks/useAccountHistory';
import { AccountPanel } from './AccountPanel';
import { Button } from './primitives';

export function AccountSettingsPage({ account, history, keepCopy, onKeepCopyChange, onOpenReport, onBack, headingRef }: {
  account: AccountHistory;
  history: Attempt[];
  keepCopy: boolean;
  onKeepCopyChange: (value: boolean) => void;
  onOpenReport: (row: CloudReport, keep: boolean) => Promise<void>;
  onBack: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  return <>
    <p className="eyebrow">Your account</p>
    <h1 ref={headingRef} tabIndex={-1}>Account settings</h1>
    <p className="lead">Manage backup preferences, device access and your account.</p>
    <Button variant="quiet" onClick={onBack}>Back to attempt history</Button>
    <AccountPanel account={account} history={history} showHistory={false} showSettings
      keepCopy={keepCopy} onKeepCopyChange={onKeepCopyChange} onOpenReport={onOpenReport} />
  </>;
}
