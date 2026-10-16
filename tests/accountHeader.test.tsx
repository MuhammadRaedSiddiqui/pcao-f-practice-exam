import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AccountHeader } from '../src/ui/AccountHeader';
import type { AccountHistory } from '../src/hooks/useAccountHistory';

function fixture(overrides: Partial<AccountHistory> = {}): AccountHistory {
  return { available: true, authLoading: false, userId: null, session: null,
    recoveryEnabled: true, recovery: false, recoveryError: '', ...overrides } as AccountHistory;
}

describe('account access during an exam', () => {
  it('replaces guest authentication buttons with status and guidance', () => {
    const html = renderToStaticMarkup(<AccountHeader account={fixture()} examActive />);
    expect(html).toContain('Guest mode');
    expect(html).toContain('after leaving or submitting the exam');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('<dialog');
  });

  it('keeps the signed-in identity without invoking account actions', () => {
    const signOut = vi.fn();
    const account = fixture({ userId: 'synthetic-owner', signOut,
      session: { user: { email: 'exam@example.test' } } as AccountHistory['session'] });
    const html = renderToStaticMarkup(<AccountHeader account={account} examActive />);
    expect(html).toContain('Signed in as exam@example.test');
    expect(html).not.toContain('Guest mode');
    expect(html).not.toContain('<button');
    expect(signOut).not.toHaveBeenCalled();
  });

  it('defers recovery actions and errors until outside the exam', () => {
    const account = fixture({ recovery: true, recoveryError: 'Synthetic expired recovery link' });
    const during = renderToStaticMarkup(<AccountHeader account={account} examActive />);
    expect(during).not.toContain('Finish password reset');
    expect(during).not.toContain('Synthetic expired recovery link');
    expect(during).not.toContain('Request a new recovery link');
    const after = renderToStaticMarkup(<AccountHeader account={account} />);
    expect(after).toContain('Finish password reset');
    expect(after).toContain('Synthetic expired recovery link');
    expect(after).toContain('Request a new recovery link');
    expect(account.recovery).toBe(true);
  });

  it('restores guest authentication controls outside the exam', () => {
    const html = renderToStaticMarkup(<AccountHeader account={fixture()} />);
    expect(html).toContain('>Sign in</button>');
    expect(html).toContain('>Create account</button>');
    expect(html).not.toContain('Guest mode');
  });

  it('preserves loading and unconfigured states', () => {
    const loading = renderToStaticMarkup(<AccountHeader account={fixture({ authLoading: true })} examActive />);
    expect(loading).toContain('Loading account…');
    expect(loading).not.toContain('Guest mode');
    expect(loading).not.toContain('<button');
    expect(renderToStaticMarkup(<AccountHeader account={fixture({ available: false })} examActive />)).toBe('');
  });
});
