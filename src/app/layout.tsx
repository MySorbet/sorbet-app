'use client';

import '@/styles/colors.css';
import '@/styles/globals.css';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { base, baseSepolia } from 'viem/chains';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { store } from '@/redux/store';

import Head from './head';

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
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
          config={{
            embeddedWallets: {
              createOnLogin: 'all-users',
            },
            defaultChain: baseSepolia,
          }}
        >
          <Provider store={store}>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
              <Toaster />
            </AuthProvider>
          </Provider>
        </PrivyProvider>
      </body>
    </html>
  );
}
