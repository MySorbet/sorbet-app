import {
  ChevronDown,
  ChevronsUpDown,
  MessageSquareShare,
  MoveDown,
  Search,
  Send,
} from 'lucide-react';
import React from 'react';
import { DateRange } from 'react-day-picker';

import { Spinner } from '@/components/common';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

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
    window.open(
      `${process.env.NEXT_PUBLIC_BASESEPOLIA_EXPLORER}/tx/${hash}`,
      '_blank'
    );
  };

  return (
    <div className='relative min-h-[100%] rounded-xl bg-white p-6 shadow-[0px_10px_30px_0px_#00000014]'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center rounded-3xl bg-white bg-opacity-75'>
          <Spinner />
        </div>
      )}
      {!minimalMode && (
        <div className='mb-4 grid grid-cols-12 gap-4'>
          <div className='relative col-span-12 lg:col-span-8'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <Search size={20} />
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
                    <ChevronDown size={16} className='ml-1' />
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
              className='w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
            >
              To/From
            </th>
            <th
              scope='col'
              className='w-1/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
            >
              Date
            </th>
            <th
              scope='col'
              className='w-1/5 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td className='w-2/5 whitespace-nowrap px-6 py-4'>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 flex-shrink-0'>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500`}
                      >
                        {transaction.type === 'Sent' && <MoveDown size={16} />}
                        {transaction.type === 'Received' && <Send size={16} />}
                        {transaction.type === 'Self-transfer' && (
                          <ChevronsUpDown size={16} />
                        )}
                      </span>
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {transaction.account}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {transaction.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='w-1/5 whitespace-nowrap px-6 py-4'>
                  <div className='text-sm text-gray-900'>
                    {transaction.date}
                  </div>
                </td>
                <td
                  className='w-1/5 cursor-pointer whitespace-nowrap px-6 py-4'
                  onClick={() => handleTxnClick(transaction.hash)}
                >
                  <div className='flex items-center justify-end gap-2'>
                    <div className='text-sm'>{transaction.amount}</div>
                    <MessageSquareShare size={18} />
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
