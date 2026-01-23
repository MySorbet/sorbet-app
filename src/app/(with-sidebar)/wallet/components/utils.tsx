import { SimpleTransactionStatus } from '@/components/common/transaction-status-badge';
import { env } from '@/lib/env';
import { DrainState } from '@/types/bridge';
import {
  Transaction,
  UnifiedTransaction,
  UnifiedTransactionStatus,
} from '@/types/transactions';

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
 * Format a transaction date for display in "DD Mon, YYYY" format
 * e.g., "12 Jan, 2026"
 */
export const formatTransactionDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date.split(',')[0]; // Fallback to old behavior
    }
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return date.split(',')[0]; // Fallback
  }
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
 * Map unified transaction type to TableTransaction type
 */
const mapUnifiedTypeToTableType = (
  tx: UnifiedTransaction,
  walletAddress: string
): TableTransaction['type'] => {
  if (tx.type === 'onramp') {
    return 'Deposit';
  }
  if (tx.type === 'offramp') {
    return 'Money Out';
  }
  // crypto_transfer - determine direction
  const isOutgoing =
    tx.source.identifier.toLowerCase() === walletAddress.toLowerCase();
  return isOutgoing ? 'Money Out' : 'Money In';
};

/**
 * Map unified transaction status to DrainState for compatibility with existing UI
 */
const mapUnifiedStatusToDrainState = (
  status: UnifiedTransactionStatus
): DrainState => {
  switch (status) {
    case 'completed':
      return 'payment_processed';
    case 'processing':
    case 'pending':
      return 'payment_submitted';
    case 'in_review':
      return 'in_review';
    case 'failed':
      return 'error';
    case 'refunded':
      return 'refunded';
    default:
      return 'payment_submitted';
  }
};

/**
 * Map unified transactions to TableTransaction format for display
 */
export const mapUnifiedTransactions = (
  transactions: UnifiedTransaction[],
  walletAddress: string
): TableTransaction[] => {
  return transactions.map((tx) => {
    const type = mapUnifiedTypeToTableType(tx, walletAddress);

    // Determine the "other party" to display in To/From column
    // Prefer label (name) over identifier (address/id)
    let account: string;

    if (type === 'Deposit') {
      // Onramp: Show who sent the money (source - bank sender)
      account = tx.source.label || tx.source.identifier;
    } else if (type === 'Money Out') {
      // Offramp or outgoing crypto: Show recipient
      account = tx.destination.label || tx.destination.identifier;
    } else {
      // Money In (incoming crypto): Show sender wallet
      account = tx.source.label || tx.source.identifier;
    }

    return {
      type,
      account,
      date: tx.date,
      amount: tx.amount,
      hash: tx.txHash ?? tx.id,
      status: mapUnifiedStatusToDrainState(tx.status),
    };
  });
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
