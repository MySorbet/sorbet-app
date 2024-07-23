import { Spinner } from '@/components/common';
import { MessageSquareShare } from 'lucide-react';
import React from 'react';

interface RecentTransaction {
  type: 'Received' | 'Sent' | 'Added';
  account: string;
  date: string;
  amount: string;
  hash: string;
}

interface RecentTransactionsProps {
  transactions: RecentTransaction[] | undefined;
  isLoading?: boolean;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading,
}) => {
  const handleTxnClick = (hash: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_NEARBLOCKS_EXPLORER}/txns/${hash}`,
      '_blank'
    );
  };

  return (
    <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-3xl bg-white p-6 min-h-[100%] relative'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-3xl'>
          <Spinner />
        </div>
      )}
      <table className='min-w-full divide-y divide-gray-200'>
        <thead>
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
                        {transaction.type === 'Received' && (
                          <span>&#8595;</span>
                        )}
                        {transaction.type === 'Sent' && <span>&#8593;</span>}
                        {transaction.type === 'Added' && <span>&#43;</span>}
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

      {(!transactions || transactions.length < 1) && !isLoading && (
        <div className='my-12 flex justify-center w-100 text-sm'>
          No transactions found
        </div>
      )}
    </div>
  );
};
