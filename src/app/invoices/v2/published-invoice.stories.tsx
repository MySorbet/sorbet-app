import { Meta, StoryObj } from '@storybook/react';

import { PublishedInvoice } from './published-invoice';

type Story = StoryObj<typeof PublishedInvoice>;

const meta = {
  title: 'Invoices/V2/PublishedInvoice',
  component: PublishedInvoice,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PublishedInvoice>;

export default meta;

export const mockInvoice = {
  invoiceNumber: 'INV-001',
  toEmail: 'client@example.com',
  toName: 'John Doe',
  fromName: 'Jane Smith',
  fromEmail: 'jane@business.com',
  items: [
    {
      name: 'Web Development',
      quantity: 1,
      amount: 1000,
    },
  ],
  dueDate: new Date('2024-04-01'),
  issueDate: new Date('2024-03-01'),
  memo: 'Thank you for your business',
  tax: 10,
  paymentMethods: ['usdc' as const],
};

export const Default: Story = {
  args: {
    invoice: mockInvoice,
  },
};
