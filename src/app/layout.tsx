'use client';

import Head from './head';
import Container from '@/app/container';
import { WalletSelectorContextProvider } from '@/components/common/near-wallet/walletSelectorContext';
import { AuthProvider } from '@/hooks/useAuth';
import { store } from '@/redux/store';
import '@/styles/colors.css';
import '@/styles/globals.css';
import '@/styles/near-modal-ui.css';
import { Provider } from 'react-redux';
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
            <AuthProvider>
              <Container>{children}</Container>
            </AuthProvider>
          </WalletSelectorContextProvider>
          <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
