import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandler404,
  mockBridgeCustomerHandlerKycComplete,
  mockBridgeCustomerHandlerTosComplete,
  mockVerifyHandler,
} from '@/api/bridge/msw-handlers';
import { SidebarProvider } from '@/components/ui/sidebar';

import VerifyPage from './page';

const meta = {
  title: 'Verify/VerifyPage',
  component: VerifyPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof VerifyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: You will either need to comment the Authenticated wrapper or solve mocked auth token to render this story

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
