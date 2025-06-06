'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { SmartWalletsProvider } from '@privy-io/react-auth/smart-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import { base, baseSepolia } from 'viem/chains';
const AuthProvider = dynamic(() => import('@/hooks/use-auth'), { ssr: false }); // TODO: figure out how to use this without dynamic import
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { PHProvider } from '@/app/posthog-provider';
import { OpenOnDesktopDrawer } from '@/components/common/open-on-desktop-drawer/open-on-desktop-drawer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { env } from '@/lib/env';

const queryClient = new QueryClient();
const chain = env.NEXT_PUBLIC_TESTNET ? baseSepolia : base;

/** All top level providers for sorbet */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
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
                <TooltipProvider delayDuration={300} skipDelayDuration={100}>
                  <Toaster richColors position='top-right' />
                  <OpenOnDesktopDrawer />
                  {children}
                </TooltipProvider>
              </QueryClientProvider>
            </PHProvider>
          </AuthProvider>
        </SmartWalletsProvider>
      </PrivyProvider>
    </NuqsAdapter>
  );
}
