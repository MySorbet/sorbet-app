import { useEffect, useState } from 'react';

/** Calculates the balance of the wallet across recorded transactions and the percent change over time*/
export const useCombinedBalance = (
  usdcBalance: string,
  balanceHistoryIn: { date: string; balance: string }[] | undefined,
  balanceHistoryOut: { date: string; balance: string }[] | undefined
) => {
  const [percentChange, setPercentChange] = useState<number>(0);
  const [cumulativeBalanceHistory, setCumulativeBalanceHistory] = useState<
    { date: string; balance: number }[]
  >([]);

  useEffect(() => {
    // Combine the incoming and outgoing transactions
    const combinedHistory = [
      ...(balanceHistoryIn || []).map((transaction) => ({
        ...transaction,
        type: 'in',
        balance: parseFloat(transaction.balance),
      })),
      ...(balanceHistoryOut || []).map((transaction) => ({
        ...transaction,
        type: 'out',
        balance: -parseFloat(transaction.balance), // Negative for outgoing
      })),
    ];

    // Sort combined history by date
    combinedHistory.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Initialize with the original balance
    let currentBalance = parseFloat(usdcBalance);
    if (combinedHistory.length !== 0) {
      const newCumulativeHistory = [
        { date: 'Initial', balance: currentBalance }, // Starting point (initial balance)
        ...combinedHistory.map((transaction) => {
          currentBalance += transaction.balance; // Update balance with each transaction
          return { date: transaction.date, balance: currentBalance };
        }),
      ];

      // Set the cumulative balance history
      setCumulativeBalanceHistory(newCumulativeHistory);
    } else {
      setCumulativeBalanceHistory([]);
    }

    // Calculate percent change for the balance widget
    const totalMoneyIn =
      balanceHistoryIn?.reduce(
        (acc, transaction) => acc + parseFloat(transaction.balance),
        0
      ) || 0;

    const totalMoneyOut =
      balanceHistoryOut?.reduce(
        (acc, transaction) => acc + parseFloat(transaction.balance),
        0
      ) || 0;

    const originalBalance =
      parseFloat(usdcBalance) + totalMoneyOut - totalMoneyIn;

    if (originalBalance > 0) {
      const change =
        ((parseFloat(usdcBalance) - originalBalance) / originalBalance) * 100;
      setPercentChange(change);
    }
  }, [usdcBalance, balanceHistoryIn, balanceHistoryOut]);

  return {
    percentChange,
    cumulativeBalanceHistory,
  };
};
