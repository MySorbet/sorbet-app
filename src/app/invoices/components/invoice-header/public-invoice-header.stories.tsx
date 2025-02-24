import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { PublicInvoiceHeader } from './public-invoice-header';

type Story = StoryObj<typeof PublicInvoiceHeader>;

const meta = {
  title: 'Invoices/PublicInvoiceHeader',
  component: PublicInvoiceHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    from: 'John Doe',
    onDownload: fn(),
    onSignUp: fn(),
  },
  argTypes: {},
} satisfies Meta<typeof PublicInvoiceHeader>;

export default meta;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    from: undefined,
  },
};
