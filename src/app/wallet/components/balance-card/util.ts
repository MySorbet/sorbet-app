import { Transaction } from '@/types/transactions';

import { BalanceHistory } from './balance-chart';

/**
 * Map transactions to a balance history taking care of two crucial pieces.
 * 1. We convert the unfortunate locale timestamp given by the server to a ISO string (which could even be wrong)
 * 2. We convert the value to a number with a simple `Number()` call
 */
export const mapTransactionsToBalanceHistory = (
  transactions: Transaction[]
): BalanceHistory => {
  const history = transactions.map((transaction) => ({
    iso: new Date(transaction.timestamp).toISOString(),
    balance: Number(transaction.value),
  }));

  // TODO: Make sure these are sorted by date

  return history;
};

// TODO for all time
// const groupByMonth = (history: BalanceHistory) => {
//   return history.reduce((acc, curr) => {
//     const month = curr.iso.getMonth();
//   }, {});
// };
