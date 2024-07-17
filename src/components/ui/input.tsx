import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, ...props }, ref) => {
    return (
      <div className='relative flex items-center'>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            suffix ? 'pr-10' : '', // Add padding to the right if there is a suffix
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className='absolute right-3 text-sm text-muted-foreground mr-7'>
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
