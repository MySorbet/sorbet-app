import { Meta, StoryObj } from '@storybook/react';

import { mockOverviewHandler } from '@/api/transactions/msw-handlers';
import { mockTransactionsHandler } from '@/api/transactions/msw-handlers';

import { WalletDashboard } from './wallet-dashboard';

const meta = {
  title: 'Wallet/WalletDashboard',
  component: WalletDashboard,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockTransactionsHandler, mockOverviewHandler],
    },
  },
  decorators: [
    (Story) => (
      <div className='w-full p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WalletDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: You must fake the return values of useSmartWalletAddress for these stories to render properly

export const Default: Story = {};
