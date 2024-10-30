import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceTable } from './invoice-table';
import { sampleInvoices } from './sample-invoices';

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
