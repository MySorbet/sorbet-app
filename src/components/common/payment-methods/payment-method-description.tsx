import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/** Rendering a payment method description. Compose this with `PaymentMethod`. */
export const PaymentMethodDescription = forwardRef<
  HTMLSpanElement,
  {
    className?: string;
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('text-muted-foreground text-sm font-normal', className)}
      {...props}
    >
      {children}
    </span>
  );
});
