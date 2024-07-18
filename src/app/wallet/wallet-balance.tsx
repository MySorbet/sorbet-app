import { SelectDuration } from '@/app/wallet/select-duration';
import { Plus, Send, Wallet } from 'lucide-react';
import React from 'react';

export const WalletBalance = () => {
  return (
    <div className='shadow-[0px_10px_30px_0px_#00000014] rounded-xl bg-white p-6 min-h-[100%]'>
      <div className='flex flex-col gap-1'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <span className='bg-black p-2 text-white rounded-full'>
                <Wallet size={18} />
              </span>
              <span className='text-md font-medium text-[#595B5A]'>
                BALANCE
              </span>
            </div>
            <div className='text-3xl font-semibold'>1,000.34 USDC</div>
          </div>
          <div className='flex gap-4'>
            <button className='flex flex-col items-center gap-1 text-sm text-blue-500'>
              <span className='bg-[#573DF5] w-12 h-12 text-white rounded-full flex justify-center items-center'>
                <Plus size={26} />
              </span>
              <span className='text-[#595B5A]'>Top up</span>
            </button>
            <button className='flex flex-col items-center gap-1 text-sm text-blue-500'>
              <span className='bg-[#573DF5] w-12 h-12 text-white rounded-full flex justify-center items-center'>
                <Send size={26} />
              </span>
              <span className='text-[#595B5A]'>Send</span>
            </button>
          </div>
        </div>
        <div className='mt-4'>
          <SelectDuration
            selectedValue='30'
            onChange={(value: string) => console.log(value)}
          />
        </div>
      </div>
    </div>
  );
};
