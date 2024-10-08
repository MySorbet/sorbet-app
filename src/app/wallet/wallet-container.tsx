'use client';

import { MoveDown, MoveUp } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { getOverview } from '@/api/transactions';
import Authenticated from '@/app/authenticated';
import TransactionsTable from '@/app/wallet/all/transactions-table';
import { CreditCardForm } from '@/app/wallet/credit-card';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Header } from '@/components/header';
import { useEmbeddedWalletAddress, useWalletBalances } from '@/hooks';
import { Transaction, Transactions } from '@/types/transactions';

export const WalletContainer = () => {
  const walletAddress = useEmbeddedWalletAddress();
  const {
    ethBalance,
    usdcBalance,
    loading: balanceLoading,
  } = useWalletBalances(walletAddress ?? '');

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
            <WalletBalance ethBalance={ethBalance} usdcBalance={usdcBalance} />
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
          <TransactionsTable
            isLoading={loading}
            minimalMode
            transactions={
              !transactions.transactions
                ? []
                : transactions.transactions.map((transaction: Transaction) => ({
                    type:
                      transaction.sender === walletAddress
                        ? 'Sent'
                        : 'Received',
                    account:
                      transaction.sender === walletAddress
                        ? transaction.receiver
                        : transaction.sender,
                    date: transaction.timestamp,
                    amount: transaction.value,
                    hash: transaction.hash,
                  }))
            }
          />
        </div>
      </div>
    </Authenticated>
  );
};
