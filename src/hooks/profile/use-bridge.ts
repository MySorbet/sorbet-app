import { useQuery } from '@tanstack/react-query';

import { getBridgeCustomer } from '@/api/user';

export const useBridgeCustomer = () => {
  return useQuery({
    queryKey: ['bridgeCustomer'],
    queryFn: getBridgeCustomer,
  });
};
