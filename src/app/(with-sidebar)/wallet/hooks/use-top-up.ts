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
    if (!smartWalletAddress) {
      toast.error('Wallet not ready', {
        description: 'Please try again in a moment once your wallet is connected.',
      });
      return;
    }

    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    try {
      const defaultFundAmount = '1.00';
      await fundWallet(smartWalletAddress, {
        chain,
        amount: defaultFundAmount,
        asset: 'USDC',
      });

      // Note that awaiting the fundWallet call is not effective.
      // Funds can take slightly longer to show up so this refetch is really just in case they show up fast
      refetch();
    } catch (e) {
      const description =
        e instanceof Error && e.message
          ? e.message
          : 'There was an issue funding your wallet. Please try again';
      toast.error('Something went wrong', { description });
    }
  };

  return { topUp };
};
