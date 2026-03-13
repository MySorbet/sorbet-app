import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import {
  mockDueVirtualAccountsHandlerAll,
  mockDueVirtualAccountsHandlerEmpty,
  mockDueVirtualAccountsHandlerEUROnly,
  mockDueVirtualAccountsHandlerUSDOnly,
} from '@/api/due/msw-handlers';
import { Button } from '@/components/ui/button';

import { DepositDialog } from './deposit-dialog';

const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f2F6353';

const meta = {
  title: 'Dashboard/DepositDialog',
  component: DepositDialog,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [mockDueVirtualAccountsHandlerAll],
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
    chain: 'base',
    walletAddress: mockWalletAddress,
  },
} satisfies Meta<typeof DepositDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with all accounts available
 */
export const Default: Story = {
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Deposit</Button>
        <DepositDialog {...args} open={open} onOpenChange={handleOpenChange} />
      </>
    );
  },
};

/**
 * With only USDC available (no USD/EUR/AED accounts)
 */
export const OnlyUSDC: Story = {
  parameters: {
    msw: {
      handlers: [mockDueVirtualAccountsHandlerEmpty],
    },
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Deposit</Button>
        <DepositDialog {...args} open={open} onOpenChange={handleOpenChange} />
      </>
    );
  },
};

/**
 * With only USD account (no EUR/AED)
 */
export const OnlyUSD: Story = {
  parameters: {
    msw: {
      handlers: [mockDueVirtualAccountsHandlerUSDOnly],
    },
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Deposit</Button>
        <DepositDialog {...args} open={open} onOpenChange={handleOpenChange} />
      </>
    );
  },
};

/**
 * With only EUR account (no USD/AED)
 */
export const OnlyEUR: Story = {
  parameters: {
    msw: {
      handlers: [mockDueVirtualAccountsHandlerEUROnly],
    },
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Deposit</Button>
        <DepositDialog {...args} open={open} onOpenChange={handleOpenChange} />
      </>
    );
  },
};

/**
 * Stellar chain: USDC wallet details should show Stellar messaging + QR
 */
export const Stellar: Story = {
  args: {
    chain: 'stellar',
    walletAddress: 'GB3JDWCQMPM3SSE6X6CEGJ3V3UT2JTX7KZ2R5Y3G3QZQJ2T4K6Q3W3GQ',
  },
  parameters: {
    msw: {
      handlers: [mockDueVirtualAccountsHandlerEmpty],
    },
  },
  render: (args) => {
    const [{ open }, updateArgs] = useArgs();
    const handleOpenChange = (open: boolean) => {
      updateArgs({ open });
    };

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Deposit</Button>
        <DepositDialog {...args} open={open} onOpenChange={handleOpenChange} />
      </>
    );
  },
};
