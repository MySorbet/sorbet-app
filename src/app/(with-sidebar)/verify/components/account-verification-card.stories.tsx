import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';

import { AccountVerificationCard } from './account-verification-card';

const meta = {
  title: 'Verify/Account Verification Card',
  component: AccountVerificationCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    tosLink: 'https://example.com/tos',
    kycLink: 'https://example.com/kyc',
  },
} satisfies Meta<typeof AccountVerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Initial state - user needs to accept TOS */
export const Default: Story = {
  args: {
    step: 'begin',
  },
};

/** Loading state */
export const Loading: Story = {
  args: {
    step: 'begin',
    isLoading: true,
  },
};

/** Terms of Service step */
export const TermsStep: Story = {
  args: {
    step: 'terms',
    tosLink: 'https://example.com/tos',
  },
};

/** KYC Details step */
export const DetailsStep: Story = {
  args: {
    step: 'details',
    kycLink: 'https://example.com/kyc',
  },
};

/** Verification complete */
export const Complete: Story = {
  args: {
    step: 'complete',
  },
};

/** Verification rejected - Due network */
export const Rejected: Story = {
  args: {
    step: 'complete',
    isRejected: true,
    rejectionReasons: ['Identity verification failed. Please try again.'],
  },
};

/** Under review - Due network */
export const UnderReview: Story = {
  args: {
    step: 'complete',
    isUnderReview: true,
  },
};
