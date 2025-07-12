import { Meta, StoryObj } from '@storybook/react';

import {
  mockACHWireDetailsHandler,
  mockBridgeCustomerHandler,
} from '@/api/bridge';

import { AccountsPageContent } from './accounts-page-content';

const meta = {
  title: 'Accounts/AccountsPageContent',
  component: AccountsPageContent,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [mockBridgeCustomerHandler, mockACHWireDetailsHandler],
    },
  },
} satisfies Meta<typeof AccountsPageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
