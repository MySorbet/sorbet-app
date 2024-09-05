import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { config } from '@/lib/config';
import { TOKEN_ABI } from '@/constant/abis';

export const useWalletBalances = (walletAddress: string) => {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (!walletAddress) {
          return;
        }

        const provider = new ethers.JsonRpcProvider(config.baseRpcUrl);

        const ethBalanceWei = await provider.getBalance(walletAddress);
        const ethBalanceInEth = ethers.formatEther(ethBalanceWei);
        setEthBalance(ethBalanceInEth);

        const usdcContract = new ethers.Contract(
          config.usdcAddress,
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
    };

    fetchBalances();
  }, [walletAddress]);

  return { ethBalance, usdcBalance, loading };
};
