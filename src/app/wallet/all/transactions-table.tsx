import { Spinner } from '@/components/common';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

export interface TableTransaction {
  account: string;
  date: string;
  amount: string;
  hash: string;
  type: 'Sent' | 'Received' | 'Self-transfer';
}

interface TransactionsTableProps {
  transactions: TableTransaction[];
  searchValue: string;
  dateRange: DateRange | undefined;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearAll: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  searchValue,
  dateRange,
  isLoading = false,
  onSearchChange,
  onDateRangeChange,
  onClearAll,
}) => {
  const handleTxnClick = (hash: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_NEARBLOCKS_EXPLORER}/txns/${hash}`,
      '_blank'
    );
  };

  return (
    <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-xl bg-white p-6 min-h-[100%]'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-3xl'>
          <Spinner />
        </div>
      )}
      <div className='grid grid-cols-12 gap-4 mb-4'>
        <div className='relative col-span-12 lg:col-span-6'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Search size={20} />
          </div>
          <input
            type='text'
            placeholder='Search'
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className='px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
          />
        </div>
        <div className='relative col-span-12 md:col-span-4 lg:col-span-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-md w-full text-muted-foreground'>
                  Amount
                  <ChevronDown size={16} className='ml-1' />
                </button>
              </TooltipTrigger>
              <TooltipContent>Coming soon!</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className='relative col-span-12 md:col-span-4 lg:col-span-2'>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateRangeChange}
            triggerButton={
              <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-md w-full text-muted-foreground'>
                Date
                <ChevronDown size={16} className='ml-1' />
              </button>
            }
          />
        </div>
        <div className='relative col-span-12 md:col-span-4 lg:col-span-2'>
          <button
            className='flex items-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-md w-full text-muted-foreground justify-center'
            onClick={onClearAll}
          >
            Clear All
          </button>
        </div>
      </div>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='border-b'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              To/From
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
            >
              Date
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right'
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {transactions &&
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <span
                        className={`bg-gray-200 w-10 h-10 text-gray-500 rounded-full flex justify-center items-center`}
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
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-900'>
                    {transaction.date}
                  </div>
                </td>
                <td
                  className='px-6 py-4 whitespace-nowrap flex gap-2 items-center justify-end cursor-pointer'
                  onClick={() => handleTxnClick(transaction.hash)}
                >
                  <div className={`text-sm`}>{transaction.amount}</div>
                  <MessageSquareShare size={18} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
