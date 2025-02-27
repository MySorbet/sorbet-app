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

/**
 * @deprecated
 * Function taken from the `useCombinedBalance` hook
 * Essentially a rube goldberg machine to calculate the balance of the wallet over time and the percent change over time
 *
 * This logic should be corrected and live in the backend
 */
export const combineBalance = (
  usdcBalance: string,
  balanceHistoryIn?: Transaction[],
  balanceHistoryOut?: Transaction[]
) => {
  let cumulativeBalanceHistory: { iso: string; balance: number }[] = [];
  let percentChange = 0;

  // Combine the incoming and outgoing transactions
  const combinedHistory = [
    ...(balanceHistoryIn || []).map((transaction) => ({
      ...transaction,
      type: 'in',
      balance: parseFloat(transaction.value),
    })),
    ...(balanceHistoryOut || []).map((transaction) => ({
      ...transaction,
      type: 'out',
      balance: -parseFloat(transaction.value), // Negative for outgoing
    })),
  ];

  // Sort combined history by date
  combinedHistory.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Initialize with the original balance
  let currentBalance = parseFloat(usdcBalance);
  if (combinedHistory.length !== 0) {
    const newCumulativeHistory = [
      { iso: new Date().toISOString(), balance: currentBalance }, // Starting point (initial balance)
      ...combinedHistory.map((transaction) => {
        currentBalance += transaction.balance; // Update balance with each transaction
        return {
          iso: new Date(transaction.timestamp).toISOString(),
          balance: currentBalance,
        };
      }),
    ];

    // Set the cumulative balance history
    cumulativeBalanceHistory = newCumulativeHistory;
  } else {
    cumulativeBalanceHistory = [];
  }

  // Calculate percent change for the balance widget
  const totalMoneyIn =
    balanceHistoryIn?.reduce(
      (acc, transaction) => acc + parseFloat(transaction.value),
      0
    ) || 0;

  const totalMoneyOut =
    balanceHistoryOut?.reduce(
      (acc, transaction) => acc + parseFloat(transaction.value),
      0
    ) || 0;

  const originalBalance =
    parseFloat(usdcBalance) + totalMoneyOut - totalMoneyIn;

  if (originalBalance > 0) {
    const change =
      ((parseFloat(usdcBalance) - originalBalance) / originalBalance) * 100;
    percentChange = change;
  }

  return {
    percentChange,
    cumulativeBalanceHistory,
  };
};
