'use client';

import { useState } from 'react';

import { BalanceCard } from '@/app/wallet/components/balance-card/balance-card';
import { combineBalance } from '@/app/wallet/components/balance-card/combine-balance';
import { TransactionsCard } from '@/app/wallet/components/transactions-card';
import { mapTransactionOverview } from '@/app/wallet/components/utils';
import { WalletSummaryCard } from '@/app/wallet/components/wallet-summary-card';
import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { type Duration, displayDuration } from './balance-card/select-duration';
import { MyAccounts } from './my-accounts';

/** Layout all the wallet page components */
export const WalletDashboard = () => {
  const { data: usdcBalance, isPending: isBalanceLoading } = useWalletBalance();

  const {
    smartWalletAddress: walletAddress,
    isLoading: isWalletAddressLoading,
  } = useSmartWalletAddress();

  const [duration, setDuration] = useState<Duration>('30');

  const { data: transactions, isLoading: isTransactionsLoading } =
    useTransactionOverview(duration === 'all' ? undefined : parseInt(duration));

  const mappedTransactions =
    walletAddress && transactions
      ? mapTransactionOverview(transactions.transactions, walletAddress)
      : [];

  const { cumulativeBalanceHistory } = combineBalance(
    usdcBalance ?? '',
    transactions?.money_in,
    transactions?.money_out
  );

  return (
    <div className='@container size-full max-w-7xl'>
      {/* Grid container for responsive layout */}
      <div className='@xl:grid-cols-[1fr_350px] grid grid-cols-1 gap-6'>
        {/* Balance Card - First on mobile, left column on desktop */}
        <div className='@xl:col-start-1 @xl:row-start-1'>
          <BalanceCard
            balance={Number(usdcBalance ?? 0)}
            history={cumulativeBalanceHistory}
            duration={duration}
            onDurationChange={setDuration}
            // isLoading={isBalanceLoading || isTransactionsLoading}
          />
        </div>

        {/* My Accounts - Second on mobile, right column on desktop */}
        <div className='@xl:col-start-2 @xl:row-span-2 @xl:row-start-1'>
          <MyAccounts
            usdcBalance={usdcBalance ?? ''}
            address={walletAddress}
            isLoading={isWalletAddressLoading}
          />
        </div>

        {/* Summary Cards and Transactions - Third on mobile, bottom of left column on desktop */}
        <div className='@xl:col-start-1 @xl:row-start-2 space-y-6'>
          <div className='@xl:flex-row flex flex-col justify-between gap-4'>
            <WalletSummaryCard
              label='Money In'
              value={Number(transactions?.total_money_in ?? 0)}
              isLoading={isTransactionsLoading}
              // TODO: Remove Number() hack
              subscript={displayDuration[duration]}
            />
            <WalletSummaryCard
              label='Money Out'
              value={Number(transactions?.total_money_out ?? 0)}
              isLoading={isTransactionsLoading}
              // TODO: Remove Number() hack
              subscript={displayDuration[duration]}
            />
          </div>
          <TransactionsCard
            transactions={mappedTransactions}
            isLoading={isTransactionsLoading}
            description={displayDuration[duration]}
          />
        </div>
      </div>
    </div>
  );
};
