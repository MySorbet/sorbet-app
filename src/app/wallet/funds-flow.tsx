import { Plus, Send, Wallet } from 'lucide-react';
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
      <div className='flex items-center gap-2'>
        <span className='bg-gray-200 w-10 h-10 text-gray-500 rounded-full flex justify-center items-center'>
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

export const FundsFlow: React.FC<FundsFlowProps> = ({
  title,
  balance,
  icon,
}) => {
  return (
    <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-xl bg-white p-6 min-h-[100%]'>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='bg-black p-2 text-white rounded-full'>{icon}</span>
            <span className='text-sm uppercase font-medium text-[#595B5A]'>
              {title}
            </span>
          </div>
          <div className='text-xl font-semibold'>{balance}</div>
        </div>

        <div className='border-t border-gray-200 mt-4'></div>
        <div className='mt-4'>
          <div className='flex flex-col gap-4'>
            <BalanceItem
              icon={<Plus size={18} />}
              label='Top up'
              account='0x5436...345gsd'
              balance='1,000 USDC'
            />
            <BalanceItem
              icon={<Plus size={18} />}
              label='Top up'
              account='***32565'
              balance='1,000 USDC'
            />
            <BalanceItem
              icon={<Plus size={18} />}
              label='Top up'
              account='***32565'
              balance='1,000 USDC'
            />
            <BalanceItem
              icon={<Send size={18} />}
              label='Send'
              account='name.near'
              balance='1,000 USDC'
            />
            <BalanceItem
              icon={<Send size={18} />}
              label='Send'
              account='name.near'
              balance='1,000 USDC'
            />
          </div>
          <div className='text-right mt-4 font-semibold text-sm cursor-pointer text-sorbet'>
            View all
          </div>
        </div>
      </div>
    </div>
  );
};
