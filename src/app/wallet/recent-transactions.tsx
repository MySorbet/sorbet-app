import { MessageSquareShare } from 'lucide-react';
import React from 'react';

interface Transaction {
  type: 'Received' | 'Sent' | 'Added';
  account: string;
  date: string;
  amount: string;
  isPositive: boolean;
}

const transactions: Transaction[] = [
  {
    type: 'Received',
    account: 'abcd.near',
    date: '3/6/2024',
    amount: '+2,867.25 USDC',
    isPositive: true,
  },
  {
    type: 'Sent',
    account: 'abcd.near',
    date: '3/6/2024',
    amount: '-2,867.25 USDC',
    isPositive: false,
  },
  {
    type: 'Added',
    account: '***32565',
    date: '3/8/2024',
    amount: '+2,867.25 USDC',
    isPositive: true,
  },
  {
    type: 'Added',
    account: '***32565',
    date: '3/6/2024',
    amount: '+2,867.25 USDC',
    isPositive: true,
  },
  {
    type: 'Received',
    account: 'abcd.near',
    date: '3/6/2024',
    amount: '+2,867.25 USDC',
    isPositive: true,
  },
  {
    type: 'Added',
    account: '***32565',
    date: '3/6/2024',
    amount: '+2,867.25 USDC',
    isPositive: true,
  },
];

export const RecentTransactions: React.FC = () => {
  return (
    <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-xl bg-white p-6 min-h-[100%]'>
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
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 h-10 w-10'>
                    <span
                      className={`bg-gray-200 w-10 h-10 text-gray-500 rounded-full flex justify-center items-center`}
                    >
                      {transaction.type === 'Received' && <span>&#8595;</span>}
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
                <div className='text-sm text-gray-900'>{transaction.date}</div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap flex gap-2 items-center justify-end cursor-pointer'>
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
