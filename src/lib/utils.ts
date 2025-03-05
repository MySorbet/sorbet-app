import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Super common pattern for delaying execution */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Formats a wallet address to a more readable format
 * - Shows the first 5 and last 5 characters of the address
 * - e.g. `0x1234567890123456789012345678901234567890` -> `0x12345...67890`
 */
export const formatWalletAddress = (account: string): string => {
  return `${account.slice(0, 5)}...${account.slice(-5)}`;
};

/**
 * Formats a user's name
 *
 * - Returns `undefined` if both first and last name are `undefined`
 * - Returns `firstName` if only first name is defined and not empty
 * - Returns `lastName` if only last name is defined and not empty
 * - Returns `firstName lastName` if both first and last name are defined and not empty
 */
export const formatName = (
  firstName?: string,
  lastName?: string
): string | undefined => {
  return [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;
};
