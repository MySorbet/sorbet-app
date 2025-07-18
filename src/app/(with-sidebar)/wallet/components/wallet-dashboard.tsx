'use client';

import { useState } from 'react';

import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useTransactionOverview } from '../hooks/use-transaction-overview';
import { BalanceCard } from './balance-card/balance-card';
import { type Duration, displayDuration } from './balance-card/select-duration';
import { calculateBalanceHistory } from './balance-card/util';
import { MyAccounts } from './my-accounts/my-accounts';
import { TransactionsCard } from './transactions-card';
import { mapTransactionOverview } from './utils';
import { WalletSummaryCard } from './wallet-summary-card';

/** Layout all the wallet page components */
export const WalletDashboard = () => {
  const { data: usdcBalance, isPending: isBalanceLoading } = useWalletBalance();
  const { smartWalletAddress: walletAddress } = useSmartWalletAddress();

  const [duration, setDuration] = useState<Duration>('30');
  const { data: transactions, isLoading: isTransactionsLoading } =
    useTransactionOverview(parseInt(duration));

  const tableTransactions =
    walletAddress && transactions
      ? mapTransactionOverview(transactions.transactions, walletAddress)
      : [];

  // TODO: Remove Number() hack. Figure out the contract with the backend. number or string?
  const totalMoneyIn = Number(transactions?.total_money_in ?? 0);
  const totalMoneyOut = Number(transactions?.total_money_out ?? 0);

  const cumulativeBalanceHistory = calculateBalanceHistory(
    Number(usdcBalance ?? 0),
    transactions?.money_in ?? [],
    transactions?.money_out ?? []
  );

  return (
    <div className='@container size-full max-w-7xl'>
      {/* Grid container for responsive layout */}
      <div className='@4xl:grid-cols-[1fr_28rem] grid grid-cols-1 gap-6'>
        {/* Balance Card - First on mobile, left column on desktop */}
        <div className='@4xl:col-start-1 @4xl:row-start-1'>
          <BalanceCard
            balance={Number(usdcBalance ?? 0)}
            history={cumulativeBalanceHistory}
            duration={duration}
            onDurationChange={setDuration}
            isLoading={isBalanceLoading || isTransactionsLoading}
          />
        </div>

        {/* My Accounts - Second on mobile, right column on desktop */}
        <div className='@4xl:col-start-2 @4xl:row-span-2 @4xl:row-start-1'>
          <MyAccounts />
        </div>

        {/* Summary Cards and Transactions - Third on mobile, bottom of left column on desktop */}
        <div className='@4xl:col-start-1 @4xl:row-start-2 space-y-6'>
          <div className='@4xl:flex-row flex flex-col justify-between gap-4'>
            <WalletSummaryCard
              label='Money In'
              value={totalMoneyIn}
              isLoading={isTransactionsLoading}
              subscript={displayDuration[duration]}
            />
            <WalletSummaryCard
              label='Money Out'
              value={totalMoneyOut}
              isLoading={isTransactionsLoading}
              subscript={displayDuration[duration]}
            />
          </div>
          <TransactionsCard
            transactions={tableTransactions}
            isLoading={isTransactionsLoading}
            description={displayDuration[duration]}
          />
        </div>
      </div>
    </div>
  );
};
