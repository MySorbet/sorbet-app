import { SelectDuration } from '@/app/wallet/select-duration';
import { Plus, Send, Wallet } from 'lucide-react';
import React from 'react';

interface WalletBalanceProps {
  ethBalance: string;
  usdcBalance: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  ethBalance,
  usdcBalance,
}) => {
  return (
    <div className='min-h-[100%] rounded-3xl bg-white p-6 shadow-[0px_10px_30px_0px_#00000014]'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <span className='rounded-full bg-black p-2 text-white'>
                <Wallet size={18} />
              </span>
              <span className='text-md font-medium text-[#595B5A]'>
                BALANCE
              </span>
            </div>
          </div>
          <div className='flex gap-4'>
            <button className='flex flex-col items-center gap-1 text-sm text-blue-500'>
              <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#573DF5] text-white'>
                <Plus size={26} />
              </span>
              <span className='text-[#595B5A]'>Top up</span>
            </button>
            <button className='flex flex-col items-center gap-1 text-sm text-blue-500'>
              <span className='flex h-12 w-12 items-center justify-center rounded-full bg-[#573DF5] text-white'>
                <Send size={26} />
              </span>
              <span className='text-[#595B5A]'>Send</span>
            </button>
          </div>
        </div>
        <div className='flex'>
          {/* <div className='text-3xl font-semibold'>{ethBalance} ETH</div> */}
          <div className='text-3xl font-semibold'>{usdcBalance} USDC</div>
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
