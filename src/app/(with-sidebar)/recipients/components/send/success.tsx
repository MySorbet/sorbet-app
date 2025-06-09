import { Wallet } from 'lucide-react';

import { RecipientAPI } from '@/api/recipients/types';
import { formatCurrency } from '@/lib/currency';
import { formatWalletAddress } from '@/lib/utils';

import { Timing } from './timing';
import { TransactionStatusBadge } from './transaction-status-badge';

export const Success = ({
  amount,
  recipient,
}: {
  amount: number;
  recipient: RecipientAPI;
}) => {
  const label =
    recipient.type === 'crypto'
      ? formatWalletAddress(recipient.walletAddress)
      : `${recipient.label} ****${recipient.detail}`;
  const status = recipient.type === 'crypto' ? 'completed' : 'processing';
  return (
    <div className='animate-in fade-in-0 flex flex-col items-center justify-center gap-6'>
      <div className='space-y-2 text-center'>
        <p className='text-muted-foreground text-sm font-medium leading-none'>
          You sent
        </p>
        <p className='text-xl font-semibold'>{formatCurrency(amount)}</p>
        <p className='text-muted-foreground flex items-center gap-1 text-xs leading-none'>
          {recipient.type === 'crypto' && <Wallet className='size-3' />} {label}
        </p>
      </div>
      <div className='space-y-2 text-center'>
        <TransactionStatusBadge status={status} />
        <Timing type={recipient.type} />
      </div>
    </div>
  );
};
