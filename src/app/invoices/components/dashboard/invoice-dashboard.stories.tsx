import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceDashboard } from './invoice-dashboard';
import { sampleInvoices } from './sample-invoices';

const meta: Meta<typeof InvoiceDashboard> = {
  title: 'Invoicing/InvoiceDashboard',
  component: InvoiceDashboard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sorbet',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InvoiceDashboard>;

export const Default: Story = {
  args: {
    invoices: sampleInvoices,
  },
};

export const Empty: Story = {
  args: {
    invoices: [],
  },
};
