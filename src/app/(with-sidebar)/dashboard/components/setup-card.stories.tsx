import { fn } from '@storybook/test';
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

/** Horizontal layout (Dashboard) - KYC not started */
export const HorizontalNotStarted: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: undefined,
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    onVerifyClick: fn(),
  },
};

/** Horizontal layout (Dashboard) - KYC pending/starting */
export const HorizontalPending: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: 'pending',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    onVerifyClick: fn(),
  },
};

/** Horizontal layout (Dashboard) - KYC under review */
export const HorizontalUnderReview: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: 'under_review',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    onVerifyClick: fn(),
  },
};

/** Horizontal layout (Dashboard) - KYC rejected */
export const HorizontalRejected: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: 'rejected',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    onVerifyClick: fn(),
  },
};

/** Horizontal layout (Dashboard) - KYC verified, no invoice */
export const HorizontalVerifiedNoInvoice: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: 'passed',
    completedTasks: {
      verified: true,
      invoice: false,
      payment: false,
    },
    onVerifyClick: fn(),
  },
};

/** Horizontal layout (Dashboard) - All complete */
export const HorizontalAllComplete: Story = {
  args: {
    layout: 'horizontal',
    kycStatus: 'passed',
    completedTasks: {
      verified: true,
      invoice: true,
      payment: true,
    },
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC not started with inline verification */
export const VerticalNotStarted: Story = {
  args: {
    layout: 'vertical',
    kycStatus: undefined,
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC pending */
export const VerticalPending: Story = {
  args: {
    layout: 'vertical',
    kycStatus: 'pending',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC under review */
export const VerticalUnderReview: Story = {
  args: {
    layout: 'vertical',
    kycStatus: 'in_review',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC verified, no invoice (shows completion card) */
export const VerticalVerifiedNoInvoice: Story = {
  args: {
    layout: 'vertical',
    kycStatus: 'passed',
    completedTasks: {
      verified: true,
      invoice: false,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC verified with invoice (no completion card) */
export const VerticalVerifiedWithInvoice: Story = {
  args: {
    layout: 'vertical',
    kycStatus: 'approved',
    completedTasks: {
      verified: true,
      invoice: true,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Vertical layout (Verify page) - KYC rejected */
export const VerticalRejected: Story = {
  args: {
    layout: 'vertical',
    kycStatus: 'failed',
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
    showInlineVerification: true,
    kycLink: 'https://example.com/kyc',
    onVerifyClick: fn(),
  },
};

/** Loading state */
export const Loading: Story = {
  args: {
    layout: 'horizontal',
    loading: true,
    completedTasks: {
      verified: false,
      invoice: false,
      payment: false,
    },
  },
};
