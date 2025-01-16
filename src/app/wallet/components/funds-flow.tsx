import Link from 'next/link';
import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency, formatWalletAddress } from './utils';

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
        <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#D7D7D7]'>
          {icon}
        </span>
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>
            {formatWalletAddress(account)}
          </span>
          <span className='mt-1 text-xs text-[#595B5A]'>{label}</span>
        </div>
      </div>
      <span className='text-sm font-medium'>
        {formatCurrency(balance)} USDC
      </span>
    </div>
  );
};

export const FundsFlow: React.FC<
  FundsFlowProps & { items: BalanceItemProps[] | undefined; isLoading: boolean }
> = ({ title, balance, icon, items, isLoading }) => {
  return (
    <>
      {isLoading || balance === '' ? (
        <Skeleton className='h-44 rounded-3xl bg-gray-300 shadow-md' />
      ) : (
        <div className='bg-card flex min-h-full flex-col rounded-3xl p-6 shadow-md'>
          <div className='flex flex-grow flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='bg-foreground text-muted rounded-full p-1.5'>
                  {icon}
                </span>
                <span className='text-muted-foreground text-sm font-medium uppercase'>
                  {title}
                </span>
              </div>
              <div className='text-xl font-semibold'>
                {formatCurrency(balance)} USDC
              </div>
            </div>

            <div className='border-border mt-4 border-t'></div>
            <div className='mt-4 flex-grow'>
              <div className='flex flex-col gap-4'>
                {(!items || items.length < 1) && !isLoading && (
                  <div className='text-muted-foreground text-center text-sm'>
                    No transactions found
                  </div>
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
          <div className='mt-auto flex justify-end pt-4'>
            <Link href='/wallet/all'>
              <div className='text-sorbet cursor-pointer text-sm font-semibold'>
                View all
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
