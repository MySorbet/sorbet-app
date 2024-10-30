import type { Meta, StoryObj } from '@storybook/react';

import { sampleInvoices } from './dashboard/sample-invoices';
import { InvoicePublicView } from './invoice-public-view';

const meta: Meta<typeof InvoicePublicView> = {
  title: 'Invoices/InvoicePublicView',
  component: InvoicePublicView,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'sorbet',
    },
  },
};

export default meta;
type Story = StoryObj<typeof InvoicePublicView>;

export const Default: Story = {
  args: {
    invoice: sampleInvoices[0],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const NoInvoice: Story = {
  args: {
    isLoading: false,
  },
};
