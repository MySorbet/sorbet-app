'use client';

import { useFundWallet } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { encodeFunctionData, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { getOverview } from '@/api/transactions';
import { TransactionsCard } from '@/app/wallet/components/transactions-card';
import { mapTransactionOverview } from '@/app/wallet/components/utils';
import { WalletSummaryCard } from '@/app/wallet/components/wallet-summary-card';
import { TOKEN_ABI } from '@/constant/abis';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';
import { Transaction, TransactionOverview } from '@/types/transactions';

import { SelectDuration } from './balance-card/select-duration';
import { WalletBalance } from './balance-card/wallet-balance';
import { MyAccounts } from './my-accounts';

export const WalletContainer = () => {
  const {
    data: usdcBalance,
    isPending: isBalanceLoading,
    refetch,
  } = useWalletBalance();
  const { client } = useSmartWallets();
  const { smartWalletAddress: walletAddress } = useSmartWalletAddress();

  const { fundWallet } = useFundWallet();

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedDuration, setSelectedDuration] = useState<string>('30');

  const [transactions, setTransactions] = useState<TransactionOverview>({
    money_in: [],
    money_out: [],
    transactions: [],
    total_money_in: '',
    total_money_out: '',
  });

  // TODO: Use useTransactionOverview hook instead
  const fetchTransactions = useCallback(
    async (last_days = 30) => {
      if (walletAddress) {
        setLoading(true);
        const response = await getOverview(walletAddress, last_days);
        if (response && response.data) {
          setTransactions(response.data);
        }
        setLoading(false);
      }
    },
    [walletAddress]
  );

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

  // DOES this work?
  useEffect(() => {
    (async () => {
      await fetchTransactions();
    })();
  }, [fetchTransactions, usdcBalance]);

  useEffect(() => {
    (async () => {
      fetchTransactions(parseInt(selectedDuration, 10));
    })();
  }, [fetchTransactions, selectedDuration]);

  const mappedTransactions =
    walletAddress && transactions
      ? mapTransactionOverview(transactions.transactions, walletAddress)
      : [];

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <div className='flex flex-col gap-6 lg:flex-row'>
        <div className='lg:w-8/12'>
          <WalletBalance
            balanceHistoryIn={
              !transactions.money_in
                ? undefined
                : transactions.money_in.map((transaction: Transaction) => ({
                    date: transaction.timestamp,
                    balance: transaction.value,
                  }))
            }
            balanceHistoryOut={
              !transactions.money_out
                ? undefined
                : transactions.money_out.map((transaction: Transaction) => ({
                    date: transaction.timestamp,
                    balance: transaction.value,
                  }))
            }
            usdcBalance={usdcBalance ?? ''}
            onTopUp={handleTopUp}
            sendUSDC={handleSendUSDC}
            isBalanceLoading={isBalanceLoading}
            isLoading={loading}
            selectedDuration={selectedDuration}
            onTxnDurationChange={setSelectedDuration}
          />
        </div>
        <div className='lg:w-4/12'>
          <MyAccounts
            usdcBalance={usdcBalance ?? ''}
            address={walletAddress}
            isLoading={loading}
          />
        </div>
      </div>
      <div className='mb-6 mt-12 flex justify-between'>
        <div className='text-2xl font-semibold'>Money Movements</div>
        <div>
          <SelectDuration
            selectedValue={selectedDuration}
            onChange={(value) => setSelectedDuration(value)}
          />
        </div>
      </div>
      <WalletSummaryCard
        label='Money In'
        value={Number(transactions.total_money_in)}
        // TODO: Remove Number() hack
        // TODO: subscript should be dynamic
        subscript='All time'
      />
      <WalletSummaryCard
        label='Money Out'
        value={Number(transactions.total_money_out)}
        // TODO: Remove Number() hack
        // TODO: subscript should be dynamic
        subscript='All time'
      />
      <TransactionsCard
        transactions={mappedTransactions}
        isLoading={loading}
        description='All time'
        // TODO: description should be dynamic
      />
    </div>
  );
};
