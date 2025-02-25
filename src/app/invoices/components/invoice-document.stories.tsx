import { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

import { sampleInvoices } from '@/api/invoices/sample-invoices';

import { InvoiceForm } from '../schema';
import { InvoiceDocument } from './invoice-document';

const meta = {
  title: 'Invoices/InvoiceDocument',
  component: InvoiceDocument,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InvoiceDocument>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Example of rendering the InvoiceDocument with a complete Invoice from the database.
 */
export const WithInvoice: Story = {
  args: {
    invoice: sampleInvoices[0],
  },
};

/**
 * Example of rendering the InvoiceDocument with an Invoice that has a project name.
 */
export const WithProjectName: Story = {
  args: {
    invoice: sampleInvoices[1],
  },
};

/**
 * Example of rendering the InvoiceDocument with form data that would be used
 * during the invoice creation process.
 */
export const WithFormData: Story = {
  args: {
    invoice: {
      fromName: 'Your Company',
      fromEmail: 'billing@yourcompany.com',
      toName: 'New Client',
      toEmail: 'client@example.com',
      invoiceNumber: 'INV-2023-001',
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      memo: 'Thank you for your business!',
      items: [
        {
          name: 'Web Development',
          quantity: 1,
          amount: 1500,
        },
        {
          name: 'Design Services',
          quantity: 2,
          amount: 500,
        },
      ],
      tax: 10,
      paymentMethods: ['usdc', 'usd'],
    } satisfies InvoiceForm,
  },
};
