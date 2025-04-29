'use client';

import { usePrivy } from '@privy-io/react-auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSmartWalletAddress } from '@/hooks/web3/use-smart-wallet-address';

/** POC for exporting wallet. Not prod ready */
export const ExportWallet = () => {
  const { exportWallet } = usePrivy();
  const { smartWalletAddress } = useSmartWalletAddress();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          You can export your wallet to use it in other places. Note that this
          is your embedded wallet which acts as a signer for your smart wallet.
          The funds are actually held in your smart wallet at{' '}
          <pre className='inline-block text-xs'>{smartWalletAddress}</pre>.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant='sorbet' onClick={exportWallet}>
          Export Wallet
        </Button>
      </CardFooter>
    </Card>
  );
};
