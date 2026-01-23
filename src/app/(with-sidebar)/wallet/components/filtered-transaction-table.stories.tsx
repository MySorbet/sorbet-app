import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import {
  FilteredTransactionTable,
  TransactionStatusFilter,
  TransactionTypeFilter,
} from './filtered-transaction-table';
import { TableTransaction } from './transaction-table';

const meta = {
  title: 'Wallet/FilteredTransactionTable',
  component: FilteredTransactionTable,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FilteredTransactionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock transaction data with various statuses and types
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
    currentPage: 1,
    totalCount: 120,
    pageSize: 10,
    hasNextPage: true,
    hasPrevPage: false,
  },
};

export const Loading: Story = {
  args: {
    transactions: [],
    isLoading: true,
    currentPage: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const Empty: Story = {
  args: {
    transactions: [],
    currentPage: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const WithPagination: Story = {
  args: {
    transactions: mockTransactions,
    currentPage: 2,
    totalCount: 120,
    pageSize: 10,
    hasNextPage: true,
    hasPrevPage: true,
  },
};

export const LastPage: Story = {
  args: {
    transactions: mockTransactions.slice(0, 3),
    currentPage: 12,
    totalCount: 120,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [searchValue, setSearchValue] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>('all');
    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <FilteredTransactionTable
        {...args}
        searchValue={searchValue}
        dateRange={dateRange}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        currentPage={currentPage}
        onSearchChange={setSearchValue}
        onDateRangeChange={setDateRange}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onNextPage={() => setCurrentPage((p) => p + 1)}
        onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
        hasPrevPage={currentPage > 1}
        hasNextPage={currentPage < 12}
      />
    );
  },
  args: {
    transactions: mockTransactions,
    totalCount: 120,
    pageSize: 10,
  },
};
