import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import { TOKEN_ABI } from '@/constant/abis';
import { env } from '@/lib/env';

/**
 * Hook to fetch wallet balances
 * @param walletAddress - Wallet address to fetch balances for
 * @param reload - Boolean to trigger a reload of balances
 * @returns - Object containing ethBalance, usdcBalance, and loading
 */
export const useWalletBalances = (
  walletAddress: string | null,
  reload?: boolean
) => {
  const [ethBalance, setEthBalance] = useState<string>('');
  const [usdcBalance, setUsdcBalance] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // TODO: convert to RQ so we can invalidate whenever a usdc is sent or received

  useEffect(() => {
    (async () => {
      try {
        // Ignore empty string wallet address
        if (!walletAddress) return;

        const provider = new ethers.providers.JsonRpcProvider(
          env.NEXT_PUBLIC_BASE_RPC_URL
        );

        const ethBalanceWei = await provider.getBalance(walletAddress);
        // TODO: Perhaps there is a better way to format this
        const ethBalanceInEth = parseFloat(
          ethers.utils.formatEther(ethBalanceWei)
        ).toFixed(4);
        setEthBalance(ethBalanceInEth);

        const usdcContract = new ethers.Contract(
          env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
          TOKEN_ABI,
          provider
        );
        const usdcBalanceRaw = await usdcContract.balanceOf(walletAddress);
        const usdcDecimals = await usdcContract.decimals();
        const usdcBalanceFormatted = ethers.utils.formatUnits(
          usdcBalanceRaw,
          usdcDecimals
        );
        setUsdcBalance(usdcBalanceFormatted);
      } catch (error) {
        console.error('Error fetching wallet balances:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [walletAddress, reload]);

  return { ethBalance, usdcBalance, loading };
};
