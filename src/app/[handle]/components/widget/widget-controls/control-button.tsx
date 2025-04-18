import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Base button for widget controls.
 * TODO: Use design tokens
 */
export const ControlButton = forwardRef<
  HTMLButtonElement,
  {
    isActive?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
  }
>(({ isActive, onClick, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'text-primary-foreground flex size-6 min-w-fit items-center justify-center rounded-sm transition-colors',
        isActive && 'bg-[#D0ADFF] text-[#18181B]', // --purple-lightest
        !isActive && 'hover:bg-[#D0ADFF]/30'
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick?.();
      }}
      {...props}
    >
      {children}
    </button>
  );
});
