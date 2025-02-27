'use client';

import { useFundWallet } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useState } from 'react';
import { toast } from 'sonner';
import { encodeFunctionData, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { BalanceCard } from '@/app/wallet/components/balance-card/balance-card';
import { combineBalance } from '@/app/wallet/components/balance-card/combine-balance';
import { TransactionsCard } from '@/app/wallet/components/transactions-card';
import { mapTransactionOverview } from '@/app/wallet/components/utils';
import { WalletSummaryCard } from '@/app/wallet/components/wallet-summary-card';
import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { TOKEN_ABI } from '@/constant/abis';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';

import { type Duration, displayDuration } from './balance-card/select-duration';
import { MyAccounts } from './my-accounts';

export const WalletContainer = () => {
  const {
    data: usdcBalance,
    isPending: isBalanceLoading,
    refetch,
  } = useWalletBalance();
  const { client } = useSmartWallets();
  const {
    smartWalletAddress: walletAddress,
    isLoading: isWalletAddressLoading,
  } = useSmartWalletAddress();
  const { fundWallet } = useFundWallet();

  const [duration, setDuration] = useState<Duration>('30');

  // TODO: does this refetch if duration changes?
  const { data: transactions, isLoading: isTransactionsLoading } =
    useTransactionOverview(duration === 'all' ? undefined : parseInt(duration));

  const handleTopUp = async () => {
    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    try {
      const defaultFundAmount = '1.00';
      if (walletAddress) {
        await fundWallet(walletAddress, {
          chain,
          amount: defaultFundAmount,
          asset: 'USDC',
        });
      }

      refetch();
    } catch (e) {
      toast('Something went wrong', {
        description:
          'Your Privy wallet has something problem. Please try again',
      });
    }
  };

  const handleSendUSDC = async (
    amount: string,
    recipientWalletAddress: string
  ) => {
    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    if (client) {
      await client.switchChain({
        id: chain.id,
      });

      // Transfer transaction
      const transferData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientWalletAddress, parseUnits(amount.toString(), 6)],
      });

      const transferTransactionHash = await client.sendTransaction({
        account: client.account,
        to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS as `0x${string}`,
        data: transferData,
      });

      refetch();

      return transferTransactionHash;
    }
  };

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
