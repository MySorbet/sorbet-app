import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';

import { CreateInvoice } from './create-invoice';
import { InvoiceFormData } from './schema';

type Story = StoryObj<typeof CreateInvoice>;

const meta = {
  title: 'Invoices/V2/CreateInvoice',
  component: CreateInvoice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateInvoice>;

export default meta;

const samplePrefills: InvoiceFormData = {
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
  invoiceNumber: 'INV-2024-001',
  tax: 10,
};

export const Default: Story = {
  args: {},
};

export const WithPrefills: Story = {
  args: {
    prefills: samplePrefills,
  },
};

export const EmptyForm: Story = {
  args: {
    prefills: undefined,
  },
};
