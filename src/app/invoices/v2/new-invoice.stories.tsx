import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';

import { NewInvoice } from './new-invoice';

const meta = {
  title: 'Invoices/V2/NewInvoice',
  component: NewInvoice,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<Story>;

export default meta;
type Story = StoryObj<typeof NewInvoice>;

export const Default: Story = {
  args: {},
};

export const WithPrefilledData: Story = {
  args: {
    formData: {
      issueDate: new Date(),
      dueDate: addDays(new Date(), 14),
      memo: 'Payment due within 14 days. Late payments subject to 5% fee.',
      items: [
        {
          name: 'Item 1',
          quantity: 1,
          amount: 100,
        },
      ],
      invoiceNumber: 'INV-123456',
      tax: 10,
    },
  },
};
