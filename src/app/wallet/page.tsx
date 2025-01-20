import { Metadata } from 'next';

import { WalletContainer } from './components/wallet-container';

export const metadata: Metadata = {
  title: 'Wallet',
};

export default function Wallet() {
  return <WalletContainer />;
}
