import axios from 'axios';

type SorbetApiErrorData = {
  code?: string;
  message?: string | string[];
  details?: unknown;
};

/**
 * Extract a user-friendly message from API errors.
 * - Supports Sorbet API `{ code, message, details? }`
 * - Supports Nest validation message arrays (now in `message`)
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as SorbetApiErrorData | undefined;
    const msg = data?.message;

    if (Array.isArray(msg)) return msg.join('\n');
    if (typeof msg === 'string') return msg;

    return error.message;
  }

  if (error instanceof Error) return error.message;
  return String(error);
}

