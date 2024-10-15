import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceFormProvider } from './invoice-form-context';
import { PaymentDetails } from './payment-details';

const meta: Meta<typeof PaymentDetails> = {
  title: 'Invoicing/PaymentDetails',
  component: PaymentDetails,
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
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PaymentDetails>;

export const Default: Story = {};
