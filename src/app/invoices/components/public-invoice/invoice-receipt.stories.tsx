import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceReceipt } from './invoice-receipt';

const meta = {
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
      options: ['Paid', 'Cancelled'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof InvoiceReceipt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paid: Story = {
  args: {
    status: 'Paid',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'Cancelled',
  },
};

export const Error: Story = {
  args: {
    status: 'Error',
  },
};
