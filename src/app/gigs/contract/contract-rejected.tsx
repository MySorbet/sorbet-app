import { X } from 'lucide-react';
import React from 'react';

export interface ContractRejectedProps {
  isClient: boolean;
}

export const ContractRejected = ({ isClient }: ContractRejectedProps) => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center bg-gray-100 p-2 py-3 rounded-2xl h-full text-center'>
      <X className='w-16 h-16' stroke={`red`} />
      <h1 className='text-3xl font-bold'>Contract Rejected</h1>
      {isClient ? (
        <p className='text-xl md:w-[60%]'>
          You rejected this contract, but you can always create a new one!
        </p>
      ) : (
        <p className='text-xl md:w-[60%]'>
          Your proposed terms for the contract were rejected by the client. You
          can reach out to them directly via Messages to resolve any issues and
          create a new contract.
        </p>
      )}
    </div>
  );
};
