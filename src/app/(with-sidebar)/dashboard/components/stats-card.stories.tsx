import { Meta, StoryObj } from '@storybook/react';

import { StatsCard } from './stats-card';

const meta = {
  title: 'Dashboard/StatsCard',
  component: StatsCard,
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    type: 'wallet',
    value: 0,
    description: 'Description',
  },
};

export const Loading: Story = {
  args: {
    title: 'Title',
    type: 'wallet',
    value: undefined,
    description: 'Description',
  },
};

export const Wallet: Story = {
  args: {
    title: 'Total Balance',
    type: 'wallet',
    value: 1000,
    description: 'Total',
  },
};

export const Invoice: Story = {
  args: {
    title: 'Invoice Sales',
    type: 'sales',
    value: 1000,
    description: 'Total income',
  },
};

export const Profile: Story = {
  args: {
    title: 'Profile Views',
    type: 'views',
    value: 1000,
    description: 'Unique visitors',
  },
};
