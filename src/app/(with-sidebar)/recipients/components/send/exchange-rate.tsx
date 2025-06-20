import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight } from 'lucide-react';

import { getExchangeRate } from '@/api/bridge/bridge';
import { Skeleton } from '@/components/ui/skeleton';

/** Render a detail line with the exchange rate for USD to EUR */
export const ExchangeRate = () => {
  const { data: exchangeRate, isPending } = useQuery({
    queryKey: ['exchangeRate'],
    queryFn: () => getExchangeRate(),
  });

  const rate = exchangeRate?.midmarket_rate;

  if (isPending) {
    return <Skeleton className='h-3 w-16' />;
  }

  return (
    <p className='text-muted-foreground flex items-center gap-1 text-xs leading-none'>
      <ArrowLeftRight className='size-3' /> Conversion rate {rate}
    </p>
  );
};
