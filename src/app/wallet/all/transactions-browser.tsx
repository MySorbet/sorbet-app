'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { getTransactions } from '@/api/transactions';
import Authenticated from '@/app/authenticated';
import { Header } from '@/components/header';
import { useAuth, useSmartWalletAddress } from '@/hooks';
import { Transaction } from '@/types/transactions';

import TransactionsTable, { TableTransaction } from './transactions-table';

export const TransactionsBrowser: React.FC = () => {
  const { user } = useAuth();
  const { smartWalletAddress } = useSmartWalletAddress();
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
  const [cursorsMap, setCursorsMap] = useState<{ [key: number]: string }>({});
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);

  const getCurrentCursor = (page: number): string => {
    return cursorsMap[page] || '';
  };

  const handleClearAll = () => {
    setDateRange(undefined);
    setSearchValue('');
    setCurrentPage(1);
    fetchTransactions();
  };

  const fetchTransactions = useCallback(
    async (after_date?: string, before_date?: string) => {
      if (!smartWalletAddress) return;
      const cursor = getCurrentCursor(currentPage);
      setIsLoading(true);
      const res = await getTransactions(
        smartWalletAddress,
        cursor,
        10,
        'DESC',
        after_date,
        before_date
      );
      if (res.status === 200 && res.data) {
        const formattedTransactions = res.data.transactions.transactions.map(
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
        const cursor_data = res.data.transactions.cursor;
        if (cursor_data) {
          setCursorsMap((prev) => ({
            ...prev,
            [currentPage + 1]: cursor_data,
          }));
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
        setTransactionsData(formattedTransactions);
        setFilteredTransactions(formattedTransactions);
        setHasPrevPage(currentPage > 1);
      }
      setIsLoading(false);
    },
    [
      smartWalletAddress,
      currentPage,
      user,
      setIsLoading,
      setTransactionsData,
      setFilteredTransactions,
      setHasNextPage,
      setCursorsMap,
      setHasPrevPage,
    ]
  );

  useEffect(() => {
    if (smartWalletAddress) {
      fetchTransactions();
    }
  }, [currentPage, smartWalletAddress, fetchTransactions]);

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
  }, [searchValue, transactionsData, fetchTransactions]);

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
    <Authenticated>
      <Header />
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
    </Authenticated>
  );
};
