import { Metadata } from 'next';

import { Authenticated } from '../authenticated';
import { WalletContainer } from './components/wallet-container';

export const metadata: Metadata = {
  title: 'Wallet',
};

export default function Wallet() {
  return (
    <Authenticated>
      <WalletContainer />
    </Authenticated>
  );
}
