import { Transaction } from '@/types/transactions';

/** Calculates the balance of the wallet across recorded transactions and the percent change over time*/
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
