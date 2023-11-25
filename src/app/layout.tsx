'use client';
import { Provider } from 'react-redux';

import '@/styles/colors.css';
import '@/styles/globals.css';
import '@near-wallet-selector/modal-ui/styles.css';

import { WalletSelectorContextProvider } from '@/components/commons/near-wallet/WalletSelectorContext';

import Container from '@/app/container';
import { store } from '@/redux/store';

import Head from './head';
import { ToastContainer } from 'react-toastify';

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
