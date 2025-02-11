import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getBridgeCustomer } from '@/api/bridge';
import type { BridgeCustomer } from '@/types/bridge';

export const useBridgeCustomer = <
  T extends Omit<UseQueryOptions<BridgeCustomer>, 'queryKey' | 'queryFn'>
>(
  options?: T
) => {
  return useQuery<BridgeCustomer>({
    queryKey: ['bridgeCustomer'],
    queryFn: getBridgeCustomer,
    ...options,
  });
};
