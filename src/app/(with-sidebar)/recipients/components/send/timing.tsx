import { Clock } from 'lucide-react';

import type { RecipientType } from '@/api/recipients/types';
import { PAYMENT_TIMING_DESCRIPTIONS } from '@/app/invoices/utils';

/** Maps RecipientType to timing category (bank vs crypto) */
function getTimingCategory(type: RecipientType): 'usd' | 'eur' | 'crypto' {
  if (type === 'crypto') return 'crypto';
  if (type === 'usd' || type.startsWith('usd_')) return 'usd';
  return 'eur'; // eur, eur_sepa, eur_swift, aed_local
}

export const Timing = ({ type }: { type: RecipientType }) => {
  const category = getTimingCategory(type);
  const time =
    category === 'usd' || category === 'eur'
      ? PAYMENT_TIMING_DESCRIPTIONS.bank
      : PAYMENT_TIMING_DESCRIPTIONS.crypto;
  return (
    <p className='text-muted-foreground flex items-center gap-1 text-xs leading-none'>
      <Clock className='size-3' /> {time}
    </p>
  );
};
