import { forwardRef } from 'react';

/** A styled card for wallet page cards */
export const TransactionTableCard = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }: { children: React.ReactNode }, ref) => {
  return (
    <div
      className='bg-card relative min-h-full rounded-2xl p-6 shadow-md'
      ref={ref}
    >
      {children}
    </div>
  );
});

TransactionTableCard.displayName = 'TransactionTableCard';
