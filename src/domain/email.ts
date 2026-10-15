export const EMAIL_FORMAT_MESSAGE = 'Enter an email with a complete domain, such as name@example.com.';

// ASCII mailbox syntax; international domains can use their IDNA (xn--) form.
// This checks format/domain shape, not delivery or mailbox ownership.
export function validRegistrationEmail(value: string): boolean {
  if (value.length > 254) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (local.length > 64 || !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(local)) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && labels.every(label => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label)) &&
    /^(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9](?:[A-Za-z0-9-]{0,57}[A-Za-z0-9])?)$/i.test(labels.at(-1)!);
}
