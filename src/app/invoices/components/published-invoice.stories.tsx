import { Meta, StoryObj } from '@storybook/react';

import { mockInvoiceHandler } from '@/api/invoices/msw-handlers';
import { sampleInvoices } from '@/api/invoices/sample-invoices';
import { useInvoice } from '@/app/invoices/hooks/use-invoice';

import { PublishedInvoice } from './published-invoice';

type Story = StoryObj<typeof PublishedInvoice>;

const meta = {
  title: 'Invoices/PublishedInvoice',
  component: PublishedInvoice,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PublishedInvoice>;

export default meta;

export const Default: Story = {
  args: {
    invoice: sampleInvoices[0],
  },
};

export const Loading: Story = {
  args: {
    invoice: sampleInvoices[0],
    isLoading: true,
  },
};

export const WithNetworkCall: Story = {
  parameters: {
    msw: {
      handlers: [mockInvoiceHandler],
    },
  },
  render: () => {
    const { data: invoice, isLoading } = useInvoice('arbitrary-id');
    return <PublishedInvoice invoice={invoice} isLoading={isLoading} />;
  },
};
