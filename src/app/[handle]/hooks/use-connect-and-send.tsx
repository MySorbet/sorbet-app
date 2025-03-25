import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { encodeFunctionData, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { TOKEN_ABI } from '@/constant/abis';
import { env } from '@/lib/env';

/**
 * Get functions to enable an external connected wallet to send USDC to a recipient wallet address
 *
 * @param sendAfterConnect - Will try to send as soon as an external wallet is connected
 * @returns The wallet, connectWallet function, and send function
 */
export const useConnectAndSend = ({
  amount,
  recipientWalletAddress,
  sendAfterConnect = false,
}: {
  amount?: number;
  recipientWalletAddress?: string;
  sendAfterConnect?: boolean;
}) => {
  const { connectWallet } = usePrivy();

  const { wallets } = useWallets();
  /** The first non-privy wallet */
  const wallet = wallets.find((wallet) => wallet.walletClientType !== 'privy');

  const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;

  /** Triggers a request to the connected wallet to send `amount` USDC to the recipient wallet address */
  const send = useCallback(async () => {
    try {
      if (!wallet) throw new Error('There was no valid connected wallet found');
      const provider = await wallet.getEthereumProvider();

      // Transfer `amount` USDC to the recipient wallet address
      const transferData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientWalletAddress, parseUnits(String(amount), 6)],
      });

      // Issue the transfer data to the USDC contract
      const transferTransactionHash = await provider.request?.({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.address,
            to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
            data: transferData,
          },
        ],
      });

      toast.success(`Sent ${amount} USDC`, {
        description: `Transaction hash: ${transferTransactionHash}`,
      });
    } catch (error) {
      console.error(error);
      toast.error('We ran into an issue', {
        description: <pre className='text-wrap text-xs'>{`${error}`}</pre>,
      });
    }
  }, [recipientWalletAddress, wallet, amount]);

  useEffect(() => {
    (async () => {
      console.log('wallets', wallets);
      if (wallet) {
        wallet.switchChain(chain.id);
        if (sendAfterConnect) {
          send();
        }
      }
    })();
  }, [chain.id, wallet, wallets, sendAfterConnect, send]);

  return { wallet, connectWallet, send };
};
