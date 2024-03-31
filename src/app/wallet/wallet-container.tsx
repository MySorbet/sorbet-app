import { DataTable } from '@/app/wallet/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export const WalletContainer = () => {
  return (
    <div className='rounded-xl bg-white border border-2 border-gray-200'>
      <div className='flex flex-col lg:flex-row lg:justify-between gap-3 items-center justify-center lg:px-16 rounded-tl-xl rounded-tr-xl bg-[#0D0449] min-h-40 text-white'>
        <div className='flex flex-row gap-2 items-center justify-center'>
          <div>
            <Image
              src='/svg/usdc-wallet.svg'
              alt='USDC'
              width={40}
              height={40}
            />
          </div>
          <div className='flex flex-col'>
            <div className='text-md font-thin'>Balance</div>
            <div className='font-semibold text-xl'>0 USDC</div>
          </div>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='bg-sorbet gap-2'>
            Send
            <Send size={18} />
          </Button>
          <Button className='bg-sorbet gap-2 hover:bg-gray-100'>
            Top Up
            <Plus size={19} />
          </Button>
        </div>
      </div>
      <div className='border-b-1 border-b border-gray-200 p-10 text-2xl'>
        Transaction History
      </div>
      <div className='border-b-1 border-b border-gray-200 min-h-[50vh]'>
        <DataTable
          currentPage={1}
          totalPages={10}
          onPageChange={(page) => console.log(page)}
          transactions={[
            {
              id: '1',
              timestamp: '24/02/2024',
              symbol: 'USDC',
              txnId: 'random',
              amount: '2,564.3',
            },
          ]}
        />
      </div>
    </div>
  );
};
