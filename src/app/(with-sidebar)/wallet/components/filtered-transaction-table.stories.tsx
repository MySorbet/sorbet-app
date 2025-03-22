import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { FilteredTransactionTable } from './filtered-transaction-table';

const meta = {
  title: 'Wallet/FilteredTransactionTable',
  component: FilteredTransactionTable,
} satisfies Meta<typeof FilteredTransactionTable>;

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

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const WithFunctions: Story = {
  render: (args) => {
    const [searchValue, setSearchValue] = useState(args.searchValue);
    const [dateRange, setDateRange] = useState(args.dateRange);

    const handleSearchChange = (value: string) => {
      setSearchValue(value);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
      setDateRange(range);
    };

    const handleClearAll = () => {
      setSearchValue('');
      setDateRange(undefined);
    };

    return (
      <FilteredTransactionTable
        {...args}
        searchValue={searchValue}
        dateRange={dateRange}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        onClearAll={handleClearAll}
      />
    );
  },
  args: {
    ...Default.args,
  },
};
