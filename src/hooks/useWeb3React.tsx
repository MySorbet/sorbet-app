import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { env } from '@/lib/env';
import { TOKEN_ABI } from '@/constant/abis';

export const useWalletBalances = (walletAddress: string) => {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Ignore empty string wallet address
        if (!walletAddress) return;

        const provider = new ethers.JsonRpcProvider(
          env.NEXT_PUBLIC_BASE_RPC_URL
        );

        const ethBalanceWei = await provider.getBalance(walletAddress);
        const ethBalanceInEth = ethers.formatEther(ethBalanceWei);
        setEthBalance(ethBalanceInEth);

        const usdcContract = new ethers.Contract(
          env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
          TOKEN_ABI,
          provider
        );
        const usdcBalanceRaw = await usdcContract.balanceOf(walletAddress);
        const usdcDecimals = await usdcContract.decimals();
        const usdcBalanceFormatted = ethers.formatUnits(
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
  }, [walletAddress]);

  return { ethBalance, usdcBalance, loading };
};
