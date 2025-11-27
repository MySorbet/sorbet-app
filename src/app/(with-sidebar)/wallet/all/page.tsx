import { redirect } from 'next/navigation';

const WALLET_ENABLED = false;

export default function WalletAllPage() {
  if (!WALLET_ENABLED) {
    redirect('/dashboard');
  }

  return null;
}
