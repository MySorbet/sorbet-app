import { Meta, StoryObj } from '@storybook/react';

import { WalletSendDialog } from '@/app/wallet/wallet-send-dialog';

const meta = {
  title: 'Wallet/WalletSendDialog',
  component: WalletSendDialog,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WalletSendDialog>;

export default meta;
type Story = StoryObj<typeof WalletSendDialog>;

export const Default: Story = {};
