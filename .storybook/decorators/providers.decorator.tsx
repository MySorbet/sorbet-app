import React from 'react';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MockAuthProvider } from './use-auth.mock';
import { env } from '../../src/lib/env';
import { Toaster } from '../../src/components/ui/sonner';
import { OpenOnDesktopDrawer } from '../../src/components/common/open-on-desktop-drawer/open-on-desktop-drawer';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { baseSepolia } from 'viem/chains';
import { TooltipProvider } from '../../src/components/ui/tooltip';

/**
 * Decorator to provide the necessary providers to the story
 *
 * TODO: Figure out how to prevent the PrivyProvider from actually talking to privy (MSW?)
 *
 * RQ Mocking: Handled when you set up an MSW handler for the API calls that your component uses.
 * If you don't set up an MSW handler, the story will try to hit the actual API at localhost.
 *
 * Auth Mocking: Handled by MockAuthProvider
 *
 * Posthog Mocking: Not needed since we don't care about posthog for these stories
 */
export const ProvidersDecorator = (Story: any) => {
  return (
    <NuqsTestingAdapter>
      <PrivyProvider
        appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          supportedChains: [baseSepolia],
          defaultChain: baseSepolia,
        }}
      >
        <QueryClientProvider client={new QueryClient()}>
          <MockAuthProvider>
            <TooltipProvider delayDuration={300} skipDelayDuration={100}>
              <Toaster richColors position='top-right' />
              <OpenOnDesktopDrawer />
              <Story />
            </TooltipProvider>
          </MockAuthProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </NuqsTestingAdapter>
  );
};
