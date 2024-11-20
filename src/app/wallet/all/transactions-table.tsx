import { LinkExternal02 } from '@untitled-ui/icons-react';
import { ArrowDown, ChevronDown, Plus, Search, Send } from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { Spinner } from '@/components/common';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { env } from '@/lib/env';
import {
  formatCurrency,
  formatTransactionDate,
  formatWalletAddress,
} from '@/app/wallet/utils';

export interface TableTransaction {
  account: string;
  date: string;
  amount: string;
  hash: string;
  type: 'Sent' | 'Received' | 'Self-transfer';
}

interface TransactionsTableProps {
  transactions: TableTransaction[];
  searchValue?: string;
  dateRange?: DateRange | undefined;
  isLoading?: boolean;
  onSearchChange?: (value: string) => void;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onClearAll?: () => void;
  minimalMode?: boolean;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  searchValue = '',
  dateRange,
  isLoading = false,
  onSearchChange,
  onDateRangeChange,
  onClearAll,
  minimalMode = false,
}) => {
  const handleTxnClick = (hash: string) => {
    window.open(`${env.NEXT_PUBLIC_BASE_EXPLORER}/tx/${hash}`, '_blank');
  };

  return (
    <div className='relative min-h-[100%] rounded-xl bg-white p-6 shadow-[0px_10px_30px_0px_#00000014]'>
      {isLoading && (
        <div className='absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-white bg-opacity-75'>
          <Spinner />
        </div>
      )}
      {!minimalMode && (
        <div className='mb-4 grid grid-cols-12 gap-4'>
          <div className='relative col-span-12 lg:col-span-8'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <Search className='size-5' />
            </div>
            <input
              type='text'
              placeholder='Search'
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='relative col-span-12 md:col-span-4 lg:col-span-2'>
            {onDateRangeChange && (
              <DatePickerWithRange
                date={dateRange}
                onDateChange={onDateRangeChange}
                triggerButton={
                  <button className='text-md text-muted-foreground flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 focus:outline-none'>
                    Date
                    <ChevronDown className='ml-1 size-4' />
                  </button>
                }
              />
            )}
          </div>
          <div className='relative col-span-12 md:col-span-4 lg:col-span-2'>
            <button
              className='text-md text-muted-foreground flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 focus:outline-none'
              onClick={onClearAll}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='border-b'>
          <tr>
            <th
              scope='col'
              className='w-2/5 py-3 text-left text-xs font-medium text-gray-500'
            >
              To/From
            </th>
            <th
              scope='col'
              className='w-1/5 py-3 text-left text-xs font-medium text-gray-500'
            >
              Date
            </th>
            <th
              scope='col'
              className='w-1/5 py-3 text-right text-xs font-medium text-gray-500'
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td className='w-2/5 whitespace-nowrap py-4'>
                  <div className='flex items-center'>
                    <div className='h-12 w-12 flex-shrink-0'>
                      <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#D7D7D7]'>
                        {transaction.type === 'Sent' && (
                          <ArrowDown className='size-6 text-white' />
                        )}
                        {transaction.type === 'Received' && (
                          <Send className='size-6 text-white' />
                        )}
                        {transaction.type === 'Self-transfer' && (
                          <Plus className='size-6 text-white' />
                        )}
                      </span>
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatWalletAddress(transaction.account)}
                      </div>
                      <div className='mt-1 text-xs text-[#595B5A]'>
                        {transaction.type === 'Self-transfer'
                          ? 'Added'
                          : transaction.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='w-1/5 whitespace-nowrap py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {formatTransactionDate(transaction.date)}
                  </div>
                </td>
                <td
                  className='w-1/5 cursor-pointer whitespace-nowrap py-4'
                  onClick={() => handleTxnClick(transaction.hash)}
                >
                  <div className='flex items-center justify-end gap-2'>
                    <div className='text-sm font-medium'>
                      {transaction.type === 'Sent' ? '-' : '+'}{' '}
                      {formatCurrency(transaction.amount)} USDC
                    </div>
                    <LinkExternal02 className='size-[1.125rem] text-[#595B5A]' />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
