'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useMemo } from 'react';

import type { SorbetChain } from '@/api/user/chain';
import { useMyChain } from '@/hooks/use-my-chain';
import { getStellarAddressFromPrivyUser } from '@/lib/stellar/privy';

import { useSmartWalletAddress } from './web3/use-smart-wallet-address';

export type WalletAddressInfo = {
  currentChain: SorbetChain;
  baseAddress: string | null;
  stellarAddress: string | null;
  /** Address for the currently-selected chain. */
  currentAddress: string | null;
  isLoading: boolean;
};

/**
 * Unified wallet address hook (Base + Stellar).
 * - Base: smart wallet address
 * - Stellar: G... public key extracted from the Privy user
 * - Includes the current selected chain from the backend (`useMyChain`)
 */
export const useWalletAddress = (): WalletAddressInfo => {
  const { user: privyUser, ready } = usePrivy();
  const { data: myChainData, isLoading: isChainLoading } = useMyChain();
  const { smartWalletAddress: baseAddress, isLoading: isBaseLoading } = useSmartWalletAddress();

  const currentChain: SorbetChain = myChainData?.chain ?? 'base';

  const stellarAddress = useMemo(
    () => getStellarAddressFromPrivyUser(privyUser ?? null),
    [privyUser]
  );

  const currentAddress = currentChain === 'stellar' ? stellarAddress : baseAddress;

  return {
    currentChain,
    baseAddress,
    stellarAddress,
    currentAddress,
    isLoading: !ready || isChainLoading || isBaseLoading,
  };
};

