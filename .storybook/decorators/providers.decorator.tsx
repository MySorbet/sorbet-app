import React from 'react';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import { MockAuthProvider } from './useAuth.mock';
import { env } from '../../src/lib/env';
import { store } from '../../src/redux/store';
import { Toaster } from '../../src/components/ui/toaster';
import { Toaster as SonnerToaster } from '../../src/components/ui/sonner';

/**
 * Decorator to provide the necessary providers to the story
 *
 * TODO: Figure out how to prevent the PrivyProvider from actually talking to privy (MSW?)
 *
 * RQ Mocking: Handled when you set up an MSW handler for the API calls that your component uses.
 * If you don't set up an MSW handler, the story will try to hit the actual API at localhost.
 *
 * Redux Mocking: Not needed since we can just use the same store for testing
 * Auth Mocking: Handled by MockAuthProvider
 */
export const ProvidersDecorator = (Story: any) => {
  return (
    <PrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID}>
      <QueryClientProvider client={new QueryClient()}>
        <Provider store={store}>
          <MockAuthProvider>
            <Story />
            <Toaster />
            <SonnerToaster />
          </MockAuthProvider>
        </Provider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
