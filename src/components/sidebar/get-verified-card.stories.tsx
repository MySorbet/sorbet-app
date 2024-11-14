import { StoryObj } from '@storybook/react';
import { Meta } from '@storybook/react';

import { GetVerifiedCard } from './get-verified-card';

const meta = {
  title: 'Sidebar/Get Verified Card',
  component: GetVerifiedCard,
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
} satisfies Meta<typeof GetVerifiedCard>;

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
    tosStatus: "approved",
    kycStatus: "approved"
  }
};

export const Rejected: Story = {
  args: {
    tosStatus: "approved",
    kycStatus: "rejected"
  }
};

export const InReview: Story = {
  args: {
    tosStatus: "approved",
    kycStatus: "under_review"
  }
};
