import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler404,
  mockBridgeCustomerHandlerKycComplete,
} from '@/api/bridge/msw-handlers';
import { mockDashboardHandler } from '@/api/dashboard/msw-handlers';
import {
  mockDueCustomerHandler,
  mockDueCustomerHandler404,
  mockDueCustomerHandlerRejected,
  mockDueCustomerHandlerTosAccepted,
  mockDueCustomerHandlerUnderReview,
  mockDueCustomerHandlerVerified,
} from '@/api/due/msw-handlers';

import { VerifyDashboard } from './verify-dashboard';

const meta = {
  title: 'Verify/VerifyDashboard',
  component: VerifyDashboard,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandler,
        mockDashboardHandler,
      ],
    },
  },
} satisfies Meta<typeof VerifyDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state - user has not started Due verification */
export const Default: Story = {};

/** User has not created Due customer yet (404) - shows "Start verification" */
export const NotStarted: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandler404,
        mockDashboardHandler,
      ],
    },
  },
};

/** MIGRATION SCENARIO: User is Bridge verified but hasn't started Due verification
 * This shows the migration banner at the top with the vertical setup card */
export const MigrationNeeded: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandlerKycComplete,
        mockDueCustomerHandler404,
        mockDashboardHandler,
      ],
    },
  },
};

/** User has accepted TOS, pending KYC */
export const TosAcceptedKycPending: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandlerTosAccepted,
        mockDashboardHandler,
      ],
    },
  },
};

/** User's verification is under review */
export const UnderReview: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandlerUnderReview,
        mockDashboardHandler,
      ],
    },
  },
};

/** User has completed KYC and is verified - no invoice yet (shows completion card) */
export const VerifiedNoInvoice: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandlerVerified,
        mockDashboardHandler,
      ],
    },
  },
};

/** User's verification was rejected */
export const Rejected: Story = {
  parameters: {
    msw: {
      handlers: [
        mockBridgeCustomerHandler404,
        mockDueCustomerHandlerRejected,
        mockDashboardHandler,
      ],
    },
  },
};
