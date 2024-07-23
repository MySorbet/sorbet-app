'use client';

import TransactionsTable, { TableTransaction } from './transactions-table';
import { getTransactions } from '@/api/user';
import Container from '@/app/container';
import { Sidebar } from '@/components';
import { PageTitle } from '@/components/common';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { Transaction } from '@/types/transactions';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export const TransactionsBrowser: React.FC = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string>('');
  const [transactionsData, setTransactionsData] = useState<TableTransaction[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    TableTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);

  const handleClearAll = () => {
    setDateRange(undefined);
    setSearchValue('');
    setCurrentPage(1);
    fetchTransactions();
  };

  const fetchTransactions = async (
    after_date?: string,
    before_date?: string
  ) => {
    setIsLoading(true);
    const res = await getTransactions(
      currentPage,
      10,
      'desc',
      after_date,
      before_date
    );
    if (res.status === 'success') {
      const formattedTransactions = res.data.transactions.map(
        (transaction: Transaction) => {
          const type =
            transaction.sender !== transaction.receiver
              ? transaction.sender === user?.accountId
                ? 'Sent'
                : 'Received'
              : 'Self-transfer';
          const account =
            transaction.sender !== transaction.receiver
              ? transaction.sender === user?.accountId
                ? transaction.receiver
                : transaction.sender
              : user?.accountId;
          return {
            account,
            date: transaction.timestamp,
            amount: transaction.value,
            hash: transaction.hash,
            type,
          };
        }
      );
      setTransactionsData(formattedTransactions);
      setFilteredTransactions(formattedTransactions);
      setHasNextPage(res.data.transactions.length === 10);
      setHasPrevPage(currentPage > 1);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const after_date = format(dateRange.from, 'yyyy-MM-dd');
      const before_date = format(dateRange.to, 'yyyy-MM-dd');
      fetchTransactions(after_date, before_date);
    }
  }, [dateRange]);

  useEffect(() => {
    const filtered = transactionsData.filter((transaction) =>
      transaction.account.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchValue, transactionsData]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Container>
      <Header />
      <PageTitle title='Transactions' />
      {user && (
        <>
          <Sidebar show={toggleOpenSidebar} userInfo={user} />
          <div className='container my-16'>
            <div className='mb-6 text-sorbet'>
              <Link
                href='/wallet'
                className='flex gap-1 items-center font-semibold'
              >
                <MoveLeft size={20} />
                Go Back
              </Link>
            </div>
            <div className='flex justify-between items-center mb-6'>
              <div className='text-2xl font-medium'> All Transactions</div>
              <div className='flex flex-row gap-4'>
                <div
                  className={`cursor-pointer flex justify-center items-center rounded-full bg-white w-12 h-12 p-1 ${
                    !hasPrevPage && 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={handlePrevPage}
                >
                  <ChevronLeft size={20} />
                </div>
                <div
                  className={`cursor-pointer flex justify-center items-center rounded-full bg-white w-12 h-12 p-1 ${
                    !hasNextPage && 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={handleNextPage}
                >
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
            <TransactionsTable
              transactions={filteredTransactions}
              searchValue={searchValue}
              dateRange={dateRange}
              isLoading={isLoading}
              onSearchChange={setSearchValue}
              onDateRangeChange={setDateRange}
              onClearAll={handleClearAll}
            />
          </div>
        </>
      )}
    </Container>
  );
};
