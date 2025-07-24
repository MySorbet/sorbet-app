import { cva } from 'class-variance-authority';

import { Badge } from '@/components/ui/badge';

export type SimpleTransactionStatus = 'processing' | 'completed' | 'error';

const variants: Record<SimpleTransactionStatus, string> = {
  processing:
    'border-sorbet-orange text-sorbet-orange hover:bg-sorbet-orange/10',
  completed: 'border-emerald-500 text-emerald-500 hover:bg-emerald-200/10',
  error: 'border-rose-600 text-rose-600 hover:bg-rose-200/10',
};

const transactionStatusBadgeVariants = cva(
  'bg-transparent inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 capitalize group',
  {
    variants: {
      variant: variants,
    },
    defaultVariants: {
      variant: 'processing',
    },
  }
);
export const TransactionStatusBadge = ({
  status,
}: {
  status: SimpleTransactionStatus;
}) => {
  return (
    <Badge
      className={transactionStatusBadgeVariants({
        variant: status,
      })}
    >
      <span className='text-xs font-medium leading-none'>{status}</span>
    </Badge>
  );
};
