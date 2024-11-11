import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'focus:ring-2 focus:ring-ring focus:ring-offset-2',
        noRing: '',
      }
    },
    defaultVariants: {
      variant: 'default', // Set default variant
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  suffix?: string;
  prefix?: string;
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, suffix, prefix, ...props }, ref) => {
    return (
      <div className='relative flex items-center'>
        {prefix && (
          <span className='text-sm text-muted-foreground bg-muted h-10 flex flex-col justify-center border border-input rounded-md rounded-r-none p-2 border-r-0'>
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant }), // Use inputVariants with variant prop
            suffix && 'pr-10',
            prefix && 'rounded-l-none',
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className='absolute right-3 text-sm text-muted-foreground'>
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };