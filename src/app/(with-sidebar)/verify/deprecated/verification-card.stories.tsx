import { StoryObj } from '@storybook/react';
import { Meta } from '@storybook/react';
import { fn } from '@storybook/test';

import { VerificationCard } from './verification-card';

const meta = {
  title: 'Deprecated/Get Verified Card',
  component: VerificationCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '340px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onComplete: fn(),
  },
} satisfies Meta<typeof VerificationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BeginVerification: Story = {
  args: {
    tosStatus: 'pending',
    kycStatus: 'not_started',
  },
};

export const Approved: Story = {
  args: {
    tosStatus: 'approved',
    kycStatus: 'approved',
  },
};

export const RejectedDefaultReason: Story = {
  parameters: {
    name: 'Rejected (default reason)',
  },
  args: {
    tosStatus: 'approved',
    kycStatus: 'rejected',
  },
};

export const RejectedSpecificSingleReason: Story = {
  parameters: {
    name: 'Rejected (specific reason)',
  },
  args: {
    tosStatus: 'approved',
    kycStatus: 'rejected',
    rejectionReasons: ['There is a specific reason for rejection'],
  },
};

export const RejectedSpecificMultipleReasons: Story = {
  parameters: {
    name: 'Rejected (specific reason)',
  },
  args: {
    tosStatus: 'approved',
    kycStatus: 'rejected',
    rejectionReasons: [
      'There is one specific reason for rejection',
      'There is another specific reason for rejection',
    ],
  },
};

export const InReview: Story = {
  args: {
    tosStatus: 'approved',
    kycStatus: 'under_review',
  },
};

export const Indeterminate: Story = {
  args: {
    tosStatus: 'approved',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const MissingEmail: Story = {
  args: {
    missingEmail: true,
  },
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true,
  },
};
