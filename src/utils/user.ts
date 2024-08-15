import { config } from '@/lib/config';

/**
 * Ensures the handle is in the format with a '.testnet' suffix.
 * @param handle The handle to evaluate and adjust.
 * @returns The adjusted handle with '.testnet' suffix if not already present.
 */
export function withSuffix(handle: string): string {
  const suffix = `.${config.networkId}`;
  if (!handle.endsWith(suffix)) {
    return `${handle}${suffix}`;
  }
  return handle;
}
