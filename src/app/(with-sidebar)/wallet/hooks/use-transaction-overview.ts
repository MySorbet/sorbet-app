import { useQuery } from '@tanstack/react-query';

import { getOverview } from '@/api/transactions';
import { useMyChain } from '@/hooks/use-my-chain';
import { TransactionOverview } from '@/types/transactions';

/** Use RQ to fetch transaction overview data for the current smart wallet (provided by privy) */
export const useTransactionOverview = (last_days?: number) => {
  const { data: myChainData } = useMyChain();
  const currentChain = myChainData?.chain ?? 'base';

  return useQuery<TransactionOverview>({
    queryKey: ['transactionOverview', currentChain, last_days],
    queryFn: async () => {
      const response = await getOverview(last_days);
      return response.data;
    },
  });
};
