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
export const useSendUSDCFromExternalWallet = (sendAfterConnect = false) => {
  const { connectWallet } = usePrivy();

  // This gets the first non-privy wallet
  const { wallets } = useWallets();
  const wallet = wallets.find((wallet) => wallet.walletClientType !== 'privy');

  // TODO: getRecipientWalletAddressByHandle
  const recipientWalletAddress = '0xBB5923098D84EB0D9DAaE2975782999364CE87A2';
  // TODO: dynamic amount
  const amount = '1';
  const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;

  const send = useCallback(async () => {
    try {
      if (!wallet) throw new Error('There was no valid connected wallet found');

      const provider = await wallet.getEthereumProvider();
      const transferData = encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: 'transfer',
        args: [recipientWalletAddress, parseUnits(amount.toString(), 6)],
      });

      const transferTransactionHash = await provider.request?.({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.address,
            to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS as `0x${string}`,
            data: transferData,
          },
        ],
      });
      console.log(transferTransactionHash);
      toast.success('Sent 1 USDC', {
        description: `Transaction hash: ${transferTransactionHash}`,
      });
    } catch (error) {
      console.error(error);
      toast.error('We ran into an issue', {
        description: <pre className='text-wrap text-xs'>{`${error}`}</pre>,
      });
    }
  }, [recipientWalletAddress, wallet]);

  useEffect(() => {
    (async () => {
      console.log('wallets');
      console.log(wallets);
      if (wallet) {
        wallet.switchChain(chain.id);
        if (sendAfterConnect) {
          console.log('sending');
          send();
        }
      }
    })();
  }, [chain.id, wallet, wallets, sendAfterConnect, send]);

  return { wallet, connectWallet, send };
};
