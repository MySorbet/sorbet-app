import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WalletBalance } from './wallet-balance';

const meta: Meta<typeof WalletBalance> = {
  title: 'Wallet/WalletBalance',
  component: WalletBalance,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ethBalance: '0',
    onTopUp: fn(),
    onSend: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof WalletBalance>;

export const Default: Story = {
  args: {
    usdcBalance: '1000',
  },
};

export const LargeBalance: Story = {
  args: {
    usdcBalance: '250000',
  },
};

export const SmallBalance: Story = {
  args: {
    usdcBalance: '10',
  },
};

export const ZeroBalance: Story = {
  args: {
    usdcBalance: '0',
  },
};
