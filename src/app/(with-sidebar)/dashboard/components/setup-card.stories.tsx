import type { Meta, StoryObj } from '@storybook/react';

import { SetupCard } from './setup-card';

const meta = {
  title: 'Dashboard/SetupCard',
  component: SetupCard,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SetupCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KycNotStarted: Story = {
  args: {
    kycStatus: 'not_started',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
  },
};

export const KycPending: Story = {
  args: {
    kycStatus: 'under_review',
    completedTasks: {
      verified: true,
      invoice: false,
      payment: false,
    },
  },
};

export const KycIncomplete: Story = {
  args: {
    kycStatus: 'incomplete',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
  },
};

export const KycRejected: Story = {
  args: {
    kycStatus: 'rejected',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
  },
};

export const KycVerifiedNoInvoice: Story = {
  args: {
    kycStatus: 'active',
    completedTasks: {
      verified: true,
      invoice: false,
      payment: false,
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
