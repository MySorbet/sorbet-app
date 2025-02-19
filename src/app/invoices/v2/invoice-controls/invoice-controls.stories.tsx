import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceControls } from './invoice-controls';

const meta = {
  title: 'Invoices/V2/InvoiceControls',
  component: InvoiceControls,
  parameters: {
    layout: 'centered',
  },
  args: {},
  argTypes: {},
} satisfies Meta<typeof InvoiceControls>;

export default meta;
type Story = StoryObj<typeof InvoiceControls>;

export const Default: Story = {
  args: {},
};
