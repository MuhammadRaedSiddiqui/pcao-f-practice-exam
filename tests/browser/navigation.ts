import type { Page } from '@playwright/test';

export async function installPausedClock(page: Page, instant: Date) {
  // Start before the pause target so elapsed setup time cannot put it in the past.
  await page.clock.install({ time: new Date(instant.getTime() - 60_000) });
  await page.clock.pauseAt(instant);
}

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
