import { cloneDeep, isObject } from 'lodash';

import { RecipientAPI } from '@/api/recipients/types';

import { BankRecipientFormValues } from './bank-recipient-form';
import { CryptoRecipientFormValues } from './crypto-recipient-form';

// Recursively remove empty strings from an object
// TODO: Imperfect AI assisted implementation. Revisit if needed.
export const removeEmptyStrings = <T extends Record<string, unknown>>(
  obj: T
): T => {
  // Base case: not an object or null
  if (!isObject(obj) || obj === null) {
    return obj as T;
  }

  // Clone to avoid mutation
  const result = cloneDeep(obj) as Record<string, unknown>;

  // Process each property
  Object.keys(result).forEach((key) => {
    // If it's an object, recursively clean it
    if (isObject(result[key]) && result[key] !== null) {
      result[key] = removeEmptyStrings(result[key] as Record<string, unknown>);
    }

    // Remove empty strings or empty objects
    if (
      result[key] === '' ||
      (isObject(result[key]) && Object.keys(result[key]).length === 0)
    ) {
      delete result[key];
    }
  });

  return result as T;
};

// type guard between BankRecipientFormValues and CryptoRecipientFormValues
export const isCryptoFormValues = (
  values: BankRecipientFormValues | CryptoRecipientFormValues
): values is CryptoRecipientFormValues => {
  return 'walletAddress' in values;
};

/**
 * The minimum USDC you can send to a bank account.
 * @see https://apidocs.bridge.xyz/docs/liquidation-address#minimum-amounts
 */
export const BANK_ACCOUNTS_MIN_AMOUNT = 1;

/** Given the last 4 digits of an account number, pad the rest with *'s */
export const formatAccountNumber = (last4: string) => '*****' + last4;

/** Format a transfer date for display in the transfers table */
export const formatTransferDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Check if recipient is a legacy Bridge recipient that needs migration to Due Network.
 * Legacy Bridge recipients have type 'usd' or 'eur'.
 * Due Network recipients have types like 'usd_ach', 'eur_sepa', etc.
 */
export const needsMigration = (recipient: RecipientAPI): boolean => {
  return recipient.type === 'usd' || recipient.type === 'eur';
};

/**
 * Check if recipient uses the Due Transfers API (instead of a static virtual account address).
 * Reads the flag from the backend response — the backend is the single source of truth.
 * Falls back to a type check for backward compatibility with any cached/stale data.
 */
export const usesTransfersApi = (recipient: RecipientAPI): boolean => {
  if (typeof recipient.usesTransfersApi === 'boolean') {
    return recipient.usesTransfersApi;
  }
  // Fallback for backward compatibility (should not happen after backend deploys)
  return recipient.type === 'usd_ach' || recipient.type === 'usd_wire' || recipient.type === 'usd_swift';
};

/**
 * Check if recipient is a bank account (any Due Network bank type).
 * Used to enforce the minimum send amount for bank transfers.
 */
export const isBankRecipient = (recipient: RecipientAPI | undefined): boolean => {
  if (!recipient) return false;
  return (
    recipient.type === 'usd_ach' ||
    recipient.type === 'usd_wire' ||
    recipient.type === 'usd_swift' ||
    recipient.type === 'eur_sepa' ||
    recipient.type === 'eur_swift' ||
    recipient.type === 'aed_local'
  );
};

/** Converts a purpose code like SALARY_PAYMENT to "Salary Payment" */
export const formatPurposeCode = (code: string): string =>
  code
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
