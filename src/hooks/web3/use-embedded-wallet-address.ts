import { getEmbeddedConnectedWallet, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

/**
 * ! Deprecated: No longer used as we are migrating towards smart wallets
 * Returns the address of the embedded wallet if it exists, otherwise null.
 * We need a hook like this because privy useWallets will tell use about browser wallets too.
 */
export function useEmbeddedWalletAddress(): string | null {
  const { wallets } = useWallets();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!wallets || wallets.length === 0) {
      console.log('useEmbeddedWalletAddress: No wallets found');
    }

    // Find the embedded one and use that
    const wallet = getEmbeddedConnectedWallet(wallets);
    if (wallet) {
      setAddress(wallet.address);
    }
  }, [wallets]);

  return address;
}
