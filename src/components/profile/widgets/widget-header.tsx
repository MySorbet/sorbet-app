import { cn } from '@/lib/utils';
import React from 'react';

export const WidgetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-row gap-2 justify-between', className)}
    {...props}
  />
));
