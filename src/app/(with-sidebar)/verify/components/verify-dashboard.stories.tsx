import { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomerHandler } from '@/api/bridge/msw-handlers';

import { VerifyDashboard } from './verify-dashboard';

const meta = {
  title: 'Verify/VerifyDashboard',
  component: VerifyDashboard,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockBridgeCustomerHandler],
    },
  },
} satisfies Meta<typeof VerifyDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
