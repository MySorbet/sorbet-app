import { Meta, StoryObj } from '@storybook/react';

import { mockInvoicesHandler, mockPayInvoiceHandler } from '@/api/invoices';
import { mockCancelInvoiceHandler } from '@/api/invoices';

import InvoicesPage from './page';

const meta = {
  title: 'Invoices/Invoices Page',
  component: InvoicesPage,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: [
        mockInvoicesHandler,
        mockCancelInvoiceHandler,
        mockPayInvoiceHandler,
      ],
    },
  },
} satisfies Meta<typeof InvoicesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
