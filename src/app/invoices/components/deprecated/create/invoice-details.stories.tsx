import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockCheckInvoiceNumberHandler } from '@/api/invoices/msw-handlers';
import { useInvoiceNumber } from '@/app/invoices/hooks/use-invoice-number';

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
  parameters: {},
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

export const WithInvoiceNumberFromHook: Story = {
  parameters: {
    msw: [mockCheckInvoiceNumberHandler],
  },
  render: () => {
    const invoiceNumber = useInvoiceNumber();
    return <InvoiceDetails invoiceNumber={invoiceNumber} />;
  },
};
