import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceControls } from './invoice-controls';
import { InvoiceFormDecorator } from './invoice-form-decorator';

const meta = {
  title: 'Invoices/InvoiceControls',
  component: InvoiceControls,
  parameters: {
    layout: 'centered',
  },
  decorators: [InvoiceFormDecorator],
} satisfies Meta<typeof InvoiceControls>;

export default meta;
type Story = StoryObj<typeof InvoiceControls>;

export const Default: Story = {};

export const Unverified: Story = {
  args: {
    onGetVerified: fn(),
  },
};
