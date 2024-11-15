'use client';

import { useFundWallet } from '@privy-io/react-auth';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { encodeFunctionData, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';

import { getOverview } from '@/api/transactions';
import Authenticated from '@/app/authenticated';
import TransactionsTable from '@/app/wallet/all/transactions-table';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Header } from '@/components/header';
import { TOKEN_ABI } from '@/constant/abis';
import { useSmartWalletAddress, useWalletBalances } from '@/hooks';
import { env } from '@/lib/env';
import { Transaction, Transactions } from '@/types/transactions';

export const WalletContainer = () => {
  const [reload, setReload] = useState(false);
  const { client } = useSmartWallets();
  const { smartWalletAddress: walletAddress } = useSmartWalletAddress();
  const { usdcBalance, loading: balanceLoading } = useWalletBalances(
    walletAddress,
    reload
  );

  const { fundWallet } = useFundWallet();

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedDuration, setSelectedDuration] = useState<string>('30');

  const [transactions, setTransactions] = useState<Transactions>({
    money_in: [],
    money_out: [],
    transactions: [],
    total_money_in: '',
    total_money_out: '',
  });

  const fetchTransactions = useCallback(
    async (last_days = 30) => {
      if (walletAddress) {
        setLoading(true);
        const response = await getOverview(walletAddress, last_days);
        if (response && response.data) {
          setTransactions(response.data.transactions);
        }
        setLoading(false);
      }
    },
    [walletAddress]
  );

  const handleTopUp = async () => {
    try {
      const defaultFundAmount = '1.00';
      if (walletAddress) {
        await fundWallet(walletAddress, {
          chain: baseSepolia,
          amount: defaultFundAmount,
          asset: 'USDC',
        });
        setReload(!reload); // trigger reload to refresh wallet amount
      }
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
    if (client) {
      await client.switchChain({
        id: baseSepolia.id,
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

      setReload(!reload);
      return transferTransactionHash;
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTransactions();
    })();
  }, [walletAddress, reload, fetchTransactions]);

  useEffect(() => {
    (async () => {
      fetchTransactions(parseInt(selectedDuration, 10));
    })();
  }, [selectedDuration, fetchTransactions]);

  return (
    <Authenticated>
      <Header />
      <div className='container my-16 pb-8'>
        <div className='flex flex-col items-center justify-center gap-6 lg:flex-row'>
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
              usdcBalance={usdcBalance}
              onTopUp={handleTopUp}
              sendUSDC={handleSendUSDC}
              isBalanceLoading={balanceLoading}
              selectedDuration={selectedDuration}
              onTxnDurationChange={setSelectedDuration}
            />
          </div>
          {/** 
          // commenting out until cards implemented
          <div className='lg:w-4/12'>
            <CreditCardForm />
          </div> 
           */}
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
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='lg:w-1/2'>
            <FundsFlow
              isLoading={loading}
              title='Money In'
              balance={transactions.total_money_in}
              icon={<ArrowDown size={14} color='white' />}
              items={
                !transactions.money_in
                  ? undefined
                  : transactions.money_in.map((transaction: Transaction) => {
                      // check if this is a user adding funds to their account
                      const isAdded =
                        transaction.sender.toLowerCase() ===
                        walletAddress?.toLowerCase();
                      return {
                        icon: isAdded ? (
                          <Plus size={24} color='white' />
                        ) : (
                          <ArrowDown size={24} color='white' />
                        ),
                        label: isAdded ? 'Added' : 'Received',
                        account: transaction.sender,
                        balance: transaction.value,
                      };
                    })
              }
            />
          </div>
          <div className='lg:w-1/2'>
            <FundsFlow
              isLoading={loading}
              title='Money Out'
              balance={transactions.total_money_out}
              icon={<ArrowUp size={14} color='white' />}
              items={
                !transactions.money_out
                  ? undefined
                  : transactions.money_out.map((transaction: Transaction) => ({
                      icon: <ArrowUp size={24} color='white' />,
                      label: 'Sent',
                      account: transaction.receiver,
                      balance: transaction.value,
                    }))
              }
            />
          </div>
        </div>
        <div className='mt-12 flex flex-col'>
          <div className='mb-6 flex items-center'>
            <div className='text-2xl font-semibold'>Recent Transactions</div>
            <Link href='/wallet/all'>
              <div className='text-sorbet ml-4 cursor-pointer text-right text-sm font-semibold'>
                View all
              </div>
            </Link>
          </div>
          {walletAddress && (
            <TransactionsTable
              isLoading={loading}
              minimalMode
              transactions={
                !transactions.transactions
                  ? []
                  : transactions.transactions.map(
                      (transaction: Transaction) => ({
                        type:
                          transaction.sender.toLowerCase() ===
                          walletAddress.toLowerCase()
                            ? 'Sent'
                            : 'Received',
                        account:
                          transaction.sender.toLowerCase() ===
                          walletAddress.toLowerCase()
                            ? transaction.receiver
                            : transaction.sender,
                        date: transaction.timestamp,
                        amount: transaction.value,
                        hash: transaction.hash,
                      })
                    )
              }
            />
          )}
        </div>
      </div>
    </Authenticated>
  );
};
