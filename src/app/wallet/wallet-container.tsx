'use client';

import { getOverview } from '@/api/user';
import Container from '@/app/container';
import { CreditCardForm } from '@/app/wallet/credit-card';
import { FundsFlow } from '@/app/wallet/funds-flow';
import { RecentTransactions } from '@/app/wallet/recent-transactions';
import { SelectDuration } from '@/app/wallet/select-duration';
import { WalletBalance } from '@/app/wallet/wallet-balance';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { Balances, Transaction, Transactions } from '@/types/transactions';
import { MoveDown, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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

  const fetchTransactions = async (last_days: number = 30) => {
    if (user) {
      setLoading(true);
      const response = await getOverview(last_days);
      if (response.status === 'success') {
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
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='lg:w-8/12'>
            <WalletBalance
              balance={(balances.usdc + balances.nearUsd).toLocaleString()}
            />
          </div>
          <div className='lg:w-4/12'>
            <CreditCardForm />
          </div>
        </div>
        <div className='flex justify-between mt-12 mb-6'>
          <div className='text-2xl font-semibold'>Money Movements</div>
          <div>
            <SelectDuration
              selectedValue='30'
              onChange={handleTxnDurationChange}
            />
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-6'>
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
        <div className='flex flex-col mt-12'>
          <div className='flex justify-between items-center mb-6'>
            <div className='text-2xl font-semibold'>Recent Transactions</div>
            <Link href='/wallet/all'>
              <div className='text-right font-semibold text-sm cursor-pointer text-sorbet'>
                View all
              </div>
            </Link>
          </div>
          <RecentTransactions
            isLoading={loading}
            transactions={
              !transactions.transactions
                ? undefined
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
