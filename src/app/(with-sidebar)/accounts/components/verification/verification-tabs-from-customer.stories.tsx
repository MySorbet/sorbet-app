import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandlerKycComplete,
  mockBridgeCustomerHandlerTosComplete,
} from '@/api/bridge/msw-handlers';

import { VerificationTabsFromCustomer } from './verification-tabs-from-customer';

const meta = {
  title: 'VerificationTabsFromCustomer',
  component: VerificationTabsFromCustomer,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='size-[700px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VerificationTabsFromCustomer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler],
    },
  },
};
export const TOSComplete: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerTosComplete],
    },
  },
};
export const NeedsPOA: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandlerKycComplete],
    },
  },
};
