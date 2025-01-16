import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '@/components/ui/button';

import { WalletSendDialog } from './wallet-send-dialog';

const meta = {
  title: 'Wallet/WalletSendDialog',
  component: WalletSendDialog,
  parameters: {
    layout: 'centered',
  },
  args: {
    open: true,
    usdcBalance: '100',
    sendUSDC: fn(),
  },
} satisfies Meta<typeof WalletSendDialog>;

export default meta;
type Story = StoryObj<typeof WalletSendDialog>;

export const Default: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open</Button>
        <WalletSendDialog {...args} open={open} setOpen={handleOpenChange} />
      </>
    );
  },
};
