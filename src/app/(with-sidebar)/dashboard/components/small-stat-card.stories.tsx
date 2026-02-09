import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SmallStatCard } from './small-stat-card';

const meta = {
  title: 'Dashboard/SmallStatCard',
  component: SmallStatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    value: {
      control: 'number',
      description: 'Stat value',
    },
    description: {
      control: 'text',
      description: 'Description text',
    },
    buttonLabel: {
      control: 'text',
      description: 'Button label text',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the data is loading',
    },
    formatValue: {
      control: 'boolean',
      description: 'Whether to format value as currency',
    },
  },
} satisfies Meta<typeof SmallStatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Wallet balance',
    value: 1329,
    description: 'Total',
    buttonLabel: 'Deposit',
    isLoading: false,
    formatValue: true,
    onClick: fn(),
  },
};

export const InvoiceSales: Story = {
  args: {
    title: 'Invoice sales',
    value: 25430.5,
    description: 'Total income',
    buttonLabel: '+ Create',
    isLoading: false,
    formatValue: true,
    onClick: fn(),
  },
};

export const Recipients: Story = {
  args: {
    title: 'Recipients',
    value: 12,
    description: 'Total',
    buttonLabel: '+ Add',
    isLoading: false,
    formatValue: false,
    onClick: fn(),
  },
};

export const Loading: Story = {
  args: {
    title: 'Wallet balance',
    description: 'Total',
    buttonLabel: 'Deposit',
    isLoading: true,
    formatValue: true,
    onClick: fn(),
  },
};
