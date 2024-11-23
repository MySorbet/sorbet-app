import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import { InvoiceTable } from './invoice-table';

const meta: Meta<typeof InvoiceTable> = {
  title: 'Invoices/InvoiceTable',
  component: InvoiceTable,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sorbet',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceTable>;

export const Default: Story = {
  args: {
    invoices: sampleInvoices,
    onInvoiceClick: fn(),
    onInvoiceStatusChange: fn(),
    onCreateInvoice: fn(),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    invoices: [],
  },
};
