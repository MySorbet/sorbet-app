import { Meta, StoryObj } from '@storybook/react';

import TransactionsTable from './transactions-table';

const meta = {
  title: 'Wallet/TransactionsTable',
  component: TransactionsTable,
} satisfies Meta<typeof TransactionsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Minimal: Story = {
  args: {
    ...Default.args,
    minimalMode: true,
  },
};
