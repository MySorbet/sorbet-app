import type { Meta, StoryObj } from '@storybook/react';
import { addDays } from 'date-fns';

import { InvoiceFormDecorator } from './invoice-form-decorator';
import { NewInvoiceTab } from './new-invoice-tab';

const meta = {
  title: 'Invoices/NewInvoiceTab',
  component: NewInvoiceTab,
  parameters: {
    layout: 'centered',
  },
  decorators: [InvoiceFormDecorator],
} satisfies Meta<typeof NewInvoiceTab>;

export default meta;
type Story = StoryObj<typeof NewInvoiceTab>;

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
