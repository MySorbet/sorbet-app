import { ChevronDown } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { env } from '@/lib/env';

import { type TableTransaction, TransactionTable } from './transaction-table';
import { TransactionTableCard } from './transaction-table-card';
import { openTransactionInExplorer } from './utils';

interface FilteredTransactionTableProps {
  transactions: TableTransaction[];
  isLoading?: boolean;
  searchValue?: string;
  dateRange?: DateRange | undefined;
  onSearchChange?: (value: string) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onClearAll?: () => void;
}

export const FilteredTransactionTable: React.FC<
  FilteredTransactionTableProps
> = ({
  transactions,
  isLoading = false,
  searchValue = '',
  dateRange,
  onSearchChange,
  onDateRangeChange,
  onClearAll,
}) => {
  return (
    <TransactionTableCard>
      <div className='mb-4 grid grid-cols-12 gap-4'>
        <div className='relative col-span-12 lg:col-span-6'>
          {/* TODO: Add search icon back */}
          <Input
            type='text'
            placeholder='Search'
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
          {onDateRangeChange && (
            <DatePickerWithRange
              date={dateRange}
              onDateChange={onDateRangeChange}
              triggerButton={
                <Button
                  variant='outline'
                  onClick={onClearAll}
                  className='w-full'
                >
                  Date
                  <ChevronDown className='ml-1 size-4' />
                </Button>
              }
            />
          )}
        </div>
        <div className='relative col-span-12 md:col-span-4 lg:col-span-3'>
          <Button variant='outline' onClick={onClearAll} className='w-full'>
            Clear All
          </Button>
        </div>
      </div>
      <TransactionTable
        isLoading={isLoading}
        transactions={transactions}
        onTransactionClick={openTransactionInExplorer}
      />
    </TransactionTableCard>
  );
};
