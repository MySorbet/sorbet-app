import { CircleAlert, X } from 'lucide-react';
import Link from 'next/link';
import React, { ReactNode } from 'react';

interface InvalidAlertProps {
  handleAlertVisible: (status: boolean) => void;
  title: string;
  children: ReactNode;
}

export const InvalidAlert: React.FC<InvalidAlertProps> = ({
  handleAlertVisible,
  title,
  children,
}) => {
  return (
    <div className='flex flex-row gap-3 rounded-xl border border-gray-300 bg-white p-4 shadow-sm'>
      <div>
        <div className='rounded-full border-2 border-red-100 p-1'>
          <div className='rounded-full border-2 border-red-300 p-1'>
            <CircleAlert className='h-6 w-6' color='red' />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='font-semibold'>{title}</p>
        {children}
        <div className='mt-2 flex cursor-pointer flex-row gap-3'>
          <div
            className='hover:underline'
            onClick={() => handleAlertVisible(false)}
          >
            Dismiss
          </div>
          <a
            href='https://docs.mysorbet.xyz/sorbet/key-features/quickstart/list-of-supported-widgets'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sorbet font-semibold hover:underline'
          >
            Learn More
          </a>
        </div>
      </div>
      <div className='align-center flex justify-center'>
        <X
          className='h-6 w-6 cursor-pointer'
          color='gray'
          onClick={() => handleAlertVisible(false)}
        />
      </div>
    </div>
  );
};
