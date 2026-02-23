/** Composable Header for all pages */
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Composable Header for all pages
 * - Lays out a title and optional children with justify between
 */
export const Header = forwardRef<
  HTMLDivElement,
  {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ title, subtitle, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex w-full items-center justify-center border-b px-6 pb-4 pt-[1px]',
        'md:min-h-[72px]',
        className
      )}
      {...props}
    >
      <div className='flex w-full max-w-7xl items-center justify-between gap-4'>
        <div className='min-w-0 flex-1 space-y-0.5'>
          <h1 className='text-2xl font-semibold'>{title}</h1>
          {subtitle && (
            <p className='text-muted-foreground text-sm'>{subtitle}</p>
          )}
        </div>
        {children && <div className='shrink-0'>{children}</div>}
      </div>
    </div>
  );
});

Header.displayName = 'Header';
