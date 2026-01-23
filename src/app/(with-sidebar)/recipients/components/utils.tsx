import { cloneDeep, isObject } from 'lodash';

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
