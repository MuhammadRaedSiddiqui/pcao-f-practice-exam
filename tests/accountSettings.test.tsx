import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AccountPanel } from '../src/ui/AccountPanel';
import type { AccountHistory } from '../src/hooks/useAccountHistory';

describe('original account settings preserved in Guided Preview branch', () => {
  it('retains both the automatic-backup preference and trusted-device checkbox', () => {
    const account = { available: true, userId: '00000000-0000-4000-8000-000000000001',
      session: { user: { email: 'settings@example.test' } }, error: '', notice: '', rows: [] } as unknown as AccountHistory;
    const html = renderToStaticMarkup(<AccountPanel account={account} history={[]} showHistory={false} showSettings
      keepCopy={false} onKeepCopyChange={() => {}} onOpenReport={async () => {}} />);
    expect(html).toContain('Active exams stay in this browser. Completed guest reports are backed up automatically when you create an account.');
    expect(html).toContain('Automatically back up new exams after completion');
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('Keep opened account reports on this trusted device for offline access');
  });
});
