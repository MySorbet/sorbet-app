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

export const Default: Story = {
  args: {
    step: 'begin',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Indeterminate: Story = {
  args: {
    isIndeterminate: true,
  },
};

export const Complete: Story = {
  args: {
    step: 'complete',
  },
};

export const Rejected: Story = {
  args: {
    step: 'complete',
    isRejected: true,
    rejectionReasons: [
      'Cannot validate ID -- please upload a clear photo of the full ID.',
    ],
  },
};

export const UnderReview: Story = {
  args: {
    step: 'complete',
    isUnderReview: true,
  },
};
