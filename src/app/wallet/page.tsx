'use client';
import { useState } from 'react';

import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { WalletDashboard } from './components/wallet-dashboard';
import { WalletHeader } from './components/wallet-header';
import { WalletSendDialog } from './components/wallet-send-dialog';
import { useSendUSDC } from './hooks/use-send-usdc';
import { useTopUp } from './hooks/use-top-up';

export default function Wallet() {
  const { topUp } = useTopUp();
  const { sendUSDC } = useSendUSDC();
  const [open, setOpen] = useState(false);

  return (
    <Authenticated>
      <main className='flex w-full flex-col'>
        <Header />
        <WalletHeader onDeposit={topUp} onSend={() => setOpen(true)} />
        <div className='container flex flex-1 justify-center p-6'>
          <WalletDashboard />
        </div>
      </main>
      <WalletSendDialog open={open} setOpen={setOpen} sendUSDC={sendUSDC} />
    </Authenticated>
  );
}
