import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { PublishedInvoiceHeader } from './published-invoice-header';

type Story = StoryObj<typeof PublishedInvoiceHeader>;

const meta = {
  title: 'Invoices/V2/PublishedInvoiceHeader',
  component: PublishedInvoiceHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    recipientEmail: 'test@test.com',
    onCopy: fn(),
    onDownload: fn(),
    onSend: fn(),
  },
  argTypes: {},
} satisfies Meta<typeof PublishedInvoiceHeader>;

export default meta;

export const Default: Story = {};
