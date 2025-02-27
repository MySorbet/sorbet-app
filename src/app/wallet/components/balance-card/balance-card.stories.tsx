import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { sampleOverview } from '@/api/transactions/sample-transactions';

import { calculateBalanceHistory } from '../../components/balance-card/util';
import { BalanceCard } from './balance-card';
import {
  balanceHistoryComplex,
  balanceHistoryDecline,
  balanceHistoryFromSampleTransactions,
  balanceHistoryGrowth,
  balanceHistorySimple,
  balanceHistoryVolatile,
} from './sample-balance-history';

const meta = {
  title: 'Wallet/BalanceCard',
  component: BalanceCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    balance: 1000,
    history: balanceHistorySimple,
    duration: 'all',
    onDurationChange: fn(),
  },
} satisfies Meta<typeof BalanceCard>;

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    balance: 1000,
  },
};

export const Loading: Story = {
  args: {
    balance: 1000,
    isLoading: true,
  },
};

export const LargeBalance: Story = {
  args: {
    balance: 250000,
  },
};

export const SmallBalance: Story = {
  args: {
    balance: 10,
  },
};

export const ZeroBalance: Story = {
  args: {
    balance: 0,
  },
};

export const ComplexBalance: Story = {
  args: {
    balance: 1000,
    history: balanceHistoryComplex,
  },
};

export const GrowthBalance: Story = {
  args: {
    balance: 1000,
    history: balanceHistoryGrowth,
  },
};

export const VolatileBalance: Story = {
  args: {
    balance: 1000,
    history: balanceHistoryVolatile,
  },
};

export const DeclineBalance: Story = {
  args: {
    balance: 1000,
    history: balanceHistoryDecline,
  },
};

export const FromTransactions: Story = {
  args: {
    balance: 1000,
    history: balanceHistoryFromSampleTransactions,
  },
};

export const BetterBalanceHistory: Story = {
  args: {
    balance: 0,
    history: calculateBalanceHistory(
      0,
      sampleOverview.money_in,
      sampleOverview.money_out
    ),
  },
};
