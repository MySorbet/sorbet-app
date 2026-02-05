import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyChain, setMyChain, type SorbetChain } from '@/api/user/chain';

export const myChainQueryKey = ['me', 'chain'] as const;

export const useMyChain = () => {
  return useQuery({
    queryKey: myChainQueryKey,
    queryFn: getMyChain,
  });
};

export const useSetMyChain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chain: SorbetChain) => await setMyChain(chain),
    onSuccess: (data) => {
      queryClient.setQueryData(myChainQueryKey, data);
    },
  });
};

