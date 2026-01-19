import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandler404,
  mockBridgeCustomerHandlerIncomplete,
  mockBridgeCustomerHandlerKycComplete,
  mockBridgeCustomerHandlerRejected,
  mockBridgeCustomerHandlerUnderReview,
} from '@/api/bridge/msw-handlers';
import { mockDashboardHandler } from '@/api/dashboard/msw-handlers';

import { VerifyDashboard } from './verify-dashboard';

const meta = {
  title: 'Verify/VerifyDashboard',
  component: VerifyDashboard,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockBridgeCustomerHandler, mockDashboardHandler],
    },
  },
} satisfies Meta<typeof VerifyDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state - user has not started verification */
export const Default: Story = {};

/** User has not created bridge customer yet (404) */
export const NotStarted: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler404, mockDashboardHandler],
    },
  },
};

/** User has completed KYC and is verified */
export const Verified: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete, mockDashboardHandler],
    },
  },
};

/** User's verification was rejected */
export const Rejected: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerRejected, mockDashboardHandler],
    },
  },
};

/** User's verification is pending (under_review status from Bridge API) */
export const VerificationPending: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerUnderReview, mockDashboardHandler],
    },
  },
};

/** User's verification is incomplete */
export const Incomplete: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerIncomplete, mockDashboardHandler],
    },
  },
};
