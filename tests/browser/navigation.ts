import type { Page } from '@playwright/test';

// Existing recovery tests deliberately confirm the new native leave warning.
export async function reloadPage(page: Page) {
  const acceptLeave = async (dialog: import('@playwright/test').Dialog) => {
    if (dialog.type() === 'beforeunload') await dialog.accept();
    else await dialog.dismiss();
  };
  page.on('dialog', acceptLeave);
  try { await page.reload(); }
  finally { page.off('dialog', acceptLeave); }
}
