import { ArrowDown, ArrowUp, ExternalLink, Plus, Send } from 'lucide-react';
import React from 'react';

import { CopyText } from '@/components/common/copy-text';
import { TransactionStatusBadge } from '@/components/common/transaction-status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';
import { DrainState } from '@/types/bridge';

import { formatTransactionDate, simplifyTxStatus } from './utils';

export interface TableTransaction {
  account: string;
  date: string;
  amount: string;
  hash: string;
  type: 'Money Out' | 'Money In' | 'Deposit';
  status?: DrainState;
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
      <table className='w-full min-w-[640px] divide-y divide-gray-200'>
        <thead className='border-b'>
          <tr>
            <th
              scope='col'
              className='w-[15%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Date
            </th>
            <th
              scope='col'
              className='w-[25%] py-3 text-left text-xs font-medium text-gray-500'
            >
              To/From
            </th>
            <th
              scope='col'
              className='w-[20%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Amount
            </th>
            <th
              scope='col'
              className='w-[20%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Status
            </th>
            <th
              scope='col'
              className='w-[20%] py-3 text-left text-xs font-medium text-gray-500'
            >
              Type
            </th>
          </tr>
        </thead>
        <tbody className='bg-background'>
          {isLoading ? (
            <TableSkeleton />
          ) : transactions.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className='text-muted-foreground py-8 text-center'
              >
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr key={index} className='animate-in fade-in'>
                <td className='whitespace-nowrap py-4'>
                  <div className='text-sm'>
                    {formatTransactionDate(transaction.date)}
                  </div>
                </td>
                <td className='whitespace-nowrap py-4'>
                  <div className='flex items-center'>
                    <TransactionTypeIcon type={transaction.type} />
                    <div className='ml-2'>
                      <AddressText address={transaction.account} />
                      <div className='text-muted-foreground text-xs'>
                        {transaction.type === 'Deposit'
                          ? 'Added'
                          : transaction.type === 'Money Out'
                            ? 'Sent'
                            : 'Received'}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className='cursor-pointer whitespace-nowrap py-4'
                  onClick={() => onTransactionClick?.(transaction.hash)}
                >
                  <div className='flex items-center gap-2'>
                    <div className='text-sm'>
                      {formatCurrency(transaction.amount)}
                    </div>
                    <ExternalLink className='text-muted-foreground size-4' />
                  </div>
                </td>
                <td className='whitespace-nowrap py-4'>
                  {transaction.status && (
                    <TransactionStatusBadge
                      status={simplifyTxStatus(transaction.status)}
                    />
                  )}
                </td>
                <td className='whitespace-nowrap py-4'>
                  <div className='flex items-center gap-2'>
                    <TransactionTypeArrow type={transaction.type} />
                    <span className='text-sm'>{transaction.type}</span>
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

/** Local component to display a transaction type icon in the To/From column */
const TransactionTypeIcon = ({ type }: { type: TableTransaction['type'] }) => {
  return (
    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E4E4E7]'>
      {type === 'Money In' && <ArrowDown className='size-5 text-white' />}
      {type === 'Money Out' && <Send className='size-5 text-white' />}
      {type === 'Deposit' && <Plus className='size-5 text-white' />}
    </div>
  );
};

/** Local component to display an arrow icon for the Type column */
const TransactionTypeArrow = ({ type }: { type: TableTransaction['type'] }) => {
  if (type === 'Money In' || type === 'Deposit') {
    return <ArrowDown className='text-muted-foreground size-4' />;
  }
  return <ArrowUp className='text-muted-foreground size-4' />;
};

/** Local component to display a skeleton for the transaction table while loading */
const TableSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <tr key={index}>
          <td className='whitespace-nowrap py-4'>
            <Skeleton className='h-5 w-24' />
          </td>
          <td className='whitespace-nowrap py-4'>
            <div className='flex items-center'>
              <Skeleton className='size-10 rounded-full' />
              <div className='ml-2'>
                <Skeleton className='h-5 w-28' />
                <Skeleton className='mt-1 h-4 w-16' />
              </div>
            </div>
          </td>
          <td className='whitespace-nowrap py-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='size-4' />
            </div>
          </td>
          <td className='whitespace-nowrap py-4'>
            <Skeleton className='h-6 w-20 rounded-md' />
          </td>
          <td className='whitespace-nowrap py-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-4' />
              <Skeleton className='h-5 w-20' />
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
