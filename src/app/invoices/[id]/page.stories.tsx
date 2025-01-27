import { Meta } from '@storybook/react';
import { StoryObj } from '@storybook/react';

import { mockACHWireDetailsHandler } from '@/api/bridge';
import {
  mockCurrentWalletAddressHandler,
  mockInvoiceHandler,
  mockInvoiceNotFoundHandler,
} from '@/api/invoices/msw-handlers';

import InvoicePage from './page';

const meta = {
  title: 'Invoices/Invoice Page',
  component: InvoicePage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'sorbet' },
  },
} satisfies Meta<typeof InvoicePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    params: {
      id: '123',
    },
  },
  parameters: {
    msw: {
      handlers: [
        mockInvoiceHandler,
        mockCurrentWalletAddressHandler,
        mockACHWireDetailsHandler,
      ],
    },
  },
};

export const NotFound: Story = {
  ...Default,
  parameters: {
    msw: {
      handlers: [mockInvoiceNotFoundHandler],
    },
  },
};
