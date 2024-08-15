import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export const Option = ({
  asset,
  title,
  navigate,
  socialIcon,
}: {
  asset: ReactNode;
  title: string;
  navigate?: () => void;
  socialIcon?: boolean;
}) => {
  return (
    <Button
      className='group flex w-full items-center justify-between border-none bg-transparent p-0 hover:bg-transparent'
      onClick={navigate}
    >
      <div className='flex items-center gap-4'>
        {socialIcon ? asset : <Icon>{asset}</Icon>}

        <span className='text-lg font-medium text-[#101828]'>{title}</span>
      </div>
      <ChevronRight className='text-[#475467] transition ease-out group-hover:translate-x-1' />
    </Button>
  );
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-[52px] w-[52px] items-center justify-center rounded-xl border-2 border-[#D0D5DD] bg-[#FFFFFF] shadow-sm'>
      {children}
    </div>
  );
}
