import { useQuery } from '@tanstack/react-query';

import { featureFlags } from '@/lib/flags';

/** RQ hook to fetch the exchange rate of USDC to USD via CoinGecko */
export const USDCToUSD = () => {
  return useQuery({
    queryKey: ['USDCToUSDConversionRate'],
    queryFn: async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd'
        );
        const data = await response.json();
        const rate = data['usd-coin'].usd;
        return rate;
      } catch (error: unknown) {
        console.error('Error fetching USDC to USD conversion rate:', error);
        return 1;
      }
    },
    enabled: featureFlags.coinGeckoApi,
  });
};
