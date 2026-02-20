import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight } from 'lucide-react';

import { getExchangeRate } from '@/api/bridge/bridge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/currency';

/** Render exchange rate and conversion info for USD to EUR
 * @param amount - The amount in USD to convert
 * @param variant - 'form' for form styling (text-sm, larger icon) or 'preview' for preview styling (text-xs, smaller icon)
 * @param showConversion - Only show if true (for form usage)
 */
export const ExchangeRate = ({
  amount,
  variant = 'preview',
  showConversion,
}: {
  amount?: number;
  variant?: 'form' | 'preview';
  showConversion?: boolean;
}) => {
  const { data: exchangeRate, isPending } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: () => getExchangeRate(),
  });

  const isForm = variant === 'form';
  const rate = exchangeRate?.midmarket_rate;

  // For form variant, check if we should show
  if (isForm && (!showConversion || !amount || amount <= 0)) {
    return null;
  }

  if (isPending) {
    return <Skeleton className={isForm ? 'mt-2 h-8 w-full' : 'h-4 w-16'} />;
  }

  const rateNumber = Number(rate || 0);
  const convertedAmount = amount && amount > 0 ? amount * rateNumber : 0;
  const formattedEUR =
    convertedAmount > 0
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
        }).format(convertedAmount)
      : null;

  // Form variant styling
  if (isForm) {
    return (
      <div className='text-muted-foreground space-y-0.5 text-sm'>
        <p className='flex items-center gap-1.5'>
          <ArrowLeftRight className='size-3.5' />
          <span>Conversion rate {rate}</span>
        </p>
        {formattedEUR && (
          <p className='ml-5'>
            {formatCurrency(amount)} ≈ {formattedEUR}
          </p>
        )}
      </div>
    );
  }

  // Preview variant styling (default)
  return (
    <>
      <p className='text-muted-foreground flex items-center gap-1.5 text-xs leading-none'>
        <ArrowLeftRight className='size-3' /> Conversion rate {rate}
      </p>
      {formattedEUR && (
        <p className='text-muted-foreground ml-5 text-xs leading-none'>
          {formatCurrency(amount)} ≈ {formattedEUR}
        </p>
      )}
    </>
  );
};
