'use client';

import Head from './head';
import Container from '@/app/container';
import { WalletSelectorContextProvider } from '@/components/common/near-wallet/walletSelectorContext';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { store } from '@/redux/store';
import '@/styles/colors.css';
import '@/styles/globals.css';
import '@/styles/near-modal-ui.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <Head />
      <body className='bg-[#F2F3F7]'>
        <Provider store={store}>
          <WalletSelectorContextProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <Container>{children}</Container>
              </QueryClientProvider>
            </AuthProvider>
          </WalletSelectorContextProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
