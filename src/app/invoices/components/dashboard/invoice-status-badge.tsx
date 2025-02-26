import { ChevronDown } from '@untitled-ui/icons-react';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { InvoiceStatus, InvoiceStatuses } from '../../utils';

// TODO: Match these colors exactly with design or sensibly if not
const variants: Record<InvoiceStatus, string> = {
  Paid: 'border-green-600/40 border-solid bg-green-100 text-green-600 hover:bg-green-200/80',
  Overdue: 'bg-red-100/40 border-red-600/40 text-red-600 hover:bg-red-200/80',
  Cancelled: 'bg-muted border-muted text-muted-foreground hover:bg-muted/80',
  Open: 'bg-sorbet/10 border-sorbet/30 text-sorbet hover:bg-sorbet/30',
};

const invoiceStatusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize group',
  {
    variants: {
      variant: variants,
    },
    defaultVariants: {
      variant: 'Open',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLButtonElement | HTMLDivElement>,
    VariantProps<typeof invoiceStatusBadgeVariants> {
  /** Function to call when the user selects a new status. Only called if interactive is true */
  onValueChange?: (value: InvoiceStatus) => void;
  /** Whether the badge is interactive with a dropdown menu */
  interactive?: boolean;
}

/**
 * Copy of shadcn Badge with variants for invoice status.
 * Can be interactive with a dropdown menu or not.
 *
 * Badges with variant 'Cancelled' cannot be interactive since they cannot be reopened.
 */
function InvoiceStatusBadge({
  className,
  variant,
  children,
  onValueChange,
  interactive = false,
  ...props
}: BadgeProps) {
  // If the badge is not interactive
  // Return the classic shad style badge
  if (!interactive) {
    return (
      <div
        className={cn(invoiceStatusBadgeVariants({ variant }), className)}
        {...props}
      >
        {children}
        {variant}
      </div>
    );
  }
  // Otherwise, we'll return a badge with a dropdown menu allowing the user to change the status
  // TODO: Consider using popover instead of dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(invoiceStatusBadgeVariants({ variant }), className)}
          {...props}
        >
          {children}
          {variant}
          <ChevronDown className='ml-1 size-3 transition-transform group-hover:translate-y-0.5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={variant ?? 'Open'}
          onClick={(e) => e.stopPropagation()} // Included to prevent the click event from bubbling up to UI behind the dropdown
          onValueChange={(value) => onValueChange?.(value as InvoiceStatus)} // Cast is safe because all children are valid InvoiceStatus values
        >
          {InvoiceStatuses.filter((status) => {
            return (
              status !== variant && // Filter out the current variant (since you don't need to change it)
              status !== 'Overdue' && // Filter out overdue since it is cosmetic
              !(variant === 'Overdue' && status === 'Open') // If the badge is overdue, you can't mark it as open (b/c it's already open)
            );
          }).map((status) => (
            <DropdownMenuRadioItem key={status} value={status} className='pl-2'>
              {status}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { InvoiceStatusBadge, invoiceStatusBadgeVariants };
