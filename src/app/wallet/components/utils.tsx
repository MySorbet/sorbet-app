import { TableTransaction } from '@/app/wallet/components/transaction-table';
import { env } from '@/lib/env';
import { Transaction } from '@/types/transactions';

export const formatWalletAddress = (account: string): string => {
  return `${account.slice(0, 5)}...${account.slice(-5)}`;
};

// TODO: Merge this with the one in @/lib/currency.ts?
export const formatCurrency = (currency: string): string => {
  return Number(currency).toLocaleString();
};

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
