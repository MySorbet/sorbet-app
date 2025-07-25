import { SimpleTransactionStatus } from '@/components/common/transaction-status-badge';
import { env } from '@/lib/env';
import { DrainState } from '@/types/bridge';
import { Transaction } from '@/types/transactions';

import { TableTransaction } from '../components/transaction-table';

/**
 * Map a drain state to a simple transaction status
 * TODO: Could/should we do this on the backend instead?
 */
export const simplifyTxStatus = (
  status: DrainState
): SimpleTransactionStatus => {
  const map: Record<DrainState, SimpleTransactionStatus> = {
    // Processing
    awaiting_funds: 'processing',
    in_review: 'processing',
    payment_submitted: 'processing',
    funds_received: 'processing',
    // Completed
    payment_processed: 'completed',
    // Error
    canceled: 'error',
    error: 'error',
    undeliverable: 'error',
    returned: 'error',
    refunded: 'error',
  };
  return map[status] ?? 'error';
};

/**
 * This function only exists to take the date portion of a locale formatted date (i.e. "2/27/2025, 12:00:00 AM")
 * Once the server is returning ISO strings, this will not be needed
 */
export const formatTransactionDate = (date: string): string => {
  return date.split(',')[0];
};

/**
 * The transactions received from the API are in a different format than we display in UI.
 * This function maps the them.
 */
export const mapTransactionOverview = (
  transactions: Transaction[],
  walletAddress: string
): TableTransaction[] => {
  return transactions.map((transaction) => ({
    type:
      transaction.sender.toLowerCase() === walletAddress.toLowerCase()
        ? 'Sent'
        : 'Received',
    account:
      transaction.sender.toLowerCase() === walletAddress.toLowerCase()
        ? transaction.receiver
        : transaction.sender,
    date: transaction.timestamp,
    amount: transaction.value,
    hash: transaction.hash,
    status: transaction.status,
  }));
};

/**
 * Returns the BaseScan URL for a given transaction hash and chain
 */
export const baseScanUrl = (hash?: string) =>
  hash ? `${env.NEXT_PUBLIC_BASE_EXPLORER}/tx/${hash}` : undefined;

/** Open a transaction hash in the appropriate explorer (basescan) */
export const openTransactionInExplorer = (hash: string) => {
  try {
    const url = baseScanUrl(hash);
    const encodedUrl = url ? encodeURI(url) : undefined;
    const newWindow = window.open(encodedUrl, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      console.error(
        'Failed to open transaction in explorer. Popup may be blocked.'
      );
    }
  } catch (error) {
    console.error('Error opening transaction in explorer:', error);
  }
};
