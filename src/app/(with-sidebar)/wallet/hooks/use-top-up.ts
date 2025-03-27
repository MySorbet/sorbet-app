import { useFundWallet } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { base, baseSepolia } from 'viem/chains';

import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';

/**
 * Hook that provides a function to top up the wallet with USDC
 *
 * It was migrated from the old wallet page. Revisit for possible improvements.
 */
export const useTopUp = () => {
  const { refetch } = useWalletBalance();
  const { smartWalletAddress } = useSmartWalletAddress();
  const { fundWallet } = useFundWallet();

  const topUp = async () => {
    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    try {
      const defaultFundAmount = '1.00';
      if (smartWalletAddress) {
        await fundWallet(smartWalletAddress, {
          chain,
          amount: defaultFundAmount,
          asset: 'USDC',
        });
      }

      // Note that awaiting the fundWallet call is not effective.
      // Funds can take slightly longer to show up so this refetch is really just in case they show up fast
      refetch();
    } catch (e) {
      toast.error('Something went wrong', {
        description: 'There was an issue funding your wallet. Please try again',
      });
    }
  };

  return { topUp };
};
