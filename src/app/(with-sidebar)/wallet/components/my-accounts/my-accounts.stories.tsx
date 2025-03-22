import { Meta, StoryObj } from '@storybook/react';

import {
  mockACHWireDetailsHandler,
  mockBridgeCustomerHandler,
  mockBridgeCustomerHandlerKycComplete,
} from '@/api/bridge';

import { MyAccounts } from './my-accounts';

const meta = {
  title: 'Wallet/MyAccounts',
  component: MyAccounts,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MyAccounts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        mockACHWireDetailsHandler,
        mockBridgeCustomerHandlerKycComplete,
      ],
    },
  },
};

export const NotVerified: Story = {
  parameters: {
    msw: {
      handlers: [mockBridgeCustomerHandler],
    },
  },
};
