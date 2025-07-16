import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/** Wraps an invoice document to be rendered within an `InvoiceWindow` with animation and shadow */
export const InvoiceDocumentShell = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'shadow-invoice animate-in fade-in slide-in-from-bottom-1 mx-auto w-fit rounded-2xl',
        className
      )}
    >
      {children}
    </div>
  );
});
