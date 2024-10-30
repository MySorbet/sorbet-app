import type { Meta, StoryObj } from '@storybook/react';

import { sampleInvoices } from './dashboard/sample-invoices';
import { InvoiceDocument } from './invoice-document';

const meta: Meta<typeof InvoiceDocument> = {
  title: 'Invoices/InvoiceDocument',
  component: InvoiceDocument,
  parameters: {
    layout: 'centered',
    background: {
      default: 'sorbet',
    },
  },
  args: {
    invoice: sampleInvoices[0],
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceDocument>;
export const Default: Story = {};
