import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Invoice } from './invoice-table';

// TODO: Match these colors exactly and sensibly
const variants: Record<Invoice['status'], string> = {
  paid: 'border-green-600/40 border-solid bg-green-100 text-green-600 hover:bg-green-200/80',
  overdue: 'bg-red-100/40 border-red-600/40 text-red-600 hover:bg-red-200/80',
  cancelled: 'bg-red-100/40 border-red-600/40 text-red-600 hover:bg-red-200/80',
  open: 'bg-sorbet/10 border-sorbet/30 text-sorbet hover:bg-sorbet/30',
};

const invoiceStatusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize',
  {
    variants: {
      variant: variants,
    },
    defaultVariants: {
      variant: 'open',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof invoiceStatusBadgeVariants> {}

/**
 * Copy of shadcn Badge with variants for invoice status
 */
function InvoiceStatusBadge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(invoiceStatusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { InvoiceStatusBadge, invoiceStatusBadgeVariants };
