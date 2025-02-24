import type { Meta, StoryObj } from '@storybook/react';

import { mockACHWireDetailsHandler } from '@/api/bridge';
import {
  mockCurrentWalletAddressHandler,
  mockInvoiceHandler,
} from '@/api/invoices';
import { sampleInvoices } from '@/api/invoices/sample-invoices';
import { useInvoice } from '@/app/invoices/hooks/use-invoice';

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
    invoice: sampleInvoices[2],
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

export const Freelancer: Story = {
  args: {
    ...Default.args,
    isFreelancer: true,
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
    const { data: invoice, isLoading } = useInvoice('123');
    return <InvoicePublicView invoice={invoice} isLoading={isLoading} />;
  },
};
