import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { SimpleTransactionStatus } from '@/components/common/transaction-status-badge';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { type TableTransaction, TransactionTable } from './transaction-table';
import { TransactionTableCard } from './transaction-table-card';
import { openTransactionInExplorer } from './utils';

export type TransactionTypeFilter = TableTransaction['type'] | 'all';
export type TransactionStatusFilter = SimpleTransactionStatus | 'all';

/** Renders a transaction table in a card with additional controls to filter the transactions */
interface FilteredTransactionTableProps {
  transactions: TableTransaction[];
  isLoading?: boolean;
  searchValue?: string;
  dateRange?: DateRange | undefined;
  statusFilter?: TransactionStatusFilter;
  typeFilter?: TransactionTypeFilter;
  onSearchChange?: (value: string) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onStatusFilterChange?: (status: TransactionStatusFilter) => void;
  onTypeFilterChange?: (type: TransactionTypeFilter) => void;
  // Pagination props
  currentPage?: number;
  totalCount?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export const FilteredTransactionTable: React.FC<
  FilteredTransactionTableProps
> = ({
  transactions,
  isLoading = false,
  searchValue = '',
  dateRange,
  statusFilter = 'all',
  typeFilter = 'all',
  onSearchChange,
  onDateRangeChange,
  onStatusFilterChange,
  onTypeFilterChange,
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
  hasNextPage = false,
  hasPrevPage = false,
  onNextPage,
  onPrevPage,
}) => {
    // Calculate display range for pagination
    const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
      <TransactionTableCard>
        {/* Filter Controls */}
        <div className='mb-4 grid grid-cols-12 gap-3'>
          {/* Search Input */}
          <div className='relative col-span-12 md:col-span-6'>
            <Input
              type='text'
              placeholder='Search transactions'
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className='relative col-span-6 md:col-span-2'>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                onStatusFilterChange?.(value as TransactionStatusFilter)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
                <SelectItem value='Processing'>Processing</SelectItem>
                <SelectItem value='In Review'>In Review</SelectItem>
                <SelectItem value='Returned'>Returned</SelectItem>
                <SelectItem value='Rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className='relative col-span-6 md:col-span-2'>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                onTypeFilterChange?.(value as TransactionTypeFilter)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                <SelectItem value='Money Out'>Money Out</SelectItem>
                <SelectItem value='Money In'>Money In</SelectItem>
                <SelectItem value='Deposit'>Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className='relative col-span-12 md:col-span-2'>
            {onDateRangeChange && (
              <DatePickerWithRange
                date={dateRange}
                onDateChange={onDateRangeChange}
                triggerButton={
                  <Button variant='outline' className='w-full justify-between'>
                    <span>Date range</span>
                    <ChevronDown className='size-4' />
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          isLoading={isLoading}
          transactions={transactions}
          onTransactionClick={openTransactionInExplorer}
        />

        {/* Pagination Footer */}
        <div className='mt-4 flex items-center justify-between border-t pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className='gap-1'
          >
            <ChevronLeft className='size-4' />
            <span>Previous</span>
          </Button>

          <span className='text-muted-foreground text-sm'>
            {totalCount > 0 ? `${startItem}-${endItem} of ${totalCount}` : '0 of 0'}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={onNextPage}
            disabled={!hasNextPage}
            className='gap-1'
          >
            <span>Next</span>
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </TransactionTableCard>
    );
  };
