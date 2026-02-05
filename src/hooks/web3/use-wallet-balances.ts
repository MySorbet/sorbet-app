'use client';

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
    usdcContractInstance = new ethers.Contract(
      env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
      TOKEN_ABI,
      getProvider()
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

export const useWalletBalances = () => {
  const { baseAddress, stellarAddress, isLoading } = useWalletAddress();

  const horizonUrl = env.NEXT_PUBLIC_TESTNET
    ? env.NEXT_PUBLIC_STELLAR_HORIZON_URL_TESTNET
    : env.NEXT_PUBLIC_STELLAR_HORIZON_URL_PUBLIC;

  const base = useQuery({
    enabled: !isLoading && !!baseAddress,
    queryKey: ['usdcBalance', 'base', baseAddress],
    queryFn: async (): Promise<string> => {
      if (!baseAddress) return '0';
      const usdc = getUsdcContract();
      const [raw, decimals] = await Promise.all([
        usdc.balanceOf(baseAddress),
        usdc.decimals(),
      ]);
      return ethers.utils.formatUnits(raw, decimals);
    },
  });

  const stellar = useQuery({
    enabled: !isLoading && !!stellarAddress,
    queryKey: ['usdcBalance', 'stellar', stellarAddress],
    queryFn: async (): Promise<string> => {
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
        return '0';
      }
    },
  });

  return {
    baseUsdc: base.data,
    stellarUsdc: stellar.data,
    isLoading: isLoading || base.isLoading || stellar.isLoading,
    refetchBase: base.refetch,
    refetchStellar: stellar.refetch,
  };
};
