import { Meta, StoryObj } from '@storybook/react';

import { MyAccounts } from './my-accounts';

const meta = {
  title: 'Wallet/My Accounts',
  component: MyAccounts,
} satisfies Meta<typeof MyAccounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    usdcBalance: '1000',
    address: '0x1234567890',
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
