import { ArrowDown, ExternalLink, Plus, Send } from 'lucide-react';
import React from 'react';

import { CopyText } from '@/components/common/copy-text';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { formatTransactionDate } from './utils';

export interface TableTransaction {
  account: string;
  date: string;
  amount: string;
  hash: string;
  type: 'Sent' | 'Received' | 'Self-transfer';
}

/**
 * Renders a table of transactions with no bells and whistles. Scrolls horizontally when its container is too narrow for a row.
 * Renders a simple empty state if not loading and no transactions are present.
 */
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
      <table className='w-full min-w-96 divide-y divide-gray-200'>
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
        <tbody className='bg-background'>
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
              <tr key={index} className='animate-in fade-in'>
                <td className='w-2/5 whitespace-nowrap py-4'>
                  <div className='flex items-center'>
                    <TransactionTypeIcon type={transaction.type} />
                    <div className='ml-2'>
                      <AddressText address={transaction.account} />
                      <div className='text-muted-foreground text-xs'>
                        {transaction.type === 'Self-transfer'
                          ? 'Added'
                          : transaction.type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='w-1/5 whitespace-nowrap py-4'>
                  <div className='text-sm'>
                    {formatTransactionDate(transaction.date)}
                  </div>
                </td>
                <td
                  className='w-1/5 cursor-pointer whitespace-nowrap py-4'
                  onClick={() => onTransactionClick?.(transaction.hash)}
                >
                  <div className='flex items-center justify-end gap-2'>
                    <div className='text-sm'>
                      {formatCurrency(transaction.amount)}
                    </div>
                    <ExternalLink className='text-muted-foreground size-4' />
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

/** Local component to display a transaction type icon */
const TransactionTypeIcon = ({ type }: { type: TableTransaction['type'] }) => {
  // TODO: Remove hardcoded color?
  return (
    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E4E4E7]'>
      {type === 'Received' && <ArrowDown className='size-5 text-white' />}
      {type === 'Sent' && <Send className='size-5 text-white' />}
      {type === 'Self-transfer' && <Plus className='size-5 text-white' />}
    </div>
  );
};

/** Local component to display a skeleton for the transaction table while loading */
const TableSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
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
              <Skeleton className='size-4' />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

/** Local component to display formatted address and allow copying */
const AddressText = ({ address }: { address: string }) => {
  const formattedAddress = formatWalletAddress(address);

  return <CopyText text={formattedAddress} />;
};
