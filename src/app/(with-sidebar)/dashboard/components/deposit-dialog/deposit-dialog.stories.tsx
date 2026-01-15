import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { Button } from '@/components/ui/button';

import { DepositDialog } from './deposit-dialog';

const mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f2F6353';

const meta = {
    title: 'Dashboard/DepositDialog',
    component: DepositDialog,
    parameters: {
        layout: 'centered',
    },
    args: {
        open: true,
        onOpenChange: fn(),
        walletAddress: mockWalletAddress,
        bridgeCustomer: mockBridgeCustomer,
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
 * With only USDC available (no USD/EUR accounts)
 */
export const OnlyUSDC: Story = {
    args: {
        bridgeCustomer: undefined,
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
 * With only USD account (no EUR)
 */
export const OnlyUSD: Story = {
    args: {
        bridgeCustomer: {
            ...mockBridgeCustomer,
            virtual_account_eur: undefined,
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
 * With only EUR account (no USD)
 */
export const OnlyEUR: Story = {
    args: {
        bridgeCustomer: {
            ...mockBridgeCustomer,
            virtual_account: undefined,
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
