import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { mockCancelInvoiceHandler, mockInvoicesHandler } from '@/api/invoices';
import { useInvoices } from '@/app/invoices/hooks/useInvoices';

import { InvoiceDashboard } from './invoice-dashboard';
import { sampleInvoices } from './sample-invoices';

const meta: Meta<typeof InvoiceDashboard> = {
  title: 'Invoices/InvoiceDashboard',
  component: InvoiceDashboard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sorbet',
    },
  },
  args: {
    onCreateNew: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceDashboard>;

export const Default: Story = {
  args: {
    invoices: sampleInvoices,
  },
};

export const WithNetworkCall: Story = {
  parameters: {
    msw: {
      // Mock network calls for fetching invoices and cancelling an invoice
      handlers: [mockInvoicesHandler, mockCancelInvoiceHandler],
    },
  },
  render: () => {
    const { data, isLoading } = useInvoices();
    return (
      <InvoiceDashboard
        onCreateNew={fn()}
        invoices={data ?? []}
        isLoading={isLoading}
      />
    );
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    invoices: [],
  },
};
