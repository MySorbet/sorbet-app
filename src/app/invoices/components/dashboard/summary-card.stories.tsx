import type { Meta, StoryObj } from '@storybook/react';

import SummaryCard from './summary-card';

const meta: Meta<typeof SummaryCard> = {
  title: 'Invoicing/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'sorbet',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

export const Default: Story = {
  args: {
    label: 'Total Open',
    value: 2086.08,
    invoiceCount: 1,
  },
};
export const Long: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: Default.args,
};

export const Overdue: Story = {
  args: {
    label: 'Overdue',
    value: 876.09,
    invoiceCount: 1,
  },
};

export const Paid: Story = {
  args: {
    label: 'Paid',
    value: 12865.09,
    invoiceCount: 8,
  },
};

export const ZeroInvoices: Story = {
  args: {
    label: 'Zero Invoices',
    value: 0,
    invoiceCount: 0,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
