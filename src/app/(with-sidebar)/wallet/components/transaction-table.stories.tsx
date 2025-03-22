import { Meta, StoryObj } from '@storybook/react';

import { TransactionTable } from './transaction-table';

const meta = {
  title: 'Wallet/TransactionTable',
  component: TransactionTable,
} satisfies Meta<typeof TransactionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: You must fake the return values of useSmartWalletAddress for these stories to render properly

export const Default: Story = {
  args: {
    transactions: [
      {
        type: 'Sent',
        account: '0x1234567890',
        date: new Date().toLocaleDateString(),
        amount: '100',
        hash: '0x1234567890',
      },
      {
        type: 'Received',
        account: '0x1234567890',
        date: new Date().toLocaleDateString(),
        amount: '100',
        hash: '0x1234567890',
      },
      {
        type: 'Sent',
        account: '0x1234567890',
        date: new Date().toLocaleDateString(),
        amount: '100',
        hash: '0x1234567890',
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    transactions: [],
  },
};
