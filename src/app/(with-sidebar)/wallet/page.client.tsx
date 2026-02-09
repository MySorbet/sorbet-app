'use client';
import { useState } from 'react';

import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../authenticated';
import { WalletDashboard } from './components/wallet-dashboard';
import { WalletHeader } from './components/wallet-header';
import { WalletSendDialog } from './components/wallet-send-dialog';
import { useSendUSDC } from './hooks/use-send-usdc';
import { useTopUp } from './hooks/use-top-up';

export default function WalletPageClient() {
  const { topUp } = useTopUp();
  const { sendUSDC } = useSendUSDC();
  const [open, setOpen] = useState(false);

  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <WalletHeader onDeposit={topUp} onSend={() => setOpen(true)} />
        <Page.Content>
          <WalletDashboard />
        </Page.Content>
      </Page.Main>
      <WalletSendDialog
        open={open}
        setOpen={setOpen}
        sendUSDC={async (amount, recipientWalletAddress) =>
          (await sendUSDC(amount, recipientWalletAddress, 'base')) as
            | `0x${string}`
            | undefined
        }
      />
    </Authenticated>
  );
}
