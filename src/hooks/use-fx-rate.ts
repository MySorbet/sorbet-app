import { useQuery } from '@tanstack/react-query';

import { getFxRate } from '@/api/due/due';

/**
 * Fetch the mid-rate for a currency pair via sorbet-api → Due /fx/markets.
 *
 * - Only fires when `from !== to` (no-op for USD→USD)
 * - Cached for 5 minutes; no polling — the rate is indicative and the invoice
 *   disclaimer covers any rate change at settlement time
 */
export const useFxRate = (from: string, to: string) => {
  return useQuery({
    queryKey: ['fxRate', from, to],
    queryFn: () => getFxRate(from, to),
    enabled: from !== to,
    staleTime: 5 * 60 * 1000,
  });
};
