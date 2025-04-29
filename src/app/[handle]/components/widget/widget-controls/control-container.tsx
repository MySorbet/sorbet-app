import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Dark background container for widget controls.
 */
export const ControlContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-primary-foreground bg-widget-controls-grey flex items-center justify-center gap-1 rounded-lg p-1 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
