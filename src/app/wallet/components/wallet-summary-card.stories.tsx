import { Meta, StoryObj } from '@storybook/react';

import { WalletSummaryCard } from './wallet-summary-card';

const meta = {
  title: 'Wallet/WalletSummaryCard',
  component: WalletSummaryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WalletSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    value: 0,
    subscript: 'Subscript',
  },
};

export const MoneyIn: Story = {
  args: {
    label: 'Money in',
    value: 1250.75,
    subscript: 'All time',
    isLoading: false,
  },
};

export const MoneyOut: Story = {
  args: {
    label: 'Money out',
    value: 1250.75,
    subscript: 'All time',
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
