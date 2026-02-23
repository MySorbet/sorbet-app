import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { BalanceSectionCard } from './balance-section-card';

const mockHistory = [
  { iso: '2024-01-01', balance: 1000 },
  { iso: '2024-02-01', balance: 1200 },
  { iso: '2024-03-01', balance: 950 },
  { iso: '2024-04-01', balance: 1400 },
  { iso: '2024-05-01', balance: 1100 },
  { iso: '2024-06-01', balance: 1329 },
];

const meta = {
  title: 'Dashboard/BalanceSectionCard',
  component: BalanceSectionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    history: {
      control: 'object',
      description: 'Balance history data',
    },
    moneyIn: {
      control: 'number',
      description: 'Total money in',
    },
    moneyOut: {
      control: 'number',
      description: 'Total money out',
    },
    balance: {
      control: 'number',
      description: 'Current balance',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the data is loading',
    },
    duration: {
      control: 'select',
      options: ['all', '30', '7', '3'],
      description: 'Duration filter',
    },
    onDurationChange: {
      control: false,
      description: 'Duration change handler',
    },
  },
} satisfies Meta<typeof BalanceSectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    history: mockHistory,
    moneyIn: 7329,
    moneyOut: 5329,
    balance: 1329,
    duration: 'all',
    onDurationChange: fn(),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    history: [],
    moneyIn: 0,
    moneyOut: 0,
    balance: 0,
    duration: 'all',
    onDurationChange: fn(),
    isLoading: true,
  },
};

export const HighVolume: Story = {
  args: {
    history: [
      { iso: '2024-01-01', balance: 50000 },
      { iso: '2024-02-01', balance: 65000 },
      { iso: '2024-03-01', balance: 58000 },
      { iso: '2024-04-01', balance: 72000 },
      { iso: '2024-05-01', balance: 69000 },
      { iso: '2024-06-01', balance: 81000 },
    ],
    moneyIn: 125430.5,
    moneyOut: 98765.25,
    balance: 81000,
    duration: 'all',
    onDurationChange: fn(),
    isLoading: false,
  },
};
