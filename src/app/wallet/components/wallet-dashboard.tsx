'use client';

import { useState } from 'react';

import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

import { useTransactionOverview } from '../hooks/use-transaction-overview';
import { BalanceCard } from './balance-card/balance-card';
import { type Duration, displayDuration } from './balance-card/select-duration';
import { combineBalance } from './balance-card/util';
import { DeprecatedMyAccounts } from './deprecated-my-accounts';
import { TransactionsCard } from './transactions-card';
import { mapTransactionOverview } from './utils';
import { WalletSummaryCard } from './wallet-summary-card';

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

  const tableTransactions =
    walletAddress && transactions
      ? mapTransactionOverview(transactions.transactions, walletAddress)
      : [];

  // TODO: Remove Number() hack. Figure out the contract with the backend. number or string?
  const totalMoneyIn = Number(transactions?.total_money_in ?? 0);
  const totalMoneyOut = Number(transactions?.total_money_out ?? 0);

  // TODO: Make this calculate correctly
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
            isLoading={isBalanceLoading || isTransactionsLoading}
          />
        </div>

        {/* My Accounts - Second on mobile, right column on desktop */}
        <div className='@xl:col-start-2 @xl:row-span-2 @xl:row-start-1'>
          <DeprecatedMyAccounts
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
