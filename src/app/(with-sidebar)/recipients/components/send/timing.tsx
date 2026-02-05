import { Clock } from 'lucide-react';

import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';
import type { RecipientType } from '@/api/recipients/types';

export const Timing = ({ type }: { type: RecipientType | 'crypto' }) => {
  const time =
    type === 'usd' || type === 'eur'
      ? PAYMENT_TIMING_DESCRIPTIONS.bank
      : PAYMENT_TIMING_DESCRIPTIONS.crypto;
  return (
    <p className='text-muted-foreground flex items-center gap-1 text-xs leading-none'>
      <Clock className='size-3' /> {time}
    </p>
  );
};
