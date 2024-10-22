'use client';

import {
  ConnectedWallet,
  getEmbeddedConnectedWallet,
  useFundWallet,
  useWallets,
} from '@privy-io/react-auth';
import { MoveDown, MoveUp } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { encodeFunctionData, formatUnits, hexToBigInt, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { getOverview } from '@/api/transactions';
import Authenticated from '@/app/authenticated';
import TransactionsTable from '@/app/wallet/all/transactions-table';
import { CreditCardForm } from '@/app/wallet/credit-card';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Header } from '@/components/header';
import { useToast } from '@/components/ui/use-toast';
import { TOKEN_ABI } from '@/constant/abis';
import { useEmbeddedWalletAddress, useWalletBalances } from '@/hooks';
import { env } from '@/lib/env';
import { Transaction, Transactions } from '@/types/transactions';

export const WalletContainer = () => {
  const { toast } = useToast();
  const { wallets } = useWallets();
  const walletAddress = useEmbeddedWalletAddress();
  const {
    ethBalance,
    usdcBalance,
    loading: balanceLoading,
  } = useWalletBalances(walletAddress ?? '');

  const { fundWallet } = useFundWallet();

  // TODO: Move transactions to base
  const [transactions, setTransactions] = useState<Transactions>({
    money_in: [],
    money_out: [],
    transactions: [],
    total_money_in: '',
    total_money_out: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async (last_days = 30) => {
    if (walletAddress) {
      setLoading(true);
      const response = await getOverview(walletAddress, last_days);
      if (response && response.data) {
        setTransactions(response.data.transactions);
      }
      setLoading(false);
    }
  };
  const handleTxnDurationChange = (value: string) => {
    const last_days = parseInt(value, 10);
    fetchTransactions(last_days);
  };

  const handleTopUp = async () => {
    try {
      const defaultFundAmount = '0.01';
      if (walletAddress) {
        await fundWallet(walletAddress, {
          chain: baseSepolia,
          amount: defaultFundAmount,
          asset: 'USDC',
        });
      }
    } catch (e) {
      toast({
        title: 'Something went wrong',
        description:
          'Your Privy wallet has something problem. Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleSendUSDC = async () => {
    try {
      const amount = 0.1;
      const receiverAddress = '0x1fCe61e4adF6A071FB345F5a5f9FF8ddaC12f7f1';
      const wallet = getEmbeddedConnectedWallet(wallets);
      if (wallet) {
        const provider = await wallet.getEthereumProvider();
        console.log('current user wallet', wallet);
        const balanceOfData = encodeFunctionData({
          abi: TOKEN_ABI,
          functionName: 'balanceOf',
          args: [wallet.address],
        });

        const balanceResult = await provider.request({
          method: 'eth_call',
          params: [
            {
              to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
              data: balanceOfData,
            },
          ],
        });

        if (hexToBigInt(balanceResult) < parseUnits(amount.toString(), 6)) {
          toast({
            title: 'Insufficient balance',
            description: `You need at least ${amount} USDC to perform this action. Only ${formatUnits(
              hexToBigInt(balanceResult),
              6
            )} USDC was detected`,
          });
          return;
        }

        const transactionHash = await sendTransaction(
          wallet,
          env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
          TOKEN_ABI,
          'transfer',
          [receiverAddress, parseUnits(amount.toString(), 6)]
        );

        console.log('transactionHash', transactionHash);

        toast({
          title: 'Transaction Successful',
          description: 'Funds withdrawn successfully ',
        });
        
        return transactionHash
      }
    } catch (e) {
      toast({
        title: 'Something went wrong',
        description:
          'Your Privy wallet has something problem. Please try again',
        variant: 'destructive',
      });
    }
  };

  async function sendTransaction(
    wallet: ConnectedWallet,
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[]
  ): Promise<`0x${string}`> {
    const provider = await wallet.getEthereumProvider();
    // Encode the function data
    const data = encodeFunctionData({
      abi: abi,
      functionName: functionName,
      args: args,
    });

    // Create the transaction request
    const transactionRequest = {
      from: wallet.address as `0x${string}`,
      to: contractAddress as `0x${string}`,
      data: data,
      value: '0x0' as `0x${string}`,
    };

    try {
      // Send the transaction
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionRequest],
      });

      return transactionHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  useEffect(() => {
    (async () => {
      await fetchTransactions();
    })();
  }, [walletAddress]);

  return (
    <Authenticated>
      <Header />
      <div className='container my-16'>
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='lg:w-8/12'>
            <WalletBalance
              ethBalance={ethBalance}
              usdcBalance={usdcBalance}
              onTopUp={handleTopUp}
              onSend={handleSendUSDC}
            />
          </div>
          <div className='lg:w-4/12'>
            <CreditCardForm />
          </div>
        </div>
        <div className='mb-6 mt-12 flex justify-between'>
          <div className='text-2xl font-semibold'>Money Movements</div>
          <div>
            <SelectDuration
              selectedValue='30'
              onChange={handleTxnDurationChange}
            />
          </div>
        </div>
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='lg:w-1/2'>
            <FundsFlow
              isLoading={loading}
              title='Money In'
              balance={transactions.total_money_in}
              icon={<MoveDown size={16} />}
              items={
                !transactions.money_in
                  ? undefined
                  : transactions.money_in.map((transaction: Transaction) => ({
                      icon: <MoveDown size={20} />,
                      label: 'Received',
                      account: transaction.sender,
                      balance: transaction.value,
                    }))
              }
            />
          </div>
          <div className='lg:w-1/2'>
            <FundsFlow
              isLoading={loading}
              title='Money Out'
              balance={transactions.total_money_out}
              icon={<MoveUp size={16} />}
              items={
                !transactions.money_out
                  ? undefined
                  : transactions.money_out.map((transaction: Transaction) => ({
                      icon: <MoveUp size={16} />,
                      label: 'Sent',
                      account: transaction.receiver,
                      balance: transaction.value,
                    }))
              }
            />
          </div>
        </div>
        <div className='mt-12 flex flex-col'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='text-2xl font-semibold'>Recent Transactions</div>
            <Link href='/wallet/all'>
              <div className='text-sorbet cursor-pointer text-right text-sm font-semibold'>
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
