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

export const WalletContainer = () => {
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
    <div className='mx-auto w-full max-w-7xl'>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <div className='lg:w-8/12'>
          <BalanceCard
            balance={Number(usdcBalance ?? 0)}
            history={cumulativeBalanceHistory}
            duration={duration}
            onDurationChange={setDuration}
            // isLoading={isBalanceLoading || isTransactionsLoading}
          />
        </div>
        <div className='lg:w-4/12'>
          <MyAccounts
            usdcBalance={usdcBalance ?? ''}
            address={walletAddress}
            isLoading={isWalletAddressLoading}
          />
        </div>
      </div>

      <div className='flex justify-between'>
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
  );
};
