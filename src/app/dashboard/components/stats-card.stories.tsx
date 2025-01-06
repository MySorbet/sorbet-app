import { Meta } from '@storybook/react';

import { StatsCard } from './stats-card';

const meta = {
  title: 'Dashboard/StatsCard',
  component: StatsCard,
} satisfies Meta<typeof StatsCard>;

export default meta;

export const Default = {
  args: {
    title: 'Title',
    type: 'wallet',
    value: '0',
    description: 'Description',
  },
};
export const Wallet = {
  args: {
    title: 'Total Balance',
    type: 'wallet',
    value: '$1000',
    description: 'Total',
  },
};

export const Invoice = {
  args: {
    title: 'Invoice Sales',
    type: 'invoice',
    value: '$1000',
    description: 'Total income',
  },
};

export const Profile = {
  args: {
    title: 'Profile Views',
    type: 'profile',
    value: '1000',
    description: 'Unique visitors',
  },
};
