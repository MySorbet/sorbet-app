import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getDueVirtualAccounts } from '@/api/due/due';
import type { DueVirtualAccount } from '@/types/due';

export const useDueVirtualAccounts = <
  T extends Omit<UseQueryOptions<DueVirtualAccount[]>, 'queryKey' | 'queryFn'>
>(
  options?: T
) => {
  return useQuery<DueVirtualAccount[]>({
    queryKey: ['dueVirtualAccounts'],
    queryFn: getDueVirtualAccounts,
    ...options,
  });
};
