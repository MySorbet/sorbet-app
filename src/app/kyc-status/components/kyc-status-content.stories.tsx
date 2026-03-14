import { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';

import { mockBridgeCustomerHandler } from '@/api/bridge';
import { env } from '@/lib/env';

import { KycStatusContent } from './kyc-status-content';

const meta = {
  title: 'KYC Status/KycStatusContent',
  component: KycStatusContent,
  parameters: {
    layout: 'padded',
  },
  args: {},
} satisfies Meta<typeof KycStatusContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** KYC successful - user has completed verification */
export const Success: Story = {
  args: {
    status: 'success',
  },
};

/** KYC failed - standard message when user has no Bridge accounts */
export const Failed: Story = {
  args: {
    status: 'failed',
  },
  parameters: {
    msw: {
      handlers: [
        http.get(
          `${env.NEXT_PUBLIC_SORBET_API_URL}/users/bridge/customer`,
          () => HttpResponse.json({}, { status: 404 })
        ),
      ],
    },
  },
};

/** KYC failed but user has Bridge virtual accounts - can continue using them */
export const FailedWithBridgeAccounts: Story = {
  args: {
    status: 'failed',
  },
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler],
    },
  },
};
