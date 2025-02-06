import { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';

import { AccountVerificationCard } from './account-verification-card';

const meta = {
  title: 'Verify/Account Verification Card',
  component: AccountVerificationCard,
  args: {
    tosLink: mockBridgeCustomer.tos_link,
    kycLink: mockBridgeCustomer.kyc_link,
  },
} satisfies Meta<typeof AccountVerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    step: 'complete',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
