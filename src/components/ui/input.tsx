import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  'flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-input bg-background',
        noRing: 'border border-input bg-background',
        noBorderOrRing: '',
      }
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  suffix?: React.ReactNode;
  prefix?: string;
  rootClassName?: string;
}


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, suffix, prefix, rootClassName, ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center', rootClassName)}>
        {prefix && (
          <span className='text-sm text-muted-foreground bg-muted h-10 flex flex-col justify-center border border-input rounded-md rounded-r-none py-2 px-3 border-r-0 font-medium'>
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
          <div className='absolute right-3 text-sm text-muted-foreground top-0 bottom-0 flex items-center'>
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
