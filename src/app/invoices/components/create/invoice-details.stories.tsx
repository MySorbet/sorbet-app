import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceDetails } from './invoice-details';
import { InvoiceFormProvider } from './invoice-form-context';

const meta: Meta<typeof InvoiceDetails> = {
  title: 'Invoices/InvoiceDetails',
  component: InvoiceDetails,
  decorators: [
    (Story) => (
      <InvoiceFormProvider>
        <Story />
      </InvoiceFormProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    onSubmit: fn(),
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceDetails>;

export const Default: Story = {};

export const WithInvoiceNumber: Story = {
  args: {
    invoiceNumber: 'INV-123',
  },
};
