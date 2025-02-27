import { Meta, StoryObj } from '@storybook/react';

import { MyAccounts } from './my-accounts';

const meta = {
  title: 'Wallet/MyAccounts',
  component: MyAccounts,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MyAccounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
