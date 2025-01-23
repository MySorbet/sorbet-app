import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { longestMemo } from '@/api/invoices/sample-invoices';

import { InvoiceFormProvider } from './invoice-form-context';
import { PaymentDetails } from './payment-details';

const meta: Meta<typeof PaymentDetails> = {
  title: 'Invoices/PaymentDetails',
  component: PaymentDetails,
  decorators: [
    (Story) => (
      <InvoiceFormProvider>
        <Story />
      </InvoiceFormProvider>
    ),
  ],
  parameters: {},
  args: {
    onBack: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PaymentDetails>;

export const Default: Story = {};

export const TypeInMemoBox: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const memoInput = canvas.getByLabelText('Memo');

    await userEvent.type(memoInput, longestMemo);
    await expect(memoInput).toHaveValue(longestMemo);
  },
};
