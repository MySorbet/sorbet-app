import React, { ReactNode } from 'react';

export interface GigsColumnProps {
  title: string;
  children?: ReactNode;
  count: number;
}

export const GigsColumn = ({ title, children, count }: GigsColumnProps) => {
  return (
    <div className='min-h-[60vh] cursor-pointer rounded-xl border-4 border-solid border-[#E5E8ED] bg-white shadow'>
      <div className=' rounded-tl-lg rounded-tr-lg bg-[#F2F2F2] px-4 pb-[6px] pt-2'>
        <div className='align-center flex items-center justify-between'>
          <h4 className='text-xs font-medium leading-[18px] text-[#344054]'>
            {title}
          </h4>
          <span className='rounded-full border border-[#EAECF0] bg-[#F9FAFB] px-2 py-[2px] text-xs leading-[18px] text-[#344054]'>
            {count}
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-4 px-2'>{children}</div>
    </div>
  );
};
