import axios from 'axios';

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

const STATUS_MESSAGES = {
  400: 'The request was invalid.',
  401: 'You need to sign in to do that.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'That already exists.',
  413: 'The file you uploaded is too large.',
  500: 'The server ran into a problem.',
};

/**
 * Turn anything thrown by axios into a human-readable message.
 * The backend's ExceptionHandlingMiddleware returns `{ statusCode, message, errors? }`.
 */
export function getErrorMessage(error, fallback = FALLBACK_MESSAGE) {
  if (!error) return fallback;

  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK') {
      return 'Could not reach the server. Check that the backend is running.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }

    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.title) return data.title;

    const status = error.response?.status;
    if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  }

  return error.message || fallback;
}

/**
 * Field-level validation errors, as produced by ConflictException
 * (`{ errors: { email: "...", userName: "..." } }`) or by ASP.NET model state
 * (`{ errors: { Email: ["..."] } }`).
 */
export function getFieldErrors(error) {
  const raw = axios.isAxiosError(error) ? error.response?.data?.errors : null;
  if (!raw || typeof raw !== 'object') return {};

  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      Array.isArray(value) ? value.join(' ') : String(value),
    ])
  );
}

export function getStatus(error) {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
}
