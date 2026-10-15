import { describe, expect, it } from 'vitest';
import { RECOVERY_REQUESTED_MESSAGE, recoveryErrorMessage } from '../src/domain/passwordRecovery';

describe('password recovery error messages', () => {
  it('explains restricted default-sender delivery with a support reference', () => {
    const message = recoveryErrorMessage({ code: 'email_address_not_authorized', status: 403, message: 'private@example.test' });
    expect(message).toContain('not configured to send recovery links');
    expect(message).toContain('Contact the app administrator');
    expect(message).toContain('Reference: email_address_not_authorized, HTTP 403');
    expect(message).not.toContain('private@example.test');
  });
  it('explains disabled email authentication', () => {
    expect(recoveryErrorMessage({ code: 'email_provider_disabled', status: 400 })).toContain('Email-based account recovery is disabled');
  });
  it('explains an address the email service cannot accept', () => {
    expect(recoveryErrorMessage({ code: 'email_address_invalid', status: 422 })).toContain('email service cannot use this address');
  });
  it.each(['over_email_send_rate_limit', 'over_request_rate_limit'])('handles %s without promising a fixed wait time', code => {
    const message = recoveryErrorMessage({ code, status: 429 });
    expect(message).toContain('Wait and try again later');
    expect(message).toContain(code);
  });
  it('recognizes rate limiting from HTTP status without a code', () => {
    expect(recoveryErrorMessage({ status: 429 })).toContain('Too many recovery requests');
  });
  it('does not label an unknown server failure as a confirmed SMTP configuration problem', () => {
    const message = recoveryErrorMessage({ code: 'unexpected_failure', status: 500, message: 'SMTP password=private-secret' });
    expect(message).toContain('could not process the request');
    expect(message).toContain('unexpected_failure, HTTP 500');
    expect(message).not.toContain('not configured');
    expect(message).not.toContain('private-secret');
  });
  it('distinguishes connectivity and timeout failures', () => {
    expect(recoveryErrorMessage({ name: 'AuthRetryableFetchError', status: 0 })).toContain('Check your connection');
    expect(recoveryErrorMessage({ code: 'request_timeout', status: 504 })).toContain('timed out');
  });
  it.each(['user_not_found', 'email_not_confirmed', 'user_banned'])('does not expose the account-specific code %s', code => {
    const message = recoveryErrorMessage({ code, message: 'private@example.test' });
    expect(message).not.toContain(code);
    expect(message).not.toContain('private@example.test');
  });
  it('does not expose untrusted error codes or raw provider details', () => {
    const message = recoveryErrorMessage({ code: '<script>secret</script>', status: 400, message: 'Bearer private-token' });
    expect(message).toContain('HTTP 400');
    expect(message).not.toContain('secret');
    expect(message).not.toContain('private-token');
  });
  it.each([null, undefined, 'private@example.test', { status: NaN }, { status: 200 }])('handles missing or malformed errors safely', error => {
    expect(recoveryErrorMessage(error)).toContain('Contact the app administrator'.toLowerCase());
    expect(recoveryErrorMessage(error)).not.toContain('private@example.test');
  });
  it('describes an accepted request without guaranteeing delivery or confirming an account', () => {
    expect(RECOVERY_REQUESTED_MESSAGE).toContain('If an account exists');
    expect(RECOVERY_REQUESTED_MESSAGE).toContain('has been requested');
    expect(RECOVERY_REQUESTED_MESSAGE).not.toContain('will arrive');
  });
});
