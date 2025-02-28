import { forwardRef } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** A styled card for wallet page cards */
export const TransactionTableCard = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <Card className={cn('relative h-fit p-6', className)} ref={ref}>
      {children}
    </Card>
  );
});

TransactionTableCard.displayName = 'TransactionTableCard';
