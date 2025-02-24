import { Meta, StoryObj } from '@storybook/react';

import { mockACHWireDetailsHandler } from '@/api/bridge/msw-handlers';
import { mockInvoiceHandler } from '@/api/invoices/msw-handlers';
import { mockCurrentWalletAddressHandler } from '@/api/invoices/msw-handlers';
import { sampleInvoices } from '@/api/invoices/sample-invoices';
import { useInvoice } from '@/app/invoices/hooks/use-invoice';

import { PublicInvoice } from './public-invoice';

const meta = {
  title: 'Invoices/PublicInvoice',
  component: PublicInvoice,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    invoice: sampleInvoices[2],
  },
} satisfies Meta<typeof PublicInvoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Paid: Story = {
  args: {
    invoice: sampleInvoices[0],
  },
};

export const Cancelled: Story = {
  args: {
    invoice: sampleInvoices[4],
  },
};

export const InvoiceNotFound: Story = {
  args: {
    invoice: undefined,
    isError: true,
  },
};

export const Loading: Story = {
  args: {
    invoice: undefined,
    isLoading: true,
  },
};

export const WithNetworkCall: Story = {
  parameters: {
    msw: {
      handlers: [
        mockInvoiceHandler,
        mockCurrentWalletAddressHandler,
        mockACHWireDetailsHandler,
      ],
    },
  },
  render: () => {
    const { data: invoice, isLoading, isError } = useInvoice('arbitrary-id');
    return (
      <PublicInvoice
        invoice={invoice}
        isLoading={isLoading}
        isError={isError}
      />
    );
  },
};
