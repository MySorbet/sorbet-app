'use client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import '@/styles/colors.css';
import '@/styles/globals.css';
import '@near-wallet-selector/modal-ui/styles.css';

import { WalletSelectorContextProvider } from '@/components/commons/near-wallet/walletSelectorContext1';

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
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
          <WalletSelectorContextProvider>
            <Container>{children}</Container>
          </WalletSelectorContextProvider>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
