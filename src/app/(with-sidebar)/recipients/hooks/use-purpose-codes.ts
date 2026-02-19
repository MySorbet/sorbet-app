import { useQuery } from '@tanstack/react-query';

import { recipientsApi } from '@/api/recipients/recipients';

/** RQ wrapper for GET /recipients/purpose-codes */
export const usePurposeCodes = (paymentMethod: string | undefined) => {
  return useQuery({
    queryKey: ['purposeCodes', paymentMethod],
    queryFn: () => recipientsApi.getPurposeCodes(paymentMethod ?? ''),
    enabled: !!paymentMethod,
    staleTime: 10 * 60 * 1000, // 10 min — codes don't change often
  });
};
