import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';

import { WalletSendDialog } from '@/app/wallet/wallet-send-dialog';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Wallet/WalletSendDialog',
  component: WalletSendDialog,
  parameters: {
    layout: 'centered',
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
  args: {
    usdcBalance: '100',
    sendUSDC: (amount: string, recipientWalletAddress: string) =>
      Promise.resolve('0x123'),
  },
};
