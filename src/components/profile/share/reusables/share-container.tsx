import { ReactNode } from 'react';

import { DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const Container = ({
  children,
  gap,
}: {
  children: ReactNode;
  gap: string;
}) => {
  return (
    <>
      <DialogOverlay />
      <DialogContent
        className={cn(
          'flex  w-[400px] flex-col items-center rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl',
          `gap-${gap}`
        )}
        customDialogClose='hidden'
        aria-description='Share your profile!'
      >
        {children}
      </DialogContent>
    </>
  );
};
