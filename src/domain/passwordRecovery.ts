type RecoveryFailure = { code?: unknown; status?: unknown; name?: unknown };

// Recovery is part of configured accounts; an explicit false remains an opt-out.
export function isPasswordRecoveryEnabled(value: string | undefined): boolean { return value !== 'false'; }

export const RECOVERY_UNAVAILABLE_MESSAGE = 'Password recovery is currently unavailable. Please keep your password safe.';

export const RECOVERY_LINK_ERROR = 'This password recovery link could not be opened. It may have expired or already been used. Request a new recovery link.';

export const RECOVERY_REQUESTED_MESSAGE = 'If an account exists for this email, a password reset link has been requested. Check your inbox and spam folder.';

// Only expose service/configuration diagnostics. Never display raw server messages,
// email addresses, tokens, or account-existence errors returned by a provider.
export function recoveryErrorMessage(error: unknown): string {
  const failure: RecoveryFailure = error !== null && typeof error === 'object' ? error as RecoveryFailure : {};
  const code = typeof failure.code === 'string' ? failure.code : '';
  const status = typeof failure.status === 'number' && Number.isInteger(failure.status) && failure.status >= 400 && failure.status <= 599
    ? failure.status : undefined;
  let message: string;
  switch (code) {
    case 'email_address_not_authorized':
      message = 'The app’s email service is not configured to send recovery links to this address. Contact the app administrator.';
      break;
    case 'email_provider_disabled':
      message = 'Email-based account recovery is disabled. Contact the app administrator.';
      break;
    case 'email_address_invalid':
      message = 'The email service cannot use this address. Check it and enter the email used for your account.';
      break;
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      message = 'Too many recovery requests have been sent. Wait and try again later.';
      break;
    case 'request_timeout':
      message = 'The recovery request timed out. Check your connection and try again.';
      break;
    case 'captcha_failed':
      message = 'The recovery security check failed. Reload the page and retry. If it continues, contact the app administrator.';
      break;
    default:
      if (status === 429) message = 'Too many recovery requests have been sent. Wait and try again later.';
      else if (status === 408 || status === 504) message = 'The recovery request timed out. Check your connection and try again.';
      else if (status && status >= 500) message = 'The recovery service could not process the request. Try again later. If it continues, contact the app administrator to check email delivery.';
      else if (failure.name === 'AuthRetryableFetchError' || failure.name === 'TypeError') message = 'The recovery service could not be reached. Check your connection and try again.';
      else message = 'The recovery request could not be completed. Check the email address and try again. If it continues, contact the app administrator.';
  }
  const diagnosticCodes = ['email_address_not_authorized', 'email_provider_disabled', 'email_address_invalid',
    'over_email_send_rate_limit', 'over_request_rate_limit', 'request_timeout', 'captcha_failed',
    'unexpected_failure', 'hook_timeout', 'hook_timeout_after_retry'];
  const reference = [diagnosticCodes.includes(code) ? code : '', status ? 'HTTP ' + status : ''].filter(Boolean).join(', ');
  return message + (reference ? ' Reference: ' + reference + '.' : '');
}
