import { describe, expect, it } from 'vitest';
import { validRegistrationEmail } from '../src/domain/email';
import { validEmails, invalidEmails } from './fixtures/registrationEmails';
describe('registration email syntax', () => {
  it.each(validEmails)('accepts %s', email => expect(validRegistrationEmail(email)).toBe(true));
  it.each(invalidEmails)('rejects %s', email => expect(validRegistrationEmail(email)).toBe(false));
});
