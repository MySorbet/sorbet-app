import { Metadata } from 'next';

import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { WalletContainer } from './components/wallet-container';

export const metadata: Metadata = {
  title: 'Wallet',
};

export default function Wallet() {
  return (
    <Authenticated>
      <div className='bg-background flex w-full flex-col '>
        <Header />
        <div className='container flex flex-1 justify-center p-8'>
          <WalletContainer />
        </div>
      </div>
    </Authenticated>
  );
}
