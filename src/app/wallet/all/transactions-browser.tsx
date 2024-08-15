'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { getTransactions } from '@/api/user';
import Container from '@/app/container';
import { PageTitle } from '@/components/common';
import { Header } from '@/components/header';
import { useAuth } from '@/hooks';
import { Transaction } from '@/types/transactions';

import TransactionsTable, { TableTransaction } from './transactions-table';

export const TransactionsBrowser: React.FC = () => {
  const { user } = useAuth();
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
    if (res.status === 200 && res.data) {
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
        <div className='container my-16'>
          <div className='text-sorbet mb-6'>
            <Link
              href='/wallet'
              className='flex items-center gap-1 font-semibold'
            >
              <MoveLeft size={20} />
              Go Back
            </Link>
          </div>
          <div className='mb-6 flex items-center justify-between'>
            <div className='text-2xl font-medium'> All Transactions</div>
            <div className='flex flex-row gap-4'>
              <div
                className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-1 ${
                  !hasPrevPage && 'cursor-not-allowed opacity-50'
                }`}
                onClick={handlePrevPage}
              >
                <ChevronLeft size={20} />
              </div>
              <div
                className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white p-1 ${
                  !hasNextPage && 'cursor-not-allowed opacity-50'
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
      )}
    </Container>
  );
};
