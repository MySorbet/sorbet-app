import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import { InvoiceReview } from './invoice-review';

const meta: Meta<typeof InvoiceReview> = {
  title: 'Invoices/InvoiceReview',
  component: InvoiceReview,
  parameters: {
    layout: 'centered',
  },
  args: {
    onCreate: fn(),
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceReview>;

export const Default: Story = {
  args: {
    invoice: sampleInvoices[0],
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};
