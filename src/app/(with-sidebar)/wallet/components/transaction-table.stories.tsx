import { Meta, StoryObj } from '@storybook/react';

import { TableTransaction, TransactionTable } from './transaction-table';

const meta = {
  title: 'Wallet/TransactionTable',
  component: TransactionTable,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TransactionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock transaction data with all status and type variations
const mockTransactions: TableTransaction[] = [
  {
    type: 'Money In',
    account: '0xe3f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6ecef',
    date: '1/12/2026',
    amount: '1000',
    hash: '0xabcd1234efgh5678ijkl9012mnop3456',
    status: 'payment_processed',
  },
  {
    type: 'Money In',
    account: '0x7139b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6cf93e',
    date: '1/11/2026',
    amount: '500',
    hash: '0xefgh5678ijkl9012mnop3456qrst7890',
    status: 'payment_submitted',
  },
  {
    type: 'Money Out',
    account: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    date: '1/10/2026',
    amount: '1200',
    hash: '0xijkl9012mnop3456qrst7890uvwx1234',
    status: 'in_review',
  },
  {
    type: 'Money In',
    account: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    date: '1/9/2026',
    amount: '300',
    hash: '0xmnop3456qrst7890uvwx1234yzab5678',
    status: 'returned',
  },
  {
    type: 'Money In',
    account: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    date: '1/8/2026',
    amount: '150',
    hash: '0xqrst7890uvwx1234yzab5678cdef9012',
    status: 'canceled',
  },
  {
    type: 'Deposit',
    account: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    date: '1/7/2026',
    amount: '2500',
    hash: '0xuvwx1234yzab5678cdef9012ghij3456',
    status: 'payment_processed',
  },
  {
    type: 'Money Out',
    account: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    date: '1/6/2026',
    amount: '750',
    hash: '0xyzab5678cdef9012ghij3456klmn7890',
    status: 'funds_received',
  },
];

export const Default: Story = {
  args: {
    transactions: mockTransactions,
  },
};

export const Loading: Story = {
  args: {
    transactions: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    transactions: [],
  },
};

export const WithAllStatuses: Story = {
  args: {
    transactions: [
      {
        type: 'Money In',
        account: '0xe3f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6ecef',
        date: '1/12/2026',
        amount: '1000',
        hash: '0x1',
        status: 'payment_processed', // Completed
      },
      {
        type: 'Money Out',
        account: '0x7139b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6cf93e',
        date: '1/11/2026',
        amount: '500',
        hash: '0x2',
        status: 'payment_submitted', // Processing
      },
      {
        type: 'Money In',
        account: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        date: '1/10/2026',
        amount: '1200',
        hash: '0x3',
        status: 'in_review', // In Review
      },
      {
        type: 'Deposit',
        account: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        date: '1/9/2026',
        amount: '300',
        hash: '0x4',
        status: 'returned', // Returned
      },
      {
        type: 'Money Out',
        account: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
        date: '1/8/2026',
        amount: '150',
        hash: '0x5',
        status: 'canceled', // Rejected
      },
    ],
  },
};
