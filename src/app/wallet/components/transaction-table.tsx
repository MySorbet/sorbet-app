import { LinkExternal02 } from '@untitled-ui/icons-react';
import { ArrowDown, Plus, Send } from 'lucide-react';
import React, { useState } from 'react';

import useCopy from '@/components/common/copy-button/use-copy';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  formatCurrency,
  formatTransactionDate,
  formatWalletAddress,
} from './utils';

export interface TableTransaction {
  account: string;
  date: string;
  amount: string;
  hash: string;
  type: 'Sent' | 'Received' | 'Self-transfer';
}

export const TransactionTable = ({
  transactions,
  onTransactionClick,
  isLoading,
}: {
  transactions: TableTransaction[];
  onTransactionClick?: (hash: string) => void;
  isLoading?: boolean;
}) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-96 divide-y divide-gray-200'>
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
          {isLoading ? (
            <TableSkeleton />
          ) : transactions.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className='text-muted-foreground py-8 text-center'
              >
                No transactions found
              </td>
            </tr>
          ) : (
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
                      <AddressText address={transaction.account} />
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
                  onClick={() => onTransactionClick?.(transaction.hash)}
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/** Local component to display a skeleton for the transaction table while loading */
const TableSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <tr key={index}>
          <td className='w-2/5 whitespace-nowrap py-4'>
            <div className='flex items-center'>
              <div className='h-12 w-12 flex-shrink-0'>
                <Skeleton className='size-12 rounded-full' />
              </div>
              <div className='ml-4'>
                <Skeleton className='h-5 w-32' />
                <Skeleton className='mt-1 h-4 w-16' />
              </div>
            </div>
          </td>
          <td className='w-1/5 whitespace-nowrap py-4'>
            <Skeleton className='h-5 w-24' />
          </td>
          <td className='w-1/5 whitespace-nowrap py-4'>
            <div className='flex items-center justify-end gap-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='size-[1.125rem]' />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// Tooltip state inspired by https://github.com/shadcn-ui/ui/issues/86#issuecomment-2241817826
// TODO: Revisit "copy" flash when tooltip is closing (likely due to fade out animation)
/** Local component to display formatted address and allow copying */
const AddressText = ({ address }: { address: string }) => {
  const formattedAddress = formatWalletAddress(address);
  const { isCopied, handleClick } = useCopy(address);
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open || isCopied}>
        <TooltipTrigger asChild>
          <button
            type='button'
            className='cursor-pointer'
            onClick={() => {
              setOpen(!open);
              handleClick();
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onTouchStart={() => setOpen(!open)}
            onKeyDown={(e) => {
              e.preventDefault();
              if (e.key === 'Enter') {
                setOpen(!open);
                handleClick();
              }
            }}
          >
            {formattedAddress}
          </button>
        </TooltipTrigger>
        <TooltipContent>{isCopied ? 'Copied!' : 'Copy'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
