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
 * This is a shim which takes in transactions and returns a balance history to be rendered in the balance chart.
 *
 * This should be removed once the backend is updated to return the balance history directly.
 */
export const calculateBalanceHistory = (
  currentBalance: number,
  transactionsIn: Transaction[],
  transactionsOut: Transaction[]
): BalanceHistory => {
  // Combine the incoming and outgoing transactions
  const combinedHistory = [
    ...transactionsIn.map((transaction) => ({
      ...transaction,
      type: 'in',
      value: Number(transaction.value),
    })),
    ...transactionsOut.map((transaction) => ({
      ...transaction,
      type: 'out',
      value: -Number(transaction.value), // Negative for outgoing
    })),
  ];

  // If there are no transactions, return just the current balance
  if (combinedHistory.length === 0) {
    return [
      {
        iso: new Date().toISOString(),
        balance: currentBalance,
      },
    ];
  }

  // Sort combined history by date (newest first)
  combinedHistory.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Start with current balance and work backwards
  let runningBalance = currentBalance;
  const history: BalanceHistory = [
    {
      iso: new Date().toISOString(),
      balance: currentBalance,
    },
  ];

  // Add each transaction to the history, working backwards
  combinedHistory.forEach((transaction) => {
    // Reverse the transaction effect (add what was sent, subtract what was received)
    runningBalance -= transaction.value;
    history.push({
      iso: new Date(transaction.timestamp).toISOString(),
      balance: runningBalance,
    });
  });

  // Reverse the array to get chronological order (oldest first)
  return history.reverse();
};
