import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

export const Option = ({
  asset,
  title,
}: {
  asset: ReactNode;
  title: string;
}) => {
  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-4'>
        <Icon>{asset}</Icon>
        <span className='text-lg font-medium text-[#101828]'>{title}</span>
      </div>
      <ChevronRight className='text-[#475467]' />
    </div>
  );
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-[52px] w-[52px] items-center justify-center rounded-xl border-2 border-[#D0D5DD] bg-[#FFFFFF] shadow-sm'>
      {children}
    </div>
  );
}
