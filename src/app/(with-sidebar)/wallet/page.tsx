import { redirect } from 'next/navigation';

import WalletPageClient from './page.client';

const WALLET_ENABLED = false; // Flip to true to re-enable the Wallet page in the future

export default function Wallet() {
  if (!WALLET_ENABLED) {
    redirect('/dashboard');
  }

  return <WalletPageClient />;
}
