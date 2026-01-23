import { cva } from 'class-variance-authority';

import { Badge } from '@/components/ui/badge';

export type SimpleTransactionStatus =
  | 'Completed'
  | 'Processing'
  | 'In Review'
  | 'Returned'
  | 'Rejected';

const variants: Record<SimpleTransactionStatus, string> = {
  Completed: 'bg-[#DFFFD4] text-[#2A7C0E] border-transparent',
  Processing: 'bg-[#D9EFFF] text-[#055F9F] border-transparent',
  'In Review': 'bg-[#FFF7AD] text-[#6D6C0F] border-transparent',
  Returned: 'bg-[#F9E6FF] text-[#76059F] border-transparent',
  Rejected: 'bg-[#FFECEF] text-[#D80027] border-transparent',
};

const transactionStatusBadgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group',
  {
    variants: {
      variant: variants,
    },
    defaultVariants: {
      variant: 'Processing',
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
