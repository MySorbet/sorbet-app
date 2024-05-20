import React, { ReactNode } from 'react';

export interface GigsColumnProps {
  title: string;
  children?: ReactNode;
  count: number;
}

export const GigsColumn = ({ title, children, count }: GigsColumnProps) => {
  return (
    <div className='bg-white shadow rounded-xl border border-4 border-solid border-[#E5E8ED] cursor-pointer min-h-[60vh]'>
      <div className='p-4 sm:p-6 lg:p-4 bg-[#F2F2F2] rounded-tl-lg rounded-tr-lg'>
        <div className='flex items-center align-center justify-between'>
          <h4 className='text-lg font-semibold text-gray-900'>{title}</h4>
          <span className='bg-[#F9FAFB] border border-2 border-solid border-[#E5E8ED] px-3 py-1 font-semibold rounded-full text-sm'>
            {count}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-4 p-4 sm:p-6 lg:p-4'>{children}</div>
    </div>
  );
};
