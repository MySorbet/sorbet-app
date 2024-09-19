import React from 'react';

import { cn } from '@/lib/utils';

export const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-row justify-between gap-2', className)}
    {...props}
  />
));
