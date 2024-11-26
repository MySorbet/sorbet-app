import { useQuery } from '@tanstack/react-query';

import { getBridgeCustomer } from '@/api/bridge';

export const useBridgeCustomer = () => {
  return useQuery({
    queryKey: ['bridgeCustomer'],
    queryFn: getBridgeCustomer,
  });
};
