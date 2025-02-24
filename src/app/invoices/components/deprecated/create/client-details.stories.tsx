import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ClientDetails } from './client-details';
import { InvoiceFormProvider } from './invoice-form-context';

const meta: Meta<typeof ClientDetails> = {
  title: 'Invoices/ClientDetails',
  component: ClientDetails,
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
    name: 'John Doe',
    email: 'john@example.com',
  },
};

export default meta;
type Story = StoryObj<typeof ClientDetails>;

export const Default: Story = {};
