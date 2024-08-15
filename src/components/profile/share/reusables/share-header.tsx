import { ChevronLeft, X } from 'lucide-react';

import { DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const Header = ({
  title,
  description,
  canGoBack,
  navigateToPrevious,
}: {
  title: string;
  description?: string;
  canGoBack?: boolean;
  navigateToPrevious?: () => void;
}) => {
  return (
    <DialogTitle className='flex flex-col items-center gap-3 px-[9px]'>
      <DialogClose className='fixed right-6 top-5'>
        <X className='h-6 w-6 text-[#98A2B3]' />
      </DialogClose>
      {canGoBack && (
        <Button
          className='fixed left-6 top-5 m-0 h-6 border-none bg-transparent p-0 hover:bg-transparent'
          onClick={navigateToPrevious}
        >
          <ChevronLeft
            className=' h-6 w-6 text-[#98A2B3]'
            style={{ margin: 0 }}
          />
        </Button>
      )}
      <span className='text-2xl font-semibold text-[#101828]'>{title}</span>
      <span className='text-center text-base font-medium text-[#344054]'>
        {description}
      </span>
    </DialogTitle>
  );
};
