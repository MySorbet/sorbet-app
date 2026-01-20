'use client';

import { format } from 'date-fns';
import { Plus, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { getTransactions } from '@/api/transactions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

import { DepositDialog } from '../../dashboard/components/deposit-dialog';
import {
  FilteredTransactionTable,
  TransactionStatusFilter,
  TransactionTypeFilter,
} from './filtered-transaction-table';
import { TableTransaction } from './transaction-table';
import { mapTransactionOverview, simplifyTxStatus } from './utils';

const PAGE_SIZE = 10;

export const TransactionsBrowser: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { smartWalletAddress } = useSmartWalletAddress();
  const { data: bridgeCustomer } = useBridgeCustomer();

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string>('');
  const [statusFilter, setStatusFilter] =
    useState<TransactionStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');

  // Transaction data states
  const [transactionsData, setTransactionsData] = useState<TableTransaction[]>(
    []
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    TableTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cursorsMap, setCursorsMap] = useState<{ [key: number]: string }>({});
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Deposit dialog state
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const fetchTransactions = useCallback(
    async (after_date?: string, before_date?: string) => {
      if (!smartWalletAddress) return;

      // to appease linting errors and avoid un-necessary re-renders
      const getCurrentCursor = (page: number): string => {
        return cursorsMap[page] || '';
      };

      const cursor = getCurrentCursor(currentPage);
      setIsLoading(true);
      const res = await getTransactions(
        cursor,
        PAGE_SIZE,
        'DESC',
        after_date,
        before_date
      );
      if (res.status === 200 && res.data) {
        const formattedTransactions = mapTransactionOverview(
          res.data.transactions,
          smartWalletAddress
        );
        const cursor_data = res.data.cursor;
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

        // Update total count estimate based on pagination
        // Since API doesn't provide total, estimate based on current page and whether there's more
        const estimatedTotal = cursor_data
          ? currentPage * PAGE_SIZE + PAGE_SIZE
          : (currentPage - 1) * PAGE_SIZE + formattedTransactions.length;
        setTotalCount(Math.max(totalCount, estimatedTotal));
      }
      setIsLoading(false);
    },
    [smartWalletAddress, currentPage, cursorsMap, totalCount]
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
  }, [dateRange, fetchTransactions]);

  // Filter transactions based on search, status, and type
  useEffect(() => {
    let filtered = transactionsData;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter((transaction) =>
        transaction.account.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((transaction) => {
        if (!transaction.status) return false;
        return simplifyTxStatus(transaction.status) === statusFilter;
      });
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    setFilteredTransactions(filtered);
  }, [searchValue, statusFilter, typeFilter, transactionsData]);

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

  const handleDeposit = () => setIsDepositOpen(true);
  const handleSendFunds = () => router.push('/recipients?send-to=true');

  return (
    user && (
      <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
        {/* Deposit Dialog */}
        <DepositDialog
          open={isDepositOpen}
          onOpenChange={setIsDepositOpen}
          walletAddress={smartWalletAddress ?? undefined}
          bridgeCustomer={bridgeCustomer}
        />

        {/* Header Section -  */}
        <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
          {/* Mobile: Title + Buttons in one row */}
          <div className='flex w-full items-center justify-between sm:hidden'>
            <h2 className='text-xl font-semibold'>Transactions</h2>
            <div className='flex shrink-0 gap-2'>
              <Button
                variant='outline'
                onClick={handleDeposit}
                size='icon'
                className='size-9'
              >
                <Plus className='size-4' />
              </Button>
              <Button
                variant='sorbet'
                onClick={handleSendFunds}
                size='icon'
                className='size-9'
              >
                <Send className='size-4' />
              </Button>
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className='hidden min-w-0 flex-1 sm:block'>
            <h2 className='text-2xl font-semibold'>Transactions</h2>
          </div>

          <div className='hidden shrink-0 gap-3 sm:flex'>
            <Button
              variant='outline'
              onClick={handleDeposit}
              className='gap-2'
              size='sm'
            >
              <Plus className='size-4' />
              <span>Deposit</span>
            </Button>
            <Button
              variant='sorbet'
              onClick={handleSendFunds}
              className='gap-2'
              size='sm'
            >
              <Send className='size-4' />
              <span>Send Funds</span>
            </Button>
          </div>
        </div>

        {/* Transactions Table with Filters */}
        <FilteredTransactionTable
          transactions={filteredTransactions}
          searchValue={searchValue}
          dateRange={dateRange}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          isLoading={isLoading}
          onSearchChange={setSearchValue}
          onDateRangeChange={setDateRange}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </div>
    )
  );
};
