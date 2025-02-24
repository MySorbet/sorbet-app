import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

import { mockCheckInvoiceNumberHandler } from '@/api/invoices/msw-handlers';

import { InvoiceForm } from '../schema';
import { CreateInvoice } from './create-invoice';

const meta = {
  title: 'Invoices/CreateInvoice',
  component: CreateInvoice,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [mockCheckInvoiceNumberHandler],
    },
  },
} satisfies Meta<typeof CreateInvoice>;

export default meta;
type Story = StoryObj<typeof CreateInvoice>;

const samplePrefills: InvoiceForm = {
  toName: 'John Doe',
  toEmail: 'john.doe@example.com',
  fromName: 'Jane Smith',
  fromEmail: 'jane.smith@example.com',
  issueDate: new Date('2024-03-20'),
  dueDate: addDays(new Date('2024-03-20'), 7),
  memo: 'Sample invoice for development',
  items: [
    {
      name: 'Consulting Services',
      quantity: 10,
      amount: 150,
    },
  ],
  invoiceNumber: 'INV-001',
  tax: 10,
  paymentMethods: ['usdc'],
};

export const Default: Story = {
  args: {},
};

export const WithPrefills: Story = {
  args: {
    prefills: samplePrefills,
  },
};
