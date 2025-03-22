import { Meta, StoryObj } from '@storybook/react';

import { TableTransaction } from './transaction-table';
import { TransactionsCard } from './transactions-card';

const meta: Meta<typeof TransactionsCard> = {
  title: 'Wallet/TransactionsCard',
  component: TransactionsCard,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TransactionsCard>;

// Sample transaction data
const sampleTransactions: TableTransaction[] = [
  {
    account: '0x1234...5678',
    date: new Date().toLocaleDateString(),
    type: 'Sent',
    amount: '10.5',
    hash: '0xabcd1234efgh5678ijkl9012',
  },
  {
    account: '0x1234...5678',
    date: new Date().toLocaleDateString(),
    type: 'Received',
    amount: '10.5',
    hash: '0xabcd1234efgh5678ijkl9012',
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
