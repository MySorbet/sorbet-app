import type { Meta, StoryObj } from '@storybook/react';

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
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
