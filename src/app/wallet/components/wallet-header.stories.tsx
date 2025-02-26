import { Meta, StoryObj } from '@storybook/react';

import { WalletHeader } from './wallet-header';

const meta = {
  title: 'Wallet/WalletHeader',
  component: WalletHeader,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof WalletHeader>;

export default meta;
type Story = StoryObj<typeof WalletHeader>;

export const Default: Story = {};
