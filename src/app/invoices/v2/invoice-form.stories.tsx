import type { Meta } from '@storybook/react';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';

import { InvoiceForm } from './invoice-form';

type Story = typeof InvoiceForm;

const meta = {
  title: 'Invoices/V2/InvoiceForm',
  component: InvoiceForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<Story>;

export default meta;

export const Default = {
  args: {},
};

export const WithPrefilledData = {
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
