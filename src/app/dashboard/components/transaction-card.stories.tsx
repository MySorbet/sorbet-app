import { Meta, StoryObj } from '@storybook/react';

import { TransactionCard } from '@/app/dashboard/components/transaction-card';

const meta = {
  title: 'Dashboard/TransactionCard',
  component: TransactionCard,
} satisfies Meta<typeof TransactionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

// TODO: MSW story
