'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { baseSepolia } from 'viem/chains';

import { Toaster } from '@/components/ui/toaster';
// TODO: figure out how to use this without dynamic import
const AuthProvider = dynamic(() => import('@/hooks/useAuth'), { ssr: false });
import { env } from '@/lib/env';
import { store } from '@/redux/store';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
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
  );
}
