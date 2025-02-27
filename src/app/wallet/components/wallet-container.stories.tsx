import { Meta, StoryObj } from '@storybook/react';

import { mockOverviewHandler } from '@/api/transactions/msw-handlers';
import { mockTransactionsHandler } from '@/api/transactions/msw-handlers';

import { WalletContainer } from './wallet-container';

const meta = {
  title: 'Wallet/WalletContainer',
  component: WalletContainer,
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
} satisfies Meta<typeof WalletContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: You must fake the return values of useSmartWalletAddress for these stories to render properly

export const Default: Story = {};
