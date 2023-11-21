'use client';
// import { Metadata } from 'next';
import { Provider } from 'react-redux';

import '@/styles/colors.css';
import '@/styles/globals.css';
import '@near-wallet-selector/modal-ui/styles.css';

import { WalletSelectorContextProvider } from '@/components/commons/near-wallet/WalletSelectorContext';

import Container from '@/app/container';
import { store } from '@/redux/store';

import Head from './head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body>
        <Provider store={store}>
          <WalletSelectorContextProvider>
            <Container>{children}</Container>
          </WalletSelectorContextProvider>
        </Provider>
      </body>
    </html>
  );
}
