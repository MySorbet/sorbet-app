import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import {
  mockCancelInvoiceHandler,
  mockInvoicesHandler,
  mockPayInvoiceHandler,
} from '@/api/invoices';
import { sampleInvoices } from '@/api/invoices/sample-invoices';
import { useInvoices } from '@/app/invoices/hooks/use-invoices';

import { InvoiceDashboard } from './invoice-dashboard';

const meta: Meta<typeof InvoiceDashboard> = {
  title: 'Invoices/InvoiceDashboard',
  component: InvoiceDashboard,
  parameters: {
    layout: 'fullscreen',
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
      // Mock network calls for fetching invoices, cancelling an invoice, and paying an invoice
      handlers: [
        mockInvoicesHandler,
        mockCancelInvoiceHandler,
        mockPayInvoiceHandler,
      ],
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
