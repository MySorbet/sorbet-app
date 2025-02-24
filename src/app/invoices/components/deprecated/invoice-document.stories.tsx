import type { Meta, StoryObj } from '@storybook/react';

import { longestMemo, sampleInvoices } from '@/api/invoices/sample-invoices';
import { InvoiceFormData } from '@/app/invoices/components/deprecated/create/invoice-form-context';

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

export const WithTax: Story = {
  args: {
    invoice: {
      ...sampleInvoices[1],
    },
  },
};

const sampleInvoiceFormData: InvoiceFormData = {
  invoiceNumber: 'INV005',
  issueDate: new Date(),
  dueDate: new Date(),
  memo: 'Payment received with thanks',
  fromName: 'Your Company',
  fromEmail: 'billing@yourcompany.com',
  toName: 'Mega Industries',
  toEmail: 'invoices@megaindustries.com',
  projectName: 'AI Research Project',
  items: [
    {
      name: 'AI Algorithm Development',
      quantity: 1,
      amount: 1000.0,
    },
    {
      name: 'Technical Documentation',
      quantity: 5,
      amount: 50.0,
    },
    {
      name: 'Technical Documentation',
      quantity: 5,
      amount: 50.0,
    },
  ],
  tax: 10,
};

export const WithOnlyFormData: Story = {
  args: {
    invoice: sampleInvoiceFormData,
  },
};

export const LongMemo: Story = {
  args: {
    invoice: {
      ...sampleInvoices[0],
      memo: longestMemo,
    },
  },
};
