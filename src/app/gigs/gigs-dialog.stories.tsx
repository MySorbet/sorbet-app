import { PrivyProvider } from '@privy-io/react-auth';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Provider } from 'react-redux';

import AuthProvider from '@/hooks/useAuth';
import { env } from '@/lib/env';
import { store } from '@/redux/store';
import { OfferType } from '@/types';

import { GigsDialog } from './gigs-dialog';

const meta: Meta<typeof GigsDialog> = {
  title: 'Gigs/GigsDialog',
  component: GigsDialog,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      return (
        <PrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID}>
          <QueryClientProvider client={new QueryClient()}>
            <Provider store={store}>
              <AuthProvider>
                <div style={{ width: '100%', height: '100vh' }}>
                  <Story />
                </div>
              </AuthProvider>
            </Provider>
          </QueryClientProvider>
        </PrivyProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GigsDialog>;

const mockOffer: OfferType = {
  id: '1',
  name: 'John Doe',
  username: 'johndoe',
  profileImage: '',
  projectName: 'Web Development Project',
  status: 'Pending',
  projectStart: '2023-07-01',
  budget: '5000-10000',
  tags: ['web', 'development'],
  projectDescription: 'A comprehensive web development project',
};

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <GigsDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isClient={true}
        currentOffer={mockOffer}
        handleRejectOffer={fn()}
        afterContractSubmitted={fn()}
        currentOfferId={mockOffer.id}
      />
    );
  },
};
