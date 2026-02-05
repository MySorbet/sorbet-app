import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WalletSection } from './wallet-section';

const meta = {
  title: 'Settings/Account/WalletSection',
  component: WalletSection,
  parameters: {
    layout: 'centered',
  },
  args: {
    isAuthenticatedOverride: true,
    exportBaseOverride: fn(),
    baseSmartWalletAddressOverride: '0x742d35Cc6634C0532925a3b844Bc9e7595f2F6353',
    stellarAddressOverride: 'GB3JDWCQMPM3SSE6X6CEGJ3V3UT2JTX7KZ2R5Y3G3QZQJ2T4K6Q3W3GQ',
  },
} satisfies Meta<typeof WalletSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BothActive: Story = {};

export const StellarNotActive: Story = {
  args: {
    stellarAddressOverride: null,
  },
};

export const Unauthenticated: Story = {
  args: {
    isAuthenticatedOverride: false,
  },
};

