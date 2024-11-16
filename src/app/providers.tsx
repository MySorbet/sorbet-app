'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { base, baseSepolia } from 'viem/chains';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
// TODO: figure out how to use this without dynamic import
const AuthProvider = dynamic(() => import('@/hooks/use-auth'), { ssr: false });
import { PHProvider } from '@/app/posthog-provider';
import { env } from '@/lib/env';
import { store } from '@/redux/store';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        supportedChains: [base, baseSepolia],
        defaultChain: chain,
      }}
    >
      <SmartWalletsProvider>
        <Provider store={store}>
          <AuthProvider>
            <PHProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </PHProvider>
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </Provider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
