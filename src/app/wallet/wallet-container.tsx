'use client';

import { MoveDown, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { getOverview } from '@/api/user';
import Container from '@/app/container';
import TransactionsTable from '@/app/wallet/all/transactions-table';
import { CreditCardForm } from '@/app/wallet/credit-card';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { Balances, Transaction, Transactions } from '@/types/transactions';

export const WalletContainer = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);
  const [transactions, setTransactions] = useState<Transactions>({
    money_in: [],
    money_out: [],
    transactions: [],
    total_money_in: '',
    total_money_out: '',
  });
  const [balances, setBalances] = useState<Balances>({
    usdc: 0,
    near: 0,
    nearUsd: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async (last_days = 30) => {
    if (user) {
      setLoading(true);
      const response = await getOverview(last_days);
      if (response && response.data) {
        setTransactions(response.data.transactions);
        setBalances(response.data.balances);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const handleTxnDurationChange = (value: string) => {
    const last_days = parseInt(value, 10);
    fetchTransactions(last_days);
  };

  return (
    <Container>
      <Header />
      {user && <Sidebar show={toggleOpenSidebar} userInfo={user} />}
      <div className='container my-16'>
        <div className='flex flex-col gap-6 lg:flex-row'>
          <div className='lg:w-8/12'>
            <WalletBalance
              balance={(balances.usdc + balances.nearUsd).toLocaleString()}
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
              icon={<Send size={16} />}
              items={
                !transactions.money_out
                  ? undefined
                  : transactions.money_out.map((transaction: Transaction) => ({
                      icon: <Send size={16} />,
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
                      transaction.sender === user?.accountId
                        ? 'Sent'
                        : 'Received',
                    account:
                      transaction.sender === user?.accountId
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
    </Container>
  );
};
