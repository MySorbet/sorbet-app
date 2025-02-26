import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { CreateInvoiceHeader } from './create-invoice-header';

type Story = StoryObj<typeof CreateInvoiceHeader>;

const meta = {
  title: 'Invoices/CreateInvoiceHeader',
  component: CreateInvoiceHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: fn(),
    onSaveDraft: fn(),
    onCreateInvoice: fn(),
  },
  argTypes: {},
} satisfies Meta<typeof CreateInvoiceHeader>;

export default meta;

export const Default: Story = {};

export const Creating: Story = {
  args: {
    isCreating: true,
  },
};
