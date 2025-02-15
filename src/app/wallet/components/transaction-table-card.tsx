import { forwardRef } from 'react';

import { Card } from '@/components/ui/card';

/** A styled card for wallet page cards */
export const TransactionTableCard = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }: { children: React.ReactNode }, ref) => {
  return (
    <Card className='relative min-h-full rounded-2xl p-6' ref={ref}>
      {children}
    </Card>
  );
});

TransactionTableCard.displayName = 'TransactionTableCard';
