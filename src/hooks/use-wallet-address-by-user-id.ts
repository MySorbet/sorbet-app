import { useQuery } from '@tanstack/react-query';

import { getCurrentWalletAddressByUserId } from '@/api/user';

export const useWalletAddressByUserId = (userId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['walletAddressByUserId'],
    queryFn: () => getCurrentWalletAddressByUserId(userId),
  });
  return { data, isLoading };
};
