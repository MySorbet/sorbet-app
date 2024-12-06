import { Hourglass } from 'lucide-react';
import React from 'react';

export const ContractPendingOffer = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center bg-gray-100 p-2 py-3 rounded-2xl h-full text-center'>
      <Hourglass className='w-16 h-16' stroke="#C4C5C5" />
      <h1 className='text-3xl font-bold'>Offer Pending</h1>
      <p className='text-xl md:w-[60%]'>
        Your offer was sent to the freelancer and is currently awaiting a
        response from them.
      </p>
    </div>
  );
};
