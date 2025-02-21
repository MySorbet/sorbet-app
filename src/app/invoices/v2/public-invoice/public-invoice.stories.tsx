import { Meta, StoryObj } from '@storybook/react';

import { PublicInvoice } from './public-invoice';
import { mockInvoice } from '../published-invoice.stories';

const meta = {
  title: 'Invoices/V2/PublicInvoice',
  component: PublicInvoice,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    invoice: mockInvoice,
  },
} satisfies Meta<typeof PublicInvoice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
