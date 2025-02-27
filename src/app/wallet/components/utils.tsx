import { TableTransaction } from '@/app/wallet/components/transaction-table';
import { env } from '@/lib/env';
import { Transaction } from '@/types/transactions';

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
  }));
};

/** Open a transaction hash in the appropriate explorer (basescan) */
export const openTransactionInExplorer = (hash: string) => {
  // TODO: Should we use the explorer from one of our libs rather than env?
  window.open(`${env.NEXT_PUBLIC_BASE_EXPLORER}/tx/${hash}`, '_blank');
};
