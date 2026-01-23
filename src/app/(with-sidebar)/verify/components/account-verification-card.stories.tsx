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
    step: 'begin',
    isLoading: true,
  },
};

/** Verification pending - temporary local state after user submits KYC */
export const VerificationPending: Story = {
  args: {
    step: 'begin',
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

/** Under review from Bridge API - shows same UI as VerificationPending */
export const UnderReview: Story = {
  args: {
    step: 'complete',
    isUnderReview: true,
  },
};

export const Incomplete: Story = {
  args: {
    step: 'details',
    isIncomplete: true,
  },
};

export const AwaitingUBO: Story = {
  args: {
    step: 'complete',
    isAwaitingUBO: true,
  },
};
