import { ArrowRight } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Root component for the card button. Compose with other `CardButton` components
 *
 * Note: Based on and very similar to `RecipientButton`. Consider sharing this as a common component
 */
export const CardButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ onClick, className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        'bg-background border-neutral-lighter hover:bg-primary-foreground/50 group flex min-w-56 justify-between gap-3 rounded-lg border p-6 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={onClick}
      type='button'
      ref={ref}
      {...props}
    >
      {children}
      <ArrowRight className='text-foreground size-4 shrink-0 transition-transform duration-200 ease-in-out group-hover:translate-x-1' />
    </button>
  );
});

/** Content component for the card button. */
export const CardButtonContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className='space-y-2 text-left'>{children}</div>;
};

/** Title of a card button. Render inside `CardButtonContent`. */
export const CardButtonTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span className='text-sm font-medium'>{children}</span>;
};

/** Description of a card button. Render inside `CardButtonContent`. */
export const CardButtonDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className='text-muted-foreground text-xs'>{children}</p>;
};

/** Detail of a card button. Render inside `CardButtonContent`. */
export const CardButtonDetail = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className='text-sorbet-blue pt-2 text-xs'>{children}</div>;
};
