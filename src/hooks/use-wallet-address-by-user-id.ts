import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getCurrentWalletAddressByUserId } from '@/api/user';

export const useWalletAddressByUserId = (
  userId: string,
  options?: Partial<UseQueryOptions<string>>
) => {
  const { data, isLoading } = useQuery({
    queryKey: ['walletAddressByUserId', userId],
    queryFn: () => getCurrentWalletAddressByUserId(userId),
    ...options,
  });
  return { data, isLoading };
};
