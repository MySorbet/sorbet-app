import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

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
        'flex size-6 min-w-fit items-center justify-center rounded-sm text-white',
        isActive && 'bg-[#D0ADFF] text-[#18181B]' // --purple-lightest
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});
