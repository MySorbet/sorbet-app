import { Horizon } from '@stellar/stellar-sdk';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { TOKEN_ABI } from '@/constant/abis';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import { env } from '@/lib/env';

type StellarBalanceLine = {
  asset_code?: string;
  asset_issuer?: string;
  balance?: string;
};

// Singleton instances
let providerInstance: ethers.providers.JsonRpcProvider | null = null;
let usdcContractInstance: ethers.Contract | null = null;
let horizonServerInstance: Horizon.Server | null = null;
let horizonServerUrl: string | null = null;

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

const getHorizonServer = (horizonUrl: string) => {
  if (!horizonServerInstance || horizonServerUrl !== horizonUrl) {
    horizonServerInstance = new Horizon.Server(horizonUrl);
    horizonServerUrl = horizonUrl;
  }
  return horizonServerInstance;
};

/**
 * Use RQ and ethers to fetch the user's USDC balance (for smart wallet)
 */
export const useWalletBalance = () => {
  const { currentChain, baseAddress, stellarAddress, isLoading } =
    useWalletAddress();

  const horizonUrl = env.NEXT_PUBLIC_TESTNET
    ? env.NEXT_PUBLIC_STELLAR_HORIZON_URL_TESTNET
    : env.NEXT_PUBLIC_STELLAR_HORIZON_URL_PUBLIC;

  const enabled =
    !isLoading &&
    ((currentChain === 'base' && !!baseAddress) ||
      (currentChain === 'stellar' && !!stellarAddress));

  return useQuery({
    enabled,
    queryKey: [
      'usdcBalance',
      currentChain,
      currentChain === 'base' ? baseAddress : stellarAddress,
    ],
    queryFn: async () => {
      if (currentChain === 'base') {
        if (!baseAddress) return '0';
        const usdcContract = getUsdcContract();
        const usdcBalanceRaw = await usdcContract.balanceOf(baseAddress);
        const usdcDecimals = await usdcContract.decimals();
        return ethers.utils.formatUnits(usdcBalanceRaw, usdcDecimals);
      }

      // Stellar: balance is already returned as a decimal string by Horizon.
      if (!stellarAddress) return '0';
      try {
        const server = getHorizonServer(horizonUrl);
        const account = await server.loadAccount(stellarAddress);
        const balances = account.balances as unknown as StellarBalanceLine[];
        const bal = balances.find((b) => {
          const code = String(b.asset_code ?? '');
          const issuer = String(b.asset_issuer ?? '');
          return (
            code === env.NEXT_PUBLIC_STELLAR_USDC_ASSET_CODE &&
            issuer === env.NEXT_PUBLIC_STELLAR_USDC_ISSUER
          );
        });
        return String(bal?.balance ?? '0');
      } catch {
        // Account not found / not funded / no trustline yet.
        return '0';
      }
    },
  });
};
