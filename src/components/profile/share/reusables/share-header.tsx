import { ChevronLeft, X } from 'lucide-react';

import { DialogClose, DialogHeader } from '@/components/ui/dialog';

export const Header = ({
  title,
  description,
  canGoBack,
}: {
  title: string;
  description?: string;
  canGoBack?: boolean;
}) => {
  return (
    <DialogHeader className='flex flex-col items-center gap-3 px-[9px]'>
      <DialogClose className='fixed right-6 top-6'>
        <X className='h-6 w-6 text-[#98A2B3]' />
      </DialogClose>
      {canGoBack && (
        <ChevronLeft
          className='fixed left-6 top-6 h-6 w-6 text-[#98A2B3]'
          style={{ margin: 0 }}
        />
      )}
      <span className='text-2xl font-semibold text-[#101828]'>{title}</span>
      <span className='text-center text-base font-medium text-[#344054]'>
        {description}
      </span>
    </DialogHeader>
  );
};
