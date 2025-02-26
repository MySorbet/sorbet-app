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
    children?: React.ReactNode;
    className?: string;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ title, children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-border flex h-fit w-full items-center justify-center border-b px-6 py-4',
        className
      )}
      {...props}
    >
      <div className='flex w-full max-w-7xl items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        {children}
      </div>
    </div>
  );
});

Header.displayName = 'Header';
