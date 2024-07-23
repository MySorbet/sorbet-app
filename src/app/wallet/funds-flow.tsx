import { Spinner } from '@/components/common';
import Link from 'next/link';
import React from 'react';

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
        <span className='bg-gray-200 w-12 h-12 text-gray-500 rounded-full flex justify-center items-center'>
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
    <>
      <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-3xl bg-white p-6 min-h-[100%] relative'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-3xl'>
            <Spinner />
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span className='bg-black p-3 text-white rounded-full'>
                {icon}
              </span>
              <span className='text-sm uppercase font-medium text-[#595B5A]'>
                {title}
              </span>
            </div>
            <div className='text-xl font-semibold'>{balance}</div>
          </div>

          <div className='border-t border-gray-200 mt-4'></div>
          <div className='mt-4'>
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
            <Link href='/wallet/all'>
              <div className='text-right mt-4 font-semibold text-sm cursor-pointer text-sorbet'>
                View all
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
