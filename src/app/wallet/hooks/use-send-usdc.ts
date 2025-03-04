import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { encodeFunctionData, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { TOKEN_ABI } from '@/constant/abis';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';

/**
 * Hook that provides a function to send USDC to another wallet
 *
 * It was migrated from the old wallet page. Revisit for possible improvements.
 */
export const useSendUSDC = () => {
  const { client } = useSmartWallets();
  const { refetch: refetchWalletBalance } = useWalletBalance();
  const { refetch: refetchTransactionOverview } = useTransactionOverview();

  const sendUSDC = async (amount: string, recipientWalletAddress: string) => {
    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    if (client) {
      await client.switchChain({
        id: chain.id,
      });

      // Transfer transaction
      const transferData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientWalletAddress, parseUnits(amount.toString(), 6)],
      });

      const transferTransactionHash = await client.sendTransaction({
        account: client.account,
        to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS as `0x${string}`,
        data: transferData,
      });

      // Refetch the wallet balance and transaction overview to update the UI right away
      refetchWalletBalance();
      refetchTransactionOverview();

      return transferTransactionHash;
    }
  };

  return { sendUSDC };
};
