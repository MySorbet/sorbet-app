import { Meta, StoryObj } from '@storybook/react';

import {
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandlerKycComplete,
  mockBridgeCustomerHandlerTosComplete,
} from '@/api/bridge/msw-handlers';

import { AutomaticVerificationTabs } from './automatic-verification-tabs';

const meta = {
  title: 'Accounts/AutomaticVerificationTabs',
  component: AutomaticVerificationTabs,
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
} satisfies Meta<typeof AutomaticVerificationTabs>;

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
