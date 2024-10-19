import { useQuery } from '@tanstack/react-query';

export const USDCToUSD = () => {
  return useQuery({
    queryKey: ['USDCToUSDConversionRate'],
    queryFn: async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true'
        );
        const data = await response.json();
        const rate = data['usd-coin'].usd;
        return rate;
      } catch (error: unknown) {
        console.error('Error fetching USDC to USD conversion rate:', error);
        throw error;
      }
    },
  });
};
