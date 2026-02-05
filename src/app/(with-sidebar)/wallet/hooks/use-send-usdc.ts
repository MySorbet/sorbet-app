import { useSignRawHash } from '@privy-io/react-auth/extended-chains';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import {
  Asset,
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import Big from 'big.js';
import { encodeFunctionData, parseUnits } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { useTransactionOverview } from '@/app/(with-sidebar)/wallet/hooks/use-transaction-overview';
import { TOKEN_ABI } from '@/constant/abis';
import { useWalletAddress } from '@/hooks/use-wallet-address';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';
import { env } from '@/lib/env';

const bytesToHex = (bytes: ArrayLike<number>) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const hexToBytes = (hex: string) => {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};

const bytesToBase64 = (bytes: Uint8Array) => {
  // Avoid Buffer usage in the browser.
  let binary = '';
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

/**
 * Hook that provides a function to send USDC to another wallet
 *
 * It was migrated from the old wallet page. Revisit for possible improvements.
 */
export const useSendUSDC = () => {
  const { client } = useSmartWallets();
  const { signRawHash } = useSignRawHash();
  const { refetch: refetchWalletBalance } = useWalletBalance();
  const { refetch: refetchTransactionOverview } = useTransactionOverview();
  const { stellarAddress } = useWalletAddress();

  const horizonUrl = env.NEXT_PUBLIC_TESTNET
    ? env.NEXT_PUBLIC_STELLAR_HORIZON_URL_TESTNET
    : env.NEXT_PUBLIC_STELLAR_HORIZON_URL_PUBLIC;
  const networkPassphrase = env.NEXT_PUBLIC_TESTNET
    ? Networks.TESTNET
    : Networks.PUBLIC;
  const usdcAsset = new Asset(
    env.NEXT_PUBLIC_STELLAR_USDC_ASSET_CODE,
    env.NEXT_PUBLIC_STELLAR_USDC_ISSUER
  );

  const sendUSDC = async (
    amount: string,
    recipientWalletAddress: string,
    chainType: 'base' | 'stellar' = 'base'
  ) => {
    if (chainType === 'stellar') {
      if (!stellarAddress)
        throw new Error(
          'Unable to find Stellar address. Please log out and log back in.'
        );

      const server = new Horizon.Server(horizonUrl);
      const account = await server.loadAccount(stellarAddress);

      // Stellar amounts allow up to 7 decimals; round down to be safe.
      const stellarAmount = Big(amount).round(7, Big.roundDown).toString();

      const tx = new TransactionBuilder(account, {
        fee: String(await server.fetchBaseFee()),
        networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: recipientWalletAddress,
            asset: usdcAsset,
            amount: stellarAmount,
          })
        )
        .setTimeout(180)
        .build();

      const hashHex = `0x${bytesToHex(tx.hash())}` as `0x${string}`;
      const { signature } = await signRawHash({
        address: stellarAddress,
        chainType: 'stellar',
        hash: hashHex,
      });

      const sigBytes = hexToBytes(signature.slice(2));
      const sigBase64 = bytesToBase64(sigBytes);
      tx.addSignature(stellarAddress, sigBase64);

      const res = await server.submitTransaction(tx);

      // Refetch the current-chain views (good enough for now; Stellar overview is tied to server currentChain).
      refetchWalletBalance();
      refetchTransactionOverview();

      return res.hash;
    }

    const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
    if (!client) return;

    // Make sure we are on the correct chain
    await client.switchChain({
      id: chain.id,
    });

    // Build USDC transfer transaction
    const transferData = encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: 'transfer',
      args: [recipientWalletAddress, parseUnits(amount.toString(), 6)],
    });

    // Send it
    const txHash = await client.sendTransaction({
      to: env.NEXT_PUBLIC_BASE_USDC_ADDRESS as `0x${string}`,
      data: transferData,
    });

    // Refetch the wallet balance and transaction overview to update the UI right away
    refetchWalletBalance();
    refetchTransactionOverview();

    return txHash;
  };

  return { sendUSDC };
};
