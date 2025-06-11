import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WalletHeader } from './wallet-header';

const meta = {
  title: 'Wallet/WalletHeader',
  component: WalletHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onDeposit: fn(),
    onSend: fn(),
  },
} satisfies Meta<typeof WalletHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
