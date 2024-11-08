import Link from 'next/link';
import React from 'react';

import { Spinner } from '@/components/common';

interface FundsFlowProps {
  icon: React.ReactNode;
  title: string;
  balance: string;
}

interface BalanceItemProps {
  icon: React.ReactNode;
  label: string;
  account: string;
  balance: string;
}

const BalanceItem: React.FC<BalanceItemProps> = ({
  icon,
  label,
  account,
  balance,
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <span className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500'>
          {icon}
        </span>
        <div className='flex flex-col'>
          <span className='text-sm text-[#595B5A]'>{account}</span>
          <span className='text-xs text-gray-400'>{label}</span>
        </div>
      </div>
      <span className='text-sm'>{balance}</span>
    </div>
  );
};

export const FundsFlow: React.FC<
  FundsFlowProps & { items: BalanceItemProps[] | undefined; isLoading: boolean }
> = ({ title, balance, icon, items, isLoading }) => {
  return (
    <div className='flex min-h-[100%] flex-col rounded-3xl bg-white p-6 shadow-[0px_10px_30px_0px_#00000014]'>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center rounded-3xl bg-white bg-opacity-75'>
          <Spinner />
        </div>
      )}
      <div className='flex flex-grow flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='rounded-full bg-black p-3 text-white'>{icon}</span>
            <span className='text-sm font-medium uppercase text-[#595B5A]'>
              {title}
            </span>
          </div>
          <div className='text-xl font-semibold'>{balance} USDC</div>
        </div>

        <div className='mt-4 border-t border-gray-200'></div>
        <div className='mt-4 flex-grow'>
          <div className='flex flex-col gap-4'>
            {(!items || items.length < 1) && !isLoading && (
              <div className='text-center text-sm'>No transactions found</div>
            )}
            {items &&
              items.map((item, index) => (
                <BalanceItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  account={item.account}
                  balance={item.balance}
                />
              ))}
          </div>
        </div>
      </div>
      <div className='mt-auto flex justify-end'>
        <Link href='/wallet/all'>
          <div className='text-sorbet cursor-pointer text-sm font-semibold'>
            View all
          </div>
        </Link>
      </div>
    </div>
  );
};
