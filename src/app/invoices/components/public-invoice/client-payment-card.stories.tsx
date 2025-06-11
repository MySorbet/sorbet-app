import type { Meta, StoryObj } from '@storybook/react';

import { mockBridgeCustomer } from '@/api/bridge/mock-bridge-customer';
import { mapToACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';

import { ClientPaymentCard } from './client-payment-card';

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
type Story = StoryObj<typeof meta>;

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

export const NoDate: Story = {
  args: {
    ...Default.args,
    dueDate: undefined,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const USDOnly: Story = {
  args: {
    ...Default.args,
    address: undefined,
  },
};

export const USDCOnly: Story = {
  args: {
    ...Default.args,
    account: undefined,
  },
};
