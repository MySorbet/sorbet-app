import React from 'react';

import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import { MockAuthProvider } from './useAuth.mock';
import { env } from '../../src/lib/env';
import { store } from '../../src/redux/store';
import { Toaster } from '../../src/components/ui/toaster';

/**
 * Decorator to provide the necessary providers to the story
 *
 * TODO: Figure out how to mock Privy and RQ correctly. Currently, this will try to hit the API running localhost.
 */
export const ProvidersDecorator = (Story: any) => {
  return (
    <PrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID}>
      <QueryClientProvider client={new QueryClient()}>
        <Provider store={store}>
          <MockAuthProvider>
            <Story />
            <Toaster />
          </MockAuthProvider>
        </Provider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
