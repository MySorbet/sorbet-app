import { forwardRef } from 'react';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/** Render children (usually an invoice document) inside a card handling scroll */
export const InvoiceWindow = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <Card className={cn('flex-1 p-1', className)} ref={ref}>
      <ScrollArea className='size-full'>
        <div className='p-16'>{children}</div>
      </ScrollArea>
    </Card>
  );
});
