import { config } from '@/lib/config';

/**
 * Ensures the username is in the format with a '.testnet' suffix.
 * @param username The username to evaluate and adjust.
 * @returns The adjusted username with '.testnet' suffix if not already present.
 */
export function ensureValidAccountId(username: string): string {
  const suffix = `.${config.networkId}`;
  if (!username.endsWith(suffix)) {
    return `${username}${suffix}`;
  }
  return username;
}
