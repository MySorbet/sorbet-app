import { Meta, StoryObj } from '@storybook/react';

import { WalletSendDialog } from '@/app/wallet/wallet-send-dialog';

const meta = {
  title: 'Wallet/WalletSendDialog',
  component: WalletSendDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
  },
} satisfies Meta<typeof WalletSendDialog>;

export default meta;
type Story = StoryObj<typeof WalletSendDialog>;

export const Default: Story = {};

export const InitialScreen = {
  args: {
    isOpen: true,
    initialStep: 1,
  },
};
