import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Base button for widget controls.
 * - Prevents event default to avoid triggering opening parent a tag (widget root)
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
        isActive && 'bg-sorbet-lightest text-widget-controls-grey',
        !isActive && 'hover:bg-sorbet-lightest/30'
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      {...props}
    >
      {children}
    </button>
  );
});
