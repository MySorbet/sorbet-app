'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import { base, baseSepolia } from 'viem/chains';
const AuthProvider = dynamic(() => import('@/hooks/use-auth'), { ssr: false }); // TODO: figure out how to use this without dynamic import
import { PHProvider } from '@/app/posthog-provider';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { env } from '@/lib/env';

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
        <AuthProvider>
          <PHProvider>
            <QueryClientProvider client={queryClient}>
              <SidebarProvider>
                <AppSidebar />
                <Toaster richColors />
                {children}
              </SidebarProvider>
            </QueryClientProvider>
          </PHProvider>
        </AuthProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
