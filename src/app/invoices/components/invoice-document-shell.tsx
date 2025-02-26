import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export const InvoiceDocumentShell = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'shadow-invoice animate-in fade-in slide-in-from-bottom-1 rounded-2xl',
        className
      )}
    >
      {children}
    </div>
  );
});
