import type { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { mapToACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';

import { ClientPaymentCard } from './client-payment-card';

type Story = StoryObj<typeof ClientPaymentCard>;

const meta = {
  title: 'Invoices/ClientPaymentCard',
  component: ClientPaymentCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-96'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ClientPaymentCard>;

export default meta;

const account = mockBridgeCustomer.virtual_account
  ? mapToACHWireDetails(
      mockBridgeCustomer.virtual_account.source_deposit_instructions
    )
  : undefined;

export const Default: Story = {
  args: {
    address: '0x1234567890123456789012345678901234567890',
    account: account,
    dueDate: new Date('2024-04-15'),
  },
};

export const Loading: Story = {
  args: {
    dueDate: undefined,
  },
};

export const USDOnly: Story = {
  args: {
    account: account,
    dueDate: new Date('2024-04-15'),
  },
};

export const USDCOnly: Story = {
  args: {
    address: '0x1234567890123456789012345678901234567890',
    dueDate: new Date('2024-04-15'),
  },
};
