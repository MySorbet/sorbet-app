import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { TOKEN_ABI } from '@/constant/abis';
import { env } from '@/lib/env';

// Singleton instances
let providerInstance: ethers.providers.JsonRpcProvider | null = null;
let usdcContractInstance: ethers.Contract | null = null;

const getProvider = () => {
  if (!providerInstance) {
    providerInstance = new ethers.providers.JsonRpcProvider(
      env.NEXT_PUBLIC_BASE_RPC_URL
    );
  }
  return providerInstance;
};

const getUsdcContract = () => {
  if (!usdcContractInstance) {
    const provider = getProvider();
    usdcContractInstance = new ethers.Contract(
      env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
      TOKEN_ABI,
      provider
    );
  }
  return usdcContractInstance;
};

/**
 * Use RQ and ethers to fetch the user's USDC balance
 */
export const useWalletBalance = () => {
  const { client } = useSmartWallets();
  return useQuery({
    enabled: !!client,
    queryKey: ['usdcBalance', client?.account.address],
    queryFn: async () => {
      if (!client) return;
      const usdcContract = getUsdcContract();
      const usdcBalanceRaw = await usdcContract.balanceOf(
        client.account.address
      );
      const usdcDecimals = await usdcContract.decimals();
      const usdcBalanceFormatted = ethers.utils.formatUnits(
        usdcBalanceRaw,
        usdcDecimals
      );
      return usdcBalanceFormatted;
    },
  });
};
