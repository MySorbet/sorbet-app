import type { Meta } from '@storybook/react';
import { fn } from '@storybook/test';
import { addDays } from 'date-fns';

import { InvoiceForm, PaymentDetailsFormData } from './invoice-form';

type Story = typeof InvoiceForm;

const meta = {
  title: 'Invoices/V2/InvoiceForm',
  component: InvoiceForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
    formData: {
      issueDate: new Date(),
      dueDate: addDays(new Date(), 7),
      memo: '',
    } satisfies PaymentDetailsFormData,
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
    },
  },
};

export const WithLongMemo = {
  args: {
    formData: {
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      memo: 'This is a very long memo that contains multiple lines of text to demonstrate how the textarea handles longer content. It includes payment terms, additional information, and other relevant details that might be important for the invoice recipient.',
    },
  },
};
