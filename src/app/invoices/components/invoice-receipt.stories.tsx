import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceReceipt } from './invoice-receipt';

const meta: Meta<typeof InvoiceReceipt> = {
  title: 'Invoices/InvoiceReceipt',
  component: InvoiceReceipt,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sorbet',
    },
  },
  argTypes: {
    status: {
      options: ['paid', 'cancelled'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceReceipt>;

export const Paid: Story = {
  args: {
    status: 'paid',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};
