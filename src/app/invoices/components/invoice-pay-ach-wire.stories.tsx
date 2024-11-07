import { Meta, StoryObj } from '@storybook/react';

import { InvoicePayAchWire } from './invoice-pay-ach-wire';

const meta = {
  title: 'Invoices/InvoicePayAchWire',
  component: InvoicePayAchWire,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InvoicePayAchWire>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLoading: false,
    routingNumber: '123456789',
    accountNumber: '123456789',
    beneficiary: {
      name: 'John Doe',
      accountType: 'Checking',
      address: '123 Main St, Anytown, USA',
    },
    bank: {
      name: 'Bank of America',
      address: '123 Main St, Anytown, USA',
    },
  },
};
