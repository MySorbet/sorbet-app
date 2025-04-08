import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Dark background container for widget controls.
 * TODO: Use design tokens
 */
export const ControlContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-primary-foreground flex items-center justify-center gap-1 rounded-lg bg-[#18181B] p-1 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
