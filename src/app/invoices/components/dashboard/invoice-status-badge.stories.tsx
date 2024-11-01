import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { InvoiceStatus } from '@/app/invoices/components/dashboard/utils';

import { InvoiceStatusBadge } from './invoice-status-badge';

const meta = {
  title: 'Invoices/InvoiceStatusBadge',
  component: InvoiceStatusBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    interactive: false,
    onValueChange: fn(),
  },
} satisfies Meta<typeof InvoiceStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Interactive',
  args: {
    interactive: true,
    variant: 'Open',
  },
  render: (args) => {
    const [{ variant }, updateArgs] = useArgs();
    const handleValueChange = (value: InvoiceStatus) => {
      updateArgs({ variant: value });
    };
    return (
      <InvoiceStatusBadge
        {...args}
        variant={variant}
        onValueChange={handleValueChange}
      />
    );
  },
};

export const Open: Story = {
  args: {
    variant: 'Open',
  },
};

export const Cancelled: Story = {
  args: {
    variant: 'Cancelled',
  },
};

export const Paid: Story = {
  args: {
    variant: 'Paid',
  },
};

export const Overdue: Story = {
  args: {
    variant: 'Overdue',
  },
};
