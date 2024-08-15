import { ReactNode } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const Container = ({
  children,
  gap,
}: {
  children: ReactNode;
  gap: string;
}) => {
  return (
    <DialogContent
      className={cn(
        'flex  w-[400px] flex-col items-center rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl',
        `gap-${gap}`
      )}
      customDialogClose='hidden'
    >
      {children}
    </DialogContent>
  );
};
