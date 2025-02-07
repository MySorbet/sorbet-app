import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandler404,
  mockBridgeCustomerHandlerKycComplete,
  mockBridgeCustomerHandlerTosComplete,
  mockVerifyHandler,
} from '@/api/bridge/msw-handlers';
import VerifyPage from '@/app/verify/page';

type Story = StoryObj<typeof VerifyPage>;

const meta = {
  title: 'Verify/VerifyPage',
  component: VerifyPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof VerifyPage>;

export default meta;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler, mockVerifyHandler],
    },
  },
};

export const NoBridgeCustomer: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler404, mockVerifyHandler],
    },
  },
};

export const TOSComplete: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerTosComplete, mockVerifyHandler],
    },
  },
};

export const KYCComplete: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete, mockVerifyHandler],
    },
  },
};
