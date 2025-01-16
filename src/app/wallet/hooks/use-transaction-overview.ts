import { useQuery } from '@tanstack/react-query';

import { getOverview } from '@/api/transactions';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { TransactionOverview } from '@/types/transactions';

/** Use RQ to fetch transaction overview data for the current smart wallet (provided by privy) */
export const useTransactionOverview = (last_days = 30) => {
  const { smartWalletAddress } = useSmartWalletAddress();

  return useQuery<TransactionOverview>({
    queryKey: ['transactionOverview', smartWalletAddress, last_days],
    queryFn: async () => {
      // Never happens since we use enabled below. This condition satisfies TS.
      if (!smartWalletAddress)
        throw new Error(
          'transactionOverview Query called with no smart wallet address'
        );

      const response = await getOverview(smartWalletAddress, last_days);
      return response.data;
    },
    enabled: smartWalletAddress !== null,
  });
};
