import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { useEffect, useState } from 'react';

/**
 * This hook is simply for the purposes of getting a user's smart wallet address.
 * Any actions such as interacting with blockchain via the smart wallet client should be done via useSmartWallets.
 */
export const useSmartWalletAddress = () => {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { client } = useSmartWallets();

  useEffect(() => {
    setIsLoading(true);
    if (client) {
      setSmartWalletAddress(client.account.address);
    }
    setIsLoading(false);
  }, [client]);

  return { smartWalletAddress, isLoading };
  // return {
  //   smartWalletAddress: '0x1231231231231231231231231231231231231231',
  //   isLoading: false,
  // };
};
