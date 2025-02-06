import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandler404,
  mockVerifyHandler,
} from '@/api/bridge/msw-handlers';
import VerifyPage from '@/app/verify/page';

type Story = StoryObj<typeof VerifyPage>;

const meta = {
  title: 'Verify/VerifyPage',
  component: VerifyPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockBridgeCustomerHandler, mockVerifyHandler],
    },
  },
} satisfies Meta<typeof VerifyPage>;

export default meta;

export const Default: Story = {};

export const NoBridgeCustomer: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler404, mockVerifyHandler],
    },
  },
};
