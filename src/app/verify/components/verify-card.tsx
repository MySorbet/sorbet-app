import { forwardRef } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** Common card styles for all verify cards. Compose with other components to create a specific verify card. */
export const VerifyCard = forwardRef<
  HTMLDivElement,
  {
    children?: React.ReactNode;
    className?: string;
  }
>(({ children, className }, ref) => {
  return (
    <Card ref={ref} className={cn('p-6', className)}>
      {children}
    </Card>
  );
});

VerifyCard.displayName = 'VerifyCard';
