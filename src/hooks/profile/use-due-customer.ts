import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getDueCustomer } from '@/api/due/due';
import type { DueCustomer } from '@/types/due';

export const useDueCustomer = <
  T extends Omit<UseQueryOptions<DueCustomer>, 'queryKey' | 'queryFn'>
>(
  options?: T
) => {
  return useQuery<DueCustomer>({
    queryKey: ['dueCustomer'],
    queryFn: getDueCustomer,
    ...options,
  });
};
