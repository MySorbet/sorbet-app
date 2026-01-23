import { Meta, StoryObj } from '@storybook/react';

import { TableTransaction } from './transaction-table';
import { TransactionsCard } from './transactions-card';

const meta = {
  title: 'Wallet/TransactionsCard',
  component: TransactionsCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TransactionsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample transaction data with new types
const sampleTransactions: TableTransaction[] = [
  {
    account: '0xe3f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6ecef',
    date: new Date().toLocaleDateString(),
    type: 'Money Out',
    amount: '1000',
    hash: '0xabcd1234efgh5678ijkl9012',
    status: 'payment_processed',
  },
  {
    account: '0x7139b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6cf93e',
    date: new Date().toLocaleDateString(),
    type: 'Money In',
    amount: '500',
    hash: '0xefgh5678ijkl9012mnop3456',
    status: 'payment_submitted',
  },
  {
    account: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    date: new Date().toLocaleDateString(),
    type: 'Deposit',
    amount: '2500',
    hash: '0xijkl9012mnop3456qrst7890',
    status: 'payment_processed',
  },
];

export const Default: Story = {
  args: {
    description: 'All time',
    transactions: sampleTransactions,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    description: 'All time',
    transactions: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    description: 'All time',
    transactions: [],
    isLoading: false,
  },
};

export const WithAllTypes: Story = {
  args: {
    description: 'Recent transactions',
    transactions: [
      {
        account: '0xe3f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6ecef',
        date: '1/12/2026',
        type: 'Money In',
        amount: '1000',
        hash: '0x1',
        status: 'payment_processed',
      },
      {
        account: '0x7139b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6cf93e',
        date: '1/11/2026',
        type: 'Money Out',
        amount: '500',
        hash: '0x2',
        status: 'payment_submitted',
      },
      {
        account: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        date: '1/10/2026',
        type: 'Deposit',
        amount: '2500',
        hash: '0x3',
        status: 'in_review',
      },
    ],
    isLoading: false,
  },
};
