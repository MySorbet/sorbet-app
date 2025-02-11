import { Metadata } from 'next';

import { WalletContainer } from './components/wallet-container';
import Authenticated from '../authenticated';

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
