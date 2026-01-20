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
    // Completed
    payment_processed: 'Completed',
    // Processing
    awaiting_funds: 'Processing',
    payment_submitted: 'Processing',
    funds_received: 'Processing',
    // In Review
    in_review: 'In Review',
    // Returned
    returned: 'Returned',
    refunded: 'Returned',
    // Rejected
    canceled: 'Rejected',
    error: 'Rejected',
    undeliverable: 'Rejected',
  };
  return map[status] ?? 'Rejected';
};

/**
 * This function only exists to take the date portion of a locale formatted date (i.e. "2/27/2025, 12:00:00 AM")
 * Once the server is returning ISO strings, this will not be needed
 */
export const formatTransactionDate = (date: string): string => {
  return date.split(',')[0];
};

/**
 * Determine the transaction type based on sender and receiver
 */
const getTransactionType = (
  sender: string,
  receiver: string,
  walletAddress: string
): TableTransaction['type'] => {
  const senderLower = sender.toLowerCase();
  const receiverLower = receiver.toLowerCase();
  const walletLower = walletAddress.toLowerCase();

  // Self-transfer (Deposit) when sender and receiver are the same as wallet
  if (senderLower === walletLower && receiverLower === walletLower) {
    return 'Deposit';
  }
  // Money Out when sending from wallet
  if (senderLower === walletLower) {
    return 'Money Out';
  }
  // Money In when receiving to wallet
  return 'Money In';
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
    type: getTransactionType(
      transaction.sender,
      transaction.receiver,
      walletAddress
    ),
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
